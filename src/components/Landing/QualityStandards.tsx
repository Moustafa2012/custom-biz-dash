import { Card, CardContent } from "@/components/ui/card";
import { Gem, Users, Lightbulb, ThumbsUp } from "lucide-react";
import { StarsPattern } from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";

export default function QualityStandards() {
  const { t } = useAppConfig();

  const standards = [
    { icon: Gem, title: t("جودة متميزة", "Premium Quality"), desc: t("نضمن أعلى معايير الجودة في جميع منتجاتنا وخدماتنا، متجاوزين توقعات الصناعة.", "We ensure the highest quality standards in all our products and services, exceeding industry expectations.") },
    { icon: Users, title: t("فريق خبراء", "Expert Team"), desc: t("فريقنا من المحترفين يجلب سنوات من الخبرة والمعرفة لتقديم نتائج استثنائية.", "Our team of professionals brings years of experience and knowledge to deliver exceptional results.") },
    { icon: Lightbulb, title: t("الابتكار", "Innovation"), desc: t("نتطور باستمرار ونطبق أحدث التقنيات والممارسات للبقاء في المقدمة.", "We continuously evolve and apply the latest technologies and practices to stay ahead.") },
    { icon: ThumbsUp, title: t("رضا العملاء", "Customer Satisfaction"), desc: t("رضاكم هو أولويتنا القصوى، مدعوماً بضمان الجودة وفريق دعم مخصص.", "Your satisfaction is our top priority, backed by our quality guarantee and dedicated support team.") },
  ];

  return (
    <section id="quality" className="py-20 scroll-chapter-marker relative">
      <StarsPattern />
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("معايير الجودة لدينا", "Our Quality Standards")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t(
              "نحن ملتزمون بالتميز في كل ما نقوم به. معايير الجودة لدينا توجه نهجنا لضمان تجاوز التوقعات باستمرار.",
              "We are committed to excellence in everything we do. Our quality standards guide our approach to ensure expectations are consistently exceeded."
            )}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {standards.map((item, index) => (
            <Card key={index} className="card-float text-center bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 icon-bounce" style={{ animationDelay: `${0.15 + index * 0.08}s` }}>
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}