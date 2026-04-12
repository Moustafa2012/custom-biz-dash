import { Card, CardContent } from "@/components/ui/card";
import { Gem, Users, Lightbulb, ThumbsUp } from "lucide-react";
import { StarsPattern } from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";

export default function QualityStandards() {
  const { t } = useAppConfig();

  const standards = [
    { icon: Gem, title: t("Premium Quality", "جودة متميزة"), desc: t("We ensure the highest quality standards in all our products and services, exceeding industry expectations.", "نضمن أعلى معايير الجودة في جميع منتجاتنا وخدماتنا، متجاوزين توقعات الصناعة.") },
    { icon: Users, title: t("Expert Team", "فريق خبراء"), desc: t("Our team of professionals brings years of experience and knowledge to deliver exceptional results.", "فريقنا من المحترفين يجلب سنوات من الخبرة والمعرفة لتقديم نتائج استثنائية.") },
    { icon: Lightbulb, title: t("Innovation", "الابتكار"), desc: t("We continuously evolve and apply the latest technologies and practices to stay ahead.", "نتطور باستمرار ونطبق أحدث التقنيات والممارسات للبقاء في المقدمة.") },
    { icon: ThumbsUp, title: t("Customer Satisfaction", "رضا العملاء"), desc: t("Your satisfaction is our top priority, backed by our quality guarantee and dedicated support team.", "رضاكم هو أولويتنا القصوى، مدعوماً بضمان الجودة وفريق دعم مخصص.") },
  ];

  return (
    <section id="quality" className="py-20 scroll-chapter-marker relative">
      <StarsPattern />
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Our Quality Standards", "معايير الجودة لدينا")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t(
              "We are committed to excellence in everything we do. Our quality standards guide our approach to ensure expectations are consistently exceeded.",
              "نحن ملتزمون بالتميز في كل ما نقوم به. معايير الجودة لدينا توجه نهجنا لضمان تجاوز التوقعات باستمرار."
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
