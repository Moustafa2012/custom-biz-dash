import { t } from "@/lib/translations"

export const WHATSAPP_NUMBER = "966550168553"
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const COMPANY_NAME_AR = "ثريا البلاد"
export const COMPANY_NAME_EN = "Thouraya Albilad"
export const COMPANY_TAGLINE_AR = "للتجارة"
export const COMPANY_TAGLINE_EN = "Trading"
export const COMPANY_EMAIL = "info@thurayaalbilad.com"
export const COMPANY_SALES_EMAIL = "sales@thourayaalbilad.com"
export const COMPANY_SUPPORT_EMAIL = "support@thourayaalbilad.com"

export const CONTACT_PHONE = "+966550168553"

export const WORKING_HOURS = {
  sundayThursday: "الأحد - الخميس: 9:00 ص - 5:00 م",
  friday: "الجمعة: مغلق",
  saturday: "السبت: 10:00 ص - 3:00 م",
} as const

export const BRANCHES = [
  {
    name: t("الفرع الرئيسي - جدة", "Main Branch - Jeddah"),
    address: t("طريق الملك فيصل، حي البترومين، جدة", "King Faisal Road, Al-Betromin District, Jeddah"),
    mapUrl: "https://www.google.com/maps?ll=21.435245,39.191568&z=15&t=m&hl=ar&gl=SA&mapclient=embed&cid=3828446472197086210",
  },
  {
    name: t("الفرع الثاني - الرياض", "Second Branch - Riyadh"),
    address: t("طريق عرفات ، حي المصانع ، الرياض", "Arafat Road, Al-Masani District, Riyadh"),
    mapUrl: "https://www.google.com/maps?ll=24.556047,46.751451&z=19&t=m&hl=en&gl=SA&mapclient=embed&q=24%C2%B033%2721.7%22N+46%C2%B045%2705.7%22E+24.556028,+46.751583@24.5560278,46.7515833",
  },
] as const
