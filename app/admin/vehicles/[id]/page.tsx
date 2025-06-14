"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// モックデータ（実際のアプリケーションではAPIから取得）
const vehicleData = {
  id: 1,
  managementNumber: "V00001",
  maker: "いすゞ",
  bodyType: "クレーン",
  size: "大型",
  price: 1000000,
  wholesalePrice: 900000,
  totalPayment: 1200000,
  expiryDate: "2024/12/31",
  vehicleInfo: {
    model: "エルフ",
    year: "令和5年",
    mileage: "50,000km",
    loadCapacity: "2,000kg",
    transmission: "MT",
    dimensions: {
      length: 4800,
      width: 1850,
      height: 2100
    },
    weight: 3500,
    engineType: "4HK1",
    power: "150ps",
    displacement: "5,200cc",
    fuel: "軽油",
    vehicleNumber: "千葉100あ1234"
  },
  images: Array(8).fill(null),
  status: "在庫"
}

export default function VehicleDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">車両詳細</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <Link href={`/admin/vehicles/${vehicleData.id}/edit`}>
            <Button className="flex-1 sm:flex-initial">編集</Button>
          </Link>
          <Button variant="destructive" className="flex-1 sm:flex-initial">削除</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-bold mb-4">基本情報</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">管理番号</p>
                  <p>{vehicleData.managementNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">メーカー</p>
                  <p>{vehicleData.maker}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ボディタイプ</p>
                  <p>{vehicleData.bodyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">大きさ</p>
                  <p>{vehicleData.size}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4">価格情報</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">車両価格</p>
                  <p>{vehicleData.price.toLocaleString()}円</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">業販価格</p>
                  <p>{vehicleData.wholesalePrice.toLocaleString()}円</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">支払総額</p>
                  <p>{vehicleData.totalPayment.toLocaleString()}円</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">車検有効期限</p>
                  <p>{vehicleData.expiryDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 車両画像 */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">登録画像</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vehicleData.images.map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-200 rounded flex items-center justify-center"
                >
                  <span className="text-gray-400">画像{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 詳細情報 */}
          <div>
            <h2 className="text-lg font-bold mb-4">詳細情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">車種</p>
                <p>{vehicleData.vehicleInfo.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">年式</p>
                <p>{vehicleData.vehicleInfo.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">走行距離</p>
                <p>{vehicleData.vehicleInfo.mileage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">最大積載量</p>
                <p>{vehicleData.vehicleInfo.loadCapacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ミッション</p>
                <p>{vehicleData.vehicleInfo.transmission}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">車体寸法</p>
                <p>
                  L {vehicleData.vehicleInfo.dimensions.length}mm<br />
                  W {vehicleData.vehicleInfo.dimensions.width}mm<br />
                  H {vehicleData.vehicleInfo.dimensions.height}mm
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">車両総重量</p>
                <p>{vehicleData.vehicleInfo.weight}kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">原動機型式</p>
                <p>{vehicleData.vehicleInfo.engineType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">馬力</p>
                <p>{vehicleData.vehicleInfo.power}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">排気量</p>
                <p>{vehicleData.vehicleInfo.displacement}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">燃料</p>
                <p>{vehicleData.vehicleInfo.fuel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">車台番号</p>
                <p>{vehicleData.vehicleInfo.vehicleNumber}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 