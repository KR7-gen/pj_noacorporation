import Link from "next/link"

const footerLinks = {
  bodyTypes: [
    // 指定の並び順・名称に統一
    "クレーン",
    "ダンプ・ローダーダンプ",
    "ミキサー車",
    "アームロール",
    "重機回送車",
    "車両運搬車",
    "高所作業車",
    "塵芥車",
    "平ボディ",
    "バン・ウイング",
    "冷蔵冷凍車",
    "特装車・その他",
  ],
  makers: ["日野", "いすゞ", "三菱ふそう", "UD", "その他"],
  sizes: ["大型", "増トン", "中型", "小型"],
  pages: [
    { name: "販売在庫一覧", href: "/inventory" },
    { name: "レンタル車両", href: "/rental" },
    { name: "トラック買取", href: "/purchase" },
    { name: "私たちについて", href: "/about" },
    { name: "お問い合わせ", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-4 py-12" style={{ width: '83%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Company Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-22 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="Noa Corporation Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Sitemap */}
        <div className="mb-8">
          <div className="flex justify-between flex-nowrap overflow-x-auto">
            {/* Pages */}
            <div style={{ width: '21.66%' }}>
              <h4 className="font-medium mb-3 border-b border-white pb-1">サイトマップ</h4>
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
            <div style={{ width: '22.66%' }}>
              <h4 className="font-medium mb-3 border-b border-white pb-1">ボディタイプで中古トラックを探す</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.bodyTypes.map((type, index) => (
                  <li key={index}>
                    <Link 
                      href={`/inventory?type=${encodeURIComponent(type)}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ー　{type}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Makers */}
            <div style={{ width: '21.66%' }}>
              <h4 className="font-medium mb-3 border-b border-white pb-1">メーカーで中古トラックを探す</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.makers.map((maker, index) => (
                  <li key={index}>
                    <Link 
                      href={`/inventory?maker=${encodeURIComponent(maker)}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ー　{maker}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            <div style={{ width: '21.66%'}}>
              <h4 className="font-medium mb-3 border-b border-white pb-1">大きさで中古トラックを探す</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.sizes.map((size, index) => (
                  <li key={index}>
                    <Link 
                      href={`/inventory?size=${encodeURIComponent(size)}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
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
