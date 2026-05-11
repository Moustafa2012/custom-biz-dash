"use client"

import {
  IconBuildingBank,
  IconUsers,
  IconBook,
  IconDashboard,
  IconChartBar,
  IconTransactionDollar,
} from "@tabler/icons-react"
import { NavMain } from "@/components/navigation/nav-main"
import { t } from "@/lib/translations"

export function SynexNavMain() {
  const items = [
    {
      title: t("نظرة عامة", "Overview"),
      url: "/synex/overview",
      icon: IconDashboard,
    },
    {
      title: t("الحسابات", "Accounts"),
      url: "/synex/accounts",
      icon: IconBuildingBank,
    },
    {
      title: t("المستفيدون", "Beneficiaries"),
      url: "/synex/beneficiaries",
      icon: IconUsers,
    },
    {
      title: t("القيود اليومية", "Journal Entries"),
      url: "/synex/journal-entries",
      icon: IconBook,
    },
    {
      title: t("المعاملات", "Transactions"),
      url: "/synex/transactions",
      icon: IconTransactionDollar,
    },
    {
      title: t("التقارير", "Reports"),
      url: "/synex/reports",
      icon: IconChartBar,
    },
  ]

  return <NavMain items={items} />
}
