import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-bold">会社情報</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  会社概要
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">在庫情報</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/inventory"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  在庫一覧
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">お問い合わせ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  お知らせ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">NOA CORPORATION</h3>
            <p className="text-sm text-gray-600">
              〒123-4567<br />
              千葉県千葉市中央区1-2-3<br />
              TEL: 043-123-4567<br />
              営業時間: 9:00-18:00
            </p>
          </div>
        </div>
        <div className="text-center text-sm text-gray-600">
          © 2024 NOA CORPORATION. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 