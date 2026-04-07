import { useState } from "react";
import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Search, Plus } from "lucide-react";

const ADJUSTMENTS = [
  { id: "ADJ-001", warehouse: { en: "Main Warehouse", ar: "المستودع الرئيسي" }, reason: { en: "Physical Count", ar: "جرد فعلي" }, items: 45, date: "2024-03-15", type: "count", status: "approved" },
  { id: "ADJ-002", warehouse: { en: "Production WH", ar: "مستودع الإنتاج" }, reason: { en: "Damaged Goods", ar: "بضائع تالفة" }, items: 8, date: "2024-03-14", type: "damage", status: "approved" },
  { id: "ADJ-003", warehouse: { en: "Cold Storage", ar: "التخزين البارد" }, reason: { en: "Expired Items", ar: "أصناف منتهية" }, items: 12, date: "2024-03-13", type: "expiry", status: "pending" },
  { id: "ADJ-004", warehouse: { en: "Shipping Hub", ar: "مركز الشحن" }, reason: { en: "Shrinkage", ar: "فقد مخزون" }, items: 3, date: "2024-03-12", type: "shrinkage", status: "approved" },
  { id: "ADJ-005", warehouse: { en: "Main Warehouse", ar: "المستودع الرئيسي" }, reason: { en: "Revaluation", ar: "إعادة تقييم" }, items: 100, date: "2024-03-11", type: "revalue", status: "draft" },
];

export function InventoryAdjustments() {
  const { t, language } = useAppConfig();
  const [search, setSearch] = useState("");

  const filtered = ADJUSTMENTS.filter((adj) => adj.id.toLowerCase().includes(search.toLowerCase()));

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      approved: { label: t("معتمد", "Approved"), variant: "default" },
      pending: { label: t("معلق", "Pending"), variant: "secondary" },
      draft: { label: t("مسودة", "Draft"), variant: "outline" },
    };
    const s = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("تسويات المخزون", "Stock Adjustments")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("تسوية الكميات وإعادة التقييم", "Adjust quantities and revalue stock")}</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          {t("تسوية جديدة", "New Adjustment")}
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
                <TableHead>{t("الرقم", "ID")}</TableHead>
                <TableHead>{t("المستودع", "Warehouse")}</TableHead>
                <TableHead>{t("السبب", "Reason")}</TableHead>
                <TableHead className="text-end">{t("الأصناف", "Items")}</TableHead>
                <TableHead>{t("التاريخ", "Date")}</TableHead>
                <TableHead>{t("الحالة", "Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((adj) => (
                <TableRow key={adj.id}>
                  <TableCell className="font-mono text-xs">{adj.id}</TableCell>
                  <TableCell className="text-sm">{language === "ar" ? adj.warehouse.ar : adj.warehouse.en}</TableCell>
                  <TableCell className="text-sm">{language === "ar" ? adj.reason.ar : adj.reason.en}</TableCell>
                  <TableCell className="text-end font-semibold">{adj.items}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{adj.date}</TableCell>
                  <TableCell>{statusBadge(adj.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
