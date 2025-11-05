import Link from "next/link"

const footerLinks = {
  bodyTypes: [
    // 指定の並び順・名称に統一
    "クレーン",
    "ダンプ・ローダーダンプ",
    "ミキサー車",
    "アームロール",
    "重機回送車・セルフクレーン",
    "キャリアカー・車両運搬車",
    "高所作業車",
    "塵芥車",
    "平ボディ",
    "バン・ウイング",
    "冷蔵冷凍車",
    "特装車・その他",
  ],
  makers: ["日野", "いすゞ", "三菱ふそう", "UD", "トヨタ", "日産", "マツダ", "その他"],
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
      <div className="px-4 py-12" style={{ width: '83%', margin: '0 auto' }}>
        {/* Company Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-22 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="Noa Corporation Logo" className="object-contain h-10 w-auto lg:h-16" />
            </div>
          </div>
        </div>

        {/* Sitemap */}
        <div className="mb-8">
          {/* スマホ: 縦並び、各セクションは2列、PC: 横並び4カラム */}
          <div className="flex flex-col gap-8 md:flex-row md:justify-between md:flex-nowrap">
            {/* Pages */}
            <div className="w-full md:w-[21.66%]">
              <h4 className="font-medium mb-3 border-b border-white pb-1">サイトマップ</h4>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 text-sm">
                {footerLinks.pages.map((page, index) => (
                  <li key={index}>
                    <Link href={page.href} className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                      ー　{page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Body Types */}
            <div className="w-full md:w-[22.66%]">
              <h4 className="font-medium mb-3 border-b border-white pb-1">ボディタイプで中古トラックを探す</h4>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 text-sm">
                {footerLinks.bodyTypes.map((type, index) => (
                  <li key={index} className={
                    type === "重機回送車・セルフクレーン" || type === "キャリアカー・車両運搬車" 
                      ? "md:min-h-0 min-h-[3rem]" 
                      : ""
                  }>
                    <Link 
                      href={`/inventory?type=${encodeURIComponent(type)}#type-icons`}
                      className={`text-gray-400 hover:text-white transition-colors ${
                        type === "重機回送車・セルフクレーン" || type === "キャリアカー・車両運搬車"
                          ? "md:whitespace-nowrap whitespace-pre-line" 
                          : "whitespace-nowrap"
                      }`}
                    >
                      {type === "重機回送車・セルフクレーン" 
                        ? (
                          <>
                            <span className="hidden md:inline">ー　重機回送車・セルフクレーン</span>
                            <span className="md:hidden">ー　重機回送車・{'\n'}　　セルフクレーン</span>
                          </>
                        )
                        : type === "キャリアカー・車両運搬車"
                        ? (
                          <>
                            <span className="hidden md:inline">ー　キャリアカー・車両運搬車</span>
                            <span className="md:hidden">ー　キャリアカー・{'\n'}　　車両運搬車</span>
                          </>
                        )
                        : `ー　${type}`
                      }
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Makers */}
            <div className="w-full md:w-[21.66%]">
              <h4 className="font-medium mb-3 border-b border-white pb-1">メーカーで中古トラックを探す</h4>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 text-sm">
                {footerLinks.makers.map((maker, index) => (
                  <li key={index}>
                    <Link 
                      href={`/inventory?maker=${encodeURIComponent(maker)}#type-icons`}
                      className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
                    >
                      ー　{maker}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            <div className="w-full md:w-[21.66%]">
              <h4 className="font-medium mb-3 border-b border-white pb-1">大きさで中古トラックを探す</h4>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 text-sm">
                {footerLinks.sizes.map((size, index) => (
                  <li key={index}>
                    <Link 
                      href={`/inventory?size=${encodeURIComponent(size)}#type-icons`}
                      className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
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
          <p>&copy; 株式会社Noa Corporation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
