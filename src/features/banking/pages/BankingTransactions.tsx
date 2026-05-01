import { Receipt } from "lucide-react";
import { EmptyState } from "../components/EmptyState";

export default function BankingTransactions() {
  return (
    <EmptyState
      icon={Receipt}
      titleAr="المعاملات"
      titleEn="Transactions"
      descriptionAr="لم يتم تسجيل أي معاملات بعد."
      descriptionEn="No transactions recorded yet."
    />
  );
}
