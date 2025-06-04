"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

// モックデータ
const vehicleData = {
  id: 1,
  negotiationDeadline: "2024/03/31",
  assignedStaff: "鈴木",
  customerName: "山田太郎",
  vehicleInfo: {
    name: "クレーン車",
    price: 5000000,
    totalPayment: 5500000,
    monthlyPayment: {
      twoYear: 220000,
      threeYear: 150000,
      fourYear: 120000,
      fiveYear: 100000
    },
    bodyType: "クレーン",
    maker: "日野",
    size: "大型",
    model: "000-0000000",
    year: "R7",
    mileage: "10万km",
    loadCapacityBottom: "1.0t",
    loadCapacityTop: "1.0t",
    transmission: "MT",
    shift: "5速",
    vehicleExpiryDate: "2024/12/31",
    dimensions: {
      length: 4800,
      width: 1800,
      height: 2000
    },
    weight: 3500,
    engineType: "ディーゼル",
    power: "280ps",
    displacement: "5,000cc",
    fuel: "軽油",
    inquiryNumber: "0-000000",
    vehicleNumber: "000-000000"
  },
  images: Array(8).fill(null)
}

export default function VehicleDetailPage() {
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [isSoldOut, setIsSoldOut] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>商談中</span>
                <Switch
                  checked={isNegotiating}
                  onCheckedChange={setIsNegotiating}
                />
              </div>
              <div className="flex items-center gap-2">
                <span>SOLD OUT</span>
                <Switch
                  checked={isSoldOut}
                  onCheckedChange={setIsSoldOut}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-500">商談期限</span>
                <input
                  type="text"
                  value={vehicleData.negotiationDeadline}
                  className="ml-2 border rounded px-2 py-1"
                />
              </div>
              <div>
                <span className="text-sm text-gray-500">営業担当</span>
                <select className="ml-2 border rounded px-2 py-1">
                  <option>鈴木</option>
                  <option>佐藤</option>
                  <option>石川</option>
                </select>
              </div>
              <div>
                <span className="text-sm text-gray-500">顧客名</span>
                <input
                  type="text"
                  value={vehicleData.customerName}
                  className="ml-2 border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
          <Link href={`/admin/vehicles/${vehicleData.id}/edit`}>
            <Button>車両情報編集</Button>
          </Link>
        </div>

        {/* 車両基本情報 */}
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">トラック名</h3>
              <p>{vehicleData.vehicleInfo.name}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">車両価格</h3>
              <p>{vehicleData.vehicleInfo.price.toLocaleString()}円（税抜）</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">支払総額</h3>
              <p>{vehicleData.vehicleInfo.totalPayment.toLocaleString()}円（税抜）</p>
            </div>
          </div>

          {/* 毎月支払額シミュレーション */}
          <div>
            <h3 className="font-bold mb-2">毎月支払額シミュレーション</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">2年</p>
                <p>{vehicleData.vehicleInfo.monthlyPayment.twoYear.toLocaleString()}円（税別）〜</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">3年</p>
                <p>{vehicleData.vehicleInfo.monthlyPayment.threeYear.toLocaleString()}円（税別）〜</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">4年</p>
                <p>{vehicleData.vehicleInfo.monthlyPayment.fourYear.toLocaleString()}円（税別）〜</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">5年</p>
                <p>{vehicleData.vehicleInfo.monthlyPayment.fiveYear.toLocaleString()}円（税別）〜</p>
              </div>
            </div>
          </div>

          {/* 画像一覧 */}
          <div>
            <h3 className="font-bold mb-2">登録画像</h3>
            <div className="grid grid-cols-4 gap-4">
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

          {/* 車両情報 */}
          <div>
            <h3 className="font-bold mb-2">車両情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ボディタイプ</p>
                  <p>{vehicleData.vehicleInfo.bodyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">メーカー</p>
                  <p>{vehicleData.vehicleInfo.maker}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">大きさ</p>
                  <p>{vehicleData.vehicleInfo.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">型式</p>
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
                  <p className="text-sm text-gray-500">積載量（下限）</p>
                  <p>{vehicleData.vehicleInfo.loadCapacityBottom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">積載量（上限）</p>
                  <p>{vehicleData.vehicleInfo.loadCapacityTop}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ミッション</p>
                  <p>{vehicleData.vehicleInfo.transmission}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">シフト</p>
                  <p>{vehicleData.vehicleInfo.shift}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">車検有効期限</p>
                  <p>{vehicleData.vehicleInfo.vehicleExpiryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">車体寸法</p>
                  <p>
                    L {vehicleData.vehicleInfo.dimensions.length}mm
                    <br />
                    W {vehicleData.vehicleInfo.dimensions.width}mm
                    <br />
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
                  <p className="text-sm text-gray-500">問い合わせ番号</p>
                  <p>{vehicleData.vehicleInfo.inquiryNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">車台番号</p>
                  <p>{vehicleData.vehicleInfo.vehicleNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 