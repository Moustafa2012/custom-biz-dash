import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconSearch, IconFilter, IconFileText, IconUser, IconBuilding, IconPackage } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults] = useState([
    {
      id: 1,
      type: "user",
      title: "أحمد محمد",
      description: "مدير نظام - قسم تكنولوجيا المعلومات",
      icon: IconUser,
      color: "blue"
    },
    {
      id: 2,
      type: "file",
      title: "تقرير شهري - نوفمبر 2024",
      description: "تقرير المبيعات والإيرادات للشهر الحالي",
      icon: IconFileText,
      color: "green"
    },
    {
      id: 3,
      type: "company",
      title: "شركة ثريا للتجارة",
      description: "عميل رئيسي - قطاع التجزئة",
      icon: IconBuilding,
      color: "purple"
    },
    {
      id: 4,
      type: "product",
      title: "منتج الهواتف الذكية",
      description: "فئة المنتجات الإلكترونية",
      icon: IconPackage,
      color: "orange"
    },
    {
      id: 5,
      type: "product",
      title: "منتج الهواتف الذكية",
      description: "فئة المنتجات الإلكترونية",
      icon: IconPackage,
      color: "orange"
    },
    {
      id: 6,
      type: "product",
      title: "منتج الهواتف الذكية",
      description: "فئة المنتجات الإلكترونية",
      icon: IconPackage,
      color: "orange"
    }
  ])

  const filteredResults = searchResults.filter(result =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500/10 text-blue-500",
      green: "bg-green-500/10 text-green-500",
      purple: "bg-purple-500/10 text-purple-500",
      orange: "bg-orange-500/10 text-orange-500"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <AppLayout title={t("البحث", "Search")}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
            <IconSearch className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("البحث المتقدم", "Advanced Search")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("ابحث عن المستخدمين والملفات والمنتجات", "Search for users, files, and products")}
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="border border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSearch className="h-5 w-5" />
              {t("بحث شامل", "Global Search")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("اكتب للبحث...", "Type to search...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <IconFilter className="h-4 w-4" />
                  {t("فلاتر", "Filters")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("المستخدمون", "Users")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("الملفات", "Files")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("الشركات", "Companies")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {t("نتائج البحث", "Search Results")} ({filteredResults.length})
          </h2>
          
          {filteredResults.length > 0 ? (
            <div className="space-y-3">
              {filteredResults.map((result) => (
                <Card key={result.id} className="border border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${getTypeColor(result.color)}`}>
                        <result.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        {t("عرض", "View")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-border/50 bg-card">
              <CardContent className="p-8 text-center">
                <IconSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t("لا توجد نتائج", "No Results")}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? t("لم يتم العثور على نتائج لبحثك", "No results found for your search")
                    : t("ابدأ بالكتابة للبحث", "Start typing to search")
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
