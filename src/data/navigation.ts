import { Home, Users, ShoppingBasket, ShieldCheck, Newspaper, HelpCircle, MessageSquare } from "lucide-react"

export const navLinksConfig = [
  { arabicLabel: "الرئيسية", englishLabel: "Home", href: "#hero", icon: Home },
  { arabicLabel: "من نحن", englishLabel: "About Us", href: "#about", icon: Users },
  { arabicLabel: "المنتجات", englishLabel: "Products", href: "#products", icon: ShoppingBasket },
  { arabicLabel: "الجودة", englishLabel: "Quality", href: "#quality", icon: ShieldCheck },
  { arabicLabel: "المقالات", englishLabel: "Articles", href: "#articles", icon: Newspaper },
  { arabicLabel: "الأسئلة", englishLabel: "FAQ", href: "#faq", icon: HelpCircle },
  { arabicLabel: "تواصل معنا", englishLabel: "Contact Us", href: "#contact", icon: MessageSquare },
] as const

export const quickLinksConfig = [
  { arabicLabel: "من نحن", englishLabel: "About Us", href: "#about" },
  { arabicLabel: "الجودة", englishLabel: "Quality", href: "#quality" },
  { arabicLabel: "المنتجات", englishLabel: "Products", href: "#products" },
  { arabicLabel: "الأسئلة الشائعة", englishLabel: "FAQ", href: "#faq" },
  { arabicLabel: "تواصل معنا", englishLabel: "Contact Us", href: "#contact" },
] as const
