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
      { label: t("العملة الافتراضية", "Default Currency"), placeholder: "USD", icon: Globe },
      { label: t("بادئة الفاتورة", "Invoice Prefix"), placeholder: "INV-", icon: FileText },
      { label: t("شروط الدفع", "Payment Terms"), placeholder: "Net 30", icon: Settings },
      { label: t("الرقم الضريبي", "Tax ID"), placeholder: t("أدخل الرقم الضريبي", "Enter tax ID"), icon: Lock },
    ],
    finance: [
      { label: t("بداية السنة المالية", "Fiscal Year Start"), placeholder: t("يناير", "January"), icon: Globe },
      { label: t("العملة الأساسية", "Base Currency"), placeholder: "USD", icon: Settings },
      { label: t("نظام الترقيم", "Numbering System"), placeholder: t("تلقائي", "Auto"), icon: FileText },
      { label: t("فترة القفل", "Lock Period"), placeholder: t("شهري", "Monthly"), icon: Lock },
    ],
    inventory: [
      { label: t("الوحدة الافتراضية", "Default Unit"), placeholder: t("قطعة", "PCS"), icon: Settings },
      { label: t("طريقة التقييم", "Valuation Method"), placeholder: "FIFO", icon: Globe },
      { label: t("حد إعادة الطلب", "Reorder Threshold"), placeholder: "10", icon: FileText },
      { label: t("تتبع الدُفعات", "Batch Tracking"), placeholder: t("مفعّل", "Enabled"), icon: Lock },
    ],
    banking: [
      { label: t("العملة الأساسية", "Base Currency"), placeholder: "USD", icon: Globe },
      { label: t("بادئة المعاملة", "Transaction Prefix"), placeholder: "TX-", icon: FileText },
      { label: t("حد التحويل اليومي", "Daily Transfer Limit"), placeholder: "100000", icon: Settings },
      { label: t("اسم البنك الافتراضي", "Default Bank Name"), placeholder: t("أدخل اسم البنك", "Enter bank name"), icon: Lock },
    ],
    warehouse: [
      { label: t("المستودع الافتراضي", "Default Warehouse"), placeholder: t("الرئيسي", "Main"), icon: Settings },
      { label: t("نظام ترميز المواقع", "Location Coding"), placeholder: "A-01-01", icon: Globe },
      { label: t("الوحدة الافتراضية", "Default Unit"), placeholder: t("قطعة", "PCS"), icon: FileText },
      { label: t("حد التنبيه للمخزون", "Stock Alert Threshold"), placeholder: "5", icon: Lock },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            {t("عام", "General")}
          </CardTitle>
          <CardDescription>{t("تكوين إعدادات الوحدة الأساسية", "Configure basic module settings")}</CardDescription>
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
              <p className="text-xs text-muted-foreground">{t("تفعيل التحقق بخطوتين", "Enable 2FA verification")}</p>
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
