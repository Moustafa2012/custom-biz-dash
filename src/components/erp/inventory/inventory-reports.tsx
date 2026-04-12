import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, Package, Warehouse, Factory, TrendingUp } from "lucide-react";

export function InventoryReports() {
  const { t } = useAppConfig();

  const reports = [
    { icon: Package, title: t("تقرير المخزون الحالي", "Current Stock Report"), description: t("ملخص شامل لجميع الأصناف والكميات", "Comprehensive summary of all items and quantities"), type: t("مخزون", "Stock") },
    { icon: TrendingUp, title: t("تقرير حركة المخزون", "Stock Movement Report"), description: t("تتبع الوارد والصادر لكل صنف", "Track inbound and outbound per item"), type: t("حركة", "Movement") },
    { icon: Warehouse, title: t("تقرير إشغال المستودعات", "Warehouse Utilization"), description: t("نسبة الإشغال والسعة المتاحة", "Occupancy rate and available capacity"), type: t("مستودع", "Warehouse") },
    { icon: Factory, title: t("تقرير الإنتاج", "Production Report"), description: t("أداء خطوط الإنتاج والمخرجات", "Production line performance and output"), type: t("تصنيع", "Manufacturing") },
    { icon: BarChart3, title: t("تحليل ABC", "ABC Analysis"), description: t("تصنيف الأصناف حسب القيمة والأهمية", "Classify items by value and importance"), type: t("تحليل", "Analysis") },
    { icon: FileText, title: t("تقرير التسويات", "Adjustment Report"), description: t("ملخص جميع تسويات المخزون", "Summary of all stock adjustments"), type: t("تسوية", "Adjustment") },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">{t("التقارير", "Reports")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("تقارير وتحليلات المخزون والتصنيع", "Inventory & Manufacturing reports and analytics")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.title} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-primary/10 p-2.5 mb-2">
                  <r.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{r.type}</span>
              </div>
              <CardTitle className="text-sm font-semibold">{r.title}</CardTitle>
              <CardDescription className="text-xs">{r.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 flex-1 text-xs">
                  <BarChart3 className="h-3 w-3" />
                  {t("عرض", "View")}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Download className="h-3 w-3" />
                  {t("تصدير", "Export")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
