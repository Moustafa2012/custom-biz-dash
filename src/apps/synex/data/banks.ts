export type FieldType = 'text' | 'select' | 'numeric' | 'alphanumeric'
export type TransferType = 'local' | 'swift' | 'sepa' | 'ach' | 'wire'

export interface BankingField {
  key: string
  label: { ar: string; en: string }
  placeholder: { ar: string; en: string }
  hint?: { ar: string; en: string }
  type: FieldType
  inputMode?: 'numeric' | 'text' | 'none'
  autoComplete?: string
  options?: { value: string; label: { ar: string; en: string } }[]
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    required?: boolean
    exactLength?: number
  }
  formatter?: (value: string) => string
  sanitizer?: (value: string) => string
}

export interface CountryBankingSchema {
  code: string
  name: { ar: string; en: string }
  currency: string
  currencySymbol: string
  flag: string
  transferTypes: TransferType[]
  fields: BankingField[]
  notes?: { ar: string; en: string }
}

const ibanFormatter = (value: string) =>
  value
    .replace(/\s/g, '')
    .toUpperCase()
    .replace(/(.{4})/g, '$1 ')
    .trim()

const swiftSanitizer = (value: string) => value.replace(/\s/g, '').toUpperCase()

const numericSanitizer = (value: string) => value.replace(/\D/g, '')

const alphaNumericSanitizer = (value: string) =>
  value.replace(/[^A-Z0-9]/gi, '').toUpperCase()

export const countryBankingSchemas: Record<string, CountryBankingSchema> = {
  SA: {
    code: 'SA',
    name: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
    currency: 'SAR',
    currencySymbol: '﷼',
    flag: '🇸🇦',
    transferTypes: ['swift', 'local'],
    fields: [
      {
        key: 'iban',
        label: { ar: 'رقم الآيبان', en: 'IBAN' },
        placeholder: { ar: 'SA00 0000 0000 0000 0000 0000', en: 'SA00 0000 0000 0000 0000 0000' },
        hint: { ar: '26 حرفاً ورقماً', en: '26 characters' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^SA\d{24}$/,
          exactLength: 26,
          required: true,
        },
        formatter: ibanFormatter,
        sanitizer: (v) => v.replace(/\s/g, '').toUpperCase(),
      },
      {
        key: 'swift',
        label: { ar: 'رمز السويفت', en: 'SWIFT / BIC' },
        placeholder: { ar: 'XXXXXXXXXX', en: 'XXXXXX XX XXX' },
        hint: { ar: '8 أو 11 حرفاً', en: '8 or 11 characters' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
          minLength: 8,
          maxLength: 11,
          required: true,
        },
        sanitizer: swiftSanitizer,
      },
    ],
  },

  AE: {
    code: 'AE',
    name: { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates' },
    currency: 'AED',
    currencySymbol: 'د.إ',
    flag: '🇦🇪',
    transferTypes: ['swift', 'local'],
    fields: [
      {
        key: 'iban',
        label: { ar: 'رقم الآيبان', en: 'IBAN' },
        placeholder: { ar: 'AE00 0000 0000 0000 0000 000', en: 'AE00 0000 0000 0000 0000 000' },
        hint: { ar: '23 رقماً بعد AE', en: '23 digits after AE' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^AE\d{23}$/,
          exactLength: 25,
          required: true,
        },
        formatter: ibanFormatter,
        sanitizer: (v) => v.replace(/\s/g, '').toUpperCase(),
      },
      {
        key: 'swift',
        label: { ar: 'رمز السويفت', en: 'SWIFT / BIC' },
        placeholder: { ar: 'XXXXXXXXXXXXXX', en: 'XXXXXX XX XXX' },
        hint: { ar: '8 أو 11 حرفاً', en: '8 or 11 characters' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
          minLength: 8,
          maxLength: 11,
          required: true,
        },
        sanitizer: swiftSanitizer,
      },
    ],
  },

  US: {
    code: 'US',
    name: { ar: 'الولايات المتحدة الأمريكية', en: 'United States' },
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    transferTypes: ['ach', 'wire'],
    fields: [
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب البنكي', en: 'Account Number' },
        placeholder: { ar: '000000000000', en: '000000000000' },
        hint: { ar: 'من 4 إلى 17 رقماً', en: '4–17 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{4,17}$/,
          minLength: 4,
          maxLength: 17,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'routingNumber',
        label: { ar: 'رقم التوجيه ABA', en: 'ABA Routing Number' },
        placeholder: { ar: '000000000', en: '000000000' },
        hint: { ar: '9 أرقام', en: 'Exactly 9 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{9}$/,
          exactLength: 9,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
    ],
  },

  GB: {
    code: 'GB',
    name: { ar: 'المملكة المتحدة', en: 'United Kingdom' },
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'sortCode',
        label: { ar: 'رمز الفرز', en: 'Sort Code' },
        placeholder: { ar: 'XX-XX-XX', en: 'XX-XX-XX' },
        hint: { ar: '6 أرقام بصيغة XX-XX-XX', en: '6 digits in XX-XX-XX format' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{2}-\d{2}-\d{2}$/,
          exactLength: 8,
          required: true,
        },
        formatter: (v) => {
          const digits = v.replace(/\D/g, '').slice(0, 6)
          return digits.replace(/(\d{2})(?=\d)/g, '$1-')
        },
        sanitizer: (v) => v.replace(/\D/g, '').slice(0, 6).replace(/(\d{2})(?=\d)/g, '$1-'),
      },
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '00000000', en: '00000000' },
        hint: { ar: '8 أرقام', en: 'Exactly 8 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{8}$/,
          exactLength: 8,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
    ],
  },

  EU: {
    code: 'EU',
    name: { ar: 'الاتحاد الأوروبي', en: 'European Union' },
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇪🇺',
    transferTypes: ['sepa', 'swift'],
    fields: [
      {
        key: 'iban',
        label: { ar: 'رقم الآيبان', en: 'IBAN' },
        placeholder: { ar: 'XX00 XXXX XXXX XXXX XXXX XX', en: 'XX00 XXXX XXXX XXXX XXXX XX' },
        hint: { ar: 'يبدأ برمز بلدين ثم أرقام', en: 'Starts with 2-letter country code' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}[A-Z0-9]{0,16}$/,
          minLength: 15,
          maxLength: 34,
          required: true,
        },
        formatter: ibanFormatter,
        sanitizer: (v) => v.replace(/\s/g, '').toUpperCase(),
      },
      {
        key: 'bic',
        label: { ar: 'رمز BIC / السويفت', en: 'BIC / SWIFT Code' },
        placeholder: { ar: 'XXXXXXXXXXXXXX', en: 'XXXXXX XX XXX' },
        hint: { ar: '8 أو 11 حرفاً', en: '8 or 11 characters' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
          minLength: 8,
          maxLength: 11,
          required: true,
        },
        sanitizer: swiftSanitizer,
      },
    ],
  },

  IN: {
    code: 'IN',
    name: { ar: 'الهند', en: 'India' },
    currency: 'INR',
    currencySymbol: '₹',
    flag: '🇮🇳',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '000000000000000000', en: '000000000000000000' },
        hint: { ar: 'من 9 إلى 18 رقماً', en: '9–18 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{9,18}$/,
          minLength: 9,
          maxLength: 18,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'ifscCode',
        label: { ar: 'رمز IFSC', en: 'IFSC Code' },
        placeholder: { ar: 'XXXX0000000', en: 'XXXX0000000' },
        hint: { ar: '4 أحرف + 0 + 6 أحرف/أرقام', en: '4 letters + 0 + 6 alphanumeric' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
          exactLength: 11,
          required: true,
        },
        sanitizer: alphaNumericSanitizer,
      },
    ],
  },

  CA: {
    code: 'CA',
    name: { ar: 'كندا', en: 'Canada' },
    currency: 'CAD',
    currencySymbol: 'CA$',
    flag: '🇨🇦',
    transferTypes: ['local', 'wire'],
    fields: [
      {
        key: 'transitNumber',
        label: { ar: 'رقم العبور', en: 'Transit Number' },
        placeholder: { ar: '00000', en: '00000' },
        hint: { ar: '5 أرقام', en: 'Exactly 5 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{5}$/,
          exactLength: 5,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'institutionNumber',
        label: { ar: 'رقم المؤسسة', en: 'Institution Number' },
        placeholder: { ar: '000', en: '000' },
        hint: { ar: '3 أرقام', en: 'Exactly 3 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{3}$/,
          exactLength: 3,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '0000000000000', en: '0000000000000' },
        hint: { ar: 'من 7 إلى 12 رقماً', en: '7–12 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{7,12}$/,
          minLength: 7,
          maxLength: 12,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
    ],
  },

  AU: {
    code: 'AU',
    name: { ar: 'أستراليا', en: 'Australia' },
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'bsbCode',
        label: { ar: 'رمز BSB', en: 'BSB Code' },
        placeholder: { ar: 'XXX-XXX', en: 'XXX-XXX' },
        hint: { ar: '6 أرقام بصيغة XXX-XXX', en: '6 digits in XXX-XXX format' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{3}-\d{3}$/,
          exactLength: 7,
          required: true,
        },
        formatter: (v) => {
          const digits = v.replace(/\D/g, '').slice(0, 6)
          return digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits
        },
        sanitizer: (v) => {
          const digits = v.replace(/\D/g, '').slice(0, 6)
          return digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits
        },
      },
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '0000000000', en: '0000000000' },
        hint: { ar: 'من 6 إلى 10 أرقام', en: '6–10 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{6,10}$/,
          minLength: 6,
          maxLength: 10,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
    ],
  },

  CN: {
    code: 'CN',
    name: { ar: 'الصين', en: 'China' },
    currency: 'CNY',
    currencySymbol: '¥',
    flag: '🇨🇳',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'cnapsCode',
        label: { ar: 'رمز CNAPS', en: 'CNAPS Code' },
        placeholder: { ar: '000000000000', en: '000000000000' },
        hint: { ar: '12 رقماً بالضبط', en: 'Exactly 12 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{12}$/,
          exactLength: 12,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '00000000000000000000', en: '00000000000000000000' },
        hint: { ar: 'من 8 إلى 20 رقماً', en: '8–20 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{8,20}$/,
          minLength: 8,
          maxLength: 20,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
    ],
  },

  JP: {
    code: 'JP',
    name: { ar: 'اليابان', en: 'Japan' },
    currency: 'JPY',
    currencySymbol: '¥',
    flag: '🇯🇵',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'zenginCode',
        label: { ar: 'رمز Zengin (رقم البنك)', en: 'Zengin Bank Code' },
        placeholder: { ar: '0000', en: '0000' },
        hint: { ar: '4 أرقام', en: 'Exactly 4 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{4}$/,
          exactLength: 4,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'branchCode',
        label: { ar: 'رمز الفرع', en: 'Branch Code' },
        placeholder: { ar: '000', en: '000' },
        hint: { ar: '3 أرقام', en: 'Exactly 3 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{3}$/,
          exactLength: 3,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '0000000', en: '0000000' },
        hint: { ar: 'من 6 إلى 8 أرقام', en: '6–8 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{6,8}$/,
          minLength: 6,
          maxLength: 8,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
    ],
  },

  EG: {
    code: 'EG',
    name: { ar: 'مصر', en: 'Egypt' },
    currency: 'EGP',
    currencySymbol: 'ج.م',
    flag: '🇪🇬',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '000000000000000000000', en: '000000000000000000000' },
        hint: { ar: 'من 10 إلى 21 رقماً', en: '10–21 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{10,21}$/,
          minLength: 10,
          maxLength: 21,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'swift',
        label: { ar: 'رمز السويفت', en: 'SWIFT / BIC' },
        placeholder: { ar: 'XXXXXXXXXXXXXX', en: 'XXXXXX XX XXX' },
        hint: { ar: '8 أو 11 حرفاً', en: '8 or 11 characters' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
          minLength: 8,
          maxLength: 11,
          required: true,
        },
        sanitizer: swiftSanitizer,
      },
    ],
  },

  PK: {
    code: 'PK',
    name: { ar: 'باكستان', en: 'Pakistan' },
    currency: 'PKR',
    currencySymbol: '₨',
    flag: '🇵🇰',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'iban',
        label: { ar: 'رقم الآيبان', en: 'IBAN' },
        placeholder: { ar: 'PK00 XXXX 0000 0000 0000 0000', en: 'PK00 XXXX 0000 0000 0000 0000' },
        hint: { ar: '24 حرفاً ورقماً', en: '24 characters' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^PK\d{2}[A-Z]{4}\d{16}$/,
          exactLength: 24,
          required: true,
        },
        formatter: ibanFormatter,
        sanitizer: (v) => v.replace(/\s/g, '').toUpperCase(),
      },
      {
        key: 'swift',
        label: { ar: 'رمز السويفت', en: 'SWIFT / BIC' },
        placeholder: { ar: 'XXXXXXXXXXXXXX', en: 'XXXXXX XX XXX' },
        hint: { ar: '8 أو 11 حرفاً', en: '8 or 11 characters' },
        type: 'alphanumeric',
        inputMode: 'text',
        autoComplete: 'off',
        validation: {
          pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
          minLength: 8,
          maxLength: 11,
          required: true,
        },
        sanitizer: swiftSanitizer,
      },
    ],
  },

  NG: {
    code: 'NG',
    name: { ar: 'نيجيريا', en: 'Nigeria' },
    currency: 'NGN',
    currencySymbol: '₦',
    flag: '🇳🇬',
    transferTypes: ['local', 'swift'],
    fields: [
      {
        key: 'accountNumber',
        label: { ar: 'رقم الحساب', en: 'Account Number' },
        placeholder: { ar: '0000000000', en: '0000000000' },
        hint: { ar: '10 أرقام بالضبط', en: 'Exactly 10 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{10}$/,
          exactLength: 10,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
      {
        key: 'bankCode',
        label: { ar: 'رمز البنك', en: 'Bank Code' },
        placeholder: { ar: '000', en: '000' },
        hint: { ar: '3 أرقام', en: 'Exactly 3 digits' },
        type: 'numeric',
        inputMode: 'numeric',
        autoComplete: 'off',
        validation: {
          pattern: /^\d{3}$/,
          exactLength: 3,
          required: true,
        },
        sanitizer: numericSanitizer,
      },
    ],
  },
}

export interface CurrencyConfig {
  code: string
  ar: string
  en: string
  symbol: string
  flag: string
  position: 'before' | 'after'
}

export const currencyConfigs: Record<string, CurrencyConfig> = {
  SAR: { code: 'SAR', ar: 'ر.س', en: 'SAR', symbol: '﷼', flag: '🇸🇦', position: 'after' },
  USD: { code: 'USD', ar: '$', en: 'USD', symbol: '$', flag: '🇺🇸', position: 'before' },
  EUR: { code: 'EUR', ar: '€', en: 'EUR', symbol: '€', flag: '🇪🇺', position: 'before' },
  GBP: { code: 'GBP', ar: '£', en: 'GBP', symbol: '£', flag: '🇬🇧', position: 'before' },
  AED: { code: 'AED', ar: 'د.إ', en: 'AED', symbol: 'د.إ', flag: '🇦🇪', position: 'after' },
  INR: { code: 'INR', ar: '₹', en: 'INR', symbol: '₹', flag: '🇮🇳', position: 'before' },
  CAD: { code: 'CAD', ar: 'C$', en: 'CAD', symbol: 'C$', flag: '🇨🇦', position: 'before' },
  AUD: { code: 'AUD', ar: 'A$', en: 'AUD', symbol: 'A$', flag: '🇦🇺', position: 'before' },
  CNY: { code: 'CNY', ar: '¥', en: 'CNY', symbol: '¥', flag: '🇨🇳', position: 'before' },
  JPY: { code: 'JPY', ar: '¥', en: 'JPY', symbol: '¥', flag: '🇯🇵', position: 'before' },
  TRY: { code: 'TRY', ar: '₺', en: 'TRY', symbol: '₺', flag: '🇹🇷', position: 'before' },
  KWD: { code: 'KWD', ar: 'د.ك', en: 'KWD', symbol: 'د.ك', flag: '🇰🇼', position: 'after' },
  QAR: { code: 'QAR', ar: 'ر.ق', en: 'QAR', symbol: 'ر.ق', flag: '🇶🇦', position: 'after' },
  BHD: { code: 'BHD', ar: 'د.ب', en: 'BHD', symbol: 'د.ب', flag: '🇧🇭', position: 'after' },
  OMR: { code: 'OMR', ar: 'ر.ع.', en: 'OMR', symbol: 'ر.ع.', flag: '🇴🇲', position: 'after' },
  EGP: { code: 'EGP', ar: 'ج.م', en: 'EGP', symbol: 'ج.م', flag: '🇪🇬', position: 'after' },
  PKR: { code: 'PKR', ar: '₨', en: 'PKR', symbol: '₨', flag: '🇵🇰', position: 'before' },
  NGN: { code: 'NGN', ar: '₦', en: 'NGN', symbol: '₦', flag: '🇳🇬', position: 'before' },
  CHF: { code: 'CHF', ar: 'فرنك سويسري', en: 'CHF', symbol: 'CHF', flag: '🇨🇭', position: 'before' },
}

export type CountryCode = keyof typeof countryBankingSchemas

export const getAllCountries = (): CountryBankingSchema[] =>
  Object.values(countryBankingSchemas)

export const getCountryByCode = (code: string): CountryBankingSchema | undefined =>
  countryBankingSchemas[code]

export const getCountryOptions = () =>
  getAllCountries().map((c) => ({
    value: c.code,
    label: c.name,
    flag: c.flag,
    currency: c.currency,
  }))

export const getFieldByKey = (
  countryCode: string,
  fieldKey: string
): BankingField | undefined =>
  countryBankingSchemas[countryCode]?.fields.find((f) => f.key === fieldKey)

export const validateField = (
  field: BankingField,
  value: string
): { valid: boolean; error?: string } => {
  const { validation } = field
  if (!validation) return { valid: true }

  const trimmed = value.trim()

  if (validation.required && !trimmed) {
    return { valid: false, error: 'required' }
  }
  if (validation.exactLength && trimmed.replace(/[-\s]/g, '').length !== validation.exactLength) {
    return { valid: false, error: `exactLength:${validation.exactLength}` }
  }
  if (validation.minLength && trimmed.length < validation.minLength) {
    return { valid: false, error: `minLength:${validation.minLength}` }
  }
  if (validation.maxLength && trimmed.length > validation.maxLength) {
    return { valid: false, error: `maxLength:${validation.maxLength}` }
  }
  if (validation.pattern && !validation.pattern.test(trimmed)) {
    return { valid: false, error: 'pattern' }
  }

  return { valid: true }
}

export const validateCountryFields = (
  countryCode: string,
  values: Record<string, string>
): Record<string, { valid: boolean; error?: string }> => {
  const schema = countryBankingSchemas[countryCode]
  if (!schema) return {}

  return schema.fields.reduce<Record<string, { valid: boolean; error?: string }>>((acc, field) => {
    acc[field.key] = validateField(field, values[field.key] ?? '')
    return acc
  }, {})
}

export const applyFieldFormatter = (field: BankingField, value: string): string =>
  field.formatter ? field.formatter(value) : value

export const applyFieldSanitizer = (field: BankingField, value: string): string =>
  field.sanitizer ? field.sanitizer(value) : value

export const getCountriesByCurrency = (currency: string): CountryBankingSchema[] =>
  getAllCountries().filter((c) => c.currency === currency)

export const getCountriesByTransferType = (type: TransferType): CountryBankingSchema[] =>
  getAllCountries().filter((c) => c.transferTypes.includes(type))

export const isCountrySupported = (code: string): boolean =>
  code in countryBankingSchemas