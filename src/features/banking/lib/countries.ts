// Country-specific bank routing field configuration.
// Drives the dynamic form for both company bank accounts and beneficiary records.

export type CountryCode =
  | "US" | "IN" | "GB" | "AU" | "CA"
  | "DE" | "FR" | "ES" | "IT" | "NL" // EU countries → BIC + IBAN
  | "SA" | "AE" | "KW" | "QA" | "BH" | "OM" // GCC → IBAN + SWIFT
  | "OTHER";

export interface RoutingFieldDef {
  key: string;
  labelEn: string;
  labelAr: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string; // HTML pattern attribute
  helpEn?: string;
  helpAr?: string;
}

export interface CountryConfig {
  code: CountryCode;
  nameEn: string;
  nameAr: string;
  flag: string;
  fields: RoutingFieldDef[];
}

const SWIFT: RoutingFieldDef = {
  key: "swift",
  labelEn: "SWIFT / BIC",
  labelAr: "سويفت / BIC",
  placeholder: "AAAABBCCXXX",
  required: true,
  pattern: "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
};

const IBAN: RoutingFieldDef = {
  key: "iban",
  labelEn: "IBAN",
  labelAr: "آيبان",
  placeholder: "GB29 NWBK 6016 1331 9268 19",
  required: true,
};

export const COUNTRY_CONFIGS: Record<CountryCode, CountryConfig> = {
  US: {
    code: "US", nameEn: "United States", nameAr: "الولايات المتحدة", flag: "🇺🇸",
    fields: [
      { key: "aba", labelEn: "ABA Routing Number", labelAr: "رقم توجيه ABA", placeholder: "9 digits", pattern: "^[0-9]{9}$", required: true },
      { ...SWIFT, required: false },
    ],
  },
  IN: {
    code: "IN", nameEn: "India", nameAr: "الهند", flag: "🇮🇳",
    fields: [
      { key: "ifsc", labelEn: "IFSC Code", labelAr: "رمز IFSC", placeholder: "ABCD0123456", pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", required: true },
      { ...SWIFT, required: false },
    ],
  },
  GB: {
    code: "GB", nameEn: "United Kingdom", nameAr: "المملكة المتحدة", flag: "🇬🇧",
    fields: [
      { key: "sortCode", labelEn: "Sort Code", labelAr: "رمز الفرز", placeholder: "12-34-56", pattern: "^[0-9]{2}-?[0-9]{2}-?[0-9]{2}$", required: true },
      { ...IBAN, required: false },
      { ...SWIFT, required: false },
    ],
  },
  AU: {
    code: "AU", nameEn: "Australia", nameAr: "أستراليا", flag: "🇦🇺",
    fields: [
      { key: "bsb", labelEn: "BSB Number", labelAr: "رقم BSB", placeholder: "123-456", pattern: "^[0-9]{3}-?[0-9]{3}$", required: true },
      { ...SWIFT, required: false },
    ],
  },
  CA: {
    code: "CA", nameEn: "Canada", nameAr: "كندا", flag: "🇨🇦",
    fields: [
      { key: "transit", labelEn: "Transit Number", labelAr: "رقم العبور", placeholder: "5 digits", pattern: "^[0-9]{5}$", required: true },
      { key: "institution", labelEn: "Institution Number", labelAr: "رقم المؤسسة", placeholder: "3 digits", pattern: "^[0-9]{3}$", required: true },
      { ...SWIFT, required: false },
    ],
  },
  DE: { code: "DE", nameEn: "Germany", nameAr: "ألمانيا", flag: "🇩🇪", fields: [IBAN, SWIFT] },
  FR: { code: "FR", nameEn: "France",  nameAr: "فرنسا",  flag: "🇫🇷", fields: [IBAN, SWIFT] },
  ES: { code: "ES", nameEn: "Spain",   nameAr: "إسبانيا", flag: "🇪🇸", fields: [IBAN, SWIFT] },
  IT: { code: "IT", nameEn: "Italy",   nameAr: "إيطاليا", flag: "🇮🇹", fields: [IBAN, SWIFT] },
  NL: { code: "NL", nameEn: "Netherlands", nameAr: "هولندا", flag: "🇳🇱", fields: [IBAN, SWIFT] },
  SA: { code: "SA", nameEn: "Saudi Arabia", nameAr: "السعودية", flag: "🇸🇦", fields: [IBAN, SWIFT] },
  AE: { code: "AE", nameEn: "UAE",          nameAr: "الإمارات",  flag: "🇦🇪", fields: [IBAN, SWIFT] },
  KW: { code: "KW", nameEn: "Kuwait",       nameAr: "الكويت",    flag: "🇰🇼", fields: [IBAN, SWIFT] },
  QA: { code: "QA", nameEn: "Qatar",        nameAr: "قطر",       flag: "🇶🇦", fields: [IBAN, SWIFT] },
  BH: { code: "BH", nameEn: "Bahrain",      nameAr: "البحرين",   flag: "🇧🇭", fields: [IBAN, SWIFT] },
  OM: { code: "OM", nameEn: "Oman",         nameAr: "عُمان",     flag: "🇴🇲", fields: [IBAN, SWIFT] },
  OTHER: {
    code: "OTHER", nameEn: "Other", nameAr: "أخرى", flag: "🌐",
    fields: [SWIFT, { ...IBAN, required: false }],
  },
};

export const COUNTRY_LIST: CountryConfig[] = Object.values(COUNTRY_CONFIGS);

export function getCountryConfig(code: CountryCode): CountryConfig {
  return COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS.OTHER;
}
