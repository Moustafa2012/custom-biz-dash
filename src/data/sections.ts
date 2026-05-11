import type { QualityStandard, CoreValue } from "@/types"
import { Gem, Users, Lightbulb, ThumbsUp, Award, Heart, Truck, Eye, Target, Rocket, Shield, Leaf } from "lucide-react"
import { t } from "@/lib/translations"

export const qualityStandards: QualityStandard[] = [
  { icon: Gem, title: t("جودة متميزة", "Premium Quality"), desc: t("نضمن أعلى معايير الجودة في جميع منتجاتنا وخدماتنا، متجاوزين توقعات الصناعة.", "We ensure the highest quality standards in all our products and services, exceeding industry expectations.") },
  { icon: Users, title: t("فريق خبراء", "Expert Team"), desc: t("فريقنا من المحترفين يجلب سنوات من الخبرة والمعرفة لتقديم نتائج استثنائية.", "Our team of professionals brings years of experience and knowledge to deliver exceptional results.") },
  { icon: Lightbulb, title: t("الابتكار", "Innovation"), desc: t("نتطور باستمرار ونطبق أحدث التقنيات والممارسات للبقاء في المقدمة.", "We continuously evolve and apply the latest technologies and practices to stay ahead.") },
  { icon: ThumbsUp, title: t("رضا العملاء", "Customer Satisfaction"), desc: t("رضاكم هو أولويتنا القصوى، مدعوماً بضمان الجودة وفريق دعم مخصص.", "Your satisfaction is our top priority, backed by our quality guarantee and dedicated support team.") },
]

export const coreValues: CoreValue[] = [
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
]

export const successGoalsConfig = [
  { icon: Eye, arabicTitle: "رؤيتنا المستقبلية", englishTitle: "Our Future Vision", arabicDesc: "نهدف لأن نكون الرواد عالمياً في التجارة الزراعية المستدامة.", englishDesc: "We aim to be the global leader in sustainable agricultural trade." },
  { icon: Target, arabicTitle: "مهمتنا", englishTitle: "Our Mission", arabicDesc: "تقديم منتجات زراعية عالية الجودة مع الالتزام بالمعايير العالمية والممارسات المستدامة.", englishDesc: "Delivering high-quality agricultural products while adhering to global standards and sustainable practices." },
  { icon: Rocket, arabicTitle: "أهدافنا الاستراتيجية", englishTitle: "Our Strategic Goals", arabicDesc: "تطوير حلول مبتكرة في مجال التجارة الزراعية.", englishDesc: "Developing innovative solutions in agricultural trade." },
  { icon: Shield, arabicTitle: "جودة لا تُضاهى", englishTitle: "Uncompromised Quality", arabicDesc: "الالتزام بأعلى معايير الجودة العالمية.", englishDesc: "Commitment to the highest global quality standards." },
  { icon: Leaf, arabicTitle: "التنمية المستدامة", englishTitle: "Sustainable Development", arabicDesc: "دعم الممارسات الزراعية المستدامة.", englishDesc: "Supporting sustainable agricultural practices." },
] as const
