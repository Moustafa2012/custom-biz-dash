import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, Clock, MapPin, MessageCircle, Send } from "lucide-react"
import { t } from "@/lib/translations"
import { CONTACT_PHONE, COMPANY_SUPPORT_EMAIL, COMPANY_SALES_EMAIL, WHATSAPP_URL, BRANCHES } from "@/data/constants"

const contactInfo = [
  {
    icon: Phone,
    title: t("أرقام الهاتف", "Phone Numbers"),
    delay: "0s",
    content: (
      <div>
        <p className="text-sm text-muted-foreground" dir="ltr">{CONTACT_PHONE}</p>
        <a
          href={WHATSAPP_URL}
          className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-[#25D366] hover:underline underline-offset-4"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {t("تواصل عبر واتساب", "Chat on WhatsApp")}
        </a>
      </div>
    ),
  },
  {
    icon: Mail,
    title: t("البريد الإلكتروني", "Email"),
    delay: "0.05s",
    content: (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground" dir="ltr">{COMPANY_SUPPORT_EMAIL}</p>
        <p className="text-sm text-muted-foreground" dir="ltr">{COMPANY_SALES_EMAIL}</p>
      </div>
    ),
  },
  {
    icon: Clock,
    title: t("ساعات العمل", "Working Hours"),
    delay: "0.1s",
    content: (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{t("الأحد - الخميس: 9:00 ص - 5:00 م", "Sunday - Thursday: 9:00 AM - 5:00 PM")}</p>
        <p className="text-sm text-muted-foreground">{t("الجمعة: مغلق", "Friday: Closed")}</p>
        <p className="text-sm text-muted-foreground">{t("السبت: 10:00 ص - 3:00 م", "Saturday: 10:00 AM - 3:00 PM")}</p>
      </div>
    ),
  },
  {
    icon: MapPin,
    title: t("فروعنا", "Our Branches"),
    delay: "0.15s",
    content: (
      <div className="space-y-3">
        {BRANCHES.map((branch, index) => (
          <div key={index}>
            <p className="text-sm font-semibold text-foreground/80">{branch.name}</p>
            <p className="text-sm text-muted-foreground mb-1">{branch.address}</p>
            <a
              href={branch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              <MapPin className="h-3.5 w-3.5" />
              {t("عرض على الخريطة", "View on Map")}
            </a>
          </div>
        ))}
      </div>
    ),
  },
]

export default function ContactSection() {
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section ref={ref} id="contact" className="py-24 bg-transparent relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/3 w-96 h-80 bg-primary/4 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-72 bg-emerald-500/3 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("نحن هنا لمساعدتك", "We're Here to Help")}
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black mb-4 text-foreground tracking-tight transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("تواصل", "Get In")}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t("معنا", "Touch")}
            </span>
          </h2>

          <p
            className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("هل لديك أسئلة أو تحتاج مساعدة؟ نحن على بُعد رسالة منك", "Have questions or need assistance? We're just a message away")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <Card className="bg-card border-border/50 overflow-hidden">
              {/* Card header accent */}
              <div className="h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary" />

              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  {t("أرسل لنا رسالة", "Send Us a Message")}
                </h3>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground block">
                        {t("الاسم الكامل", "Full Name")}
                      </label>
                      <Input
                        placeholder={t("اسمك الكامل", "Your full name")}
                        className="h-11 bg-background/50 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground block">
                        {t("البريد الإلكتروني", "Email")}
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        dir="ltr"
                        className="h-11 bg-background/50 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground block">
                      {t("الموضوع", "Subject")}
                    </label>
                    <Select>
                      <SelectTrigger className="h-11 bg-background/50 border-border/60 focus:border-primary/60 focus:ring-primary/20 transition-all duration-200">
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

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground block">
                      {t("رسالتك", "Your Message")}
                    </label>
                    <Textarea
                      placeholder={t("كيف يمكننا مساعدتك؟", "How can we help you?")}
                      rows={5}
                      className="bg-background/50 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/20 transition-all duration-200 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto px-10 h-12 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 gap-2"
                  >
                    {submitted ? (
                      <>
                        <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">✓</span>
                        {t("تم الإرسال!", "Sent!")}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t("إرسال الرسالة", "Send Message")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className={`group transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                style={{ transitionDelay: `${400 + i * 80}ms` }}
              >
                <Card className="bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/10 group-hover:bg-primary/20 group-hover:ring-primary/25 group-hover:scale-105 transition-all duration-300">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-foreground mb-2 text-sm">{info.title}</h4>
                      {info.content}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}