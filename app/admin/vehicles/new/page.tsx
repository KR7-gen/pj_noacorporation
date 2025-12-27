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

// フォーム用の型定義（数値フィールドを文字列として扱う）
type VehicleFormData = Omit<Vehicle, 'price' | 'totalPayment' | 'wholesalePrice' | 'mileage' | 'loadingCapacity' | 'outerLength' | 'outerWidth' | 'outerHeight' | 'totalWeight' | 'horsepower' | 'displacement' | 'innerLength' | 'innerWidth' | 'innerHeight'> & {
  price: string;
  totalPayment: string;
  wholesalePrice: string;
  mileage: string;
  loadingCapacity: string;
  outerLength: string;
  outerWidth: string;
  outerHeight: string;
  totalWeight: string;
  horsepower: string;
  displacement: string;
  innerLength: string;
  innerWidth: string;
  innerHeight: string;
}
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Store } from "@/types"

// プルダウンの選択肢
const bodyTypes = [
  "クレーン",
  "ダンプ・ローダーダンプ",
  "ミキサー車",
  "アームロール",
  "重機回送車・セルフクレーン",
  "キャリアカー・車両運搬車",
  "高所作業車",
  "塵芥車",
  "平ボディ",
  "バン・ウイング",
  "冷蔵冷凍車",
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
  "ホンダ",
  "スバル",
  "スズキ",
  "ダイハツ",
  "ベンツ",
  "ボルボ",
  "スカニア",
  "東急",
  "東邦車輌",
  "花見台",
  "トレクス",
  "トレモ",
  "フルハーフ",
  "ユソーキ",
  "ダイニチ",
  "アンチコ",
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
  "アトラス",
  "タイタン",
  "ボンゴ",
  "ダイナ",
  "トヨエース",
  "ハイエース",
  "ライトエース",
  "タウンエース",
  "キャリイ",
  "サンバー",
  "レインボー",
  "リエッセ",
  "ジャーニー",
  "ローザ",
  "シビリアン",
  "パークウェイ",
  "コースター",
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

const mileageStatuses = [
  "実走行",
  "メーター改ざん",
  "メーター交換",
  "不明"
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
  const [formData, setFormData] = useState<Partial<VehicleFormData>>({
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
    mileageStatus: "実走行",
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
    equipment: "",
    chassisNumber: "",
    inquiryNumber: "",
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
    reflectInPurchaseAchievements: false,
    negotiationDeadline: "",
    salesRepresentative: "",
    customerName: "",
  })
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
      const currentEquipment = prev.equipment || "";
      const equipmentList = currentEquipment ? currentEquipment.split(',') : [];
      
      if (equipmentList.includes(item)) {
        const newList = equipmentList.filter((e) => e !== item);
        return { ...prev, equipment: newList.join(',') };
      } else {
        const newList = [...equipmentList, item];
        return { ...prev, equipment: newList.join(',') };
      }
    });
  };

  // 毎月支払額シミュレーション用のハンドラー
  const handleSimulationChange = (index: number, value: string) => {
    const formattedValue = formatInputWithCommas(value);
    const simulationKey = `simulation${index + 2}Year` as keyof VehicleFormData;
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
    if (isSubmitting) return // 多重送信防止
    
    // 問合せ番号の必須チェック
    if (!formData.inquiryNumber || formData.inquiryNumber.trim() === "") {
      alert("問合せ番号は必須項目です")
      return
    }
    
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

      // デバッグ用ログ：保存直前の送信データ
      console.log("一時保存直前の送信データ:", {
        storeId: formData.storeId,
        modelCode: formData.modelCode,
        turbo: formData.turbo,
        storeName: formData.storeName
      });

      const vehicleData: any = {
        name: formData.name || "",
        maker: formData.maker || "",
        model: formData.modelCode || "", // 型式をmodelに設定
        modelCode: formData.modelCode || "", // 追加
        year: formData.year || "",
        month: formData.month || "",
        mileage: Number(formData.mileage?.toString().replace(/,/g, '')) || 0,
        price: Number(formData.price?.toString().replace(/,/g, '')) || 0,
        description: formData.description || "",
        imageUrls: validImageUrls, // 有効な画像URLのみを保存
        wholesalePrice: Number(formData.wholesalePrice?.toString().replace(/,/g, '')) || 0,
        totalPayment: Number(formData.totalPayment?.toString().replace(/,/g, '')) || 0,
        expiryDate: formData.inspectionDate || "",
        // その他のフィールド
        bodyType: formData.bodyType || "",
        size: formData.size || "",
        vehicleType: formData.vehicleType || "",
        chassisNumber: formData.chassisNumber || "",
        shift: formData.shift || "",
        mileageStatus: formData.mileageStatus || "実走行",
        turbo: formData.turbo || "", // 追加
        inspectionStatus: formData.inspectionStatus || "",
        loadingCapacity: formData.loadingCapacity ? Number(formData.loadingCapacity.toString().replace(/,/g, '')) : undefined,
        inspectionDate: formData.inspectionDate || "",
        outerLength: formData.outerLength ? Number(formData.outerLength.toString().replace(/,/g, '')) : undefined,
        outerWidth: formData.outerWidth ? Number(formData.outerWidth.toString().replace(/,/g, '')) : undefined,
        outerHeight: formData.outerHeight ? Number(formData.outerHeight.toString().replace(/,/g, '')) : undefined,
        totalWeight: formData.totalWeight ? Number(formData.totalWeight.toString().replace(/,/g, '')) : undefined,
        horsepower: formData.horsepower ? Number(formData.horsepower.toString().replace(/,/g, '')) : undefined,
        displacement: formData.displacement ? Number(formData.displacement.toString().replace(/,/g, '')) : undefined,
        fuel: formData.fuel || "",
        equipment: formData.equipment || "",
        inspectionImageUrl: formData.inspectionImageUrl || "",
        conditionImageUrl: formData.conditionImageUrl || "",
        // エンジン情報
        engineModel: formData.engineModel || "",
        // 上物情報
        bodyMaker: formData.bodyMaker || "",
        bodyModel: formData.bodyModel || "",
        bodyYear: formData.bodyYear || "",
        innerLength: formData.innerLength ? Number(formData.innerLength.toString().replace(/,/g, '')) : undefined,
        innerWidth: formData.innerWidth ? Number(formData.innerWidth.toString().replace(/,/g, '')) : undefined,
        innerHeight: formData.innerHeight ? Number(formData.innerHeight.toString().replace(/,/g, '')) : undefined,
        // 店舗情報
        storeId: formData.storeId || undefined, // 追加
        storeName: formData.storeName || "", // 追加
        // 商談関連フィールド
        isNegotiating: formData.isNegotiating || false,
        isSoldOut: formData.isSoldOut || false,
        isPrivate: formData.isPrivate || false,
        reflectInPurchaseAchievements: formData.reflectInPurchaseAchievements || false,
        isTemporarySave: true, // 一時保存としてマーク
        negotiationDeadline: formData.negotiationDeadline || "",
        salesRepresentative: formData.salesRepresentative || "",
        customerName: formData.customerName || "",
        // 問合せ番号
        inquiryNumber: formData.inquiryNumber || "",
      }

      console.log("一時保存する車両データ:", vehicleData)

      const vehicleId = await addVehicle(vehicleData)
      console.log("車両一時保存成功:", vehicleId)

      // 成功メッセージを表示
      alert("車両が一時保存されました")
      
      // 一時保存成功後は車両一覧へ遷移
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
      // 問合せ番号の必須チェック
      if (!formData.inquiryNumber || formData.inquiryNumber.trim() === "") {
        alert("問合せ番号は必須項目です")
        setIsSubmitting(false)
        return
      }

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
        name: formData.name || "",
        maker: formData.maker || "",
        model: formData.modelCode || "", // 型式をmodelに設定
        modelCode: formData.modelCode || "",
        year: formData.year || "",
        month: formData.month || "",
        mileage: Number(formData.mileage?.toString().replace(/,/g, '')) || 0,
        price: Number(formData.price?.toString().replace(/,/g, '')) || 0,
        description: formData.description || "",
        imageUrls: validImageUrls, // 有効な画像URLのみを保存
        wholesalePrice: Number(formData.wholesalePrice?.toString().replace(/,/g, '')) || 0,
        totalPayment: Number(formData.totalPayment?.toString().replace(/,/g, '')) || 0,
        inspectionDate: formData.inspectionDate || "",
        expiryDate: formData.inspectionDate || "",
        // その他のフィールド
        bodyType: formData.bodyType || "",
        size: formData.size || "",
        vehicleType: formData.vehicleType || "",
        chassisNumber: formData.chassisNumber || "",
        shift: formData.shift || "",
        mileageStatus: formData.mileageStatus || "実走行",
        turbo: formData.turbo || "",
        inspectionStatus: formData.inspectionStatus || "",
        outerLength: formData.outerLength ? Number(formData.outerLength.toString().replace(/,/g, '')) : undefined,
        outerWidth: formData.outerWidth ? Number(formData.outerWidth.toString().replace(/,/g, '')) : undefined,
        outerHeight: formData.outerHeight ? Number(formData.outerHeight.toString().replace(/,/g, '')) : undefined,
        totalWeight: formData.totalWeight ? Number(formData.totalWeight.toString().replace(/,/g, '')) : undefined,
        horsepower: formData.horsepower ? Number(formData.horsepower.toString().replace(/,/g, '')) : undefined,
        displacement: formData.displacement ? Number(formData.displacement.toString().replace(/,/g, '')) : undefined,
        fuel: formData.fuel || "",
        equipment: formData.equipment || "",
        inspectionImageUrl: formData.inspectionImageUrl || "",
        // エンジン情報
        engineModel: formData.engineModel || "",
        // 上物情報
        bodyMaker: formData.bodyMaker || "",
        bodyModel: formData.bodyModel || "",
        bodyYear: formData.bodyYear || "",
        innerLength: formData.innerLength ? Number(formData.innerLength.toString().replace(/,/g, '')) : undefined,
        innerWidth: formData.innerWidth ? Number(formData.innerWidth.toString().replace(/,/g, '')) : undefined,
        innerHeight: formData.innerHeight ? Number(formData.innerHeight.toString().replace(/,/g, '')) : undefined,
        // 店舗
        storeId: formData.storeId || undefined,
        storeName: formData.storeName || "",
        // 商談関連フィールド
        isNegotiating: formData.isNegotiating || false,
        isSoldOut: formData.isSoldOut || false,
        isPrivate: formData.isPrivate || false,
        reflectInPurchaseAchievements: formData.reflectInPurchaseAchievements || false,
        isTemporarySave: false, // 通常保存としてマーク
        negotiationDeadline: formData.negotiationDeadline || "",
        salesRepresentative: formData.salesRepresentative || "",
        customerName: formData.customerName || "",
        // 問合せ番号
        inquiryNumber: formData.inquiryNumber || "",
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
                <label className="block text-sm font-medium">
                  問い合わせ番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="inquiryNumber"
                  value={formData.inquiryNumber || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="問い合わせ番号を入力"
                  required
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
                {loadingStores ? (
                  <div className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-500">
                    店舗データ読み込み中...
                  </div>
                ) : (
                  <select
                    name="storeId"
                    value={formData.storeId || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">店舗を選択してください</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                )}
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
              
              {/* 3行目：SOLD OUTスイッチ + 非公開スイッチ + 実績反映 + 空欄 + 空欄 */}
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
                {/* 実績反映スイッチ */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="reflectInPurchaseAchievements" className="text-base">買取実績ページに反映させる</Label>
                  <Switch
                    id="reflectInPurchaseAchievements"
                    checked={formData.reflectInPurchaseAchievements || false}
                    onCheckedChange={(checked) => handleNegotiationChange('reflectInPurchaseAchievements', checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>

          {/* 画像アップロード（編集画面と同じUI） */}
          <div>
            <h3 className="text-lg font-medium mb-4">画像登録</h3>
            <ImageUploader
              images={(formData.imageUrls || []).filter((url) => 
                url && 
                url.trim() !== "" && 
                !url.includes("temp_") && 
                !url.startsWith("blob:") &&
                !url.startsWith("data:")
              )}
              onImagesChange={(images) => setFormData((prev) => ({ ...prev, imageUrls: images }))}
            />
          </div>

          {/* 車検証画像（編集画面と同じUI） */}
          <div>
            <h3 className="text-lg font-medium mb-4">車検証画像</h3>
            <div className="space-y-4">
              <input
                type="file"
                ref={inspectionFileRef}
                onChange={handleFileSelect(inspectionFileRef as React.RefObject<HTMLInputElement>, handleInspectionImageUpload)}
                accept="image/*,.pdf"
                className="hidden"
              />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inspectionFileRef.current?.click()}
                    disabled={uploadingInspection}
                    className="w-full"
                  >
                    {uploadingInspection ? "アップロード中..." : "車検証を選択"}
                  </Button>
                </div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              {formData.inspectionImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">アップロード済み:</p>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500">📄</span>
                      <a 
                        href={formData.inspectionImageUrl as string} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        車検証を表示
                      </a>
                    </div>
                    <div className="mt-2">
                      <img 
                        src={formData.inspectionImageUrl as string} 
                        alt="車検証" 
                        className="max-w-full h-auto max-h-64 rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class=\"flex items-center gap-2 p-4 bg-gray-50 rounded\"> 
                                <span class=\"text-red-500 text-2xl\">📄</span>
                                <span class=\"text-gray-700\">PDFファイル</span>
                                <a href=\"${formData.inspectionImageUrl}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:underline ml-2\">
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

          {/* 状態表画像セクションは不要のため削除 */}

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
                    placeholder="840"
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
                    placeholder="249"
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
                    placeholder="323"
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
                    placeholder="2025/09/08"
                  />
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>

              {/* 6行目：走行距離 + 実走行かどうか + シフト + 馬力 + 過給機 */}
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
                  <label className="block text-sm font-medium">実走行かどうか</label>
                  <select
                    name="mileageStatus"
                    value={formData.mileageStatus || "実走行"}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    {mileageStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
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
                    placeholder="620"
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
                    placeholder="240"
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
                    placeholder="196"
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

            </form>
      </div>

      {/* 固定フッターボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTemporarySave} 
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[120px] text-sm sm:text-base"
            >
              {isSubmitting ? "保存中..." : "一時保存する"}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[140px] text-sm sm:text-base"
              onClick={(e) => {
                e.preventDefault();
                const form = document.querySelector('form');
                if (form) {
                  form.requestSubmit();
                }
              }}
            >
              {isSubmitting ? "登録中..." : "車両を登録する"}
            </Button>
          </div>
        </div>
      </div>

      {/* フッターの高さ分の余白を追加 */}
      <div className="h-16 sm:h-20"></div>
    </div>
  );
}