import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { Moon, Sun, Globe } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme, setTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      const success = await login(data.email, data.password)
      if (success) {
        navigate("/")
      } else {
        // Error handling will be done by the LoginForm component
        console.error("Invalid credentials")
      }
    } catch (err) {
      // Error handling will be done by the LoginForm component
      console.error("Login error:", err)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-background dark:via-background dark:to-muted/20 p-6 md:p-10 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.05),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.03] dark:opacity-[0.02]" />
      
      {/* Top-right controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        {/* Language toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          className="h-9 w-9 rounded-xl text-gray-700 dark:text-white/60 backdrop-blur-sm border border-gray-300 dark:border-white/10 bg-white/50 dark:bg-transparent transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/20"
        >
          <Globe className="h-4 w-4 shrink-0" />
          <span className="sr-only">
            {language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          </span>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative h-9 w-9 rounded-xl text-gray-700 dark:text-white/60 backdrop-blur-sm border border-gray-300 dark:border-white/10 bg-white/50 dark:bg-transparent transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/20"
          aria-label={theme === "dark" ? t("الوضع الفاتح", "Light mode") : t("الوضع الداكن", "Dark mode")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
      
      <div className="relative z-10 flex w-full max-w-lg items-center justify-center">
        <LoginForm 
          onSuccess={(data) => {
            // Handle successful login/signup
            if (data.tab === "login") {
              // For login, authenticate user
              handleSubmit({ email: data.email, password: data.password } as any)
            } else {
              // For signup, you might redirect to a verification page or auto-login
              console.log("Signup successful:", data)
              // For now, just navigate to home
              navigate("/")
            }
          }}
        />
      </div>
    </div>
  )
}

function t(_ar: string, en: string) {
  // Simple translation function - in real app this would use the translation context
  return en // For now return English, you can integrate with the actual translation system
}
