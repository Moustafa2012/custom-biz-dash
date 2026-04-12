import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import logo from "@/assets/thouraya-logo.png";
import { useAppConfig } from "@/components/erp/app-config";

export default function Footer() {
  const { t } = useAppConfig();

  const quickLinks = [
    { label: t("About Us", "من نحن"), href: "#about" },
    { label: t("Quality", "الجودة"), href: "#quality" },
    { label: t("Products", "المنتجات"), href: "#products" },
    { label: t("FAQ", "الأسئلة الشائعة"), href: "#faq" },
    { label: t("Contact Us", "تواصل معنا"), href: "#contact" },
  ];

  return (
    <footer className="bg-card border-t border-border/50 pt-16 pb-8">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt={t("Thouraya Albilad", "ثريا البلاد")} className="h-10 w-10" />
              <div>
                <h3 className="text-xl font-bold text-foreground leading-tight">{t("Thouraya Albilad", "ثريا البلاد")}</h3>
                <p className="text-xs font-medium text-primary">{t("Trading", "للتجارة")}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "We are a leading company in agricultural trade, committed to the highest standards of quality and sustainability to provide the best products to our valued customers.",
                "نحن شركة رائدة في التجارة الزراعية، ملتزمون بأعلى معايير الجودة والاستدامة لتقديم أفضل المنتجات لعملائنا الكرام."
              )}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">{t("Quick Links", "روابط سريعة")}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">{t("Contact Us", "تواصل معنا")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /><span dir="ltr">+966550168553</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary shrink-0" /><span dir="ltr">info@thurayaalbilad.com</span></li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary shrink-0" />{t("Jeddah, Petromin District", "جدة، حي البترومين")}</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary shrink-0" />{t("Sun - Thu: 9 AM - 5 PM", "الأحد - الخميس: 9 ص - 5 م")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">{t("Newsletter", "النشرة البريدية")}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t("Subscribe to get the latest updates on our products and services", "اشترك للحصول على آخر التحديثات عن منتجاتنا وخدماتنا")}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder={t("Your email", "بريدك الإلكتروني")} type="email" dir="ltr" className="flex-1" />
              <Button size="sm">{t("Subscribe", "اشترك")}</Button>
            </form>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{t("© 2026 All rights reserved to Thuraya Albilad Trading Company", "© 2026 جميع الحقوق محفوظة لشركة ثريا البلاد للتجارة")}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">{t("Privacy Policy", "سياسة الخصوصية")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("Terms of Service", "الشروط والأحكام")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
