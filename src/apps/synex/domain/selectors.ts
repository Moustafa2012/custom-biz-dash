/**
 * Pure selectors over store state. Components should consume these instead
 * of reading raw collections so the underlying schema can evolve.
 */

import type { Account } from '../data/mock'
import type { AuditEvent, Posting } from './types'
import { isClearing } from './clearing'

export interface LedgerView {
  postings: Posting[]
  /** Running balance after each posting (same order as postings). */
  runningBalances: number[]
  closingBalance: number
}

/**
 * Derived balance = openingBalance + Σ(credit) - Σ(debit), in the account's
 * currency. Treats Account.currentBalance as the opening balance when no
 * explicit openingBalance is recorded (back-compat with mock seed).
 */
export function getAccountBalance(account: Account | undefined, postings: Posting[]): number {
  if (!account) return 0
  const opening =
    typeof (account as Account & { openingBalance?: number }).openingBalance === 'number'
      ? (account as Account & { openingBalance?: number }).openingBalance!
      : account.currentBalance
  let bal = opening
  for (const p of postings) {
    if (p.accountId !== account.id) continue
    if (p.currency !== account.currency) continue
    bal += p.side === 'credit' ? p.amount : -p.amount
  }
  return bal
}

export function getAccountLedger(account: Account | undefined, postings: Posting[]): LedgerView {
  if (!account) return { postings: [], runningBalances: [], closingBalance: 0 }
  const opening =
    typeof (account as Account & { openingBalance?: number }).openingBalance === 'number'
      ? (account as Account & { openingBalance?: number }).openingBalance!
      : account.currentBalance
  const filtered = postings
    .filter((p) => p.accountId === account.id && p.currency === account.currency)
    .slice()
    .sort((a, b) => a.postedAt.localeCompare(b.postedAt))
  const running: number[] = []
  let bal = opening
  for (const p of filtered) {
    bal += p.side === 'credit' ? p.amount : -p.amount
    running.push(bal)
  }
  return { postings: filtered, runningBalances: running, closingBalance: bal }
}

export function getTransferAudit(transferId: string, events: AuditEvent[]): AuditEvent[] {
  return events
    .filter((e) => e.entityType === 'transfer' && e.entityId === transferId)
    .slice()
    .sort((a, b) => a.at.localeCompare(b.at))
}

/** Sum debits/credits per currency for a slice of postings — reconciliation. */
export function reconcilePostings(postings: Posting[]): Record<string, { debit: number; credit: number; net: number }> {
  const out: Record<string, { debit: number; credit: number; net: number }> = {}
  for (const p of postings) {
    const row = (out[p.currency] ||= { debit: 0, credit: 0, net: 0 })
    if (p.side === 'debit') row.debit += p.amount
    else row.credit += p.amount
    row.net = row.credit - row.debit
  }
  return out
}

/** True if a batch is balanced (debits == credits per currency, including clearing). */
export function isBalanced(batch: Posting[]): boolean {
  const r = reconcilePostings(batch)
  return Object.values(r).every((v) => Math.abs(v.net) < 0.005)
}

export { isClearing }
