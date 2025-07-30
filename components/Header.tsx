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
          <Link href="/" className="flex items-center space-x-3">
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
          <nav className="flex items-center text-sm w-[27.25rem] h-6 gap-5 opacity-100">
            <Link href="/" className="hover:text-blue-600 transition-colors h-6 flex items-center">HOME</Link>
            <Link href="/inventory" className="hover:text-blue-600 transition-colors h-6 flex items-center">販売在庫一覧</Link>
            <Link href="/rental" className="hover:text-blue-600 transition-colors h-6 flex items-center">レンタル車両</Link>
            <Link href="/purchase" className="hover:text-blue-600 transition-colors h-6 flex items-center">買取はこちら</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors h-6 flex items-center">私たちについて</Link>
          </nav>

          {/* 電話番号とボタン */}
          <div className="flex items-center space-x-4 text-sm text-right">
            <div>
              <div className="font-bold text-lg">000-000-0000</div>
              <div className="text-gray-600">(受付時間)月〜土 00:00~00:00</div>
            </div>
            <Link href="/contact">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">お問い合わせフォームへ</Button>
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
              <div className="font-bold text-sm">000-000-0000</div>
            </div>
            <Link href="/contact">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-2 py-1">
                お問い合わせ
              </Button>
            </Link>
          </div>


        </div>
      </div>
    </header>
  )
}
