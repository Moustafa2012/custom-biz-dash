import { useState } from "react";
import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, Search, Plus, ChevronRight } from "lucide-react";

const BOM_DATA = [
  {
    id: "BOM-001", product: { en: "Hydraulic Pump HP-50", ar: "مضخة هيدروليكية HP-50" }, version: "v2.1",
    components: 8, cost: 850.00, status: "active",
    materials: [
      { name: { en: "Steel Rod 12mm", ar: "قضيب فولاذي 12مم" }, qty: 4, unit: { en: "KG", ar: "كجم" } },
      { name: { en: "Motor Assembly A1", ar: "تجميع محرك A1" }, qty: 1, unit: { en: "PCS", ar: "قطعة" } },
      { name: { en: "Rubber Gasket Set", ar: "طقم حشوات مطاطية" }, qty: 2, unit: { en: "SET", ar: "طقم" } },
    ],
  },
  {
    id: "BOM-002", product: { en: "Control Panel v3", ar: "لوحة تحكم v3" }, version: "v1.0",
    components: 5, cost: 320.00, status: "active",
    materials: [
      { name: { en: "Control Board v3", ar: "لوحة تحكم v3" }, qty: 1, unit: { en: "PCS", ar: "قطعة" } },
      { name: { en: "Copper Wire 2mm", ar: "سلك نحاسي 2مم" }, qty: 15, unit: { en: "M", ar: "م" } },
    ],
  },
  {
    id: "BOM-003", product: { en: "Conveyor Belt Module", ar: "وحدة سير ناقل" }, version: "v3.2",
    components: 12, cost: 1450.00, status: "draft",
    materials: [
      { name: { en: "Aluminum Sheet 3mm", ar: "لوح ألمنيوم 3مم" }, qty: 6, unit: { en: "SQM", ar: "م²" } },
      { name: { en: "Bearing 6205-2RS", ar: "محمل 6205-2RS" }, qty: 8, unit: { en: "PCS", ar: "قطعة" } },
    ],
  },
  {
    id: "BOM-004", product: { en: "Air Compressor AC-30", ar: "ضاغط هواء AC-30" }, version: "v1.5",
    components: 10, cost: 2100.00, status: "active",
    materials: [],
  },
];

export function InventoryBOM() {
  const { t, language } = useAppConfig();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = BOM_DATA.filter((b) => {
    const name = language === "ar" ? b.product.ar : b.product.en;
    return name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("قائمة المواد", "Bill of Materials")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("إدارة تركيبة المنتجات", "Manage product compositions")}</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          {t("إضافة BOM", "Add BOM")}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("بحث...", "Search...")} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9 h-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>{t("الرقم", "ID")}</TableHead>
                <TableHead>{t("المنتج", "Product")}</TableHead>
                <TableHead>{t("الإصدار", "Version")}</TableHead>
                <TableHead className="text-end">{t("المكونات", "Components")}</TableHead>
                <TableHead className="text-end">{t("التكلفة", "Cost")}</TableHead>
                <TableHead>{t("الحالة", "Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bom) => (
                <>
                  <TableRow key={bom.id} className="cursor-pointer" onClick={() => setExpanded(expanded === bom.id ? null : bom.id)}>
                    <TableCell>
                      <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expanded === bom.id ? "rotate-90" : ""}`} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{bom.id}</TableCell>
                    <TableCell className="font-medium">{language === "ar" ? bom.product.ar : bom.product.en}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{bom.version}</TableCell>
                    <TableCell className="text-end font-semibold">{bom.components}</TableCell>
                    <TableCell className="text-end">${bom.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={bom.status === "active" ? "default" : "outline"} className="text-[10px]">
                        {bom.status === "active" ? t("نشط", "Active") : t("مسودة", "Draft")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {expanded === bom.id && bom.materials.length > 0 && (
                    <TableRow key={`${bom.id}-detail`}>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">{t("المواد المطلوبة", "Required Materials")}</p>
                        <div className="space-y-1.5">
                          {bom.materials.map((m, i) => (
                            <div key={i} className="flex items-center justify-between text-sm rounded-md border border-border/40 px-3 py-1.5 bg-background">
                              <span>{language === "ar" ? m.name.ar : m.name.en}</span>
                              <span className="text-muted-foreground">{m.qty} {language === "ar" ? m.unit.ar : m.unit.en}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
