import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { t } from '@/lib/translations'
import {
  IconDashboard, IconUsers,
  IconClock, IconChartBar, IconAlertTriangle, IconCircleCheck,
  IconMail, IconArrowUpRight, IconArrowDownRight, IconDots, IconRefresh,
  IconCash, IconArrowsExchange, IconBell,
} from '@tabler/icons-react'
import { CurrencyAmount } from '../../components/CurrencyAmount'
import { StatusBadge } from '../../components/StatusBadge'
import { useSynex } from '../../store/synex-store.tsx'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend,
} from 'recharts'

// ─── Unified CSS-variable-based chart colors ──────────────────────────────────
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
  visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
}

// ─── Animated counter hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) { setCount(0); return }
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label, value, icon, trend, accent = false,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  accent?: boolean
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, '')) || 0
  const animated = useCountUp(numericValue)
  const display = typeof value === 'string' && isNaN(parseFloat(value))
    ? value
    : animated.toLocaleString()

  return (
    <motion.div
      variants={cardVariants}
      className={`group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        accent ? 'border-primary/20 bg-primary/5' : 'border-border/60'
      }`}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, hsl(var(--primary)/0.08) 0%, transparent 65%)' }}
      />

      <div className="relative flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 shadow-sm transition-all duration-300 group-hover:border-primary/20 overflow-hidden ${
          accent ? 'bg-primary/15 border-primary/20' : 'bg-background'
        }`}>
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-1 rounded-full tabular-nums ${
            trend.isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500'
          }`}>
            {trend.isPositive ? <IconArrowUpRight className="h-3 w-3" /> : <IconArrowDownRight className="h-3 w-3" />}
            {trend.value}%
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-2xl font-bold tracking-tight tabular-nums leading-none">{display}</p>
        <p className="mt-1.5 text-xs text-muted-foreground font-medium">{label}</p>
      </div>
    </motion.div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
      {action}
    </div>
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
          <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="text-foreground">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Alert Widget ─────────────────────────────────────────────────────────────

function AlertWidget({ icon, label, count, colorClass, bgClass }: {
  icon: React.ReactNode
  label: string
  count: number
  colorClass: string
  bgClass: string
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgClass} transition-transform group-hover:scale-110 duration-200 overflow-hidden`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className={`text-2xl font-bold leading-none mt-0.5 ${colorClass}`}>{count}</p>
      </div>
    </motion.div>
  )
}

// ─── Chart Card Wrapper ───────────────────────────────────────────────────────

function ChartCard({ title, badge, children }: {
  title: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
    >
    
      <SectionHeader
        title={title}
        action={badge ? (
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-1 rounded-lg font-medium">{badge}</span>
        ) : undefined}
      />
      {children}
    </motion.div>
  )
}

// ─── OverviewPage ─────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { state, loadFromStorage } = useSynex()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { loadFromStorage() }, [loadFromStorage])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalBalances = state.accounts.reduce((sum, a) => sum + a.currentBalance, 0)
  const todayTransfers = state.transfers.filter(t =>
    new Date(t.executionDate).toDateString() === new Date().toDateString()).length
  const sentTransfers = state.transfers.filter(t => t.status === 'sent' || t.status === 'completed').length
  const pendingTransfers = state.transfers.filter(t => t.status === 'pending').length
  const monthlyTransfers = state.transfers.filter(t =>
    new Date(t.executionDate).getMonth() === new Date().getMonth() &&
    new Date(t.executionDate).getFullYear() === new Date().getFullYear()).length

  // ── Chart data ─────────────────────────────────────────────────────────────
  const monthlyTransferData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() - (5 - i))
    const transfers = state.transfers.filter(t =>
      new Date(t.executionDate).getMonth() === month.getMonth() &&
      new Date(t.executionDate).getFullYear() === month.getFullYear())
    return {
      month: month.toLocaleDateString('en', { month: 'short' }),
      transfers: transfers.length,
      amount: transfers.reduce((s, t) => s + t.amount, 0),
    }
  })

  const currencyDistribution = state.transfers.reduce((acc, transfer) => {
    const ex = acc.find(x => x.currency === transfer.currency)
    if (ex) { ex.count += 1; ex.amount += transfer.amount }
    else acc.push({ currency: transfer.currency, count: 1, amount: transfer.amount })
    return acc
  }, [] as { currency: string; count: number; amount: number }[])

  const cashFlowData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const transfers = state.transfers.filter(t =>
      new Date(t.executionDate).toDateString() === date.toDateString())
    return {
      date: date.toLocaleDateString('en', { weekday: 'short' }),
      inflow: transfers.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      outflow: Math.abs(transfers.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)),
    }
  })

  const dailyActivityData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const transfers = state.transfers.filter(t =>
      new Date(t.executionDate).toDateString() === date.toDateString())
    return { date: date.getDate(), transfers: transfers.length }
  })

  return (
    <AppLayout title={t('نظرة عامة', 'Overview')}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-6 pb-8"
      >
        {/* ── Page Header ───────────────────────────────────────────────── */}
        <motion.div variants={cardVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 shadow-xs">
              <IconDashboard className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t('نظرة عامة', 'Overview')}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground font-medium">
                {t('نظرة شاملة على النظام المالي', 'Comprehensive view of the financial system')}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="self-start sm:self-center h-9 inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all shadow-xs"
          >
            <IconRefresh className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {t('تحديث', 'Refresh')}
          </button>
        </motion.div>


        {/* ── Metric Cards ──────────────────────────────────────────────── */}
        <motion.div variants={pageVariants} className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label={t('إجمالي الأرصدة', 'Total Balances')}
            value={totalBalances}
            icon={<IconCash className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            trend={{ value: 12.5, isPositive: true }}
            accent
          />
          <MetricCard
            label={t('تحويلات اليوم', "Today's Transfers")}
            value={todayTransfers}
            icon={<IconArrowsExchange className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            trend={{ value: 8.2, isPositive: true }}
          />
          <MetricCard
            label={t('التحويلات المرسلة', 'Sent Transfers')}
            value={sentTransfers}
            icon={<IconCircleCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            trend={{ value: 5.1, isPositive: true }}
          />
          <MetricCard
            label={t('التحويلات المعلقة', 'Pending')}
            value={pendingTransfers}
            icon={<IconClock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            trend={{ value: 2.3, isPositive: false }}
          />
          <MetricCard
            label={t('تحويلات الشهر', 'Monthly Transfers')}
            value={monthlyTransfers}
            icon={<IconChartBar className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            trend={{ value: 15.7, isPositive: true }}
          />
          <MetricCard
            label={t('عدد المستفيدين', 'Beneficiaries')}
            value={state.beneficiaries.length}
            icon={<IconUsers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
            trend={{ value: 3.2, isPositive: true }}
          />
        </motion.div>

        {/* ── Charts Row 1 ──────────────────────────────────────────────── */}
        <motion.div variants={pageVariants} className="grid gap-4 lg:grid-cols-3">
          <ChartCard
            title={t('نشاط التحويلات الشهري', 'Monthly Transfer Activity')}
            badge={t('آخر 6 أشهر', 'Last 6 months')}
          >
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyTransferData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 6 }} />
                  <Bar dataKey="transfers" name={t('تحويلات', 'Transfers')} fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title={t('توزيع العملات', 'Currency Distribution')}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={currencyDistribution} cx="50%" cy="50%"
                  innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="count"
                >
                  {currencyDistribution.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* ── Charts Row 2 ──────────────────────────────────────────────── */}
        <motion.div variants={pageVariants} className="grid gap-4 lg:grid-cols-2">
          <ChartCard title={t('التدفق النقدي', 'Cash Flow')}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="inflow" name={t('تدفق داخل', 'Inflow')} stroke="hsl(142 71% 45%)" strokeWidth={2} fill="url(#inflowGrad)" />
                <Area type="monotone" dataKey="outflow" name={t('تدفق خارج', 'Outflow')} stroke="hsl(38 92% 50%)" strokeWidth={2} fill="url(#outflowGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('النشاط اليومي', 'Daily Activity')}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="transfers" name={t('تحويلات', 'Transfers')}
                  stroke="hsl(var(--primary))" strokeWidth={2.5}
                  dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* ── Data Tables ───────────────────────────────────────────────── */}
        <motion.div variants={pageVariants} className="grid gap-4 lg:grid-cols-2">
          {/* Latest Transfers */}
          <motion.div variants={cardVariants} className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20">
              <h3 className="text-sm font-semibold">{t('أحدث التحويلات', 'Latest Transfers')}</h3>
              <button className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors hover:bg-muted">
                <IconDots className="h-4 w-4" />
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/10">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('رقم المرجع', 'Ref #')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('المستفيد', 'Beneficiary')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('المبلغ', 'Amount')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('الحالة', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {state.transfers.slice(0, 5).map((transfer) => {
                  const beneficiary = state.beneficiaries.find(b => b.id === transfer.beneficiaryId)
                  return (
                    <tr
                      key={transfer.id}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{transfer.referenceNumber}</td>
                      <td className="px-5 py-3 font-medium text-sm">{beneficiary?.name || transfer.beneficiaryId}</td>
                      <td className="px-5 py-3 font-semibold tabular-nums">
                        <CurrencyAmount amount={transfer.amount} currency={transfer.currency} />
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={transfer.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </motion.div>

          {/* Latest Journal Entries */}
          <motion.div variants={cardVariants} className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20">
              <h3 className="text-sm font-semibold">{t('أحدث القيود اليومية', 'Latest Journal Entries')}</h3>
              <button className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors hover:bg-muted">
                <IconDots className="h-4 w-4" />
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/10">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('رقم القيد', 'Entry #')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('الوصف', 'Description')}</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('المبلغ', 'Amount')}</th>
                </tr>
              </thead>
              <tbody>
                {state.journalEntries.slice(0, 5).map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{entry.entryNumber}</td>
                    <td className="px-5 py-3 truncate max-w-[160px] text-sm text-muted-foreground">{entry.description}</td>
                    <td className="px-5 py-3 font-semibold tabular-nums">
                      <CurrencyAmount amount={entry.amount} currency={entry.currency} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>

        {/* ── Alert Widgets ──────────────────────────────────────────────── */}
        <motion.div variants={pageVariants} className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <AlertWidget
            icon={<IconBell className="h-5 w-5 text-destructive" />}
            label={t('التنبيهات', 'Alerts')}
            count={3}
            colorClass="text-destructive"
            bgClass="bg-destructive/10"
          />
          <AlertWidget
            icon={<IconAlertTriangle className="h-5 w-5 text-destructive" />}
            label={t('التحويلات المرفوضة', 'Rejected Transfers')}
            count={1}
            colorClass="text-orange-500"
            bgClass="bg-orange-500/10"
          />
          <AlertWidget
            icon={<IconClock className="h-5 w-5 text-amber-500" />}
            label={t('تحتاج مراجعة', 'Need Review')}
            count={2}
            colorClass="text-amber-500"
            bgClass="bg-amber-500/10"
          />
          <AlertWidget
            icon={<IconMail className="h-5 w-5 text-blue-500" />}
            label={t('الإشعارات البريدية', 'Email Notifications')}
            count={8}
            colorClass="text-blue-500"
            bgClass="bg-blue-500/10"
          />
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}