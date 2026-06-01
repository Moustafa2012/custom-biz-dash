import { useState, useEffect, useCallback, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Account, AccountAction } from "@/apps/synex/data/mock";
import { initializeMockData, mockAccounts } from "@/apps/synex/data/mock";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────
// Internal action type for seeding the reducer
// ─────────────────────────────────────────────────────────

type InternalAction = AccountAction | { type: "__INIT__"; payload: Account };

// ─────────────────────────────────────────────────────────
// Account Reducer
// ─────────────────────────────────────────────────────────

function accountReducer(state: Account | null, action: InternalAction): Account | null {
  switch (action.type) {
    case "__INIT__":
      return action.payload;
    case "TOGGLE_ACTIVE":
      if (!state) return state;
      return {
        ...state,
        settings: { ...state.settings, isActive: action.payload },
        status: action.payload ? "active" : "inactive",
      };
    case "TOGGLE_FROZEN":
      if (!state) return state;
      return {
        ...state,
        settings: { ...state.settings, isFrozen: action.payload },
      };
    case "TOGGLE_INTERNATIONAL":
      if (!state) return state;
      return {
        ...state,
        settings: { ...state.settings, allowInternationalTransactions: action.payload },
      };
    case "TOGGLE_ONLINE_PAYMENTS":
      if (!state) return state;
      return {
        ...state,
        settings: { ...state.settings, allowOnlinePayments: action.payload },
      };
    case "UPDATE_ATM_LIMIT":
      if (!state) return state;
      return {
        ...state,
        settings: { ...state.settings, atmWithdrawalLimit: action.payload },
        limits: { ...state.limits, atmWithdrawalLimit: action.payload },
      };
    case "UPDATE_DAILY_LIMIT":
      if (!state) return state;
      return {
        ...state,
        settings: { ...state.settings, dailySpendingLimit: action.payload },
        limits: { ...state.limits, dailySpendingLimit: action.payload },
      };
    case "ADD_FUNDS":
      if (!state) return state;
      return {
        ...state,
        currentBalance: state.currentBalance + action.payload.amount,
        projectedBalance: state.projectedBalance + action.payload.amount,
      };
    case "TRANSFER_FUNDS":
      if (!state) return state;
      return {
        ...state,
        currentBalance: state.currentBalance - action.payload.amount,
        projectedBalance: state.projectedBalance - action.payload.amount,
      };
    case "REPLACE_CARD":
      if (!state) return state;
      return {
        ...state,
        expiryDate: "12/29",
        cvv: "***",
      };
    case "EXPORT_STATEMENT":
      return state;
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────
// Builds a fully-populated Account from raw data
// ─────────────────────────────────────────────────────────

function buildAccount(base: Account): Account {
  const account = { ...base };

  if (!account.settings) {
    account.settings = {
      isActive: account.status === "active",
      isFrozen: false,
      allowInternationalTransactions: true,
      allowOnlinePayments: true,
      atmWithdrawalLimit: 5000,
      dailySpendingLimit: 10000,
    };
  }

  if (!account.limits) {
    account.limits = {
      atmWithdrawalLimit: account.settings?.atmWithdrawalLimit ?? 5000,
      dailySpendingLimit: account.settings?.dailySpendingLimit ?? 10000,
      onlineTransactionLimit: 15000,
      internationalTransferLimit: 25000,
    };
  }

  if (!account.permissions) {
    account.permissions = {
      canTransfer: true,
      canWithdraw: true,
      canMakePayments: true,
      canViewStatements: true,
      canManageCards: true,
    };
  }

  if (!account.recentTransactions) account.recentTransactions = [];

  if (!account.spendingStatistics) {
    account.spendingStatistics = {
      totalSpent: 0,
      totalReceived: 0,
      averageDailySpending: 0,
      topSpendingCategory: "None",
      monthlyTrend: [],
      categoryBreakdown: [],
    };
  }

  if (!account.cardType) account.cardType = "debit";
  if (!account.expiryDate) account.expiryDate = "12/28";
  if (!account.cvv) account.cvv = "***";

  return account;
}

// ─────────────────────────────────────────────────────────
// Resolve account — try localStorage first, fall back to
// the in-memory mockAccounts array (avoids Date serialization
// issues and store key mismatches)
// ─────────────────────────────────────────────────────────

function resolveAccount(accountId: string): Account | undefined {
  // 1. Try localStorage via initializeMockData
  try {
    const data = initializeMockData();
    const found = data.accounts.find((a) => a.id === accountId);
    if (found) return found;
  } catch {
    // ignore
  }
  // 2. Fall back to in-memory mock (always has correct Date objects)
  return mockAccounts.find((a) => a.id === accountId);
}

// ─────────────────────────────────────────────────────────
// Main Hook
// ─────────────────────────────────────────────────────────

export function useAccountSettings() {
  // Support both `:accountId` and `:id` route param names
  const params = useParams<{ accountId?: string; id?: string }>();
  const accountId = params.accountId ?? params.id;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [account, dispatch] = useReducer(accountReducer, null);

  useEffect(() => {
    if (!accountId) {
      setError("No account ID provided");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAccount = async () => {
      setIsLoading(true);
      setError(null);

      // Small delay to let the UI render the skeleton once
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (cancelled) return;

      const base = resolveAccount(accountId);

      if (!base) {
        setError("Account not found");
        setIsLoading(false);
        return;
      }

      dispatch({ type: "__INIT__", payload: buildAccount(base) });
      setIsLoading(false);
    };

    fetchAccount();
    return () => { cancelled = true; };
  }, [accountId]);

  const toggleActive = useCallback((value: boolean) => {
    dispatch({ type: "TOGGLE_ACTIVE", payload: value });
    toast.success(value ? "Account activated successfully" : "Account deactivated successfully");
  }, []);

  const toggleFrozen = useCallback((value: boolean) => {
    dispatch({ type: "TOGGLE_FROZEN", payload: value });
    toast.success(value ? "Card frozen successfully" : "Card unfrozen successfully");
  }, []);

  const toggleInternational = useCallback((value: boolean) => {
    dispatch({ type: "TOGGLE_INTERNATIONAL", payload: value });
    toast.success(value ? "International transactions enabled" : "International transactions disabled");
  }, []);

  const toggleOnlinePayments = useCallback((value: boolean) => {
    dispatch({ type: "TOGGLE_ONLINE_PAYMENTS", payload: value });
    toast.success(value ? "Online payments enabled" : "Online payments disabled");
  }, []);

  const updateAtmLimit = useCallback((value: number) => {
    dispatch({ type: "UPDATE_ATM_LIMIT", payload: value });
    toast.success(`ATM withdrawal limit updated to ${value}`);
  }, []);

  const updateDailyLimit = useCallback((value: number) => {
    dispatch({ type: "UPDATE_DAILY_LIMIT", payload: value });
    toast.success(`Daily spending limit updated to ${value}`);
  }, []);

  const addFunds = useCallback((amount: number, currency: string) => {
    dispatch({ type: "ADD_FUNDS", payload: { amount, currency } });
    toast.success(`Successfully added ${amount} ${currency} to account`);
  }, []);

  const transferFunds = useCallback((toAccountId: string, amount: number, currency: string) => {
    dispatch({ type: "TRANSFER_FUNDS", payload: { toAccountId, amount, currency } });
    toast.success(`Successfully transferred ${amount} ${currency}`);
  }, []);

  const replaceCard = useCallback(() => {
    dispatch({ type: "REPLACE_CARD" });
    toast.success("Card replacement requested successfully");
  }, []);

  const exportStatement = useCallback((format: "pdf" | "csv" | "excel") => {
    dispatch({ type: "EXPORT_STATEMENT", payload: { format } });
    toast.success(`Statement exported as ${format.toUpperCase()}`);
  }, []);

  const goBack = useCallback(() => {
    navigate("/synex/accounts");
  }, [navigate]);

  return {
    account,
    isLoading,
    error,
    isUpdating: false,
    actions: {
      toggleActive,
      toggleFrozen,
      toggleInternational,
      toggleOnlinePayments,
      updateAtmLimit,
      updateDailyLimit,
      addFunds,
      transferFunds,
      replaceCard,
      exportStatement,
      goBack,
    },
  };
}