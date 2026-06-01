"use client";

import { useState, useCallback, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Kbd } from "@/components/ui/kbd";
import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";
import { currencyConfigs } from "../data/banks";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Currency {
  code: string;
  label: string;
  labelAr: string;
  flag: string;
  icon?: React.ReactNode;
}

export interface MoneyInputProps {
  value?: number;
  onChange?: (minorUnits: number, formatted: string, currency: Currency) => void;
  defaultCurrency?: string;
  currencies?: Currency[];
  className?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
}

// ─── Default currencies ───────────────────────────────────────────────────────

const DEFAULT_CURRENCIES: Currency[] = Object.values(currencyConfigs).map(c => ({
  code: c.code,
  label: c.en,
  labelAr: c.ar,
  flag: c.flag,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMinorUnits(minor: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

function formatDisplay(minor: number, language: "en" | "ar"): string {
  if (minor === 0) return "";
  const value = minor / 100;
  return new Intl.NumberFormat(language === "ar" ? "en-US" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MoneyInput({
  value,
  onChange,
  defaultCurrency = "EUR",
  currencies = DEFAULT_CURRENCIES,
  className,
  disabled = false,
  label,
  placeholder = "0.00",
  error,
  hint,
}: MoneyInputProps) {
  const { language, direction } = useLanguage();
  const [internalMinor, setInternalMinor] = useState(0);
  const [currency, setCurrency] = useState<Currency>(
    () => currencies.find((c) => c.code === defaultCurrency) ?? currencies[0]
  );
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const minor = value !== undefined ? value : internalMinor;
  const isRtl = direction === "rtl";
  const isEmpty = minor === 0;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        const next = Math.floor(minor / 10);
        setInternalMinor(next);
        onChange?.(next, formatMinorUnits(next), currency);
        return;
      }

      if (e.key === "Delete") {
        e.preventDefault();
        setInternalMinor(0);
        onChange?.(0, formatMinorUnits(0), currency);
        return;
      }

      if (!/^\d$/.test(e.key)) return;
      e.preventDefault();
      const next = minor * 10 + parseInt(e.key, 10);
      if (next > 99999999) return;
      setInternalMinor(next);
      onChange?.(next, formatMinorUnits(next), currency);
    },
    [minor, currency, disabled, onChange]
  );

  const handleCurrencySelect = (c: Currency) => {
    setCurrency(c);
    setOpen(false);
    onChange?.(minor, formatMinorUnits(minor), c);
    // Return focus to input after selection
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleWrapperClick = () => {
    if (!disabled && !open) {
      inputRef.current?.focus();
    }
  };

  const currencyLabel = language === "ar" ? currency.labelAr : currency.label;

  return (
    <div className={cn("w-full space-y-1.5", className)} dir={isRtl ? "rtl" : "ltr"}>

      {/* Label */}
      {label && (
        <label
          className="block text-sm font-medium text-foreground"
          onClick={handleWrapperClick}
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div
        onClick={handleWrapperClick}
        className={cn(
          "group relative flex items-center h-10 w-full rounded-md border bg-background px-3 text-sm transition-all duration-150 cursor-text",
          // Default state
          "border-input shadow-sm",
          // Focus state
          focused && !error && "border-ring ring-2 ring-ring/20 shadow-none",
          // Error state
          error && "border-destructive",
          error && focused && "ring-2 ring-destructive/20",
          // Disabled state
          disabled && "pointer-events-none cursor-not-allowed opacity-50 bg-muted"
        )}
      >
        {/* Amount input */}
        <input
          ref={inputRef}
          readOnly
          value={isEmpty && !focused ? "" : formatDisplay(minor, language)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="numeric"
          disabled={disabled}
          placeholder={focused ? "0.00" : placeholder}
          aria-label={label ?? "Money amount"}
          aria-invalid={!!error}
          aria-describedby={error ? "money-error" : hint ? "money-hint" : undefined}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground",
          )}
        />

        {/* Clear button — appears when there's a value */}
        {!isEmpty && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault();
              setInternalMinor(0);
              onChange?.(0, formatMinorUnits(0), currency);
            }}
            className="mr-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
            aria-label="Clear amount"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Divider */}
        <div className="h-5 w-px bg-border mx-1.5 shrink-0" />

        {/* Currency picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="h-7 px-2 py-0 gap-1.5 text-sm font-medium shrink-0 hover:bg-muted rounded-md"
              aria-label={`Selected currency: ${currencyLabel}`}
            >
              <span className="text-muted-foreground" aria-hidden>{currency.icon || currency.flag}</span>
              <span className="tracking-wide">{currency.code}</span>
              <ChevronDown
                size={12}
                className={cn("text-muted-foreground/70 transition-transform duration-200", open && "rotate-180")}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align={isRtl ? "start" : "end"}
            sideOffset={6}
            className="w-48 p-1.5 shadow-lg"
          >
            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {t("العملة", "Currency")}
            </p>
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCurrencySelect(c)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  c.code === currency.code
                    ? "bg-accent/50 text-accent-foreground font-medium"
                    : "text-foreground"
                )}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1 text-left font-medium">{c.code}</span>
                <span className="text-muted-foreground text-xs truncate max-w-[60px]">
                  {language === "ar" ? c.labelAr : c.label}
                </span>
                {c.code === currency.code && (
                  <Check size={12} className="shrink-0 text-primary" />
                )}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Error / Hint */}
      {error ? (
        <p id="money-error" className="text-xs text-destructive flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 3.5v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p id="money-hint" className="text-xs text-muted-foreground">{hint}</p>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t("اختصارات:", "Shortcuts:")}</span>
          <div className="flex items-center gap-1">
            <Kbd>⌫</Kbd>
            <span>{t("مسح", "delete")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Kbd>Del</Kbd>
            <span>{t("مسح الكل", "clear all")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoneyInput;