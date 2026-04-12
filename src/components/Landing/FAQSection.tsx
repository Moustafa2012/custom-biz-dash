import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StarsPattern } from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";

export default function FAQSection() {
  const { t } = useAppConfig();

  const faqs = [
    {
      q: t("هل منتجاتكم حلال معتمدة؟", "Are your products halal certified?"),
      a: t(
        "نعم، جميع منتجاتنا من اللحوم والدواجن حلال 100% ومعتمدة من الجهات الإسلامية المعترف بها. كما نوضح معلومات شهادة الحلال على جميع المنتجات المستوردة.",
        "Yes, all our meat and poultry products are 100% halal certified by recognized Islamic authorities. We also clearly label all imported products with halal certification information."
      ),
    },
    {
      q: t("ما هي المدن التي تقومون بالتوصيل إليها في السعودية؟", "Which cities in Saudi Arabia do you deliver to?"),
      a: t(
        "نقوم حالياً بالتوصيل إلى جميع المدن الرئيسية في المملكة العربية السعودية بما في ذلك الرياض وجدة والدمام ومكة والمدينة والخبر والظهران وتبوك وأبها وخميس مشيط والجبيل والطائف وحائل ونجران وجيزان وبريدة والهفوف والمناطق المحيطة بها.",
        "We currently deliver to all major cities in Saudi Arabia including Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar, Dhahran, Tabuk, Abha, Khamis Mushait, Jubail, Taif, Hail, Najran, Jizan, Buraidah, Hofuf, and their surrounding areas."
      ),
    },
    {
      q: t("كم يستغرق التوصيل؟", "How long does delivery take?"),
      a: t(
        "تختلف أوقات التوصيل حسب الموقع: المدن الرئيسية (الرياض، جدة): توصيل في نفس اليوم للطلبات قبل 11 صباحاً. المدن الأخرى: 1-2 أيام عمل. المناطق النائية: 2-4 أيام عمل. تتوفر خيارات التوصيل السريع في مواقع مختارة.",
        "Delivery times vary by location: Major cities (Riyadh, Jeddah): Same-day delivery for orders placed before 11 AM. Other cities: 1-2 business days. Remote areas: 2-4 business days. Express delivery options are available in select locations."
      ),
    },
    {
      q: t("ما هي طرق الدفع المقبولة؟", "What payment methods do you accept?"),
      a: t(
        "نقبل عدة طرق دفع تشمل: جميع بطاقات الائتمان والخصم الرئيسية (فيزا، ماستركارد، أمريكان إكسبريس، مدى)، أبل باي وجوجل باي، الدفع عند الاستلام، التحويلات البنكية، و STC Pay.",
        "We accept multiple payment methods including: All major credit and debit cards (Visa, Mastercard, American Express, mada), Apple Pay and Google Pay, Cash on delivery, Bank transfers, and STC Pay."
      ),
    },
    {
      q: t("كيف تتعاملون مع توصيل المواد الغذائية القابلة للتلف؟", "How do you handle delivery of perishable food items?"),
      a: t(
        "نستخدم مركبات وتغليف خاص للتحكم في درجة الحرارة للحفاظ على جودة وسلامة المواد القابلة للتلف. يتم تعبئة المنتجات المبردة والمجمدة بأكياس ثلج أو ثلج جاف حسب الحاجة.",
        "We use specialized temperature-controlled vehicles and packaging to maintain the quality and safety of perishable items. Refrigerated and frozen products are packed with ice packs or dry ice as needed."
      ),
    },
    {
      q: t("ما هو الحد الأدنى لقيمة الطلب للتوصيل؟", "What is the minimum order value for delivery?"),
      a: t(
        "نعم، الحد الأدنى القياسي لقيمة الطلب هو 600 ريال سعودي.",
        "Yes, our standard minimum order value is 600 SAR."
      ),
    },
    {
      q: t("هل يمكنني تتبع طلبي؟", "Can I track my order?"),
      a: t(
        "نعم، يمكن تتبع جميع عمليات التوصيل في الوقت الفعلي عبر تطبيقنا أو موقعنا الإلكتروني. بمجرد إرسال طلبك، ستتلقى رسالة نصية وبريد إلكتروني مع رابط التتبع.",
        "Yes, all deliveries can be tracked in real-time through our app or website. Once your order is dispatched, you'll receive an SMS and email with a tracking link."
      ),
    },
  ];

  return (
    <section id="faq" className="py-20 scroll-chapter-marker relative">
      <StarsPattern />
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("الأسئلة الشائعة", "Frequently Asked Questions")}</span>
          </h2>
          <p className="text-muted-foreground text-lg body-reveal">
            {t(
              "إجابات على الأسئلة الشائعة حول منتجاتنا وطرق الدفع وخدمات التوصيل",
              "Answers to common questions about our products, payment methods, and delivery services"
            )}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-base font-semibold text-foreground hover:text-primary py-5 text-start">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
