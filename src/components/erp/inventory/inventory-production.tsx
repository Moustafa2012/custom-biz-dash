import { useState } from "react";
import { useAppConfig } from "../app-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Factory, Search, Plus } from "lucide-react";

const PRODUCTION_ORDERS = [
  { id: "PRD-001", product: { en: "Hydraulic Pump HP-50", ar: "مضخة هيدروليكية HP-50" }, qty: 50, completed: 35, start: "2024-03-10", due: "2024-03-20", status: "in_progress", priority: "high" },
  { id: "PRD-002", product: { en: "Control Panel v3", ar: "لوحة تحكم v3" }, qty: 100, completed: 100, start: "2024-03-01", due: "2024-03-12", status: "completed", priority: "normal" },
  { id: "PRD-003", product: { en: "Conveyor Belt Module", ar: "وحدة سير ناقل" }, qty: 20, completed: 0, start: "2024-03-18", due: "2024-04-01", status: "planned", priority: "normal" },
  { id: "PRD-004", product: { en: "Air Compressor AC-30", ar: "ضاغط هواء AC-30" }, qty: 15, completed: 8, start: "2024-03-12", due: "2024-03-22", status: "in_progress", priority: "urgent" },
  { id: "PRD-005", product: { en: "Motor Assembly A1", ar: "تجميع محرك A1" }, qty: 200, completed: 45, start: "2024-03-15", due: "2024-04-15", status: "in_progress", priority: "high" },
  { id: "PRD-006", product: { en: "Bearing 6205-2RS", ar: "محمل 6205-2RS" }, qty: 500, completed: 0, start: "2024-03-25", due: "2024-04-10", status: "planned", priority: "low" },
];

export function InventoryProduction() {
  const { t, language } = useAppConfig();
  const [search, setSearch] = useState("");

  const filtered = PRODUCTION_ORDERS.filter((p) => {
    const name = language === "ar" ? p.product.ar : p.product.en;
    return name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      completed: { label: t("مكتمل", "Completed"), variant: "default" },
      in_progress: { label: t("قيد التنفيذ", "In Progress"), variant: "secondary" },
      planned: { label: t("مخطط", "Planned"), variant: "outline" },
    };
    const s = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>;
  };

  const priorityBadge = (priority: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      urgent: { label: t("عاجل", "Urgent"), cls: "bg-destructive/10 text-destructive" },
      high: { label: t("عالي", "High"), cls: "bg-amber-500/10 text-amber-600" },
      normal: { label: t("عادي", "Normal"), cls: "bg-primary/10 text-primary" },
      low: { label: t("منخفض", "Low"), cls: "bg-muted text-muted-foreground" },
    };
    const p = map[priority] || { label: priority, cls: "bg-muted text-muted-foreground" };
    return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${p.cls}`}>{p.label}</span>;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("أوامر الإنتاج", "Production Orders")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("تتبع وإدارة عمليات التصنيع", "Track and manage manufacturing operations")}</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          {t("أمر إنتاج جديد", "New Production Order")}
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
                <TableHead>{t("المنتج", "Product")}</TableHead>
                <TableHead>{t("الأولوية", "Priority")}</TableHead>
                <TableHead>{t("التقدم", "Progress")}</TableHead>
                <TableHead>{t("البداية", "Start")}</TableHead>
                <TableHead>{t("الاستحقاق", "Due")}</TableHead>
                <TableHead>{t("الحالة", "Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const pct = Math.round((p.completed / p.qty) * 100);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-medium">{language === "ar" ? p.product.ar : p.product.en}</TableCell>
                    <TableCell>{priorityBadge(p.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-12 text-end">{p.completed}/{p.qty}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{p.start}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{p.due}</TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
