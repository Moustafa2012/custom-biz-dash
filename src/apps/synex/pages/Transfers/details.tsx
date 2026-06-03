import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IconArrowLeft, IconCopy, IconDownload, IconBuildingBank,
  IconUser, IconCalendar, IconHash, IconClockHour4,
} from '@tabler/icons-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { t } from '@/lib/translations'
import { useSynex } from '../../store/synex-store'
import { StatusBadge } from '../../components/StatusBadge'
import { CurrencyAmount } from '../../components/CurrencyAmount'
import { TransferActions } from '../../components/TransferActions'
import { getTransferAudit, getAccountBalance } from '../../domain/selectors'

export default function TransferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useSynex()

  const transfer = useMemo(
    () => state.transfers.find((tr) => tr.id === id),
    [state.transfers, id],
  )
  const account = useMemo(
    () => state.accounts.find((a) => a.id === transfer?.sourceAccountId),
    [state.accounts, transfer?.sourceAccountId],
  )
  const beneficiary = useMemo(
    () => state.beneficiaries.find((b) => b.id === transfer?.beneficiaryId),
    [state.beneficiaries, transfer?.beneficiaryId],
  )
  const audit = useMemo(
    () => (transfer ? getTransferAudit(transfer.id, state.auditEvents) : []),
    [transfer, state.auditEvents],
  )
  const sourceBalance = useMemo(
    () => getAccountBalance(account, state.postings),
    [account, state.postings],
  )
  const transferPostings = useMemo(
    () => state.postings.filter((p) => p.reference === transfer?.id),
    [state.postings, transfer?.id],
  )

  if (!transfer) {
    return (
      <AppLayout title={t('التحويل غير موجود', 'Transfer not found')}>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground">
            {t('لم يتم العثور على التحويل المطلوب', 'The requested transfer was not found.')}
          </p>
          <Link to="/synex/transfers">
            <Button variant="outline" className="gap-2">
              <IconArrowLeft className="h-4 w-4" />
              {t('العودة للقائمة', 'Back to list')}
            </Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const copyRef = () => {
    navigator.clipboard.writeText(transfer.referenceNumber)
    toast.success(t('تم نسخ المرجع', 'Reference copied'))
  }

  return (
    <AppLayout title={t('تفاصيل التحويل', 'Transfer Details')}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6 @container"
      >
        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/synex/transfers')}
              aria-label={t('رجوع', 'Back')}
              className="mt-1"
            >
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight font-mono">
                  {transfer.referenceNumber}
                </h1>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={copyRef}
                  aria-label={t('نسخ', 'Copy')}
                >
                  <IconCopy className="h-3 w-3" />
                </Button>
                <StatusBadge status={transfer.status} showIcon />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('عرض كامل لتفاصيل التحويل والإجراءات المتاحة', 'Full transfer details and available actions')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => navigate(`/synex/transfers/${transfer.id}/document`)}
            >
              <IconDownload className="h-4 w-4" />
              {t('تحميل PDF', 'Download PDF')}
            </Button>
          </div>
        </div>

        {/* ── Action panel (FSM-driven) ──────────────────────────────────── */}
        <Card className="border-border/60 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t('الإجراءات المتاحة', 'Available Actions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransferActions transfer={transfer} variant="panel" />
          </CardContent>
        </Card>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid gap-6 @4xl:grid-cols-3">
          {/* Amount card */}
          <Card className="@4xl:col-span-1 border-border/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t('المبلغ', 'Amount')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold tabular-nums">
                <CurrencyAmount amount={transfer.amount} currency={transfer.currency} />
              </div>
              <Badge variant="outline" className="font-mono text-xs tracking-widest rounded-lg">
                {transfer.currency}
              </Badge>
              <Separator className="my-3" />
              <Row icon={<IconHash className="h-3.5 w-3.5" />}
                   label={t('النوع', 'Type')}
                   value={transfer.transferType} />
              <Row icon={<IconClockHour4 className="h-3.5 w-3.5" />}
                   label={t('الأولوية', 'Priority')}
                   value={transfer.priority} />
              <Row icon={<IconCalendar className="h-3.5 w-3.5" />}
                   label={t('تاريخ التنفيذ', 'Execution Date')}
                   value={new Date(transfer.executionDate).toLocaleDateString()} />
            </CardContent>
          </Card>

          {/* Source + Beneficiary */}
          <Card className="@4xl:col-span-2 border-border/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t('الأطراف', 'Parties')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <Party
                icon={<IconBuildingBank className="h-4 w-4" />}
                title={t('الحساب المُرسِل', 'Source Account')}
                primary={account?.bankName ?? transfer.sourceAccountId}
                secondary={account?.accountNumber ? `•••• ${account.accountNumber.slice(-4)}` : undefined}
                extra={account ? (
                  <span className="text-xs text-muted-foreground">
                    {t('الرصيد', 'Balance')}: <span className="font-mono">
                      <CurrencyAmount amount={sourceBalance} currency={account.currency} />
                    </span>
                  </span>
                ) : null}
              />
              <Party
                icon={<IconUser className="h-4 w-4" />}
                title={t('المستفيد', 'Beneficiary')}
                primary={beneficiary?.name ?? transfer.beneficiaryId}
                secondary={beneficiary?.bankName}
                extra={beneficiary?.bankingData?.iban ? (
                  <span className="text-xs text-muted-foreground font-mono tracking-wider">
                    {beneficiary.bankingData.iban}
                  </span>
                ) : null}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Notes ──────────────────────────────────────────────────────── */}
        {(transfer.transferReason || transfer.notes) && (
          <Card className="border-border/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t('السبب والملاحظات', 'Reason & Notes')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {transfer.transferReason && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('السبب', 'Reason')}</div>
                  <p className="leading-relaxed">{transfer.transferReason}</p>
                </div>
              )}
              {transfer.notes && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('الملاحظات', 'Notes')}</div>
                  <p className="leading-relaxed text-muted-foreground">{transfer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Postings (double-entry ledger) ─────────────────────────────── */}
        {transferPostings.length > 0 && (
          <Card className="border-border/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t('القيود المحاسبية', 'Ledger Postings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-xs text-muted-foreground">
                    <tr>
                      <th className="text-start px-4 py-2 font-medium">{t('الحساب', 'Account')}</th>
                      <th className="text-start px-4 py-2 font-medium">{t('الطرف', 'Side')}</th>
                      <th className="text-end px-4 py-2 font-medium">{t('المبلغ', 'Amount')}</th>
                      <th className="text-start px-4 py-2 font-medium">{t('الوقت', 'Posted')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {transferPostings.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="px-4 py-2 font-mono text-xs">{p.accountId}</td>
                        <td className="px-4 py-2">
                          <Badge variant={p.side === 'debit' ? 'destructive' : 'default'} className="rounded-lg">
                            {p.side === 'debit' ? t('مدين', 'Debit') : t('دائن', 'Credit')}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-end tabular-nums font-medium">
                          <CurrencyAmount amount={p.amount} currency={p.currency} />
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {new Date(p.postedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Audit trail ────────────────────────────────────────────────── */}
        <Card className="border-border/60 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t('سجل التدقيق', 'Audit Trail')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {audit.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('لا توجد أحداث مسجلة بعد', 'No events recorded yet.')}
              </p>
            ) : (
              <ol className="relative border-s border-border/60 ms-2 space-y-4">
                {audit.map((e) => (
                  <li key={e.id} className="ms-4">
                    <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium">{e.action}</span>
                      <time className="text-xs text-muted-foreground tabular-nums">
                        {new Date(e.at).toLocaleString()}
                      </time>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {e.actor}
                      {e.meta?.reason ? ` — ${String(e.meta.reason)}` : ''}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  )
}

function Party({
  icon, title, primary, secondary, extra,
}: {
  icon: React.ReactNode
  title: string
  primary: string
  secondary?: string
  extra?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
        {icon}
        {title}
      </div>
      <div className="text-base font-semibold">{primary}</div>
      {secondary && <div className="text-sm text-muted-foreground font-mono">{secondary}</div>}
      {extra}
    </div>
  )
}
