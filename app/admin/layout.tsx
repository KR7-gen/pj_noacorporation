"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold">
                  NOA CORPORATION
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white shadow-sm">
          <nav className="p-4">
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
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 