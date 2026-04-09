import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, AlertCircle, Eye, EyeOff, Layers } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const intendedRoute = useAuthStore((s) => s.intendedRoute);
  const setIntendedRoute = useAuthStore((s) => s.setIntendedRoute);
  const navigate = useNavigate();

  // Already authenticated → go to intended or default
  if (isAuthenticated) {
    const dest = intendedRoute || "/sales";
    setIntendedRoute(null);
    navigate(dest, { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);

      if (!result.success) {
        if (result.error === "invalid_credentials") setError("Invalid email or password.");
        else if (result.error === "account_disabled") setError("This account has been disabled. Please contact your administrator.");
        return;
      }

      if (result.requires2FA) {
        navigate("/2fa");
      } else {
        const dest = intendedRoute || "/sales";
        setIntendedRoute(null);
        navigate(dest, { replace: true });
      }
    }, 600);
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo + heading */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-1">
            <Layers className="h-4 w-4" /> ERP Suite
          </Link>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your ERP account</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
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
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@erp.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card className="border-border/30 bg-muted/30">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Accounts — click to fill:</p>
            <div className="space-y-1">
              {[
                { label: "Super Admin", email: "admin@erp.com", password: "admin123", note: "2FA", noteColor: "text-amber-500" },
                { label: "Admin", email: "sara@erp.com", password: "sara123", note: null, noteColor: "" },
                { label: "Accountant", email: "khalid@erp.com", password: "khalid123", note: "2FA", noteColor: "text-amber-500" },
                { label: "Salesman", email: "fatima@erp.com", password: "fatima123", note: null, noteColor: "" },
                { label: "Store Keeper", email: "omar@erp.com", password: "omar123", note: "Disabled", noteColor: "text-destructive" },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className="w-full text-left text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded px-1 py-0.5 transition-colors"
                >
                  <span className="font-medium text-foreground">{acc.label}:</span>{" "}
                  {acc.email} / {acc.password}
                  {acc.note && <span className={`ml-1 ${acc.noteColor}`}>({acc.note})</span>}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
