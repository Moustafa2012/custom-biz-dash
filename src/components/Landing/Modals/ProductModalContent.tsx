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
      navigator.share({
        title: product.name,
        text: product.desc,
      }).catch(() => {});
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[420px] lg:order-2">
          <div className="sticky top-0">
            <ProductImageCarousel
              images={productImages}
              productName={product.name}
              productNameAr={product.name_ar}
              language={language}
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{t("100% طبيعي", "100% Natural")}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{t("ضمان الجودة", "Quality Guarantee")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:order-1">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-foreground">
                {language === 'ar' ? product.name_ar : product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-foreground">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({t("847 تقييم", "847 Reviews")})</span>
                </div>
                <Badge variant="outline" className="border-primary text-primary">
                  <Package className="h-3 w-3" />
                  {language === 'ar' ? product.category_ar : product.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`text-muted-foreground hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{t("الوصف", "Description")}</h2>
            <p className="text-muted-foreground">
              {language === 'ar' ? product.desc_ar : product.desc}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">{t("التفاصيل", "Details")}</TabsTrigger>
              <TabsTrigger value="benefits">{t("الفوائد", "Benefits")}</TabsTrigger>
              <TabsTrigger value="usage">{t("الاستخدام", "Usage")}</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <ProductDetailsTab
                origin={product.origin}
                originAr={product.origin_ar}
                certifications={product.certifications}
                certificationsAr={product.certifications_ar}
                shelfLife={product.shelfLife}
                storage={product.storage}
              />
            </TabsContent>
            <TabsContent value="benefits" className="mt-6">
              <ProductBenefitsTab
                benefits={product.benefits}
                benefitsAr={product.benefits_ar}
              />
            </TabsContent>
            <TabsContent value="usage" className="mt-6">
              <ProductUsageTab usage={product.usage} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}