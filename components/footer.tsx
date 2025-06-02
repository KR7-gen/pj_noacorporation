import Link from "next/link"

const footerLinks = {
  bodyTypes: [
    "クレーン",
    "ダンプ",
    "平ボディ",
    "重機運搬車",
    "ミキサー車",
    "アルミバン",
    "高所作業車",
    "アルミウィング",
    "キャリアカー",
    "塵芥車",
    "アームロール",
    "特装車・その他",
  ],
  makers: ["日野", "いすゞ", "三菱ふそう", "UD", "その他"],
  sizes: ["大型", "増トン", "中型", "小型"],
  pages: [
    { name: "販売在庫一覧", href: "/inventory" },
    { name: "トラック買取", href: "/purchase" },
    { name: "私たちについて", href: "/about" },
    { name: "お知らせ", href: "/news" },
    { name: "お問い合わせ", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Company Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <div className="w-8 h-8 bg-white rounded"></div>
            </div>
            <div>
              <div className="font-bold text-xl">ロゴ</div>
              <div className="text-sm text-gray-400">会社名</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <p>〒000-0000　住所テキスト</p>
            <p>TEL：000-000-0000</p>
          </div>
        </div>

        {/* Sitemap */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">サイトマップ</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Pages */}
            <div>
              <h4 className="font-medium mb-3">ページ</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.pages.map((page, index) => (
                  <li key={index}>
                    <Link href={page.href} className="text-gray-400 hover:text-white transition-colors">
                      ー　{page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Body Types */}
            <div>
              <h4 className="font-medium mb-3">ボディタイプで中古トラックを探す</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.bodyTypes.map((type, index) => (
                  <li key={index}>
                    <Link href="/inventory" className="text-gray-400 hover:text-white transition-colors">
                      ー　{type}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Makers */}
            <div>
              <h4 className="font-medium mb-3">メーカーで中古トラックを探す</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.makers.map((maker, index) => (
                  <li key={index}>
                    <Link href="/inventory" className="text-gray-400 hover:text-white transition-colors">
                      ー　{maker}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="font-medium mb-3">大きさで中古トラックを探す</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.sizes.map((size, index) => (
                  <li key={index}>
                    <Link href="/inventory" className="text-gray-400 hover:text-white transition-colors">
                      ー　{size}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 会社名. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
