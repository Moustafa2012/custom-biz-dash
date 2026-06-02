// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  type: 'debit' | 'credit' | 'transfer' | 'fee'
  description: string
  amount: number
  currency: string
  date: Date
  status: 'completed' | 'pending' | 'failed'
  category?: string
  reference?: string
}

export interface SpendingStatistics {
  totalSpent: number
  totalReceived: number
  averageDailySpending: number
  topSpendingCategory: string
  monthlyTrend: Array<{ month: string; amount: number }>
  categoryBreakdown: Array<{ category: string; amount: number; percentage: number }>
}

export type AccountAction =
  | { type: "TOGGLE_ACTIVE"; payload: boolean }
  | { type: "TOGGLE_FROZEN"; payload: boolean }
  | { type: "TOGGLE_INTERNATIONAL"; payload: boolean }
  | { type: "TOGGLE_ONLINE_PAYMENTS"; payload: boolean }
  | { type: "UPDATE_ATM_LIMIT"; payload: number }
  | { type: "UPDATE_DAILY_LIMIT"; payload: number }
  | { type: "ADD_FUNDS"; payload: { amount: number; currency: string } }
  | { type: "TRANSFER_FUNDS"; payload: { toAccountId: string; amount: number; currency: string } }
  | { type: "REPLACE_CARD" }
  | { type: "EXPORT_STATEMENT"; payload: { format: "pdf" | "csv" | "excel" } };

export interface AccountState {
  account: Account | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

export interface Account {
  id: string
  bankName: string
  accountNumber: string
  iban: string
  currency: string
  currentBalance: number
  projectedBalance: number
  status: 'active' | 'inactive' | 'suspended'
  accountType?: 'checking' | 'savings' | 'business' | 'corporate'
  bankAddress?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  settings?: {
    isActive?: boolean
    isFrozen?: boolean
    allowInternationalTransactions?: boolean
    allowOnlinePayments?: boolean
    atmWithdrawalLimit?: number
    dailySpendingLimit?: number
  }
  limits?: {
    atmWithdrawalLimit?: number
    dailySpendingLimit?: number
    onlineTransactionLimit?: number
    internationalTransferLimit?: number
  }
  permissions?: {
    canTransfer?: boolean
    canWithdraw?: boolean
    canMakePayments?: boolean
    canViewStatements?: boolean
    canManageCards?: boolean
  }
  recentTransactions?: Array<{
    id: string
    type: 'debit' | 'credit' | 'transfer' | 'fee'
    description: string
    amount: number
    currency: string
    date: Date
    status: 'completed' | 'pending' | 'failed'
    category?: string
    reference?: string
  }>
  spendingStatistics?: {
    totalSpent: number
    totalReceived: number
    averageDailySpending: number
    topSpendingCategory: string
    monthlyTrend: Array<{ month: string; amount: number }>
    categoryBreakdown: Array<{ category: string; amount: number; percentage: number }>
  }
  cardType?: 'debit' | 'credit' | 'prepaid'
  expiryDate?: string
  cvv?: string
}

export interface Beneficiary {
  id: string
  name: string
  companyName?: string
  country: string
  bankName: string
  currency: string
  email?: string
  phone?: string
  address?: string
  bankingData: Record<string, string>
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface Transfer {
  id: string
  referenceNumber: string
  sourceAccountId: string
  beneficiaryId: string
  country: string
  bankName: string
  amount: number
  currency: string
  status: 'draft' | 'pending' | 'pending_approval' | 'approved' | 'sent' | 'completed' | 'settled' | 'rejected' | 'cancelled' | 'voided' | 'failed'
  transferReason: string
  notes?: string
  executionDate: Date
  transferType: 'internal' | 'external' | 'salary' | 'supplier' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdBy: string
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  pdfUrl?: string
}

export interface JournalEntry {
  id: string
  entryNumber: string
  transactionType: 'settlement' | 'bank_fee' | 'balance_correction' | 'deposit' | 'withdrawal' | 'internal_transfer'
  accountId: string
  description: string
  amount: number
  currency: string
  date: Date
  createdBy: string
  createdAt: Date
  referenceId?: string
}

// ─── Stable IDs ───────────────────────────────────────────────────────────────

// Account IDs
const ACC_1 = 'acc-0001-rajhi-sar'
const ACC_2 = 'acc-0002-inma-sar'
const ACC_3 = 'acc-0003-french-sar'
const ACC_4 = 'acc-0004-emirates-aed'
const ACC_5 = 'acc-0005-riyad-sar'
const ACC_6 = 'acc-0006-ahli-usd'

// Beneficiary IDs
const BEN_1 = 'ben-0001-mohammed-sa'
const BEN_2 = 'ben-0002-john-us'
const BEN_3 = 'ben-0003-raj-in'
const BEN_4 = 'ben-0004-sarah-gb'
const BEN_5 = 'ben-0005-ali-ae'
const BEN_6 = 'ben-0006-chen-cn'

// Transfer IDs
const TRF_1 = 'trf-0001'
const TRF_2 = 'trf-0002'
const TRF_3 = 'trf-0003'
const TRF_4 = 'trf-0004'
const TRF_5 = 'trf-0005'
const TRF_6 = 'trf-0006'
const TRF_7 = 'trf-0007'
const TRF_8 = 'trf-0008'

// Journal IDs
const JNL_1 = 'jnl-0001'
const JNL_2 = 'jnl-0002'
const JNL_3 = 'jnl-0003'
const JNL_4 = 'jnl-0004'
const JNL_5 = 'jnl-0005'
const JNL_6 = 'jnl-0006'
const JNL_7 = 'jnl-0007'
const JNL_8 = 'jnl-0008'

// ─── Mock Accounts ────────────────────────────────────────────────────────────

export const mockAccounts: Account[] = [
  {
    id: ACC_1,
    bankName: 'الراجحي',
    accountNumber: '100123456789001',
    iban: 'SA4420000001234567891234',
    currency: 'SAR',
    currentBalance: 1_234_567.89,
    projectedBalance: 1_150_000.00,
    status: 'active',
    accountType: 'business',
    bankAddress: 'طريق الملك فهد، الرياض',
    contactPerson: 'أحمد الراشد',
    contactPhone: '+966112345678',
    contactEmail: 'ahmed@rajhi.com',
    notes: 'الحساب الرئيسي للعمليات اليومية',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-04-10'),
    cardType: 'debit',
    expiryDate: '12/28',
    cvv: '***',
    settings: {
      isActive: true,
      isFrozen: false,
      allowInternationalTransactions: true,
      allowOnlinePayments: true,
      atmWithdrawalLimit: 5000,
      dailySpendingLimit: 10000,
    },
    limits: {
      atmWithdrawalLimit: 5000,
      dailySpendingLimit: 10000,
      onlineTransactionLimit: 15000,
      internationalTransferLimit: 25000,
    },
    permissions: {
      canTransfer: true,
      canWithdraw: true,
      canMakePayments: true,
      canViewStatements: true,
      canManageCards: true,
    },
    recentTransactions: [
      {
        id: `txn-${ACC_1}-1`,
        type: 'debit',
        description: 'Purchase at Amazon',
        amount: -150.00,
        currency: 'SAR',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Shopping',
        reference: 'TXN001',
      },
      {
        id: `txn-${ACC_1}-2`,
        type: 'credit',
        description: 'Salary Deposit',
        amount: 5000.00,
        currency: 'SAR',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Income',
        reference: 'TXN002',
      },
      {
        id: `txn-${ACC_1}-3`,
        type: 'transfer',
        description: 'Transfer to Savings',
        amount: -1000.00,
        currency: 'SAR',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Transfer',
        reference: 'TXN003',
      },
      {
        id: `txn-${ACC_1}-4`,
        type: 'debit',
        description: 'Restaurant Payment',
        amount: -85.50,
        currency: 'SAR',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Food',
        reference: 'TXN004',
      },
      {
        id: `txn-${ACC_1}-5`,
        type: 'fee',
        description: 'Monthly Maintenance Fee',
        amount: -15.00,
        currency: 'SAR',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Fees',
        reference: 'TXN005',
      },
    ],
    spendingStatistics: {
      totalSpent: 3250.50,
      totalReceived: 8500.00,
      averageDailySpending: 108.35,
      topSpendingCategory: 'Shopping',
      monthlyTrend: [
        { month: 'Jan', amount: 2800 },
        { month: 'Feb', amount: 3200 },
        { month: 'Mar', amount: 2900 },
        { month: 'Apr', amount: 3500 },
        { month: 'May', amount: 3250 },
      ],
      categoryBreakdown: [
        { category: 'Shopping', amount: 1200, percentage: 37 },
        { category: 'Food', amount: 850, percentage: 26 },
        { category: 'Transfer', amount: 1000, percentage: 31 },
        { category: 'Fees', amount: 200.50, percentage: 6 },
      ],
    },
  },
  {
    id: ACC_2,
    bankName: 'الإنماء',
    accountNumber: '200987654321002',
    iban: 'SA2880000009876543210987',
    currency: 'SAR',
    currentBalance: 987_654.32,
    projectedBalance: 950_000.00,
    status: 'active',
    accountType: 'corporate',
    bankAddress: 'حي العليا، الرياض',
    contactPerson: 'سلمى الحربي',
    contactPhone: '+966113456789',
    contactEmail: 'salma@alinma.com',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2025-04-10'),
    cardType: 'credit',
    expiryDate: '06/27',
    cvv: '***',
    settings: {
      isActive: true,
      isFrozen: false,
      allowInternationalTransactions: true,
      allowOnlinePayments: true,
      atmWithdrawalLimit: 3000,
      dailySpendingLimit: 8000,
    },
    limits: {
      atmWithdrawalLimit: 3000,
      dailySpendingLimit: 8000,
      onlineTransactionLimit: 12000,
      internationalTransferLimit: 20000,
    },
    permissions: {
      canTransfer: true,
      canWithdraw: true,
      canMakePayments: true,
      canViewStatements: true,
      canManageCards: true,
    },
    recentTransactions: [
      {
        id: `txn-${ACC_2}-1`,
        type: 'credit',
        description: 'Client Payment',
        amount: 25000.00,
        currency: 'SAR',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Income',
        reference: 'TXN101',
      },
      {
        id: `txn-${ACC_2}-2`,
        type: 'debit',
        description: 'Office Supplies',
        amount: -450.00,
        currency: 'SAR',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Business',
        reference: 'TXN102',
      },
      {
        id: `txn-${ACC_2}-3`,
        type: 'transfer',
        description: 'Vendor Payment',
        amount: -5000.00,
        currency: 'SAR',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Business',
        reference: 'TXN103',
      },
      {
        id: `txn-${ACC_2}-4`,
        type: 'debit',
        description: 'Utility Bill',
        amount: -320.00,
        currency: 'SAR',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Utilities',
        reference: 'TXN104',
      },
      {
        id: `txn-${ACC_2}-5`,
        type: 'fee',
        description: 'Wire Transfer Fee',
        amount: -25.00,
        currency: 'SAR',
        date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Fees',
        reference: 'TXN105',
      },
    ],
    spendingStatistics: {
      totalSpent: 5795.00,
      totalReceived: 45000.00,
      averageDailySpending: 193.17,
      topSpendingCategory: 'Business',
      monthlyTrend: [
        { month: 'Jan', amount: 5200 },
        { month: 'Feb', amount: 4800 },
        { month: 'Mar', amount: 6100 },
        { month: 'Apr', amount: 5500 },
        { month: 'May', amount: 5795 },
      ],
      categoryBreakdown: [
        { category: 'Business', amount: 5450, percentage: 94 },
        { category: 'Utilities', amount: 320, percentage: 6 },
        { category: 'Fees', amount: 25, percentage: 0 },
      ],
    },
  },
  {
    id: ACC_3,
    bankName: 'السعودي الفرنسي',
    accountNumber: '300567890123003',
    iban: 'SA5678901234567890123456',
    currency: 'SAR',
    currentBalance: 456_789.12,
    projectedBalance: 420_000.00,
    status: 'active',
    accountType: 'checking',
    bankAddress: 'شارع العروبة، الرياض',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-03-20'),
    cardType: 'debit',
    expiryDate: '09/26',
    cvv: '***',
    settings: {
      isActive: true,
      isFrozen: false,
      allowInternationalTransactions: false,
      allowOnlinePayments: true,
      atmWithdrawalLimit: 2000,
      dailySpendingLimit: 5000,
    },
    limits: {
      atmWithdrawalLimit: 2000,
      dailySpendingLimit: 5000,
      onlineTransactionLimit: 8000,
      internationalTransferLimit: 0,
    },
    permissions: {
      canTransfer: true,
      canWithdraw: true,
      canMakePayments: true,
      canViewStatements: true,
      canManageCards: false,
    },
    recentTransactions: [
      {
        id: `txn-${ACC_3}-1`,
        type: 'debit',
        description: 'Grocery Shopping',
        amount: -320.50,
        currency: 'SAR',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Food',
        reference: 'TXN201',
      },
      {
        id: `txn-${ACC_3}-2`,
        type: 'credit',
        description: 'Refund',
        amount: 150.00,
        currency: 'SAR',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Refund',
        reference: 'TXN202',
      },
      {
        id: `txn-${ACC_3}-3`,
        type: 'debit',
        description: 'Gas Station',
        amount: -200.00,
        currency: 'SAR',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Transport',
        reference: 'TXN203',
      },
      {
        id: `txn-${ACC_3}-4`,
        type: 'debit',
        description: 'Coffee Shop',
        amount: -45.00,
        currency: 'SAR',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Food',
        reference: 'TXN204',
      },
      {
        id: `txn-${ACC_3}-5`,
        type: 'fee',
        description: 'ATM Fee',
        amount: -5.00,
        currency: 'SAR',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Fees',
        reference: 'TXN205',
      },
    ],
    spendingStatistics: {
      totalSpent: 420.50,
      totalReceived: 150.00,
      averageDailySpending: 14.02,
      topSpendingCategory: 'Food',
      monthlyTrend: [
        { month: 'Jan', amount: 380 },
        { month: 'Feb', amount: 420 },
        { month: 'Mar', amount: 390 },
        { month: 'Apr', amount: 450 },
        { month: 'May', amount: 420 },
      ],
      categoryBreakdown: [
        { category: 'Food', amount: 365.50, percentage: 87 },
        { category: 'Transport', amount: 200, percentage: 48 },
        { category: 'Fees', amount: 5, percentage: 1 },
      ],
    },
  },
  {
    id: ACC_4,
    bankName: 'Emirates NBD',
    accountNumber: 'AE400123456789004',
    iban: 'AE070331234567890123456',
    currency: 'AED',
    currentBalance: 250_000.00,
    projectedBalance: 230_000.00,
    status: 'active',
    accountType: 'business',
    bankAddress: 'Dubai, UAE',
    contactPerson: 'Khalid Al Mansoori',
    contactEmail: 'khalid@emiratesnbd.com',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2025-02-15'),
    cardType: 'debit',
    expiryDate: '03/27',
    cvv: '***',
    settings: {
      isActive: true,
      isFrozen: false,
      allowInternationalTransactions: true,
      allowOnlinePayments: true,
      atmWithdrawalLimit: 10000,
      dailySpendingLimit: 20000,
    },
    limits: {
      atmWithdrawalLimit: 10000,
      dailySpendingLimit: 20000,
      onlineTransactionLimit: 30000,
      internationalTransferLimit: 50000,
    },
    permissions: {
      canTransfer: true,
      canWithdraw: true,
      canMakePayments: true,
      canViewStatements: true,
      canManageCards: true,
    },
    recentTransactions: [
      {
        id: `txn-${ACC_4}-1`,
        type: 'credit',
        description: 'Business Revenue',
        amount: 50000.00,
        currency: 'AED',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Income',
        reference: 'TXN301',
      },
      {
        id: `txn-${ACC_4}-2`,
        type: 'debit',
        description: 'Equipment Purchase',
        amount: -12000.00,
        currency: 'AED',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Business',
        reference: 'TXN302',
      },
      {
        id: `txn-${ACC_4}-3`,
        type: 'transfer',
        description: 'Partner Transfer',
        amount: -8000.00,
        currency: 'AED',
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Transfer',
        reference: 'TXN303',
      },
      {
        id: `txn-${ACC_4}-4`,
        type: 'debit',
        description: 'Hotel Booking',
        amount: -2500.00,
        currency: 'AED',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Travel',
        reference: 'TXN304',
      },
      {
        id: `txn-${ACC_4}-5`,
        type: 'fee',
        description: 'International Transfer Fee',
        amount: -75.00,
        currency: 'AED',
        date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Fees',
        reference: 'TXN305',
      },
    ],
    spendingStatistics: {
      totalSpent: 22575.00,
      totalReceived: 75000.00,
      averageDailySpending: 752.50,
      topSpendingCategory: 'Business',
      monthlyTrend: [
        { month: 'Jan', amount: 21000 },
        { month: 'Feb', amount: 23000 },
        { month: 'Mar', amount: 19500 },
        { month: 'Apr', amount: 24000 },
        { month: 'May', amount: 22575 },
      ],
      categoryBreakdown: [
        { category: 'Business', amount: 20000, percentage: 89 },
        { category: 'Travel', amount: 2500, percentage: 11 },
        { category: 'Fees', amount: 75, percentage: 0 },
      ],
    },
  },
  {
    id: ACC_5,
    bankName: 'بنك الرياض',
    accountNumber: '500112233445005',
    iban: 'SA6120000001122334450050',
    currency: 'SAR',
    currentBalance: 78_900.00,
    projectedBalance: 80_000.00,
    status: 'inactive',
    accountType: 'savings',
    notes: 'حساب احتياطي للطوارئ',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-12-01'),
    cardType: 'debit',
    expiryDate: '11/25',
    cvv: '***',
    settings: {
      isActive: false,
      isFrozen: false,
      allowInternationalTransactions: true,
      allowOnlinePayments: true,
      atmWithdrawalLimit: 1000,
      dailySpendingLimit: 2000,
    },
    limits: {
      atmWithdrawalLimit: 1000,
      dailySpendingLimit: 2000,
      onlineTransactionLimit: 3000,
      internationalTransferLimit: 5000,
    },
    permissions: {
      canTransfer: true,
      canWithdraw: true,
      canMakePayments: false,
      canViewStatements: true,
      canManageCards: true,
    },
    recentTransactions: [
      {
        id: `txn-${ACC_5}-1`,
        type: 'credit',
        description: 'Savings Deposit',
        amount: 5000.00,
        currency: 'SAR',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Deposit',
        reference: 'TXN401',
      },
      {
        id: `txn-${ACC_5}-2`,
        type: 'debit',
        description: 'Emergency Withdrawal',
        amount: -2000.00,
        currency: 'SAR',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Withdrawal',
        reference: 'TXN402',
      },
      {
        id: `txn-${ACC_5}-3`,
        type: 'credit',
        description: 'Interest Credit',
        amount: 125.50,
        currency: 'SAR',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Interest',
        reference: 'TXN403',
      },
    ],
    spendingStatistics: {
      totalSpent: 2000.00,
      totalReceived: 5125.50,
      averageDailySpending: 22.22,
      topSpendingCategory: 'Withdrawal',
      monthlyTrend: [
        { month: 'Jan', amount: 0 },
        { month: 'Feb', amount: 0 },
        { month: 'Mar', amount: 2000 },
        { month: 'Apr', amount: 0 },
        { month: 'May', amount: 0 },
      ],
      categoryBreakdown: [
        { category: 'Withdrawal', amount: 2000, percentage: 100 },
      ],
    },
  },
  {
    id: ACC_6,
    bankName: 'البنك الأهلي',
    accountNumber: '600998877665006',
    iban: 'SA1010000009988776650060',
    currency: 'USD',
    currentBalance: 125_000.00,
    projectedBalance: 120_000.00,
    status: 'active',
    accountType: 'corporate',
    bankAddress: 'King Abdullah Financial District, Riyadh',
    contactPerson: 'Nora Al-Ghamdi',
    contactEmail: 'nora@alahli.com',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2025-05-01'),
    cardType: 'credit',
    expiryDate: '08/26',
    cvv: '***',
    settings: {
      isActive: true,
      isFrozen: false,
      allowInternationalTransactions: true,
      allowOnlinePayments: true,
      atmWithdrawalLimit: 2000,
      dailySpendingLimit: 5000,
    },
    limits: {
      atmWithdrawalLimit: 2000,
      dailySpendingLimit: 5000,
      onlineTransactionLimit: 10000,
      internationalTransferLimit: 50000,
    },
    permissions: {
      canTransfer: true,
      canWithdraw: true,
      canMakePayments: true,
      canViewStatements: true,
      canManageCards: true,
    },
    recentTransactions: [
      {
        id: `txn-${ACC_6}-1`,
        type: 'credit',
        description: 'USD Deposit',
        amount: 10000.00,
        currency: 'USD',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Deposit',
        reference: 'TXN501',
      },
      {
        id: `txn-${ACC_6}-2`,
        type: 'debit',
        description: 'International Payment',
        amount: -3500.00,
        currency: 'USD',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'International',
        reference: 'TXN502',
      },
      {
        id: `txn-${ACC_6}-3`,
        type: 'transfer',
        description: 'USD to SAR Transfer',
        amount: -5000.00,
        currency: 'USD',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Transfer',
        reference: 'TXN503',
      },
      {
        id: `txn-${ACC_6}-4`,
        type: 'debit',
        description: 'Software Subscription',
        amount: -299.00,
        currency: 'USD',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Software',
        reference: 'TXN504',
      },
      {
        id: `txn-${ACC_6}-5`,
        type: 'fee',
        description: 'Foreign Exchange Fee',
        amount: -50.00,
        currency: 'USD',
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        status: 'completed',
        category: 'Fees',
        reference: 'TXN505',
      },
    ],
    spendingStatistics: {
      totalSpent: 8849.00,
      totalReceived: 25000.00,
      averageDailySpending: 294.97,
      topSpendingCategory: 'International',
      monthlyTrend: [
        { month: 'Jan', amount: 8500 },
        { month: 'Feb', amount: 9200 },
        { month: 'Mar', amount: 7800 },
        { month: 'Apr', amount: 9100 },
        { month: 'May', amount: 8849 },
      ],
      categoryBreakdown: [
        { category: 'International', amount: 8500, percentage: 96 },
        { category: 'Software', amount: 299, percentage: 3 },
        { category: 'Fees', amount: 50, percentage: 1 },
      ],
    },
  },
]

// ─── Mock Beneficiaries ───────────────────────────────────────────────────────

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: BEN_1,
    name: 'محمد أحمد',
    companyName: 'شركة المقاولون المتحدون',
    country: 'SA',
    bankName: 'الراجحي',
    currency: 'SAR',
    email: 'mohammed@contractors.com',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    bankingData: { iban: 'SA9876543210987654321098', swift: 'RJHISARI' },
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: BEN_2,
    name: 'John Smith',
    companyName: 'Global Trading Co.',
    country: 'US',
    bankName: 'Bank of America',
    currency: 'USD',
    email: 'john.smith@globaltrading.com',
    phone: '+12125551234',
    address: 'New York, USA',
    bankingData: { accountNumber: '1234567890', abaRoutingNumber: '026009593' },
    status: 'active',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: BEN_3,
    name: 'Raj Kumar',
    companyName: 'Tech Solutions India',
    country: 'IN',
    bankName: 'State Bank of India',
    currency: 'INR',
    email: 'raj.kumar@techsolutions.in',
    phone: '+919876543210',
    address: 'Mumbai, India',
    bankingData: { accountNumber: '123456789012', ifscCode: 'SBIN0001234' },
    status: 'active',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: BEN_4,
    name: 'Sarah Johnson',
    companyName: 'UK Imports Ltd',
    country: 'GB',
    bankName: 'HSBC UK',
    currency: 'GBP',
    email: 'sarah@ukimports.co.uk',
    phone: '+442071234567',
    address: 'London, UK',
    bankingData: { sortCode: '40-12-34', accountNumber: '56789012' },
    status: 'active',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2025-03-01'),
  },
  {
    id: BEN_5,
    name: 'علي الشيخ',
    companyName: 'مجموعة الإمارات للتجارة',
    country: 'AE',
    bankName: 'Emirates NBD',
    currency: 'AED',
    email: 'ali.sheikh@emiratestrading.ae',
    phone: '+971501234567',
    address: 'دبي، الإمارات',
    bankingData: { iban: 'AE070331234567890123999', swift: 'EBILAEAD' },
    status: 'active',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: BEN_6,
    name: 'Chen Wei',
    companyName: 'Shenzhen Electronics Co.',
    country: 'CN',
    bankName: 'Bank of China',
    currency: 'USD',
    email: 'chen.wei@szelectronics.cn',
    phone: '+8613812345678',
    address: 'Shenzhen, China',
    bankingData: { accountNumber: '6222021234567890', swift: 'BKCHCNBJ' },
    status: 'inactive',
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-11-01'),
  },
]

// ─── Mock Transfers ───────────────────────────────────────────────────────────

export const mockTransfers: Transfer[] = [
  {
    id: TRF_1,
    referenceNumber: 'TRF202400001',
    sourceAccountId: ACC_1,
    beneficiaryId: BEN_1,
    country: 'SA',
    bankName: 'الراجحي',
    amount: 15_000.00,
    currency: 'SAR',
    status: 'completed',
    transferReason: 'دفع فواتير المقاولين',
    notes: 'الدفعة الأولى للمشروع',
    executionDate: new Date('2024-12-10'),
    transferType: 'supplier',
    priority: 'medium',
    createdBy: 'admin',
    createdAt: new Date('2024-12-09'),
    updatedAt: new Date('2024-12-10'),
    sentAt: new Date('2024-12-10'),
  },
  {
    id: TRF_2,
    referenceNumber: 'TRF202400002',
    sourceAccountId: ACC_2,
    beneficiaryId: BEN_2,
    country: 'US',
    bankName: 'Bank of America',
    amount: 5_000.00,
    currency: 'USD',
    status: 'sent',
    transferReason: 'شراء معدات',
    notes: 'شراء معدات جديدة للمصنع',
    executionDate: new Date('2024-12-12'),
    transferType: 'external',
    priority: 'high',
    createdBy: 'admin',
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-12'),
    sentAt: new Date('2024-12-12'),
  },
  {
    id: TRF_3,
    referenceNumber: 'TRF202400003',
    sourceAccountId: ACC_3,
    beneficiaryId: BEN_3,
    country: 'IN',
    bankName: 'State Bank of India',
    amount: 12_000.00,
    currency: 'INR',
    status: 'pending',
    transferReason: 'خدمات استشارية',
    notes: 'دفعة شهرية للخدمات الاستشارية',
    executionDate: new Date('2025-01-15'),
    transferType: 'supplier',
    priority: 'medium',
    createdBy: 'admin',
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
  {
    id: TRF_4,
    referenceNumber: 'TRF202400004',
    sourceAccountId: ACC_1,
    beneficiaryId: BEN_4,
    country: 'GB',
    bankName: 'HSBC UK',
    amount: 3_500.00,
    currency: 'GBP',
    status: 'draft',
    transferReason: 'استيراد بضائع',
    notes: 'دفعة مقدمة لشحنة البضائع',
    executionDate: new Date('2025-05-20'),
    transferType: 'external',
    priority: 'low',
    createdBy: 'admin',
    createdAt: new Date('2025-05-14'),
    updatedAt: new Date('2025-05-14'),
  },
  {
    id: TRF_5,
    referenceNumber: 'TRF202500005',
    sourceAccountId: ACC_4,
    beneficiaryId: BEN_5,
    country: 'AE',
    bankName: 'Emirates NBD',
    amount: 50_000.00,
    currency: 'AED',
    status: 'completed',
    transferReason: 'رسوم استيراد',
    executionDate: new Date('2025-02-01'),
    transferType: 'external',
    priority: 'high',
    createdBy: 'admin',
    createdAt: new Date('2025-01-30'),
    updatedAt: new Date('2025-02-01'),
    sentAt: new Date('2025-02-01'),
  },
  {
    id: TRF_6,
    referenceNumber: 'TRF202500006',
    sourceAccountId: ACC_6,
    beneficiaryId: BEN_6,
    country: 'CN',
    bankName: 'Bank of China',
    amount: 20_000.00,
    currency: 'USD',
    status: 'rejected',
    transferReason: 'شراء إلكترونيات',
    notes: 'رُفض بسبب عدم مطابقة بيانات المستفيد',
    executionDate: new Date('2025-03-05'),
    transferType: 'supplier',
    priority: 'urgent',
    createdBy: 'admin',
    createdAt: new Date('2025-03-04'),
    updatedAt: new Date('2025-03-06'),
  },
  {
    id: TRF_7,
    referenceNumber: 'TRF202500007',
    sourceAccountId: ACC_1,
    beneficiaryId: BEN_1,
    country: 'SA',
    bankName: 'الراجحي',
    amount: 8_200.00,
    currency: 'SAR',
    status: 'sent',
    transferReason: 'رواتب موظفين',
    executionDate: new Date('2025-04-30'),
    transferType: 'salary',
    priority: 'high',
    createdBy: 'admin',
    createdAt: new Date('2025-04-29'),
    updatedAt: new Date('2025-04-30'),
    sentAt: new Date('2025-04-30'),
  },
  {
    id: TRF_8,
    referenceNumber: 'TRF202500008',
    sourceAccountId: ACC_2,
    beneficiaryId: BEN_2,
    country: 'US',
    bankName: 'Bank of America',
    amount: 11_500.00,
    currency: 'USD',
    status: 'pending',
    transferReason: 'دفع فاتورة خدمات',
    executionDate: new Date('2025-05-18'),
    transferType: 'other',
    priority: 'medium',
    createdBy: 'admin',
    createdAt: new Date('2025-05-13'),
    updatedAt: new Date('2025-05-13'),
  },
]

// ─── Mock Journal Entries ─────────────────────────────────────────────────────

export const mockJournalEntries: JournalEntry[] = [
  {
    id: JNL_1,
    entryNumber: 'JE202400001',
    transactionType: 'settlement',
    accountId: ACC_1,
    description: 'تسوية حساب التحويلات',
    amount: 15_000.00,
    currency: 'SAR',
    date: new Date('2024-12-10'),
    createdBy: 'admin',
    createdAt: new Date('2024-12-10'),
    referenceId: TRF_1,
  },
  {
    id: JNL_2,
    entryNumber: 'JE202400002',
    transactionType: 'bank_fee',
    accountId: ACC_2,
    description: 'رسوم تحويل دولي',
    amount: 25.00,
    currency: 'USD',
    date: new Date('2024-12-12'),
    createdBy: 'admin',
    createdAt: new Date('2024-12-12'),
    referenceId: TRF_2,
  },
  {
    id: JNL_3,
    entryNumber: 'JE202400003',
    transactionType: 'deposit',
    accountId: ACC_3,
    description: 'إيداع نقدية',
    amount: 50_000.00,
    currency: 'SAR',
    date: new Date('2024-12-08'),
    createdBy: 'admin',
    createdAt: new Date('2024-12-08'),
  },
  {
    id: JNL_4,
    entryNumber: 'JE202400004',
    transactionType: 'withdrawal',
    accountId: ACC_1,
    description: 'سحب نقدي',
    amount: 5_000.00,
    currency: 'SAR',
    date: new Date('2024-12-05'),
    createdBy: 'admin',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: JNL_5,
    entryNumber: 'JE202400005',
    transactionType: 'balance_correction',
    accountId: ACC_2,
    description: 'تصحيح رصيد',
    amount: 100.00,
    currency: 'SAR',
    date: new Date('2024-12-01'),
    createdBy: 'admin',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: JNL_6,
    entryNumber: 'JE202500006',
    transactionType: 'internal_transfer',
    accountId: ACC_4,
    description: 'تحويل داخلي بين الحسابات',
    amount: 30_000.00,
    currency: 'AED',
    date: new Date('2025-02-01'),
    createdBy: 'admin',
    createdAt: new Date('2025-02-01'),
    referenceId: TRF_5,
  },
  {
    id: JNL_7,
    entryNumber: 'JE202500007',
    transactionType: 'bank_fee',
    accountId: ACC_6,
    description: 'رسوم إدارة حساب شهرية',
    amount: 150.00,
    currency: 'USD',
    date: new Date('2025-03-01'),
    createdBy: 'admin',
    createdAt: new Date('2025-03-01'),
  },
  {
    id: JNL_8,
    entryNumber: 'JE202500008',
    transactionType: 'settlement',
    accountId: ACC_1,
    description: 'تسوية رواتب الموظفين',
    amount: 8_200.00,
    currency: 'SAR',
    date: new Date('2025-04-30'),
    createdBy: 'admin',
    createdAt: new Date('2025-04-30'),
    referenceId: TRF_7,
  },
]

// ─── Seed / Initialize ────────────────────────────────────────────────────────

export const STORAGE_KEY = 'synex:db:v1'

export interface SynexStorageData {
  accounts: Account[]
  beneficiaries: Beneficiary[]
  transfers: Transfer[]
  journalEntries: JournalEntry[]
  version: string
  lastUpdated: string
}

/** Returns the canonical seed dataset (always fresh from mock constants). */
export const getSeedData = (): SynexStorageData => ({
  accounts: mockAccounts,
  beneficiaries: mockBeneficiaries,
  transfers: mockTransfers,
  journalEntries: mockJournalEntries,
  version: '1.3.0',
  lastUpdated: new Date().toISOString(),
})


const CURRENT_VERSION = '1.3.0'

/**
 * Loads persisted data from localStorage.
 * - Seeds on first run (no data stored).
 * - Migrates (re-seeds) when the stored version is older than CURRENT_VERSION,
 *   so pages always have consistent IDs matching the mock constants.
 */
export const initializeMockData = (): SynexStorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SynexStorageData
      // Re-seed if data is empty, version is outdated, or accounts don't have extended fields
      const needsMigration =
        !parsed.accounts ||
        parsed.accounts.length === 0 ||
        parsed.version !== CURRENT_VERSION ||
        !parsed.accounts[0]?.settings ||
        !parsed.accounts[0]?.limits ||
        !parsed.accounts[0]?.permissions
      if (!needsMigration) {
        return parsed
      }
    }
  } catch {
    // Ignore parse errors — fall through to seed
  }

  const seed = getSeedData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}
