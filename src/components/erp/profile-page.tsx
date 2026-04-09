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
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Save, Edit2, X,
} from "lucide-react";

export function ProfilePage() {
  const { t, language } = useAppConfig();
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...currentUser });

  if (!currentUser) return null;

  const age = currentUser.dateOfBirth
    ? Math.floor((Date.now() - new Date(currentUser.dateOfBirth).getTime()) / 31557600000)
    : null;

  const handleSave = () => {
    updateProfile({
      name: form?.name,
      phone: form?.phone,
      country: form?.country,
      city: form?.city,
      address: form?.address,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...currentUser });
    setEditing(false);
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

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-xl bg-primary/20 text-primary">
                {currentUser.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-heading font-bold">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant={currentUser.isActive ? "default" : "destructive"} className="text-xs">
                  {currentUser.isActive ? t("نشط", "Active") : t("معطّل", "Disabled")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {language === "ar" ? roleLabel.ar : roleLabel.en}
                </Badge>
                {currentUser.twoFactorEnabled && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Shield className="h-3 w-3" /> {t("المصادقة الثنائية", "2FA")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t("المعلومات الشخصية", "Personal Information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("الاسم الكامل", "Full Name")}</Label>
              {editing ? (
                <Input value={form?.name || ""} onChange={(e) => setForm({ ...form!, name: e.target.value })} />
              ) : (
                <p className="text-sm text-foreground">{currentUser.name}</p>
              )}
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {t("تاريخ الميلاد", "Date of Birth")}</Label>
              <p className="text-sm text-foreground">
                {currentUser.dateOfBirth} {age !== null && <span className="text-muted-foreground">({age} {t("سنة", "years")})</span>}
              </p>
            </div>
            <div className="space-y-2">
              <Label>{t("الجنس", "Gender")}</Label>
              <p className="text-sm text-foreground">
                {currentUser.gender === "male" ? t("ذكر", "Male") : t("أنثى", "Female")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              {t("معلومات الاتصال", "Contact Information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {t("البريد الإلكتروني", "Email")}</Label>
              <p className="text-sm text-foreground">{currentUser.email}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {t("الهاتف", "Phone")}</Label>
              {editing ? (
                <Input value={form?.phone || ""} onChange={(e) => setForm({ ...form!, phone: e.target.value })} />
              ) : (
                <p className="text-sm text-foreground">{currentUser.phone}</p>
              )}
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {t("العنوان", "Address")}</Label>
              {editing ? (
                <div className="space-y-2">
                  <Input placeholder={t("الدولة", "Country")} value={form?.country || ""} onChange={(e) => setForm({ ...form!, country: e.target.value })} />
                  <Input placeholder={t("المدينة", "City")} value={form?.city || ""} onChange={(e) => setForm({ ...form!, city: e.target.value })} />
                  <Input placeholder={t("العنوان", "Address")} value={form?.address || ""} onChange={(e) => setForm({ ...form!, address: e.target.value })} />
                </div>
              ) : (
                <p className="text-sm text-foreground">{currentUser.address}, {currentUser.city}, {currentUser.country}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t("الأمان", "Security")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t("المصادقة الثنائية", "Two-Factor Auth")}</Label>
                <p className="text-sm font-medium">
                  {currentUser.twoFactorEnabled
                    ? `${t("مفعّلة", "Enabled")} (${currentUser.twoFactorMethod?.toUpperCase()})`
                    : t("معطّلة", "Disabled")}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t("آخر تسجيل دخول", "Last Login")}</Label>
                <p className="text-sm font-medium">{currentUser.lastLogin || t("غير متوفر", "N/A")}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t("تاريخ الإنشاء", "Created")}</Label>
                <p className="text-sm font-medium">{currentUser.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
