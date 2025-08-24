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
import { Store } from "@/lib/store-data"

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

const vehicleTypes = [
  "デュトロ",
  "レンジャー",
  "プロフィア",
  "エルフ",
  "フォワード",
  "ギガ",
  "キャンター",
  "ファイター",
  "スーパーグレート",
  "カゼット",
  "コンドル",
  "クオン",
  "ビックサム",
  "その他"
]

const months = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月"
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

const shifts = [
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
  const [formData, setFormData] = useState<any>({
    price: "",
    wholesalePrice: "",
    totalPayment: "",
    // 店舗関連フィールド
    storeName: "",
    storeId: undefined,
    // 商談関連フィールド
    isNegotiating: false,
    isSoldOut: false,
    isPrivate: false,
    isTemporarySave: false,
    negotiationDeadline: "",
    salesRepresentative: "",
    customerName: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [loadingStores, setLoadingStores] = useState(true)
  
  // ファイルアップロード用のref
  const inspectionFileRef = useRef<HTMLInputElement>(null)
  const conditionFileRef = useRef<HTMLInputElement>(null)
  const [uploadingInspection, setUploadingInspection] = useState(false)
  const [uploadingCondition, setUploadingCondition] = useState(false)

  // 店舗データを取得
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoadingStores(true)
        const response = await fetch('/api/stores')
        if (!response.ok) {
          throw new Error('店舗データの取得に失敗しました')
        }
        const data = await response.json()
        setStores(data)
      } catch (error) {
        console.error('店舗データ取得エラー:', error)
      } finally {
        setLoadingStores(false)
      }
    }

    fetchStores()
  }, [])

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
            vehicleType: fetchedVehicle.vehicleType || "",
            chassisNumber: fetchedVehicle.chassisNumber || "",
            month: fetchedVehicle.month || "",
            // 上物情報
            bodyMaker: fetchedVehicle.bodyMaker || "",
            bodyModel: fetchedVehicle.bodyModel || "",
            bodyYear: fetchedVehicle.bodyYear || "",
            innerLength: formatNumberWithCommas(fetchedVehicle.innerLength) || "",
            innerWidth: formatNumberWithCommas(fetchedVehicle.innerWidth) || "",
            innerHeight: formatNumberWithCommas(fetchedVehicle.innerHeight) || "",
            mission: fetchedVehicle.mission || "",
            turbo: fetchedVehicle.turbo || "",
            // 店舗関連フィールド
            storeName: fetchedVehicle.storeName || "",
            storeId: fetchedVehicle.storeId || undefined,
            // 商談関連フィールド
            isNegotiating: fetchedVehicle.isNegotiating || false,
            isSoldOut: fetchedVehicle.isSoldOut || false,
            isPrivate: fetchedVehicle.isPrivate || false,
            isTemporarySave: fetchedVehicle.isTemporarySave || false,
            negotiationDeadline: fetchedVehicle.negotiationDeadline || "",
            salesRepresentative: fetchedVehicle.salesRepresentative || "",
            customerName: fetchedVehicle.customerName || "",
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
    
    // 店舗選択の場合の特別処理
    if (name === 'storeId') {
      const selectedStore = stores.find(store => store.id === parseInt(value))
      setFormData((prev) => ({
        ...prev,
        storeId: parseInt(value) || undefined,
        storeName: selectedStore?.name || ""
      }))
      return
    }
    
    // カンマ区切りが必要な項目
    const commaFields = ['price', 'wholesalePrice', 'totalPayment', 'mileage', 'loadingCapacity', 'outerLength', 'outerWidth', 'outerHeight', 'totalWeight', 'horsepower', 'displacement', 'innerLength', 'innerWidth', 'innerHeight'];
    
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
    setFormData((prev) => {
      // SOLD OUTと商談中の排他的制御
      if (field === 'isSoldOut' && value === true) {
        // SOLD OUTをONにしたら商談中をOFFにする
        return {
          ...prev,
          isSoldOut: true,
          isNegotiating: false,
        };
      } else if (field === 'isNegotiating' && value === true) {
        // 商談中をONにしたらSOLD OUTをOFFにする
        return {
          ...prev,
          isNegotiating: true,
          isSoldOut: false,
        };
      } else {
        // その他のフィールドは通常通り更新
        return {
          ...prev,
          [field]: value,
        };
      }
    });
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

  // 支払額シミュレーションの変更
  const handleSimulationChange = (index: number, value: string) => {
    const formattedValue = formatInputWithCommas(value);
    const simulationKey = `simulation${index + 2}Year` as keyof Vehicle
    setFormData(prev => ({
      ...prev,
      [simulationKey]: formattedValue
    }))
  }

  // 一時保存ハンドラー
  const handleTemporarySave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    // 商談中の必須項目チェック
    if (formData.isNegotiating) {
      if (!formData.negotiationDeadline || !formData.salesRepresentative || !formData.customerName) {
        setError("商談中の場合、商談期限・営業担当・顧客名は必須です")
        return
      }
    }

    try {
      setSaving(true)
      // 問い合わせ番号を除外して更新データを作成
      const { inquiryNumber, ...updateData } = formData;
      
      // undefinedのフィールドを除外して更新データを作成
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );
      
      // 画像URLからダミー写真と一時的なURLを除外
      const filteredImageUrls = (formData.imageUrls || []).filter(url => 
        url && 
        url.trim() !== "" && 
        url !== "/placeholder.jpg" &&
        !url.includes("temp_") && 
        !url.startsWith("blob:") &&
        !url.startsWith("data:")
      );

      const updatedVehicle: Partial<Vehicle> = {
        ...cleanedUpdateData,
        imageUrls: filteredImageUrls,
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
        vehicleType: formData.vehicleType,
        chassisNumber: formData.chassisNumber,
        month: formData.month,
        isTemporarySave: true, // 一時保存としてマーク
        updatedAt: new Date(),
      }

      await updateVehicle(vehicleId, updatedVehicle)
      alert("車両が一時保存されました")
      router.push('/admin/vehicles')
    } catch (err) {
      setError("車両の一時保存に失敗しました")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    // 商談中の必須項目チェック
    if (formData.isNegotiating) {
      if (!formData.negotiationDeadline || !formData.salesRepresentative || !formData.customerName) {
        setError("商談中の場合、商談期限・営業担当・顧客名は必須です")
        return
      }
    }

    try {
      setSaving(true)
      // 問い合わせ番号を除外して更新データを作成
      const { inquiryNumber, ...updateData } = formData;
      
      // undefinedのフィールドを除外して更新データを作成
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );
      
             // 画像URLからダミー写真と一時的なURLを除外
       const filteredImageUrls = (formData.imageUrls || []).filter(url => 
         url && 
         url.trim() !== "" && 
         url !== "/placeholder.jpg" &&
         !url.includes("temp_") && 
         !url.startsWith("blob:") &&
         !url.startsWith("data:")
       );

      const updatedVehicle: Partial<Vehicle> = {
        ...cleanedUpdateData,
        imageUrls: filteredImageUrls,
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
        vehicleType: formData.vehicleType,
        chassisNumber: formData.chassisNumber,
        month: formData.month,
        isTemporarySave: false, // 通常保存としてマーク
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
               
               {/* 非公開スイッチ */}
               <div className="flex items-center justify-between">
                 <Label htmlFor="isPrivate" className="text-base">非公開</Label>
                 <Switch
                   id="isPrivate"
                   checked={formData.isPrivate || false}
                   onCheckedChange={(checked) => handleNegotiationChange('isPrivate', checked)}
                   className="data-[state=checked]:bg-gray-500"
                 />
               </div>
              
              {/* 商談期限 */}
              <div>
                <Label htmlFor="negotiationDeadline" className={formData.isNegotiating ? "text-red-600" : ""}>
                  商談期限{formData.isNegotiating && <span className="text-red-500">*</span>}
                </Label>
                <Input 
                  id="negotiationDeadline" 
                  type="date" 
                  value={formData.negotiationDeadline || ""}
                  onChange={(e) => handleNegotiationChange('negotiationDeadline', e.target.value)}
                  required={formData.isNegotiating}
                  className={formData.isNegotiating && !formData.negotiationDeadline ? "border-red-500" : ""}
                />
              </div>
              
              {/* 営業担当 */}
              <div>
                <Label htmlFor="salesRepresentative" className={formData.isNegotiating ? "text-red-600" : ""}>
                  営業担当{formData.isNegotiating && <span className="text-red-500">*</span>}
                </Label>
                <Select 
                  value={formData.salesRepresentative || ""} 
                  onValueChange={(value) => handleNegotiationChange('salesRepresentative', value)}
                >
                  <SelectTrigger className={formData.isNegotiating && !formData.salesRepresentative ? "border-red-500" : ""}>
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
                <Label htmlFor="customerName" className={formData.isNegotiating ? "text-red-600" : ""}>
                  顧客名{formData.isNegotiating && <span className="text-red-500">*</span>}
                </Label>
                <Input 
                  id="customerName" 
                  placeholder="テキスト入力" 
                  value={formData.customerName || ""}
                  onChange={(e) => handleNegotiationChange('customerName', e.target.value)}
                  required={formData.isNegotiating}
                  className={formData.isNegotiating && !formData.customerName ? "border-red-500" : ""}
                />
              </div>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-6 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">問い合わせ番号</label>
              <input
                type="text"
                name="inquiryNumber"
                value={formData.inquiryNumber || ""}
                className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700"
                disabled
                readOnly
              />
            </div>
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
              <label className="block text-sm font-medium">在庫店舗名</label>
              <select
                name="storeId"
                value={formData.storeId || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                disabled={loadingStores}
              >
                <option value="">店舗を選択してください</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
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
                              <label className="block text-sm font-medium">車両総額</label>
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



                     {/* 画像アップロード */}
           <div>
             <h3 className="text-lg font-medium mb-4">画像登録</h3>
                           <ImageUploader
                images={(formData.imageUrls || []).filter(url => 
                  url && 
                  url.trim() !== "" && 
                  !url.includes("temp_") && 
                  !url.startsWith("blob:") &&
                  !url.startsWith("data:")
                )}
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
                  <label className="block text-sm font-medium">車種</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">型式</label>
                  <input
                    type="text"
                    name="modelCode"
                    value={formData.modelCode || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="型式を入力"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体番号</label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="車体番号を入力"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">年式</label>
                  <div className="flex gap-2">
                    <select
                      name="year"
                      value={formData.year || ""}
                      onChange={handleChange}
                      className="w-1/2 border rounded px-2 py-1"
                    >
                      <option value="">選択</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <select
                      name="month"
                      value={formData.month || ""}
                      onChange={handleChange}
                      className="w-1/2 border rounded px-2 py-1"
                    >
                      <option value="">月</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
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
                  <label className="block text-sm font-medium">シフト</label>
                  <select
                    name="shift"
                    value={formData.shift || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {shifts.map((shift) => (
                      <option key={shift} value={shift}>{shift}</option>
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
                    name="engineModel"
                    value={formData.engineModel || ""}
                    onChange={handleChange}
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
                           <label className="block text-sm font-medium">過給機</label>
                           <select
                             name="turbo"
                             value={formData.turbo || ""}
                             onChange={handleChange}
                             className="w-full border rounded px-2 py-1"
                           >
                             <option value="">選択</option>
                             <option value="有">有</option>
                             <option value="無">無</option>
                           </select>
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

           {/* 上物情報 */}
           <div>
             <h3 className="text-lg font-medium mb-4">上物情報</h3>
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="block text-sm font-medium">上物メーカー</label>
                 <input
                   type="text"
                   name="bodyMaker"
                   value={formData.bodyMaker || ""}
                   onChange={handleChange}
                   className="w-full border rounded px-2 py-1"
                   placeholder="上物メーカーを入力"
                 />
               </div>
               <div className="space-y-2">
                 <label className="block text-sm font-medium">上物型式</label>
                 <input
                   type="text"
                   name="bodyModel"
                   value={formData.bodyModel || ""}
                   onChange={handleChange}
                   className="w-full border rounded px-2 py-1"
                   placeholder="上物型式を入力"
                 />
               </div>
               <div className="space-y-2">
                 <label className="block text-sm font-medium">上物年式</label>
                 <select
                   name="bodyYear"
                   value={formData.bodyYear || ""}
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
                 <label className="block text-sm font-medium">内寸長</label>
                 <input
                   type="text"
                   name="innerLength"
                   value={formData.innerLength || ""}
                   onChange={handleChange}
                   className="w-full border rounded px-2 py-1"
                   placeholder="内寸長 (mm)"
                   style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                 />
               </div>
               <div className="space-y-2">
                 <label className="block text-sm font-medium">内寸幅</label>
                 <input
                   type="text"
                   name="innerWidth"
                   value={formData.innerWidth || ""}
                   onChange={handleChange}
                   className="w-full border rounded px-2 py-1"
                   placeholder="内寸幅 (mm)"
                   style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                 />
               </div>
               <div className="space-y-2">
                 <label className="block text-sm font-medium">内寸高</label>
                 <input
                   type="text"
                   name="innerHeight"
                   value={formData.innerHeight || ""}
                   onChange={handleChange}
                   className="w-full border rounded px-2 py-1"
                   placeholder="内寸高 (mm)"
                   style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                 />
               </div>
             </div>
           </div>

           {/* 装備/仕様 */}
           <div>
             <h3 className="text-lg font-medium mb-4">装備/仕様</h3>
             <div className="mt-4">
               <label className="block text-sm font-medium mb-2">装備/仕様</label>
               <textarea
                 name="equipment"
                 value={formData.equipment || ""}
                 onChange={handleChange}
                 className="w-full border rounded px-2 py-1 h-20"
                 placeholder="その他の装備や仕様を入力してください..."
               />
             </div>
           </div>



          <div className="flex justify-center gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTemporarySave} 
              disabled={saving}
              className="px-8"
            >
              {saving ? '保存中...' : '一時保存する'}
            </Button>
            <Button type="submit" className="px-8" disabled={saving}>
              {saving ? '保存中...' : '保存・出品する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}