import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BankAccount, Beneficiary, BankTransaction, BankTransfer,
  CompanyProfile, TransferDocument,
} from "../types";

const EMPTY_COMPANY: CompanyProfile = {
  name: "", registrationNumber: "", industry: "",
  phone: "", email: "", website: "", address: "",
};

interface BankingState {
  // Static configuration (persisted)
  company: CompanyProfile;
  accounts: BankAccount[];
  beneficiaries: Beneficiary[];
  documents: TransferDocument[];

  // Live data (in-memory only — will come from API later)
  transactions: BankTransaction[];
  transfers: BankTransfer[];

  setCompany: (c: CompanyProfile) => void;

  addAccount: (a: BankAccount) => void;
  updateAccount: (id: string, patch: Partial<BankAccount>) => void;
  removeAccount: (id: string) => void;

  addBeneficiary: (b: Beneficiary) => void;
  updateBeneficiary: (id: string, patch: Partial<Beneficiary>) => void;
  removeBeneficiary: (id: string) => void;

  addDocument: (d: TransferDocument) => void;
  removeDocument: (id: string) => void;

  setTransactions: (t: BankTransaction[]) => void;
  setTransfers: (t: BankTransfer[]) => void;
}

export const useBankingStore = create<BankingState>()(
  persist(
    (set) => ({
      company: EMPTY_COMPANY,
      accounts: [],
      beneficiaries: [],
      documents: [],
      transactions: [],
      transfers: [],

      setCompany: (company) => set({ company }),

      addAccount: (a) => set((s) => ({ accounts: [...s.accounts, a] })),
      updateAccount: (id, patch) => set((s) => ({
        accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      })),
      removeAccount: (id) => set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),

      addBeneficiary: (b) => set((s) => ({ beneficiaries: [...s.beneficiaries, b] })),
      updateBeneficiary: (id, patch) => set((s) => ({
        beneficiaries: s.beneficiaries.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      })),
      removeBeneficiary: (id) => set((s) => ({ beneficiaries: s.beneficiaries.filter((b) => b.id !== id) })),

      addDocument: (d) => set((s) => ({ documents: [d, ...s.documents] })),
      removeDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

      setTransactions: (transactions) => set({ transactions }),
      setTransfers: (transfers) => set({ transfers }),
    }),
    {
      name: "banking-config",
      // Persist only static configuration — live transactions/transfers come from API.
      partialize: (s) => ({
        company: s.company,
        accounts: s.accounts,
        beneficiaries: s.beneficiaries,
        documents: s.documents,
      }),
    }
  )
);
