"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { addVehicle } from "@/lib/firebase-utils"
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

const shifts = [
  "MT",
  "AT・SAT"
]

const vehicleStatuses = [
  "車検付き",
  "車検切れ",
  "抹消",
  "予備検査"
]

// 装備品リスト
const equipmentList = [
  "ETC", "バックカメラ", "記録簿", "パワーウィンドウ", "ドラレコ", "エアコン",
  "電動ミラー", "ABS", "アルミホイール", "エアサスシート", "カーナビ", "DPF",
  "PMマフラー", "集中ドアロック"
];

export default function VehicleNewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: "",
    price: "",
    totalPayment: "",
    bodyType: "",
    maker: "",
    size: "",
    vehicleType: "",
    model: "",
    year: "",
    month: "",
    mileage: "",
    loadingCapacity: "",
    shift: "",
    mission: "",
    inspectionStatus: "",
    inspectionDate: "",
    outerLength: "",
    outerWidth: "",
    outerHeight: "",
    totalWeight: "",
    horsepower: "",
    displacement: "",
    fuel: "",
    turbo: "",
    wholesalePrice: 0,
    description: "",
    imageUrls: [],
    equipment: [],
    chassisNumber: "",
    // 上物情報
    bodyMaker: "",
    bodyModel: "",
    bodyYear: "",
    innerLength: "",
    innerWidth: "",
    innerHeight: "",
    // 店舗関連フィールド
    storeName: "",
    storeId: undefined,
  })
  const [generatedInquiryNumber, setGeneratedInquiryNumber] = useState<string>("生成中...")
  const [stores, setStores] = useState<Store[]>([])
  const [loadingStores, setLoadingStores] = useState(true)
  
  // ファイルアップロード用のref
  const inspectionFileRef = useRef<HTMLInputElement>(null)
  const conditionFileRef = useRef<HTMLInputElement>(null)
  const [uploadingInspection, setUploadingInspection] = useState(false)
  const [uploadingCondition, setUploadingCondition] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // ページ読み込み時に問い合わせ番号を生成
  useEffect(() => {
    const generateInquiryNumber = async () => {
      try {
        // 既存の車両から最大の問い合わせ番号を取得
        const { collection, getDocs } = await import("firebase/firestore")
        const { db } = await import("@/lib/firebase")
        
        const vehiclesCollection = collection(db, "vehicles")
        const querySnapshot = await getDocs(vehiclesCollection)
        
        let maxNumber = 10000 // 10001からスタートするため、初期値は10000
        
        querySnapshot.docs.forEach(doc => {
          const data = doc.data()
          if (data.inquiryNumber) {
            // "N"プレフィックスを除去して数値部分のみを取得
            const numberPart = data.inquiryNumber.replace(/^N/, '')
            const number = parseInt(numberPart, 10)
            if (!isNaN(number) && number > maxNumber) {
              maxNumber = number
            }
          }
        })
        
        // 次の番号を生成（N + 5桁以上）
        const nextNumber = maxNumber + 1
        const generatedNumber = `N${nextNumber.toString()}`
        setGeneratedInquiryNumber(generatedNumber)
      } catch (error) {
        console.error("問い合わせ番号生成エラー:", error)
        setGeneratedInquiryNumber("エラー")
      }
    }

    generateInquiryNumber()
  }, [])

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

  // 毎月支払額シミュレーション用のハンドラー
  const handleSimulationChange = (index: number, value: string) => {
    const formattedValue = formatInputWithCommas(value);
    const simulationKey = `simulation${index + 2}Year` as keyof Vehicle;
    setFormData(prev => ({
      ...prev,
      [simulationKey]: formattedValue
    }));
  };

  // 車検証画像アップロード
  const handleInspectionImageUpload = async (file: File) => {
    try {
      setUploadingInspection(true)
      const vehicleId = `temp_${Date.now()}` // 一時的なID
      const storageRef = ref(storage, `vehicles/${vehicleId}/inspection/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setFormData(prev => ({
        ...prev,
        inspectionImageUrl: downloadURL
      }))
    } catch (err) {
      console.error('車検証画像のアップロードに失敗しました:', err)
    } finally {
      setUploadingInspection(false)
    }
  }

  // 状態表画像アップロード
  const handleConditionImageUpload = async (file: File) => {
    try {
      setUploadingCondition(true)
      const vehicleId = `temp_${Date.now()}` // 一時的なID
      const storageRef = ref(storage, `vehicles/${vehicleId}/condition/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setFormData(prev => ({
        ...prev,
        conditionImageUrl: downloadURL
      }))
    } catch (err) {
      console.error('状態表画像のアップロードに失敗しました:', err)
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

  // 車両保存時の画像URL処理を改善
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 一時的な画像URLを除外して有効な画像URLのみを取得
      const validImageUrls = formData.imageUrls?.filter(url => 
        url && 
        url.trim() !== "" && 
        !url.includes("temp_") && 
        !url.startsWith("blob:") &&
        !url.startsWith("data:")
      ) || [];

      console.log("保存する画像URL:", validImageUrls);

      const vehicleData = {
        name: formData.name,
        maker: formData.maker,
        model: formData.model,
        year: formData.year,
        month: formData.month,
        mileage: formData.mileage,
        price: Number(formData.price?.toString().replace(/,/g, '')),
        description: formData.description,
        imageUrls: validImageUrls, // 有効な画像URLのみを保存
        wholesalePrice: Number(formData.wholesalePrice?.toString().replace(/,/g, '')),
        totalPayment: Number(formData.totalPayment?.toString().replace(/,/g, '')),
        expiryDate: formData.inspectionDate,
        // その他のフィールド
        bodyType: formData.bodyType,
        size: formData.size,
        vehicleType: formData.vehicleType,
        chassisNumber: formData.chassisNumber,
        shift: formData.shift,
        inspectionStatus: formData.inspectionStatus,
        outerLength: formData.outerLength ? Number(formData.outerLength?.toString().replace(/,/g, '')) : undefined,
        outerWidth: formData.outerWidth ? Number(formData.outerWidth?.toString().replace(/,/g, '')) : undefined,
        outerHeight: formData.outerHeight ? Number(formData.outerHeight?.toString().replace(/,/g, '')) : undefined,
        totalWeight: formData.totalWeight ? Number(formData.totalWeight?.toString().replace(/,/g, '')) : undefined,
        horsepower: formData.horsepower ? Number(formData.horsepower?.toString().replace(/,/g, '')) : undefined,
        displacement: formData.displacement ? Number(formData.displacement?.toString().replace(/,/g, '')) : undefined,
        fuel: formData.fuel,
        equipment: formData.equipment ? formData.equipment.join(',') : undefined,
        inspectionImageUrl: formData.inspectionImageUrl,
        conditionImageUrl: formData.conditionImageUrl,
      }

      console.log("保存する車両データ:", vehicleData)

      const vehicleId = await addVehicle(vehicleData)
      console.log("車両保存成功:", vehicleId)

      // 成功メッセージを表示
      alert("車両が正常に登録されました")
      
      // 管理画面の車両一覧にリダイレクト
      router.push("/admin/vehicles")
    } catch (error) {
      console.error("車両保存エラー:", error)
      alert("車両の登録に失敗しました")
    } finally {
      setIsSubmitting(false)
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
          <div className="grid grid-cols-6 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">問い合わせ番号</label>
              <input
                type="text"
                value={generatedInquiryNumber}
                className={`w-full border rounded px-2 py-1 ${
                  generatedInquiryNumber === "生成中..." || generatedInquiryNumber === "エラー"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-blue-50 text-blue-700 font-medium"
                }`}
                disabled
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">トラック名</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.price}
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
                value={formData.wholesalePrice}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="4,500,000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">車両価格（税込）</label>
              <input
                type="text"
                name="totalPayment"
                value={formData.totalPayment}
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
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 h-32"
              placeholder="車両の詳細な説明を入力してください..."
            />
          </div>

          {/* 毎月支払額シミュレーション */}
          <div>
            <h3 className="text-lg font-medium mb-4">毎月支払額シミュレーション</h3>
            <div className="grid grid-cols-4 gap-6">
              {[2, 3, 4, 5].map((year, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium">{year}年</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    placeholder="100,000"
                    value={formData[`simulation${year}Year` as keyof Vehicle] as string || ""}
                    onChange={(e) => handleSimulationChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 画像アップロード */}
          <div>
            <h3 className="text-lg font-medium mb-4">画像登録</h3>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">車両登録後に画像をアップロードできます</p>
              <p className="text-sm text-gray-400">車両を保存後、編集ページで画像を追加してください</p>
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
                    name="bodyType"
                    value={formData.bodyType}
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
                    value={formData.maker}
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
                    value={formData.size}
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
                    value={formData.vehicleType}
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
                    value={formData.modelCode}
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
                    value={formData.chassisNumber}
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
                      value={formData.year}
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
                      value={formData.month}
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
                    value={formData.mileage}
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
                    value={formData.loadingCapacity}
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
                    value={formData.shift}
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
                  <label className="block text-sm font-medium">ミッション</label>
                  <input
                    type="text"
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="ミッションを入力"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車検状態</label>
                  <select
                    name="inspectionStatus"
                    value={formData.inspectionStatus}
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
                    value={formData.inspectionDate}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="outerLength"
                      value={formData.outerLength}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                      placeholder="7,000"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                    <input
                      type="text"
                      name="outerWidth"
                      value={formData.outerWidth}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                      placeholder="2,200"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                    <input
                      type="text"
                      name="outerHeight"
                      value={formData.outerHeight}
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
                    value={formData.totalWeight}
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
                    value={formData.engineModel}
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
                    value={formData.horsepower}
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
                             value={formData.turbo}
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
                    value={formData.displacement}
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

          {/* 上物情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">上物情報</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">上物メーカー</label>
                <input
                  type="text"
                  name="bodyMaker"
                  value={formData.bodyMaker}
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
                  value={formData.bodyModel}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="上物型式を入力"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">上物年式</label>
                <select
                  name="bodyYear"
                  value={formData.bodyYear}
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
                  value={formData.innerLength}
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
                  value={formData.innerWidth}
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
                  value={formData.innerHeight}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="内寸高 (mm)"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
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

          <div className="flex justify-center">
            <Button type="submit" className="px-8" disabled={isSubmitting}>
              {isSubmitting ? "登録中..." : "登録完了"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}