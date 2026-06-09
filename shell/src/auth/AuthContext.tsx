import React, { createContext, useContext, useState, useCallback } from 'react'

export interface User {
  ra: string
  nome: string
  curso: string
  semestre: string
  email: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  login: (ra: string, senha: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'uniportal_token'
const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000'

function decodeJwtPayload(token: string): User | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const payload = JSON.parse(new TextDecoder().decode(bytes))
    if (!payload.ra || !payload.nome) return null
    return {
      ra: payload.ra,
      nome: payload.nome,
      curso: payload.curso ?? '',
      semestre: payload.semestre ?? '',
      email: payload.email ?? '',
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem(STORAGE_KEY)
    return t ? decodeJwtPayload(t) : null
  })

  const login = useCallback(async (ra: string, senha: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ra: ra.trim(), senha }),
      })
      if (!res.ok) return false
      const { token: t } = (await res.json()) as { token: string }
      const u = decodeJwtPayload(t)
      if (!u) return false
      localStorage.setItem(STORAGE_KEY, t)
      setToken(t)
      setUser(u)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
