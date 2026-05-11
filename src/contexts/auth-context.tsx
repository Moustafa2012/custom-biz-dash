"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_KEY = "auth_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours

// Demo credentials are sourced from build-time env vars (never hardcoded).
// In production these MUST be replaced by a real backend auth endpoint.
const DEMO_EMAIL = (import.meta.env.VITE_DEMO_EMAIL as string | undefined)?.toLowerCase()
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined

// Simple non-cryptographic signature for tamper-evidence on local sessions.
// This does NOT replace server-side auth — it only makes casual localStorage
// tampering ineffective for the demo. Real apps must verify with a backend.
async function sign(payload: string): Promise<string> {
  const data = new TextEncoder().encode(payload + "|" + (import.meta.env.VITE_SESSION_SALT ?? "lovable-demo"))
  const buf = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
}

async function readSession(): Promise<User | null> {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { user: User; exp: number; sig: string }
    if (!parsed?.user || !parsed?.exp || !parsed?.sig) return null
    if (Date.now() > parsed.exp) return null
    const expected = await sign(JSON.stringify(parsed.user) + parsed.exp)
    if (expected !== parsed.sig) return null
    return parsed.user
  } catch {
    return null
  }
}

async function writeSession(user: User) {
  const exp = Date.now() + SESSION_TTL_MS
  const sig = await sign(JSON.stringify(user) + exp)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, exp, sig }))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem("user") // legacy
}

function validatePassword(pw: string): boolean {
  return typeof pw === "string" && pw.length >= 8
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    readSession().then((u) => {
      if (!active) return
      if (u) {
        setUser(u)
        setIsAuthenticated(true)
      } else {
        clearSession()
      }
      setIsLoading(false)
    })
    return () => { active = false }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Don't enforce length policy on login — only on signup. Otherwise valid
    // existing accounts (including the demo) cannot sign in.
    if (!validateEmail(email) || typeof password !== "string" || password.length === 0) return false

    if (
      DEMO_EMAIL &&
      DEMO_PASSWORD &&
      email.toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      const u: User = {
        id: "1",
        email: email.toLowerCase(),
        name: "Demo User",
        avatar: "/avatars/01.png",
      }
      await writeSession(u)
      setUser(u)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Without a real backend we cannot persist new accounts. Refuse rather
    // than mint a session for any email/password pair (previous behaviour
    // was a complete auth bypass).
    if (!validateEmail(email) || !validatePassword(password) || !name?.trim()) {
      return false
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
