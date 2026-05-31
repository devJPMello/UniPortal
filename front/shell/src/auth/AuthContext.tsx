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
  login: (ra: string, senha: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'uniportal_token'

const MOCK_USER: User = {
  ra: '2024001',
  nome: 'João Pedro Mello',
  curso: 'Ciência da Computação',
  semestre: '4º Semestre',
  email: 'joao.mello@uni.edu.br',
}

function encodeToken(user: User): string {
  return btoa(JSON.stringify(user))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem(STORAGE_KEY)
    if (!t) return null
    try { return JSON.parse(atob(t)) as User } catch { return null }
  })
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY)
  )

  const login = useCallback((ra: string, _senha: string): boolean => {
    if (!ra.trim()) return false
    const u = { ...MOCK_USER, ra }
    const t = encodeToken(u)
    localStorage.setItem(STORAGE_KEY, t)
    setUser(u)
    setToken(t)
    return true
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
