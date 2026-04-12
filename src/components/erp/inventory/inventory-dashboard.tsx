import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse, ArrowRightLeft, AlertTriangle, TrendingUp, TrendingDown, BoxIcon, Factory } from "lucide-react";

export function InventoryDashboard() {
  const { t } = useAppConfig();

  const stats = [
    { label: t("إجمالي الأصناف", "Total Items"), value: "2,847", icon: Package, change: "+12%", up: true },
    { label: t("المستودعات", "Warehouses"), value: "6", icon: Warehouse, change: "+1", up: true },
    { label: t("التحويلات المعلقة", "Pending Transfers"), value: "23", icon: ArrowRightLeft, change: "-5%", up: false },
    { label: t("تنبيهات المخزون", "Stock Alerts"), value: "14", icon: AlertTriangle, change: "+3", up: true },
  ];

  const lowStock = [
    { name: t("قطعة غيار A-100", "Spare Part A-100"), sku: "SP-A100", qty: 3, min: 20, warehouse: t("المستودع الرئيسي", "Main Warehouse") },
    { name: t("مادة خام B-50", "Raw Material B-50"), sku: "RM-B50", qty: 8, min: 50, warehouse: t("مستودع الإنتاج", "Production WH") },
    { name: t("مكوّن C-200", "Component C-200"), sku: "CM-C200", qty: 5, min: 30, warehouse: t("المستودع الفرعي", "Sub Warehouse") },
    { name: t("منتج نهائي D-10", "Finished Good D-10"), sku: "FG-D10", qty: 2, min: 15, warehouse: t("مستودع الشحن", "Shipping WH") },
  ];

  const recentActivity = [
    { action: t("استلام بضاعة", "Goods Received"), ref: "GRN-2024-0891", time: t("منذ ساعتين", "2 hours ago"), qty: "+500" },
    { action: t("تحويل مخزون", "Stock Transfer"), ref: "TRF-2024-0234", time: t("منذ 4 ساعات", "4 hours ago"), qty: "150" },
    { action: t("تسوية مخزون", "Stock Adjustment"), ref: "ADJ-2024-0067", time: t("منذ 6 ساعات", "6 hours ago"), qty: "-23" },
    { action: t("أمر إنتاج", "Production Order"), ref: "PRD-2024-0445", time: t("أمس", "Yesterday"), qty: "+200" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">{t("لوحة المعلومات", "Dashboard")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("نظرة عامة على المخزون والتصنيع", "Inventory & Manufacturing overview")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-2xl font-bold font-heading text-foreground">{s.value}</p>
                <div className="flex items-center gap-1">
                  {s.up ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                  <span className={`text-xs font-medium ${s.up ? "text-emerald-600" : "text-destructive"}`}>{s.change}</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t("أصناف منخفضة المخزون", "Low Stock Items")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div key={item.sku} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku} · {item.warehouse}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-bold text-destructive">{item.qty}</p>
                    <p className="text-xs text-muted-foreground">{t("الحد الأدنى", "Min")}: {item.min}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BoxIcon className="h-4 w-4 text-primary" />
              {t("النشاط الأخير", "Recent Activity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((a) => (
                <div key={a.ref} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.ref} · {a.time}</p>
                  </div>
                  <span className={`text-sm font-semibold ${a.qty.startsWith("+") ? "text-emerald-600" : a.qty.startsWith("-") ? "text-destructive" : "text-foreground"}`}>
                    {a.qty}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
