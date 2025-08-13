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
    <header className="sticky top-0 z-50 w-full border-b bg-white" style={{ height: "9rem" }}>
      <div className="flex items-center justify-between" style={{ height: "9rem", paddingRight: "0.71rem" }}>
        
        {/* ロゴ */}
        <a href="/" className="flex items-center" style={{ 
          position: "absolute",
          left: "0.71rem",
          top: "50%",
          transform: "translateY(-50%)"
        }}>
          <img src="/logo.png" alt="NOA CORPORATION" style={{ width: "20vw", height: "4.43rem", opacity: 1, transform: "rotate(0deg)" }} />
        </a>

        {/* PCナビゲーション */}
        <nav className="hidden md:flex items-center justify-center space-x-6" style={{ 
          position: "absolute",
          left: "calc(20vw + 2.85rem)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "37%", 
          height: "3.36rem" 
        }}>
          <a href="/" 
            style={{
              width: "3.43rem",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "#fff",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none"
            }}
          >
            HOME
          </a>
          <a href="/inventory"
            style={{
              width: "9.29rem",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "#fff",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none",
              gap: "0.29rem"
            }}
          >
            販売在庫一覧
            <svg width="1.71rem" height="1.71rem" viewBox="0 0 24 24" fill="none" style={{ opacity: 1 }} xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="/rental"
            style={{
              width: "6.86rem",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "#fff",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none"
            }}
          >
            レンタル車両
          </a>
          <a href="/purchase"
            style={{
              width: "6.86rem",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "#fff",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none"
            }}
          >
            買取はこちら
          </a>
          <a href="/about"
            style={{
              width: "8rem",
              height: "1.64rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.14rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "#fff",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              textDecoration: "none"
            }}
          >
            私たちについて
          </a>
        </nav>

        {/* 電話番号 */}
        <div className="hidden md:flex items-center justify-center"
          style={{
            position: "absolute",
            left: "calc(20vw + 2.85rem + 37% + 1rem)",
            top: "50%",
            transform: "translateY(-50%)",
            width: "11.46%",
            height: "3.36rem",
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
              width: "11.43rem",
              height: "2.07rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "1.43rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              background: "#fff",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.29rem",
              position: "relative"
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
              width: "13.57rem",
              height: "1rem",
              opacity: 1,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "0.86rem",
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

        {/* 問い合わせフォーム */}
        <form action="/contact" method="get" className="hidden md:flex items-center justify-center m-0 p-0" style={{ 
          position: "absolute",
          left: "calc(20vw + 2.85rem + 37% + 1rem + 11.46% + 2.85rem)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "14.44%", 
          height: "3.36rem" 
        }}>
          <div
            style={{
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
          position: "absolute",
          right: "0.71rem",
          top: "50%",
          transform: "translateY(-50%)",
          width: "8.4%",
          height: "4.41rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img
            src="/icon_up.png"
            alt="上アイコン"
            style={{
              width: "5rem",
              height: "2.91rem",
              objectFit: "cover",
              opacity: 1,
              marginBottom: "0.14rem"
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
              marginTop: "0.14rem"
            }}
          />
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