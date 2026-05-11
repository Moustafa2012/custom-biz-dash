"use client"

import {
  IconUsers,
  IconBrandTelegram,
  IconMail,
  IconDashboard,
} from "@tabler/icons-react"
import { NavMain } from "@/components/navigation/nav-main"
import { t } from "@/lib/translations"

export function PlatformNavMain() {
  const items = [
    {
      title: t("نظرة عامة", "Overview"),
      url: "/platform/overview",
      icon: IconDashboard,
    },
    {
      title: t("تيليفاذر", "Telefather"),
      url: "/platform/telefather",
      icon: IconBrandTelegram,
    },
    {
      title: t("المراسل", "Mailer"),
      url: "/platform/mailer",
      icon: IconMail,
    },
    {
      title: t("المستخدمون", "Users"),
      url: "/platform/users",
      icon: IconUsers,
    },
  ]

  return <NavMain items={items} />
}
