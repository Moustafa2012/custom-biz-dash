/**
 * Transaction Engine.
 *
 * Pure function: (state, command, actor) -> Batch | EngineError.
 *
 * The engine never mutates state. It returns a Batch describing the
 * primitive mutations to apply. The store's reducer applies the batch
 * atomically inside one dispatch, so a state that contains "transfer sent"
 * also contains the corresponding postings and audit row, or neither.
 *
 * Double-entry invariant: for every command, Σ(debits) == Σ(credits) per
 * currency. Use `isBalanced()` from selectors.ts in tests to verify.
 */

import type { Account, JournalEntry, Transfer } from '../data/mock'
import {
  EngineError,
  type Batch,
  type EngineCommand,
  type Mutation,
  type Posting,
  type TransferTransition,
} from './types'
import { canTransition, nextStatus } from './fsm'
import { externalCounterparty, feesAccount, transfersInFlight } from './clearing'
import { getAccountBalance } from './selectors'

export interface EngineState {
  accounts: Account[]
  transfers: Transfer[]
  postings: Posting[]
  journalEntries: JournalEntry[]
}

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const now = () => new Date().toISOString()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findTransfer(state: EngineState, id: string): Transfer {
  const t = state.transfers.find((x) => x.id === id)
  if (!t) throw new EngineError('ENTITY_NOT_FOUND', `Transfer ${id} not found`)
  return t
}

function findAccount(state: EngineState, id: string): Account {
  const a = state.accounts.find((x) => x.id === id)
  if (!a) throw new EngineError('ENTITY_NOT_FOUND', `Account ${id} not found`)
  return a
}

function transition(
  state: EngineState,
  transfer: Transfer,
  t: TransferTransition,
  actor: string,
): { patch: Partial<Transfer>; auditAction: string } {
  const ctx = {
    transfer,
    actor,
    sourceBalance:
      transfer.sourceAccountId
        ? getAccountBalance(state.accounts.find((a) => a.id === transfer.sourceAccountId), state.postings)
        : undefined,
  }
  const ok = canTransition(transfer.status, t, ctx)
  if (ok !== true) throw new EngineError(ok.startsWith('Illegal') ? 'ILLEGAL_TRANSITION' : 'GUARD_FAILED', ok)
  const next = nextStatus(transfer.status, t)!
  return { patch: { status: next, updatedAt: new Date() }, auditAction: `transfer.${t}` }
}

function pair(
  batchId: string,
  debit: { accountId: string; amount: number; currency: string; memo?: string },
  credit: { accountId: string; amount: number; currency: string; memo?: string },
  reference?: string,
): Posting[] {
  const at = now()
  return [
    { id: uuid(), batchId, postedAt: at, side: 'debit', reference, ...debit },
    { id: uuid(), batchId, postedAt: at, side: 'credit', reference, ...credit },
  ]
}

function auditMutation(
  actor: string,
  action: string,
  entityType: Parameters<typeof Object>[0] extends never ? never : 'transfer' | 'account' | 'beneficiary' | 'journal_entry' | 'posting',
  entityId: string,
  before?: Record<string, unknown>,
  after?: Record<string, unknown>,
  meta?: Record<string, unknown>,
): Mutation {
  return {
    type: 'AUDIT_APPEND',
    payload: {
      id: uuid(),
      at: now(),
      actor,
      action,
      entityType,
      entityId,
      before,
      after,
      meta,
    },
  }
}

// ─── Command handlers ────────────────────────────────────────────────────────

function handleTransferTransition(
  state: EngineState,
  cmd: Extract<EngineCommand, { kind: `transfer.${TransferTransition}` }>,
  actor: string,
): Batch {
  const transition_ = cmd.kind.split('.')[1] as TransferTransition
  const transfer = findTransfer(state, cmd.transferId)
  const { patch, auditAction } = transition(state, transfer, transition_, actor)

  const batchId = uuid()
  const mutations: Mutation[] = []
  const postings: Posting[] = []

  // Side-effects per transition
  if (transition_ === 'send') {
    // Debit source customer account, credit "in-flight" clearing
    postings.push(
      ...pair(
        batchId,
        { accountId: transfer.sourceAccountId, amount: transfer.amount, currency: transfer.currency, memo: `Send ${transfer.referenceNumber}` },
        { accountId: transfersInFlight(transfer.currency), amount: transfer.amount, currency: transfer.currency },
        transfer.id,
      ),
    )
    patch.sentAt = new Date()
  } else if (transition_ === 'settle') {
    // Move from in-flight to external counterparty
    postings.push(
      ...pair(
        batchId,
        { accountId: transfersInFlight(transfer.currency), amount: transfer.amount, currency: transfer.currency },
        { accountId: externalCounterparty(transfer.currency), amount: transfer.amount, currency: transfer.currency, memo: `Settle ${transfer.referenceNumber}` },
        transfer.id,
      ),
    )
  } else if (transition_ === 'fail') {
    // Reverse the in-flight: credit source, debit in-flight
    postings.push(
      ...pair(
        batchId,
        { accountId: transfersInFlight(transfer.currency), amount: transfer.amount, currency: transfer.currency },
        { accountId: transfer.sourceAccountId, amount: transfer.amount, currency: transfer.currency, memo: `Fail/return ${transfer.referenceNumber}` },
        transfer.id,
      ),
    )
  } else if (transition_ === 'void') {
    // Reverse a settled transfer: credit source, debit external
    postings.push(
      ...pair(
        batchId,
        { accountId: externalCounterparty(transfer.currency), amount: transfer.amount, currency: transfer.currency },
        { accountId: transfer.sourceAccountId, amount: transfer.amount, currency: transfer.currency, memo: `Void ${transfer.referenceNumber}` },
        transfer.id,
      ),
    )
  }

  for (const p of postings) mutations.push({ type: 'POSTING_APPEND', payload: p })

  mutations.push({ type: 'TRANSFER_PATCH', payload: { id: transfer.id, patch } })
  mutations.push(
    auditMutation(
      actor,
      auditAction,
      'transfer',
      transfer.id,
      { status: transfer.status },
      { status: patch.status },
      { transition: transition_, reason: 'reason' in cmd ? cmd.reason : undefined, batchId },
    ),
  )

  return { id: batchId, at: now(), actor, command: cmd.kind, mutations }
}

function handleJournalPost(
  _state: EngineState,
  cmd: Extract<EngineCommand, { kind: 'journal.post' }>,
  actor: string,
): Batch {
  const { counterAccountId, ...entryBase } = cmd.entry
  if (!counterAccountId) throw new EngineError('UNBALANCED_BATCH', 'journal.post requires counterAccountId')
  if (counterAccountId === entryBase.accountId) throw new EngineError('GUARD_FAILED', 'counterAccountId must differ')

  const batchId = uuid()
  const id = uuid()
  const entryNumber = `JE-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
  const entry: JournalEntry = {
    ...entryBase,
    id,
    entryNumber,
    createdAt: new Date(),
  }

  // Determine debit/credit by transactionType
  const isInflow =
    entryBase.transactionType === 'deposit' || entryBase.transactionType === 'settlement'
  const debit = isInflow ? counterAccountId : entryBase.accountId
  const credit = isInflow ? entryBase.accountId : counterAccountId

  const postings = pair(
    batchId,
    { accountId: debit, amount: entryBase.amount, currency: entryBase.currency, memo: entryBase.description },
    { accountId: credit, amount: entryBase.amount, currency: entryBase.currency, memo: entryBase.description },
    id,
  )

  return {
    id: batchId,
    at: now(),
    actor,
    command: cmd.kind,
    mutations: [
      ...postings.map<Mutation>((p) => ({ type: 'POSTING_APPEND', payload: p })),
      { type: 'JOURNAL_APPEND', payload: entry },
      auditMutation(actor, 'journal.post', 'journal_entry', id, undefined, { ...entry }, { batchId }),
    ],
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function plan(state: EngineState, command: EngineCommand, actor: string): Batch {
  switch (command.kind) {
    case 'transfer.submit':
    case 'transfer.approve':
    case 'transfer.reject':
    case 'transfer.cancel':
    case 'transfer.send':
    case 'transfer.settle':
    case 'transfer.fail':
    case 'transfer.void':
      return handleTransferTransition(state, command, actor)
    case 'journal.post':
      return handleJournalPost(state, command, actor)
    default: {
      const _exhaustive: never = command
      throw new EngineError('GUARD_FAILED', `Unknown command: ${JSON.stringify(_exhaustive)}`)
    }
  }
}

/** Unused — fee posting helper kept for future fee-schedule work. */
export function buildFeePosting(batchId: string, accountId: string, fee: number, currency: string, reference?: string): Posting[] {
  if (fee <= 0) return []
  return pair(
    batchId,
    { accountId, amount: fee, currency, memo: 'Bank fee' },
    { accountId: feesAccount(currency), amount: fee, currency },
    reference,
  )
}
