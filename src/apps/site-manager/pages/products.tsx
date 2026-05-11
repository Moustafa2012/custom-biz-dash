import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { products, productCategories } from "@/data/products"
import {
  IconBox,
  IconPlus,
  IconEdit,
  IconTrash,
  IconStar,
  IconSearch,
  IconFilter,
  IconGridDots,
  IconList,
  IconAward,
  IconLeaf,
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ViewMode = "grid" | "list"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [formData, setFormData] = useState<any>({})

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredCount = products.filter((p) => p.featured).length
  const totalCategories = new Set(products.map((p) => p.category)).size

  const handleDelete = (index: number) => {
    if (
      confirm(t("هل أنت متأكد من حذف هذا المنتج؟", "Are you sure you want to delete this product?"))
    ) {
      console.log("Delete product at index:", index)
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({ ...product })
  }

  const handleSave = () => {
    console.log("Save product:", formData)
    setEditingProduct(null)
    setIsAddDialogOpen(false)
    setFormData({})
  }

  const ProductForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 grid gap-2">
          <Label>{t("اسم المنتج", "Product Name")}</Label>
          <Input
            value={data.name || ""}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder={t("أدخل اسم المنتج", "Enter product name")}
            className="h-10"
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("الفئة", "Category")}</Label>
          <Select
            value={data.category || ""}
            onValueChange={(v) => onChange({ ...data, category: v })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t("اختر الفئة", "Select category")} />
            </SelectTrigger>
            <SelectContent>
              {productCategories
                .filter((c) => c.id !== "all")
                .map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>{t("التقييم", "Rating")}</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={data.rating || ""}
            onChange={(e) => onChange({ ...data, rating: parseFloat(e.target.value) })}
            placeholder="4.5"
            className="h-10"
          />
        </div>
        <div className="col-span-2 grid gap-2">
          <Label>{t("الوصف", "Description")}</Label>
          <Textarea
            value={data.desc || ""}
            onChange={(e) => onChange({ ...data, desc: e.target.value })}
            placeholder={t("أدخل وصف المنتج", "Enter product description")}
            rows={3}
            className="resize-none"
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("الأصل", "Origin")}</Label>
          <Input
            value={data.origin || ""}
            onChange={(e) => onChange({ ...data, origin: e.target.value })}
            placeholder={t("مصدر المنتج", "Product origin")}
            className="h-10"
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("صلاحية التخزين", "Shelf Life")}</Label>
          <Input
            value={data.shelfLife || ""}
            onChange={(e) => onChange({ ...data, shelfLife: e.target.value })}
            placeholder={t("12 شهر", "12 months")}
            className="h-10"
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("طريقة التخزين", "Storage")}</Label>
          <Input
            value={data.storage || ""}
            onChange={(e) => onChange({ ...data, storage: e.target.value })}
            placeholder={t("مكان بارد وجاف", "Cool and dry place")}
            className="h-10"
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("الاستخدام", "Usage")}</Label>
          <Input
            value={data.usage || ""}
            onChange={(e) => onChange({ ...data, usage: e.target.value })}
            placeholder={t("الاستخدامات المقترحة", "Suggested uses")}
            className="h-10"
          />
        </div>
        <div className="col-span-2 grid gap-2">
          <Label>{t("العلامات (مفصولة بفاصلة)", "Tags (comma-separated)")}</Label>
          <Input
            value={data.tags?.join(", ") || ""}
            onChange={(e) =>
              onChange({ ...data, tags: e.target.value.split(",").map((t) => t.trim()) })
            }
            placeholder={t("عضوي, طبيعي, فاخر", "Organic, Natural, Premium")}
            className="h-10"
          />
        </div>
        <div className="col-span-2 flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/30">
          <input
            type="checkbox"
            id="featured-check"
            checked={!!data.featured}
            onChange={(e) => onChange({ ...data, featured: e.target.checked })}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
          <div>
            <Label htmlFor="featured-check" className="cursor-pointer font-medium">
              {t("منتج مميز", "Featured Product")}
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("يظهر في القسم المميز على الصفحة الرئيسية", "Appears in the featured section on the homepage")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AppLayout title={t("المنتجات", "Products")}>
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("إدارة المنتجات", "Manage Products")}
            </h1>
            <p className="text-muted-foreground mt-1.5">
              {t(
                "إضافة وتعديل وحذف المنتجات من المتجر",
                "Add, edit, and delete products from the store"
              )}
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shrink-0">
                <IconPlus className="h-4 w-4" />
                {t("إضافة منتج", "Add Product")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">{t("إضافة منتج جديد", "Add New Product")}</DialogTitle>
              </DialogHeader>
              <ProductForm data={formData} onChange={setFormData} />
              <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setFormData({}) }}>
                  {t("إلغاء", "Cancel")}
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <IconBox className="h-4 w-4" />
                  {t("حفظ المنتج", "Save Product")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t("إجمالي المنتجات", "Total Products"), value: products.length, icon: IconBox, color: "text-blue-500" },
            { label: t("المنتجات المميزة", "Featured"), value: featuredCount, icon: IconAward, color: "text-amber-500" },
            { label: t("الفئات", "Categories"), value: totalCategories, icon: IconFilter, color: "text-violet-500" },
            { label: t("نتائج البحث", "Search Results"), value: filteredProducts.length, icon: IconSearch, color: "text-emerald-500" },
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

        {/* Filters & View toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("بحث عن منتج...", "Search products...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px] h-10">
              <IconFilter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
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

        {/* Products — Grid View */}
        {viewMode === "grid" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-none border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 end-2 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 shadow">
                    <IconStar className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold">{product.rating}</span>
                  </div>
                  {product.featured && (
                    <div className="absolute top-2 start-2">
                      <Badge className="bg-primary text-primary-foreground text-xs gap-1 shadow">
                        <IconStar className="h-3 w-3" />
                        {t("مميز", "Featured")}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags?.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(product.tags?.length ?? 0) > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{(product.tags?.length ?? 0) - 2}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-1 text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.desc}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 h-8 text-xs"
                      onClick={() => handleEdit(product)}
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

        {/* Products — List View */}
        {viewMode === "list" && (
          <div className="space-y-2">
            {filteredProducts.map((product, index) => (
              <Card
                key={index}
                className="shadow-none border-border/60 hover:border-primary/30 transition-all duration-200"
              >
                <CardContent className="p-3 flex items-center gap-4">
                  <div className="h-14 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                      {product.featured && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                          <IconStar className="h-2.5 w-2.5" />
                          {t("مميز", "Featured")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{product.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconStar className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {product.rating}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconLeaf className="h-3 w-3 text-emerald-500" />
                        {product.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(product)}
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

        {filteredProducts.length === 0 && (
          <Card className="p-16 text-center border-dashed border-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <IconBox className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t("لا توجد منتجات", "No products found")}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t(
                "لم يتم العثور على منتجات تطابق البحث",
                "No products match your search"
              )}
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all") }}>
              {t("مسح الفلاتر", "Clear Filters")}
            </Button>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{t("تعديل المنتج", "Edit Product")}</DialogTitle>
            </DialogHeader>
            <ProductForm data={formData} onChange={setFormData} />
            <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                {t("إلغاء", "Cancel")}
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <IconEdit className="h-4 w-4" />
                {t("حفظ التعديلات", "Save Changes")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  )
}