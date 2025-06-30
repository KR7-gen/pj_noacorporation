"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// モックデータ
const vehicles = Array(10).fill(null).map((_, i) => ({
  id: i + 1,
  managementNumber: `V${String(i + 1).padStart(5, '0')}`,
  maker: ['いすゞ', '日野', '三菱ふそう', 'UD'][i % 4],
  bodyType: ['クレーン', 'ダンプ', '平ボディ', '冷蔵冷凍車'][i % 4],
  size: ['大型', '中型', '小型'][i % 3],
  price: 1000000 + (i * 100000),
  wholesalePrice: 900000 + (i * 90000),
  totalPayment: 1200000 + (i * 100000),
  expiryDate: '2024/12/31',
  imageUrl: '/placeholder.jpg' // 実際の画像パスに置き換える
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
  // 検索条件の状態管理
  const [searchParams, setSearchParams] = useState({
    bodyType: "",
    maker: "",
    size: "",
    keyword: ""
  });

  // 検索条件に基づいてフィルタリングを行う
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesBodyType = !searchParams.bodyType || vehicle.bodyType === searchParams.bodyType;
    const matchesMaker = !searchParams.maker || vehicle.maker === searchParams.maker;
    const matchesSize = !searchParams.size || vehicle.size === searchParams.size;
    const matchesKeyword = !searchParams.keyword || 
      Object.values(vehicle).some(value => 
        String(value).toLowerCase().includes(searchParams.keyword.toLowerCase())
      );

    return matchesBodyType && matchesMaker && matchesSize && matchesKeyword;
  });

  // 検索条件の更新ハンドラー
  const handleSearch = () => {
    console.log('Searching with params:', searchParams);
  };

  // 検索フォームの入力ハンドラー
  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">車両一覧</h1>
        <Link href="/admin/vehicles/new">
          <Button className="w-full sm:w-auto">新規車両登録</Button>
        </Link>
      </div>

      {/* 検索フォーム */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select 
            className="border rounded px-2 py-1 w-full"
            value={searchParams.bodyType}
            onChange={(e) => handleInputChange('bodyType', e.target.value)}
          >
            <option value="">ボディタイプ</option>
            {bodyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select 
            className="border rounded px-2 py-1 w-full"
            value={searchParams.maker}
            onChange={(e) => handleInputChange('maker', e.target.value)}
          >
            <option value="">メーカー</option>
            {makers.map((maker) => (
              <option key={maker} value={maker}>{maker}</option>
            ))}
          </select>
          <select 
            className="border rounded px-2 py-1 w-full"
            value={searchParams.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
          >
            <option value="">大きさ</option>
            {sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="フリーワード"
            className="border rounded px-2 py-1 w-full"
            value={searchParams.keyword}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
          />
        </div>
        <div className="mt-4 text-right">
          <Button onClick={handleSearch} className="w-full sm:w-auto">検索</Button>
        </div>
      </div>

      {/* 車両一覧テーブル */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* PC用テーブル */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">画像</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">管理番号</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">メーカー</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">ボディタイプ</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">大きさ</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">車両価格</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">業販価格</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">支払総額</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">車検有効期限</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-gray-200">
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
                      <div className="flex gap-2 justify-center">
                        <Link href={`/admin/vehicles/${vehicle.id}`}>
                          <Button variant="secondary" size="sm">
                            詳細
                          </Button>
                        </Link>
                        <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                          <Button variant="outline" size="sm">
                            編集
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* スマホ用カード表示 */}
        <div className="md:hidden">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="border-b border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{vehicle.managementNumber}</h3>
                    <span className="text-sm text-gray-500 flex-shrink-0">{vehicle.size}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="truncate">メーカー: {vehicle.maker}</p>
                    <p className="truncate">ボディタイプ: {vehicle.bodyType}</p>
                    <p className="truncate">車両価格: {vehicle.price.toLocaleString()}円</p>
                    <p className="truncate">業販価格: {vehicle.wholesalePrice.toLocaleString()}円</p>
                    <p className="truncate">支払総額: {vehicle.totalPayment.toLocaleString()}円</p>
                    <p className="truncate">車検有効期限: {vehicle.expiryDate}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/admin/vehicles/${vehicle.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        詳細
                      </Button>
                    </Link>
                    <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        編集
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 