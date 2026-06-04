import { Badge } from '@/components/ui/badge'
import { t } from '@/lib/translations'
import {
  IconClock, IconCircleCheck, IconCircleX, IconAlertTriangle,
  IconHourglass, IconSend, IconBan, IconPencil, IconCircleDot,
} from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

interface StatusBadgeProps {
  status: string
  className?: string
  showIcon?: boolean
}

const statusConfig: Record<string, { ar: string; en: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; Icon?: Icon }> = {
  active:           { ar: 'نشط',           en: 'Active',           variant: 'default', Icon: IconCircleCheck },
  inactive:         { ar: 'غير نشط',       en: 'Inactive',         variant: 'secondary', Icon: IconCircleDot },
  suspended:        { ar: 'معلق',          en: 'Suspended',        variant: 'destructive', Icon: IconBan },
  draft:            { ar: 'مسودة',         en: 'Draft',            variant: 'outline', Icon: IconPencil },
  pending:          { ar: 'قيد الانتظار',  en: 'Pending',          variant: 'secondary', Icon: IconClock },
  pending_approval: { ar: 'بانتظار الموافقة', en: 'Pending Approval', variant: 'secondary', Icon: IconHourglass },
  approved:         { ar: 'تمت الموافقة',  en: 'Approved',         variant: 'default', Icon: IconCircleCheck },
  sent:             { ar: 'تم الإرسال',    en: 'Sent',             variant: 'default', Icon: IconSend },
  settled:          { ar: 'تمت التسوية',   en: 'Settled',          variant: 'default', Icon: IconCircleCheck },
  completed:        { ar: 'مكتمل',         en: 'Completed',        variant: 'default', Icon: IconCircleCheck },
  rejected:         { ar: 'مرفوض',         en: 'Rejected',         variant: 'destructive', Icon: IconCircleX },
  cancelled:        { ar: 'ملغي',          en: 'Cancelled',        variant: 'destructive', Icon: IconCircleX },
  voided:           { ar: 'مُبطل',         en: 'Voided',           variant: 'destructive', Icon: IconBan },
  failed:           { ar: 'فشل',           en: 'Failed',           variant: 'destructive', Icon: IconAlertTriangle },
}

export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const config = statusConfig[status] || { ar: status, en: status, variant: 'outline' as const }
  const Ico = config.Icon

  return (
    <Badge variant={config.variant} className={className}>
      {showIcon && Ico && <Ico className="h-3 w-3 mr-1.5" />}
      {t(config.ar, config.en)}
    </Badge>
  )
}
