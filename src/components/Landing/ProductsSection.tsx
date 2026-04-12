import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Leaf, Award, TrendingUp } from "lucide-react";
import { ProductsModal } from "@/components/Landing/Modals/productsModal";
import { StarsPattern } from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";
import useProductsStore from "@/lib/products.store";

export default function ProductsSection() {
  const { t, language } = useAppConfig();
  
  // Get state and actions from the store
  const {
    activeCategory,
    setActiveCategory,
    selectedProduct,
    setSelectedProduct,
    isModalOpen,
    setIsModalOpen,
    getFilteredProducts,
    getFeaturedCount,
    getAverageRating,
    categories,
    products
  } = useProductsStore();

  // Helper function to get translated text based on current language
  const getTranslated = (en: string, ar: string) => {
    return language === 'ar' ? ar : en;
  };

  // Get derived state
  const filtered = getFilteredProducts();
  const featuredCount = getFeaturedCount();
  const avgRating = getAverageRating();

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section id="products" className="py-20 section-alt relative">
      <StarsPattern />
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Award className="h-4 w-4" />
            <span className="text-sm font-medium">{t("منتجات عالية الجودة", "High Quality Products")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">{t("منتجاتنا المميزة", "Our Featured Products")}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-6">
            {t(
              "نقدم مجموعة متنوعة من المنتجات الزراعية الفاخرة المختارة بعناية من أفضل المصادر العالمية، مع ضمان الجودة والنقاوة في كل منتج",
              "We offer a diverse range of premium agricultural products carefully selected from the world's finest sources, with quality and purity guaranteed in every product"
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold text-foreground">{avgRating}</span>
              <span className="text-muted-foreground">{t("متوسط التقييم", "Avg. Rating")}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{featuredCount}</span>
              <span className="text-muted-foreground">{t("منتج مميز", "Featured")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-foreground">100%</span>
              <span className="text-muted-foreground">{t("طبيعي", "Natural")}</span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Button key={cat.id} variant={activeCategory === cat.id ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat.id)} className="rounded-full transition-all">
                {getTranslated(cat.label, cat.label_ar || cat.label)}
                {cat.id !== "all" && (
                  <Badge variant="secondary" className="ms-2 px-1.5 py-0 text-xs">
                    {products?.filter((p) => p.category === cat.id).length || 0}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <Card key={index} className="overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group cursor-pointer" onClick={() => handleProductClick(product)} style={{ animationDelay: `${index * 50}ms` }}>
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={getTranslated(product.name, product.name_ar)} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 start-3 flex flex-col gap-2">
                  {product.featured && (
                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                      <Award className="h-3 w-3 me-1" />
                      {t("مميز", "Featured")}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 end-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-lg">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-bold text-foreground">{product.rating}</span>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium bg-primary px-4 py-2 rounded-full shadow-lg">
                    {t("اضغط للتفاصيل", "Click for details")}
                  </span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {getTranslated(tag, product.tags_ar?.[index] || tag)}
                    </Badge>
                  ))}
                  {product.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.tags.length - 2}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {getTranslated(product.name, product.name_ar)}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                  {getTranslated(product.desc, product.desc_ar)}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    <ShieldCheck className="h-4 w-4" />
                    {t("ضمان الجودة", "Quality Guarantee")}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Leaf className="h-3.5 w-3.5 text-green-600" />
                    <span>{t("طبيعي", "Natural")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t("لا توجد منتجات في هذه الفئة حالياً", "No products in this category currently")}</p>
          </div>
        )}
      </div>
      <ProductsModal product={selectedProduct} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
