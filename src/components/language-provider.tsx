import * as React from "react"
import { type Language, type Direction, setLanguage } from "@/lib/translations"
import { DirectionProvider } from "@/components/ui/direction.tsx"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  direction: Direction
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

const LanguageProviderContext = React.createContext<
  LanguageProviderState | undefined
>(undefined)

function isLanguage(value: string | null): value is Language {
  return value === "ar" || value === "en"
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguageState] = React.useState<Language>(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored && isLanguage(stored)) {
      return stored
    }
    return defaultLanguage
  })

  const direction: Direction = language === "ar" ? "rtl" : "ltr"

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("ltr", "rtl")
    root.classList.add(direction)
    root.setAttribute("dir", direction)
    root.setAttribute("lang", language)
  }, [language, direction])

  const handleSetLanguage = React.useCallback(
    (newLanguage: Language) => {
      localStorage.setItem(storageKey, newLanguage)
      setLanguageState(newLanguage)
      setLanguage(newLanguage)
    },
    [storageKey]
  )

  const toggleLanguage = React.useCallback(() => {
    handleSetLanguage(language === "ar" ? "en" : "ar")
  }, [language, handleSetLanguage])

  const value = React.useMemo(
    () => ({
      language,
      direction,
      setLanguage: handleSetLanguage,
      toggleLanguage,
    }),
    [language, direction, handleSetLanguage, toggleLanguage]
  )

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      <DirectionProvider dir={direction}>
        {children}
      </DirectionProvider>
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = React.useContext(LanguageProviderContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
