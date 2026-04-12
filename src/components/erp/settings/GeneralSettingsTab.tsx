import { useAppConfig, type ErpAppId } from "../app-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Lock, Globe, FileText, Settings } from "lucide-react";

interface GeneralSettingsTabProps {
  appId: ErpAppId;
}

export function GeneralSettingsTab({ appId }: GeneralSettingsTabProps) {
  const { t } = useAppConfig();

  const appSpecificFields: Record<ErpAppId, { label: string; placeholder: string; icon: React.ElementType }[]> = {
    sales: [
      { label: t("Default Currency", "Default Currency"), placeholder: "USD", icon: Globe },
      { label: t("Invoice Prefix", "Invoice Prefix"), placeholder: "INV-", icon: FileText },
      { label: t("Payment Terms", "Payment Terms"), placeholder: "Net 30", icon: Settings },
      { label: t("Tax ID", "Tax ID"), placeholder: "Enter tax ID", icon: Lock },
    ],
    finance: [
      { label: t("Fiscal Year Start", "Fiscal Year Start"), placeholder: "January", icon: Globe },
      { label: t("Base Currency", "Base Currency"), placeholder: "USD", icon: Settings },
      { label: t("Numbering System", "Numbering System"), placeholder: "Auto", icon: FileText },
      { label: t("Lock Period", "Lock Period"), placeholder: "Monthly", icon: Lock },
    ],
    inventory: [
      { label: t("Default Unit", "Default Unit"), placeholder: "PCS", icon: Settings },
      { label: t("Valuation Method", "Valuation Method"), placeholder: "FIFO", icon: Globe },
      { label: t("Reorder Threshold", "Reorder Threshold"), placeholder: "10", icon: FileText },
      { label: t("Batch Tracking", "Batch Tracking"), placeholder: "Enabled", icon: Lock },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {t("General", "General")}
          </CardTitle>
          <CardDescription>{t("Configure basic module settings", "Configure basic module settings")}</CardDescription>
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
            {t("Security", "Security")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("Two-Factor Auth", "Two-Factor Auth")}</p>
              <p className="text-xs text-muted-foreground">{t("Enable 2FA verification", "Enable 2FA verification")}</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("Audit Log", "Audit Log")}</p>
              <p className="text-xs text-muted-foreground">{t("Track all changes", "Track all changes")}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{t("Save Changes", "Save Changes")}</Button>
      </div>
    </div>
  );
}
