"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Search } from "lucide-react"
import { news } from "./news/newsData"

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

const newTrucks = [
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
]

const features = [
  {
    number: "01",
    title: "中古トラックをどこよりも安く仕入れる買付力",
    description: "独自の仕入れルートから直接仕入れることで、コストを削減し、お客様に最適な価格でご提供しています。",
  },
  {
    number: "02",
    title: "見えない車輌状態を明らかにする入庫検査技術と評価基準",
    description: "専門の検査技術により、車両の真の状態を徹底的に調査し、透明性の高い評価をお客様にお伝えします。",
  },
  {
    number: "03",
    title: "お客様が納得できるトラック選びをお手伝いする営業担当",
    description: "業界経験豊富な営業担当が、お客様のニーズに合った最適なトラック選びをサポートいたします。",
  },
]

const flowSteps = [
  {
    number: "01",
    title: "お問い合わせ",
    description:
      "毎週入庫している販売在庫一覧から、トラックをお探しください。整備中や買取交渉中で未掲載の車輌も多数あるため、もし要件を満たすトラックが見つからない場合も、まずは気軽にご相談ください。",
  },
  {
    number: "02",
    title: "現車確認・ご商談",
    description:
      "気になった車輌は、千葉県佐倉市の展示場で実際に現車確認いただくことができます。もし現地までお越しいただくことが難しい場合も、当社独自の車輌状態表をもとに、お電話で車輌の詳細な状態までお伝えすることも可能です。",
  },
  {
    number: "03",
    title: "お見積もり",
    description:
      "お客様のご状況・ご要望をお伺いした上で、ナンバー登録や輸送料、車検整備やバッテリー・タイヤ交換といった各種オプションを含めた、最終的なお見積り金額をお伝えします。ローンやリースなどへの対応も可能ですので、ご相談ください。",
  },
  {
    number: "04",
    title: "ご契約・ご納車",
    description:
      "お見積もり内容に納得いただけましたら、FAX/郵送での契約書ご署名、ご入金を経て、お引き渡しとなります。当社では、お客様とのお取引履歴をすべて社内システムで管理しております。",
  },
]

const faqs = [
  {
    question: "展示場はいつでも見学可能ですか？",
    answer:
      "日曜・祝日を除く毎日、9:00-18:00 までご見学いただけます。対応できる人員に限りがあるため、事前にお電話か問い合わせフォームにて見学ご希望とお知らせの上、お越しください。",
  },
  {
    question: "在庫にない車も、探してもらうことはできますか?",
    answer:
      "喜んでお手伝いします！オークションや過去の取引事業者など、弊社の持てる限りのネットワークを駆使して、ご希望のトラックを探索します。",
  },
]

// 車両タイプのアイコンデータ
const vehicleTypeIcons = [
  { id: 1, type: "クレーン", icon: "/icons/crane.png" },
  { id: 2, type: "ダンプ", icon: "/icons/dump.png" },
  { id: 3, type: "平ボディ", icon: "/icons/flatbed.png" },
  { id: 4, type: "車輌運搬車", icon: "/icons/carrier.png" },
  { id: 5, type: "ミキサー車", icon: "/icons/mixer.png" },
  { id: 6, type: "アルミバン", icon: "/icons/van.png" },
  { id: 7, type: "高所作業車", icon: "/icons/aerial.png" },
  { id: 8, type: "アルミウィング", icon: "/icons/wing.png" },
  { id: 9, type: "キャリアカー", icon: "/icons/car-carrier.png" },
  { id: 10, type: "塵芥車", icon: "/icons/garbage.png" },
  { id: 11, type: "アームロール", icon: "/icons/arm-roll.png" },
  { id: 12, type: "特装車・その他", icon: "/icons/special.png" },
]

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

// モックデータ
const mockVehicles = [
  {
    id: "G-00001",
    name: "日野レンジャー",
    code: "ABC-JK1MNLI",
    inquiryNumber: "G-00001",
    bodyType: "ダンプ",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    loadCapacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: "商談中"
  },
  {
    id: "G-00002",
    name: "いすゞ エルフ",
    code: "DEF-GH2OPQR",
    inquiryNumber: "G-00002",
    bodyType: "アルミバン",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    loadCapacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: ""
  },
  {
    id: "G-00003",
    name: "いすゞ エルフ",
    code: "DEF-GH2OPQR",
    inquiryNumber: "G-00003",
    bodyType: "アルミバン",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    loadCapacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: ""
  },
  {
    id: "G-00004",
    name: "いすゞ エルフ",
    code: "DEF-GH2OPQR",
    inquiryNumber: "G-00004",
    bodyType: "アルミバン",
    price: "000",
    year: "平成00年00月",
    mileage: "00,000km",
    loadCapacity: "0,000kg",
    transmission: "AT",
    inspection: "抹消",
    status: ""
  }
];

export default function HomePage() {
  // 検索条件の状態管理
  const [selectedType, setSelectedType] = useState("");
  const [searchResults, setSearchResults] = useState(mockVehicles);

  // アイコンクリック時のハンドラー
  const handleIconClick = (type: string) => {
    setSelectedType(type);
    filterVehicles(type);
  };

  // 検索ボタンクリック時のハンドラー
  const handleSearch = () => {
    filterVehicles(selectedType);
  };

  // フィルタリング関数
  const filterVehicles = (type: string) => {
    if (!type) {
      setSearchResults(mockVehicles);
    } else {
      const filtered = mockVehicles.filter(vehicle => vehicle.bodyType === type);
      setSearchResults(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">業界最安値を目指す、千葉の中古トラック販売店です。</h1>
            <p className="text-xl md:text-2xl mb-8">
              中古トラック購入の、無駄なコストをカットしませんか？
              <br />
              限界ギリギリの安さ、ぜひ他店様と比べてみてください！
            </p>
          </div>
        </div>
      </section>

      {/* Truck Type Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {vehicleTypeIcons.map((icon) => (
              <Link
                key={icon.id}
                href={`/inventory?type=${encodeURIComponent(icon.type)}`}
                className="p-4 rounded-lg flex flex-col items-center justify-center bg-white hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                </div>
                <span className="text-sm text-center">{icon.type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">ボディタイプ：すべて</option>
                {vehicleTypeIcons.map((icon) => (
                  <option key={icon.id} value={icon.type}>{icon.type}</option>
                ))}
              </select>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">メーカー：すべて</option>
                {makers.map((maker) => (
                  <option key={maker} value={maker}>{maker}</option>
                ))}
              </select>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">大きさ：すべて</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="問合せ番号、車台番号など"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
            >
              検索する
            </button>
          </div>
        </div>
      </section>

      {/* New Trucks Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">NEW TRUCK</h2>
            <p className="text-xl text-gray-600 mb-2">新着車輌</p>
            <p className="text-lg">
              現在、<span className="text-2xl font-bold text-blue-600">000</span>台の在庫が閲覧可能です
            </p>
          </div>

          <div className="text-center">
            <Link href="/inventory">
              <Button variant="outline" size="lg">
                在庫をもっと見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">FEATURE</h2>
            <p className="text-xl text-gray-600 mb-8">当社の特徴</p>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed">
                中古トラックを、価格とスペックだけで選んでいませんか？ 事実、市場に流通する車両は玉石混交。
                修復歴や車両の状態、載せ替えされたボディや上物など、
                販売サイトに掲載されている情報だけではわからない事実によって、そのトラックの本当の価値は決まります。
                グルーウェーブの自慢は、中古トラックをどこよりも安く仕入れる買い付け力と、
                一見しただけでは分からない車輌の状態を徹底的に明らかにする入庫検査の技術。
                透明な評価基準に基づいた、理由のある安さで、あなたが本当に納得できるトラック選びをお手伝いしています。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-blue-600 mb-4">reason</div>
                  <div className="text-6xl font-bold text-gray-300 mb-4">{feature.number}</div>
                  <h3 className="font-bold text-lg mb-4 leading-tight">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/about">
              <Button variant="outline" size="lg">
                詳しく見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">FLOW</h2>
            <p className="text-xl text-gray-600 mb-4">ご利用の流れ</p>
            <p className="text-gray-700">
              初回お問い合わせからご納車まで、わかりやすくスムーズなお取引を心がけております。
              <br />
              中古トラックの購入がはじめての方も、どうぞお気軽にお問い合わせください。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {flowSteps.map((step, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-blue-600 mb-2">FLOW</div>
                    <div className="text-4xl font-bold text-gray-300">{step.number}</div>
                  </div>
                  <h3 className="font-bold text-lg mb-4 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
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

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">QUESTION</h2>
            <p className="text-xl text-gray-600">よくあるご質問</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded font-bold mr-4">Q.</span>
                    <span className="font-bold">{faq.question}</span>
                  </div>
                  <div>
                    <span className="bg-gray-600 text-white px-3 py-1 rounded font-bold mr-4">A.</span>
                    <span className="text-gray-700">{faq.answer}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Info & News */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {/* Shop Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">SHOP INFO</h2>
              <p className="text-xl text-gray-600 mb-6">店舗情報</p>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">所在地</span>
                      <span>
                        〒000-0000
                        <br />
                        住所テキスト
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">TEL</span>
                      <span>000-000-0000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">FAX</span>
                      <span>000-000-0000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">営業時間</span>
                      <span>00:00~00:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">定休日</span>
                      <span>日曜日</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/about#access">
                      <Button variant="outline">アクセス方法へ</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* News */}
            <div>
              <h2 className="text-2xl font-bold mb-6">NEWS</h2>
              <p className="text-xl text-gray-600 mb-6">お知らせ</p>
              <div className="space-y-4">
                {news.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{item.date}</span>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {item.category}
                        </span>
                        <Link href={`/news/${item.id}`} className="font-medium hover:underline">
                          {item.title}
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/news">
                  <Button variant="outline">お知らせ一覧へ</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
