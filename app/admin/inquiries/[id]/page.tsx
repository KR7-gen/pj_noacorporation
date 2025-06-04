"use client"

import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

// モックデータのベース
const baseInquiryData = {
  id: 1,
  createdAt: "R00/00/00 00:00",
  maker: "テキスト",
  vehicleName: "テキスト",
  model: "テキスト",
  year: "テキスト",
  mileage: "テキスト",
  transmission: "テキスト",
  exteriorImage: null,
  vehicleInspectionImage: null,
  address: "テキスト",
  name: "テキスト",
  phone: "テキスト",
  email: "テキスト",
  vehicleNumber: "テキスト",
  inquiryItem: "テキスト",
  details: "テキスト"
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
              <div className="grid grid-cols-[180px,1fr] gap-4 items-center">
                <p className="text-gray-500">お問い合わせ車両番号</p>
                <p>{inquiryData.vehicleNumber}</p>
              </div>
              <div className="grid grid-cols-[180px,1fr] gap-4 items-center">
                <p className="text-gray-500">お問い合わせ項目</p>
                <p>{inquiryData.inquiryItem}</p>
              </div>
              <div className="grid grid-cols-[180px,1fr] gap-4 items-center">
                <p className="text-gray-500">名前</p>
                <p>{inquiryData.name}</p>
              </div>
              <div className="grid grid-cols-[180px,1fr] gap-4 items-center">
                <p className="text-gray-500">電話番号</p>
                <p>{inquiryData.phone}</p>
              </div>
              <div className="grid grid-cols-[180px,1fr] gap-4 items-center">
                <p className="text-gray-500">メールアドレス</p>
                <p>{inquiryData.email}</p>
              </div>
              <div className="grid grid-cols-[180px,1fr] gap-4 items-start">
                <p className="text-gray-500">お問い合わせ内容詳細</p>
                <p className="whitespace-pre-wrap">{inquiryData.details}</p>
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
              <p>{inquiryData.maker}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">車種名</p>
              <p>{inquiryData.vehicleName}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">型式</p>
              <p>{inquiryData.model}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">年式</p>
              <p>{inquiryData.year}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">走行距離</p>
              <p>{inquiryData.mileage}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">シフト形状</p>
              <p>{inquiryData.transmission}</p>
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
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">名前</p>
              <p>{inquiryData.name}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">電話番号</p>
              <p>{inquiryData.phone}</p>
            </div>
            <div className="grid grid-cols-[120px,1fr] gap-4 items-center">
              <p className="text-gray-500">メールアドレス</p>
              <p>{inquiryData.email}</p>
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