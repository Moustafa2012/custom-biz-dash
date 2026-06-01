import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { useAccountSettings } from "@/apps/synex/hooks/use-account-settings";
import { CURRENCY_META } from "@/apps/synex/components/carousel-cards";
import type { Account, Transaction, SpendingStatistics } from "@/apps/synex/data/mock";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Input, CurrencyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconAlertCircle, IconAlertTriangle, IconArrowDownRight, IconArrowUpRight,
  IconArrowsRightLeft, IconCashBanknote, IconCheck, IconChevronDown, IconChevronRight,
  IconCircleCheck, IconCircleX, IconCreditCard, IconDownload, IconFileText,
  IconInfoCircle, IconList, IconPlus, IconPower, IconReceipt, IconRefresh,
  IconSettings, IconShieldLock, IconSnowflake, IconWallet, IconWorld, IconX,
} from "@tabler/icons-react";

// ─── Motion ───────────────────────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 16 } },
};

// ─── Page Section Header ──────────────────────────────────────────────────────
// Large heading + subtitle used to divide the page into named groups

function PageSection({
  icon: Icon,
  title,
  subtitle,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={cn("space-y-4", className)}>
      <div className="flex items-start gap-3 pb-3 border-b border-border/50">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 mt-0.5">
          {Icon}
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground leading-none">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Sub-section card (inner grouping inside a PageSection) ───────────────────

function SubSection({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">{title}</h3>
        {badge}
      </div>
      <div className="space-y-1.5 p-3">{children}</div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AccountDetailsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 border-b border-border/40 pb-5">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-start gap-3 pb-3 border-b border-border/50">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 p-4 space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Error / Empty ────────────────────────────────────────────────────────────

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-4"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
        <IconAlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight">{t("تعذّر تحميل الحساب", "Failed to Load Account")}</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
      <Button onClick={onRetry} variant="outline" size="sm" className="h-9 rounded-xl gap-1.5">
        <IconRefresh className="h-3.5 w-3.5" />
        {t("إعادة المحاولة", "Try Again")}
      </Button>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-4"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/30">
        <IconCashBanknote className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <div className="text-center space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight">{t("الحساب غير موجود", "Account Not Found")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("الحساب الذي تبحث عنه غير موجود أو تمت إزالته.", "The account you're looking for doesn't exist or has been removed.")}
        </p>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — ACCOUNT OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════

const AccountCard = memo(function AccountCard({ account }: { account: Account }) {
  const meta = CURRENCY_META[account.currency];
  const isActive = account.status === "active";

  const formatAccountNumber = (num: string) => `•••• •••• ${num.replace(/\s/g, "").slice(-4)}`;
  const formatIban = (iban: string) => {
    const clean = iban.replace(/\s/g, "");
    return clean.length <= 8 ? clean : `${clean.slice(0, 4)} ${"•".repeat(Math.min(clean.length - 8, 12))} ${clean.slice(-4)}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-b from-card to-muted/30 p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border">
      <div className="absolute inset-0 opacity-0 bg-radial from-primary/5 via-transparent to-transparent duration-500 transition-opacity pointer-events-none group-hover:opacity-100" />

      {/* Balance + status row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold tracking-tight text-foreground">{account.bankName}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
              isActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                       : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
            )}>
              {isActive ? <IconCircleCheck className="h-2.5 w-2.5" /> : <IconAlertCircle className="h-2.5 w-2.5" />}
              {t(isActive ? "نشط" : "غير نشط", isActive ? "Active" : "Inactive")}
            </span>
            {account.cardType && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground capitalize">
                <IconCreditCard className="h-2.5 w-2.5" />
                {account.cardType}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black tabular-nums tracking-tight text-foreground leading-none">
            {account.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs font-semibold text-muted-foreground mt-1 tracking-wide">
            {meta?.flag && <span className="mr-1">{meta.flag}</span>}
            {meta?.symbol ?? account.currency}
          </p>
        </div>
      </div>

      <Separator className="mb-5" />

      {/* Info grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">{t("رقم الحساب", "Account Number")}</p>
          <p className="font-mono text-sm text-foreground/80">{formatAccountNumber(account.accountNumber)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">IBAN</p>
          <p className="font-mono text-sm text-foreground/80">{formatIban(account.iban)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">{t("العملة", "Currency")}</p>
          <p className="text-sm font-semibold text-foreground/80">{account.currency}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">{t("نوع الحساب", "Account Type")}</p>
          <p className="text-sm font-semibold text-foreground/80 capitalize">{account.accountType}</p>
        </div>
      </div>

      {account.expiryDate && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{t("تاريخ انتهاء البطاقة", "Card Expires")}</p>
          <p className="font-mono text-sm font-semibold text-foreground/80">{account.expiryDate}</p>
        </div>
      )}
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — RECENT TRANSACTIONS & STATISTICS
// ══════════════════════════════════════════════════════════════════════════════

const TXN_CONFIG = {
  credit:   { icon: IconArrowDownRight, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  debit:    { icon: IconArrowUpRight,   color: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-500/10 border-rose-500/20" },
  transfer: { icon: IconArrowsRightLeft,color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-500/10 border-blue-500/20" },
  fee:      { icon: IconReceipt,        color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-500/10 border-amber-500/20" },
} as const;

const STATUS_CONFIG = {
  completed: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  pending:   "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  failed:    "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
} as const;

const TransactionList = memo(function TransactionList({
  transactions, currency, reducedMotion,
}: { transactions: Transaction[]; currency: string; reducedMotion: boolean }) {
  const meta = CURRENCY_META[currency];

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
          <IconList className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{t("لا توجد معاملات", "No transactions yet")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((txn, index) => {
        const cfg = TXN_CONFIG[txn.type] ?? TXN_CONFIG.fee;
        const Icon = cfg.icon;
        const isCredit = txn.type === "credit";
        return (
          <motion.div
            key={txn.id}
            initial={reducedMotion ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.03 }}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 transition-all duration-200 hover:border-border hover:shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", cfg.bg)}>
                <Icon className={cn("h-4 w-4", cfg.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{txn.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{txn.date instanceof Date ? txn.date.toLocaleDateString() : String(txn.date)}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3 space-y-1">
              <p className={cn("text-sm font-bold tabular-nums", isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                {isCredit ? "+" : "-"}{txn.amount.toLocaleString()} {meta?.symbol ?? currency}
              </p>
              <span className={cn("inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-semibold leading-none", STATUS_CONFIG[txn.status])}>
                {txn.status}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

const SpendingStats = memo(function SpendingStats({
  stats, currency, reducedMotion,
}: { stats: SpendingStatistics; currency: string; reducedMotion: boolean }) {
  const meta = CURRENCY_META[currency];
  const sym = meta?.symbol ?? currency;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t("إجمالي المستلم", "Total Received"), value: stats.totalReceived, color: "emerald", icon: IconArrowDownRight },
          { label: t("إجمالي المنفق", "Total Spent"),     value: stats.totalSpent,    color: "rose",    icon: IconArrowUpRight },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={reducedMotion ? {} : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, delay: i * 0.07 }}
            className={cn("rounded-xl border p-4", color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20")}
          >
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border mb-3", color === "emerald" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20")}>
              <Icon className={cn("h-4 w-4", color === "emerald" ? "text-emerald-500" : "text-rose-500")} />
            </div>
            <p className={cn("text-[11px] font-semibold uppercase tracking-widest mb-1", color === "emerald" ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-rose-600/80 dark:text-rose-400/80")}>{label}</p>
            <p className={cn("text-xl font-bold tabular-nums", color === "emerald" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
              {value.toLocaleString()} {sym}
            </p>
          </motion.div>
        ))}
      </div>

      {stats.categoryBreakdown.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">{t("توزيع الفئات", "Category Breakdown")}</p>
          {stats.categoryBreakdown.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={reducedMotion ? {} : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-foreground/80">{cat.category}</span>
                <span className="font-bold tabular-nums text-foreground">{cat.amount.toLocaleString()} {sym}</span>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={reducedMotion ? {} : { width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary to-primary/60"
                />
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5 text-right tabular-nums">{cat.percentage}%</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — ACCOUNT CONTROLS
// ══════════════════════════════════════════════════════════════════════════════

const ActionSwitch = memo(function ActionSwitch({
  icon, iconClass, label, description, checked, onCheckedChange, activeLabel, inactiveLabel,
}: {
  icon: React.ReactNode; iconClass: string; label: string; description: string;
  checked: boolean; onCheckedChange: (v: boolean) => void; activeLabel?: string; inactiveLabel?: string;
}) {
  return (
    <motion.div layout className={cn(
      "flex items-center justify-between gap-3 rounded-xl border px-3 py-3 transition-[border-color,background-color] duration-200",
      checked ? "border-border/60 bg-background/60" : "border-border/40 bg-muted/20 hover:border-border/50 hover:bg-muted/30",
    )}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-opacity duration-200", iconClass, !checked && "opacity-50")}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{label}</p>
            <AnimatePresence mode="wait">
              {(activeLabel || inactiveLabel) && (
                <motion.span
                  key={checked ? "on" : "off"}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.14 }}
                  className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                    checked ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground",
                  )}
                >
                  {checked ? (activeLabel ?? "") : (inactiveLabel ?? "")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </motion.div>
  );
});

function QuickActionRow({
  icon, iconClass, title, subtitle, rightSlot, onClick, asButton = true,
}: {
  icon: React.ReactNode; iconClass: string; title: string; subtitle?: string;
  rightSlot?: React.ReactNode; onClick?: () => void; asButton?: boolean;
}) {
  const inner = (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-3 py-3 bg-background/60 transition-[border-color,background-color,transform] duration-150 hover:border-border hover:bg-muted/30 active:scale-[0.99]">
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", iconClass)}>{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="shrink-0 text-muted-foreground/60">{rightSlot ?? <IconChevronRight className="h-4 w-4" />}</div>
    </div>
  );
  if (!asButton) return inner;
  return <button type="button" className="w-full text-left" onClick={onClick}>{inner}</button>;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

function AddFundsDialog({ currency, onAddFunds }: { currency: string; onAddFunds: (amount: number, currency: string) => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const handleSubmit = () => { if (amount && amount > 0) { onAddFunds(amount, currency); setAmount(undefined); setOpen(false); } };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <QuickActionRow title={t("إضافة رصيد", "Add Funds")} subtitle={t("إيداع في حسابك", "Deposit into your account")}
            icon={<IconPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />} iconClass="border-emerald-500/20 bg-emerald-500/10" onClick={() => setOpen(true)} />
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border-border/60 sm:max-w-sm">
        <DialogHeader><DialogTitle className="text-base font-semibold">{t("إضافة رصيد", "Add Funds")}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-1">
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((q) => (
              <button key={q} type="button" onClick={() => setAmount(q)}
                className={cn("rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                  amount === q ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60",
                )}>{q.toLocaleString()} {currency}</button>
            ))}
          </div>
          <CurrencyInput label={t("مبلغ مخصص", "Custom Amount")} currency={currency} value={amount} onValueChange={(raw) => setAmount(raw ?? undefined)} placeholder="0.00" />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">{t("إلغاء", "Cancel")}</Button>
          <Button onClick={handleSubmit} disabled={!amount || amount <= 0} className="rounded-xl gap-1.5">
            <IconCheck className="h-4 w-4" />{t("إضافة", "Add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransferFundsDialog({ currency, onTransferFunds }: { currency: string; onTransferFunds: (toAccountId: string, amount: number, currency: string) => void }) {
  const [open, setOpen] = useState(false);
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [step, setStep] = useState<1 | 2>(1);
  const canProceed = !!toAccountId.trim();
  const canSubmit = !!amount && amount > 0;
  const handleClose = () => { setOpen(false); setTimeout(() => { setStep(1); setToAccountId(""); setAmount(undefined); }, 300); };
  const handleSubmit = () => { if (canSubmit && toAccountId) { onTransferFunds(toAccountId, amount!, currency); handleClose(); } };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <div>
          <QuickActionRow title={t("تحويل رصيد", "Transfer Funds")} subtitle={t("إرسال إلى حساب آخر", "Send to another account")}
            icon={<IconArrowsRightLeft className="h-4 w-4 text-sky-600 dark:text-sky-400" />} iconClass="border-sky-500/20 bg-sky-500/10" onClick={() => setOpen(true)} />
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border-border/60 sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted/40">
                <IconChevronDown className="h-3.5 w-3.5 rotate-90" />
              </button>
            )}
            <DialogTitle className="text-base font-semibold">{step === 1 ? t("إلى من؟", "To whom?") : t("كم المبلغ؟", "How much?")}</DialogTitle>
          </div>
          <div className="mt-3 flex gap-1.5">
            {[1, 2].map((s) => <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-300", s <= step ? "bg-primary" : "bg-border/60")} />)}
          </div>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("معرّف الحساب", "Account ID")}</Label>
                <Input value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} placeholder={t("أدخل معرّف الحساب", "Enter account ID")} autoFocus />
              </div>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-3 py-2">
              <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{toAccountId[0]?.toUpperCase()}</div>
                <span className="flex-1 truncate text-sm font-medium">{toAccountId}</span>
                <button type="button" onClick={() => setStep(1)} className="text-muted-foreground/60 hover:text-muted-foreground"><IconX className="h-3.5 w-3.5" /></button>
              </div>
              <CurrencyInput label={t("المبلغ", "Amount")} currency={currency} value={amount} onValueChange={(raw) => setAmount(raw ?? undefined)} placeholder="0.00" autoFocus />
            </motion.div>
          )}
        </AnimatePresence>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="rounded-xl">{t("إلغاء", "Cancel")}</Button>
          {step === 1
            ? <Button onClick={() => setStep(2)} disabled={!canProceed} className="rounded-xl">{t("التالي", "Next")}</Button>
            : <Button onClick={handleSubmit} disabled={!canSubmit} className="rounded-xl gap-1.5"><IconCheck className="h-4 w-4" />{t("تحويل", "Transfer")}</Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBanner({ icon, title, description, className, action }: {
  icon: React.ReactNode; title: string; description: string; className: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <motion.div layout className={cn("flex items-start gap-3 rounded-2xl border p-3.5", className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-background/60">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs opacity-75">{description}</p>
      </div>
      {action && (
        <button type="button" onClick={action.onClick} className="shrink-0 rounded-lg border border-current/20 px-2.5 py-1 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — LIMITS & PERMISSIONS
// ══════════════════════════════════════════════════════════════════════════════

const LimitSlider = memo(function LimitSlider({
  icon, iconBg, label, description, value, min, max, step, currencySymbol, onChange, reducedMotion,
}: {
  icon: React.ReactNode; iconBg: string; label: string; description: string;
  value: number; min: number; max: number; step: number; currencySymbol: string;
  onChange: (v: number) => void; reducedMotion: boolean;
}) {
  const [local, setLocal] = useState(value);
  const pct = ((local - min) / (max - min)) * 100;

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", iconBg)}>{icon}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><IconInfoCircle className="h-3 w-3 text-muted-foreground/40 cursor-help shrink-0" /></TooltipTrigger>
                  <TooltipContent side="top" className="rounded-xl text-xs max-w-xs">{description}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{description}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base font-black tabular-nums tracking-tight text-foreground leading-none">{local.toLocaleString()}</p>
          <p className="text-[10px] font-semibold text-muted-foreground/60 mt-0.5 uppercase tracking-widest">{currencySymbol}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Slider value={[local]} onValueChange={([v]) => { setLocal(v); onChange(v); }} min={min} max={max} step={step} aria-label={label} className="cursor-pointer" />
        <div className="flex justify-between text-[10px] font-medium text-muted-foreground/50 tabular-nums">
          <span>{min.toLocaleString()} {currencySymbol}</span>
          <span>{max.toLocaleString()} {currencySymbol}</span>
        </div>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <motion.div initial={reducedMotion ? {} : { width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-linear-to-r from-primary to-primary/60" />
      </div>
    </div>
  );
});

function PermissionBadge({ icon, label, allowed }: { icon: React.ReactNode; label: string; allowed: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-xl border px-3 py-2", allowed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20")}>
      <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", allowed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>{icon}</div>
      <span className={cn("text-xs font-semibold flex-1", allowed ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")}>{label}</span>
      {allowed ? <IconCircleCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <IconCircleX className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
    </div>
  );
}

function LimitRow({ label, sub, value, currencySymbol }: { label: string; sub: string; value: number; currencySymbol: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-sm font-black tabular-nums text-foreground">{value.toLocaleString()}</p>
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">{currencySymbol}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function AccountDetailsPage() {
  const { account, isLoading, error, actions } = useAccountSettings();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  if (isLoading) return <AppLayout title={t("تفاصيل الحساب", "Account Details")}><AccountDetailsSkeleton /></AppLayout>;
  if (error)     return <AppLayout title={t("تفاصيل الحساب", "Account Details")}><ErrorState error={error} onRetry={() => window.location.reload()} /></AppLayout>;
  if (!account)  return <AppLayout title={t("تفاصيل الحساب", "Account Details")}><EmptyState /></AppLayout>;

  const meta = CURRENCY_META[account.currency];
  const sym  = meta?.symbol ?? account.currency;

  const isActive   = account.settings?.isActive ?? false;
  const isFrozen   = account.settings?.isFrozen ?? false;
  const allowIntl  = account.settings?.allowInternationalTransactions ?? true;
  const allowOnline = account.settings?.allowOnlinePayments ?? true;
  const activeCount = [isActive, !isFrozen, allowIntl, allowOnline].filter(Boolean).length;

  const permissions = [
    { icon: <IconArrowsRightLeft className="h-3.5 w-3.5" />, label: t("يمكنه التحويل", "Can Transfer"),           allowed: account.permissions?.canTransfer ?? true },
    { icon: <IconWallet className="h-3.5 w-3.5" />,          label: t("يمكنه السحب", "Can Withdraw"),             allowed: account.permissions?.canWithdraw ?? true },
    { icon: <IconCreditCard className="h-3.5 w-3.5" />,      label: t("يمكنه الدفع", "Can Make Payments"),        allowed: account.permissions?.canMakePayments ?? true },
    { icon: <IconFileText className="h-3.5 w-3.5" />,        label: t("يمكنه عرض الكشف", "Can View Statements"),  allowed: account.permissions?.canViewStatements ?? true },
    { icon: <IconSettings className="h-3.5 w-3.5" />,        label: t("يمكنه إدارة البطاقات", "Can Manage Cards"), allowed: account.permissions?.canManageCards ?? true },
  ];

  return (
    <AppLayout title={t("تفاصيل الحساب", "Account Details")}>
        {/* ── Page Header ── */}
          <motion.div variants={itemVariants}>
            <div className="w-full rounded-md bg-primary/20 gap-4 w p-3 mb-10">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 shadow-xs">
                  <IconCashBanknote className="relative z-10 h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">{account.bankName}</h1>
                  <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground font-medium">
                    {t("عرض وإدارة إعدادات حسابك البنكي", "View and manage your bank account settings")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
      <div className="mx-auto w-full max-w-7xl">
        <motion.div initial="hidden" animate="visible" variants={pageVariants} className="space-y-10">
          {/* ════════════════════════════════════════
              SECTION 1 — ACCOUNT OVERVIEW
          ════════════════════════════════════════ */}
          <PageSection
            icon={<IconCashBanknote />}
            title={t("نظرة عامة على الحساب", "Account Overview")}
            subtitle={t("تفاصيل حسابك البنكي والرصيد الحالي", "Your bank account details and current balance")}
          >
            <AccountCard account={account} />
          </PageSection>

          {/* ════════════════════════════════════════
              SECTION 2 — ACTIVITY
          ════════════════════════════════════════ */}
          <PageSection
            icon={<IconList />}
            title={t("النشاط المالي", "Financial Activity")}
            subtitle={t("آخر المعاملات وإحصائيات الإنفاق", "Recent transactions and spending statistics")}
          >
            <div className="space-y-4">
              <SubSection title={t("آخر المعاملات", "Recent Transactions")}>
                <TransactionList
                  transactions={account.recentTransactions || []}
                  currency={account.currency}
                  reducedMotion={reducedMotion}
                />
              </SubSection>

              <SubSection title={t("إحصائيات الإنفاق", "Spending Statistics")}>
                <SpendingStats
                  stats={account.spendingStatistics || { totalSpent: 0, totalReceived: 0, averageDailySpending: 0, topSpendingCategory: "None", monthlyTrend: [], categoryBreakdown: [] }}
                  currency={account.currency}
                  reducedMotion={reducedMotion}
                />
              </SubSection>
            </div>
          </PageSection>

          {/* ════════════════════════════════════════
              SECTION 3 — ACCOUNT CONTROLS
          ════════════════════════════════════════ */}
          <PageSection
            icon={<IconSettings />}
            title={t("إعدادات الحساب", "Account Controls")}
            subtitle={t("تحكم في حالة حسابك وصلاحياته والإجراءات المتاحة", "Manage account status, permissions and quick actions")}
          >
            <div className="space-y-4">
              {/* Status banners */}
              <AnimatePresence>
                {!isActive && (
                  <StatusBanner key="inactive"
                    title={t("الحساب غير نشط", "Inactive Account")}
                    description={t("قم بتفعيل الحساب لتمكين العمليات.", "Activate account to enable transactions.")}
                    className="border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                    icon={<IconAlertTriangle className="h-4 w-4" />}
                    action={{ label: t("تفعيل", "Activate"), onClick: () => actions.toggleActive(true) }}
                  />
                )}
                {isFrozen && (
                  <StatusBanner key="frozen"
                    title={t("البطاقة مجمّدة", "Card Frozen")}
                    description={t("قم بإلغاء التجميد لاستعادة الاستخدام.", "Unfreeze card to resume usage.")}
                    className="border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400"
                    icon={<IconSnowflake className="h-4 w-4" />}
                    action={{ label: t("إلغاء التجميد", "Unfreeze"), onClick: () => actions.toggleFrozen(false) }}
                  />
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Status switches */}
                <SubSection
                  title={t("الحالة", "Status")}
                  badge={
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      isActive && !isFrozen ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                    )}>
                      {isActive && !isFrozen ? t("نشط", "Active") : t("محدود", "Limited")}
                    </span>
                  }
                >
                  <ActionSwitch checked={isActive} onCheckedChange={actions.toggleActive}
                    label={t("الحساب نشط", "Active Account")} description={t("تفعيل أو تعطيل الحساب", "Enable or disable account")}
                    activeLabel={t("مفعّل", "On")} inactiveLabel={t("معطّل", "Off")}
                    icon={<IconPower className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />} iconClass="border-emerald-500/20 bg-emerald-500/10" />
                  <ActionSwitch checked={isFrozen} onCheckedChange={actions.toggleFrozen}
                    label={t("تجميد البطاقة", "Freeze Card")} description={t("إيقاف البطاقة مؤقتاً", "Temporarily disable card")}
                    activeLabel={t("مجمّدة", "Frozen")} inactiveLabel={t("نشطة", "Active")}
                    icon={<IconSnowflake className="h-4 w-4 text-sky-600 dark:text-sky-400" />} iconClass="border-sky-500/20 bg-sky-500/10" />
                </SubSection>

                {/* Permission switches */}
                <SubSection
                  title={t("الصلاحيات", "Permissions")}
                  badge={<span className="text-[10px] font-semibold text-muted-foreground">{activeCount}/4 {t("مفعّل", "enabled")}</span>}
                >
                  <ActionSwitch checked={allowIntl} onCheckedChange={actions.toggleInternational}
                    label={t("المعاملات الدولية", "International Transactions")} description={t("السماح بالدفع خارج الدولة", "Allow foreign transactions")}
                    activeLabel={t("مفعّل", "On")} inactiveLabel={t("معطّل", "Off")}
                    icon={<IconWorld className="h-4 w-4 text-violet-600 dark:text-violet-400" />} iconClass="border-violet-500/20 bg-violet-500/10" />
                  <ActionSwitch checked={allowOnline} onCheckedChange={actions.toggleOnlinePayments}
                    label={t("المدفوعات الإلكترونية", "Online Payments")} description={t("تفعيل الدفع عبر الإنترنت", "Enable online payments")}
                    activeLabel={t("مفعّل", "On")} inactiveLabel={t("معطّل", "Off")}
                    icon={<IconCreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />} iconClass="border-amber-500/20 bg-amber-500/10" />
                </SubSection>
              </div>

              {/* Quick actions */}
              <SubSection title={t("إجراءات سريعة", "Quick Actions")}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <AddFundsDialog currency={account.currency} onAddFunds={actions.addFunds} />
                  <TransferFundsDialog currency={account.currency} onTransferFunds={actions.transferFunds} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div>
                        <QuickActionRow
                          title={t("تصدير الكشف", "Export Statement")} subtitle={t("PDF أو CSV أو Excel", "PDF, CSV or Excel")}
                          icon={<IconDownload className="h-4 w-4 text-muted-foreground" />} iconClass="border-border/50 bg-muted/40"
                          rightSlot={<IconChevronDown className="h-4 w-4 text-muted-foreground/60" />}
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-2xl">
                      {(["pdf", "csv", "excel"] as const).map((fmt) => (
                        <DropdownMenuItem key={fmt} onClick={() => actions.exportStatement(fmt)} className="cursor-pointer rounded-xl">
                          {t(`تصدير ${fmt.toUpperCase()}`, `Export ${fmt.toUpperCase()}`)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SubSection>
            </div>
          </PageSection>

          {/* ════════════════════════════════════════
              SECTION 4 — LIMITS & PERMISSIONS
          ════════════════════════════════════════ */}
          <PageSection
            icon={<IconShieldLock />}
            title={t("الحدود والصلاحيات", "Limits & Permissions")}
            subtitle={t("تحكم في حدود الإنفاق والسحب وصلاحيات الحساب", "Control spending, withdrawal limits and account permissions")}
          >
            <div className="space-y-4">
              {/* Sliders */}
              <SubSection title={t("حدود الإنفاق", "Spending Limits")}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <LimitSlider
                    icon={<IconCreditCard className="h-4 w-4 text-primary" />} iconBg="bg-primary/10 border-primary/20"
                    label={t("حد السحب من الصراف", "ATM Withdrawal Limit")}
                    description={t("الحد الأقصى للسحب من أجهزة الصراف في المعاملة الواحدة", "Maximum amount you can withdraw from ATMs per transaction")}
                    value={account.settings?.atmWithdrawalLimit ?? 5000} min={500} max={20000} step={500}
                    currencySymbol={sym} onChange={actions.updateAtmLimit} reducedMotion={reducedMotion}
                  />
                  <LimitSlider
                    icon={<IconWorld className="h-4 w-4 text-violet-600 dark:text-violet-400" />} iconBg="bg-violet-500/10 border-violet-500/20"
                    label={t("حد الإنفاق اليومي", "Daily Spending Limit")}
                    description={t("الحد الأقصى للإنفاق الإجمالي يومياً عبر جميع المعاملات", "Maximum total spending amount per day across all transactions")}
                    value={account.settings?.dailySpendingLimit ?? 10000} min={1000} max={50000} step={1000}
                    currencySymbol={sym} onChange={actions.updateDailyLimit} reducedMotion={reducedMotion}
                  />
                </div>
              </SubSection>

              {/* Static limits */}
              <SubSection title={t("حدود إضافية", "Additional Limits")}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <LimitRow label={t("حد المعاملات الإلكترونية", "Online Transaction Limit")} sub={t("لكل معاملة", "Per transaction")} value={account.limits?.onlineTransactionLimit ?? 15000} currencySymbol={sym} />
                  <LimitRow label={t("حد التحويل الدولي", "International Transfer Limit")} sub={t("لكل تحويل", "Per transfer")} value={account.limits?.internationalTransferLimit ?? 25000} currencySymbol={sym} />
                </div>
              </SubSection>

              {/* Permission badges */}
              <SubSection title={t("صلاحيات الحساب", "Account Permissions")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {permissions.map(({ icon, label, allowed }) => (
                    <PermissionBadge key={label} icon={icon} label={label} allowed={allowed} />
                  ))}
                </div>
              </SubSection>
            </div>
          </PageSection>

        </motion.div>
      </div>
    </AppLayout>
  );
}

