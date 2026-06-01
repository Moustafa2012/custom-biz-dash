import { Badge } from '@/components/ui/badge'
import { t } from '@/lib/translations'

interface StatusBadgeProps {
  status: string
  className?: string
  showIcon?: boolean
}

const statusConfig: Record<string, { ar: string; en: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon?: string }> = {
  active: { ar: 'نشط', en: 'Active', variant: 'default' },
  inactive: { ar: 'غير نشط', en: 'Inactive', variant: 'secondary' },
  suspended: { ar: 'معلق', en: 'Suspended', variant: 'destructive' },
  draft: { ar: 'مسودة', en: 'Draft', variant: 'outline' },
  pending: { ar: 'قيد الانتظار', en: 'Pending', variant: 'secondary', icon: '/assets/media/synex/waiting.png' },
  sent: { ar: 'تم الإرسال', en: 'Sent', variant: 'default' },
  completed: { ar: 'مكتمل', en: 'Completed', variant: 'default', icon: '/assets/media/synex/success.png' },
  rejected: { ar: 'مرفوض', en: 'Rejected', variant: 'destructive' },
  cancelled: { ar: 'ملغي', en: 'Cancelled', variant: 'destructive' },
}

export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const config = statusConfig[status] || { ar: status, en: status, variant: 'outline' as const }
  
  return (
    <Badge variant={config.variant} className={className}>
      {showIcon && config.icon && (
        <img src={config.icon} alt="" className="h-3 w-3 mr-1.5 object-contain" />
      )}
      {t(config.ar, config.en)}
    </Badge>
  )
}
