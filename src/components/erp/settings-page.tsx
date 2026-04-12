import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppConfig, type ErpAppId } from "./app-config";
import { Separator } from "@/components/ui/separator";
import { Settings, Bot, Mail } from "lucide-react";
import { GeneralSettingsTab } from "./settings/GeneralSettingsTab";
import { TelegramSettingsTab } from "./settings/TelegramSettingsTab";
import { SmtpSettingsTab } from "./settings/SmtpSettingsTab";

type SettingsTab = "general" | "telegram" | "smtp";

interface SettingsPageProps {
  appId: ErpAppId;
}

export function SettingsPage({ appId }: SettingsPageProps) {
  const { t } = useAppConfig();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const appTitles: Record<ErpAppId, { ar: string; en: string }> = {
    sales: { ar: "إعدادات المبيعات", en: "Sales Settings" },
    finance: { ar: "إعدادات المالية", en: "Finance Settings" },
    inventory: { ar: "إعدادات المخزون والتصنيع", en: "Inventory & Mfg Settings" },
  };

  const appDescs: Record<ErpAppId, { ar: string; en: string }> = {
    sales: { ar: "تكوين تفضيلات وحدة المبيعات والتكاملات والخدمات.", en: "Configure your sales module preferences, integrations, and services." },
    finance: { ar: "تكوين تفضيلات وحدة المالية والتكاملات والخدمات.", en: "Configure your finance module preferences, integrations, and services." },
    inventory: { ar: "تكوين تفضيلات المخزون والتصنيع والتكاملات والخدمات.", en: "Configure your inventory & manufacturing preferences, integrations, and services." },
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "general", label: t("عام", "General"), icon: Settings },
    { id: "telegram", label: t("تيليجرام", "Telegram"), icon: Bot },
    { id: "smtp", label: t("البريد / SMTP", "Email / SMTP"), icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">{t(appTitles[appId].ar, appTitles[appId].en)}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t(appDescs[appId].ar, appDescs[appId].en)}</p>
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
