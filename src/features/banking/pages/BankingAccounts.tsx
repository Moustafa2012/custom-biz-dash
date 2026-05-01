import { CreditCard } from "lucide-react";
import { EmptyState } from "../components/EmptyState";

export default function BankingAccounts() {
  return (
    <EmptyState
      icon={CreditCard}
      titleAr="الحسابات البنكية"
      titleEn="Bank Accounts"
      descriptionAr="لا توجد حسابات بعد."
      descriptionEn="No accounts yet."
    />
  );
}
