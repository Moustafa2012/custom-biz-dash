# Translation System Guide

This project includes a bilingual translation system supporting Arabic (RTL) and English (LTR).

## Usage

### Basic Translation Function

Use the `t()` function anywhere in your components:

```tsx
import { t } from "@/lib/translations"

// Returns Arabic if language is "ar", English if "en"
t("إضافة", "Add")
t("حذف", "Delete")
t("تعديل", "Edit")
```

### Using Language Context

Access current language and direction:

```tsx
import { useLanguage } from "@/components/language-provider"

function MyComponent() {
  const { language, direction, toggleLanguage } = useLanguage()
  
  // language: "ar" | "en"
  // direction: "rtl" | "ltr"
  
  return (
    <button onClick={toggleLanguage}>
      Toggle Language
    </button>
  )
}
```

### Language Toggle Button

Use the pre-built language toggle component:

```tsx
import { LanguageToggle } from "@/components/ui/language-toggle"

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <LanguageToggle />
    </header>
  )
}
```

## Features

- **Automatic Direction**: RTL for Arabic, LTR for English
- **Persistent Storage**: Language preference saved in localStorage
- **Type Safety**: Full TypeScript support
- **Easy Integration**: Simple function-based API

## Example in App.tsx

```tsx
import { t } from "@/lib/translations"
import { LanguageToggle } from "@/components/ui/language-toggle"

export function App() {
  return (
    <div>
      <div className="flex justify-between">
        <h1>{t("مرحباً", "Welcome")}</h1>
        <LanguageToggle />
      </div>
      <p>{t("هذا نص بالعربية", "This is English text")}</p>
      <button>{t("إضافة", "Add")}</button>
    </div>
  )
}
```

## Files

- `src/lib/translations.ts` - Translation utility functions
- `src/components/language-provider.tsx` - React context provider
- `src/components/ui/language-toggle.tsx` - Toggle button component
