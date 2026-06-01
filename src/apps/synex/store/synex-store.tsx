import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { Account, Beneficiary, Transfer, JournalEntry } from '../data/mock'
import { initializeMockData, STORAGE_KEY } from '../data/mock'

export interface SynexState {
  accounts: Account[]
  beneficiaries: Beneficiary[]
  transfers: Transfer[]
  journalEntries: JournalEntry[]
  loading: boolean
  error: string | null
}

type SynexAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; account: Partial<Account> } }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'SET_BENEFICIARIES'; payload: Beneficiary[] }
  | { type: 'ADD_BENEFICIARY'; payload: Beneficiary }
  | { type: 'UPDATE_BENEFICIARY'; payload: { id: string; beneficiary: Partial<Beneficiary> } }
  | { type: 'DELETE_BENEFICIARY'; payload: string }
  | { type: 'SET_TRANSFERS'; payload: Transfer[] }
  | { type: 'ADD_TRANSFER'; payload: Transfer }
  | { type: 'UPDATE_TRANSFER'; payload: { id: string; transfer: Partial<Transfer> } }
  | { type: 'DELETE_TRANSFER'; payload: string }
  | { type: 'SET_JOURNAL_ENTRIES'; payload: JournalEntry[] }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_JOURNAL_ENTRY'; payload: { id: string; entry: Partial<JournalEntry> } }
  | { type: 'DELETE_JOURNAL_ENTRY'; payload: string }
  | { type: 'LOAD_DATA'; payload: SynexState }

const initialState: SynexState = {
  accounts: [],
  beneficiaries: [],
  transfers: [],
  journalEntries: [],
  loading: false,
  error: null,
}

const synexReducer = (state: SynexState, action: SynexAction): SynexState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload }
    
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] }
    
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id
            ? { ...account, ...action.payload.account, updatedAt: new Date() }
            : account
        ),
      }
    
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload),
      }
    
    case 'SET_BENEFICIARIES':
      return { ...state, beneficiaries: action.payload }
    
    case 'ADD_BENEFICIARY':
      return { ...state, beneficiaries: [...state.beneficiaries, action.payload] }
    
    case 'UPDATE_BENEFICIARY':
      return {
        ...state,
        beneficiaries: state.beneficiaries.map(beneficiary =>
          beneficiary.id === action.payload.id
            ? { ...beneficiary, ...action.payload.beneficiary, updatedAt: new Date() }
            : beneficiary
        ),
      }
    
    case 'DELETE_BENEFICIARY':
      return {
        ...state,
        beneficiaries: state.beneficiaries.filter(beneficiary => beneficiary.id !== action.payload),
      }
    
    case 'SET_TRANSFERS':
      return { ...state, transfers: action.payload }
    
    case 'ADD_TRANSFER':
      return { ...state, transfers: [...state.transfers, action.payload] }
    
    case 'UPDATE_TRANSFER':
      return {
        ...state,
        transfers: state.transfers.map(transfer =>
          transfer.id === action.payload.id
            ? { ...transfer, ...action.payload.transfer, updatedAt: new Date() }
            : transfer
        ),
      }
    
    case 'DELETE_TRANSFER':
      return {
        ...state,
        transfers: state.transfers.filter(transfer => transfer.id !== action.payload),
      }
    
    case 'SET_JOURNAL_ENTRIES':
      return { ...state, journalEntries: action.payload }
    
    case 'ADD_JOURNAL_ENTRY':
      return { ...state, journalEntries: [...state.journalEntries, action.payload] }
    
    case 'UPDATE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map(entry =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload.entry }
            : entry
        ),
      }
    
    case 'DELETE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.filter(entry => entry.id !== action.payload),
      }
    
    case 'LOAD_DATA':
      return action.payload
    
    default:
      return state
  }
}

interface SynexContextType {
  state: SynexState
  dispatch: React.Dispatch<SynexAction>
  // Account actions
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAccount: (id: string, account: Partial<Account>) => void
  deleteAccount: (id: string) => void
  // Beneficiary actions
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBeneficiary: (id: string, beneficiary: Partial<Beneficiary>) => void
  deleteBeneficiary: (id: string) => void
  // Transfer actions
  addTransfer: (transfer: Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransfer: (id: string, transfer: Partial<Transfer>) => void
  deleteTransfer: (id: string) => void
  // Journal entry actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void
  deleteJournalEntry: (id: string) => void
  // Data persistence
  saveToStorage: () => void
  loadFromStorage: () => void
}

const SynexContext = createContext<SynexContextType | undefined>(undefined)

export const SynexProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(synexReducer, initialState)

  const saveToStorage = useCallback(() => {
    const data = {
      accounts: state.accounts,
      beneficiaries: state.beneficiaries,
      transfers: state.transfers,
      journalEntries: state.journalEntries,
      version: '1.1.0',
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [state])

  // Automatically save to storage when state changes
  useEffect(() => {
    // Skip saving if state is initial/empty to avoid overwriting with empty data
    if (state.accounts.length > 0 || state.beneficiaries.length > 0 || state.transfers.length > 0) {
      saveToStorage()
    }
  }, [state, saveToStorage])

  const loadFromStorage = useCallback(() => {
    try {
      // initializeMockData seeds localStorage if empty and returns the data
      const data = initializeMockData()
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          ...initialState,
          accounts: data.accounts,
          beneficiaries: data.beneficiaries,
          transfers: data.transfers,
          journalEntries: data.journalEntries,
          loading: false,
        },
      })
    } catch (error) {
      console.error('Failed to load data from storage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' })
    }
  }, [dispatch])

  const addAccount = useCallback((account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...account,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount })
  }, [dispatch])

  const updateAccount = useCallback((id: string, account: Partial<Account>) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, account } })
  }, [dispatch])

  const deleteAccount = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id })
  }, [dispatch])

  const addBeneficiary = useCallback((beneficiary: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    dispatch({ type: 'ADD_BENEFICIARY', payload: newBeneficiary })
  }, [dispatch])

  const updateBeneficiary = useCallback((id: string, beneficiary: Partial<Beneficiary>) => {
    dispatch({ type: 'UPDATE_BENEFICIARY', payload: { id, beneficiary } })
  }, [dispatch])

  const deleteBeneficiary = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BENEFICIARY', payload: id })
  }, [dispatch])

  const addTransfer = useCallback((transfer: Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransfer: Transfer = {
      ...transfer,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    dispatch({ type: 'ADD_TRANSFER', payload: newTransfer })
  }, [dispatch])

  const updateTransfer = useCallback((id: string, transfer: Partial<Transfer>) => {
    dispatch({ type: 'UPDATE_TRANSFER', payload: { id, transfer } })
  }, [dispatch])

  const deleteTransfer = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRANSFER', payload: id })
  }, [dispatch])

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: newEntry })
  }, [dispatch])

  const updateJournalEntry = useCallback((id: string, entry: Partial<JournalEntry>) => {
    dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: { id, entry } })
  }, [dispatch])

  const deleteJournalEntry = useCallback((id: string) => {
    dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: id })
  }, [dispatch])

  const value: SynexContextType = {
    state,
    dispatch,
    addAccount,
    updateAccount,
    deleteAccount,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    addTransfer,
    updateTransfer,
    deleteTransfer,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    saveToStorage,
    loadFromStorage,
  }

  return <SynexContext.Provider value={value}>{children}</SynexContext.Provider>
}

export const useSynex = () => {
  const context = useContext(SynexContext)
  if (context === undefined) {
    throw new Error('useSynex must be used within a SynexProvider')
  }
  return context
}
