// Public surface for the Banking feature module.
export { default as BankingDashboard } from "./pages/BankingDashboard";
export { default as BankingAccounts } from "./pages/BankingAccounts";
export { default as BankingTransactions } from "./pages/BankingTransactions";
export { default as BankingTransfers } from "./pages/BankingTransfers";
export { default as BankingReports } from "./pages/BankingReports";

export { useBankingStore } from "./stores/banking-store";
export type {
  BankAccount,
  BankTransaction,
  BankTransfer,
  BankingPageId,
  AccountType,
  AccountStatus,
  TxStatus,
  TxDirection,
} from "./types";
