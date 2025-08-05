"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const sidebarItems = [
  { name: "車両管理", path: "/admin/vehicles" },
  { name: "店舗管理", path: "/admin/stores" },
  { name: "お問い合わせ管理", path: "/admin/inquiries" },
  { name: "お知らせ管理", path: "/admin/news" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
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
              </nav>
            </div>
            {/* 背景クリックで閉じる */}
            <div className="flex-1" onClick={handleSidebarClose} />
          </div>
        )}
      </div>
    )
  } 