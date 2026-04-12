import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { useAppConfig } from "@/components/erp/app-config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/erp/language-switcher";
import { ThemeToggle } from "@/components/erp/theme-toggle";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const verify2FA = useAuthStore((s) => s.verify2FA);
  const twoFactorState = useAuthStore((s) => s.twoFactorState);
  const logout = useAuthStore((s) => s.logout);
  const intendedRoute = useAuthStore((s) => s.intendedRoute);
  const setIntendedRoute = useAuthStore((s) => s.setIntendedRoute);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useAppConfig();

  if (!twoFactorState?.isRequired) {
    return <Navigate to="/login" replace />;
  }

  const methodLabel =
    twoFactorState.method === "otp" ? t("تطبيق المصادقة", "Authenticator App") :
    twoFactorState.method === "email" ? t("البريد الإلكتروني", "Email") : t("تطبيق المصادقة", "Authentication App");

  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = verify2FA(code.trim());
      setLoading(false);

      if (success) {
        const dest = intendedRoute || "/sales";
        setIntendedRoute(null);
        navigate(dest, { replace: true });
      } else {
        setError(useBackup
          ? t("رمز الاسترداد غير صالح. حاول مرة أخرى.", "Invalid backup code. Please try again.")
          : t("رمز التحقق غير صالح. حاول مرة أخرى.", "Invalid verification code. Please try again.")
        );
        setCode("");
      }
    }, 500);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, "").toUpperCase();
    if (useBackup) {
      setCode(val.slice(0, 6));
    } else {
      setCode(val.replace(/\D/g, "").slice(0, 6));
    }
    if (error) setError("");
  };

  const handleResend = () => {
    toast({
      title: t("تم إعادة الإرسال", "Code Resent"),
      description: t(`تم إرسال رمز تحقق جديد إلى ${methodLabel}.`, `A new verification code has been sent to your ${methodLabel}.`),
    });
  };

  const handleCancel = () => {
    logout();
    navigate("/login");
  };

  const isComplete = code.length === 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 end-4 flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-1">
            <Layers className="h-4 w-4" /> {t("نظام إدارة الموارد", "ERP Suite")}
          </Link>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("المصادقة الثنائية", "Two-Factor Authentication")}</h1>
          <p className="text-sm text-muted-foreground">
            {useBackup
              ? t("أدخل أحد رموز الاسترداد", "Enter one of your backup codes")
              : t(`أدخل الرمز المكوّن من 6 أرقام من ${methodLabel}`, `Enter the 6-digit code from your ${methodLabel}`)}
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{useBackup ? t("رمز الاسترداد", "Backup Code") : t("رمز التحقق", "Verification Code")}</CardTitle>
            <CardDescription>
              {useBackup
                ? t("كل رمز استرداد يمكن استخدامه مرة واحدة فقط.", "Each backup code can only be used once.")
                : t("رمز OTP التجريبي الافتراضي: 123456", "Default demo OTP: 123456")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Input
                  type="text"
                  inputMode={useBackup ? "text" : "numeric"}
                  placeholder={useBackup ? "A1B2C3" : "000000"}
                  value={code}
                  onChange={handleCodeChange}
                  className="text-center text-2xl tracking-[0.4em] font-mono h-14"
                  maxLength={6}
                  autoFocus
                  autoComplete="one-time-code"
                />
                {!useBackup && (
                  <div className="flex justify-center gap-1 pt-1">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 w-6 rounded-full transition-all duration-200 ${
                          i < code.length ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading || !isComplete}>
                {loading ? t("جارٍ التحقق…", "Verifying…") : t("تحقق وسجّل الدخول", "Verify & Sign In")}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setUseBackup(!useBackup); setCode(""); setError(""); }}
                  className="text-primary hover:underline"
                >
                  {useBackup ? t("استخدام رمز التحقق", "Use verification code") : t("استخدام رمز الاسترداد", "Use backup code")}
                </button>
                {!useBackup && (
                  <button type="button" onClick={handleResend} className="text-primary hover:underline">
                    {t("إعادة إرسال الرمز", "Resend code")}
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={handleCancel}>
          <BackIcon className="h-4 w-4" /> {t("العودة لتسجيل الدخول", "Back to Login")}
        </Button>
      </div>
    </div>
  );
}
