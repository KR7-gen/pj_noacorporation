'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import CsvUploader from "@/components/CsvUploader"

export default function VehicleImportPage() {
  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/vehicles">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">車両CSV一括インポート</h1>
      </div>

      {/* 説明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">CSVインポートについて</h2>
        <p className="text-blue-800 mb-3">
          顧客から提供された車両データのCSVファイルをアップロードして、一括で車両情報を登録できます。
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <a 
            href="/vehicle-template.csv" 
            download
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 text-sm"
          >
            <Download className="w-4 h-4" />
            CSVテンプレートをダウンロード
          </a>
        </div>
      </div>

      {/* CSVアップロード機能 */}
      <div className="mb-6">
        <CsvUploader />
      </div>

      {/* 注意事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">注意事項</h3>
        <ul className="text-yellow-800 space-y-1 text-sm">
          <li>• CSVファイルはUTF-8エンコーディングで保存してください</li>
          <li>• 管理番号とメーカーは必須項目です</li>
          <li>• 価格は数値のみ入力してください（カンマや円マークは自動除去されます）</li>
          <li>• ファイルサイズは10MB以下にしてください</li>
          <li>• エラーが発生した行はスキップされ、処理は継続されます</li>
          <li>• アップロード後、車両一覧で登録内容を確認してください</li>
        </ul>
      </div>

      {/* 操作ボタン */}
      <div className="flex justify-center mt-8">
        <Link href="/admin/vehicles">
          <Button variant="outline">
            車両一覧に戻る
          </Button>
        </Link>
      </div>
    </div>
  )
} 