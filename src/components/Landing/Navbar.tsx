import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Moon, Sun, Menu, Home, Users, ShoppingBasket, ShieldCheck, Newspaper, HelpCircle, MessageSquare, Globe } from "lucide-react";
import logo from "@/assets/thouraya-logo.png";
import { UserNav } from "@/components/erp/user-nav";
import { ThemeToggle } from "@/components/erp/theme-toggle";
import { LanguageSwitcher } from "@/components/erp/language-switcher";
import { useAppConfig } from "@/components/erp/app-config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t, language } = useAppConfig();

  const navLinks = [
    { label: t("الرئيسية", "Home"), href: "#hero", icon: Home },
    { label: t("من نحن", "About Us"), href: "#about", icon: Users },
    { label: t("المنتجات", "Products"), href: "#products", icon: ShoppingBasket },
    { label: t("الجودة", "Quality"), href: "#quality", icon: ShieldCheck },
    { label: t("المقالات", "Articles"), href: "#articles", icon: Newspaper },
    { label: t("الأسئلة", "FAQ"), href: "#faq", icon: HelpCircle },
    { label: t("تواصل معنا", "Contact Us"), href: "#contact", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <a href="#hero" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <img src={logo} alt={t("ثريا البلاد", "Thouraya Albilad")} className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-base sm:text-xl font-bold text-primary truncate max-w-[120px] sm:max-w-none">
              {t("ثريا البلاد", "Thouraya Albilad")}
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2 xl:px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary rounded-md hover:bg-accent flex items-center gap-1.5 whitespace-nowrap"
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span className="hidden xl:inline">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <UserNav />

            <LanguageSwitcher />
            <ThemeToggle />

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === "ar" ? "left" : "right"} className="w-[280px] sm:w-[320px] p-0 flex flex-col">
                {/* Header Section */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <img 
                      src={logo} 
                      alt={t("ثريا البلاد", "Thouraya Albilad")} 
                      className="h-8 w-8" 
                    />
                    <span className="text-lg font-bold text-foreground">
                      {t("ثريا البلاد", "Thouraya Albilad")}
                    </span>
                  </div>
                </div>

                {/* Content Section - Navigation Links */}
                <div className="flex-1 overflow-y-auto p-2">
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="px-3 py-2.5 text-base font-medium text-foreground rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <link.icon className="h-5 w-5 shrink-0" />
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Footer Section - User Navigation */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("المظهر", "Theme")}
                      </span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("اللغة", "Language")}
                      </span>
                      <LanguageSwitcher />
                    </div>
                    <UserNav />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
