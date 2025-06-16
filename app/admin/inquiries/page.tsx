"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

// 仮のデータ取得例（本来はAPIやDBから取得）
const inquiries = [
  {
    id: 1,
    type: "購入",
    number: "0-000001",
    fullName: "株式会社サンプル 山田太郎",
    phone: "000-0000-0000",
    email: "sample@example.com",
    createdAt: "2024/03/20"
  },
  // ...他のデータ...
]

export default function AdminInquiriesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">お問い合わせ一覧</h1>
      </div>

      {/* 検索フォーム */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-4 gap-4">
          <select className="border rounded px-2 py-1">
            <option>種別</option>
            <option>買取</option>
            <option>購入</option>
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

      {/* お問い合わせ一覧テーブル */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">種別</th>
              <th className="px-4 py-3 text-left">お問い合わせ番号</th>
              <th className="px-4 py-3 text-left">名前</th>
              <th className="px-4 py-3 text-left">電話番号</th>
              <th className="px-4 py-3 text-left">メールアドレス</th>
              <th className="px-4 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="px-4 py-3">{inquiry.type}</td>
                <td className="px-4 py-3">{inquiry.number}</td>
                <td className="px-4 py-3">{inquiry.fullName}</td>
                <td className="px-4 py-3">{inquiry.phone}</td>
                <td className="px-4 py-3">{inquiry.email}</td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/inquiries/${inquiry.id}?type=${inquiry.type}`}>
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