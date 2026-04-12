import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { StarsPattern } from "@/components/ui/pattren";
import { useAppConfig } from "@/components/erp/app-config";

export default function ContactSection() {
  const { t } = useAppConfig();

  return (
    <section id="contact" className="py-20 section-alt scroll-chapter-marker relative">
      <StarsPattern />
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Get In Touch", "تواصل معنا")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t("Have questions or need assistance? We're just a message away", "هل لديك أسئلة أو تحتاج مساعدة؟ نحن على بُعد رسالة منك")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 bg-card border-border/50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-foreground">{t("Send Us a Message", "أرسل لنا رسالة")}</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("Full Name", "الاسم الكامل")}</label>
                    <Input placeholder={t("Your full name", "اسمك الكامل")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("Email", "البريد الإلكتروني")}</label>
                    <Input type="email" placeholder="your.email@example.com" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("Subject", "الموضوع")}</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select subject", "اختر الموضوع")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t("General Inquiry", "استفسار عام")}</SelectItem>
                      <SelectItem value="products">{t("Products Inquiry", "استفسار عن المنتجات")}</SelectItem>
                      <SelectItem value="orders">{t("Orders Inquiry", "استفسار عن الطلبات")}</SelectItem>
                      <SelectItem value="complaints">{t("Complaints", "شكاوى")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("Your Message", "رسالتك")}</label>
                  <Textarea placeholder={t("How can we help you?", "كيف يمكننا مساعدتك؟")} rows={4} />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto px-10">
                  {t("Send Message", "إرسال الرسالة")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <Card className="card-float bg-card border-border/50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 icon-bounce">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{t("Phone Numbers", "أرقام الهاتف")}</h4>
                  <p className="text-sm text-muted-foreground" dir="ltr">+966-55-016-8553</p>
                  <a href="https://wa.me/966550168553" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {t("Contact via WhatsApp", "تواصل عبر واتساب")}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="card-float bg-card border-border/50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 icon-bounce" style={{ animationDelay: "0.1s" }}>
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{t("Email", "البريد الإلكتروني")}</h4>
                  <p className="text-sm text-muted-foreground" dir="ltr">support@thourayaalbilad.com</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">sales@thourayaalbilad.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-float bg-card border-border/50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 icon-bounce" style={{ animationDelay: "0.2s" }}>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{t("Working Hours", "ساعات العمل")}</h4>
                  <p className="text-sm text-muted-foreground">{t("Sunday - Thursday: 9:00 AM - 5:00 PM", "الأحد - الخميس: 9:00 ص - 5:00 م")}</p>
                  <p className="text-sm text-muted-foreground">{t("Friday: Closed", "الجمعة: مغلق")}</p>
                  <p className="text-sm text-muted-foreground">{t("Saturday: 10:00 AM - 3:00 PM", "السبت: 10:00 ص - 3:00 م")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-float bg-card border-border/50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 icon-bounce" style={{ animationDelay: "0.3s" }}>
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{t("Our Branches", "فروعنا")}</h4>
                  <p className="text-sm text-muted-foreground font-semibold">{t("Main Branch - Jeddah", "الفرع الرئيسي - جدة")}</p>
                  <p className="text-sm text-muted-foreground mb-1">{t("King Faisal Road, Petromin District, Jeddah", "طريق الملك فيصل، حي البترومين، جدة")}</p>
                  <a href="https://www.google.com/maps?ll=21.435245,39.191568&z=15&t=m&hl=ar&gl=SA&mapclient=embed&cid=3828446472197086210" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    {t("View on Map", "عرض على الخريطة")}
                  </a>
                  <p className="text-sm text-muted-foreground font-semibold">{t("Second Branch - Riyadh", "الفرع الثاني - الرياض")}</p>
                  <p className="text-sm text-muted-foreground mb-1">{t("Riyadh", "الرياض")}</p>
                  <a href="https://www.google.com/maps?ll=24.556047,46.751451&z=19&t=m&hl=en&gl=SA&mapclient=embed&q=24%C2%B033%2721.7%22N+46%C2%B045%2705.7%22E+24.556028,+46.751583@24.5560278,46.7515833" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {t("View on Map", "عرض على الخريطة")}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
