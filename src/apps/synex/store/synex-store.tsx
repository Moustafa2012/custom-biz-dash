import { createContext, useContext, useReducer, useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { Account, Beneficiary, Transfer, JournalEntry } from '../data/mock'
import { initializeMockData, STORAGE_KEY } from '../data/mock'
import {
  plan,
  EngineError,
  type Batch,
  type EngineCommand,
  type EngineState,
  type Mutation,
  type Posting,
  type AuditEvent,
} from '../domain'

const STORAGE_VERSION = 2

export interface SynexState extends EngineState {
  accounts: Account[]
  beneficiaries: Beneficiary[]
  transfers: Transfer[]
  journalEntries: JournalEntry[]
  postings: Posting[]
  auditEvents: AuditEvent[]
  loading: boolean
  error: string | null
  hydrated: boolean
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
  | { type: 'LOAD_DATA'; payload: Partial<SynexState> }
  | { type: 'APPLY_BATCH'; payload: Batch }

const initialState: SynexState = {
  accounts: [],
  beneficiaries: [],
  transfers: [],
  journalEntries: [],
  postings: [],
  auditEvents: [],
  loading: false,
  error: null,
  hydrated: false,
}

// ─── Mutation applier ───────────────────────────────────────────────────────

function applyMutation(state: SynexState, m: Mutation): SynexState {
  switch (m.type) {
    case 'POSTING_APPEND':
      return { ...state, postings: [...state.postings, m.payload] }
    case 'AUDIT_APPEND':
      return { ...state, auditEvents: [...state.auditEvents, m.payload] }
    case 'JOURNAL_APPEND':
      return { ...state, journalEntries: [...state.journalEntries, m.payload] }
    case 'TRANSFER_PATCH':
      return {
        ...state,
        transfers: state.transfers.map((t) =>
          t.id === m.payload.id ? { ...t, ...m.payload.patch, updatedAt: new Date() } : t,
        ),
      }
    case 'ACCOUNT_PATCH':
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === m.payload.id ? { ...a, ...m.payload.patch, updatedAt: new Date() } : a,
        ),
      }
    case 'BENEFICIARY_PATCH':
      return {
        ...state,
        beneficiaries: state.beneficiaries.map((b) =>
          b.id === m.payload.id ? { ...b, ...m.payload.patch, updatedAt: new Date() } : b,
        ),
      }
    default:
      return state
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

const synexReducer = (state: SynexState, action: SynexAction): SynexState => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload }
    case 'SET_ERROR':   return { ...state, error: action.payload }
    case 'SET_ACCOUNTS': return { ...state, accounts: action.payload }
    case 'ADD_ACCOUNT':  return { ...state, accounts: [...state.accounts, action.payload] }
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.account, updatedAt: new Date() } : a,
        ),
      }
    case 'DELETE_ACCOUNT':
      return { ...state, accounts: state.accounts.filter((a) => a.id !== action.payload) }
    case 'SET_BENEFICIARIES': return { ...state, beneficiaries: action.payload }
    case 'ADD_BENEFICIARY':   return { ...state, beneficiaries: [...state.beneficiaries, action.payload] }
    case 'UPDATE_BENEFICIARY':
      return {
        ...state,
        beneficiaries: state.beneficiaries.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload.beneficiary, updatedAt: new Date() } : b,
        ),
      }
    case 'DELETE_BENEFICIARY':
      return { ...state, beneficiaries: state.beneficiaries.filter((b) => b.id !== action.payload) }
    case 'SET_TRANSFERS': return { ...state, transfers: action.payload }
    case 'ADD_TRANSFER':  return { ...state, transfers: [...state.transfers, action.payload] }
    case 'UPDATE_TRANSFER':
      return {
        ...state,
        transfers: state.transfers.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.transfer, updatedAt: new Date() } : t,
        ),
      }
    case 'DELETE_TRANSFER':
      return { ...state, transfers: state.transfers.filter((t) => t.id !== action.payload) }
    case 'SET_JOURNAL_ENTRIES': return { ...state, journalEntries: action.payload }
    case 'ADD_JOURNAL_ENTRY':   return { ...state, journalEntries: [...state.journalEntries, action.payload] }
    case 'UPDATE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.entry } : e,
        ),
      }
    case 'DELETE_JOURNAL_ENTRY':
      return { ...state, journalEntries: state.journalEntries.filter((e) => e.id !== action.payload) }
    case 'LOAD_DATA':
      return { ...state, ...action.payload, hydrated: true }
    case 'APPLY_BATCH':
      return action.payload.mutations.reduce(applyMutation, state)
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface SynexContextType {
  state: SynexState
  dispatch: React.Dispatch<SynexAction>
  // Legacy CRUD (kept for back-compat; new flows should prefer `execute`)
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAccount: (id: string, account: Partial<Account>) => void
  deleteAccount: (id: string) => void
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBeneficiary: (id: string, beneficiary: Partial<Beneficiary>) => void
  deleteBeneficiary: (id: string) => void
  addTransfer: (transfer: Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransfer: (id: string, transfer: Partial<Transfer>) => void
  deleteTransfer: (id: string) => void
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void
  deleteJournalEntry: (id: string) => void
  saveToStorage: () => void
  loadFromStorage: () => void
  /**
   * Run a domain command through the TransactionEngine. Returns the Batch
   * applied, or throws EngineError. All postings/audit/state changes happen
   * in a single dispatch (atomic).
   */
  execute: (command: EngineCommand, actor?: string) => Batch
}

const SynexContext = createContext<SynexContextType | undefined>(undefined)

export const SynexProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(synexReducer, initialState)
  const persistTimerRef = useRef<number | null>(null)

  // ─── Hydrate once on mount ─────────────────────────────────────────────────
  useEffect(() => {
    try {
      const data = initializeMockData()
      // Pull any persisted postings/audit log on top of mock seed
      const raw = localStorage.getItem(STORAGE_KEY)
      let postings: Posting[] = []
      let auditEvents: AuditEvent[] = []
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.postings)) postings = parsed.postings
        if (Array.isArray(parsed?.auditEvents)) auditEvents = parsed.auditEvents
      }
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          accounts: data.accounts,
          beneficiaries: data.beneficiaries,
          transfers: data.transfers,
          journalEntries: data.journalEntries,
          postings,
          auditEvents,
          loading: false,
        },
      })
    } catch (err) {
      console.error('[synex] hydrate failed:', err)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' })
    }
  }, [])

  // ─── Debounced persistence ────────────────────────────────────────────────
  const saveToStorage = useCallback(() => {
    try {
      const data = {
        version: STORAGE_VERSION,
        lastUpdated: new Date().toISOString(),
        accounts: state.accounts,
        beneficiaries: state.beneficiaries,
        transfers: state.transfers,
        journalEntries: state.journalEntries,
        postings: state.postings,
        auditEvents: state.auditEvents,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (err) {
      // Most likely quota exceeded; surface but don't crash
      console.error('[synex] persist failed:', (err as Error)?.message)
    }
  }, [state])

  useEffect(() => {
    if (!state.hydrated) return
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current)
    persistTimerRef.current = window.setTimeout(saveToStorage, 300)
    return () => {
      if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current)
    }
  }, [state, saveToStorage])

  const loadFromStorage = useCallback(() => {
    // Kept for API compatibility — provider already hydrates on mount.
    const data = initializeMockData()
    dispatch({
      type: 'LOAD_DATA',
      payload: {
        accounts: data.accounts,
        beneficiaries: data.beneficiaries,
        transfers: data.transfers,
        journalEntries: data.journalEntries,
      },
    })
  }, [])

  // ─── Legacy CRUD ──────────────────────────────────────────────────────────
  const addAccount = useCallback((account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({
      type: 'ADD_ACCOUNT',
      payload: { ...account, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() },
    })
  }, [])
  const updateAccount = useCallback((id: string, account: Partial<Account>) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, account } })
  }, [])
  const deleteAccount = useCallback((id: string) => dispatch({ type: 'DELETE_ACCOUNT', payload: id }), [])

  const addBeneficiary = useCallback((beneficiary: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({
      type: 'ADD_BENEFICIARY',
      payload: { ...beneficiary, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() },
    })
  }, [])
  const updateBeneficiary = useCallback((id: string, beneficiary: Partial<Beneficiary>) => {
    dispatch({ type: 'UPDATE_BENEFICIARY', payload: { id, beneficiary } })
  }, [])
  const deleteBeneficiary = useCallback((id: string) => dispatch({ type: 'DELETE_BENEFICIARY', payload: id }), [])

  const addTransfer = useCallback((transfer: Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({
      type: 'ADD_TRANSFER',
      payload: { ...transfer, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() },
    })
  }, [])
  const updateTransfer = useCallback((id: string, transfer: Partial<Transfer>) => {
    dispatch({ type: 'UPDATE_TRANSFER', payload: { id, transfer } })
  }, [])
  const deleteTransfer = useCallback((id: string) => dispatch({ type: 'DELETE_TRANSFER', payload: id }), [])

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_JOURNAL_ENTRY',
      payload: { ...entry, id: crypto.randomUUID(), createdAt: new Date() },
    })
  }, [])
  const updateJournalEntry = useCallback((id: string, entry: Partial<JournalEntry>) => {
    dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: { id, entry } })
  }, [])
  const deleteJournalEntry = useCallback((id: string) => dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: id }), [])

  // ─── Engine bridge ────────────────────────────────────────────────────────
  const stateRef = useRef(state)
  stateRef.current = state
  const execute = useCallback((command: EngineCommand, actor = 'demo-user'): Batch => {
    try {
      const batch = plan(stateRef.current, command, actor)
      dispatch({ type: 'APPLY_BATCH', payload: batch })
      return batch
    } catch (err) {
      if (err instanceof EngineError) {
        console.warn('[synex.engine]', err.code, err.message, err.context)
      }
      throw err
    }
  }, [])

  // Memoize so consumers don't re-render unless state actually changes
  const value = useMemo<SynexContextType>(
    () => ({
      state,
      dispatch,
      addAccount, updateAccount, deleteAccount,
      addBeneficiary, updateBeneficiary, deleteBeneficiary,
      addTransfer, updateTransfer, deleteTransfer,
      addJournalEntry, updateJournalEntry, deleteJournalEntry,
      saveToStorage, loadFromStorage,
      execute,
    }),
    [
      state,
      addAccount, updateAccount, deleteAccount,
      addBeneficiary, updateBeneficiary, deleteBeneficiary,
      addTransfer, updateTransfer, deleteTransfer,
      addJournalEntry, updateJournalEntry, deleteJournalEntry,
      saveToStorage, loadFromStorage, execute,
    ],
  )

  return <SynexContext.Provider value={value}>{children}</SynexContext.Provider>
}

export const useSynex = () => {
  const context = useContext(SynexContext)
  if (context === undefined) {
    throw new Error('useSynex must be used within a SynexProvider')
  }
  return context
}
