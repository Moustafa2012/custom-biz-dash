import { useAppConfig } from "../app-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Server, Mail, Send, FileText, ScrollText, ChevronRight, ChevronLeft } from "lucide-react";

export function SmtpSettingsTab() {
  const { t, language } = useAppConfig();

  const ArrowIcon = language === "ar" ? ChevronLeft : ChevronRight;

  const templateNames = [
    { ar: "بريد الترحيب", en: "Welcome Email" },
    { ar: "الفاتورة", en: "Invoice" },
    { ar: "إعادة تعيين كلمة المرور", en: "Password Reset" },
    { ar: "الإشعار", en: "Notification" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            {t("خادم SMTP", "SMTP Server")}
          </CardTitle>
          <CardDescription className="text-xs">{t("تكوين خادم البريد الصادر", "Configure outgoing mail server")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("المضيف", "Host")}</label>
            <Input placeholder="smtp.example.com" className="h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">{t("المنفذ", "Port")}</label>
              <Input placeholder="587" className="h-9" />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">{t("التشفير", "Encryption")}</label>
              <Input placeholder="TLS" className="h-9" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("اسم المستخدم", "Username")}</label>
            <Input placeholder="user@example.com" className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("كلمة المرور", "Password")}</label>
            <Input placeholder="..." type="password" className="h-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Send className="h-3.5 w-3.5" />
            {t("اختبار الاتصال", "Test Connection")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {t("هوية المرسل", "Sender Identity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("اسم المرسل", "From Name")}</label>
            <Input placeholder={t("شركتي", "My Company")} className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("بريد المرسل", "From Email")}</label>
            <Input placeholder="noreply@example.com" className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("الرد على", "Reply-To")}</label>
            <Input placeholder="support@example.com" className="h-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {t("القوالب", "Templates")}
          </CardTitle>
          <CardDescription className="text-xs">{t("إدارة قوالب البريد الإلكتروني", "Manage email templates")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {templateNames.map((tmpl) => (
            <div key={tmpl.en} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2.5">
              <span className="text-sm font-medium">{t(tmpl.ar, tmpl.en)}</span>
              <ArrowIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-muted-foreground" />
            {t("السجلات", "Logs")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("تفعيل التسجيل", "Enable Logging")}</p>
              <p className="text-xs text-muted-foreground">{t("تسجيل جميع الرسائل المرسلة", "Log all sent emails")}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{t("حفظ إعدادات SMTP", "Save SMTP Settings")}</Button>
      </div>
    </div>
  );
}
