import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import logo from "@/assets/thouraya-logo.png";
import { useAppConfig } from "@/components/erp/app-config";

export default function Footer() {
  const { t } = useAppConfig();

  const quickLinks = [
    { label: t("من نحن", "About Us"), href: "#about" },
    { label: t("الجودة", "Quality"), href: "#quality" },
    { label: t("المنتجات", "Products"), href: "#products" },
    { label: t("الأسئلة الشائعة", "FAQ"), href: "#faq" },
    { label: t("تواصل معنا", "Contact Us"), href: "#contact" },
  ];

  return (
    <footer className="bg-card border-t border-border/50 pt-16 pb-8">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt={t("ثريا البلاد", "Thouraya Albilad")} className="h-10 w-10" />
              <div>
                <h3 className="text-xl font-bold text-foreground leading-tight">{t("ثريا البلاد", "Thouraya Albilad")}</h3>
                <p className="text-xs font-medium text-primary">{t("للتجارة", "Trading")}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "نحن شركة رائدة في التجارة الزراعية، ملتزمون بأعلى معايير الجودة والاستدامة لتقديم أفضل المنتجات لعملائنا الكرام.",
                "We are a leading company in agricultural trade, committed to the highest standards of quality and sustainability to provide the best products to our valued customers."
              )}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">{t("روابط سريعة", "Quick Links")}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">{t("تواصل معنا", "Contact Us")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /><span dir="ltr">+966550168553</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary shrink-0" /><span dir="ltr">info@thurayaalbilad.com</span></li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary shrink-0" />{t("جدة، حي البترومين", "Jeddah, Petromin District")}</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary shrink-0" />{t("الأحد - الخميس: 9 ص - 5 م", "Sun - Thu: 9 AM - 5 PM")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">{t("النشرة البريدية", "Newsletter")}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t("اشترك للحصول على آخر التحديثات عن منتجاتنا وخدماتنا", "Subscribe to get the latest updates on our products and services")}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder={t("بريدك الإلكتروني", "Your email")} type="email" dir="ltr" className="flex-1" />
              <Button size="sm">{t("اشترك", "Subscribe")}</Button>
            </form>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{t("© 2026 جميع الحقوق محفوظة لشركة ثريا البلاد للتجارة", "© 2026 All rights reserved to Thuraya Albilad Trading Company")}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">{t("سياسة الخصوصية", "Privacy Policy")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("الشروط والأحكام", "Terms of Service")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}