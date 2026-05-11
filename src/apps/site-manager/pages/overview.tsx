import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { products } from "@/data/products"
import { articles } from "@/data/articles"
import { faqs } from "@/data/faqs"
import {
  IconBox,
  IconNews,
  IconHelp,
  IconMessage,
  IconUsers,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OverviewPage() {
  const stats = [
    {
      title: t("إجمالي المنتجات", "Total Products"),
      value: products.length,
      icon: IconBox,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: t("المقالات المنشورة", "Published Articles"),
      value: articles.length,
      icon: IconNews,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: t("الأسئلة الشائعة", "FAQ Questions"),
      value: faqs.length,
      icon: IconHelp,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      trend: "+2",
      trendUp: true,
    },
    {
      title: t("رسائل جديدة", "New Messages"),
      value: 24,
      icon: IconMessage,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      trend: "-8%",
      trendUp: false,
    },
    {
      title: t("المشتركين في النشرة", "Newsletter Subscribers"),
      value: 156,
      icon: IconUsers,
      color: "text-pink-600",
      bgColor: "bg-pink-500/10",
      trend: "+18%",
      trendUp: true,
    },
    {
      title: t("المنتجات المميزة", "Featured Products"),
      value: products.filter((p) => p.featured).length,
      icon: IconTrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      trend: "+3",
      trendUp: true,
    },
  ]

  const quickActions = [
    {
      title: t("إضافة منتج جديد", "Add New Product"),
      description: t("إضافة منتج جديد إلى المتجر", "Add a new product to the store"),
      icon: IconBox,
      href: "/site-manager/products",
      color: "bg-blue-500",
    },
    {
      title: t("نشر مقال جديد", "Publish New Article"),
      description: t("إنشاء ونشر مقال جديد", "Create and publish a new article"),
      icon: IconNews,
      href: "/site-manager/articles",
      color: "bg-green-500",
    },
    {
      title: t("إرسال نشرة بريدية", "Send Newsletter"),
      description: t("إرسال نشرة بريدية للمشتركين", "Send newsletter to subscribers"),
      icon: IconMessage,
      href: "/site-manager/newsletter",
      color: "bg-purple-500",
    },
    {
      title: t("إدارة الرسائل", "Manage Messages"),
      description: t("عرض والرد على الرسائل الواردة", "View and reply to incoming messages"),
      icon: IconMessage,
      href: "/site-manager/messages",
      color: "bg-orange-500",
    },
  ]

  const recentActivity = [
    {
      action: t("تم إضافة منتج جديد", "New product added"),
      item: t("زيت زيتون بكر ممتاز", "Extra Virgin Olive Oil"),
      time: t("منذ ساعتين", "2 hours ago"),
      type: "product",
    },
    {
      action: t("تم نشر مقال جديد", "New article published"),
      item: t("حمية البحر الأبيض المتوسط", "Mediterranean Diet"),
      time: t("منذ 5 ساعات", "5 hours ago"),
      type: "article",
    },
    {
      action: t("رسالة جديدة", "New message received"),
      item: t("استفسار عن المنتجات", "Product inquiry"),
      time: t("منذ يوم", "1 day ago"),
      type: "message",
    },
    {
      action: t("تم تحديث السؤال الشائع", "FAQ updated"),
      item: t("طرق الدفع المقبولة", "Accepted payment methods"),
      time: t("منذ يومين", "2 days ago"),
      type: "faq",
    },
  ]

  return (
    <AppLayout title={t("نظرة عامة", "Overview")}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("لوحة التحكم", "Dashboard")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("نظرة عامة على أداء الموقع والمحتوى", "Overview of site performance and content")}
            </p>
          </div>
          <Button className="gap-2">
            <IconTrendingUp className="h-4 w-4" />
            {t("عرض التقرير الكامل", "View Full Report")}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {stat.trendUp ? (
                    <IconArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <IconArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trendUp ? "text-green-600" : "text-red-600"}>
                    {stat.trend}
                  </span>
                  <span>{t("من الشهر الماضي", "from last month")}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t("إجراءات سريعة", "Quick Actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <IconArrowUpRight className="h-5 w-5 text-muted-foreground" />
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t("النشاط الأخير", "Recent Activity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      {activity.type === "product" && <IconBox className="h-4 w-4 text-primary" />}
                      {activity.type === "article" && <IconNews className="h-4 w-4 text-green-600" />}
                      {activity.type === "message" && <IconMessage className="h-4 w-4 text-orange-600" />}
                      {activity.type === "faq" && <IconHelp className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
