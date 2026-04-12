import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useAppConfig } from "./app-config";
import { ROLE_LABELS } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Save, Edit2, X,
} from "lucide-react";

export function ProfilePage() {
  const { t, language } = useAppConfig();
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name ?? "",
    phone: currentUser?.phone ?? "",
    country: currentUser?.country ?? "",
    city: currentUser?.city ?? "",
    address: currentUser?.address ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentUser) return null;

  const age = currentUser.dateOfBirth
    ? Math.floor((Date.now() - new Date(currentUser.dateOfBirth).getTime()) / 31557600000)
    : null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t("الاسم مطلوب", "Name is required");
    if (form.phone && !/^\+?[\d\s\-()]{7,}$/.test(form.phone))
      errs.phone = t("رقم هاتف غير صالح", "Invalid phone number");
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      country: form.country.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
    });
    setEditing(false);
    setErrors({});
    toast({ title: t("تم الحفظ", "Saved"), description: t("تم تحديث الملف الشخصي بنجاح", "Profile updated successfully") });
  };

  const handleCancel = () => {
    setForm({
      name: currentUser.name,
      phone: currentUser.phone,
      country: currentUser.country,
      city: currentUser.city,
      address: currentUser.address,
    });
    setEditing(false);
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const roleLabel = ROLE_LABELS[currentUser.role];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">{t("الملف الشخصي", "Profile")}</h1>
        {!editing ? (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditing(true)}>
            <Edit2 className="h-4 w-4" /> {t("تعديل", "Edit")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleCancel}>
              <X className="h-4 w-4" /> {t("إلغاء", "Cancel")}
            </Button>
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" /> {t("حفظ", "Save")}
            </Button>
          </div>
        )}
      </div>

      {/* Identity card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-xl bg-primary/20 text-primary">
                {currentUser.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-heading font-bold">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <Badge variant={currentUser.isActive ? "default" : "destructive"} className="text-xs">
                  {currentUser.isActive ? t("نشط", "Active") : t("معطّل", "Disabled")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {language === "ar" ? roleLabel.ar : roleLabel.en}
                </Badge>
                {currentUser.twoFactorEnabled && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Shield className="h-3 w-3" /> 2FA
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {t("المعلومات الشخصية", "Personal Information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">{t("الاسم الكامل", "Full Name")}</Label>
              {editing ? (
                <div>
                  <Input
                    id="profile-name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
              ) : (
                <p className="text-sm font-medium">{currentUser.name}</p>
              )}
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t("البريد الإلكتروني", "Email")}</p>
                <p className="text-sm font-medium truncate">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{t("الهاتف", "Phone")}</p>
                {editing ? (
                  <div>
                    <Input
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`h-7 text-sm mt-1 ${errors.phone ? "border-destructive" : ""}`}
                      placeholder="+966 50 000 0000"
                    />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium">{currentUser.phone || "—"}</p>
                )}
              </div>
            </div>

            {currentUser.dateOfBirth && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("تاريخ الميلاد", "Date of Birth")}</p>
                  <p className="text-sm font-medium">
                    {currentUser.dateOfBirth}
                    {age !== null && <span className="text-muted-foreground text-xs ml-1">({age} {t("سنة", "years")})</span>}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t("معلومات الموقع", "Location Information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(["country", "city", "address"] as const).map((field) => {
              const labels: Record<string, { en: string; ar: string }> = {
                country: { en: "Country", ar: "الدولة" },
                city: { en: "City", ar: "المدينة" },
                address: { en: "Address", ar: "العنوان" },
              };
              const label = language === "ar" ? labels[field].ar : labels[field].en;
              return (
                <div key={field} className="space-y-1">
                  <Label htmlFor={`profile-${field}`} className="text-xs text-muted-foreground">{label}</Label>
                  {editing ? (
                    <Input
                      id={`profile-${field}`}
                      value={form[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <p className="text-sm font-medium">{currentUser[field] || "—"}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Account security */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              {t("الأمان", "Security")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("المصادقة الثنائية", "Two-Factor Authentication")}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.twoFactorEnabled
                    ? t(`مفعّلة عبر ${currentUser.twoFactorMethod === "otp" ? "تطبيق المصادقة" : "البريد الإلكتروني"}`, `Enabled via ${currentUser.twoFactorMethod === "otp" ? "Authenticator App" : "Email"}`)
                    : t("غير مفعّلة", "Not enabled")}
                </p>
              </div>
              <Badge variant={currentUser.twoFactorEnabled ? "default" : "secondary"} className="text-xs">
                {currentUser.twoFactorEnabled ? t("مفعّل", "Enabled") : t("معطّل", "Disabled")}
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("آخر تسجيل دخول", "Last Login")}</p>
                <p className="text-xs text-muted-foreground">{currentUser.lastLogin || t("غير محدد", "Unknown")}</p>
              </div>
              <div className="space-y-1 text-end">
                <p className="text-sm font-medium">{t("تاريخ الإنشاء", "Account Created")}</p>
                <p className="text-xs text-muted-foreground">{currentUser.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
