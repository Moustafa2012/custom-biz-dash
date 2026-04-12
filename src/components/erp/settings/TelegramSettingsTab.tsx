import { useAppConfig } from "../app-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bot, ShieldCheck, Bell, Radio, Zap } from "lucide-react";

export function TelegramSettingsTab() {
  const { t } = useAppConfig();

  const sections = [
    {
      icon: Bot, title: t("إدارة البوت", "Bot Management"),
      description: t("تكوين وإدارة بوتات تيليجرام", "Configure and manage Telegram bots"),
      fields: [
        { label: t("رمز البوت", "Bot Token"), placeholder: "123456:ABC-DEF...", type: "password" },
        { label: t("اسم مستخدم البوت", "Bot Username"), placeholder: "@your_bot" },
      ],
    },
    {
      icon: ShieldCheck, title: t("المصادقة الثنائية", "Two-Factor Authentication"),
      description: t("إعداد المصادقة الثنائية عبر تيليجرام", "Set up 2FA via Telegram"),
      toggles: [
        { label: t("تفعيل المصادقة الثنائية عبر تيليجرام", "Enable 2FA via Telegram"), description: t("إرسال رموز التحقق عبر تيليجرام", "Send verification codes via Telegram"), defaultChecked: false },
        { label: t("رموز الاسترداد", "Backup Codes"), description: t("إنشاء رموز استرداد احتياطية", "Generate backup codes"), defaultChecked: true },
      ],
    },
    {
      icon: Bell, title: t("الإشعارات", "Notifications"),
      description: t("تكوين إشعارات تيليجرام", "Configure Telegram notifications"),
      toggles: [
        { label: t("إشعارات الطلبات", "Order Notifications"), description: t("إشعار عند وجود طلبات جديدة", "Notify on new orders"), defaultChecked: true },
        { label: t("تنبيهات النظام", "System Alerts"), description: t("تنبيهات الأخطاء والصيانة", "Error and maintenance alerts"), defaultChecked: true },
        { label: t("التقارير اليومية", "Daily Reports"), description: t("ملخص يومي تلقائي", "Automated daily summary"), defaultChecked: false },
      ],
    },
    {
      icon: Radio, title: t("البث الجماعي", "Broadcasts"),
      description: t("إعدادات الرسائل الجماعية", "Bulk message settings"),
      fields: [
        { label: t("حد المعدّل", "Rate Limit"), placeholder: t("30 رسالة/ثانية", "30 msg/sec") },
        { label: t("القالب الافتراضي", "Default Template"), placeholder: t("اختر قالب...", "Select template...") },
      ],
    },
    {
      icon: Zap, title: t("الأتمتة", "Automation"),
      description: t("قواعد الرد التلقائي", "Auto-response rules"),
      toggles: [
        { label: t("الردود التلقائية", "Auto Replies"), description: t("ردود فورية على الرسائل", "Instant message responses"), defaultChecked: true },
        { label: t("الأوامر المخصصة", "Custom Commands"), description: t("تفعيل أوامر البوت المخصصة", "Enable custom bot commands"), defaultChecked: false },
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
