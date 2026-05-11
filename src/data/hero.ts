import type { Stat } from "@/types"
import { Award, Package, Users } from "lucide-react"
import { t } from "@/lib/translations"

export const heroStats: Stat[] = [
  { icon: Award, value: "+15", label: t("عاماً من الخبرة", "Years of Experience") },
  { icon: Package, value: "+5000", label: t("منتج متنوع", "Diverse Products") },
  { icon: Users, value: "+2500", label: t("عميل راضٍ", "Satisfied Clients") },
]
