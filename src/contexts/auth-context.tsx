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
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const demoCredentials = {
      email: "demo@example.com",
      password: "demo123"
    }

    if (email === demoCredentials.email && password === demoCredentials.password) {
      const user: User = {
        id: "1",
        email: email,
        name: "Demo User",
        avatar: "/avatars/01.png"
      }
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(user))
      return true
    }
    return false
  }

  const signup = async (email: string, _password: string, name: string): Promise<boolean> => {
    const user: User = {
      id: Date.now().toString(),
      email: email,
      name: name,
      avatar: "/avatars/01.png"
    }
    setUser(user)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(user))
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
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
