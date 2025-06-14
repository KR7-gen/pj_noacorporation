import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Camera } from "lucide-react"

const vehicleData = {
  id: "N-0001",
  maker: "UDトラックス",
  type: "アルミウイング",
  model: "2PG-CG5CA",
  year: "令和0年00月",
  inspection: "抹消",
  price: "000",
  totalPrice: "000",
  monthlyPayment: "000",
  details: {
    maker: "UD トラックス",
    bodySize: "L0,000　W0,000　H0000",
    model: "コンドル",
    totalWeight: "0,000kg",
    typeNumber: "000-0000000",
    engineType: "A00A",
    year: "令和0年00月",
    horsepower: "000ps",
    mileage: "000,000km",
    supercharger: "あり",
    maxLoad: "0,000kg",
    displacement: "0,000cc",
    transmission: "F0",
    fuel: "軽油",
    inspectionDate: "抹消",
    inquiryNumber: "A-00000",
  },
  bodyDetails: {
    maker: "テキスト",
    innerLength: "0,000mm",
    typeNumber: "000-0000000",
    innerWidth: "0,000mm",
    year: "令和0年00月",
    innerHeight: "0,000mm",
  },
  equipment: [
    "自動歩み",
    "ETC",
    "バックカメラ",
    "記録簿",
    "パワーウインドウ",
    "ドラレコ",
    "エアコン",
    "電動ミラー",
    "ABS",
    "アルミホイール",
    "エアサスシート",
    "カーナビ",
    "DPF",
    "PMマフラー",
    "集中ドアロック",
  ],
}

const relatedVehicles = [
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
  },
]

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

export default function VehicleDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 text-lg">
            <span>{vehicleData.id}</span>
            <span>｜</span>
            <span>{vehicleData.maker}</span>
            <span>｜</span>
            <span>{vehicleData.type}</span>
            <span>｜</span>
            <span>{vehicleData.model}</span>
            <span>｜</span>
            <span>{vehicleData.year}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Vehicle Image */}
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-gray-400 text-xl">車両画像</div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">DETAIL(車輌情報)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">メーカー</span>
                      <span>{vehicleData.details.maker}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車体寸法(mm)</span>
                      <span>{vehicleData.details.bodySize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車種</span>
                      <span>{vehicleData.details.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車両総重量</span>
                      <span>{vehicleData.details.totalWeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">型式</span>
                      <span>{vehicleData.details.typeNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">原動機型式</span>
                      <span>{vehicleData.details.engineType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">年式</span>
                      <span>{vehicleData.details.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">馬力</span>
                      <span>{vehicleData.details.horsepower}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">走行距離</span>
                      <span>{vehicleData.details.mileage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">過給器</span>
                      <span>{vehicleData.details.supercharger}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">最大積載量</span>
                      <span>{vehicleData.details.maxLoad}※2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">排気量</span>
                      <span>{vehicleData.details.displacement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">シフト</span>
                      <span>{vehicleData.details.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">燃料</span>
                      <span>{vehicleData.details.fuel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車検有効期限</span>
                      <span>{vehicleData.details.inspectionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">お問い合わせ番号</span>
                      <span>{vehicleData.details.inquiryNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-sm text-gray-600">
                  <p>
                    ※1
                    支払い総額は、千葉ナンバー登録にかかる費用を基に算出しています。また、店頭でお渡しでの価格となります。
                  </p>
                  <p>※2 抹消車両は、登録時最大積載量が減トンされる可能性が御座います。</p>
                </div>
                <div className="mt-4 flex gap-4">
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    車検証を確認
                  </Button>
                  <Button variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    状態表を確認
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Body Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">DETAIL(上物情報①)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">メーカー</span>
                      <span>{vehicleData.bodyDetails.maker}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">内寸(L)</span>
                      <span>{vehicleData.bodyDetails.innerLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">型式</span>
                      <span>{vehicleData.bodyDetails.typeNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">内寸(W)</span>
                      <span>{vehicleData.bodyDetails.innerWidth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">年式</span>
                      <span>{vehicleData.bodyDetails.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">内寸(H)</span>
                      <span>{vehicleData.bodyDetails.innerHeight}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">装備 / 仕様</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vehicleData.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary" className="justify-center py-2">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Info */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 mb-2">車検期限</div>
                  <div className="text-2xl font-bold mb-4">車輌価格</div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{vehicleData.price}</div>
                  <div className="text-xl">万円(税別)</div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>支払総額</span>
                    <span className="font-bold">{vehicleData.totalPrice}万円(税別)※1</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold mb-3">毎月返済額シュミレーション</h4>
                  <div className="flex justify-between mb-2">
                    <span>毎月の支払額</span>
                    <span className="font-bold">{vehicleData.monthlyPayment}万円(税別)〜</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Button variant="outline" size="sm">
                      2年
                    </Button>
                    <Button variant="outline" size="sm">
                      3年
                    </Button>
                    <Button variant="outline" size="sm">
                      4年
                    </Button>
                    <Button variant="outline" size="sm">
                      5年
                    </Button>
                  </div>
                  <Button variant="link" className="p-0 h-auto">
                    返済シュミレーション詳細
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">今ご覧の車両が気になったらお気軽にご相談ください！</h3>
                <p className="text-sm text-gray-600 mb-4">販売価格のご相談も承っております。</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2">お電話でのお問い合わせ</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">こちらの番号をお伝えください</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">問合せ番号</span>
                      <span className="font-bold">{vehicleData.details.inquiryNumber}</span>
                    </div>
                    <div className="text-2xl font-bold mb-2">000-000-0000</div>
                    <div className="text-sm text-gray-600">(受付時間)月〜土 00:00~00:00</div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">フォーム・LINEでのお問い合わせ</h4>
                    <div className="flex gap-2">
                      <Link 
                        href={`/contact?inquiryNumber=${vehicleData.details.inquiryNumber}`}
                        className="flex-1"
                      >
                        <Button className="w-full">お問い合わせフォーム</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Vehicles */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">関連する車両</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {relatedVehicles.map((truck, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-48 h-32 bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">車両画像</div>
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-bold mb-1">{truck.maker}</h3>
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
                      </div>

                      <Link href={`/vehicle/${truck.id}`}>
                        <Button size="sm" className="w-full">
                          詳細はこちら
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Other Vehicle Search */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">他の車両をお探しの方はこちらから</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
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

          <div className="flex gap-4">
            <Link href={`/contact?inquiryNumber=${vehicleData.details.inquiryNumber}`}>
              <Button className="w-full">この車両で問い合わせ</Button>
            </Link>
            <Link href="/inventory">
              <Button variant="outline">在庫一覧へ</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
