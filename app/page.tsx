"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Search } from "lucide-react"
import { news } from "./news/newsData"
import { getAnnouncements } from "@/lib/firebase-utils"
import type { Announcement } from "@/types"

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
  const [newsList, setNewsList] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnouncements().then((list) => {
      setNewsList(list.sort((a, b) => (b.createdAt as any) - (a.createdAt as any)).slice(0, 3));
    });
  }, []);

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
      {/* Hero, Truck Type Grid, Search Section Combined */}
      <section 
        style={{
          width: "1440px",
          height: "800px",
          opacity: 1,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Hero Section */}
        <div 
          style={{
            background: "linear-gradient(to right, #2563eb, #1d4ed8)",
            color: "white",
            padding: "64px 20px",
            flex: "1"
          }}
        >
          <div 
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center"
            }}
          >
            <h1 
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "24px",
                lineHeight: "1.2"
              }}
            >
              業界最安値を目指す、千葉の中古トラック販売店です。
            </h1>
            <p 
              style={{
                fontSize: "20px",
                lineHeight: "1.6"
              }}
            >
              中古トラック購入の、無駄なコストをカットしませんか？
              <br />
              限界ギリギリの安さ、ぜひ他店様と比べてみてください！
            </p>
          </div>
        </div>

        {/* Truck Type Grid */}
        <div 
          style={{
            backgroundColor: "#f9fafb",
            padding: "48px 20px",
            flex: "1"
          }}
        >
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "16px",
              maxWidth: "1200px",
              margin: "0 auto"
            }}
          >
            {vehicleTypeIcons.map((icon) => (
              <Link
                key={icon.id}
                href={`/inventory?type=${encodeURIComponent(icon.type)}`}
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div 
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#dbeafe",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div 
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#2563eb",
                      borderRadius: "4px"
                    }}
                  ></div>
                </div>
                <span 
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    color: "#374151",
                    fontWeight: "500"
                  }}
                >
                  {icon.type}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div 
          style={{
            backgroundColor: "white",
            padding: "48px 20px",
            flex: "1"
          }}
        >
          <div 
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              maxWidth: "800px",
              margin: "0 auto"
            }}
          >
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginBottom: "16px"
              }}
            >
              <select
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "14px"
                }}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">ボディタイプ：すべて</option>
                {vehicleTypeIcons.map((icon) => (
                  <option key={icon.id} value={icon.type}>{icon.type}</option>
                ))}
              </select>
              <select
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "14px"
                }}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">メーカー：すべて</option>
                {makers.map((maker) => (
                  <option key={maker} value={maker}>{maker}</option>
                ))}
              </select>
              <select
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "14px"
                }}
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
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "14px"
                }}
              />
            </div>
            <button 
              onClick={handleSearch}
              style={{
                width: "100%",
                backgroundColor: "#111827",
                color: "white",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                border: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1f2937";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#111827";
              }}
            >
              検索する
            </button>
          </div>
        </div>
      </section>

      {/* New Trucks Section */}
      <section 
        style={{
          width: "1440px",
          height: "1035px",
          gap: "40px",
          opacity: 1,
          paddingTop: "100px",
          paddingBottom: "100px",
          background: "#FFFFFF",
          margin: "0 auto"
        }}
      >
        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>NEW TRUCK</h2>
            <p style={{ fontSize: "20px", color: "#6b7280", marginBottom: "8px" }}>新着車輌</p>
            <p style={{ fontSize: "18px", color: "#374151" }}>
              現在、<span style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>000</span>台の在庫が閲覧可能です
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/inventory">
              <Button 
                variant="outline" 
                size="lg"
                style={{
                  backgroundColor: "transparent",
                  color: "#374151",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
              >
                在庫をもっと見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        style={{
          width: "1440px",
          height: "1334px",
          gap: "40px",
          opacity: 1,
          paddingTop: "60px",
          paddingBottom: "60px",
          background: "#FFFFFF",
          margin: "0 auto"
        }}
      >
        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>FEATURE</h2>
            <p style={{ fontSize: "20px", color: "#6b7280", marginBottom: "32px" }}>当社の特徴</p>
            <div style={{ maxWidth: "800px", margin: "0 auto", marginBottom: "48px" }}>
              <p style={{ color: "#374151", lineHeight: "1.8", fontSize: "16px" }}>
                中古トラックを、価格とスペックだけで選んでいませんか？ 事実、市場に流通する車両は玉石混交。
                修復歴や車両の状態、載せ替えされたボディや上物など、
                販売サイトに掲載されている情報だけではわからない事実によって、そのトラックの本当の価値は決まります。
                グルーウェーブの自慢は、中古トラックをどこよりも安く仕入れる買い付け力と、
                一見しただけでは分からない車輌の状態を徹底的に明らかにする入庫検査の技術。
                透明な評価基準に基づいた、理由のある安さで、あなたが本当に納得できるトラック選びをお手伝いしています。
              </p>
            </div>
          </div>

          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
              width: "100%",
              maxWidth: "1200px",
              marginBottom: "48px"
            }}
          >
            {features.map((feature, index) => (
              <Card 
                key={index}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  textAlign: "center"
                }}
              >
                <CardContent style={{ padding: "32px" }}>
                  <div 
                    style={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#2563eb",
                      marginBottom: "16px"
                    }}
                  >
                    reason
                  </div>
                  <div 
                    style={{
                      fontSize: "60px",
                      fontWeight: "bold",
                      color: "#d1d5db",
                      marginBottom: "16px"
                    }}
                  >
                    {feature.number}
                  </div>
                  <h3 
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginBottom: "16px",
                      color: "#374151",
                      lineHeight: "1.4"
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      lineHeight: "1.6"
                    }}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/about">
              <Button 
                variant="outline" 
                size="lg"
                style={{
                  backgroundColor: "transparent",
                  color: "#374151",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
              >
                詳しく見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section 
        style={{
          width: "1440px",
          height: "1195px",
          gap: "40px",
          opacity: 1,
          paddingTop: "60px",
          paddingBottom: "60px",
          background: "#F2F2F2",
          margin: "0 auto"
        }}
      >
        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>FLOW</h2>
            <p style={{ fontSize: "20px", color: "#6b7280", marginBottom: "16px" }}>ご利用の流れ</p>
            <p style={{ color: "#374151", lineHeight: "1.6" }}>
              初回お問い合わせからご納車まで、わかりやすくスムーズなお取引を心がけております。
              <br />
              中古トラックの購入がはじめての方も、どうぞお気軽にお問い合わせください。
            </p>
          </div>

          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "32px",
              width: "100%",
              maxWidth: "1200px"
            }}
          >
            {flowSteps.map((step, index) => (
              <Card 
                key={index}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
              >
                <CardContent style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <div 
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#2563eb",
                        marginBottom: "8px"
                      }}
                    >
                      FLOW
                    </div>
                    <div 
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "#d1d5db"
                      }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <h3 
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginBottom: "16px",
                      color: "#374151"
                    }}
                  >
                    {step.title}
                  </h3>
                  <p 
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      lineHeight: "1.6"
                    }}
                  >
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section 
        style={{
          width: "1440px",
          height: "831px",
          gap: "40px",
          opacity: 1,
          paddingTop: "60px",
          paddingBottom: "60px",
          background: "#FFFFFF",
          margin: "0 auto"
        }}
      >
        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>QUESTION</h2>
            <p style={{ fontSize: "20px", color: "#6b7280" }}>よくあるご質問</p>
          </div>

          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
              maxWidth: "800px"
            }}
          >
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
              >
                <CardContent style={{ padding: "24px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <span 
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        marginRight: "16px",
                        fontSize: "14px"
                      }}
                    >
                      Q.
                    </span>
                    <span 
                      style={{
                        fontWeight: "bold",
                        color: "#374151",
                        fontSize: "16px"
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div>
                    <span 
                      style={{
                        backgroundColor: "#6b7280",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        marginRight: "16px",
                        fontSize: "14px"
                      }}
                    >
                      A.
                    </span>
                    <span 
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        lineHeight: "1.6"
                      }}
                    >
                      {faq.answer}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Info Section */}
      <section 
        style={{
          width: "1440px",
          height: "918.6600341796875px",
          gap: "40px",
          opacity: 1,
          paddingTop: "60px",
          paddingBottom: "60px",
          background: "#FFFFFF",
          margin: "0 auto"
        }}
      >
        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>SHOP INFO</h2>
            <p style={{ fontSize: "20px", color: "#6b7280", marginBottom: "24px" }}>店舗情報</p>
          </div>
          
          <Card 
            style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "100%",
              maxWidth: "800px"
            }}
          >
            <CardContent style={{ padding: "32px" }}>
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>所在地</span>
                  <span style={{ textAlign: "right", color: "#374151" }}>
                    〒000-0000
                    <br />
                    住所テキスト
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>TEL</span>
                  <span style={{ color: "#374151" }}>000-000-0000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>FAX</span>
                  <span style={{ color: "#374151" }}>000-000-0000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>営業時間</span>
                  <span style={{ color: "#374151" }}>00:00~00:00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "500", color: "#374151" }}>定休日</span>
                  <span style={{ color: "#374151" }}>日曜日</span>
                </div>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <Link href="/about#access">
                  <Button 
                    variant="outline" 
                    style={{
                      backgroundColor: "transparent",
                      color: "#374151",
                      border: "2px solid #d1d5db",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                      e.currentTarget.style.borderColor = "#9ca3af";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                  >
                    アクセス方法へ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Section */}
      <section 
        style={{
          width: "1440px",
          height: "443px",
          gap: "40px",
          opacity: 1,
          paddingTop: "60px",
          paddingBottom: "60px",
          background: "#FFFFFF",
          margin: "0 auto"
        }}
      >
        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>NEWS</h2>
            <p style={{ fontSize: "20px", color: "#6b7280", marginBottom: "24px" }}>お知らせ</p>
          </div>
          
          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
              maxWidth: "800px",
              marginBottom: "24px"
            }}
          >
            {newsList.map((item, index) => (
              <Card 
                key={index}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
                }}
              >
                <CardContent style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>
                      {item.createdAt instanceof Date ? `${item.createdAt.getFullYear()}.${String(item.createdAt.getMonth()+1).padStart(2,"0")}.${String(item.createdAt.getDate()).padStart(2,"0")}` : ""}
                    </span>
                    <span 
                      style={{
                        fontSize: "14px",
                        backgroundColor: "#dbeafe",
                        color: "#1e40af",
                        padding: "4px 8px",
                        borderRadius: "4px"
                      }}
                    >
                      お知らせ
                    </span>
                    <Link 
                      href={`/news/${item.id}`} 
                      style={{
                        fontWeight: "500",
                        color: "#374151",
                        textDecoration: "none",
                        transition: "color 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#1e40af";
                        e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#374151";
                        e.currentTarget.style.textDecoration = "none";
                      }}
                    >
                      {item.title}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div style={{ textAlign: "center" }}>
            <Link href="/news">
              <Button 
                variant="outline" 
                style={{
                  backgroundColor: "transparent",
                  color: "#374151",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
              >
                お知らせ一覧へ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        style={{
          width: "1440px",
          height: "671px",
          gap: "40px",
          opacity: 1,
          paddingTop: "60px",
          paddingBottom: "60px",
          background: "#666666",
          color: "white",
          margin: "0 auto"
        }}
      >
        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 20px"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>CONTACT</h2>
            <p style={{ fontSize: "20px", marginBottom: "16px" }}>お問い合わせ</p>
            <p style={{ marginBottom: "32px" }}>
              在庫車輛の詳細/その他お問い合わせ/業販価格のご確認など
              <br />
              お電話またはお問い合わせフォームよりお気軽にお問い合わせください。
              <br />
              在庫にないトラックのご紹介も可能です。
            </p>
          </div>

          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "32px",
              maxWidth: "800px",
              width: "100%",
              marginBottom: "32px"
            }}
          >
            <Card 
              style={{
                backgroundColor: "white",
                color: "#374151",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px", textAlign: "center" }}>
                <Phone style={{ width: "48px", height: "48px", margin: "0 auto 16px auto", color: "#2563eb" }} />
                <h3 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "16px" }}>お電話でのお問い合わせ</h3>
                <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}>TEL. 000-000-0000</p>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>受付時間：月〜土 00:00~00:00</p>
              </CardContent>
            </Card>

            <Card 
              style={{
                backgroundColor: "white",
                color: "#374151",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px", textAlign: "center" }}>
                <div 
                  style={{
                    width: "48px",
                    height: "48px",
                    margin: "0 auto 16px auto",
                    backgroundColor: "#2563eb",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div 
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "white",
                      borderRadius: "4px"
                    }}
                  ></div>
                </div>
                <h3 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "16px" }}>フォームでのお問い合わせ</h3>
                <Link href="/contact">
                  <Button 
                    style={{
                      marginBottom: "16px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                    }}
                  >
                    お問い合わせフォームへ
                  </Button>
                </Link>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>24時間受付中</p>
              </CardContent>
            </Card>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/purchase">
              <Button 
                variant="outline" 
                size="lg" 
                style={{
                  backgroundColor: "white",
                  color: "#2563eb",
                  border: "2px solid white",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                トラック買取をご希望の方はこちら
                <br />
                <span style={{ fontSize: "14px" }}>無料査定実施中！！</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
