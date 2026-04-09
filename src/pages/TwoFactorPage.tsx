import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const verify2FA = useAuthStore((s) => s.verify2FA);
  const twoFactorState = useAuthStore((s) => s.twoFactorState);
  const logout = useAuthStore((s) => s.logout);
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
      const success = verify2FA(code);
      setLoading(false);

      if (success) {
        navigate("/sales");
      } else {
        setError(useBackup ? "Invalid backup code" : "Invalid verification code");
      }
    }, 500);
  };

  const handleResend = () => {
    toast({ title: "Code Resent", description: "A new verification code has been sent." });
  };

  const handleCancel = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground">
            {useBackup
              ? "Enter one of your backup codes"
              : `Enter the code from your ${methodLabel}`}
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{useBackup ? "Backup Code" : "Verification Code"}</CardTitle>
            <CardDescription>
              {useBackup ? "Use a single-use backup code" : `Default OTP: 123456`}
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

              <Input
                type="text"
                placeholder={useBackup ? "A1B2C3" : "123456"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg tracking-widest font-mono"
                maxLength={useBackup ? 6 : 6}
                autoFocus
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={() => { setUseBackup(!useBackup); setCode(""); setError(""); }} className="text-primary hover:underline">
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
