import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShieldCheck, Leaf, Award, TrendingUp, ChevronRight, Sparkles } from "lucide-react"
import { t } from "@/lib/translations"
import { products, productCategories } from "@/data/products"

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const productCategoriesWithTranslations = productCategories.map((cat) => ({
    ...cat,
    label: t(
      cat.label.includes("جميع") ? "جميع المنتجات" :
      cat.label.includes("الحبوب") ? "الحبوب" :
      cat.label.includes("الزيوت") ? "الزيوت" :
      cat.label.includes("البهارات") ? "البهارات" :
      cat.label.includes("المكسرات") ? "المكسرات" :
      cat.label.includes("القهوة") ? "القهوة" :
      cat.label.includes("البقوليات") ? "البقوليات" :
      cat.label.includes("الفواكه") ? "الفواكه المجففة" : cat.label,
      cat.label.includes("All") ? "All Products" :
      cat.label.includes("Grains") ? "Grains" :
      cat.label.includes("Oils") ? "Oils" :
      cat.label.includes("Spices") ? "Spices" :
      cat.label.includes("Nuts") ? "Nuts" :
      cat.label.includes("Coffee") ? "Coffee" :
      cat.label.includes("Legumes") ? "Legumes" :
      cat.label.includes("Dried") ? "Dried Fruits" : cat.label
    ),
  }))

  const productsWithTranslations = products.map((product) => ({
    ...product,
    name: t(product.name || "", product.name || ""),
    desc: t(product.desc || "", product.desc || ""),
    origin: t(product.origin || "", product.origin || ""),
    tags: product.tags?.map((tag) => t(tag, tag)) || [],
    certifications: product.certifications?.map((cert) => t(cert, cert)) || [],
    benefits: product.benefits?.map((benefit) => t(benefit, benefit)) || [],
    shelfLife: t(product.shelfLife || "", product.shelfLife || ""),
    storage: t(product.storage || "", product.storage || ""),
    usage: t(product.usage || "", product.usage || ""),
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const filtered = useMemo(() => {
    return activeCategory === "all"
      ? productsWithTranslations
      : productsWithTranslations.filter((p) => p.category === activeCategory)
  }, [activeCategory, productsWithTranslations])

  const featuredCount = useMemo(
    () => productsWithTranslations.filter((p) => p.featured).length,
    [productsWithTranslations]
  )
  const avgRating = useMemo(
    () => (productsWithTranslations.reduce((sum, p) => sum + p.rating, 0) / productsWithTranslations.length).toFixed(1),
    [productsWithTranslations]
  )

  return (
    <section ref={ref} id="products" className="py-28 section-alt relative overflow-hidden">
      {/* Layered ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-primary/4 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-emerald-500/4 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/2 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {t("منتجات عالية الجودة", "High Quality Products")}
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-black mb-5 text-foreground tracking-tight transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("منتجاتنا", "Our")}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t("المميزة", "Featured Products")}
            </span>
          </h2>

          <p
            className={`text-muted-foreground text-lg max-w-3xl mx-auto mb-10 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t(
              "نقدم مجموعة متنوعة من المنتجات الزراعية الفاخرة المختارة بعناية من أفضل المصادر العالمية",
              "We offer a diverse range of premium agricultural products carefully selected from the world's finest sources"
            )}
          </p>

          {/* Stats pills */}
          <div
            className={`flex flex-wrap justify-center gap-3 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {[
              {
                icon: Star,
                value: avgRating,
                label: t("متوسط التقييم", "Avg. Rating"),
                iconClass: "fill-yellow-500 text-yellow-500",
              },
              {
                icon: TrendingUp,
                value: featuredCount,
                label: t("منتج مميز", "Featured"),
                iconClass: "text-primary",
              },
              {
                icon: Leaf,
                value: "100%",
                label: t("طبيعي", "Natural"),
                iconClass: "text-emerald-500",
              },
              {
                icon: ShieldCheck,
                value: t("ضمان", "Guaranteed"),
                label: t("الجودة", "Quality"),
                iconClass: "text-primary",
              },
            ].map(({ icon: Icon, value, label, iconClass }, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 bg-card rounded-full px-5 py-2.5 border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                <Icon className={`h-4 w-4 ${iconClass}`} />
                <span className="font-bold text-foreground">{value}</span>
                <span className="text-muted-foreground text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div
          className={`mb-12 transition-all duration-700 delay-[350ms] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {productCategoriesWithTranslations.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-accent"
                }`}
              >
                {cat.label}
                {cat.id !== "all" && (
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                      activeCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {productsWithTranslations.filter((p) => p.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, index) => (
            <div
              key={index}
              className={`group transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${Math.min(400 + index * 60, 900)}ms` }}
              onMouseEnter={() => setHoveredProduct(index)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Card className="h-full overflow-hidden bg-card border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                {/* Image with enhanced overlays */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-emerald-500/0 group-hover:from-primary/10 group-hover:to-emerald-500/10 transition-all duration-500" />

                  {/* Featured badge */}
                  {product.featured && (
                    <div className="absolute top-3 start-3">
                      <Badge className="bg-primary text-primary-foreground shadow-lg text-xs font-semibold gap-1 px-2.5 py-1">
                        <Award className="h-3 w-3" />
                        {t("مميز", "Featured")}
                      </Badge>
                    </div>
                  )}

                  {/* Rating badge */}
                  <div className="absolute top-3 end-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-md rounded-full px-2.5 py-1.5 shadow-lg border border-border/30">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold text-foreground">{product.rating}</span>
                  </div>

                  {/* Bottom CTA overlay */}
                  <div
                    className={`absolute inset-0 flex items-end justify-center pb-4 transition-all duration-300 ${
                      hoveredProduct === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-white text-xs font-semibold bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      {t("اضغط للتفاصيل", "Click for details")}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>

                <CardContent className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-medium">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs font-medium">
                        +{product.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                    {product.desc}
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                      <ShieldCheck className="h-4 w-4" />
                      {t("ضمان الجودة", "Quality Guarantee")}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{t("طبيعي", "Natural")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-5">
              <Leaf className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              {t("لا توجد منتجات في هذه الفئة حالياً", "No products in this category currently")}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}