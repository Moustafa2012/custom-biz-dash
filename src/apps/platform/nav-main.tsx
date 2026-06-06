"use client"

import {
  IconUsers,
  IconBrandTelegram,
  IconMail,
  IconDashboard,
  IconBell,
  IconShieldLock,
  IconHistory,
} from "@tabler/icons-react"
import { NavMain } from "@/components/navigation/nav-main"
import { t } from "@/lib/translations"

export function PlatformNavMain() {
  const items = [
    { title: t("نظرة عامة", "Overview"), url: "/platform/overview", icon: IconDashboard },
    { title: t("الإشعارات", "Notifications"), url: "/platform/notifications", icon: IconBell },
    { title: t("تيليفاذر", "Telefather"), url: "/platform/telefather", icon: IconBrandTelegram },
    { title: t("المراسل", "Mailer"), url: "/platform/mailer", icon: IconMail },
    { title: t("المصادقة الثنائية", "Two-Factor Auth"), url: "/platform/twofa", icon: IconShieldLock },
    { title: t("سجل التدقيق", "Audit Logs"), url: "/platform/audit-logs", icon: IconHistory },
    { title: t("المستخدمون", "Users"), url: "/platform/users", icon: IconUsers },
  ]

  return <NavMain items={items} />
}
