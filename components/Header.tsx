import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header 
      className="bg-white"
      style={{ 
        width: '1440px', 
        height: '126px', 
        opacity: 1,
        paddingTop: '32px',
        paddingRight: '8px',
        paddingBottom: '32px',
        paddingLeft: '8px',
        borderBottom: '1px solid #E6E6E6'
      }}
    >
      <div className="container mx-auto flex items-center" style={{ justifyContent: 'space-between' }}>
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
        <nav className="hidden md:flex items-center text-sm" style={{ width: '436px', height: '24px', gap: '20px', opacity: 1 }}>
          <Link href="/" className="hover:text-blue-600 transition-colors h-6 flex items-center">HOME</Link>
          <Link href="/inventory" className="hover:text-blue-600 transition-colors h-6 flex items-center">販売在庫一覧</Link>
          <Link href="/rental" className="hover:text-blue-600 transition-colors h-6 flex items-center">レンタル車両</Link>
          <Link href="/purchase" className="hover:text-blue-600 transition-colors h-6 flex items-center">買取はこちら</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors h-6 flex items-center">私たちについて</Link>
        </nav>

        {/* 電話番号とボタン */}
        <div className="hidden lg:flex items-center space-x-4 text-sm text-right">
          <div>
            <div className="font-bold text-lg">000-000-0000</div>
            <div className="text-gray-600">(受付時間)月〜土 00:00~00:00</div>
          </div>
          <Link href="/contact">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">お問い合わせフォームへ</Button>
          </Link>
        </div>

        {/* モバイルメニュー */}
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
