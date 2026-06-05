import { memo, useEffect, useState, useMemo } from "react";
import { CreditCard, Wifi, AlertCircle, PauseCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";


import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";

import type { Account } from "@/apps/synex/data/mock";

// ─────────────────────────────────────────────────────────
// CURRENCY CONFIG — maps currencies to flag + symbol display
// ─────────────────────────────────────────────────────────

export const CURRENCY_META: Record<string, { flag: string; symbol: string; isRtlSymbol?: boolean }> = {
  SAR: { flag: "🇸🇦", symbol: "ر.س", isRtlSymbol: true },
  AED: { flag: "🇦🇪", symbol: "د.إ", isRtlSymbol: true },
  USD: { flag: "🇺🇸", symbol: "$" },
  EUR: { flag: "🇪🇺", symbol: "€" },
  GBP: { flag: "🇬🇧", symbol: "£" },
  INR: { flag: "🇮🇳", symbol: "₹" },
  CAD: { flag: "🇨🇦", symbol: "C$" },
  AUD: { flag: "🇦🇺", symbol: "A$" },
  CNY: { flag: "🇨🇳", symbol: "¥" },
  JPY: { flag: "🇯🇵", symbol: "¥" },
  KWD: { flag: "🇰🇼", symbol: "د.ك", isRtlSymbol: true },
  QAR: { flag: "🇶🇦", symbol: "ر.ق", isRtlSymbol: true },
  BHD: { flag: "🇧🇭", symbol: "د.ب", isRtlSymbol: true },
  OMR: { flag: "🇴🇲", symbol: "ر.ع.", isRtlSymbol: true },
  EGP: { flag: "🇪🇬", symbol: "ج.م", isRtlSymbol: true },
  PKR: { flag: "🇵🇰", symbol: "₨" },
  NGN: { flag: "🇳🇬", symbol: "₦" },
};

// ─────────────────────────────────────────────────────────
// ACCOUNT TYPE LABEL MAP
// ─────────────────────────────────────────────────────────

const ACCOUNT_TYPE_LABEL: Record<string, { ar: string; en: string }> = {
  checking: { ar: "حساب جاري", en: "Checking" },
  savings:  { ar: "حساب توفير", en: "Savings" },
  business: { ar: "حساب تجاري", en: "Business" },
  corporate:{ ar: "حساب مؤسسي", en: "Corporate" },
};

// ─────────────────────────────────────────────────────────
// BANK COLOR PALETTE — per-bank accent gradient
// ─────────────────────────────────────────────────────────

function getBankAccent(bankName: string): { from: string; via: string; to: string; chip: string } {
  const n = bankName?.toLowerCase() ?? "";
  if (n.includes("راجحي") || n.includes("rajhi"))
    return { from: "#0a2540", via: "#0f3460", to: "#1a4a7a", chip: "#2a7bbf" };
  if (n.includes("إنماء") || n.includes("alinma") || n.includes("inma"))
    return { from: "#0d2818", via: "#1a4a2e", to: "#225c38", chip: "#3a9960" };
  if (n.includes("فرنسي") || n.includes("french") || n.includes("saudi french"))
    return { from: "#1a0a2e", via: "#2d1650", to: "#3d2060", chip: "#8a4fc0" };
  if (n.includes("emirates") || n.includes("nbd"))
    return { from: "#1a1000", via: "#3d2800", to: "#5c3d00", chip: "#c8900a" };
  if (n.includes("رياض") || n.includes("riyad"))
    return { from: "#1a0a0a", via: "#3d1515", to: "#5c2020", chip: "#c83232" };
  if (n.includes("أهلي") || n.includes("ahli") || n.includes("national"))
    return { from: "#080f1a", via: "#102030", to: "#162d45", chip: "#2c6ea0" };
  // default slate-navy
  return { from: "#0a0f1a", via: "#111827", to: "#1a2435", chip: "#4a6080" };
}

// ─────────────────────────────────────────────────────────
// STATUS INDICATOR
// ─────────────────────────────────────────────────────────

const StatusPill = memo(function StatusPill({ status }: { status: Account["status"] }) {
  if (status === "active") return null;

  const cfg = {
    inactive:  { icon: <PauseCircle className="size-2.5" />, label: t("غير نشط", "Inactive"),  cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    suspended: { icon: <AlertCircle className="size-2.5" />, label: t("موقوف", "Suspended"),    cls: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest", cfg.cls)}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
});

// ─────────────────────────────────────────────────────────
// NETWORK / BANK BADGE
// ─────────────────────────────────────────────────────────

interface NetworkBadgeProps {
  bankName?: string;
  currency?: string;
  className?: string;
}

export const NetworkBadge = memo(function NetworkBadge({ bankName, currency, className }: NetworkBadgeProps) {
  const flag = currency ? CURRENCY_META[currency]?.flag : undefined;
  const normalizedBank = bankName?.toLowerCase() ?? "";

  if (normalizedBank.includes("visa")) {
    return (
      <span className={cn("text-base font-black italic tracking-tighter text-white/90 select-none", className)}>
        VISA
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-2.5 py-1", className)}>
      {flag && <span className="text-xs leading-none">{flag}</span>}
      <Wifi className="size-2.5 text-white/50" aria-hidden="true" />
      <span className="text-[8px] font-bold tracking-widest uppercase text-white/60">
        {currency ?? t("رقمي", "Digital")}
      </span>
    </div>
  );
});

// ─────────────────────────────────────────────────────────
// IBAN DISPLAY FORMATTER
// ─────────────────────────────────────────────────────────

function formatIbanDisplay(iban: string): string {
  if (!iban) return "•••• •••• ••••";
  // show first 4 + masked middle + last 4
  const clean = iban.replace(/\s/g, "");
  if (clean.length <= 8) return clean;
  const first = clean.slice(0, 4);
  const last  = clean.slice(-4);
  const mid   = "•".repeat(Math.min(clean.length - 8, 12));
  return `${first} ${mid} ${last}`;
}

function formatAccountNumber(accountNumber: string): string {
  if (!accountNumber) return "•••• •••• ••••";
  const clean = accountNumber.replace(/\s/g, "");
  // last 4 visible, rest masked, group by 4
  const visible = clean.slice(-4);
  const masked  = "•••• •••• ";
  return `${masked}${visible}`;
}

// ─────────────────────────────────────────────────────────
// PROJECTED BALANCE DELTA
// ─────────────────────────────────────────────────────────

function ProjectedDelta({ current, projected, currency }: { current: number; projected: number; currency: string }) {
  const delta = projected - current;
  const pct   = current > 0 ? (delta / current) * 100 : 0;
  const isUp  = delta >= 0;
  const meta  = CURRENCY_META[currency];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "flex items-center gap-1 rounded-full px-2 py-0.5 border text-[9px] font-bold tabular-nums cursor-default select-none",
          isUp
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-rose-500/10 border-rose-500/20 text-rose-400",
        )}>
          <span>{isUp ? "▲" : "▼"}</span>
          <span>{Math.abs(pct).toFixed(1)}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[10px]">
        {t("الرصيد المتوقع:", "Projected:")}{" "}
        {projected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
        {meta?.symbol ?? currency}
      </TooltipContent>
    </Tooltip>
  );
}

// ─────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────

export const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div aria-hidden="true" className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden border border-white/5 bg-[#0d1117]">
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded bg-white/5" />
            <Skeleton className="h-3 w-16 rounded bg-white/5" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded bg-white/5" />
          <Skeleton className="h-7 w-40 rounded bg-white/5" />
        </div>
        <div className="flex justify-between items-end">
          <Skeleton className="h-3 w-44 rounded bg-white/5" />
          <Skeleton className="h-5 w-14 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────
// BANKING CARD FACE
// ─────────────────────────────────────────────────────────

interface BankingCardFaceProps {
  account: Account;
  active: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}

export const BankingCardFace = memo(function BankingCardFace({
  account,
  active,
  reducedMotion,
  onClick,
}: BankingCardFaceProps) {
  const { direction } = useLanguage();
  const accent = getBankAccent(account.bankName);
  const currencyMeta = CURRENCY_META[account.currency];

  const accountTypeLabel = useMemo(() => {
    if (!account.accountType) return t("حساب بنكي", "Bank Account");
    const entry = ACCOUNT_TYPE_LABEL[account.accountType];
    return direction === "rtl" ? entry.ar : entry.en;
  }, [account.accountType, direction]);

  const displayIban = useMemo(() => formatIbanDisplay(account.iban), [account.iban]);
  const displayAccountNum = useMemo(() => formatAccountNumber(account.accountNumber), [account.accountNumber]);
  const isInactive = account.status !== "active";

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "w-full aspect-[1.586/1] outline-none select-none cursor-pointer",
          "transition-all duration-500",
          active ? "scale-[1.01]" : "scale-[0.985] opacity-80 hover:opacity-100 hover:scale-[0.992]",
          !reducedMotion && "motion-safe:transition-all",
        )}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
        }}
        aria-label={`${account.bankName} — ${account.currentBalance.toLocaleString()} ${account.currency}`}
        aria-pressed={active}
      >
        {/* Card shell */}
        <div
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-500",
            active
              ? "border-white/12 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]"
              : "border-white/5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)]",
          )}
          style={{
            background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.via} 50%, ${accent.to} 100%)`,
          }}
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px" }}
          />

          {/* Radial ambient glow — top right */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent.chip}cc 0%, transparent 70%)` }}
          />

          {/* Horizontal shimmer line */}
          {active && (
            <div className="absolute top-0 inset-x-0 h-px opacity-30"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${accent.chip} 50%, transparent 100%)` }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">

            {/* ── Top Row ── */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Bank monogram */}
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border border-white/10 text-white/90 text-[11px] font-black tracking-wider shadow-inner"
                  style={{ background: `linear-gradient(145deg, ${accent.chip}40, ${accent.chip}10)` }}
                >
                  {account.bankName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white/95 truncate leading-tight">
                    {account.bankName}
                  </h3>
                  <p className="text-[10px] text-white/45 capitalize mt-0.5 tracking-wider font-medium">
                    {accountTypeLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <NetworkBadge bankName={account.bankName} currency={account.currency} />
                <StatusPill status={account.status} />
              </div>
            </div>

            {/* ── Middle — Balance ── */}
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold tracking-[0.18em] text-white/35 uppercase">
                {t("الرصيد الحالي", "Current Balance")}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tabular-nums text-white leading-none tracking-tight"
                  style={{ textShadow: "0 0 30px rgba(255,255,255,0.1)" }}
                >
                  {isInactive ? (
                    <span className="opacity-40">••••••</span>
                  ) : (
                    account.currentBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  )}
                </span>
                {currencyMeta && (
                  <span className="text-xs font-semibold text-white/40 tracking-wider">
                    {currencyMeta.symbol}
                  </span>
                )}
                {!isInactive && (
                  <ProjectedDelta
                    current={account.currentBalance}
                    projected={account.projectedBalance}
                    currency={account.currency}
                  />
                )}
              </div>
            </div>

            {/* ── Bottom Row — IBAN + Account Number ── */}
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-1 min-w-0">
                {/* IBAN line */}
                <p className="font-mono text-[10px] tracking-[0.15em] text-white/30 font-medium">
                  IBAN
                </p>
                <p className="font-mono text-xs tracking-widest text-white/60 font-medium truncate">
                  {displayIban}
                </p>
              </div>

              {/* Smart chip visual */}
              <div
                className="h-8 w-10 rounded-md border border-white/8 shrink-0 relative overflow-hidden hidden sm:block opacity-60"
                style={{ background: `linear-gradient(145deg, ${accent.chip}25, ${accent.chip}05)` }}
                aria-hidden="true"
              >
                {/* Chip grid lines */}
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/10" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                <div className="absolute inset-x-0 top-1/4 h-px bg-white/[0.05]" />
                <div className="absolute inset-x-0 top-3/4 h-px bg-white/[0.05]" />
              </div>
            </div>

            {/* Masked account number — bottom strip */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
              <span className="font-mono text-[11px] tracking-widest text-white/25 font-medium">
                {displayAccountNum}
              </span>
              {account.contactPerson && (
                <span className="text-[9px] text-white/25 font-medium truncate max-w-[120px]">
                  {account.contactPerson}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

// ─────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      "w-full aspect-[1.586/1] rounded-2xl",
      "border border-dashed border-white/8",
      "bg-white/[0.02] text-white/30",
    )}>
      <div className="p-3 rounded-full bg-white/5 border border-white/8">
        <CreditCard className="size-5 text-white/30" />
      </div>
      <p className="text-xs font-medium tracking-wide">{t("لا توجد حسابات متوفرة", "No accounts available")}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CAROUSEL CARDS — MAIN EXPORT
// ─────────────────────────────────────────────────────────

interface CarouselCardsProps {
  accounts: Account[];
  selectedAccountId?: string;
  onSelect?: (id: string) => void;
  isLoading?: boolean;
}

export default function CarouselCards({
  accounts = [],
  selectedAccountId,
  onSelect,
  isLoading = false,
}: CarouselCardsProps) {
  const { direction } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!api || !selectedAccountId) return;
    const idx = accounts.findIndex((a) => a.id === selectedAccountId);
    if (idx !== -1 && idx !== current) api.scrollTo(idx);
  }, [selectedAccountId, accounts, api, current]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!accounts || accounts.length === 0) return <EmptyState />;

  const activeId = selectedAccountId ?? accounts[current]?.id;

  return (
    <div className="w-full space-y-4">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          direction: direction === "rtl" ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent className="-ms-3">
          {accounts.map((account, index) => (
            <CarouselItem
              key={account.id}
              className="ps-3 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <BankingCardFace
                account={account}
                active={account.id === activeId}
                reducedMotion={reducedMotion}
                onClick={() => {
                  api?.scrollTo(index);
                  onSelect?.(account.id);
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination dots */}
      {accounts.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {accounts.map((_, i) => (
            <Button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
                i === current
                  ? "w-5 h-1 bg-white/60"
                  : "w-1 h-1 bg-white/15 hover:bg-white/30",
              )}
              aria-label={`${t("الانتقال إلى الشريحة", "Go to slide")} ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {t(
          `الحساب المعروض حاليًا: ${accounts[current]?.bankName}`,
          `Currently showing: ${accounts[current]?.bankName}`,
        )}
      </div>
    </div>
  );
}
