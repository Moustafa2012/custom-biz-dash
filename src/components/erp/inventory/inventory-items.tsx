import { useState } from "react";
import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Plus, Filter, Download, MoreHorizontal } from "lucide-react";

const ITEMS_DATA = [
  { id: "ITM-001", name: { en: "Steel Rod 12mm", ar: "قضيب فولاذي 12مم" }, sku: "SR-12", category: { en: "Raw Materials", ar: "مواد خام" }, qty: 1500, unit: { en: "KG", ar: "كجم" }, cost: 4.50, status: "in_stock" },
  { id: "ITM-002", name: { en: "Copper Wire 2mm", ar: "سلك نحاسي 2مم" }, sku: "CW-02", category: { en: "Raw Materials", ar: "مواد خام" }, qty: 800, unit: { en: "M", ar: "م" }, cost: 12.00, status: "in_stock" },
  { id: "ITM-003", name: { en: "Motor Assembly A1", ar: "تجميع محرك A1" }, sku: "MA-A1", category: { en: "Components", ar: "مكونات" }, qty: 45, unit: { en: "PCS", ar: "قطعة" }, cost: 250.00, status: "low_stock" },
  { id: "ITM-004", name: { en: "Control Board v3", ar: "لوحة تحكم v3" }, sku: "CB-V3", category: { en: "Components", ar: "مكونات" }, qty: 0, unit: { en: "PCS", ar: "قطعة" }, cost: 89.00, status: "out_of_stock" },
  { id: "ITM-005", name: { en: "Hydraulic Pump HP-50", ar: "مضخة هيدروليكية HP-50" }, sku: "HP-50", category: { en: "Finished Goods", ar: "منتجات نهائية" }, qty: 120, unit: { en: "PCS", ar: "قطعة" }, cost: 1200.00, status: "in_stock" },
  { id: "ITM-006", name: { en: "Rubber Gasket Set", ar: "طقم حشوات مطاطية" }, sku: "RG-SET", category: { en: "Consumables", ar: "مستهلكات" }, qty: 5, unit: { en: "SET", ar: "طقم" }, cost: 15.00, status: "low_stock" },
  { id: "ITM-007", name: { en: "Aluminum Sheet 3mm", ar: "لوح ألمنيوم 3مم" }, sku: "AS-03", category: { en: "Raw Materials", ar: "مواد خام" }, qty: 2200, unit: { en: "SQM", ar: "م²" }, cost: 28.00, status: "in_stock" },
  { id: "ITM-008", name: { en: "Bearing 6205-2RS", ar: "محمل 6205-2RS" }, sku: "BR-6205", category: { en: "Components", ar: "مكونات" }, qty: 340, unit: { en: "PCS", ar: "قطعة" }, cost: 7.50, status: "in_stock" },
];

// Stable English keys for category filter – language-independent
const CATEGORY_KEYS = ["Raw Materials", "Components", "Finished Goods", "Consumables"] as const;
type CategoryKey = typeof CATEGORY_KEYS[number];

const CATEGORY_LABELS: Record<CategoryKey, { ar: string }> = {
  "Raw Materials": { ar: "مواد خام" },
  "Components": { ar: "مكونات" },
  "Finished Goods": { ar: "منتجات نهائية" },
  "Consumables": { ar: "مستهلكات" },
};

export function InventoryItems() {
  const { t, language } = useAppConfig();
  const [search, setSearch] = useState("");
  // Filter key is always the English category name – stable across language switches
  const [categoryFilter, setCategoryFilter] = useState<"all" | CategoryKey>("all");

  const filtered = ITEMS_DATA.filter((item) => {
    const name = language === "ar" ? item.name.ar : item.name.en;
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || item.category.en === categoryFilter;
    return matchSearch && matchCat;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      in_stock: { label: t("متوفر", "In Stock"), variant: "default" },
      low_stock: { label: t("منخفض", "Low Stock"), variant: "secondary" },
      out_of_stock: { label: t("نفد", "Out of Stock"), variant: "destructive" },
    };
    const s = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("الأصناف", "Items")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("إدارة أصناف المخزون", "Manage inventory items")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            {t("تصدير", "Export")}
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-3.5 w-3.5" />
            {t("إضافة صنف", "Add Item")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("بحث بالاسم أو الرمز...", "Search by name or SKU...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 h-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as "all" | CategoryKey)}>
              <SelectTrigger className="w-[180px] h-9">
                <Filter className="h-3.5 w-3.5 me-2 text-muted-foreground" />
                <SelectValue placeholder={t("التصنيف", "Category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("الكل", "All")}</SelectItem>
                {CATEGORY_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {language === "ar" ? CATEGORY_LABELS[key].ar : key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("الرمز", "SKU")}</TableHead>
                <TableHead>{t("الاسم", "Name")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("التصنيف", "Category")}</TableHead>
                <TableHead className="text-end">{t("الكمية", "Qty")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("الوحدة", "Unit")}</TableHead>
                <TableHead className="text-end hidden lg:table-cell">{t("التكلفة", "Cost")}</TableHead>
                <TableHead>{t("الحالة", "Status")}</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    {t("لا توجد نتائج", "No items found")}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="font-medium">{language === "ar" ? item.name.ar : item.name.en}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {language === "ar" ? item.category.ar : item.category.en}
                    </TableCell>
                    <TableCell className="text-end font-semibold">{item.qty.toLocaleString()}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {language === "ar" ? item.unit.ar : item.unit.en}
                    </TableCell>
                    <TableCell className="text-end hidden lg:table-cell">${item.cost.toFixed(2)}</TableCell>
                    <TableCell>{statusBadge(item.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
