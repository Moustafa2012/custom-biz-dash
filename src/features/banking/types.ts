// Banking domain types (frontend-only stubs).
// Backend wiring deferred — see ERP.md §4 (Banking Module Specification).

export type AccountType = "checking" | "savings" | "credit" | "loan" | "cash";
export type AccountStatus = "active" | "frozen" | "closed";
export type TxStatus = "pending" | "posted" | "failed" | "reversed";
export type TxDirection = "debit" | "credit";

export interface BankAccount {
  id: string;
  name: string;
  number: string;
  type: AccountType;
  currency: string;
  balance: number;
  status: AccountStatus;
  openedAt: string;
}

export interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  direction: TxDirection;
  status: TxStatus;
  reference?: string;
  category?: string;
}

export interface BankTransfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  date: string;
  status: TxStatus;
  notes?: string;
}

export type BankingPageId =
  | "banking-dashboard"
  | "banking-accounts"
  | "banking-transactions"
  | "banking-transfers"
  | "banking-reports";
