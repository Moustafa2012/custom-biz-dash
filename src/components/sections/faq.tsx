import { useEffect, useRef, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { t } from "@/lib/translations"
import { faqs } from "@/data/faqs"

export default function FAQSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="faq" className="py-24 bg-transparent scroll-chapter-marker relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("لديك سؤال؟", "Have Questions?")}
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black mb-4 text-foreground tracking-tight transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t("الأسئلة", "Frequently Asked")}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t("الشائعة", "Questions")}
            </span>
          </h2>

          <p
            className={`text-muted-foreground text-lg transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {t(
              "إجابات على الأسئلة الشائعة حول منتجاتنا وطرق الدفع وخدمات التوصيل",
              "Answers to common questions about our products, payment methods, and delivery services"
            )}
          </p>
        </div>

        <div
          className={`transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Accordion type="single" collapsible className="space-y-3 border border-none">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="group rounded-xl  border-border/50 bg-card px-0 overflow-hidden hover:border-primary/30 transition-all duration-300 data-[state=open]:border-primary/40 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5"
              >
                <AccordionTrigger className="px-6 text-base font-semibold text-foreground hover:text-primary py-5 text-start transition-colors duration-200 hover:no-underline [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors duration-300">
                      {i + 1}
                    </span>
                    {faq.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5">
                  <div className="ms-9 text-muted-foreground leading-relaxed text-sm border-s-2 border-primary/20 ps-4">
                    {faq.a}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}