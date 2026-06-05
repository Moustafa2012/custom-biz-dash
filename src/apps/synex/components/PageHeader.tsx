import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  /** Optional path to an image (replaces icon when provided) */
  iconSrc?: string
  actions?: ReactNode
  className?: string
}

/**
 * Unified page header used across all synex pages.
 * Matches the Accounts page pattern: 12×12 rounded-xl icon tile,
 * truncated title + subtitle, right-aligned action group, border-b divider.
 */
export function PageHeader({
  title,
  description,
  icon,
  iconSrc,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 shadow-xs overflow-hidden">
          {iconSrc ? (
            <img src={iconSrc} alt="" className="h-7 w-7 object-contain" />
          ) : (
            <span className="text-primary [&>svg]:h-6 [&>svg]:w-6">{icon}</span>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground font-medium">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-center">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
