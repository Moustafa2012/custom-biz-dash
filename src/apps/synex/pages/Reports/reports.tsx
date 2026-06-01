import { useEffect, useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { t } from '@/lib/translations'
import {
  IconTrendingUp, IconTrendingDown, IconReceipt,
  IconFileText, IconPrinter, IconBuildingBank, IconCalendar,
  IconArrowUpRight, IconArrowDownRight, IconMinus,
} from '@tabler/icons-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { useSynex } from '../../store/synex-store'
import { CurrencyAmount } from '../../components/CurrencyAmount'
import { StatusBadge } from '../../components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'

// ─── Unified chart colors ─────────────────────────────────────────────────────

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(142 71% 45%)',
  'hsl(38 92% 50%)',
  'hsl(var(--destructive))',
  'hsl(263 70% 60%)',
  'hsl(199 89% 48%)',
]

// ─── Shared animation variants ────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
}

// ─── Transaction type labels ─────────────────────────────────────────────────

const txTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    deposit: t('إيداع', 'Deposit'),
    withdrawal: t('سحب', 'Withdrawal'),
    bank_fee: t('رسوم بنكية', 'Bank Fee'),
    settlement: t('تسوية', 'Settlement'),
    balance_correction: t('تصحيح رصيد', 'Balance Correction'),
    internal_transfer: t('تحويل داخلي', 'Internal Transfer'),
  }
  return map[type] ?? type
}

const DEBIT_TYPES = ['withdrawal', 'bank_fee', 'settlement', 'internal_transfer']

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon, trend,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  icon: React.ReactNode
  trend?: { label: string; isPositive: boolean }
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, hsl(var(--primary)/0.05) 0%, transparent 60%)' }}
      />
      <div className="relative flex items-start justify-between gap-2 mb-4">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-background shadow-sm shrink-0 overflow-hidden`}>
          {icon}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            trend.isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'
          }`}>
            {trend.isPositive ? <IconArrowUpRight className="h-3 w-3" /> : <IconArrowDownRight className="h-3 w-3" />}
            {trend.label}
          </span>
        )}
      </div>
      <div className="relative">
        <p className="text-2xl font-bold tracking-tight tabular-nums leading-none">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-1.5">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-xl px-3 py-2.5 text-xs">
      <p className="font-semibold text-muted-foreground mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-medium flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: p.fill || p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="text-foreground">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Chart Card ───────────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={cardVariants}
      className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

// ─── ReportsPage ──────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { state, loadFromStorage } = useSynex()

  const [stmtAccountId, setStmtAccountId] = useState('')
  const [stmtFrom, setStmtFrom] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().split('T')[0]
  })
  const [stmtTo, setStmtTo] = useState(() => new Date().toISOString().split('T')[0])

  useEffect(() => { loadFromStorage() }, [loadFromStorage])

  // ── Computed metrics ──────────────────────────────────────────────────────
  const totalBalance = state.accounts.reduce((s, a) => s + a.currentBalance, 0)
  const totalTransferred = state.transfers
    .filter((tr) => tr.status === 'completed' || tr.status === 'sent')
    .reduce((s, tr) => s + tr.amount, 0)
  const totalPending = state.transfers
    .filter((tr) => tr.status === 'pending')
    .reduce((s, tr) => s + tr.amount, 0)
  const totalFees = state.journalEntries
    .filter((e) => e.transactionType === 'bank_fee')
    .reduce((s, e) => s + e.amount, 0)

  const statusBreakdown = ['draft', 'pending', 'sent', 'completed', 'rejected', 'cancelled'].map((status) => ({
    name: status,
    value: state.transfers.filter((tr) => tr.status === status).length,
  })).filter((d) => d.value > 0)

  const currencyData = state.transfers.reduce<Record<string, number>>((acc, tr) => {
    acc[tr.currency] = (acc[tr.currency] ?? 0) + tr.amount; return acc
  }, {})
  const currencyChartData = Object.entries(currencyData).map(([currency, amount]) => ({ currency, amount }))

  const accountBalanceData = state.accounts.map((a) => ({
    name: a.bankName, balance: a.currentBalance, currency: a.currency,
  }))

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
    const month = d.toLocaleDateString('en', { month: 'short', year: '2-digit' })
    const count = state.transfers.filter((tr) => {
      const ex = new Date(tr.executionDate)
      return ex.getMonth() === d.getMonth() && ex.getFullYear() === d.getFullYear()
    }).length
    const amount = state.transfers
      .filter((tr) => { const ex = new Date(tr.executionDate); return ex.getMonth() === d.getMonth() && ex.getFullYear() === d.getFullYear() })
      .reduce((s, tr) => s + tr.amount, 0)
    return { month, count, amount }
  })

  // ── Account Statement ─────────────────────────────────────────────────────
  type StatementRow = {
    id: string; date: Date; reference: string; description: string
    contraAccount: string; debit: number; credit: number; balance: number
    source: 'journal' | 'transfer'; type: string
  }

  const stmtAccount = state.accounts.find((a) => a.id === stmtAccountId)

  const statementRows = useMemo<StatementRow[]>(() => {
    if (!stmtAccountId || !stmtAccount) return []
    const from = stmtFrom ? new Date(stmtFrom + 'T00:00:00') : null
    const to = stmtTo ? new Date(stmtTo + 'T23:59:59') : null
    const raw: Omit<StatementRow, 'balance'>[] = []

    state.journalEntries
      .filter((e) => e.accountId === stmtAccountId)
      .filter((e) => { const d = new Date(e.date); return (!from || d >= from) && (!to || d <= to) })
      .forEach((e) => {
        const isDebit = DEBIT_TYPES.includes(e.transactionType)
        raw.push({
          id: e.id, date: new Date(e.date), reference: e.entryNumber,
          description: e.description, contraAccount: txTypeLabel(e.transactionType),
          debit: isDebit ? e.amount : 0, credit: isDebit ? 0 : e.amount,
          source: 'journal', type: e.transactionType,
        })
      })

    state.transfers
      .filter((tr) => tr.sourceAccountId === stmtAccountId)
      .filter((tr) => tr.status !== 'cancelled' && tr.status !== 'rejected')
      .filter((tr) => { const d = new Date(tr.executionDate); return (!from || d >= from) && (!to || d <= to) })
      .forEach((tr) => {
        const ben = state.beneficiaries.find((b) => b.id === tr.beneficiaryId)
        raw.push({
          id: tr.id, date: new Date(tr.executionDate), reference: tr.referenceNumber,
          description: tr.transferReason, contraAccount: ben?.name ?? tr.beneficiaryId,
          debit: tr.amount, credit: 0, source: 'transfer', type: 'transfer',
        })
      })

    raw.sort((a, b) => a.date.getTime() - b.date.getTime())
    const periodNet = raw.reduce((s, r) => s + r.credit - r.debit, 0)
    let running = stmtAccount.currentBalance - periodNet

    return raw.map((r) => {
      running = running + r.credit - r.debit
      return { ...r, balance: running }
    })
  }, [stmtAccountId, stmtFrom, stmtTo, stmtAccount, state.journalEntries, state.transfers, state.beneficiaries])

  const stmtTotalDebit = statementRows.reduce((s, r) => s + r.debit, 0)
  const stmtTotalCredit = statementRows.reduce((s, r) => s + r.credit, 0)
  const stmtCurrency = stmtAccount?.currency ?? 'SAR'
  const openingBalance = stmtAccount ? stmtAccount.currentBalance - (stmtTotalCredit - stmtTotalDebit) : 0

  return (
    <AppLayout title={t('التقارير', 'Reports')}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 overflow-hidden">
            <img src="/assets/media/synex/reports.png" alt="Reports" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('التقارير', 'Reports')}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t('عرض وتحليل التقارير المالية', 'View and analyze financial reports')}</p>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={pageVariants} className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label={t('إجمالي الأرصدة', 'Total Balances')}
            value={<CurrencyAmount amount={totalBalance} currency="SAR" />}
            sub={`${state.accounts.length} ${t('حساب', 'accounts')}`}
            icon={<img src="/assets/media/synex/reports.png" alt="Reports" className="h-5 w-5" />}
            trend={{ label: '+4.2%', isPositive: true }}
          />
          <KpiCard
            label={t('إجمالي المحوّل', 'Total Transferred')}
            value={<span className="text-emerald-600 dark:text-emerald-400">{totalTransferred.toLocaleString()}</span>}
            sub={`${state.transfers.filter(tr => tr.status === 'completed' || tr.status === 'sent').length} ${t('تحويل مكتمل', 'completed')}`}
            icon={<IconTrendingUp className="h-4.5 w-4.5 text-emerald-500" />}
            trend={{ label: '+8.1%', isPositive: true }}
          />
          <KpiCard
            label={t('قيد الانتظار', 'Pending')}
            value={<span className="text-amber-600 dark:text-amber-400">{totalPending.toLocaleString()}</span>}
            sub={`${state.transfers.filter(tr => tr.status === 'pending').length} ${t('تحويل معلق', 'pending')}`}
            icon={<IconTrendingDown className="h-4.5 w-4.5 text-amber-500" />}
          />
          <KpiCard
            label={t('الرسوم البنكية', 'Bank Fees')}
            value={<span className="text-destructive">{totalFees.toLocaleString()}</span>}
            sub={`${state.journalEntries.filter(e => e.transactionType === 'bank_fee').length} ${t('معاملة', 'transactions')}`}
            icon={<IconReceipt className="h-4.5 w-4.5 text-destructive" />}
          />
        </motion.div>

        {/* Charts row 1 */}
        <motion.div variants={pageVariants} className="grid gap-4 lg:grid-cols-2">
          <ChartCard title={t('نشاط التحويلات الشهري', 'Monthly Transfer Activity')}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 6 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name={t('عدد التحويلات', 'Transfers')} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('توزيع حالات التحويلات', 'Transfer Status Distribution')}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusBreakdown} cx="50%" cy="50%" outerRadius={88} dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Charts row 2 */}
        <motion.div variants={pageVariants} className="grid gap-4 lg:grid-cols-2">
          <ChartCard title={t('أرصدة الحسابات', 'Account Balances')}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={accountBalanceData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={100} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="balance" fill="hsl(142 71% 45%)" radius={[0, 6, 6, 0]} name={t('الرصيد', 'Balance')} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('حجم التحويلات بالعملة', 'Transfer Volume by Currency')}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={currencyChartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="currency" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 6 }} />
                <Bar dataKey="amount" fill="hsl(38 92% 50%)" radius={[6, 6, 0, 0]} name={t('المبلغ', 'Amount')} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Recent transfers summary table */}
        <motion.div variants={cardVariants} className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border/60 px-5 py-4 bg-muted/20">
            <h3 className="text-sm font-semibold">{t('ملخص التحويلات الأخيرة', 'Recent Transfers Summary')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/10">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('المرجع', 'Reference')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('المستفيد', 'Beneficiary')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('المبلغ', 'Amount')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('الحالة', 'Status')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('التاريخ', 'Date')}</th>
                </tr>
              </thead>
              <tbody>
                {state.transfers.slice(0, 8).map((tr) => {
                  const ben = state.beneficiaries.find((b) => b.id === tr.beneficiaryId)
                  return (
                    <tr key={tr.id} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{tr.referenceNumber}</td>
                      <td className="px-5 py-3 font-medium">{ben?.name ?? tr.beneficiaryId}</td>
                      <td className="px-5 py-3 font-semibold tabular-nums"><CurrencyAmount amount={tr.amount} currency={tr.currency} /></td>
                      <td className="px-5 py-3"><StatusBadge status={tr.status} showIcon /></td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(tr.executionDate).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Account Statement Report ──────────────────────────────────── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden print:border-0 print:shadow-none"
        >
          {/* Statement header */}
          <div className="border-b border-border/60 bg-muted/20 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:bg-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <IconFileText className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{t('كشف حساب', 'Account Statement')}</h3>
                <p className="text-xs text-muted-foreground">{t('تقرير مفصّل لحركة الحساب المختار', 'Detailed movement report for the selected account')}</p>
              </div>
            </div>
            {statementRows.length > 0 && (
              <Button variant="outline" size="sm" className="gap-2 rounded-xl print:hidden" onClick={() => window.print()}>
                <IconPrinter className="h-4 w-4" />
                {t('طباعة الكشف', 'Print Statement')}
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="px-5 py-4 border-b border-border/60 bg-muted/10 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center gap-1.5 text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                  <IconBuildingBank className="h-3.5 w-3.5" />
                  {t('الحساب', 'Account')}
                </Label>
                <Select value={stmtAccountId} onValueChange={setStmtAccountId}>
                  <SelectTrigger className="h-9 rounded-xl">
                    <SelectValue placeholder={t('اختر حساباً', 'Select an account')} />
                  </SelectTrigger>
                  <SelectContent>
                    {state.accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.bankName} — {acc.accountNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-1.5 text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                  <IconCalendar className="h-3.5 w-3.5" />
                  {t('من تاريخ', 'From Date')}
                </Label>
                <Input type="date" value={stmtFrom} onChange={(e) => setStmtFrom(e.target.value)} className="h-9 rounded-xl" />
              </div>
              <div>
                <Label className="flex items-center gap-1.5 text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                  <IconCalendar className="h-3.5 w-3.5" />
                  {t('إلى تاريخ', 'To Date')}
                </Label>
                <Input type="date" value={stmtTo} onChange={(e) => setStmtTo(e.target.value)} className="h-9 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Statement content */}
          {!stmtAccountId ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 mb-4 overflow-hidden">
                <img src="/assets/media/synex/search.png" alt="Search" className="h-7 w-7 object-contain opacity-40" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t('اختر حساباً لعرض الكشف', 'Select an account to view its statement')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('يمكنك تصفية النتائج بالتاريخ', 'You can filter results by date')}</p>
            </div>
          ) : statementRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 mb-4">
                <IconFileText className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t('لا توجد حركات في هذه الفترة', 'No transactions found in this period')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('جرّب تغيير نطاق التاريخ', 'Try changing the date range')}</p>
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border/60">
                {[
                  {
                    label: t('الرصيد الافتتاحي', 'Opening Balance'),
                    value: openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    color: 'text-foreground',
                  },
                  {
                    label: t('إجمالي مدين', 'Total Debit'),
                    value: stmtTotalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    color: 'text-destructive',
                    icon: <IconArrowUpRight className="h-3.5 w-3.5 text-destructive" />,
                  },
                  {
                    label: t('إجمالي دائن', 'Total Credit'),
                    value: stmtTotalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    color: 'text-emerald-600 dark:text-emerald-400',
                    icon: <IconArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />,
                  },
                  {
                    label: t('الرصيد الختامي', 'Closing Balance'),
                    value: (stmtAccount?.currentBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    color: 'text-primary',
                  },
                ].map((item, i) => (
                  <div key={i} className={`px-5 py-4 ${i < 3 ? 'border-r border-border/40' : ''}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      {item.icon}
                      {item.label}
                    </p>
                    <p className={`text-base font-bold tabular-nums ${item.color}`}>
                      {item.value}
                      <span className="text-xs text-muted-foreground font-normal ms-1">{stmtCurrency}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Statement table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/10">
                      {[
                        t('التاريخ', 'Date'), t('رقم المرجع', 'Reference #'),
                        t('البيان', 'Description'), t('الحساب المقابل', 'Contra Account'),
                        t('مدين', 'Debit'), t('دائن', 'Credit'), t('الرصيد', 'Balance'),
                      ].map((h, i) => (
                        <th
                          key={i}
                          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap ${i >= 4 ? 'text-right' : 'text-left'}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Opening balance row */}
                    <tr className="border-b border-border/40 bg-muted/20">
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{stmtFrom}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">—</td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">{t('رصيد أول الفترة', 'Opening Balance')}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">—</td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground/50">—</td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground/50">—</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold">
                        {openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {statementRows.map((row) => (
                      <tr key={row.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.date.toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{row.reference}</td>
                        <td className="px-4 py-3 text-sm max-w-[200px]">
                          <span className="line-clamp-1">{row.description}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <span className={`inline-flex h-1.5 w-1.5 rounded-full shrink-0 ${row.source === 'transfer' ? 'bg-amber-500' : 'bg-primary'}`} />
                            {row.contraAccount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {row.debit > 0 ? (
                            <span className="text-destructive font-medium">
                              {row.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30"><IconMinus className="h-3 w-3 inline" /></span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {row.credit > 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {row.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30"><IconMinus className="h-3 w-3 inline" /></span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                          <span className={row.balance >= 0 ? 'text-foreground' : 'text-destructive'}>
                            {row.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Closing balance row */}
                    <tr className="border-t-2 border-primary/20 bg-primary/5 font-semibold">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{stmtTo}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">—</td>
                      <td className="px-4 py-3 text-xs font-semibold">{t('رصيد نهاية الفترة', 'Closing Balance')}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">—</td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-destructive">
                        {stmtTotalDebit > 0 ? stmtTotalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-emerald-600 dark:text-emerald-400">
                        {stmtTotalCredit > 0 ? stmtTotalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-primary">
                        {(stmtAccount?.currentBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border/60 bg-muted/10 text-xs text-muted-foreground flex items-center justify-between print:hidden">
                <span className="flex items-center gap-3">
                  <span>{statementRows.length} {t('معاملة', 'transaction(s)')}</span>
                  <span className="flex items-center gap-1">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {t('تحويل', 'Transfer')}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    {t('قيد محاسبي', 'Journal Entry')}
                  </span>
                </span>
                <span className="font-medium">{stmtAccount?.bankName} — {stmtAccount?.accountNumber}</span>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}