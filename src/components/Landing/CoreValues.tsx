import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Truck, CheckCircle } from "lucide-react";
import StarsPattern from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";

export default function CoreValues() {
  const { t } = useAppConfig();

  const values = [
    {
      icon: Award,
      title: t("التميز في الجودة", "Excellence in Quality"),
      description: t(
        "نضع معايير جديدة في التجارة الزراعية مع التزام لا يتزعزع بالجودة والابتكار.",
        "We set new standards in agricultural trade with an unwavering commitment to quality and innovation."
      ),
      points: [
        t("شهادة ISO 9001:2015", "ISO 9001:2015 Certified"),
        t("اختيار منتجات متميزة", "Premium Product Selection"),
        t("مراقبة الجودة في كل خطوة", "Quality Control at Every Step"),
        t("تجاوز المعايير العالمية", "Exceeding Global Standards"),
      ],
    },
    {
      icon: Heart,
      title: t("العناية بالعملاء", "Customer Care"),
      description: t(
        "نبني علاقات دائمة من خلال خدمة استثنائية ولمسة شخصية لكل عميل.",
        "We build lasting relationships through exceptional service and a personal touch to every customer's needs."
      ),
      points: [
        t("دعم العملاء على مدار الساعة", "24/7 Customer Support"),
        t("حلول مخصصة", "Customized Solutions"),
        t("استشارات متخصصة", "Expert Consultation"),
        t("نجاحك هو أولويتنا", "Your Success is Our Priority"),
      ],
    },
    {
      icon: Truck,
      title: t("توصيل موثوق", "Reliable Delivery"),
      description: t(
        "شبكة توزيع عالمية سلسة تضمن وصول منتجاتك بكفاءة وفي الوقت المحدد.",
        "A seamless global distribution network ensures your products arrive efficiently and on time."
      ),
      points: [
        t("شبكة شحن عالمية", "Global Shipping Network"),
        t("تتبع الشحنات مباشرة", "Live Shipment Tracking"),
        t("خيارات توصيل سريعة", "Express Delivery Options"),
        t("في الوقت المحدد دائماً", "On Time, Every Time"),
      ],
    },
  ];

  return (
    <section className="py-20 section-alt scroll-chapter-marker relative">
      <StarsPattern className="opacity-20" />
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("قيمنا الأساسية", "Our Core Values")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t("هذه المبادئ توجه كل ما نقوم به", "These principles guide everything we do")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="card-float bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 icon-bounce">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{value.description}</p>
                <ul className="space-y-2.5">
                  {value.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}