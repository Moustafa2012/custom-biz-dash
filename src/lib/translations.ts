export type Language = "ar" | "en"
export type Direction = "rtl" | "ltr"

export interface TranslationPair {
  ar: string
  en: string
}

export function t(arabic: string, english: string): string {
  if (typeof window === "undefined") return english
  const language = localStorage.getItem("language") as Language || "en"
  return language === "ar" ? arabic : english
}

export function tPair(pair: TranslationPair): string {
  if (typeof window === "undefined") return pair.en
  const language = localStorage.getItem("language") as Language || "en"
  return language === "ar" ? pair.ar : pair.en
}

export function getDirection(): Direction {
  if (typeof window === "undefined") return "ltr"
  const language = localStorage.getItem("language") as Language || "en"
  return language === "ar" ? "rtl" : "ltr"
}

export function setLanguage(language: Language): void {
  if (typeof window === "undefined") return
  localStorage.setItem("language", language)
  document.documentElement.dir = getDirection()
  document.documentElement.lang = language
}
