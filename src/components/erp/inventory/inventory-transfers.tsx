import { useState } from "react";
import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightLeft, Search, Plus } from "lucide-react";

const TRANSFERS = [
  { id: "TRF-001", from: { en: "Main Warehouse", ar: "المستودع الرئيسي" }, to: { en: "Production WH", ar: "مستودع الإنتاج" }, items: 12, date: "2024-03-15", status: "completed" },
  { id: "TRF-002", from: { en: "Shipping Hub", ar: "مركز الشحن" }, to: { en: "Main Warehouse", ar: "المستودع الرئيسي" }, items: 5, date: "2024-03-14", status: "in_transit" },
  { id: "TRF-003", from: { en: "Production WH", ar: "مستودع الإنتاج" }, to: { en: "Shipping Hub", ar: "مركز الشحن" }, items: 30, date: "2024-03-14", status: "completed" },
  { id: "TRF-004", from: { en: "Cold Storage", ar: "التخزين البارد" }, to: { en: "Returns Center", ar: "مركز المرتجعات" }, items: 8, date: "2024-03-13", status: "pending" },
  { id: "TRF-005", from: { en: "Main Warehouse", ar: "المستودع الرئيسي" }, to: { en: "Cold Storage", ar: "التخزين البارد" }, items: 20, date: "2024-03-13", status: "completed" },
  { id: "TRF-006", from: { en: "Overflow Storage", ar: "مخزن فائض" }, to: { en: "Main Warehouse", ar: "المستودع الرئيسي" }, items: 45, date: "2024-03-12", status: "cancelled" },
];

export function InventoryTransfers() {
  const { t, language } = useAppConfig();
  const [search, setSearch] = useState("");

  const filtered = TRANSFERS.filter((tr) => {
    const from = language === "ar" ? tr.from.ar : tr.from.en;
    const to = language === "ar" ? tr.to.ar : tr.to.en;
    return tr.id.toLowerCase().includes(search.toLowerCase()) || from.includes(search) || to.includes(search);
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      completed: { label: t("مكتمل", "Completed"), variant: "default" },
      in_transit: { label: t("في الطريق", "In Transit"), variant: "secondary" },
      pending: { label: t("معلق", "Pending"), variant: "outline" },
      cancelled: { label: t("ملغي", "Cancelled"), variant: "destructive" },
    };
    const s = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("التحويلات", "Transfers")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("تحويل المخزون بين المستودعات", "Transfer stock between warehouses")}</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          {t("تحويل جديد", "New Transfer")}
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
                <TableHead>{t("من", "From")}</TableHead>
                <TableHead></TableHead>
                <TableHead>{t("إلى", "To")}</TableHead>
                <TableHead className="text-end">{t("الأصناف", "Items")}</TableHead>
                <TableHead>{t("التاريخ", "Date")}</TableHead>
                <TableHead>{t("الحالة", "Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tr) => (
                <TableRow key={tr.id}>
                  <TableCell className="font-mono text-xs">{tr.id}</TableCell>
                  <TableCell className="text-sm">{language === "ar" ? tr.from.ar : tr.from.en}</TableCell>
                  <TableCell><ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                  <TableCell className="text-sm">{language === "ar" ? tr.to.ar : tr.to.en}</TableCell>
                  <TableCell className="text-end font-semibold">{tr.items}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{tr.date}</TableCell>
                  <TableCell>{statusBadge(tr.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
