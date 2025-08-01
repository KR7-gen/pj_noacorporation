"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Search, ChevronDown, PhoneCall, ChevronRight } from "lucide-react"
import { news } from "./news/newsData"
import { getAnnouncements, getNewlyRegisteredVehicles, getVehicles } from "@/lib/firebase-utils"
import type { Announcement, Vehicle } from "@/types"

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
  const [latestVehicles, setLatestVehicles] = useState<Vehicle[]>([]);
  const [totalVehicles, setTotalVehicles] = useState(0);

  useEffect(() => {
    // お知らせデータを取得
    getAnnouncements().then((list) => {
      setNewsList(list.sort((a, b) => (b.createdAt as any) - (a.createdAt as any)).slice(0, 3));
    });

    // 最新車両データを取得
    getNewlyRegisteredVehicles(4).then((vehicles) => {
      setLatestVehicles(vehicles);
      console.log("最新車両データ取得完了:", vehicles);
    }).catch((error) => {
      console.error("最新車両データ取得エラー:", error);
    });

    // 総車両数を取得（在庫数表示用）
    getVehicles().then((allVehicles) => {
      setTotalVehicles(allVehicles.length);
    }).catch((error) => {
      console.error("総車両数取得エラー:", error);
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
          top: "126px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(90deg, rgba(0, 0, 0, 0.4) 43.5%, rgba(255, 255, 255, 0) 100%), url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          zIndex: 1
        }}
      >
        {/* Hero Section */}
        <div 
          style={{
            color: "white",
            padding: "64px 20px",
            flex: "1"
          }}
        >
          <div 
            style={{
              maxWidth: "800px",
              margin: "0",
              textAlign: "left"
            }}
          >
            <h1 
              style={{
                width: "632px",
                height: "70px",
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "48px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "4px 4px 4px 0px #0000004D",
                margin: "0 0 24px 0",
                textAlign: "left"
              }}
            >
              キャッチコピー
            </h1>
            <div 
              style={{
                width: "632px",
                height: "120px",
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "24px",
                lineHeight: "40px",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
                margin: "0",
                textAlign: "left"
              }}
            >
              業界最安値を目指す、千葉の中古トラック販売店です。
              <br />
              中古トラック購入の、無駄なコストをカットしませんか？
              <br />
              限界ギリギリの安さ、ぜひ他店様と比べてみてください！
            </div>
          </div>
        </div>

        {/* Truck Type Grid */}
        <div 
          style={{
            padding: "48px 20px",
            flex: "1"
          }}
        >
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "4px",
              maxWidth: "1200px",
              margin: "0 auto"
            }}
          >
            {vehicleTypeIcons.map((icon) => (
              <Link
                key={icon.id}
                href={`/inventory?type=${encodeURIComponent(icon.type)}`}
                style={{
                  width: "176px",
                  height: "96px",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  opacity: 1
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
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}
                >
                  <div 
                    style={{
                      width: "64px",
                      height: "64px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "8px"
                    }}
                  >
                    <img 
                      src={`/${icon.type === "クレーン" ? "crane" : 
                           icon.type === "ダンプ" ? "dump" :
                           icon.type === "平ボディ" ? "flatbed" :
                           icon.type === "車輌運搬車" ? "carrier" :
                           icon.type === "ミキサー車" ? "mixer" :
                           icon.type === "アルミバン" ? "van" :
                           icon.type === "高所作業車" ? "aerial" :
                           icon.type === "アルミウィング" ? "wing" :
                           icon.type === "キャリアカー" ? "car_carrier" :
                           icon.type === "塵芥車" ? "garbage" :
                           icon.type === "アームロール" ? "arm-roll" :
                           "special"}.${icon.type === "平ボディ" || icon.type === "アームロール" || icon.type === "キャリアカー" ? "png" : "jpg"}`}
                      alt={icon.type}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                      }}
                      onError={(e) => {
                        console.error(`画像読み込みエラー: ${icon.type}`, (e.target as HTMLImageElement).src);
                      }}
                    />
                  </div>
                  <span 
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#1A1A1A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "160px"
                    }}
                  >
                    {icon.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div 
          style={{
            padding: "48px 20px",
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {/* 背景 */}
          <div 
            style={{
              width: "1180px",
              height: "55px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: 1,
              borderRadius: "4px",
              padding: "8px 12px",
              background: "#CCCCCC"
            }}
          >
            {/* 左側の検索フィールド群 */}
            <div 
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center"
              }}
            >
              {/* 車両検索（ボディタイプ） */}
              <div 
                style={{
                  width: "202px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  background: "#FFFFFF",
                  position: "relative"
                }}
              >
                                  <select
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "16px",
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      color: "#1A1A1A",
                      outline: "none",
                      cursor: "pointer",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none"
                    }}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">ボディタイプ：すべて</option>
                    {vehicleTypeIcons.map((icon) => (
                      <option key={icon.id} value={icon.type}>{icon.type}</option>
                    ))}
                  </select>
                  <ChevronDown 
                    size={24} 
                    style={{ 
                      color: "#1A1A1A",
                      position: "absolute",
                      right: "8px",
                      pointerEvents: "none"
                    }} 
                  />
              </div>

              {/* 車両検索（メーカー） */}
              <div 
                style={{
                  width: "172px",
                  height: "33px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  background: "#FFFFFF",
                  position: "relative"
                }}
              >
                                  <select
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "16px",
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      color: "#1A1A1A",
                      outline: "none",
                      cursor: "pointer",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none"
                    }}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">メーカー：すべて</option>
                    {makers.map((maker) => (
                      <option key={maker} value={maker}>{maker}</option>
                    ))}
                  </select>
                  <ChevronDown 
                    size={25} 
                    style={{ 
                      color: "#1A1A1A",
                      position: "absolute",
                      right: "8px",
                      pointerEvents: "none"
                    }} 
                  />
              </div>

              {/* 車両検索（大きさ） */}
              <div 
                style={{
                  width: "155px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  background: "#FFFFFF",
                  position: "relative"
                }}
              >
                                  <select
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "16px",
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      color: "#1A1A1A",
                      outline: "none",
                      cursor: "pointer",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none"
                    }}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">大きさ：すべて</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <ChevronDown 
                    size={24} 
                    style={{ 
                      color: "#1A1A1A",
                      position: "absolute",
                      right: "8px",
                      pointerEvents: "none"
                    }} 
                  />
              </div>
            </div>

            {/* 右側のフリーワードと検索ボタン */}
            <div 
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center"
              }}
            >
              {/* 車両検索（フリーワード） */}
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span 
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#1A1A1A",
                    whiteSpace: "nowrap"
                  }}
                >
                  フリーワード
                </span>
                <div 
                  style={{
                    width: "300px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    background: "#FFFFFF"
                  }}
                >
                  <input
                    type="text"
                    placeholder="問い合わせ番号、車体番号など"
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "16px",
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      color: "#1A1A1A",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* 検索するボタン */}
              <button 
                onClick={handleSearch}
                style={{
                  width: "120px",
                  height: "39px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  borderRadius: "4px",
                  padding: "8px",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <span 
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontWeight: "700",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#FFFFFF"
                  }}
                >
                  検索する
                </span>
              </button>
            </div>
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
          margin: "0 auto",
          marginTop: "926px"
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
            <div 
              style={{
                width: "80px",
                height: "17px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "2px"
              }}
            >
              NEW TRUCK
            </div>
            <div 
              style={{
                width: "160px",
                height: "58px",
                margin: "0 auto 8px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "40px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              新着車両
            </div>
            <p style={{ opacity: 1, fontFamily: "Noto Sans JP", fontWeight: "700", fontStyle: "Bold", fontSize: "16px", lineHeight: "100%", letterSpacing: "0%", color: "#1A1A1A" }}>
              現在、<span style={{ opacity: 1, fontFamily: "Noto Sans JP", fontWeight: "700", fontStyle: "Bold", fontSize: "32px", lineHeight: "100%", letterSpacing: "0%", color: "#1CA0C8" }}>{latestVehicles.length}</span>台の在庫が閲覧可能です
            </p>
          </div>

          {/* 新着車輌の表示 */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              width: "100%",
              maxWidth: "1200px",
              marginBottom: "48px"
            }}
          >
            {latestVehicles.map((vehicle, index) => (
              <Card 
                key={vehicle.id}
                style={{
                  width: "260px",
                  height: "587px",
                  gap: "12px",
                  opacity: 1,
                  paddingBottom: "16px",
                  borderWidth: "1px",
                  background: "#FFFFFF",
                  border: "1px solid #F2F2F2",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                <CardContent style={{ padding: "0" }}>
                  {/* ヘッダーバー */}
                  <div 
                    style={{
                      height: "39px",
                      background: "#1A1A1A",
                      padding: "8px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ 
                      width: "140px",
                      height: "23px",
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "700",
                      fontStyle: "Bold",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#FFFFFF",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {(vehicle.maker === "三菱ふそう" ? "三菱" : vehicle.maker)} {vehicle.vehicleType || vehicle.bodyType || vehicle.name}
                    </span>
                    <span style={{ 
                      width: "89px",
                      height: "17px",
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      fontStyle: "Regular",
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#FFFFFF"
                    }}>
                      {vehicle.modelCode || vehicle.model}
                    </span>
                  </div>
                  
                  {/* 問い合わせ番号 */}
                  <div 
                    style={{
                      height: "35px",
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <span style={{
                      width: "157px",
                      height: "19px",
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      fontStyle: "Regular",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#1A1A1A",
                      textAlign: "center"
                    }}>
                      問合せ番号: {vehicle.inquiryNumber || "N00000"}
                    </span>
                  </div>

                  {/* 車両画像 */}
                  <div 
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "180px",
                      overflow: "hidden"
                    }}
                  >
                    <img
                      src={vehicle.imageUrls && vehicle.imageUrls.length > 0 ? vehicle.imageUrls[0] : "/placeholder.jpg"}
                      alt={`${vehicle.maker} ${vehicle.name}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                    
                    {/* 商談中・SOLD OUTオーバーレイ */}
                    {(vehicle.isNegotiating || vehicle.isSoldOut) && (
                      <div 
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "39px",
                          backgroundColor: vehicle.isSoldOut ? "#EA1313" : "#666666",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <span style={{
                          width: "48px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#FFFFFF"
                        }}>
                          {vehicle.isSoldOut ? "SOLD OUT" : "商談中"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ボディタイプ + 詳細テーブル */}
                  <div 
                    style={{
                      height: "273px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* ボディタイプ */}
                    <div 
                      style={{
                        height: "calc(273px / 6)",
                        display: "flex",
                        alignItems: "center",
                        background: "#FFFFFF",
                        borderBottom: "1px solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "260px",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "232px",
                          height: "17px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>
                          {vehicle.bodyType || vehicle.vehicleType || "未設定"}
                        </span>
                      </div>
                    </div>

                    {/* 本体価格 */}
                    <div 
                      style={{
                        height: "calc(273px / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "11px",
                        color: "#374151",
                        borderBottom: "1px solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "80px",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "56px",
                          height: "20px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>本体価格</span>
                      </div>
                      <div style={{ 
                        width: "180px",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "12px"
                      }}>
                        <div>
                          <span style={{
                            width: "57px",
                            height: "23px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "700",
                            fontStyle: "Bold",
                            fontSize: "32px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5"
                          }}>
                            {vehicle.price ? Math.floor(vehicle.price / 10000) : "000"}
                          </span>
                          <span style={{
                            width: "57px",
                            height: "14px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "12px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5"
                          }}>万円(税別)</span>
                        </div>
                      </div>
                    </div>

                    {/* 年式 */}
                    <div 
                      style={{
                        height: "calc(273px / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "11px",
                        color: "#374151",
                        borderBottom: "1px solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "80px",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "56px",
                          height: "20px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>年式</span>
                      </div>
                      <div style={{ 
                        width: "180px",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "12px"
                      }}>
                        <span style={{
                          width: "88px",
                          height: "17px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>
                          {vehicle.year ? `${vehicle.year}年${vehicle.month ? vehicle.month.replace('月', '') + '月' : ''}` : "R6年9月"}
                        </span>
                      </div>
                    </div>

                    {/* 走行距離 */}
                    <div 
                      style={{
                        height: "calc(273px / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "11px",
                        color: "#374151",
                        borderBottom: "1px solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "80px",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "56px",
                          height: "20px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>走行距離</span>
                      </div>
                      <div style={{ 
                        width: "180px",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "12px"
                      }}>
                        <span style={{
                          width: "88px",
                          height: "17px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>
                          {vehicle.mileage ? `${vehicle.mileage.toLocaleString()}km` : "00,000km"}
                        </span>
                      </div>
                    </div>

                    {/* 積載量 */}
                    <div 
                      style={{
                        height: "calc(273px / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "11px",
                        color: "#374151",
                        borderBottom: "1px solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "80px",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "56px",
                          height: "20px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>積載量</span>
                      </div>
                      <div style={{ 
                        width: "180px",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "12px"
                      }}>
                        <span style={{
                          width: "88px",
                          height: "17px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>
                          {vehicle.loadingCapacity ? `${vehicle.loadingCapacity.toLocaleString()}kg` : "0,000kg"}
                        </span>
                      </div>
                    </div>

                    {/* シフト */}
                    <div 
                      style={{
                        height: "calc(273px / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "11px",
                        color: "#374151",
                        borderBottom: "1px solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "80px",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "56px",
                          height: "20px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>シフト</span>
                      </div>
                      <div style={{ 
                        width: "180px",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "12px"
                      }}>
                        <span style={{
                          width: "88px",
                          height: "17px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>
                          {vehicle.mission || vehicle.shift || "AT"}
                        </span>
                      </div>
                    </div>

                    {/* 車検期限 */}
                    <div 
                      style={{
                        height: "calc(273px / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "11px",
                        color: "#374151",
                        borderBottom: "1px solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "80px",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "56px",
                          height: "20px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>車検期限</span>
                      </div>
                      <div style={{ 
                        width: "180px",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "12px"
                      }}>
                        <span style={{
                          width: "88px",
                          height: "17px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>
                          {vehicle.inspectionStatus || "抹消"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 詳細ボタン */}
                  <div style={{ 
                    height: "60px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    background: "#FFFFFF"
                  }}>
                    <Link href={`/vehicle/${vehicle.id}`}>
                      <Button 
                        style={{
                          width: "160px",
                          height: "32px",
                          gap: "8px",
                          opacity: 1,
                          paddingTop: "4px",
                          paddingRight: "8px",
                          paddingBottom: "4px",
                          paddingLeft: "8px",
                          borderRadius: "4px",
                          border: "1px solid #333333",
                          background: "#FFFFFF",
                          boxShadow: "2px 2px 2px 0px #00000040",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "0.9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
                        <span style={{
                          width: "84px",
                          height: "20px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "14px",
                          lineHeight: "20px",
                          letterSpacing: "0%",
                          color: "#333333",
                          display: "flex",
                          alignItems: "center",
                          transform: "translateY(-1px)"
                        }}>
                          詳細はこちら
                        </span>
                        <svg
                          width="7.4"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: "#333333",
                            height: "20px",
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/inventory">
              <Button 
                variant="outline" 
                size="lg"
                style={{
                  width: "220px",
                  height: "40px",
                  gap: "12px",
                  opacity: 1,
                  padding: "8px 12px",
                  borderRadius: "4px",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  boxShadow: "2px 2px 2px 0px #00000040",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <span
                  style={{
                    width: "128px",
                    height: "23px",
                    opacity: 1,
                    fontFamily: "Noto Sans JP",
                    fontWeight: 700,
                    fontStyle: "Bold",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#FFFFFF"
                  }}
                >
                  在庫をもっと見る
                </span>
                <ChevronRight
                  style={{
                    width: "24px",
                    height: "24px",
                    opacity: 1,
                    color: "#FFFFFF"
                  }}
                />
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
            <div 
              style={{
                width: "80px",
                height: "17px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              FEATURE
            </div>
            <div 
              style={{
                width: "100%",
                minWidth: "320px",
                height: "58px",
                margin: "0 auto 32px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "40px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap"
              }}
            >
              当社の特徴
            </div>
            <div 
              style={{
                width: "1100px",
                height: "224px",
                margin: "0 auto",
                marginBottom: "48px",
                opacity: 1
              }}
            >
              <p 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "16px",
                  lineHeight: "32px",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#1A1A1A"
                }}
              >
                中古トラックを、価格とスペックだけで選んでいませんか？ 
                <br></br>
                事実、市場に流通する車両は玉石混交。
                <br></br>
                修復歴や車両の状態、載せ替えされたボディや上物など、
                <br></br>
                販売サイトに掲載されている情報だけではわからない事実によって、そのトラックの本当の価値は決まります。
                <br></br>
                グルーウェーブの自慢は、中古トラックをどこよりも安く仕入れる買い付け力と、
                <br></br>
                一見しただけでは分からない車輌の状態を徹底的に明らかにする入庫検査の技術。
                <br></br>
                透明な評価基準に基づいた、理由のある安さで、あなたが本当に納得できるトラック選びをお手伝いしています。
              </p>
            </div>
          </div>

          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              width: "100%",
              maxWidth: "1200px",
              marginBottom: "48px",
              alignItems: "center"
            }}
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  width: index === 2 ? "809.81px" : "808px",
                  height: "225px",
                  opacity: 1,
                  display: "flex",
                  overflow: "hidden"
                }}
              >
                {/* REASON1: 画像 → グレー背景 → 白背景 */}
                {index === 0 && (
                  <>
                    <div 
                      style={{
                        width: "337px",
                        height: "100%",
                        backgroundImage: "url('/reason1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                    <div 
                      style={{
                        width: "360px",
                        height: "100%",
                        backgroundColor: "#E6E6E6",
                        position: "relative"
                      }}
                    >
                      <h3 
                        style={{
                          width: "240px",
                          height: "58px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "20px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          color: "#2B5EC5",
                          margin: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)"
                        }}
                      >
                        {feature.title}
                      </h3>
                    </div>
                    <div 
                      style={{
                        width: "111px",
                        height: "100%",
                        backgroundColor: "white",
                        position: "relative"
                      }}
                    >
                      <div 
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "20px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "12px"
                        }}
                      >
                        <div 
                          style={{
                            width: "64px",
                            height: "24px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "20px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          reason
                        </div>
                        <div 
                          style={{
                            width: "75px",
                            height: "47px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "600",
                            fontStyle: "SemiBold",
                            fontSize: "64px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "translateY(-8px)"
                          }}
                        >
                          {feature.number}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* REASON2: 白背景 → グレー背景 → 画像 */}
                {index === 1 && (
                  <>
                    <div 
                      style={{
                        width: "111px",
                        height: "100%",
                        backgroundColor: "white",
                        position: "relative"
                      }}
                    >
                      <div 
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          left: "20px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "12px",
                          zIndex: 10
                        }}
                      >
                        <div 
                          style={{
                            width: "64px",
                            height: "24px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "20px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          reason
                        </div>
                        <div 
                          style={{
                            width: "75px",
                            height: "47px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "600",
                            fontStyle: "SemiBold",
                            fontSize: "64px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "translateY(-8px)"
                          }}
                        >
                          {feature.number}
                        </div>
                      </div>
                    </div>
                    <div 
                      style={{
                        width: "360px",
                        height: "100%",
                        backgroundColor: "#E6E6E6",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <h3 
                        style={{
                          width: "301px",
                          height: "58px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "20px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          color: "#2B5EC5",
                          margin: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)"
                        }}
                      >
                        {feature.title}
                      </h3>
                    </div>
                    <div 
                      style={{
                        width: "337px",
                        height: "100%",
                        backgroundImage: "url('/reason2.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                  </>
                )}

                {/* REASON3: 画像 → グレー背景 → 白背景 */}
                {index === 2 && (
                  <>
                    <div 
                      style={{
                        width: "337px",
                        height: "100%",
                        backgroundImage: "url('/reason3.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                    <div 
                      style={{
                        width: "360px",
                        height: "100%",
                        backgroundColor: "#E6E6E6",
                        position: "relative"
                      }}
                    >
                      <h3 
                        style={{
                          width: "320px",
                          height: "58px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "20px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          color: "#2B5EC5",
                          margin: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)"
                        }}
                      >
                        {feature.title}
                      </h3>
                    </div>
                    <div 
                      style={{
                        width: "112.81px",
                        height: "100%",
                        backgroundColor: "white",
                        position: "relative"
                      }}
                    >
                      <div 
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "20px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "12px"
                        }}
                      >
                        <div 
                          style={{
                            width: "64px",
                            height: "24px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "20px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          reason
                        </div>
                        <div 
                          style={{
                            width: "75px",
                            height: "47px",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "600",
                            fontStyle: "SemiBold",
                            fontSize: "64px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "translateY(-8px)"
                          }}
                        >
                          {feature.number}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/about">
              <Button 
                style={{
                  width: "220px",
                  height: "40px",
                  gap: "36px",
                  opacity: 1,
                  paddingTop: "8px",
                  paddingRight: "12px",
                  paddingBottom: "8px",
                  paddingLeft: "12px",
                  borderRadius: "4px",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  boxShadow: "2px 2px 2px 0px #00000040",
                  color: "#FFFFFF",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <span style={{ width: "80px", height: "23px" }}>詳しく見る</span>
                <svg
                  width="7.4"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "192px",
                    color: "#FFFFFF"
                  }}
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section 
        style={{
          width: "100%",
          maxWidth: "1440px",
          minHeight: "800px",
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
          {/* FLOWセクション */}
          <div 
            style={{
              width: "820px",
              height: "960px",
              backgroundColor: "white",
              border: "2px dashed #87CEEB",
              borderRadius: "12px",
              padding: "16px 12px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div 
                style={{
                  width: "80px",
                  height: "17px",
                  margin: "0 auto 16px auto",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontStyle: "Regular",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#2B5EC5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                FLOW
              </div>
              <div 
                style={{
                  width: "100%",
                  minWidth: "320px",
                  height: "58px",
                  margin: "0 auto 16px auto",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "40px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#1A1A1A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap"
                }}
              >
                ご利用の流れ
              </div>
              <p 
                style={{ 
                  width: "776px",
                  height: "56px",
                  opacity: 1,
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontStyle: "Regular",
                  fontSize: "16px",
                  lineHeight: "28px",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#1A1A1A",
                  margin: 0
                }}
              >
                初回お問い合わせからご納車まで、わかりやすくスムーズなお取引を心がけております。<br />
                中古トラックの購入がはじめての方も、どうぞお気軽にお問い合わせください。
              </p>
            </div>
            {flowSteps.map((step, index) => (
              <div key={index}>
                <div 
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: index < flowSteps.length - 1 ? "8px" : "0",
                    width: "100%"
                  }}
                >
                  <div 
                    style={{
                      width: "108px",
                      height: "auto",
                      opacity: 1,
                      borderRight: "1px solid #DEEBEF",
                      padding: "16px 8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "24px"
                    }}
                  >
                    <div 
                      style={{
                        width: "40px",
                        height: "20px",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#2B5EC5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      FLOW
                    </div>
                    <div 
                      style={{
                        width: "43px",
                        height: "46px",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "36px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#2B5EC5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 
                      style={{
                        width: "120px",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "20px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#1A1A1A",
                        marginBottom: "12px",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      {step.title}
                      <span 
                        style={{
                          width: step.number === "01" ? "33.33px" : "40px",
                          height: step.number === "01" ? "26.67px" : "40px",
                          opacity: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {step.number === "01" && "📧"}
                        {step.number === "02" && "🚐"}
                        {step.number === "03" && "🧮"}
                        {step.number === "04" && "🤝"}
                      </span>
                    </h3>
                    <p 
                      style={{
                        width: "648px",
                        height: "84px",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "400",
                        fontStyle: "Regular",
                        fontSize: "16px",
                        lineHeight: "28px",
                        letterSpacing: "0%",
                        color: "#1A1A1A"
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < flowSteps.length - 1 && (
                  <div 
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "8px"
                    }}
                  >
                    <div 
                      style={{
                        width: "62px",
                        height: "20px",
                        opacity: 1,
                        display: "block",
                        background: "none",
                        borderLeft: "31px solid transparent",
                        borderRight: "31px solid transparent",
                        borderTop: "20px solid #2563eb"
                      }}
                    />
                  </div>
                )}
              </div>
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
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "0 20px",
            paddingTop: "40px"
          }}
        >
          {/* QUESTIONセクション */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div 
              style={{
                width: "80px",
                height: "17px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              QUESTION
            </div>
            <div 
              style={{
                width: "100%",
                minWidth: "320px",
                height: "58px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "40px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap"
              }}
            >
              よくあるご質問
            </div>
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
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  margin: 0
                }}
              >
                <CardContent style={{ padding: 0 }}>
                  {/* Q部分デザイン */}
                  <div style={{
                    width: "820px",
                    height: "45px",
                    opacity: 1,
                    padding: "4px 12px",
                    borderRadius: "4px",
                    background: "#F2F2F2",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                  }}>
                    <span style={{
                      width: "26px",
                      height: "29px",
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "20px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#1CA0C8",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px"
                    }}>
                      Q.
                    </span>
                    <span style={{
                      width: "320px",
                      height: "29px",
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "20px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#1A1A1A",
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {faq.question}
                    </span>
                  </div>
                  {/* A部分デザイン */}
                  <div style={{
                    width: "820px",
                    height: "80px",
                    opacity: 1,
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px"
                  }}>
                    <span 
                      style={{
                        width: "26px",
                        height: "29px",
                        fontFamily: "Noto Sans JP, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "20px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#EA1313",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px"
                      }}
                    >
                      A.
                    </span>
                    <span style={{
                      width: "722px",
                      height: "56px",
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "16px",
                      lineHeight: "28px",
                      letterSpacing: "0%",
                      color: "#1A1A1A",
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
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
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "0 20px",
            paddingTop: "40px"
          }}
        >
          {/* SHOP INFOセクション */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div 
              style={{
                width: "80px",
                height: "17px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              SHOP INFO
            </div>
            <div 
              style={{
                width: "100%",
                minWidth: "320px",
                height: "58px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "40px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap"
              }}
            >
              店舗情報
            </div>
          </div>

          {/* 3つのフレームのコンテナ */}
          <div 
            style={{
              display: "flex",
              gap: "24px",
              width: "100%",
              maxWidth: "1200px",
              marginBottom: "16px",
              justifyContent: "center"
            }}
          >
            {/* 1. テキストフレーム */}
            <div 
              style={{
                width: "416px",
                height: "350px",
                gap: "12px",
                opacity: 1,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Card 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  flex: "1"
                }}
              >
                <CardContent style={{ padding: "24px" }}>
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                  >
                    <div style={{ 
                      width: "300px",
                      height: "55px",
                      gap: "10px",
                      opacity: 1,
                      padding: "10px 12px",
                      borderBottom: "1px solid #e5e7eb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}>
                      <span style={{ 
                        width: "48px",
                        height: "23px",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "16px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#1A1A1A"
                      }}>所在地</span>
                      <div style={{ 
                        width: "200px",
                        height: "23px",
                        opacity: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "2px"
                      }}>
                        <span style={{ 
                          width: "100%",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "right"
                        }}>
                          〒329-1326
                        </span>
                        <span style={{ 
                          width: "100%",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "right",
                          whiteSpace: "nowrap"
                        }}>
                          栃木県さくら市向河原3994-1
                        </span>
                      </div>
                    </div>
                    <div style={{ 
                      width: "416px",
                      height: "55px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        width: "116px",
                        height: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <span style={{ 
                          width: "48px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>TEL</span>
                      </div>
                      <div style={{ 
                        width: "300px",
                        height: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}>
                        <span style={{ 
                          width: "96px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "right",
                          whiteSpace: "nowrap"
                        }}>028-612-1474</span>
                      </div>
                    </div>
                    <div style={{ 
                      width: "416px",
                      height: "55px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        width: "116px",
                        height: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <span style={{ 
                          width: "48px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>FAX</span>
                      </div>
                      <div style={{ 
                        width: "300px",
                        height: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}>
                        <span style={{ 
                          width: "96px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "right",
                          whiteSpace: "nowrap"
                        }}>028-612-1471</span>
                      </div>
                    </div>
                    <div style={{ 
                      width: "416px",
                      height: "55px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        width: "116px",
                        height: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <span style={{ 
                          width: "48px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>定休日</span>
                      </div>
                      <div style={{ 
                        width: "300px",
                        height: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}>
                        <span style={{ 
                          width: "96px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "right",
                          whiteSpace: "nowrap"
                        }}>年中無休</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* アクセス方法へボタン */}
              <div style={{ textAlign: "center", marginTop: "6px" }}>
                <Link href="/about#access">
                  <Button 
                    variant="outline" 
                    style={{
                      width: "220px",
                      height: "36px",
                      gap: "20px",
                      opacity: 1,
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                      boxShadow: "2px 2px 2px 0px #00000040",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "3px 3px 3px 0px #00000040";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "2px 2px 2px 0px #00000040";
                    }}
                  >
                    {/* テキストとchevron_forwardを一つのフレームとして中央揃え */}
                    <div 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px"
                      }}
                    >
                      {/* アクセス方法へ（テキスト） */}
                      <span 
                        style={{
                          width: "112px",
                          height: "23px",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        アクセス方法へ
                      </span>
                      {/* chevron_forward */}
                      <div 
                        style={{
                          width: "24px",
                          height: "24px",
                          opacity: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <ChevronRight 
                          size={24} 
                          color="#FFFFFF"
                        />
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>

            {/* 2. 写真フレーム */}
            <div 
              style={{
                width: "384px",
                height: "386px",
                gap: "4px",
                opacity: 1,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Card 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                  overflow: "hidden"
                }}
              >
                <CardContent style={{ padding: 0, width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  {/* 1段目：大きい画像 */}
                  <div style={{ width: "383.84px", height: "293.88px", marginBottom: "8px" }}>
                    <img
                      src="/shopinfo_truck1.jpg"
                      alt="店舗写真1"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  {/* 2段目：小さい画像3枚横並び */}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <img
                      src="/shopinfo_truck2.jpg"
                      alt="店舗写真2"
                      style={{
                        width: "121.27px",
                        height: "92.85px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
                      }}
                    />
                    <img
                      src="/shopinfo_truck3.jpg"
                      alt="店舗写真3"
                      style={{
                        width: "121.27px",
                        height: "90.95px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
                      }}
                    />
                    <img
                      src="/shopinfo_truck4.jpg"
                      alt="店舗写真4"
                      style={{
                        width: "133.53px",
                        height: "89.09px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 3. GoogleMapフレーム */}
          <a
            href="https://www.google.com/maps/place/%E6%A0%83%E6%9C%A8%E7%9C%8C%E3%81%95%E3%81%8F%E3%82%89%E5%B8%82%E5%90%91%E6%B2%B3%E5%8E%9F3994-1/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "820px",
              height: "256.66px",
              display: "block",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              marginTop: "16px"
            }}
          >
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=%E6%A0%83%E6%9C%A8%E7%9C%8C%E3%81%95%E3%81%8F%E3%82%89%E5%B8%82%E5%90%91%E6%B2%B3%E5%8E%9F3994-1&output=embed"
              width="820"
              height="256.66"
              style={{ border: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </a>
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
            width: "820px",
            height: "208px",
            gap: "40px",
            opacity: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto"
          }}
        >
          {/* NEWSセクション */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div 
              style={{
                width: "80px",
                height: "17px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              NEWS
            </div>
            <div 
              style={{
                width: "100%",
                minWidth: "320px",
                height: "58px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "40px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap"
              }}
            >
              お知らせ
            </div>
          </div>
          
          {/* Frame 123 - お知らせ2つのフレーム */}
          <div 
            style={{
              width: "820px",
              height: "128px",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "24px"
            }}
          >
            {newsList.slice(0, 2).map((item, index) => (
              <Card 
                key={index}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  flex: "1"
                }}
              >
                <CardContent style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ 
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#1A1A1A",
                      fontWeight: "700",
                      fontFamily: "Noto Sans JP"
                    }}>
                      {item.createdAt instanceof Date ? `${item.createdAt.getFullYear()}.${String(item.createdAt.getMonth()+1).padStart(2,"0")}.${String(item.createdAt.getDate()).padStart(2,"0")}` : ""}
                    </span>
                    <span 
                      style={{
                        width: "86px",
                        height: "23px",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "16px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#1A1A1A",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      お知らせ
                    </span>
                    <Link 
                      href={`/news/${item.id}`} 
                      style={{
                        fontWeight: "700",
                        fontFamily: "Noto Sans JP",
                        fontSize: "16px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#1A1A1A",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                        flex: "1"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#1e40af";
                        e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#1A1A1A";
                        e.currentTarget.style.textDecoration = "none";
                      }}
                    >
                      {item.title}
                    </Link>
                    {/* chevron_right */}
                    <div 
                      style={{
                        width: "24px",
                        height: "24px",
                        opacity: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <ChevronRight 
                        size={24} 
                        color="#1154AF"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* お知らせ一覧へ（枠） */}
          <div style={{ textAlign: "center" }}>
            <Link href="/news">
              <Button 
                variant="outline" 
                style={{
                  width: "220px",
                  height: "40px",
                  gap: "20px",
                  opacity: 1,
                  padding: "8px 12px",
                  borderRadius: "4px",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  boxShadow: "2px 2px 2px 0px #00000040",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "3px 3px 3px 0px #00000040";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "2px 2px 2px 0px #00000040";
                }}
              >
                {/* テキストとchevron_forwardを一つのフレームとして中央揃え */}
                <div 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px"
                  }}
                >
                  {/* お知らせ一覧へ（テキスト） */}
                  <span 
                    style={{
                      width: "112px",
                      height: "23px",
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "700",
                      fontStyle: "Bold",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    お知らせ一覧へ
                  </span>
                  {/* chevron_forward */}
                  <div 
                    style={{
                      width: "24px",
                      height: "24px",
                      opacity: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ChevronRight 
                      size={24} 
                      color="#FFFFFF"
                    />
                  </div>
                </div>
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
          {/* ①と②のコンテナ */}
          <div 
            style={{
              width: "240px",
              height: "75px",
              margin: "0 auto 32px auto",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* ①CONTACT */}
            <div 
              style={{
                width: "62px",
                height: "17px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              CONTACT
            </div>
            {/* ②お問い合わせ */}
            <div 
              style={{
                width: "240px",
                height: "58px",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "40px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              お問い合わせ
            </div>
          </div>

          {/* ③説明文 */}
          <div 
            style={{
              width: "746px",
              height: "104px",
              margin: "0 auto 32px auto",
              gap: "10px",
              opacity: 1,
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <p 
              style={{
                width: "726px",
                height: "84px",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "16px",
                lineHeight: "28px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF"
              }}
            >
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
            {/* ①お電話でのお問い合わせ */}
            <Card 
              style={{
                width: "400px",
                height: "172px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                borderRadius: "8px",
                padding: "32px 40px",
                border: "1px solid #1A1A1A",
                background: "#FFFFFF",
                color: "#1a1a1a",
                boxShadow: "none"
              }}
            >
              <CardContent style={{ 
                padding: 0, 
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}>
                {/* ①電話記号＋お電話でのお問い合わせ */}
                <div 
                  style={{
                    width: "204px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    opacity: 1,
                    margin: "0 auto 16px auto"
                  }}
                >
                  <PhoneCall 
                    style={{ 
                      width: "18px", 
                      height: "18px", 
                      color: "#666666",
                      marginTop: "2.98px",
                      marginLeft: "3px"
                    }} 
                  />
                  <h3 style={{ fontWeight: "bold", fontSize: "16px", margin: 0 }}>お電話でのお問い合わせ</h3>
                </div>
                {/* ②電話番号＋受付時間 */}
                <div 
                  style={{
                    width: "320px",
                    height: "69px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    opacity: 1,
                    margin: "0 auto"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span 
                      style={{
                        width: "43px",
                        height: "29px",
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "20px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#2B5EC5",
                        opacity: 1
                      }}
                    >
                      TEL.
                    </span>
                    <span 
                      style={{
                        width: "239px",
                        height: "46px",
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "36px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#2B5EC5",
                        opacity: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      028-612-1472
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>受付時間：年中無休 09:00~17:00</p>
                </div>
              </CardContent>
            </Card>

            {/* ②フォームでのお問い合わせ */}
            <Card 
              style={{
                width: "400px",
                height: "172px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                borderRadius: "8px",
                padding: "32px 40px",
                border: "1px solid #1A1A1A",
                background: "#FFFFFF",
                color: "#374151",
                boxShadow: "none"
              }}
            >
              <CardContent style={{ 
                padding: 0, 
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}>
                {/* ③フォームでの問い合わせ */}
                <div 
                  style={{
                    width: "220px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    opacity: 1,
                    margin: "0 auto 16px auto"
                  }}
                >
                  <img 
                    src="/forum.png"
                    alt="フォーラム"
                    style={{
                      width: "20px",
                      height: "20px"
                    }}
                  />
                  <h3 style={{ fontWeight: "bold", fontSize: "16px", margin: 0 }}>フォームでのお問い合わせ</h3>
                </div>
                {/* ④お問合せフォームへボタン */}
                <Link href="/contact">
                  <Button 
                    style={{
                      width: "280px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "16px",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                      boxShadow: "2px 2px 2px 0px #00000040",
                      border: "none",
                      cursor: "pointer",
                      transition: "opacity 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    お問い合わせフォームへ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ③トラック買取の問い合わせ */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card 
              style={{
                width: "472px",
                height: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                borderRadius: "8px",
                padding: "24px 60px",
                border: "1px solid #1A1A1A",
                background: "#FFFFFF",
                color: "#2563eb",
                boxShadow: "none"
              }}
            >
              <CardContent style={{ 
                padding: 0, 
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}>
                {/* ⑤トラック買取をご希望の方はこちら */}
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <div 
                    style={{
                      width: "360px",
                      height: "29px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 1,
                      margin: "0 auto 8px auto",
                      position: "relative",
                      cursor: "pointer",
                      transition: "opacity 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <div 
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "20px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#2B5EC5"
                      }}
                    >
                      トラック買取をご希望の方はこちら
                    </div>
                    <ChevronRight 
                      style={{
                        width: "24px",
                        height: "24px",
                        color: "#2B5EC5",
                        position: "absolute",
                        top: "2.5px",
                        right: "0px"
                      }}
                    />
                  </div>
                </Link>
                {/* ⑥無料査定実施中 */}
                <div 
                  style={{
                    width: "320px",
                    height: "19px",
                    fontFamily: "Noto Sans JP",
                    fontWeight: "400",
                    fontStyle: "Regular",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#1A1A1A",
                    opacity: 1,
                    textAlign: "center"
                  }}
                >
                  無料査定実施中！！
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
