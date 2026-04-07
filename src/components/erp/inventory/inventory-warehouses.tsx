import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Plus, MapPin, Package, Users } from "lucide-react";

const WAREHOUSES = [
  { id: "WH-01", name: { en: "Main Warehouse", ar: "المستودع الرئيسي" }, location: { en: "Riyadh, KSA", ar: "الرياض، السعودية" }, capacity: 10000, used: 7500, items: 1250, staff: 12, status: "active" },
  { id: "WH-02", name: { en: "Production Warehouse", ar: "مستودع الإنتاج" }, location: { en: "Jeddah, KSA", ar: "جدة، السعودية" }, capacity: 5000, used: 3200, items: 680, staff: 8, status: "active" },
  { id: "WH-03", name: { en: "Shipping Hub", ar: "مركز الشحن" }, location: { en: "Dammam, KSA", ar: "الدمام، السعودية" }, capacity: 8000, used: 6800, items: 920, staff: 15, status: "active" },
  { id: "WH-04", name: { en: "Cold Storage", ar: "التخزين البارد" }, location: { en: "Riyadh, KSA", ar: "الرياض، السعودية" }, capacity: 2000, used: 1900, items: 310, staff: 5, status: "warning" },
  { id: "WH-05", name: { en: "Overflow Storage", ar: "مخزن فائض" }, location: { en: "Tabuk, KSA", ar: "تبوك، السعودية" }, capacity: 3000, used: 400, items: 150, staff: 3, status: "active" },
  { id: "WH-06", name: { en: "Returns Center", ar: "مركز المرتجعات" }, location: { en: "Riyadh, KSA", ar: "الرياض، السعودية" }, capacity: 1500, used: 200, items: 85, staff: 4, status: "active" },
];

export function InventoryWarehouses() {
  const { t, language } = useAppConfig();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("المستودعات", "Warehouses")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("إدارة مواقع التخزين", "Manage storage locations")}</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          {t("إضافة مستودع", "Add Warehouse")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {WAREHOUSES.map((wh) => {
          const pct = Math.round((wh.used / wh.capacity) * 100);
          return (
            <Card key={wh.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Warehouse className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{language === "ar" ? wh.name.ar : wh.name.en}</CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {language === "ar" ? wh.location.ar : wh.location.en}
                      </p>
                    </div>
                  </div>
                  <Badge variant={pct > 90 ? "destructive" : "secondary"} className="text-[10px]">
                    {pct > 90 ? t("ممتلئ تقريباً", "Near Full") : t("نشط", "Active")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{t("السعة", "Capacity")}</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {wh.used.toLocaleString()} / {wh.capacity.toLocaleString()} {t("وحدة", "units")}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {wh.items} {t("صنف", "items")}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {wh.staff} {t("موظف", "staff")}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
