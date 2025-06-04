"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

// モックデータ
const vehicles = Array(10).fill(null).map((_, i) => ({
  id: i + 1,
  managementNumber: `V${String(i + 1).padStart(5, '0')}`,
  maker: 'メーカー名',
  bodyType: 'ボディタイプ',
  size: '大きさ',
  price: 1000000 + (i * 100000),
  wholesalePrice: 900000 + (i * 90000),
  totalPayment: 1200000 + (i * 100000),
  expiryDate: '2024/12/31'
}))

// プルダウンの選択肢
const bodyTypes = [
  "クレーン",
  "ダンプ",
  "平ボディ",
  "車輌運搬車",
  "ミキサー車",
  "高所作業車",
  "アルミバン",
  "アルミウィング",
  "キャリアカー",
  "塵芥車",
  "アームロール",
  "バス",
  "冷蔵冷凍車",
  "タンクローリー",
  "特装車・その他"
]

const makers = [
  "日野",
  "いすゞ",
  "三菱ふそう",
  "UD",
  "その他"
]

const sizes = [
  "大型",
  "増トン",
  "中型",
  "小型"
]

export default function AdminVehiclesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">車両一覧</h1>
        <Link href="/admin/vehicles/new">
          <Button>新規車両登録</Button>
        </Link>
      </div>

      {/* 検索フォーム */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-4 gap-4">
          <select className="border rounded px-2 py-1">
            <option value="">ボディタイプ</option>
            {bodyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select className="border rounded px-2 py-1">
            <option value="">メーカー</option>
            {makers.map((maker) => (
              <option key={maker} value={maker}>{maker}</option>
            ))}
          </select>
          <select className="border rounded px-2 py-1">
            <option value="">大きさ</option>
            {sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="フリーワード"
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="mt-4 text-right">
          <Button>検索</Button>
        </div>
      </div>

      {/* 車両一覧テーブル */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">画像</th>
              <th className="px-4 py-3 text-left">管理番号</th>
              <th className="px-4 py-3 text-left">メーカー</th>
              <th className="px-4 py-3 text-left">ボディタイプ</th>
              <th className="px-4 py-3 text-left">大きさ</th>
              <th className="px-4 py-3 text-right">車両価格</th>
              <th className="px-4 py-3 text-right">業販価格</th>
              <th className="px-4 py-3 text-right">支払総額</th>
              <th className="px-4 py-3 text-left">車検有効期限</th>
              <th className="px-4 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-4 py-3">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-3">{vehicle.managementNumber}</td>
                <td className="px-4 py-3">{vehicle.maker}</td>
                <td className="px-4 py-3">{vehicle.bodyType}</td>
                <td className="px-4 py-3">{vehicle.size}</td>
                <td className="px-4 py-3 text-right">
                  {vehicle.price.toLocaleString()}円
                </td>
                <td className="px-4 py-3 text-right">
                  {vehicle.wholesalePrice.toLocaleString()}円
                </td>
                <td className="px-4 py-3 text-right">
                  {vehicle.totalPayment.toLocaleString()}円
                </td>
                <td className="px-4 py-3">{vehicle.expiryDate}</td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/vehicles/${vehicle.id}`}>
                    <Button variant="secondary" size="sm">
                      詳細
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ページネーション */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">前へ</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">4</Button>
            <Button variant="outline" size="sm">次へ</Button>
          </div>
        </div>
      </div>
    </div>
  )
} 