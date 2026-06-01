import { memo, useMemo } from 'react'
import { t } from '@/lib/translations'
import { cn } from '@/lib/utils'
import { currencyConfigs } from '../data/banks'

interface CurrencyAmountProps {
  amount: number
  currency: string
  className?: string
  showSymbol?: boolean
  showCode?: boolean
  locale?: string
  compact?: boolean
  colorize?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export const CurrencyAmount = memo(function CurrencyAmount({
  amount,
  currency,
  className,
  showSymbol = true,
  showCode = false,
  locale = 'en-US',
  compact = false,
  colorize = false,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
}: CurrencyAmountProps) {
  const config = currencyConfigs[currency] || {
    ar: currency,
    en: currency,
    position: 'after',
  }

  const isNegative = amount < 0
  const isZero = amount === 0

  const absoluteAmount = Math.abs(amount)

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      notation: compact ? 'compact' : 'standard',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(absoluteAmount)
  }, [
    absoluteAmount,
    compact,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
  ])

  const symbol = t(config.ar, config.en)

  const formattedCurrency = useMemo(() => {
    if (!showSymbol) {
      return `${currency} ${formattedAmount}`
    }

    const value =
      config.position === 'before'
        ? `${symbol} ${formattedAmount}`
        : `${formattedAmount} ${symbol}`

    return showCode ? `${value} ${currency}` : value
  }, [
    config.position,
    currency,
    formattedAmount,
    showCode,
    showSymbol,
    symbol,
  ])

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium tabular-nums tracking-tight transition-colors',
        colorize && [
          isNegative && 'text-red-500 dark:text-red-400',
          !isNegative && !isZero && 'text-emerald-600 dark:text-emerald-400',
          isZero && 'text-muted-foreground',
        ],
        className
      )}
      dir="ltr"
    >
      {isNegative && (
        <span className="font-semibold">
          -
        </span>
      )}

      <span>
        {formattedCurrency}
      </span>
    </span>
  )
})