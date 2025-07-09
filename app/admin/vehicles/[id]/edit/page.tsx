"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getVehicle, updateVehicle } from "@/lib/firebase-utils"
import ImageUploader from "@/components/ImageUploader"
import { formatNumberWithCommas, formatInputWithCommas } from "@/lib/utils"
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

// 装備品リスト
const equipmentList = [
  "ETC", "バックカメラ", "記録簿", "パワーウィンドウ", "ドラレコ", "エアコン",
  "電動ミラー", "ABS", "アルミホイール", "エアサスシート", "カーナビ", "DPF",
  "PMマフラー", "集中ドアロック"
];

export default function VehicleEditPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    price: "",
    totalPayment: "",
  })
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
          setFormData({
            ...fetchedVehicle,
            price: formatNumberWithCommas(fetchedVehicle.price) || "",
            totalPayment: formatNumberWithCommas(fetchedVehicle.totalPayment) || "",
            mileage: formatNumberWithCommas(fetchedVehicle.mileage) || "",
            loadingCapacity: formatNumberWithCommas(fetchedVehicle.loadingCapacity) || "",
            outerLength: formatNumberWithCommas(fetchedVehicle.outerLength) || "",
            outerWidth: formatNumberWithCommas(fetchedVehicle.outerWidth) || "",
            outerHeight: formatNumberWithCommas(fetchedVehicle.outerHeight) || "",
            totalWeight: formatNumberWithCommas(fetchedVehicle.totalWeight) || "",
            horsepower: formatNumberWithCommas(fetchedVehicle.horsepower) || "",
            displacement: formatNumberWithCommas(fetchedVehicle.displacement) || "",
          })
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
    
    // カンマ区切りが必要な項目
    const commaFields = ['price', 'totalPayment', 'mileage', 'loadingCapacity', 'outerLength', 'outerWidth', 'outerHeight', 'totalWeight', 'horsepower', 'displacement'];
    
    if (commaFields.includes(name)) {
      const formattedValue = formatInputWithCommas(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  // 毎月支払額シミュレーション用のハンドラー
  const handleSimulationChange = (index: number, value: string) => {
    const formattedValue = formatInputWithCommas(value);
    // シミュレーションデータを管理する必要がある場合は、stateを追加
  };

  // 装備品の選択・解除
  const handleEquipmentToggle = (item: string) => {
    setFormData((prev) => {
      const eq = prev.equipment || [];
      if (eq.includes(item)) {
        return { ...prev, equipment: eq.filter((e) => e !== item) };
      } else {
        return { ...prev, equipment: [...eq, item] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    try {
      setSaving(true)
      const updatedVehicle: Partial<Vehicle> = {
        ...formData,
        price: Number(formData.price?.toString().replace(/,/g, '')) || 0,
        totalPayment: Number(formData.totalPayment?.toString().replace(/,/g, '')) || 0,
        mileage: Number(formData.mileage?.toString().replace(/,/g, '')) || 0,
        loadingCapacity: Number(formData.loadingCapacity?.toString().replace(/,/g, '')) || 0,
        outerLength: Number(formData.outerLength?.toString().replace(/,/g, '')) || 0,
        outerWidth: Number(formData.outerWidth?.toString().replace(/,/g, '')) || 0,
        outerHeight: Number(formData.outerHeight?.toString().replace(/,/g, '')) || 0,
        totalWeight: Number(formData.totalWeight?.toString().replace(/,/g, '')) || 0,
        horsepower: Number(formData.horsepower?.toString().replace(/,/g, '')) || 0,
        displacement: Number(formData.displacement?.toString().replace(/,/g, '')) || 0,
        updatedAt: new Date(),
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
    return <div className="p-6">読み込み中...</div>;
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">車両詳細・編集</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/vehicles')}>
            一覧に戻る
          </Button>
        </div>
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
                type="text"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="5,000,000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">支払総額</label>
              <input
                type="text"
                name="totalPayment"
                value={formData.totalPayment || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="5,500,000"
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
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="100,000"
                    onChange={(e) => handleSimulationChange(index, e.target.value)}
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
                    placeholder="型式を入力"
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
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="100,000"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">積載量</label>
                  <input
                    type="text"
                    name="loadingCapacity"
                    value={formData.loadingCapacity || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="2,000"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
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
                    placeholder="2025年12月"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="outerLength"
                      value={formData.outerLength || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                      placeholder="7,000"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                    <input
                      type="text"
                      name="outerWidth"
                      value={formData.outerWidth || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                      placeholder="2,200"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                    <input
                      type="text"
                      name="outerHeight"
                      value={formData.outerHeight || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                      placeholder="2,800"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車両総重量</label>
                  <input
                    type="text"
                    name="totalWeight"
                    value={formData.totalWeight || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="8,000"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">原動機型式</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="原動機型式を入力"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">馬力</label>
                  <input
                    type="text"
                    name="horsepower"
                    value={formData.horsepower || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="300"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">排気量</label>
                  <input
                    type="text"
                    name="displacement"
                    value={formData.displacement || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="7,700"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">燃料</label>
                  <select
                    name="fuel"
                    value={formData.fuel || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    <option value="軽油">軽油</option>
                    <option value="ハイブリッド">ハイブリッド</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">問い合わせ番号</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="問い合わせ番号を入力"
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
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="L (mm)"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="W (mm)"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="H (mm)"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
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

          {/* 装備品セクション */}
          <div>
            <h3 className="text-lg font-medium mb-4">装備品</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {equipmentList.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`rounded-full px-4 py-2 font-medium transition border-none focus:outline-none ${formData.equipment?.includes(item) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                  onClick={() => handleEquipmentToggle(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="px-8" disabled={saving}>
              {saving ? '保存中...' : '変更を保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}