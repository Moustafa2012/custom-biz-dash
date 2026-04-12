import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { DirectionProvider } from "@/components/ui/direction";

export type StylePreset = "luma" | "classic" | "minimal";
export type BaseColor = "neutral" | "stone" | "zinc";
export type AccentColor = "violet" | "blue" | "emerald" | "rose" | "amber" | "cyan";
export type ChartColor = "emerald" | "blue" | "violet" | "rose" | "amber" | "cyan";
export type FontFamily = "geist" | "inter" | "sans";
export type IconLibrary = "hugeicons" | "lucide" | "heroicons";
export type BorderRadius = "default" | "none" | "sm" | "lg" | "full";

export type SidebarVariant = "floating" | "inset" | "sidebar";
export type CollapsibleState = "icon" | "offcanvas" | "none";
export type ContentDensity = "compact" | "default" | "relaxed";
export type FontScale = "sm" | "md" | "lg";

export type ErpAppId = "sales" | "finance" | "inventory";

export interface ErpApp {
  id: ErpAppId;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const erpApps: ErpApp[] = [
  { id: "sales", name: "Sales", icon: "S", color: "#10b981", description: "Orders & CRM" },
  { id: "finance", name: "Finance", icon: "F", color: "#7c3aed", description: "Accounting & Reports" },
  { id: "inventory", name: "Inventory & Mfg", icon: "I", color: "#f59e0b", description: "Stock & Production" },
];

export const ACCENT_COLORS: Record<AccentColor, { css: string; label: string; arLabel: string; hex: string }> = {
  violet: { css: "262 83% 58%", label: "Violet", arLabel: "بنفسجي", hex: "#7c3aed" },
  blue:   { css: "217 91% 60%", label: "Blue",   arLabel: "أزرق",   hex: "#3b82f6" },
  emerald:{ css: "160 84% 39%", label: "Emerald", arLabel: "زمرد",   hex: "#10b981" },
  rose:   { css: "350 89% 60%", label: "Rose",   arLabel: "وردي",   hex: "#f43f5e" },
  amber:  { css: "38 92% 50%",  label: "Amber",  arLabel: "عنبري",  hex: "#f59e0b" },
  cyan:   { css: "192 91% 36%", label: "Cyan",   arLabel: "سماوي",  hex: "#0891b2" },
};

export const CHART_COLORS = ACCENT_COLORS;

interface AppConfig {
  sidebarVariant: SidebarVariant;
  collapsible: CollapsibleState;
  currentApp: ErpApp;
  language: "en" | "ar";
  theme: "light" | "dark" | "system";
  resolvedTheme: "light" | "dark";
  accentColor: AccentColor;
  fontScale: FontScale;
  contentDensity: ContentDensity;
  sidebarOpen: boolean;
  stylePreset: StylePreset;
  baseColor: BaseColor;
  chartColor: ChartColor;
  headingFont: FontFamily;
  bodyFont: FontFamily;
  iconLibrary: IconLibrary;
  borderRadius: BorderRadius;

  setSidebarVariant: (v: SidebarVariant) => void;
  setCollapsible: (c: CollapsibleState) => void;
  setCurrentApp: (app: ErpApp) => void;
  setLanguage: (lang: "en" | "ar") => void;
  setTheme: (t: "light" | "dark" | "system") => void;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
  setFontScale: (scale: FontScale) => void;
  setContentDensity: (density: ContentDensity) => void;
  setSidebarOpen: (open: boolean) => void;
  setStylePreset: (v: StylePreset) => void;
  setBaseColor: (v: BaseColor) => void;
  setChartColor: (v: ChartColor) => void;
  setHeadingFont: (v: FontFamily) => void;
  setBodyFont: (v: FontFamily) => void;
  setIconLibrary: (v: IconLibrary) => void;
  setBorderRadius: (v: BorderRadius) => void;
  t: (arabic: string, english: string) => string;
  getAppName: (appId: string) => string;
  getAppDescription: (appId: string) => string;
  getColorLabel: (colorKey: string) => string;
}

const AppConfigContext = createContext<AppConfig | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function loadPref<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [sidebarVariant, setSidebarVariantState] = useState<SidebarVariant>(() => loadPref("sidebarVariant", "inset"));
  const [collapsible, setCollapsibleState] = useState<CollapsibleState>(() => loadPref("collapsible", "icon"));
  const [currentApp, setCurrentAppState] = useState<ErpApp>(erpApps[0]);
  const [language, setLanguageState] = useState<"en" | "ar">(() => loadPref("language", "en"));
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => loadPref("theme", "system"));
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => loadPref("accentColor", "blue"));
  const [fontScale, setFontScaleState] = useState<FontScale>(() => loadPref("fontScale", "md"));
  const [contentDensity, setContentDensityState] = useState<ContentDensity>(() => loadPref("contentDensity", "default"));
  const [sidebarOpen, setSidebarOpenState] = useState(true);
  const [stylePreset, setStylePresetState] = useState<StylePreset>(() => loadPref("stylePreset", "luma"));
  const [baseColor, setBaseColorState] = useState<BaseColor>(() => loadPref("baseColor", "neutral"));
  const [chartColor, setChartColorState] = useState<ChartColor>(() => loadPref("chartColor", "emerald"));
  const [headingFont, setHeadingFontState] = useState<FontFamily>(() => loadPref("headingFont", "geist"));
  const [bodyFont, setBodyFontState] = useState<FontFamily>(() => loadPref("bodyFont", "geist"));
  const [iconLibrary, setIconLibraryState] = useState<IconLibrary>(() => loadPref("iconLibrary", "lucide"));
  const [borderRadius, setBorderRadiusState] = useState<BorderRadius>(() => loadPref("borderRadius", "default"));

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme());
  const resolvedTheme: "light" | "dark" = theme === "system" ? systemTheme : theme;

  const persist = <T,>(key: string, val: T) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const color = ACCENT_COLORS[accentColor];
    root.style.setProperty("--primary", color.css);
    root.style.setProperty("--ring", color.css);
    root.style.setProperty("--sidebar-primary", color.css);
    root.style.setProperty("--sidebar-ring", color.css);
  }, [accentColor]);

  useEffect(() => {
    const root = document.documentElement;
    const scaleMap: Record<FontScale, string> = { sm: "0.875", md: "1", lg: "1.0625" };
    root.style.setProperty("--font-scale", scaleMap[fontScale]);
    root.style.fontSize = fontScale === "sm" ? "14px" : fontScale === "lg" ? "16.5px" : "15px";
  }, [fontScale]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--style-preset", stylePreset);
    root.style.setProperty("--base-color", baseColor);
    root.style.setProperty("--chart-color-hsl", CHART_COLORS[chartColor].css);
    root.style.setProperty("--font-heading", headingFont);
    root.style.setProperty("--font-body", bodyFont);
    root.style.setProperty("--icon-library", iconLibrary);
    root.style.setProperty(
      "--radius",
      borderRadius === "none" ? "0px" :
      borderRadius === "sm" ? "4px" :
      borderRadius === "lg" ? "12px" :
      borderRadius === "full" ? "9999px" : "10px"
    );
  }, [stylePreset, baseColor, chartColor, headingFont, bodyFont, iconLibrary, borderRadius]);

  // Apply document direction for RTL/LTR
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setSidebarVariant = (v: SidebarVariant) => { setSidebarVariantState(v); persist("sidebarVariant", v); };
  const setCollapsible = (c: CollapsibleState) => { setCollapsibleState(c); persist("collapsible", c); };
  const setCurrentApp = (app: ErpApp) => setCurrentAppState(app);
  const setLanguage = (lang: "en" | "ar") => { setLanguageState(lang); persist("language", lang); };
  const setTheme = (t: "light" | "dark" | "system") => { setThemeState(t); persist("theme", t); };
  const toggleTheme = () => setTheme(resolvedTheme === "light" ? "dark" : "light");
  const setAccentColor = (color: AccentColor) => { setAccentColorState(color); persist("accentColor", color); };
  const setFontScale = (scale: FontScale) => { setFontScaleState(scale); persist("fontScale", scale); };
  const setContentDensity = (density: ContentDensity) => { setContentDensityState(density); persist("contentDensity", density); };
  const setSidebarOpen = (open: boolean) => setSidebarOpenState(open);
  const setStylePreset = (v: StylePreset) => { setStylePresetState(v); persist("stylePreset", v); };
  const setBaseColor = (v: BaseColor) => { setBaseColorState(v); persist("baseColor", v); };
  const setChartColor = (v: ChartColor) => { setChartColorState(v); persist("chartColor", v); };
  const setHeadingFont = (v: FontFamily) => { setHeadingFontState(v); persist("headingFont", v); };
  const setBodyFont = (v: FontFamily) => { setBodyFontState(v); persist("bodyFont", v); };
  const setIconLibrary = (v: IconLibrary) => { setIconLibraryState(v); persist("iconLibrary", v); };
  const setBorderRadius = (v: BorderRadius) => { setBorderRadiusState(v); persist("borderRadius", v); };
  const t = (arabic: string, english: string) => language === "ar" ? arabic : english;

  const getAppName = (appId: string) => {
    const names: Record<string, { ar: string; en: string }> = {
      sales: { ar: "المبيعات", en: "Sales" },
      finance: { ar: "المالية", en: "Finance" },
      inventory: { ar: "المخزون والتصنيع", en: "Inventory & Mfg" },
    };
    const n = names[appId];
    return n ? (language === "ar" ? n.ar : n.en) : appId;
  };

  const getAppDescription = (appId: string) => {
    const descs: Record<string, { ar: string; en: string }> = {
      sales: { ar: "الطلبات وإدارة العملاء", en: "Orders & CRM" },
      finance: { ar: "المحاسبة والتقارير", en: "Accounting & Reports" },
      inventory: { ar: "المخزون والإنتاج", en: "Stock & Production" },
    };
    const d = descs[appId];
    return d ? (language === "ar" ? d.ar : d.en) : "";
  };

  const getColorLabel = (colorKey: string) => {
    const color = ACCENT_COLORS[colorKey as AccentColor];
    return color ? (language === "ar" ? color.arLabel : color.label) : colorKey;
  };

  return (
    <DirectionProvider dir={language === "ar" ? "rtl" : "ltr"}>
      <AppConfigContext.Provider value={{
        sidebarVariant, collapsible, currentApp, language, theme, resolvedTheme,
        accentColor, fontScale, contentDensity, sidebarOpen,
        stylePreset, baseColor, chartColor, headingFont, bodyFont, iconLibrary, borderRadius,
        setSidebarVariant, setCollapsible, setCurrentApp, setLanguage, setTheme, toggleTheme,
        setAccentColor, setFontScale, setContentDensity, setSidebarOpen,
        setStylePreset, setBaseColor, setChartColor, setHeadingFont, setBodyFont,
        setIconLibrary, setBorderRadius, t, getAppName, getAppDescription, getColorLabel,
      }}>
        {children}
      </AppConfigContext.Provider>
    </DirectionProvider>
  );
}

export const useAppConfig = () => {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error("useAppConfig must be used within AppConfigProvider");
  return ctx;
};
