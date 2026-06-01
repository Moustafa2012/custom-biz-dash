import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { t } from '@/lib/translations'
import { getCountryByCode, validateField } from '../data/banks'
import type { BankingField } from '../data/banks'

interface DynamicBankFieldsProps {
  country: string
  values: Record<string, string>
  onChange: (field: string, value: string) => void
  errors?: Record<string, string>
  disabled?: boolean
}

export function DynamicBankFields({ country, values, onChange, errors, disabled = false }: DynamicBankFieldsProps) {
  const countrySchema = getCountryByCode(country)
  
  if (!countrySchema) {
    return (
      <div className="text-sm text-muted-foreground">
        {t('الرجاء اختيار دولة', 'Please select a country')}
      </div>
    )
  }

  const getFieldError = (field: BankingField, value: string): string | undefined => {
    const result = validateField(field, value)
    if (result.valid) return undefined

    if (result.error === 'required') return t('هذا الحقل مطلوب', 'This field is required')
    if (result.error === 'pattern') return t('التنسيق غير صحيح', 'Invalid format')
    if (result.error?.startsWith('minLength:')) {
      const min = result.error.split(':')[1]
      return t(`الحد الأدنى ${min} أرقام`, `Minimum ${min} characters`)
    }
    if (result.error?.startsWith('maxLength:')) {
      const max = result.error.split(':')[1]
      return t(`الحد الأقصى ${max} أرقام`, `Maximum ${max} characters`)
    }
    if (result.error?.startsWith('exactLength:')) {
      const exact = result.error.split(':')[1]
      return t(`يجب أن يكون ${exact} أرقام`, `Must be exactly ${exact} characters`)
    }
    
    return t('قيمة غير صالحة', 'Invalid value')
  }

  return (
    <div className="space-y-4">
      {countrySchema.fields.map((field) => {
        const error = errors?.[field.key] || getFieldError(field, values[field.key] || '')
        
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {t(field.label.ar, field.label.en)}
              {field.validation?.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type={field.type === 'numeric' ? 'text' : field.type}
              inputMode={field.inputMode}
              placeholder={t(field.placeholder.ar, field.placeholder.en)}
              value={values[field.key] || ''}
              onChange={(e) => {
                let val = e.target.value
                if (field.sanitizer) val = field.sanitizer(val)
                if (field.formatter) val = field.formatter(val)
                onChange(field.key, val)
              }}
              disabled={disabled}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
