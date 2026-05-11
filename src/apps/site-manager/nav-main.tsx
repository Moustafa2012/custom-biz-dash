"use client"

import {
  IconDashboard,
  IconBox,
  IconNews,
  IconHelp,
  IconMessage,
  IconMail,
} from "@tabler/icons-react"
import { NavMain } from "@/components/navigation/nav-main"
import { t } from "@/lib/translations"

export function SiteManagerNavMain() {
  const items = [
    {
      title: t("نظرة عامة", "Overview"),
      url: "/site-manager/overview",
      icon: IconDashboard,
    },
    {
      title: t("المنتجات", "Products"),
      url: "/site-manager/products",
      icon: IconBox,
    },
    {
      title: t("المقالات", "Articles"),
      url: "/site-manager/articles",
      icon: IconNews,
    },
    {
      title: t("الأسئلة الشائعة", "FAQ"),
      url: "/site-manager/faq",
      icon: IconHelp,
    },
    {
      title: t("الرسائل", "Messages"),
      url: "/site-manager/messages",
      icon: IconMessage,
    },
    {
      title: t("النشرة البريدية", "Newsletter"),
      url: "/site-manager/newsletter",
      icon: IconMail,
    },
  ]

  return <NavMain items={items} />
}
