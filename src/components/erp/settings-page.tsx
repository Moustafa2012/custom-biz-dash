import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppConfig, type ErpAppId } from "./app-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Settings, Bot, ShieldCheck, Bell, Radio, Zap, UsersRound, Activity,
  Mail, Send, ScrollText, FileText, Globe, User, Lock, Server, ChevronRight,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

type SettingsTab = "general" | "telegram" | "smtp";

const APP_SETTINGS_LABELS: Record<ErpAppId, { title: string; description: string }> = {
  sales: { title: "Sales Settings", description: "Configure your sales module preferences, integrations, and services." },
  finance: { title: "Finance Settings", description: "Configure your finance module preferences, integrations, and services." },
  inventory: { title: "Inventory & Mfg Settings", description: "Configure your inventory & manufacturing preferences, integrations, and services." },
};

function GeneralSettingsTab({ appId }: { appId: ErpAppId }) {
  const { t } = useAppConfig();

  const appSpecificFields: Record<ErpAppId, { label: string; placeholder: string; icon: React.ElementType }[]> = {
    sales: [
      { label: t("العملة الافتراضية", "Default Currency"), placeholder: "USD", icon: Globe },
      { label: t("بادئة الفاتورة", "Invoice Prefix"), placeholder: "INV-", icon: FileText },
      { label: t("شروط الدفع", "Payment Terms"), placeholder: "Net 30", icon: Settings },
      { label: t("رقم الضريبة", "Tax ID"), placeholder: "Enter tax ID", icon: Lock },
    ],
    finance: [
      { label: t("السنة المالية", "Fiscal Year Start"), placeholder: "January", icon: Globe },
      { label: t("العملة الأساسية", "Base Currency"), placeholder: "USD", icon: Settings },
      { label: t("نظام الترقيم", "Numbering System"), placeholder: "Auto", icon: FileText },
      { label: t("فترة القفل", "Lock Period"), placeholder: "Monthly", icon: Lock },
    ],
    inventory: [
      { label: t("وحدة القياس", "Default Unit"), placeholder: "PCS", icon: Settings },
      { label: t("طريقة التقييم", "Valuation Method"), placeholder: "FIFO", icon: Globe },
      { label: t("حد إعادة الطلب", "Reorder Threshold"), placeholder: "10", icon: FileText },
      { label: t("تتبع الدفعات", "Batch Tracking"), placeholder: "Enabled", icon: Lock },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {t("إعدادات عامة", "General")}
          </CardTitle>
          <CardDescription>{t("تكوين الإعدادات الأساسية للوحدة", "Configure basic module settings")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appSpecificFields[appId].map((field) => (
            <div key={field.label} className="grid gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
                {field.label}
              </label>
              <Input placeholder={field.placeholder} className="h-9" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            {t("الأمان", "Security")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("المصادقة الثنائية", "Two-Factor Auth")}</p>
              <p className="text-xs text-muted-foreground">{t("تمكين التحقق بخطوتين", "Enable 2FA verification")}</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("سجل التدقيق", "Audit Log")}</p>
              <p className="text-xs text-muted-foreground">{t("تتبع جميع التغييرات", "Track all changes")}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{t("حفظ التغييرات", "Save Changes")}</Button>
      </div>
    </div>
  );
}

function TelegramSettingsTab() {
  const { t } = useAppConfig();

  const sections = [
    {
      icon: Bot, title: t("إدارة البوتات", "Bot Management"),
      description: t("تكوين وإدارة بوتات تيليجرام", "Configure and manage Telegram bots"),
      fields: [
        { label: t("رمز البوت", "Bot Token"), placeholder: "123456:ABC-DEF...", type: "password" },
        { label: t("اسم البوت", "Bot Username"), placeholder: "@your_bot" },
      ],
    },
    {
      icon: ShieldCheck, title: t("المصادقة الثنائية", "Two-Factor Authentication"),
      description: t("إعداد التحقق بخطوتين عبر تيليجرام", "Set up 2FA via Telegram"),
      toggles: [
        { label: t("تمكين 2FA", "Enable 2FA via Telegram"), description: t("إرسال رموز التحقق عبر تيليجرام", "Send verification codes via Telegram"), defaultChecked: false },
        { label: t("رمز احتياطي", "Backup Codes"), description: t("إنشاء رموز احتياطية", "Generate backup codes"), defaultChecked: true },
      ],
    },
    {
      icon: Bell, title: t("الإشعارات", "Notifications"),
      description: t("تكوين إشعارات تيليجرام", "Configure Telegram notifications"),
      toggles: [
        { label: t("إشعارات الطلبات", "Order Notifications"), description: t("إشعار عند إنشاء طلب جديد", "Notify on new orders"), defaultChecked: true },
        { label: t("تنبيهات النظام", "System Alerts"), description: t("تنبيهات الأخطاء والصيانة", "Error and maintenance alerts"), defaultChecked: true },
        { label: t("التقارير اليومية", "Daily Reports"), description: t("ملخص يومي تلقائي", "Automated daily summary"), defaultChecked: false },
      ],
    },
    {
      icon: Radio, title: t("البث", "Broadcasts"),
      description: t("إعدادات الرسائل الجماعية", "Bulk message settings"),
      fields: [
        { label: t("حد الإرسال", "Rate Limit"), placeholder: "30 msg/sec" },
        { label: t("قالب افتراضي", "Default Template"), placeholder: "Select template..." },
      ],
    },
    {
      icon: Zap, title: t("الأتمتة", "Automation"),
      description: t("قواعد الاستجابة التلقائية", "Auto-response rules"),
      toggles: [
        { label: t("الردود التلقائية", "Auto Replies"), description: t("ردود فورية على الرسائل", "Instant message responses"), defaultChecked: true },
        { label: t("أوامر مخصصة", "Custom Commands"), description: t("تمكين الأوامر المخصصة", "Enable custom bot commands"), defaultChecked: false },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <section.icon className="h-4 w-4 text-muted-foreground" />
              {section.title}
            </CardTitle>
            <CardDescription className="text-xs">{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields?.map((field) => (
              <div key={field.label} className="grid gap-1.5">
                <label className="text-sm font-medium">{field.label}</label>
                <Input placeholder={field.placeholder} type={field.type || "text"} className="h-9" />
              </div>
            ))}
            {section.toggles?.map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{toggle.label}</p>
                  <p className="text-xs text-muted-foreground">{toggle.description}</p>
                </div>
                <Switch defaultChecked={toggle.defaultChecked} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-end">
        <Button>{t("حفظ إعدادات تيليجرام", "Save Telegram Settings")}</Button>
      </div>
    </div>
  );
}

function SmtpSettingsTab() {
  const { t } = useAppConfig();

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
            <Input placeholder="••••••••" type="password" className="h-9" />
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
            <Input placeholder="My Company" className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("بريد المرسل", "From Email")}</label>
            <Input placeholder="noreply@example.com" className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("بريد الرد", "Reply-To")}</label>
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
          {["Welcome Email", "Invoice", "Password Reset", "Notification"].map((template) => (
            <div key={template} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2.5">
              <span className="text-sm font-medium">{template}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
              <p className="text-sm font-medium">{t("تمكين السجلات", "Enable Logging")}</p>
              <p className="text-xs text-muted-foreground">{t("تسجيل جميع رسائل البريد المرسلة", "Log all sent emails")}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{t("حفظ إعدادات البريد", "Save SMTP Settings")}</Button>
      </div>
    </div>
  );
}

interface SettingsPageProps {
  appId: ErpAppId;
}

export function SettingsPage({ appId }: SettingsPageProps) {
  const { t } = useAppConfig();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const meta = APP_SETTINGS_LABELS[appId];

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "general", label: t("عام", "General"), icon: Settings },
    { id: "telegram", label: t("تيليجرام", "Telegram"), icon: Bot },
    { id: "smtp", label: t("البريد", "Email / SMTP"), icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">{meta.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{meta.description}</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <Separator />

      <div className="animate-slide-in-forward">
        {activeTab === "general" && <GeneralSettingsTab appId={appId} />}
        {activeTab === "telegram" && <TelegramSettingsTab />}
        {activeTab === "smtp" && <SmtpSettingsTab />}
      </div>
    </div>
  );
}
