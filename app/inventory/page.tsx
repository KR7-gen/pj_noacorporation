"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone } from "lucide-react"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

const generateTruckData = (bodyType: string, index: number) => {
  const makers = ["日野", "いすゞ", "三菱ふそう", "UDトラックス"];
  const sizes = ["大型", "増トン", "中型", "小型"];
  const models = {
    "日野": ["プロフィア", "レンジャー", "デュトロ"],
    "いすゞ": ["ギガ", "フォワード", "エルフ"],
    "三菱ふそう": ["スーパーグレート", "ファイター", "キャンター"],
    "UDトラックス": ["クオン", "コンドル", "カゼット"]
  };
  
  const makerIndex = Math.floor(index / 4) % 4;
  const sizeIndex = index % 4;
  const maker = makers[makerIndex];
  const size = sizes[sizeIndex];
  
  // サイズに応じてモデルを選択
  let modelIndex = 0;
  if (size === "大型") modelIndex = 0;
  else if (size === "増トン" || size === "中型") modelIndex = 1;
  else modelIndex = 2;
  
  const model = models[maker][modelIndex];
  
  // 問合せ番号の接頭辞をボディタイプごとに設定
  const prefixMap = {
    "クレーン": "C",
    "ダンプ": "D",
    "平ボディ": "F",
    "車両運搬車": "T",
    "ミキサー車": "M",
    "アルミバン": "V",
    "高所作業車": "A",
    "アルミウィング": "W",
    "キャリアカー": "K",
    "塵芥車": "G",
    "アームロール": "R",
    "特装車・その他": "S"
  };

  // インデックスを使用して決定論的に年式を生成
  const yearNumber = (index % 4) + 1;
  
  return {
    id: `${prefixMap[bodyType]}-${String(index + 1).padStart(5, "0")}`,
    maker: maker,
    model: model,
    bodyType: bodyType,
    size: size,
    price: String(Math.floor(Math.random() * 900) + 100),
    year: `令和${yearNumber}年`,
    mileage: `${Math.floor(Math.random() * 20)}0,000km`,
    capacity: `${Math.floor(Math.random() * 10) + 1},000kg`,
    transmission: Math.random() > 0.5 ? "AT" : "MT",
    inspection: Math.random() > 0.7 ? "抹消" : "有",
    status: Math.random() > 0.8 ? (Math.random() > 0.5 ? "商談中" : "SOLD OUT") : "",
  };
};

const trucks = [];
const bodyTypes = [
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
];

// 各ボディタイプに対して16パターンのデータを生成
bodyTypes.forEach(bodyType => {
  for (let i = 0; i < 16; i++) {
    trucks.push(generateTruckData(bodyType, i));
  }
});

// 複数ページ分のデータを作成
const allTrucks = trucks;

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

export default function InventoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 検索条件の状態管理
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all")
  const [formType, setFormType] = useState(searchParams.get("type") || "all")
  const [formMaker, setFormMaker] = useState(searchParams.get("maker") || "all")
  const [formSize, setFormSize] = useState(searchParams.get("size") || "all")
  const [formKeyword, setFormKeyword] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)

  // Firestoreからデータを取得
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehiclesRef = collection(db, "vehicles");
        const querySnapshot = await getDocs(vehiclesRef);
        const vehicles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSearchResults(vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // URLパラメータに基づいて初期フィルタリングを行う
  useEffect(() => {
    const type = searchParams.get("type")
    const maker = searchParams.get("maker")
    const size = searchParams.get("size")

    let filtered = allTrucks

    if (type) {
      filtered = filtered.filter(truck => truck.bodyType === type)
      setSelectedType(type)
      setFormType(type)
    }
    if (maker) {
      filtered = filtered.filter(truck => truck.maker === maker)
      setFormMaker(maker)
    }
    if (size) {
      filtered = filtered.filter(truck => truck.size === size)
      setFormSize(size)
    }

    setSearchResults(filtered)
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
    if (formMaker !== "all") params.set("maker", formMaker)
    if (formSize !== "all") params.set("size", formSize)
    router.push(`/inventory?${params.toString()}`)

    // 即時フィルタリング
    let filtered = allTrucks
    if (newType !== "all") {
      filtered = filtered.filter(truck => truck.bodyType === newType)
    }
    if (formMaker !== "all") {
      filtered = filtered.filter(truck => truck.maker === formMaker)
    }
    if (formSize !== "all") {
      filtered = filtered.filter(truck => truck.size === formSize)
    }
    setSearchResults(filtered)
  }

  // 検索ボタンクリック時のハンドラー
  const handleSearch = async () => {
    try {
      const vehiclesRef = collection(db, "vehicles");
      let querySnapshot;

      // 検索条件に基づいてクエリを構築
      if (formType !== "all") {
        const q = query(vehiclesRef, where("bodyType", "==", formType));
        querySnapshot = await getDocs(q);
      } else {
        querySnapshot = await getDocs(vehiclesRef);
      }

      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // クライアントサイドでさらにフィルタリング
      const filtered = vehicles.filter(vehicle => {
        const matchesMaker = formMaker === "all" || vehicle.maker === formMaker;
        const matchesSize = formSize === "all" || vehicle.size === formSize;
        const matchesKeyword = !formKeyword || 
          Object.values(vehicle).some(value => 
            String(value).toLowerCase().includes(formKeyword.toLowerCase())
          );

        return matchesMaker && matchesSize && matchesKeyword;
      });

      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching vehicles:", error);
    }
  };

  // 価格表示用のフォーマット関数
  const formatPrice = (price: string) => {
    return `${price}万円(税別)`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Truck Type Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">販売在庫一覧</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {vehicleTypeIcons.map((icon) => (
              <button
                key={icon.id}
                onClick={() => handleIconClick(icon.type)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center bg-white ${
                  selectedType === icon.type ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2"></div>
                <span className="text-sm text-center">{icon.type}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger>
                    <SelectValue placeholder="ボディタイプ：すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={formMaker} onValueChange={setFormMaker}>
                  <SelectTrigger>
                    <SelectValue placeholder="メーカー：すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="日野">日野</SelectItem>
                    <SelectItem value="いすゞ">いすゞ</SelectItem>
                    <SelectItem value="三菱ふそう">三菱ふそう</SelectItem>
                    <SelectItem value="UDトラックス">UDトラックス</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={formSize} onValueChange={setFormSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="大きさ：すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="大型">大型</SelectItem>
                    <SelectItem value="増トン">増トン</SelectItem>
                    <SelectItem value="中型">中型</SelectItem>
                    <SelectItem value="小型">小型</SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  placeholder="問合せ番号、車台番号など" 
                  value={formKeyword}
                  onChange={(e) => setFormKeyword(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                検索する
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {selectedType !== "all" ? selectedType : "すべて"}
              {searchResults.length > 0 && ` (${searchResults.length}件)`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 車両カード（searchResults.mapで表示している部分）を削除 */}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex justify-center gap-2">
          <Button variant="outline">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">4</Button>
          <Button variant="outline">次へ</Button>
        </div>
      </div>
    </div>
  )
}
