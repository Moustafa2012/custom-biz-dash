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
      icon: Bot, title: t("Bot Management", "Bot Management"),
      description: t("Configure and manage Telegram bots", "Configure and manage Telegram bots"),
      fields: [
        { label: t("Bot Token", "Bot Token"), placeholder: "123456:ABC-DEF...", type: "password" },
        { label: t("Bot Username", "Bot Username"), placeholder: "@your_bot" },
      ],
    },
    {
      icon: ShieldCheck, title: t("Two-Factor Authentication", "Two-Factor Authentication"),
      description: t("Set up 2FA via Telegram", "Set up 2FA via Telegram"),
      toggles: [
        { label: t("Enable 2FA via Telegram", "Enable 2FA via Telegram"), description: t("Send verification codes via Telegram", "Send verification codes via Telegram"), defaultChecked: false },
        { label: t("Backup Codes", "Backup Codes"), description: t("Generate backup codes", "Generate backup codes"), defaultChecked: true },
      ],
    },
    {
      icon: Bell, title: t("Notifications", "Notifications"),
      description: t("Configure Telegram notifications", "Configure Telegram notifications"),
      toggles: [
        { label: t("Order Notifications", "Order Notifications"), description: t("Notify on new orders", "Notify on new orders"), defaultChecked: true },
        { label: t("System Alerts", "System Alerts"), description: t("Error and maintenance alerts", "Error and maintenance alerts"), defaultChecked: true },
        { label: t("Daily Reports", "Daily Reports"), description: t("Automated daily summary", "Automated daily summary"), defaultChecked: false },
      ],
    },
    {
      icon: Radio, title: t("Broadcasts", "Broadcasts"),
      description: t("Bulk message settings", "Bulk message settings"),
      fields: [
        { label: t("Rate Limit", "Rate Limit"), placeholder: "30 msg/sec" },
        { label: t("Default Template", "Default Template"), placeholder: "Select template..." },
      ],
    },
    {
      icon: Zap, title: t("Automation", "Automation"),
      description: t("Auto-response rules", "Auto-response rules"),
      toggles: [
        { label: t("Auto Replies", "Auto Replies"), description: t("Instant message responses", "Instant message responses"), defaultChecked: true },
        { label: t("Custom Commands", "Custom Commands"), description: t("Enable custom bot commands", "Enable custom bot commands"), defaultChecked: false },
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
        <Button>{t("Save Telegram Settings", "Save Telegram Settings")}</Button>
      </div>
    </div>
  );
}
