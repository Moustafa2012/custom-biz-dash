import type { CountryCode } from "./lib/countries";

export type AccountType = "checking" | "savings" | "credit" | "loan" | "cash";
export type AccountStatus = "active" | "frozen" | "closed";
export type TxStatus = "pending" | "posted" | "failed" | "reversed";
export type TxDirection = "debit" | "credit";

/** Free-form key/value bag for country-specific routing fields (aba, ifsc, iban, swift, ...). */
export type RoutingFields = Record<string, string>;

export interface CompanyProfile {
  name: string;
  registrationNumber: string;
  industry: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface BankAccount {
  id: string;
  label: string;             // e.g. "Operating account"
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  currency: string;
  country: CountryCode;
  routing: RoutingFields;    // dynamic country-specific fields
  branchAddress?: string;
  status: AccountStatus;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  fullName: string;
  relationship: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  phone: string;
  email: string;
  address: string;
  country: CountryCode;
  routing: RoutingFields;
  createdAt: string;
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

export interface TransferDocument {
  id: string;
  reference: string;
  date: string;
  fromAccountId: string;
  amount: number;
  currency: string;
  reason: string;
  beneficiaryIds: string[];
  signatureDataUrl?: string;
  stampDataUrl?: string;
}

export type BankingPageId =
  | "banking-dashboard"
  | "banking-accounts"
  | "banking-beneficiaries"
  | "banking-document"
  | "banking-transactions"
  | "banking-transfers"
  | "banking-reports";
