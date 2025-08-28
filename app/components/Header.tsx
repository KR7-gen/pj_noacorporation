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
    <header className="sticky top-0 z-50 w-full border-b bg-white" style={{ height: "9rem", margin: "0" }}>
      <div className="flex items-center md:grid md:grid-cols-[auto_1fr_auto_auto_auto] md:items-center md:gap-x-4 lg:gap-x-6 xl:gap-x-8" style={{ height: "9rem", padding: "0 1rem", margin: "0" }}>
        
        {/* ロゴ */}
        <a href="/" className="flex items-center" style={{ 
          margin: "0"
        }}>
          <img src="/logo.png" alt="NOA CORPORATION" style={{ width: "13vw", height: "4.43rem", opacity: 1, transform: "rotate(0deg)", margin: "0" }} />
        </a>

        {/* PCナビゲーション */}
        <nav className="hidden md:flex items-center justify-center" style={{ 
          width: "100%", 
          height: "3.36rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          margin: "0",
          gap: "1.4rem"
        }}>
          <a href="/" 
            style={{
              margin: "0",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "transparent",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            HOME
          </a>
          <a href="/inventory"
            style={{
              margin: "0",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "transparent",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none",
              gap: "0.29rem",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            販売在庫一覧
          </a>
          <a href="/rental"
            style={{
              margin: "0",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "transparent",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            レンタル車両
          </a>
          <a href="/purchase"
            style={{
              margin: "0",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "transparent",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            買取はこちら
          </a>
          <a href="/about"
            style={{
              margin: "0",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "transparent",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            私たちについて
          </a>
        </nav>

        {/* 電話番号 */}
        <div className="hidden md:flex items-center justify-center"
          style={{
            width: "100%",
            minWidth: "14rem",
            height: "3.36rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fff",
            borderRadius: "4px",
            padding: "0 1rem",
            margin: "0"
          }}
        >
          <div
            style={{
              margin: "0",
              width: "auto",
              minWidth: "13rem",
              height: "2.07rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.43rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "transparent",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              position: "relative",
              whiteSpace: "nowrap"
            }}
          >
                         <span style={{ display: "flex", alignItems: "center", marginRight: "0.57rem", position: "relative", top: "0.21rem", left: "0.21rem" }}>
              <svg width="1.29rem" height="1.29rem" viewBox="0 0 24 24" fill="none" style={{ background: "#fff", opacity: 1 }} xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            028-612-1472
          </div>
          <div
            style={{
              margin: "0",
              width: "14vw",
              height: "1rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "0.86rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "transparent",
              color: "#1a1a1a",
              textAlign: "center"
            }}
          >
            （受付時間）8:00~17:00<br/>※店舗不在時には折り返しさせて頂きます。
          </div>
        </div>

        {/* 問い合わせフォーム */}
        <form action="/contact" method="get" className="hidden md:flex items-center justify-center m-0 p-0" style={{ 
          width: "100%", 
          height: "3.36rem",
          margin: "0" 
        }}>
          <div
            style={{
              margin: "0",
              width: "100%",
              height: "3.36rem",
              opacity: 1,
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
                margin: "0",
                width: "100%",
                height: "1.64rem",
                opacity: 1,
                fontFamily: "Noto Sans JP, sans-serif",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "1.14rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#fff",
                border: "none",
                borderRadius: "0.29rem",
                cursor: "pointer",
                background: "transparent"
              }}
            >
              お問い合わせフォームへ
            </button>
          </div>
        </form>

        {/* アイコン */}
        <div className="hidden md:flex items-center justify-center" style={{
          width: "100%",
          height: "4.41rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0"
        }}>
          <img
            src="/icon_up.png"
            alt="上アイコン"
            style={{
              width: "5rem",
              height: "2.91rem",
              objectFit: "cover",
              opacity: 1,
              margin: "0"
            }}
          />
          <img
            src="/icon_down.png"
            alt="下アイコン"
            style={{
              width: "8.64rem",
              height: "1.5rem",
              objectFit: "cover",
              opacity: 1,
              margin: "0"
            }}
          />
        </div>

        {/* スマホ・タブレット用ハンバーガー */}
        <div className="md:hidden flex items-center" style={{ margin: "0" }}>
          <button
            type="button"
            className="p-2 rounded bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-300 cursor-pointer"
            onClick={handleMenuClick}
            style={{ margin: "0" }}
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