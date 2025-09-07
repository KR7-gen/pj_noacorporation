"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { addVehicle } from "@/lib/firebase-utils"
import ImageUploader from "@/components/ImageUploader"
import { formatNumberWithCommas, formatInputWithCommas } from "@/lib/utils"
import type { Vehicle } from "@/types"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Store } from "@/types"

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
  "トヨタ",
  "日産",
  "マツダ",
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

// 年式選択肢を生成する関数
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let i = 0; i < 45; i++) {
    const year = currentYear - i;
    let eraYear;
    
    if (year >= 2019) {
      // 令和
      eraYear = `R${year - 2018}`;
    } else if (year >= 1989) {
      // 平成
      eraYear = `H${year - 1988}`;
    } else {
      // 昭和
      eraYear = `S${year - 1925}`;
    }
    
    years.push(eraYear);
  }
  
  return years;
};

const years = generateYears();

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

// 営業担当の選択肢
const salesRepresentatives = ["営業A", "営業B", "営業C"]

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
    modelCode: "",
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
    wholesalePrice: "",
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
    // エンジン情報
    engineModel: "",
    // 店舗関連フィールド
    storeName: "",
    storeId: undefined,
    // 商談関連フィールド
    isNegotiating: false,
    isSoldOut: false,
    isPrivate: false,
    isTemporarySave: false, // 一時保存状態
    negotiationDeadline: "",
    salesRepresentative: "",
    customerName: "",
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
        console.log('店舗データを取得中...')
        
        const response = await fetch('/api/stores')
        console.log('店舗APIレスポンス:', response.status, response.ok)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('店舗APIエラー:', errorText)
          throw new Error(`店舗データの取得に失敗しました: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('取得した店舗データ:', data)
        setStores(data)
      } catch (error) {
        console.error('店舗データ取得エラー:', error)
        // エラー時は空配列を設定
        setStores([])
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

  // トラック名の自動反映
  useEffect(() => {
    if (formData.maker && formData.vehicleType) {
      const truckName = `${formData.maker} ${formData.vehicleType}`;
      setFormData((prev) => ({
        ...prev,
        name: truckName,
      }));
    }
  }, [formData.maker, formData.vehicleType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    // 店舗選択の場合の特別処理
    if (name === 'storeId') {
      const selectedStore = stores.find(store => store.id === value)
      setFormData((prev) => ({
        ...prev,
        storeId: value || undefined,
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

  // 一時保存ハンドラー
  const handleTemporarySave = async (e: React.FormEvent) => {
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

      console.log("一時保存する画像URL:", validImageUrls);

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
        fuel: formData.fuel || "",
        equipment: formData.equipment ? formData.equipment.join(',') : "",
        inspectionImageUrl: formData.inspectionImageUrl || "",
        conditionImageUrl: formData.conditionImageUrl || "",
        // エンジン情報
        engineModel: formData.engineModel || "",
        // 商談関連フィールド
        isNegotiating: formData.isNegotiating || false,
        isSoldOut: formData.isSoldOut || false,
        isPrivate: formData.isPrivate || false,
        isTemporarySave: true, // 一時保存としてマーク
        negotiationDeadline: formData.negotiationDeadline || "",
        salesRepresentative: formData.salesRepresentative || "",
        customerName: formData.customerName || "",
      }

      console.log("一時保存する車両データ:", vehicleData)

      const vehicleId = await addVehicle(vehicleData)
      console.log("車両一時保存成功:", vehicleId)

      // 成功メッセージを表示
      alert("車両が一時保存されました")
      
      // 管理画面の車両一覧にリダイレクト
      router.push("/admin/vehicles")
    } catch (error) {
      console.error("車両一時保存エラー:", error)
      alert("車両の一時保存に失敗しました")
    } finally {
      setIsSubmitting(false)
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
        fuel: formData.fuel || "",
        equipment: formData.equipment ? formData.equipment.join(',') : "",
        inspectionImageUrl: formData.inspectionImageUrl || "",
        conditionImageUrl: formData.conditionImageUrl || "",
        // エンジン情報
        engineModel: formData.engineModel || "",
        // 商談関連フィールド
        isNegotiating: formData.isNegotiating || false,
        isSoldOut: formData.isSoldOut || false,
        isPrivate: formData.isPrivate || false,
        isTemporarySave: false, // 通常保存としてマーク
        negotiationDeadline: formData.negotiationDeadline || "",
        salesRepresentative: formData.salesRepresentative || "",
        customerName: formData.customerName || "",
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">新規車両登録</h1>
        <Button 
          variant="outline" 
          onClick={() => router.push('/admin/vehicles')}
        >
          一覧に戻る
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* 基本情報 */}
              <div className="space-y-6">
            {/* 1行目：問い合わせ番号 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            {/* 2行目：トラック名 + 在庫店舗名 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">トラック名</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700"
                  placeholder="メーカーと車種を選択すると自動入力されます"
                  readOnly
                  disabled
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
              <div></div>
            </div>

            {/* 3行目：業販金額 + 車両価格（税抜）+ 車両総額 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <label className="block text-sm font-medium">車両総額</label>
                <input
                  type="text"
                  name="totalPayment"
                  value={formData.totalPayment}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="5,500,000"
                />
              </div>
              <div></div>
              <div></div>
            </div>
          </div>

          {/* 商談管理セクション */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">商談管理</h3>
            <div className="space-y-6">
              {/* 1行目：商談中スイッチ + 商談期限 + 空欄 + 空欄 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
                <div></div>
                <div></div>
              </div>
              
              {/* 2行目：営業担当 + 顧客名 + 空欄 + 空欄 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div>
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
                <div></div>
                <div></div>
                <div></div>
              </div>
              
              {/* 3行目：SOLD OUTスイッチ + 非公開スイッチ + 空欄 + 空欄 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
                <div></div>
                <div></div>
              </div>
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
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">車両情報</h3>
            <div className="space-y-6">
              {/* 1行目：年式 + 車体番号 + 空欄 + 空欄 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
                <div></div>
                <div></div>
              </div>

              {/* 2行目：メーカー + 車種 + 型式 + 原動機型式 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
              </div>

              {/* 3行目：大きさ + ボディタイプ + 積載量 + 車両総重量 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              </div>

              {/* 4行目：排気量 + 燃料 + 車体寸法（L）+ 車体寸法（W）+ 車体寸法（H） */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法（L）</label>
                  <input
                    type="text"
                    name="outerLength"
                    value={formData.outerLength}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="7,000"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法（W）</label>
                  <input
                    type="text"
                    name="outerWidth"
                    value={formData.outerWidth}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    placeholder="2,200"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法（H）</label>
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
                <div></div>
              </div>

              {/* 5行目：車検状態 + 車検有効期限 + 空欄 + 空欄 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
                <div></div>
                <div></div>
              </div>

              {/* 6行目：走行距離 + シフト + 馬力 + 過給機 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
              </div>
            </div>
          </div>



          {/* 上物情報 */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">上物情報</h3>
            <div className="space-y-6">
              {/* 1行目：上物メーカー + 上物型式 + 上物年式 + 空欄 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
                <div></div>
              </div>

              {/* 2行目：内寸長 + 内寸幅 + 内寸高 + 空欄 + 空欄 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div></div>
                <div></div>
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

              <div className="flex justify-center gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTemporarySave} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "保存中..." : "一時保存する"}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "登録中..." : "車両を登録する"}
                </Button>
              </div>
            </form>
      </div>
    </div>
  );
}