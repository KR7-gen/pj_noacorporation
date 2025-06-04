"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

// モックデータ
const stores = Array(6).fill(null).map((_, i) => ({
  id: i + 1,
  name: "店舗名",
  address: "住所",
  phone: "000-000-0000",
  businessHours: "月〜金 00:00~00:00"
}))

export default function StoresPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">店舗一覧</h1>
        <Link href="/admin/stores/new">
          <Button className="bg-gray-600 hover:bg-gray-700 text-white">
            新規店舗登録
          </Button>
        </Link>
      </div>

      {/* 検索フォーム */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="キーワード検索"
            className="flex-1 border rounded px-2 py-1"
          />
          <Button className="bg-gray-600 hover:bg-gray-700 text-white">
            検索
          </Button>
        </div>
      </div>

      {/* 店舗一覧テーブル */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">店舗名</th>
              <th className="px-4 py-3 text-left">住所</th>
              <th className="px-4 py-3 text-left">電話番号</th>
              <th className="px-4 py-3 text-left">営業時間</th>
              <th className="px-4 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="px-4 py-3">{store.name}</td>
                <td className="px-4 py-3">{store.address}</td>
                <td className="px-4 py-3">{store.phone}</td>
                <td className="px-4 py-3">{store.businessHours}</td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/stores/${store.id}/edit`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      編集
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 