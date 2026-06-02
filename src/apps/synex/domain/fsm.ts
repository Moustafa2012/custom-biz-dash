/**
 * Transfer finite-state machine.
 *
 * The transition matrix is the single source of truth for what state changes
 * are legal. UI buttons should derive their `disabled` state from
 * `canTransition(...)` rather than hard-coding logic.
 */

import type { Transfer } from '../data/mock'
import type { TransferStatus, TransferTransition } from './types'

/** Allowed transitions: from -> transition -> to */
export const TRANSFER_FSM: Record<TransferStatus, Partial<Record<TransferTransition, TransferStatus>>> = {
  draft: {
    submit: 'pending_approval',
    cancel: 'cancelled',
  },
  pending_approval: {
    approve: 'approved',
    reject: 'rejected',
    cancel: 'cancelled',
  },
  approved: {
    send: 'sent',
    cancel: 'cancelled',
  },
  sent: {
    settle: 'settled',
    fail: 'failed',
  },
  settled: {
    void: 'voided',
  },
  rejected: {},
  cancelled: {},
  voided: {},
  failed: {},
}

export interface TransitionGuardContext {
  transfer: Transfer
  actor: string
  /** Total balance available on source account (derived). */
  sourceBalance?: number
}

export type GuardFn = (ctx: TransitionGuardContext) => true | string

const guards: Partial<Record<TransferTransition, GuardFn>> = {
  approve: ({ transfer, actor }) =>
    transfer.createdBy && transfer.createdBy === actor
      ? 'Approver must differ from creator (four-eyes)'
      : true,
  send: ({ transfer, sourceBalance }) =>
    sourceBalance !== undefined && sourceBalance < transfer.amount
      ? `Insufficient balance (have ${sourceBalance}, need ${transfer.amount})`
      : true,
}

export function canTransition(
  from: TransferStatus | string,
  transition: TransferTransition,
  ctx?: TransitionGuardContext,
): true | string {
  const next = TRANSFER_FSM[from as TransferStatus]?.[transition]
  if (!next) return `Illegal transition: ${from} --${transition}-->`
  const guard = guards[transition]
  if (guard && ctx) {
    const ok = guard(ctx)
    if (ok !== true) return ok
  }
  return true
}

export function nextStatus(from: TransferStatus | string, transition: TransferTransition): TransferStatus | null {
  return TRANSFER_FSM[from as TransferStatus]?.[transition] ?? null
}

/** Map FSM transition -> human label (used by UI). */
export const TRANSITION_LABELS: Record<TransferTransition, { en: string; ar: string }> = {
  submit:  { en: 'Submit for approval', ar: 'إرسال للموافقة' },
  approve: { en: 'Approve',             ar: 'موافقة' },
  reject:  { en: 'Reject',              ar: 'رفض' },
  cancel:  { en: 'Cancel',              ar: 'إلغاء' },
  send:    { en: 'Send to bank',        ar: 'إرسال للبنك' },
  settle:  { en: 'Mark settled',        ar: 'تأكيد التسوية' },
  fail:    { en: 'Mark failed',         ar: 'تأشير كفاشل' },
  void:    { en: 'Void (reverse)',      ar: 'إبطال (عكسي)' },
}
