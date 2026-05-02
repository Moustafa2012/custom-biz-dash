import { useAppConfig } from "@/components/erp/app-config";
import { useBankingStore } from "../stores/banking-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, FileSignature, FileText } from "lucide-react";

export default function BankingDashboard() {
  const { t } = useAppConfig();
  const company = useBankingStore((s) => s.company);
  const accounts = useBankingStore((s) => s.accounts);
  const beneficiaries = useBankingStore((s) => s.beneficiaries);
  const documents = useBankingStore((s) => s.documents);

  const stats = [
    { icon: Building2,     label: t("ملف الشركة", "Company"),       value: company.name ? "✓" : "—" },
    { icon: FileText,      label: t("الحسابات", "Accounts"),         value: String(accounts.length) },
    { icon: Users,         label: t("المستفيدون", "Beneficiaries"),  value: String(beneficiaries.length) },
    { icon: FileSignature, label: t("المستندات", "Documents"),       value: String(documents.length) },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">{t("لوحة المعلومات البنكية", "Banking Dashboard")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("نظرة عامة على إعداد البنوك والمستفيدين والمستندات.", "Overview of bank setup, beneficiaries and documents.")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <s.icon className="h-4 w-4" />{s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("آخر المستندات", "Recent documents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {documents.slice(0, 8).map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-mono text-xs">{d.reference}</p>
                    <p className="text-xs text-muted-foreground">{d.date} · {d.beneficiaryIds.length} {t("مستفيد", "beneficiary(ies)")}</p>
                  </div>
                  <p className="font-semibold">{d.currency} {d.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
