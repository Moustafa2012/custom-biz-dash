import { create } from "zustand";
import type { BankAccount, BankTransaction, BankTransfer } from "../types";

// Frontend-only Zustand store. No mock data per user instruction.
// API integration is deferred — these collections start empty and will be
// hydrated through TanStack Query hooks once `/api/banking/*` endpoints exist.

interface BankingState {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  transfers: BankTransfer[];

  setAccounts: (a: BankAccount[]) => void;
  setTransactions: (t: BankTransaction[]) => void;
  setTransfers: (t: BankTransfer[]) => void;
}

export const useBankingStore = create<BankingState>((set) => ({
  accounts: [],
  transactions: [],
  transfers: [],
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  setTransfers: (transfers) => set({ transfers }),
}));
