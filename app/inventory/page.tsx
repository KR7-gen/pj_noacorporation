"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone } from "lucide-react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Vehicle } from "@/types"

const truckTypes = [
  "クレーン",
  "ダンプ",
  "平ボディ",
  "車両運搬車",
  "ミキサー車",
  "アルミバン",
  "高所作業車",
  "アルミウィング",
  "キャリアカー",
  "塵芥車",
  "アームロール",
  "特装車・その他",
]

// 車両タイプのアイコンデータ
const vehicleTypeIcons = [
  { id: 1, type: "クレーン", icon: "/icons/crane.png" },
  { id: 2, type: "ダンプ", icon: "/icons/dump.png" },
  { id: 3, type: "平ボディ", icon: "/icons/flatbed.png" },
  { id: 4, type: "車両運搬車", icon: "/icons/carrier.png" },
  { id: 5, type: "ミキサー車", icon: "/icons/mixer.png" },
  { id: 6, type: "アルミバン", icon: "/icons/van.png" },
  { id: 7, type: "高所作業車", icon: "/icons/aerial.png" },
  { id: 8, type: "アルミウィング", icon: "/icons/wing.png" },
  { id: 9, type: "キャリアカー", icon: "/icons/car-carrier.png" },
  { id: 10, type: "塵芥車", icon: "/icons/garbage.png" },
  { id: 11, type: "アームロール", icon: "/icons/arm-roll.png" },
  { id: 12, type: "特装車・その他", icon: "/icons/special.png" },
]

// メーカーとサイズの固定リスト
const makers = [
  "日野",
  "いすゞ",
  "三菱ふそう",
  "UDトラックス",
  "その他"
];

const sizes = [
  "大型",
  "増トン",
  "中型",
  "小型"
];

export default function InventoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 検索条件の状態管理
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all")
  const [formType, setFormType] = useState(searchParams.get("type") || "all")
  const [formMaker, setFormMaker] = useState(searchParams.get("maker") || "all")
  const [formSize, setFormSize] = useState(searchParams.get("size") || "all")
  const [formKeyword, setFormKeyword] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  // Firestoreからデータを取得
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehiclesRef = collection(db, "vehicles");
        const querySnapshot = await getDocs(vehiclesRef);
        const fetchedVehicles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        setVehicles(fetchedVehicles);
        setFilteredVehicles(fetchedVehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = vehicles;

    // ボディタイプでフィルタリング
    if (selectedType !== "all") {
      filtered = filtered.filter(vehicle => vehicle.bodyType === selectedType);
    }

    // メーカーでフィルタリング
    if (formMaker !== "all") {
      filtered = filtered.filter(vehicle => vehicle.maker === formMaker);
    }

    // サイズでフィルタリング
    if (formSize !== "all") {
      filtered = filtered.filter(vehicle => vehicle.size === formSize);
    }

    // キーワード検索
    if (formKeyword.trim()) {
      const keyword = formKeyword.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.name.toLowerCase().includes(keyword) ||
        vehicle.maker.toLowerCase().includes(keyword) ||
        vehicle.model.toLowerCase().includes(keyword) ||
        vehicle.description.toLowerCase().includes(keyword)
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, selectedType, formMaker, formSize, formKeyword]);

  // URLパラメータに基づいて初期フィルタリングを行う
  useEffect(() => {
    const type = searchParams.get("type")
    const maker = searchParams.get("maker")
    const size = searchParams.get("size")

    if (type) {
      setSelectedType(type)
      setFormType(type)
    }
    if (maker) {
      setFormMaker(maker)
    }
    if (size) {
      setFormSize(size)
    }
  }, [searchParams])

  // アイコンクリック時の処理
  const handleIconClick = (type: string) => {
    const newType = selectedType === type ? "all" : type
    setSelectedType(newType)
    setFormType(newType)

    // URLを更新
    const params = new URLSearchParams(searchParams)
    if (newType === "all") {
      params.delete("type")
    } else {
      params.set("type", newType)
    }
    router.push(`/inventory?${params.toString()}`)
  }

  // 検索実行
  const handleSearch = async () => {
    const params = new URLSearchParams()
    
    if (formType !== "all") params.set("type", formType)
    if (formMaker !== "all") params.set("maker", formMaker)
    if (formSize !== "all") params.set("size", formSize)
    
    router.push(`/inventory?${params.toString()}`)
  }

  // デバッグ用：コンソールに出力
  console.log("取得した車両データ:", vehicles)
  console.log("メーカー一覧:", makers)
  console.log("サイズ一覧:", sizes)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">在庫車両一覧</h1>
          <p className="text-lg text-gray-600">豊富な在庫からお探しの車両をお選びください</p>
        </div>

        {/* 車両タイプアイコン */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                selectedType === "all"
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white border-2 border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleIconClick("all")}
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
                <span className="text-gray-600 font-bold">ALL</span>
              </div>
              <span className="text-sm font-medium text-gray-700">すべて</span>
            </div>
            {vehicleTypeIcons.map((icon) => (
              <div
                key={icon.id}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                  selectedType === icon.type
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white border-2 border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleIconClick(icon.type)}
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
                  <span className="text-gray-600 font-bold">{icon.type.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{icon.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 検索フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={formType} onValueChange={setFormType}>
              <SelectTrigger>
                <SelectValue placeholder="車両タイプ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのタイプ</SelectItem>
                {truckTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={formMaker} onValueChange={setFormMaker}>
              <SelectTrigger>
                <SelectValue placeholder="メーカー" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのメーカー</SelectItem>
                {makers.map((maker) => (
                  <SelectItem key={maker} value={maker}>
                    {maker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={formSize} onValueChange={setFormSize}>
              <SelectTrigger>
                <SelectValue placeholder="大きさ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのサイズ</SelectItem>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="キーワード検索"
              value={formKeyword}
              onChange={(e) => setFormKeyword(e.target.value)}
            />

            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              検索
            </Button>
          </div>
        </div>

        {/* 結果件数 */}
        <div className="mb-6">
          <p className="text-gray-600">
            検索結果: <span className="font-semibold">{filteredVehicles.length}</span>件
            {vehicles.length === 0 && (
              <span className="ml-2 text-orange-600">
                （車両データが登録されていません。adminで車両を登録してください）
              </span>
            )}
          </p>
        </div>

        {/* 車両一覧 */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">該当する車両が見つかりませんでした。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={vehicle.imageUrls?.[0] || vehicle.imageUrl || "/placeholder.jpg"}
                      alt={vehicle.name}
                      className="w-full h-48 object-cover"
                    />
                    {vehicle.bodyType && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        {vehicle.bodyType}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>メーカー: {vehicle.maker}</p>
                      <p>モデル: {vehicle.model}</p>
                      <p>年式: {String(vehicle.year || "")}</p>
                      <p>走行距離: {vehicle.mileage}</p>
                      {vehicle.size && <p>サイズ: {vehicle.size}</p>}
                      {vehicle.inspectionDate && <p>車検: {vehicle.inspectionDate}</p>}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          ¥{(vehicle.price || 0).toLocaleString()}
                        </span>
                        <Link href={`/vehicle/${vehicle.id}`}>
                          <Button size="sm">詳細を見る</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* お問い合わせボタン */}
        <div className="text-center mt-12">
          <Link href="/contact">
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              <Phone className="w-5 h-5" />
              お問い合わせ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
