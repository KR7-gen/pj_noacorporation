"use client"

import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

// モックデータのベース
const baseInquiryData = {
  id: 1,
  createdAt: "R00/00/00 00:00",
  companyName: "株式会社サンプル",
  name: "山田太郎",
  prefecture: "東京都",
  phone: "000-0000-0000",
  email: "sample@example.com",
  remarks: "備考欄の内容",
  type: "購入"
}

export default function InquiryDetailPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || "購入"

  // 種別を含むお問い合わせデータ
  const inquiryData = {
    ...baseInquiryData,
    type
  }

  // 購入の場合のレイアウト
  if (type === "購入") {
    return (
      <div className="space-y-6">
        {/* 上部: タイトルとお問い合わせ日時 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-4">お問い合わせ内容</h1>
          <p>問い合わせ日時：{inquiryData.createdAt}</p>
          <div className="mt-4 inline-block bg-gray-100 px-3 py-1 rounded">
            {inquiryData.type}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 左下: お問い合わせ情報 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
                <p className="text-gray-500">会社名</p>
                <p>{inquiryData.companyName}</p>
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
                <p className="text-gray-500">お名前</p>
                <p>{inquiryData.name}</p>
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
                <p className="text-gray-500">都道府県</p>
                <p>{inquiryData.prefecture}</p>
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
                <p className="text-gray-500">電話番号</p>
                <p>{inquiryData.phone}</p>
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
                <p className="text-gray-500">メールアドレス</p>
                <p>{inquiryData.email}</p>
              </div>
              <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
                <p className="text-gray-500">フリー備考欄</p>
                <p>{inquiryData.remarks}</p>
              </div>
            </div>
          </div>

          {/* 右下: 返信フォーム */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <select className="w-full border rounded px-2 py-1">
                  <option value="">返信する</option>
                  <option value="no-reply">返信しない</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">件名</label>
                <input type="text" className="w-full border rounded px-2 py-1" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">メッセージ</label>
                <textarea
                  className="w-full border rounded px-2 py-1 h-48"
                  defaultValue="問い合わせいただいた内容について"
                />
              </div>
              <div className="text-right">
                <Button>上記の内容で送信</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 買取の場合のレイアウトは既存のまま
  return (
    <div className="space-y-6">
      {/* 上部: タイトルとお問い合わせ日時 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">お問い合わせ内容</h1>
        <p>問い合わせ日時：{inquiryData.createdAt}</p>
        <div className="mt-4 inline-block bg-gray-100 px-3 py-1 rounded">
          {inquiryData.type}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 左下: お問い合わせ情報 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">メーカー</p>
              <p>{inquiryData.companyName}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">車種名</p>
              <p>{inquiryData.name}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">型式</p>
              <p>{inquiryData.prefecture}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">年式</p>
              <p>{inquiryData.phone}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">走行距離</p>
              <p>{inquiryData.email}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">シフト形状</p>
              <p>{inquiryData.remarks}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">外観写真</p>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                {inquiryData.exteriorImage ? (
                  <img
                    src={inquiryData.exteriorImage}
                    alt="外観写真"
                    className="max-h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-400">画像なし</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">車検証</p>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                {inquiryData.vehicleInspectionImage ? (
                  <img
                    src={inquiryData.vehicleInspectionImage}
                    alt="車検証"
                    className="max-h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-400">画像なし</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">住所</p>
              <p>{inquiryData.address}</p>
            </div>
          </div>
        </div>

        {/* 右下: 返信フォーム */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <select className="w-full border rounded px-2 py-1">
                <option value="">返信する</option>
                <option value="no-reply">返信しない</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">件名</label>
              <input type="text" className="w-full border rounded px-2 py-1" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">メッセージ</label>
              <textarea
                className="w-full border rounded px-2 py-1 h-48"
                defaultValue="査定金額のお知らせ"
              />
            </div>
            <div className="text-right">
              <Button>上記の内容で送信</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 