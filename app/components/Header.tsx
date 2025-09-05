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
       <div className="flex items-center justify-between" style={{ height: "9rem", padding: "0 1rem", margin: "0" }}>
        
        {/* ロゴ */}
         <a href="/" className="flex items-center" style={{ 
           margin: "0",
           flexShrink: 0
         }}>
           <img src="/logo.png" alt="NOA CORPORATION" style={{ width: "13vw", maxWidth: "200px", minWidth: "100px", height: "3.43rem", opacity: 1, transform: "rotate(0deg)", margin: "0" }} />
         </a>

        {/* PCナビゲーション */}
         <nav className="hidden lg:flex items-center justify-center" style={{ 
           height: "3.36rem",
           whiteSpace: "nowrap",
           overflow: "hidden",
           margin: "0",
           gap: "1.4rem",
           flexShrink: 0
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
         <div className="hidden lg:flex items-center justify-center flex-1 min-w-[100px] lg:flex-none"
           style={{
             minWidth: "14rem",
             height: "3.36rem",
             flexDirection: "column",
             alignItems: "center",
             background: "#fff",
             borderRadius: "4px",
             padding: "0 1rem",
             margin: "0",
             flexShrink: 0
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
              <img src="/call.svg" alt="電話" style={{ width: "1.29rem", height: "1.29rem" }} />
            </span>
           028-612-1472
          </div>
          <div
           style={{
             margin: "0",
             width: "12vw",
             maxWidth: "200px",
             minWidth: "140px",
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
           （受付時間）8:00~17:00<br/><span style={{ whiteSpace: "nowrap" }}>※店舗不在時には折り返しさせて頂きます。</span>
         </div>
        </div>

        {/* スマホ版電話番号（TEL + 電話記号） */}
        <div className="lg:hidden flex items-center justify-center">
          <a 
            href="tel:028-612-1472" 
            className="flex items-center justify-center px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              background: "#666666",
              color: "white",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem"
            }}
            aria-label="電話をかける"
          >
            <span className="mr-2">TEL</span>
            <img src="/call.svg" alt="電話" style={{ width: "1.25rem", height: "1.25rem", filter: "brightness(0) invert(1)" }} />
          </a>
        </div>

        {/* 問い合わせフォーム */}
        <form action="/contact" method="get" className="hidden lg:flex items-center justify-center m-0 p-0 flex-1 min-w-[100px] lg:flex-none" style={{ 
          height: "3.36rem",
          margin: "0",
          flexShrink: 0
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
            className="hidden lg:block"
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
              <span className="lg:hidden flex items-center">
                <span className="mr-2">MAIL</span>
                <img src="/mail.svg" alt="メール" style={{ width: "1.25rem", height: "1.25rem", filter: "brightness(0) invert(1)" }} />
              </span>
              <span className="hidden lg:inline">お問い合わせフォームへ</span>
            </button>
          </div>
        </form>

        {/* スマホ版問い合わせフォーム（MAIL + メール記号） */}
        <div className="lg:hidden flex items-center justify-center">
          <a 
            href="/contact" 
            className="flex items-center justify-center px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
              color: "white",
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem"
            }}
            aria-label="お問い合わせ"
          >
            <span className="mr-2">MAIL</span>
            <img src="/mail.svg" alt="メール" style={{ width: "1.25rem", height: "1.25rem", filter: "brightness(0) invert(1)" }} />
          </a>
        </div>

        {/* アイコン */}
        <div className="hidden md:block" style={{
          height: "4.41rem",
          margin: "0",
          flexShrink: 0
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
         <div className="lg:hidden flex items-center" style={{ margin: "0" }}>
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
            <div className="bg-white shadow-lg p-6 flex flex-col" style={{ width: "100%", height: "1200px", overflow: "hidden" }}>
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