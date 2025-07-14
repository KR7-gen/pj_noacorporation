"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuClick = () => {
    console.log("ハンバーガーメニューがクリックされました")
    setMenuOpen(true)
  }

  const handleCloseMenu = () => {
    console.log("メニューを閉じます")
    setMenuOpen(false)
  }

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
            <img src="/logo.png" alt="NOA CORPORATION" style={{ width: "300px", height: "62px", opacity: 1, transform: "rotate(0deg)" }} />
          </a>
        </div>
        {/* PCナビゲーション */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center space-x-6">
            <a href="/" 
              style={{
                width: "48px",
                height: "23px",
                opacity: 1,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                background: "#fff",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                textDecoration: "none"
              }}
            >
              HOME
            </a>
            <a href="/inventory"
              style={{
                width: "130px",
                height: "23px",
                opacity: 1,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                background: "#fff",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                textDecoration: "none",
                gap: "4px"
              }}
            >
              販売在庫一覧
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 1 }} xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/rental"
              style={{
                width: "96px",
                height: "23px",
                opacity: 1,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                background: "#fff",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                textDecoration: "none"
              }}
            >
              レンタル車両
            </a>
            <a href="/purchase"
              style={{
                width: "96px",
                height: "23px",
                opacity: 1,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                background: "#fff",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                textDecoration: "none"
              }}
            >
              買取はこちら
            </a>
            <a href="/about"
              style={{
                width: "112px",
                height: "23px",
                opacity: 1,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                background: "#fff",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                textDecoration: "none"
              }}
            >
              私たちについて
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#fff",
                borderRadius: "4px",
                padding: "0"
              }}
            >
              <div
                style={{
                  width: "160px",
                  height: "29px",
                  opacity: 1,
                  fontFamily: "Noto Sans JP, sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "20px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  background: "#fff",
                  color: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  position: "relative"
                }}
              >
                <span style={{ display: "flex", alignItems: "center", marginRight: "8px", position: "relative", top: "3px", left: "3px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ background: "#fff", opacity: 1 }} xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                028-612-1472
              </div>
              <div
                style={{
                  width: "190px",
                  height: "14px",
                  opacity: 1,
                  fontFamily: "Noto Sans JP, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "12px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  background: "#fff",
                  color: "#1a1a1a",
                  textAlign: "center"
                }}
              >
                （受付時間）年中無休 09:00~17:00
              </div>
            </div>
            <form action="/contact" method="get" className="m-0 p-0">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* お問い合わせフォームボタン（青い枠） */}
                <div
                  style={{
                    width: "208px",
                    height: "47px",
                    opacity: 1,
                    paddingTop: "12px",
                    paddingRight: "16px",
                    paddingBottom: "12px",
                    paddingLeft: "16px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
              <button 
                type="submit"
                    style={{
                      width: "176px",
                      height: "23px",
                      opacity: 1,
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      background: "transparent"
                    }}
              >
                お問い合わせフォームへ
              </button>
                </div>
                {/* アイコン2つを縦並びで独立配置 */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "47px"
                }}>
                  <img
                    src="/icon_up.png"
                    alt="上アイコン"
                    style={{
                      width: "70px",
                      height: "40.77px",
                      objectFit: "cover",
                      opacity: 1,
                      marginBottom: "2px"
                    }}
                  />
                  <img
                    src="/icon_down.png"
                    alt="下アイコン"
                    style={{
                      width: "121px",
                      height: "21px",
                      objectFit: "cover",
                      opacity: 1,
                      marginTop: "2px"
                    }}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* スマホ・タブレット用ハンバーガー */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="p-2 rounded bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-300 cursor-pointer"
            onClick={handleMenuClick}
            aria-label="メニューを開く"
          >
            <Menu className="w-6 h-6 text-blue-600" />
          </button>
        </div>
        {/* ドロワーメニュー */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
            <div className="w-4/5 max-w-xs bg-white h-full shadow-lg p-6 flex flex-col justify-center">
              <div className="flex items-center justify-end mb-8">
                <button
                  type="button"
                  className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleCloseMenu}
                  aria-label="メニューを閉じる"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                <Link href="/inventory" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={handleCloseMenu}>販売在庫一覧</Link>
                <Link href="/rental" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={handleCloseMenu}>レンタル車両</Link>
                <Link href="/purchase" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={handleCloseMenu}>買取はこちら</Link>
                <Link href="/about" className="text-base font-medium text-gray-700 hover:text-blue-600" onClick={handleCloseMenu}>私たちについて</Link>
                <Link href="/contact" className="text-base font-medium text-white bg-[#4169E1] rounded px-4 py-2 text-center hover:bg-[#3154B3] transition-colors duration-200" onClick={handleCloseMenu}>
                  お問い合わせフォームへ
                </Link>
              </nav>
            </div>
            {/* 背景クリックで閉じる */}
            <div className="flex-1" onClick={handleCloseMenu} />
          </div>
        )}
      </div>
    </header>
  )
} 