"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault()
    const form = document.createElement('form')
    form.method = 'get'
    form.action = '/contact'
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center">
            <span className="text-lg font-bold">NOA CORPORATION</span>
            <span className="ml-2 text-sm text-gray-500">株式会社ノアコーポレーション</span>
          </a>
        </div>
        {/* PCナビゲーション */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">HOME</a>
            <a href="/inventory" className="text-sm font-medium text-gray-600 hover:text-gray-900">販売在庫一覧</a>
            <a href="/purchase" className="text-sm font-medium text-gray-600 hover:text-gray-900">買取はこちら</a>
            <a href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">私たちについて</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-base font-bold text-gray-900">000-000-0000</div>
              <div className="text-xs text-gray-500">(受付時間) 月〜土 00:00-00:00</div>
            </div>
            <form action="/contact" method="get" className="m-0 p-0">
              <button 
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#4169E1] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3154B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1] transition-colors duration-200"
              >
                お問い合わせフォームへ
              </button>
            </form>
          </div>
        </div>
        {/* スマホ・タブレット用ハンバーガー */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMenuOpen(true)}
            aria-label="メニューを開く"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        {/* ドロワーメニュー */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
            <div className="w-4/5 max-w-xs bg-white h-full shadow-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold">NOA CORPORATION</span>
                <button
                  className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setMenuOpen(false)}
                  aria-label="メニューを閉じる"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                <Link href="/" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>HOME</Link>
                <Link href="/inventory" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>販売在庫一覧</Link>
                <Link href="/purchase" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>買取はこちら</Link>
                <Link href="/about" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>私たちについて</Link>
                <Link href="/contact" className="text-base font-medium text-white bg-[#4169E1] rounded px-4 py-2 text-center hover:bg-[#3154B3] transition-colors duration-200" onClick={() => setMenuOpen(false)}>
                  お問い合わせフォームへ
                </Link>
              </nav>
              <div className="mt-auto pt-8 border-t">
                <div className="text-base font-bold text-gray-900">000-000-0000</div>
                <div className="text-xs text-gray-500">(受付時間) 月〜土 00:00-00:00</div>
              </div>
            </div>
            {/* 背景クリックで閉じる */}
            <div className="flex-1" onClick={() => setMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  )
} 