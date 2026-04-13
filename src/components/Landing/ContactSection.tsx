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
            <span className="line-draw">{t("تواصل معنا", "Get In Touch")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t("هل لديك أسئلة أو تحتاج مساعدة؟ نحن على بُعد رسالة منك", "Have questions or need assistance? We're just a message away")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 bg-card border-border/50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-foreground">{t("أرسل لنا رسالة", "Send Us a Message")}</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("الاسم الكامل", "Full Name")}</label>
                    <Input placeholder={t("اسمك الكامل", "Your full name")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("البريد الإلكتروني", "Email")}</label>
                    <Input type="email" placeholder="your.email@example.com" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("الموضوع", "Subject")}</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("اختر الموضوع", "Select subject")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t("استفسار عام", "General Inquiry")}</SelectItem>
                      <SelectItem value="products">{t("استفسار عن المنتجات", "Products Inquiry")}</SelectItem>
                      <SelectItem value="orders">{t("استفسار عن الطلبات", "Orders Inquiry")}</SelectItem>
                      <SelectItem value="complaints">{t("شكاوى", "Complaints")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("رسالتك", "Your Message")}</label>
                  <Textarea placeholder={t("كيف يمكننا مساعدتك؟", "How can we help you?")} rows={4} />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto px-10">
                  {t("إرسال الرسالة", "Send Message")}
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
                  <h4 className="font-bold text-foreground mb-1">{t("أرقام الهاتف", "Phone Numbers")}</h4>
                  <p className="text-sm text-muted-foreground" dir="ltr">+966-55-016-8553</p>
                  <a href="https://wa.me/966550168553" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {t("تواصل عبر واتساب", "Contact via WhatsApp")}
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
                  <h4 className="font-bold text-foreground mb-1">{t("البريد الإلكتروني", "Email")}</h4>
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
                  <h4 className="font-bold text-foreground mb-1">{t("ساعات العمل", "Working Hours")}</h4>
                  <p className="text-sm text-muted-foreground">{t("الأحد - الخميس: 9:00 ص - 5:00 م", "Sunday - Thursday: 9:00 AM - 5:00 PM")}</p>
                  <p className="text-sm text-muted-foreground">{t("الجمعة: مغلق", "Friday: Closed")}</p>
                  <p className="text-sm text-muted-foreground">{t("السبت: 10:00 ص - 3:00 م", "Saturday: 10:00 AM - 3:00 PM")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-float bg-card border-border/50">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 icon-bounce" style={{ animationDelay: "0.3s" }}>
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{t("فروعنا", "Our Branches")}</h4>
                  <p className="text-sm text-muted-foreground font-semibold">{t("الفرع الرئيسي - جدة", "Main Branch - Jeddah")}</p>
                  <p className="text-sm text-muted-foreground mb-1">{t("طريق الملك فيصل، حي البترومين، جدة", "King Faisal Road, Petromin District, Jeddah")}</p>
                  <a href="https://www.google.com/maps?ll=21.435245,39.191568&z=15&t=m&hl=ar&gl=SA&mapclient=embed&cid=3828446472197086210" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    {t("عرض على الخريطة", "View on Map")}
                  </a>
                  <p className="text-sm text-muted-foreground font-semibold">{t("الفرع الثاني - الرياض", "Second Branch - Riyadh")}</p>
                  <p className="text-sm text-muted-foreground mb-1">{t("الرياض", "Riyadh")}</p>
                  <a href="https://www.google.com/maps?ll=24.556047,46.751451&z=19&t=m&hl=en&gl=SA&mapclient=embed&q=24%C2%B033%2721.7%22N+46%C2%B045%2705.7%22E+24.556028,+46.751583@24.5560278,46.7515833" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {t("عرض على الخريطة", "View on Map")}
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