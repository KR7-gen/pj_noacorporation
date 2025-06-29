'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ページ読み込み時にローカルストレージから認証状態を復元
  useEffect(() => {
    const authStatus = localStorage.getItem('admin-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // ハードコードされた認証情報
    if (email === 'admin@example.com' && password === 'pj_noacorporation') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 