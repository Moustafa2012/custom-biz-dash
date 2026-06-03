import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  IconCheck, IconX, IconSend, IconCircleCheck, IconAlertTriangle,
  IconArrowBackUp, IconBan, IconUpload,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { t } from '@/lib/translations'
import { useAuth } from '@/contexts/auth-context'
import { useSynex } from '../store/synex-store'
import {
  TRANSFER_FSM, TRANSITION_LABELS, canTransition,
  EngineError, type TransferTransition,
} from '../domain'
import type { Transfer } from '../data/mock'
import { getAccountBalance } from '../domain/selectors'

interface TransferActionsProps {
  transfer: Transfer
  /** "row" = compact icon buttons; "panel" = full-width labelled buttons. */
  variant?: 'row' | 'panel'
  onAfter?: (transition: TransferTransition) => void
}

const ICONS: Record<TransferTransition, React.ReactNode> = {
  submit:  <IconUpload     className="h-4 w-4" />,
  approve: <IconCheck      className="h-4 w-4" />,
  reject:  <IconX          className="h-4 w-4" />,
  cancel:  <IconBan        className="h-4 w-4" />,
  send:    <IconSend       className="h-4 w-4" />,
  settle:  <IconCircleCheck className="h-4 w-4" />,
  fail:    <IconAlertTriangle className="h-4 w-4" />,
  void:    <IconArrowBackUp className="h-4 w-4" />,
}

const VARIANTS: Record<TransferTransition, 'default' | 'outline' | 'destructive' | 'secondary'> = {
  submit:  'default',
  approve: 'default',
  reject:  'destructive',
  cancel:  'outline',
  send:    'default',
  settle:  'default',
  fail:    'destructive',
  void:    'destructive',
}

const REQUIRES_REASON: TransferTransition[] = ['reject', 'fail', 'void']

export function TransferActions({ transfer, variant = 'row', onAfter }: TransferActionsProps) {
  const { execute, state } = useSynex()
  const { user } = useAuth()
  const navigate = useNavigate()
  const actor = user?.email ?? 'demo-user'

  const [pending, setPending] = useState<TransferTransition | null>(null)
  const [reason, setReason] = useState('')

  const sourceBalance = useMemo(
    () => getAccountBalance(
      state.accounts.find((a) => a.id === transfer.sourceAccountId),
      state.postings,
    ),
    [state.accounts, state.postings, transfer.sourceAccountId],
  )

  const available = useMemo(() => {
    const map = TRANSFER_FSM[transfer.status as keyof typeof TRANSFER_FSM] ?? {}
    return (Object.keys(map) as TransferTransition[]).map((tr) => {
      const guard = canTransition(transfer.status, tr, { transfer, actor, sourceBalance })
      return { transition: tr, ok: guard === true, reason: typeof guard === 'string' ? guard : undefined }
    })
  }, [transfer, actor, sourceBalance])

  const run = useCallback(
    (transition: TransferTransition, reasonText?: string) => {
      try {
        switch (transition) {
          case 'submit':  execute({ kind: 'transfer.submit',  transferId: transfer.id }, actor); break
          case 'approve': execute({ kind: 'transfer.approve', transferId: transfer.id }, actor); break
          case 'reject':  execute({ kind: 'transfer.reject',  transferId: transfer.id, reason: reasonText ?? '' }, actor); break
          case 'cancel':  execute({ kind: 'transfer.cancel',  transferId: transfer.id, reason: reasonText }, actor); break
          case 'send':    execute({ kind: 'transfer.send',    transferId: transfer.id }, actor); break
          case 'settle':  execute({ kind: 'transfer.settle',  transferId: transfer.id }, actor); break
          case 'fail':    execute({ kind: 'transfer.fail',    transferId: transfer.id, reason: reasonText ?? '' }, actor); break
          case 'void':    execute({ kind: 'transfer.void',    transferId: transfer.id, reason: reasonText ?? '' }, actor); break
        }
        toast.success(t(TRANSITION_LABELS[transition].ar, TRANSITION_LABELS[transition].en) + ' ✓')
        onAfter?.(transition)
        if (transition === 'cancel' || transition === 'void') {
          // refresh navigation context
          setTimeout(() => navigate('/synex/transfers'), 500)
        }
      } catch (err) {
        const msg = err instanceof EngineError ? err.message : (err as Error).message
        toast.error(msg)
      } finally {
        setPending(null)
        setReason('')
      }
    },
    [execute, actor, transfer.id, onAfter, navigate],
  )

  const handleClick = (transition: TransferTransition, ok: boolean, blockReason?: string) => {
    if (!ok) { toast.error(blockReason ?? t('غير مسموح', 'Not allowed')); return }
    if (REQUIRES_REASON.includes(transition)) setPending(transition)
    else run(transition)
  }

  if (available.length === 0) return null

  return (
    <>
      <div className={variant === 'panel' ? 'flex flex-wrap gap-2' : 'flex items-center gap-1'}>
        {available.map(({ transition, ok, reason: blockReason }) => {
          const label = t(TRANSITION_LABELS[transition].ar, TRANSITION_LABELS[transition].en)
          return (
            <Button
              key={transition}
              size={variant === 'panel' ? 'sm' : 'icon-sm'}
              variant={VARIANTS[transition]}
              disabled={!ok}
              title={ok ? label : blockReason}
              aria-label={label}
              onClick={(e) => { e.stopPropagation(); handleClick(transition, ok, blockReason) }}
              className="rounded-lg"
            >
              {ICONS[transition]}
              {variant === 'panel' && <span>{label}</span>}
            </Button>
          )
        })}
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending ? t(TRANSITION_LABELS[pending].ar, TRANSITION_LABELS[pending].en) : ''}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('يرجى تقديم سبب لهذا الإجراء. سيتم تسجيله في سجل التدقيق.',
                 'Please provide a reason for this action. It will be recorded in the audit log.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="action-reason">{t('السبب', 'Reason')}</Label>
            <Textarea
              id="action-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('اكتب السبب...', 'Type the reason...')}
              rows={3}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('إلغاء', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={!reason.trim()}
              onClick={() => pending && run(pending, reason.trim())}
            >
              {t('تأكيد', 'Confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
