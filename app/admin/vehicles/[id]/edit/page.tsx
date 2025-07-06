"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getVehicle, updateVehicle } from "@/lib/firebase-utils"
import ImageUploader from "@/components/ImageUploader"
import type { Vehicle } from "@/types"

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

const vehicleStatuses = [
  "車検付き",
  "車検切れ",
  "抹消",
  "予備検査"
]

const missions = [
  "MT",
  "AT・SAT"
]

export default function VehicleEditPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<Partial<Vehicle>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const fetchedVehicle = await getVehicle(vehicleId)
        if (fetchedVehicle) {
          setVehicle(fetchedVehicle)
          setFormData(fetchedVehicle)
        } else {
          setError("車両が見つかりませんでした")
        }
      } catch (err) {
        setError("車両の読み込みに失敗しました")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "totalPayment" || name === "wholesalePrice"
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    try {
      setSaving(true)
      const updatedVehicle: Partial<Vehicle> = {
        ...formData,
        updatedAt: new Date()
      }

      await updateVehicle(vehicleId, updatedVehicle)
      router.push('/admin/vehicles')
    } catch (err) {
      setError("車両の更新に失敗しました")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">読み込み中...</div>
  }

  if (error || !vehicle) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-gray-600 mb-4">{error || "車両が見つかりませんでした"}</p>
          <Button onClick={() => router.push('/admin/vehicles')}>
            車両一覧に戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">車両編集</h1>
        <Button variant="outline" onClick={() => router.push('/admin/vehicles')}>
          一覧に戻る
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* 基本情報 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">トラック名</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="日野 レンジャー"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">車両価格（税抜）</label>
              <input
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="5000000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">支払総額（税抜）</label>
              <input
                type="number"
                name="totalPayment"
                value={formData.totalPayment || 0}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="5500000"
              />
            </div>
          </div>

          {/* 車両説明 */}
          <div>
            <h3 className="text-lg font-medium mb-4">車両説明</h3>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 h-32"
              placeholder="車両の詳細な説明を入力してください..."
            />
          </div>

          {/* 毎月支払額シミュレーション */}
          <div>
            <h3 className="text-lg font-medium mb-4">毎月支払額シミュレーション</h3>
            <div className="grid grid-cols-4 gap-6">
              {[2, 3, 4, 4].map((year, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium">{year}年</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="円（税別）〜"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 画像アップロード */}
          <div>
            <h3 className="text-lg font-medium mb-4">画像登録</h3>
            <ImageUploader
              images={formData.imageUrls || []}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, imageUrls: images }))}
              vehicleId={vehicleId}
            />
          </div>

          {/* 車両情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">車両情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">ボディタイプ</label>
                  <select
                    name="bodyType"
                    value={formData.bodyType || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
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
                    name="maker"
                    value={formData.maker || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {makers.map((maker) => (
                      <option key={maker} value={maker}>{maker}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">大きさ</label>
                  <select
                    name="size"
                    value={formData.size || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
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
                    name="model"
                    value={formData.model || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">年式</label>
                  <select
                    name="year"
                    value={formData.year || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
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
                    name="mileage"
                    value={formData.mileage || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {mileages.map((mileage) => (
                      <option key={mileage} value={mileage}>{mileage}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">積載量（下限）</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {loadCapacities.map((capacity) => (
                      <option key={capacity} value={capacity}>{capacity}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">積載量（上限）</label>
                  <select
                    className="w-full border rounded px-2 py-1"
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
                    name="mission"
                    value={formData.mission || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
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
                    name="inspectionStatus"
                    value={formData.inspectionStatus || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
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
                    name="inspectionDate"
                    value={formData.inspectionDate || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      name="length"
                      value={formData.length || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                      placeholder="L (mm)"
                    />
                    <input
                      type="number"
                      name="width"
                      value={formData.width || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                      placeholder="W (mm)"
                    />
                    <input
                      type="number"
                      name="height"
                      value={formData.height || ""}
                      onChange={handleChange}
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
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">排気量</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
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
                <select
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">選択</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">店舗</label>
                <select
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">選択</option>
                  <option value="store1">○○店</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="px-8" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 