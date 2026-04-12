import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, ArrowRight, User, Calendar } from "lucide-react";
import { ArticlesModal } from '@/components/Landing/Modals/atriclesModal';
import { useState, useEffect } from "react";
import { StarsPattern } from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";
import { useArticlesStore } from "@/lib/articles.store";

export default function ArticlesSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useAppConfig();
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const { articles, featuredArticles } = useArticlesStore();
  
  // Format articles to include translated content
  const formattedArticles = articles.map(article => ({
    ...article,
    title: article.title[direction === 'rtl' ? 'ar' : 'en'],
    desc: article.desc[direction === 'rtl' ? 'ar' : 'en'],
    category: article.category[direction === 'rtl' ? 'ar' : 'en'],
    date: article.date[direction === 'rtl' ? 'ar' : 'en'],
    readTime: article.readTime[direction === 'rtl' ? 'ar' : 'en'],
    fullContent: article.fullContent[direction === 'rtl' ? 'ar' : 'en']
  }));
  
  // Get featured articles (first 2 articles as per the original implementation)
  const featured = formattedArticles.filter((_, index) => index < 2).map(article => ({
    ...article,
    featured: true
  }));
  
  // Get regular articles (remaining articles)
  const regularArticles = formattedArticles.slice(2);
  
  // Combine featured and regular articles for display
  const displayArticles = [...featured, ...regularArticles];

  const handleReadMore = (article: any) => {
    setSelectedArticle(article);
    setIsOpen(true);
  };

  const ReadMoreArrow = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section id="articles" className="py-20 section-alt scroll-chapter-marker relative">
      <StarsPattern />
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("المقالات العلمية", "Scientific Articles")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t(
              "أحدث الأبحاث المنشورة في المجلات العلمية المحكمة حول التغذية والصحة",
              "Latest research published in peer-reviewed scientific journals on nutrition and health"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayArticles.map((article, i) => (
            <Card key={i} className={`card-float group bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden ${i === 0 ? "md:col-span-2" : ""}`}>
              {article.heroImage && (
                <div className={`relative overflow-hidden ${article.featured ? "md:h-[280px]" : "h-[200px]"}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-4 end-4 z-20 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">{article.category}</Badge>
                    {article.featured && <Badge className="bg-primary text-primary-foreground">{t("مميز", "Featured")}</Badge>}
                  </div>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className={`font-bold mb-3 text-foreground ${article.featured ? "text-xl md:text-2xl" : "text-lg"}`}>{article.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">{article.desc}</p>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{article.author}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime}</span>
                  </div>
                  <button onClick={() => handleReadMore(article)} className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
                    {t("اقرأ المزيد", "Read More")}
                    <ReadMoreArrow className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {selectedArticle && (
          <ArticlesModal 
            article={selectedArticle} 
            open={isOpen} 
            onOpenChange={setIsOpen} 
          />
        )}
      </div>
    </section>
  );
}
