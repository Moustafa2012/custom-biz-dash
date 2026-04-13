import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/hero-video.mp4";
import { Award, Package, Users, Handshake, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppConfig } from "@/components/erp/app-config";

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useAppConfig();
  const direction = language === "ar" ? "rtl" : "ltr";

  const stats = [
    { icon: Award, value: "+15", label: t("عاماً من الخبرة", "Years of Experience") },
    { icon: Package, value: "+5000", label: t("منتج متنوع", "Diverse Products") },
    { icon: Users, value: "+2500", label: t("عميل راضٍ", "Satisfied Clients") },
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowVideo(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section id="hero" className="relative min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] flex items-center overflow-hidden w-full" aria-label="Hero section">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <img src={heroBg} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`} loading="eager" />
          {showVideo && (
            <video src={heroVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000" aria-hidden="true" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-background/30 via-background/20 to-background/10 dark:from-background/40 dark:via-background/35 dark:to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Badge variant="secondary" className="mb-6 text-sm md:text-base px-4 py-2 gap-2 hover:scale-105 transition-transform duration-300 shadow-lg">
              <Handshake className="h-4 w-4" />
              {t("شريكك الموثوق في تجارة المواد الغذائية", "Your Trusted Partner in Global Agricultural Trade")}
            </Badge>
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6 text-foreground transform transition-all duration-700 delay-100 break-words ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {t("ثريا البلاد", "Thouraya Albilad")}{" "}
            <span className="text-gradient inline-block hover:scale-105 transition-transform duration-300">
              {t("للتجارة", "Trading")}
            </span>
          </h1>

          <p className={`text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-xl transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {t(
              "حلول مبتكرة مصممة خصيصاً لتلبية احتياجاتك. نجمع بين الخبرة والتكنولوجيا المتقدمة لتقديم نتائج استثنائية.",
              "Innovative solutions tailored to your unique needs. We combine expertise with cutting-edge technology to deliver exceptional results."
            )}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 mb-16 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Button size="lg" className="text-base px-8 group shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <a href="#products" className="flex items-center gap-2">
                {t("تصفح المنتجات", "Browse Products")}
                <ArrowIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 backdrop-blur-sm bg-background/50 hover:bg-background/80 border-2 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <a href="#contact">{t("تواصل معنا", "Contact Us")}</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-lg lg:max-w-xl">
            {stats.map((stat, index) => (
              <div key={index} className={`group text-center p-4 md:p-6 rounded-xl bg-card/60 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl hover:bg-card/80 hover:scale-105 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${400 + index * 100}ms` }}>
                <stat.icon className="h-6 w-6 md:h-7 md:w-7 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}