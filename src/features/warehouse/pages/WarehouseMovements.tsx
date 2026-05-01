import { ArrowRightLeft } from "lucide-react";
import { EmptyState } from "@/features/banking/components/EmptyState";

export default function WarehouseMovements() {
  return (
    <EmptyState
      icon={ArrowRightLeft}
      titleAr="الحركات"
      titleEn="Movements"
      descriptionAr="لا توجد حركات مخزنية مسجلة."
      descriptionEn="No stock movements recorded."
    />
  );
}
