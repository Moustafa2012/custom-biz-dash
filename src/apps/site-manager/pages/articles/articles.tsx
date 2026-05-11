import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { articles } from "@/data/articles"
import {
  IconNews,
  IconPlus,
  IconEdit,
  IconTrash,
  IconStar,
  IconSearch,
  IconCalendar,
  IconClock,
  IconUser,
  IconGridDots,
  IconList,
  IconFilter,
  IconBookmark,
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ViewMode = "grid" | "list"

export default function ArticlesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterFeatured, setFilterFeatured] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || article.category === filterCategory
    const matchesFeatured =
      filterFeatured === "all" ||
      (filterFeatured === "featured" && article.featured) ||
      (filterFeatured === "regular" && !article.featured)
    return matchesSearch && matchesCategory && matchesFeatured
  })

  const stats = {
    total: articles.length,
    featured: articles.filter((a) => a.featured).length,
    categories: categories.length,
    results: filteredArticles.length,
  }

  const handleDelete = (index: number) => {
    if (confirm(t("هل أنت متأكد من حذف هذا المقال؟", "Are you sure you want to delete this article?"))) {
      console.log("Delete article at index:", index)
    }
  }

  const handleEdit = (article: any) => {
    navigate("/site-manager/articles/edit", { state: { article } })
  }

  const handleCreate = () => {
    navigate("/site-manager/articles/create")
  }

  return (
    <AppLayout title={t("المقالات", "Articles")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("إدارة المقالات", "Manage Articles")}
            </h1>
            <p className="text-muted-foreground mt-1.5">
              {t("إضافة وتعديل وحذف المقالات العلمية", "Add, edit, and delete scientific articles")}
            </p>
          </div>
          <Button className="gap-2 shrink-0" onClick={handleCreate}>
              <IconPlus className="h-4 w-4" />
              {t("إضافة مقال", "Add Article")}
            </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t("إجمالي المقالات", "Total Articles"), value: stats.total, icon: IconNews, color: "text-blue-500" },
            { label: t("المقالات المميزة", "Featured"), value: stats.featured, icon: IconBookmark, color: "text-amber-500" },
            { label: t("الفئات", "Categories"), value: stats.categories, icon: IconFilter, color: "text-violet-500" },
            { label: t("نتائج البحث", "Results"), value: stats.results, icon: IconSearch, color: "text-emerald-500" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-none border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("بحث عن مقال...", "Search articles...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SelectValue placeholder={t("الفئة", "Category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("كل الفئات", "All Categories")}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterFeatured} onValueChange={setFilterFeatured}>
            <SelectTrigger className="w-full sm:w-[160px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("الكل", "All")}</SelectItem>
              <SelectItem value="featured">{t("المميزة", "Featured")}</SelectItem>
              <SelectItem value="regular">{t("العادية", "Regular")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 border border-border/60 rounded-lg p-1 bg-muted/30">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <IconGridDots className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <IconList className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Grid view */}
        {viewMode === "grid" && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredArticles.map((article, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-none border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
              >
                {article.heroImage && (
                  <div className="relative h-44 bg-muted overflow-hidden">
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-2 end-2 flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
                        {article.category}
                      </Badge>
                      {article.featured && (
                        <Badge className="bg-primary text-primary-foreground gap-1 text-xs">
                          <IconStar className="h-3 w-3" />
                          {t("مميز", "Featured")}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1.5 line-clamp-2 text-sm leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{article.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <IconUser className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{article.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <IconCalendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconClock className="h-3.5 w-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 h-8 text-xs"
                      onClick={() => handleEdit(article)}
                    >
                      <IconEdit className="h-3.5 w-3.5" />
                      {t("تعديل", "Edit")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => handleDelete(index)}
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                      {t("حذف", "Delete")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* List view */}
        {viewMode === "list" && (
          <div className="space-y-2">
            {filteredArticles.map((article, index) => (
              <Card
                key={index}
                className="shadow-none border-border/60 hover:border-primary/30 transition-all duration-200"
              >
                <CardContent className="p-3 flex items-center gap-4">
                  {article.heroImage && (
                    <div className="h-14 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={article.heroImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm line-clamp-1">{article.title}</h3>
                      {article.featured && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1 shrink-0">
                          <IconStar className="h-2.5 w-2.5" />
                          {t("مميز", "Featured")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{article.category}</span>
                      <span className="flex items-center gap-1">
                        <IconUser className="h-3 w-3" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconCalendar className="h-3 w-3" />
                        {article.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(article)}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(index)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredArticles.length === 0 && (
          <Card className="p-16 text-center border-dashed border-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <IconNews className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("لا توجد مقالات", "No articles found")}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t("لم يتم العثور على مقالات تطابق البحث", "No articles match your search")}
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setFilterCategory("all"); setFilterFeatured("all") }}>
              {t("مسح الفلاتر", "Clear Filters")}
            </Button>
          </Card>
        )}
      </div>

          </AppLayout>
  )
}