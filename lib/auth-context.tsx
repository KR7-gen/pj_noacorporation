'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  // 開発中は一時的に認証なしでアクセス可能
  useEffect(() => {
    // ローカルストレージから認証状態を復元
    const authStatus = localStorage.getItem('admin-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 開発中は簡易認証（後でFirebase認証に変更）
      if (email === 'admin@example.com' && password === 'pj_noacorporation') {
        setIsAuthenticated(true)
        localStorage.setItem('admin-auth', 'true')
        return true
      }
      return false
    } catch (error) {
      console.error('ログインエラー:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsAuthenticated(false)
      localStorage.removeItem('admin-auth')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
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