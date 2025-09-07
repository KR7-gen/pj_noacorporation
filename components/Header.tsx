import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header 
      className="bg-white w-full min-h-[7.875rem] opacity-100 pt-8 pr-2 pb-8 pl-2 border-b border-gray-200"
    >
      <div className="container mx-auto">
        {/* デスクトップレイアウト */}
        <div className="hidden md:flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <img
              src="/logo.png"
              alt="NOA CORPORATION"
              className="h-10"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-logo.png";
              }}
            />
            <div className="text-sm text-gray-600">株式会社ノアコーポレーション</div>
          </Link>

          {/* ナビゲーション */}
          <nav className="flex items-center text-sm gap-5 mx-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">HOME</Link>
            <Link href="/inventory" className="hover:text-blue-600 transition-colors whitespace-nowrap">販売在庫一覧</Link>
            <Link href="/rental" className="hover:text-blue-600 transition-colors whitespace-nowrap">レンタル車両</Link>
            <Link href="/purchase" className="hover:text-blue-600 transition-colors whitespace-nowrap">買取はこちら</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors whitespace-nowrap">私たちについて</Link>
          </nav>

          {/* 電話番号とボタン */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div className="flex flex-col">
                <div className="font-bold text-xl whitespace-nowrap">028-612-1474</div>
                <div className="text-gray-600 text-xs whitespace-nowrap">(受付時間) 年中無休 09:00-17:00</div>
              </div>
            </div>
            <Link href="/contact">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap px-4">お問い合わせフォームへ</Button>
            </Link>
          </div>
        </div>

        {/* モバイルレイアウト */}
        <div className="md:hidden flex items-center justify-between">
          {/* ロゴ（短縮版） */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="NOA CORPORATION"
              className="h-8"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-logo.png";
              }}
            />
            <div className="text-xs text-gray-600">株式会社ノア</div>
          </Link>

          {/* 電話番号とボタン（モバイル用） */}
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="font-bold text-sm whitespace-nowrap">028-612-1474</div>
            </div>
            <Link href="/contact">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-2 py-1 whitespace-nowrap">
                お問い合わせ
              </Button>
            </Link>
          </div>


        </div>
      </div>
    </header>
  )
}
