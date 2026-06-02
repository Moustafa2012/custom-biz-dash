/**
 * Synex domain types.
 *
 * The financial model is built on three append-only primitives:
 *   - Posting       : one leg of a double-entry transaction (debit OR credit)
 *   - AuditEvent    : append-only log of who did what to which entity
 *   - TransferStatus: explicit FSM over the transfer lifecycle
 *
 * All mutations go through the TransactionEngine, which emits a Batch of
 * primitive mutations that the reducer applies atomically.
 */

import type { Account, Beneficiary, Transfer, JournalEntry } from '../data/mock'

// ─── Double-entry primitives ─────────────────────────────────────────────────

/**
 * A single leg of a double-entry transaction. Every business event produces
 * a balanced pair (or n-tuple) of Postings whose debits equal credits per
 * currency. Postings are append-only — to correct a mistake you post a
 * reversing entry, never mutate or delete.
 */
export interface Posting {
  id: string
  /** Group ID; all postings of one logical transaction share this. */
  batchId: string
  /** ISO timestamp. Distinct from value date. */
  postedAt: string
  /** Real account id OR virtual clearing account (see clearing.ts). */
  accountId: string
  side: 'debit' | 'credit'
  amount: number
  currency: string
  /** Optional FX rate to base currency at posting time. */
  fxRate?: number
  /** Business reference (transfer id, journal entry id, etc.). */
  reference?: string
  /** If this posting voids another, the original posting id. */
  reverses?: string
  memo?: string
}

// ─── Audit ───────────────────────────────────────────────────────────────────

export type AuditEntityType =
  | 'transfer'
  | 'account'
  | 'beneficiary'
  | 'journal_entry'
  | 'posting'

export interface AuditEvent {
  id: string
  at: string
  actor: string
  action: string
  entityType: AuditEntityType
  entityId: string
  /** Shallow before/after diff. Omitted for create/delete. */
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  /** Free-form context (e.g. fsm transition name). */
  meta?: Record<string, unknown>
}

// ─── Transfer FSM ────────────────────────────────────────────────────────────

export const TRANSFER_STATES = [
  'draft',
  'pending_approval',
  'approved',
  'sent',
  'settled',
  'rejected',
  'cancelled',
  'voided',
  'failed',
] as const

export type TransferStatus = (typeof TRANSFER_STATES)[number]

export type TransferTransition =
  | 'submit'      // draft -> pending_approval
  | 'approve'     // pending_approval -> approved
  | 'reject'      // pending_approval -> rejected
  | 'cancel'      // draft|pending_approval|approved -> cancelled
  | 'send'        // approved -> sent
  | 'settle'      // sent -> settled
  | 'fail'        // sent -> failed
  | 'void'        // settled -> voided (posts reversing entries)

// ─── Engine commands ─────────────────────────────────────────────────────────

export type EngineCommand =
  | { kind: 'transfer.submit'; transferId: string }
  | { kind: 'transfer.approve'; transferId: string }
  | { kind: 'transfer.reject'; transferId: string; reason: string }
  | { kind: 'transfer.cancel'; transferId: string; reason?: string }
  | { kind: 'transfer.send'; transferId: string }
  | { kind: 'transfer.settle'; transferId: string; fxRate?: number }
  | { kind: 'transfer.fail'; transferId: string; reason: string }
  | { kind: 'transfer.void'; transferId: string; reason: string }
  | { kind: 'journal.post'; entry: Omit<JournalEntry, 'id' | 'createdAt' | 'entryNumber'> & { counterAccountId: string } }

// ─── Mutations & Batch ───────────────────────────────────────────────────────

export type Mutation =
  | { type: 'POSTING_APPEND'; payload: Posting }
  | { type: 'TRANSFER_PATCH'; payload: { id: string; patch: Partial<Transfer> } }
  | { type: 'ACCOUNT_PATCH'; payload: { id: string; patch: Partial<Account> } }
  | { type: 'BENEFICIARY_PATCH'; payload: { id: string; patch: Partial<Beneficiary> } }
  | { type: 'JOURNAL_APPEND'; payload: JournalEntry }
  | { type: 'AUDIT_APPEND'; payload: AuditEvent }

export interface Batch {
  id: string
  at: string
  actor: string
  command: EngineCommand['kind']
  mutations: Mutation[]
}

// ─── Engine result ───────────────────────────────────────────────────────────

export class EngineError extends Error {
  constructor(public readonly code: EngineErrorCode, message: string, public readonly context?: Record<string, unknown>) {
    super(message)
    this.name = 'EngineError'
  }
}

export type EngineErrorCode =
  | 'ENTITY_NOT_FOUND'
  | 'ILLEGAL_TRANSITION'
  | 'INSUFFICIENT_BALANCE'
  | 'CURRENCY_MISMATCH'
  | 'UNBALANCED_BATCH'
  | 'GUARD_FAILED'
  | 'IDEMPOTENT_DUPLICATE'
