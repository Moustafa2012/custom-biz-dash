import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppConfig, type ErpAppId } from "./app-config";
import { Separator } from "@/components/ui/separator";
import { Settings, Bot, Mail } from "lucide-react";
import { GeneralSettingsTab } from "./settings/GeneralSettingsTab";
import { TelegramSettingsTab } from "./settings/TelegramSettingsTab";
import { SmtpSettingsTab } from "./settings/SmtpSettingsTab";

type SettingsTab = "general" | "telegram" | "smtp";

const APP_SETTINGS_LABELS: Record<ErpAppId, { title: string; description: string }> = {
  sales: { title: "Sales Settings", description: "Configure your sales module preferences, integrations, and services." },
  finance: { title: "Finance Settings", description: "Configure your finance module preferences, integrations, and services." },
  inventory: { title: "Inventory & Mfg Settings", description: "Configure your inventory & manufacturing preferences, integrations, and services." },
};

interface SettingsPageProps {
  appId: ErpAppId;
}

export function SettingsPage({ appId }: SettingsPageProps) {
  const { t } = useAppConfig();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const meta = APP_SETTINGS_LABELS[appId];

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "general", label: t("General", "General"), icon: Settings },
    { id: "telegram", label: t("Telegram", "Telegram"), icon: Bot },
    { id: "smtp", label: t("Email / SMTP", "Email / SMTP"), icon: Mail },
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
