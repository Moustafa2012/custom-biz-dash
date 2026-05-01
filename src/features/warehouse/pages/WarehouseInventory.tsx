import { Package } from "lucide-react";
import { EmptyState } from "@/features/banking/components/EmptyState";

export default function WarehouseInventory() {
  return (
    <EmptyState
      icon={Package}
      titleAr="المخزون"
      titleEn="Inventory"
      descriptionAr="لا توجد أصناف بعد."
      descriptionEn="No items yet."
    />
  );
}
