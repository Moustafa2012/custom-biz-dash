import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import {
  IconPlus, IconTrendingUp, IconWallet,
  IconRefresh, IconCircleCheck,
  IconArrowUpRight, IconArrowDownRight, IconWorld,
} from "@tabler/icons-react"
import { Button } from '@/components/ui/button'
import { useSynex } from '../../store/synex-store'
import { CurrencyAmount } from '../../components'
import CarouselCards from '../../components/carousel-cards'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import type { Account } from '../../data/mock'
import { cn } from '@/lib/utils'

// ─── Shared Premium Motion Presets ───────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.05 } },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
}

// ─── Modern Bento Stat Card ──────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: React.ReactNode
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ReactNode
}
const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring" as const, stiffness: 100, damping: 15 } 
  },
}

const StatCard = ({ label, value, sub, trend, trendValue, icon }: StatCardProps) => (
  <motion.div
    variants={cardVariants}
    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-b from-card to-muted/30 p-5 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/100"
  >
    {/* Clean background lighting layer via Tailwind utilities */}
    <div className="absolute inset-0 opacity-0 bg-radial from-primary/5 via-transparent to-transparent duration-500 transition-opacity pointer-events-none group-hover:opacity-100" />
    
    <div className="relative flex items-start justify-between gap-3 mb-4">
      {/* Dynamic Token Icon Container */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-background shadow-xs shrink-0 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
        <span className="text-primary transition-transform duration-300 group-hover:scale-110">{icon}</span>
      </div>
      
      {trend && trendValue && (
        <span className={cn(
          "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums tracking-wide shadow-2xs border",
          trend === 'up' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:text-emerald-400',
          trend === 'down' && 'bg-destructive/10 text-destructive border-destructive/10',
          trend === 'neutral' && 'bg-muted text-muted-foreground border-border/40'
        )}>
          {trend === 'up' && <IconArrowUpRight className="h-3 w-3 animate-pulse" />}
          {trend === 'down' && <IconArrowDownRight className="h-3 w-3" />}
          {trendValue}
        </span>
      )}
    </div>

    <div className="relative z-10 space-y-1">
      <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums leading-none">
        {value}
      </div>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase pt-0.5">
        {label}
      </p>
      {sub && (
        <p className="text-[11px] text-muted-foreground/50 font-medium">
          {sub}
        </p>
      )}
    </div>
  </motion.div>
)

// ─── Main Accounts Page Layout ───────────────────────────────────────────────

export default function AccountsPage() {
  const { state, loadFromStorage } = useSynex()
  const navigate = useNavigate()
  const [data, setData] = useState<Account[]>(state.accounts)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => { loadFromStorage() }, [loadFromStorage])
  useEffect(() => { setData(state.accounts) }, [state.accounts])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await new Promise((r) => setTimeout(r, 600))
    loadFromStorage()
    setIsRefreshing(false)
    toast.success(t('تم تحديث البيانات بنجاح', 'Data refreshed successfully'))
  }, [loadFromStorage])

  const stats = useMemo(() => {
    const active = data.filter((a) => a.status === 'active')
    const totalBalance = data.reduce((s, a) => s + (a.currentBalance ?? 0), 0)
    const totalProjected = data.reduce((s, a) => s + (a.projectedBalance ?? 0), 0)
    const currencies = new Set(data.map((a) => a.currency)).size
    const activePct = Math.round((active.length / (data.length || 1)) * 100)
    const projectedTrend = totalProjected >= totalBalance ? 'up' : 'down'
    return { active: active.length, total: data.length, totalBalance, totalProjected, currencies, activePct, projectedTrend }
  }, [data])

  const handleCardSelect = useCallback((id: string) => {
    navigate(`/synex/accounts/${id}`)
  }, [navigate])

  return (
    <AppLayout title={t('الحسابات البنكية', 'Bank Accounts')}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-6"
      >
        {/* ── Page Header Controls Section ── */}
        <motion.div variants={cardVariants} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 shadow-xs overflow-hidden">
                <img src="/assets/media/synex/bank-card.png" alt="Bank Card" className="h-7 w-7 object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {t('الحسابات البنكية', 'Bank Accounts')}
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground font-medium">
                  {t(
                    'إدارة ومراقبة محافظك المالية وحساباتك البنكية المباشرة',
                    'Manage and monitor your financial portfolios and live bank accounts'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9 rounded-xl border-border/70 bg-background px-3 shadow-xs font-medium text-xs gap-1.5 transition-all hover:bg-muted"
              >
                <IconRefresh className={cn("h-3.5 w-3.5 text-muted-foreground", isRefreshing && 'animate-spin')} />
                {t('تحديث', 'Refresh')}
              </Button>

              <Link to="/synex/accounts/new">
                <Button
                  size="sm"
                  className="h-9 rounded-xl px-3.5 shadow-xs font-medium text-xs gap-1.5 transition-all hover:opacity-95"
                >
                  <IconPlus className="h-3.5 w-3.5" />
                  {t('إضافة حساب', 'Add Account')}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Metric Bento Grid Layout ── */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={t('إجمالي الرصيد', 'Total Balance')}
            value={<CurrencyAmount amount={stats.totalBalance} currency="SAR" />}
            trend="up"
            trendValue="+4.2%"
            icon={<IconWallet className="h-5 w-5" />}
          />
          <StatCard
            label={t('الحسابات النشطة', 'Active Accounts')}
            value={`${stats.active} / ${stats.total}`}
            sub={t('حساب مفعّل نشط', 'active bank accounts')}
            trend={stats.active === stats.total ? 'up' : 'neutral'}
            trendValue={`${stats.activePct}%`}
            icon={<IconCircleCheck className="h-5 w-5" />}
          />
          <StatCard
            label={t('الرصيد المتوقع', 'Projected Balance')}
            value={<CurrencyAmount amount={stats.totalProjected} currency="SAR" />}
            trend={stats.projectedTrend as 'up' | 'down' | 'neutral'}
            trendValue={stats.projectedTrend === 'up' ? t('نمو', 'Growth') : t('تراجع', 'Decline')}
            icon={<IconTrendingUp className="h-5 w-5" />}
          />
          <StatCard
            label={t('العملات المتوفرة', 'Currencies')}
            value={stats.currencies}
            sub={t('أصول عملات مختلفة', 'different global currencies')}
            icon={<IconWorld className="h-5 w-5" />}
          />
        </motion.div>

        {/* ── Interactive Premium Carousel Slide Wrapper ── */}
        <motion.div variants={cardVariants} className="pt-2">
          <CarouselCards
            accounts={data}
            selectedAccountId={undefined}
            onSelect={handleCardSelect}
            isLoading={false}
          />
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}