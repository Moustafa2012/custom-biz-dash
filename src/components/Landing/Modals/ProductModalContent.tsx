import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Share2, Package } from "lucide-react";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { ProductDetailsTab } from "./ProductDetailsTab";
import { ProductBenefitsTab } from "./ProductBenefitsTab";
import { ProductUsageTab } from "./ProductUsageTab";

interface Product {
  name: string;
  name_ar: string;
  category: string;
  category_ar: string;
  rating: number;
  image: string;
  images?: string[];
  tags: string[];
  tags_ar: string[];
  featured: boolean;
  desc: string;
  desc_ar: string;
  origin?: string;
  origin_ar?: string;
  certifications?: string[];
  certifications_ar?: string[];
  benefits?: string[];
  benefits_ar?: string[];
  shelfLife: {
    duration: string;
    duration_ar: string;
    note: string;
    note_ar: string;
  };
  storage?: {
    temperature: string;
    humidity: string;
    humidity_ar: string;
    instructions: string;
    instructions_ar: string;
  };
  usage?: {
    primary: string[];
    primary_ar: string[];
    tip: string;
    tip_ar: string;
  };
}

interface ProductModalContentProps {
  product: Product;
  language: string;
  t: (ar: string, en: string) => string;
}

export function ProductModalContent({ product, language, t }: ProductModalContentProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isLiked, setIsLiked] = useState(false);

  const productImages = product.images || [product.image];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.desc }).catch(() => {});
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image column */}
        <div className="lg:w-[400px] lg:order-2 shrink-0">
          <div className="lg:sticky lg:top-0 space-y-4">
            <ProductImageCarousel
              images={productImages}
              productName={product.name}
              productNameAr={product.name_ar}
              language={language}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("طبيعي", "Natural")}
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">100%</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("الجودة", "Quality")}
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">{t("مضمونة", "Assured")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content column */}
        <div className="flex-1 lg:order-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-medium gap-1.5 shrink-0">
                  <Package className="h-3 w-3" />
                  {language === "ar" ? product.category_ar : product.category}
                </Badge>
                {product.featured && (
                  <Badge variant="secondary" className="text-xs font-medium shrink-0">
                    {t("مميز", "Featured")}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {language === "ar" ? product.name_ar : product.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="h-4 w-4 fill-foreground text-foreground" />
                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  · {t("847 تقييم", "847 reviews")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`w-8 h-8 rounded-full ${isLiked ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-6" />

          {/* Description */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {t("الوصف", "Description")}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === "ar" ? product.desc_ar : product.desc}
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <TabsList className="w-full grid grid-cols-3 rounded-xl bg-muted/50 border border-border p-1 h-auto">
              <TabsTrigger
                value="details"
                className="rounded-lg text-xs font-semibold uppercase tracking-wider py-2"
              >
                {t("التفاصيل", "Details")}
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="rounded-lg text-xs font-semibold uppercase tracking-wider py-2"
              >
                {t("الفوائد", "Benefits")}
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="rounded-lg text-xs font-semibold uppercase tracking-wider py-2"
              >
                {t("الاستخدام", "Usage")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-5">
              <ProductDetailsTab
                origin={product.origin}
                originAr={product.origin_ar}
                certifications={product.certifications}
                certificationsAr={product.certifications_ar}
                shelfLife={product.shelfLife}
                storage={product.storage}
              />
            </TabsContent>
            <TabsContent value="benefits" className="mt-5">
              <ProductBenefitsTab benefits={product.benefits} benefitsAr={product.benefits_ar} />
            </TabsContent>
            <TabsContent value="usage" className="mt-5">
              <ProductUsageTab usage={product.usage} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}