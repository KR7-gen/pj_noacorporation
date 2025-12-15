"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { AuthProvider, useAuth } from "./auth-context"

const sidebarItems = [
  { name: "車両管理", path: "/admin/vehicles" },
  { name: "店舗管理", path: "/admin/stores" },
  { name: "お問い合わせ管理", path: "/admin/inquiries" },
]

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, login, logout } = useAuth()

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
  }

  // 未認証の場合はログイン画面を直接表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              管理者ログイン
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const email = formData.get('email') as string
            const password = formData.get('password') as string
            const success = await login(email, password)
            if (!success) {
              alert('メールアドレスまたはパスワードが正しくありません')
            }
          }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレス"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ログイン
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-white overflow-x-hidden">
        <div className="flex">
          {/* PC用サイドバー */}
          <aside className="hidden md:block w-64 min-h-screen bg-white shadow-sm flex-shrink-0">
            <nav className="p-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">管理画面</h2>
              </div>
              
              <ul className="space-y-2">
                {sidebarItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`block px-4 py-2 rounded-lg ${
                        pathname === item.path
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  ログアウト
                </button>
              </div>
            </nav>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 p-4 md:p-8 min-w-0">
            {/* スマホ用ヘッダー */}
            <div className="md:hidden flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold">管理画面</h1>
              <button
                onClick={handleSidebarToggle}
                className="p-2 rounded bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Menu className="w-6 h-6 text-blue-600" />
              </button>
            </div>

            <div className="w-full">
              {children}
            </div>
          </main>
        </div>

        {/* スマホ用ドロワーサイドバー */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
            <div className="w-4/5 max-w-xs bg-white h-full shadow-lg flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">管理画面</h2>
                <button
                  onClick={handleSidebarClose}
                  className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="flex-1 p-4">
                <div className="mb-6">
                </div>
                
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`block px-4 py-3 rounded-lg ${
                          pathname === item.path
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={handleSidebarClose}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    ログアウト
                  </button>
                </div>
              </nav>
            </div>
            {/* 背景クリックで閉じる */}
            <div className="flex-1" onClick={handleSidebarClose} />
          </div>
        )}
      </div>
    )
  }

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
} 