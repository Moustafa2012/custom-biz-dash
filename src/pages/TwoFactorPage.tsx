import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, ArrowLeft, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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

  if (!twoFactorState?.isRequired) {
    return <Navigate to="/login" replace />;
  }

  const methodLabel =
    twoFactorState.method === "otp" ? "Authenticator App" :
    twoFactorState.method === "email" ? "Email" : "Authentication App";

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
        setError(useBackup ? "Invalid backup code. Please try again." : "Invalid verification code. Please try again.");
        setCode("");
      }
    }, 500);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only alphanumeric for backup, digits for OTP
    const val = e.target.value.replace(/\s/g, "").toUpperCase();
    if (useBackup) {
      setCode(val.slice(0, 6));
    } else {
      setCode(val.replace(/\D/g, "").slice(0, 6));
    }
    if (error) setError("");
  };

  const handleResend = () => {
    toast({ title: "Code Resent", description: "A new verification code has been sent to your " + methodLabel + "." });
  };

  const handleCancel = () => {
    logout();
    navigate("/login");
  };

  const isComplete = code.length === 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-1">
            <Layers className="h-4 w-4" /> ERP Suite
          </Link>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground">
            {useBackup
              ? "Enter one of your backup codes"
              : `Enter the 6-digit code from your ${methodLabel}`}
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{useBackup ? "Backup Code" : "Verification Code"}</CardTitle>
            <CardDescription>
              {useBackup
                ? "Each backup code can only be used once."
                : `Default demo OTP: 123456`}
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
                {loading ? "Verifying…" : "Verify & Sign In"}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setUseBackup(!useBackup); setCode(""); setError(""); }}
                  className="text-primary hover:underline"
                >
                  {useBackup ? "Use verification code" : "Use backup code"}
                </button>
                {!useBackup && (
                  <button type="button" onClick={handleResend} className="text-primary hover:underline">
                    Resend code
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Button>
      </div>
    </div>
  );
}
