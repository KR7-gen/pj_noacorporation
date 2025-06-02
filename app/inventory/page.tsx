import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone } from "lucide-react"

const truckTypes = [
  "クレーン",
  "ダンプ",
  "平ボディ",
  "重機運搬車",
  "ミキサー車",
  "アルミバン",
  "高所作業車",
  "アルミウィング",
  "キャリアカー",
  "塵芥車",
  "アームロール",
  "特装車・その他",
]

const trucks = [
  {
    id: "G-00001",
    maker: "日野レンジャー",
    model: "ABC-JK1MNLI",
    type: "ダンプ",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    capacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: "商談中",
  },
  {
    id: "G-00002",
    maker: "いすゞ エルフ",
    model: "DEF-GH2OPQR",
    type: "アルミバン",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    capacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: "",
  },
  {
    id: "G-00003",
    maker: "いすゞ エルフ",
    model: "DEF-GH2OPQR",
    type: "アルミバン",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    capacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: "",
  },
  {
    id: "G-00004",
    maker: "いすゞ エルフ",
    model: "DEF-GH2OPQR",
    type: "アルミバン",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    capacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: "",
  },
  {
    id: "G-00005",
    maker: "三菱ふそう ファイター",
    model: "GHI-VTW3XQR",
    type: "重機運搬車",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    capacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: "SOLD OUT",
  },
  {
    id: "G-00006",
    maker: "三菱ふそう ファイター",
    model: "GHI-VTW3XQR",
    type: "重機運搬車",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    capacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: "SOLD OUT",
  },
]

// 複数ページ分のデータを作成
const allTrucks = Array.from({ length: 20 }, (_, i) => ({
  ...trucks[i % trucks.length],
  id: `G-${String(i + 1).padStart(5, "0")}`,
}))

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">販売在庫一覧</h1>
        </div>
      </section>

      {/* Truck Type Grid */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {truckTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  </div>
                  <p className="font-medium text-sm">{type}</p>
                </CardContent>
              </Card>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="ボディタイプ：すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {truckTypes.map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="メーカー：すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="hino">日野</SelectItem>
                    <SelectItem value="isuzu">いすゞ</SelectItem>
                    <SelectItem value="fuso">三菱ふそう</SelectItem>
                    <SelectItem value="ud">UD</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="大きさ：すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="large">大型</SelectItem>
                    <SelectItem value="medium">中型</SelectItem>
                    <SelectItem value="small">小型</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="問合せ番号、車台番号など" />
              </div>
              <Button>
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
            <h2 className="text-xl font-bold">すべて</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {allTrucks.slice(0, 20).map((truck, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <div className="text-gray-400">車両画像</div>
                    </div>
                    {truck.status && (
                      <div
                        className={`absolute top-2 left-2 px-2 py-1 rounded text-sm text-white ${
                          truck.status === "商談中"
                            ? "bg-red-500"
                            : truck.status === "SOLD OUT"
                              ? "bg-gray-500"
                              : "bg-blue-500"
                        }`}
                      >
                        {truck.status}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{truck.maker}</h3>
                    <p className="text-gray-600 text-sm mb-2">{truck.model}</p>
                    <p className="text-sm text-gray-500 mb-2">問合せ番号：{truck.id}</p>
                    <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mb-3">
                      {truck.type}
                    </p>

                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex justify-between">
                        <span>本体価格</span>
                        <span className="font-bold">{truck.price}万円(税別)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>年式</span>
                        <span>{truck.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>走行距離</span>
                        <span>{truck.mileage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>積載量</span>
                        <span>{truck.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>シフト</span>
                        <span>{truck.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>車検期限</span>
                        <span>{truck.inspection}</span>
                      </div>
                    </div>

                    <Link href={`/vehicle/${truck.id}`}>
                      <Button className="w-full" disabled={truck.status === "SOLD OUT"}>
                        詳細はこちら
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <Button variant="outline">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">4</Button>
            <Button variant="outline">次へ</Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">CONTACT</h2>
            <p className="text-xl mb-4">お問い合わせ</p>
            <p className="mb-8">
              在庫車輛の詳細/その他お問い合わせ/業販価格のご確認など
              <br />
              お電話またはお問い合わせフォームよりお気軽にお問い合わせください。
              <br />
              在庫にないトラックのご紹介も可能です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-xl mb-4">お電話でのお問い合わせ</h3>
                <p className="text-3xl font-bold mb-2">TEL. 000-000-0000</p>
                <p className="text-sm text-gray-600">受付時間：月〜土 00:00~00:00</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <h3 className="font-bold text-xl mb-4">フォームでのお問い合わせ</h3>
                <Button className="mb-4">お問い合わせフォームへ</Button>
                <p className="text-sm text-gray-600">24時間受付中</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/purchase">
              <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                トラック買取をご希望の方はこちら
                <br />
                <span className="text-sm">無料査定実施中！！</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
