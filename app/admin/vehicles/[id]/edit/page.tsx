"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getVehicle, updateVehicle } from "@/lib/firebase-utils"
import ImageUploader from "@/components/ImageUploader"
import { formatNumberWithCommas, formatInputWithCommas } from "@/lib/utils"
import type { Vehicle } from "@/types"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

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

// 営業担当の選択肢
const salesRepresentatives = ["営業A", "営業B", "営業C"]

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
    wholesalePrice: "",
    totalPayment: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // ファイルアップロード用のref
  const inspectionFileRef = useRef<HTMLInputElement>(null)
  const conditionFileRef = useRef<HTMLInputElement>(null)
  const [uploadingInspection, setUploadingInspection] = useState(false)
  const [uploadingCondition, setUploadingCondition] = useState(false)

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
            wholesalePrice: formatNumberWithCommas(fetchedVehicle.wholesalePrice) || "",
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
    const commaFields = ['price', 'wholesalePrice', 'totalPayment', 'mileage', 'loadingCapacity', 'outerLength', 'outerWidth', 'outerHeight', 'totalWeight', 'horsepower', 'displacement'];
    
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

  // 商談関連のハンドラー
  const handleNegotiationChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // 車検証画像アップロード
  const handleInspectionImageUpload = async (file: File) => {
    try {
      setUploadingInspection(true)
      const storageRef = ref(storage, `vehicles/${vehicleId}/inspection/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setFormData(prev => ({
        ...prev,
        inspectionImageUrl: downloadURL
      }))
    } catch (err) {
      console.error('車検証画像のアップロードに失敗しました:', err)
      setError('車検証画像のアップロードに失敗しました')
    } finally {
      setUploadingInspection(false)
    }
  }

  // 状態表画像アップロード
  const handleConditionImageUpload = async (file: File) => {
    try {
      setUploadingCondition(true)
      const storageRef = ref(storage, `vehicles/${vehicleId}/condition/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setFormData(prev => ({
        ...prev,
        conditionImageUrl: downloadURL
      }))
    } catch (err) {
      console.error('状態表画像のアップロードに失敗しました:', err)
      setError('状態表画像のアップロードに失敗しました')
    } finally {
      setUploadingCondition(false)
    }
  }

  // ファイル選択ハンドラー
  const handleFileSelect = (fileRef: React.RefObject<HTMLInputElement>, uploadHandler: (file: File) => Promise<void>) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        uploadHandler(file)
      }
    }
  }

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
        wholesalePrice: Number(formData.wholesalePrice?.toString().replace(/,/g, '')) || 0,
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
          {/* 商談管理セクション */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">商談管理</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 商談中スイッチ */}
              <div className="flex items-center justify-between">
                <Label htmlFor="isNegotiating" className="text-base">商談中</Label>
                <Switch
                  id="isNegotiating"
                  checked={formData.isNegotiating || false}
                  onCheckedChange={(checked) => handleNegotiationChange('isNegotiating', checked)}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>
              
              {/* SOLD OUTスイッチ */}
              <div className="flex items-center justify-between">
                <Label htmlFor="isSoldOut" className="text-base">SOLD OUT</Label>
                <Switch
                  id="isSoldOut"
                  checked={formData.isSoldOut || false}
                  onCheckedChange={(checked) => handleNegotiationChange('isSoldOut', checked)}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>
              
              {/* 商談期限 */}
              <div>
                <Label htmlFor="negotiationDeadline">商談期限</Label>
                <Input 
                  id="negotiationDeadline" 
                  type="date" 
                  value={formData.negotiationDeadline || ""}
                  onChange={(e) => handleNegotiationChange('negotiationDeadline', e.target.value)}
                />
              </div>
              
              {/* 営業担当 */}
              <div>
                <Label htmlFor="salesRepresentative">営業担当</Label>
                <Select 
                  value={formData.salesRepresentative || ""} 
                  onValueChange={(value) => handleNegotiationChange('salesRepresentative', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesRepresentatives.map((rep) => (
                      <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 顧客名 */}
              <div className="md:col-span-2">
                <Label htmlFor="customerName">顧客名</Label>
                <Input 
                  id="customerName" 
                  placeholder="テキスト入力" 
                  value={formData.customerName || ""}
                  onChange={(e) => handleNegotiationChange('customerName', e.target.value)}
                />
              </div>
            </div>
          </div>

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
              <label className="block text-sm font-medium">業販金額</label>
              <input
                type="text"
                name="wholesalePrice"
                value={formData.wholesalePrice || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="4,500,000"
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
            <div className="space-y-4">
              <input
                type="file"
                ref={inspectionFileRef}
                onChange={handleFileSelect(inspectionFileRef, handleInspectionImageUpload)}
                accept="image/*,.pdf"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => inspectionFileRef.current?.click()}
                disabled={uploadingInspection}
                className="w-full"
              >
                {uploadingInspection ? "アップロード中..." : "車検証を選択"}
              </Button>
              {formData.inspectionImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">アップロード済み:</p>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500">📄</span>
                      <a 
                        href={formData.inspectionImageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        車検証を表示
                      </a>
                    </div>
                    <div className="mt-2">
                      <img 
                        src={formData.inspectionImageUrl} 
                        alt="車検証" 
                        className="max-w-full h-auto max-h-64 rounded"
                        onError={(e) => {
                          // 画像読み込みエラー時はPDFとして扱う
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center gap-2 p-4 bg-gray-50 rounded">
                                <span class="text-red-500 text-2xl">📄</span>
                                <span class="text-gray-700">PDFファイル</span>
                                <a href="${formData.inspectionImageUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline ml-2">
                                  開く
                                </a>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 状態写真画像 */}
          <div>
            <h3 className="text-lg font-medium mb-4">状態写真画像</h3>
            <div className="space-y-4">
              <input
                type="file"
                ref={conditionFileRef}
                onChange={handleFileSelect(conditionFileRef, handleConditionImageUpload)}
                accept="image/*,.pdf"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => conditionFileRef.current?.click()}
                disabled={uploadingCondition}
                className="w-full"
              >
                {uploadingCondition ? "アップロード中..." : "状態表を選択"}
              </Button>
              {formData.conditionImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">アップロード済み:</p>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500">📄</span>
                      <a 
                        href={formData.conditionImageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        状態表を表示
                      </a>
                    </div>
                    <div className="mt-2">
                      <img 
                        src={formData.conditionImageUrl} 
                        alt="状態表" 
                        className="max-w-full h-auto max-h-64 rounded"
                        onError={(e) => {
                          // 画像読み込みエラー時はPDFとして扱う
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center gap-2 p-4 bg-gray-50 rounded">
                                <span class="text-red-500 text-2xl">📄</span>
                                <span class="text-gray-700">PDFファイル</span>
                                <a href="${formData.conditionImageUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline ml-2">
                                  開く
                                </a>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
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