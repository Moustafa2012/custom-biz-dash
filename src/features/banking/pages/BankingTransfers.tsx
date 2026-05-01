import { ArrowRightLeft } from "lucide-react";
import { EmptyState } from "../components/EmptyState";

export default function BankingTransfers() {
  return (
    <EmptyState
      icon={ArrowRightLeft}
      titleAr="التحويلات"
      titleEn="Transfers"
      descriptionAr="لم يتم إجراء تحويلات بعد."
      descriptionEn="No transfers yet."
    />
  );
}
