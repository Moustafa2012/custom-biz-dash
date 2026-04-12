import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, Rocket, Shield, Leaf } from "lucide-react";
import { StarsPattern } from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";

export default function SuccessStory() {
  const { t } = useAppConfig();

  const goals = [
    { icon: Eye, title: t("Our Future Vision", "رؤيتنا المستقبلية"), desc: t("We aim to be the global leader in sustainable agricultural trade.", "نهدف لأن نكون الرواد عالمياً في التجارة الزراعية المستدامة.") },
    { icon: Target, title: t("Our Mission", "مهمتنا"), desc: t("Delivering high-quality agricultural products while adhering to global standards and sustainable practices.", "تقديم منتجات زراعية عالية الجودة مع الالتزام بالمعايير العالمية والممارسات المستدامة.") },
    { icon: Rocket, title: t("Our Strategic Goals", "أهدافنا الاستراتيجية"), desc: t("Developing innovative solutions in agricultural trade.", "تطوير حلول مبتكرة في مجال التجارة الزراعية.") },
    { icon: Shield, title: t("Uncompromised Quality", "جودة لا تُضاهى"), desc: t("Commitment to the highest global quality standards.", "الالتزام بأعلى معايير الجودة العالمية.") },
    { icon: Leaf, title: t("Sustainable Development", "التنمية المستدامة"), desc: t("Supporting sustainable agricultural practices.", "دعم الممارسات الزراعية المستدامة.") },
  ];

  return (
    <section id="about" className="py-20 scroll-chapter-marker relative">
      <StarsPattern />
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Our Success Story", "قصة نجاحنا")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto body-reveal">
            {t(
              "We are a leading company in agricultural trade, committed to the highest standards of quality and sustainability to provide the best products to our valued customers.",
              "نحن شركة رائدة في التجارة الزراعية، ملتزمون بأعلى معايير الجودة والاستدامة لتقديم أفضل المنتجات لعملائنا الكرام."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal, i) => (
            <Card key={i} className={`card-float bg-card border-border/50 hover:border-primary/30 transition-all duration-300 ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 icon-bounce" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                  <goal.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{goal.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{goal.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
