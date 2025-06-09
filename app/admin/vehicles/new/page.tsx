"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

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

const years = [
  "R7",
  "R6",
  "R5",
  "R4",
  "R3",
  "R2",
  "R1",
  "H31",
  "H30",
  "H29",
  "H28",
  "H27"
]

const mileages = [
  "上限なし",
  "10万km",
  "20万km",
  "30万km",
  "40万km",
  "50万km",
  "60万km",
  "70万km",
  "80万km",
  "90万km",
  "100万km"
]

const loadCapacities = [
  "1.0t",
  "1.5t",
  "2.0t",
  "2.5t",
  "3.0t",
  "3.5t",
  "4.0t",
  "4.5t",
  "5.0t",
  "5.5t",
  "6.0t"
]

const missions = [
  "MT",
  "AT・SAT"
]

const vehicleStatuses = [
  "車検付き",
  "車検切れ",
  "抹消",
  "予備検査"
]

type MonthlyPaymentField = "twoYear" | "threeYear" | "fourYear" | "fiveYear"

interface VehicleFormData {
  name: string
  price: string
  totalPayment: string
  monthlyPayments: {
    [key in MonthlyPaymentField]: string
  }
  vehicleInfo: {
    bodyType: string
    maker: string
    size: string
    model: string
    year: string
    mileage: string
    loadCapacity: string
    transmission: string
    shift: string
    vehicleStatus: string
    vehicleExpiryDate: string
    dimensions: {
      length: string
      width: string
      height: string
    }
    weight: string
    engineType: string
    power: string
    displacement: string
    fuel: string
    inquiryNumber: string
    vehicleNumber: string
  }
  images: string[]
}

export default function VehicleCreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    price: "",
    totalPayment: "",
    monthlyPayments: {
      twoYear: "",
      threeYear: "",
      fourYear: "",
      fiveYear: ""
    },
    vehicleInfo: {
      bodyType: "",
      maker: "",
      size: "",
      model: "",
      year: "",
      mileage: "",
      loadCapacity: "",
      transmission: "",
      shift: "",
      vehicleStatus: "",
      vehicleExpiryDate: "",
      dimensions: {
        length: "",
        width: "",
        height: ""
      },
      weight: "",
      engineType: "",
      power: "",
      displacement: "",
      fuel: "",
      inquiryNumber: "",
      vehicleNumber: ""
    },
    images: []
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVehicleInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleInfo: {
        ...prev.vehicleInfo,
        [field]: value
      }
    }))
  }

  const handleMonthlyPaymentChange = (field: MonthlyPaymentField, value: string) => {
    setFormData(prev => ({
      ...prev,
      monthlyPayments: {
        ...prev.monthlyPayments,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const vehiclesRef = collection(db, "vehicles")
      await addDoc(vehiclesRef, {
        ...formData,
        createdAt: new Date(),
        status: "" // 初期状態
      })
      router.push("/admin/vehicles")
    } catch (error) {
      console.error("Error adding vehicle:", error)
      alert("車両の登録に失敗しました。")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">車両登録</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* 基本情報 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">トラック名</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">車両価格（税抜）</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">支払総額（税抜）</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                value={formData.totalPayment}
                onChange={(e) => handleInputChange("totalPayment", e.target.value)}
                required
              />
            </div>
          </div>

          {/* 毎月支払額シミュレーション */}
          <div>
            <h3 className="text-lg font-medium mb-4">毎月支払額シミュレーション</h3>
            <div className="grid grid-cols-4 gap-6">
              {[
                { year: 2, field: "twoYear" },
                { year: 3, field: "threeYear" },
                { year: 4, field: "fourYear" },
                { year: 5, field: "fiveYear" }
              ].map(({ year, field }) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium">{year}年</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="円（税別）〜"
                    value={formData.monthlyPayments[field]}
                    onChange={(e) => handleMonthlyPaymentChange(field as MonthlyPaymentField, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 画像アップロード */}
          <div>
            <h3 className="text-lg font-medium mb-4">画像登録</h3>
            <div className="grid grid-cols-4 gap-4">
              {Array(14).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-gray-400">＋</span>
                </div>
              ))}
            </div>
          </div>

          {/* 車両情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">車両情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">ボディタイプ</label>
                  <select 
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.bodyType}
                    onChange={(e) => handleVehicleInfoChange("bodyType", e.target.value)}
                    required
                  >
                    <option value="">選択</option>
                    {bodyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">メーカー</label>
                  <select 
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.maker}
                    onChange={(e) => handleVehicleInfoChange("maker", e.target.value)}
                    required
                  >
                    <option value="">選択</option>
                    {makers.map((maker) => (
                      <option key={maker} value={maker}>{maker}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">大きさ</label>
                  <select className="w-full border rounded px-2 py-1">
                    <option value="">選択</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">型式</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.model}
                    onChange={(e) => handleVehicleInfoChange("model", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">年式</label>
                  <select 
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.year}
                    onChange={(e) => handleVehicleInfoChange("year", e.target.value)}
                    required
                  >
                    <option value="">選択</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">走行距離</label>
                  <select 
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.mileage}
                    onChange={(e) => handleVehicleInfoChange("mileage", e.target.value)}
                    required
                  >
                    <option value="">選択</option>
                    {mileages.map((mileage) => (
                      <option key={mileage} value={mileage}>{mileage}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">積載量</label>
                  <select 
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.loadCapacity}
                    onChange={(e) => handleVehicleInfoChange("loadCapacity", e.target.value)}
                    required
                  >
                    <option value="">選択</option>
                    {loadCapacities.map((capacity) => (
                      <option key={capacity} value={capacity}>{capacity}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">ミッション</label>
                  <select 
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.transmission}
                    onChange={(e) => handleVehicleInfoChange("transmission", e.target.value)}
                    required
                  >
                    <option value="">選択</option>
                    {missions.map((mission) => (
                      <option key={mission} value={mission}>{mission}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車検状態</label>
                  <select 
                    className="w-full border rounded px-2 py-1"
                    value={formData.vehicleInfo.vehicleStatus}
                    onChange={(e) => handleVehicleInfoChange("vehicleStatus", e.target.value)}
                    required
                  >
                    <option value="">選択</option>
                    {vehicleStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車検有効期限</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="YYYY/MM/DD"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      placeholder="L (mm)"
                    />
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      placeholder="W (mm)"
                    />
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      placeholder="H (mm)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車両総重量</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="kg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">原動機型式</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">馬力</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="ps"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">排気量</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="cc"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">燃料</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">問い合わせ番号</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="0-000000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車台番号</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="000-000000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 車検証画像 */}
          <div>
            <h3 className="text-lg font-medium mb-4">車検証画像</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[1.4/1] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-400">＋</span>
              </div>
              <div className="aspect-[1.4/1] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-400">＋</span>
              </div>
            </div>
          </div>

          {/* 状態写真画像 */}
          <div>
            <h3 className="text-lg font-medium mb-4">状態写真画像</h3>
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
              <span className="text-gray-400">＋</span>
            </div>
          </div>

          {/* 上物情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">上物情報</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">メーカー</label>
                <select className="w-full border rounded px-2 py-1">
                  <option>選択</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">装備/仕様</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">型式</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">内寸</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="L (mm)"
                  />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="W (mm)"
                  />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="H (mm)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">年式</label>
                <select className="w-full border rounded px-2 py-1">
                  <option>選択</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">店舗</label>
                <select className="w-full border rounded px-2 py-1">
                  <option>選択</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              キャンセル
            </Button>
            <Button type="submit">
              登録する
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 