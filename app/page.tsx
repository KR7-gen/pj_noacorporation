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
    title: "豊富な在庫車両数\n常時100台を超える在庫を保有し、\nすぐに引渡可能です",
  },
  {
    number: "02",
    title: "ダンプ / クレーン / 高所作業車\nその他多数の特装車をそろえて\n問い合わせをお待ちしております",
  },
  {
    number: "03",
    title: "業界最安値に挑戦\nコストを抑えた仕入れ戦略により、\n業界内の最安値を目指して\n営業しております",
  },
]

const flowSteps = [
  {
    number: "01",
    title: "お問い合わせ",
    description:
      "販売在庫一覧 から、気になる車両をお探しください。もしお探しの条件を満たすトラックが見つからない場合にも、まずは気軽にご相談ください。仕入れてすぐの車両の為まだ写真の掲載ができていない車両などもございます。",
  },
  {
    number: "02",
    title: "現車確認・ご商談",
    description:
      "栃木県宇都宮市の展示場にて現車を確認いただく事ができます。上物の動作確認もお気軽にお試しください。展示場までお越しいただくことが難しい場合も、動画やお電話で車両の詳細な状態をお伝えすることも可能です。",
  },
  {
    number: "03",
    title: "お見積もり",
    description:
      "ご納得いただきました車両に関しては、お客様毎の必要な条件を加味しました、最終お見積りをご用意いたします。ノアコーポレーションでは、車検整備、ナンバー登録、タイヤ交換、車両カラーの変更、またローンやリースなどへの対応も可能ですので、お気軽にご相談ください。",
  },
  {
    number: "04",
    title: "ご契約・ご納車",
    description:
      "お見積もり内容に納得いただけましたら、FAX/郵送での契約書ご署名、ご入金を経て、お引き渡しとなります。当社では、お客様とのお取引履歴をすべて社内システムで管理しております。下取りや新たなトラックの購入が必要になった際も、まずはご相談いただければ、スムーズにお話ができるかと思います。",
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
          width: "100vw",
          height: "57.14rem",
          opacity: 1,
          top: "9rem",
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
            padding: "4.57rem 1.43rem",
            flex: "1"
          }}
        >
          <div 
            style={{
              width: "77.08%",
              maxWidth: "1100px",
              margin: "0 auto",
              textAlign: "left"
            }}
          >
            <h1 
              style={{
                width: "45.14rem",
                height: "5rem",
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "3.43rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "0.29rem 0.29rem 0.29rem 0px #0000004D",
                margin: "0 0 1.71rem 0",
                textAlign: "left"
              }}
            >
              キャッチコピー
            </h1>
            <div 
              style={{
                width: "45.14rem",
                height: "8.57rem",
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "1.71rem",
                lineHeight: "2.86rem",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "0.14rem 0.14rem 0.14rem rgba(0, 0, 0, 0.3)",
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
            padding: "3.43rem 1.43rem 0 1.43rem",
            flex: "1"
          }}
        >
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0.57rem",
              width: "77.08%",
              maxWidth: "78.57rem",
              margin: "0 auto"
            }}
          >
            {vehicleTypeIcons.map((icon) => (
              <Link
                key={icon.id}
                href={`/inventory?type=${encodeURIComponent(icon.type)}`}
                style={{
                  height: "6.86rem",
                  borderRadius: "0.29rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0.07rem 0.21rem rgba(0, 0, 0, 0.1)",
                  opacity: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-0.14rem)";
                  e.currentTarget.style.boxShadow = "0 0.29rem 0.57rem rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0.07rem 0.21rem rgba(0, 0, 0, 0.1)";
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
                      width: "4.57rem",
                      height: "4.57rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.57rem"
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
                      fontSize: "1.14rem",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#1A1A1A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "11.43rem"
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
            padding: "0.857rem 1.43rem 10rem 1.43rem",
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {/* 背景 */}
          <div 
            style={{
              width: "77.08%",
              maxWidth: "1100px",
              margin: "0 auto",
              height: "3.93rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: 1,
              borderRadius: "0.29rem",
              padding: "0.57rem 0.35rem",
              background: "#CCCCCC"
            }}
          >
            {/* 左側の検索フィールド群 */}
            <div 
              style={{
                width: "50.27%",
                display: "flex",
                alignItems: "center"
              }}
            >
              {/* 車両検索（ボディタイプ） */}
              <div 
                style={{
                  width: "39%",
                  margin: "0.43rem",
                  height: "2.29rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.29rem",
                  borderRadius: "0.29rem",
                  padding: "0.29rem 0.57rem",
                  background: "#FFFFFF",
                  position: "relative"
                }}
              >
                                  <select
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "1.14rem",
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
                      right: "0.57rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      margin: "0",
                      padding: "0"
                    }} 
                  />
              </div>

              {/* 車両検索（メーカー） */}
              <div 
                style={{
                  width: "33%",
                  margin: "0.43rem",
                  height: "2.36rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.29rem",
                  borderRadius: "0.29rem",
                  padding: "0.29rem 0.57rem",
                  background: "#FFFFFF",
                  position: "relative"
                }}
              >
                                  <select
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "1.14rem",
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
                      right: "0.57rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      margin: "0",
                      padding: "0"
                    }} 
                  />
              </div>

              {/* 車両検索（大きさ） */}
              <div 
                style={{
                  width: "30%",
                  margin: "0.43rem",
                  height: "2.29rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.29rem",
                  borderRadius: "0.29rem",
                  padding: "0.29rem 0.57rem",
                  background: "#FFFFFF",
                  position: "relative"
                }}
              >
                                  <select
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "1.14rem",
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
                      right: "0.57rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      margin: "0",
                      padding: "0"
                    }} 
                  />
              </div>
            </div>

            {/* 右側のフリーワードと検索ボタン */}
            <div 
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              {/* 車両検索（フリーワード） */}
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "80%",
                  justifyContent: "flex-end"
                }}
              >
                <span 
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontWeight: "400",
                    fontSize: "1.14rem",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#1A1A1A",
                    whiteSpace: "nowrap",
                    marginRight: "0.5rem"
                  }}
                >
                  フリーワード
                </span>
                <div 
                  style={{
                    width: "65%",
                    margin: "0.43rem",
                    height: "2.29rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.71rem",
                    borderRadius: "0.29rem",
                    padding: "0.29rem 0.57rem",
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
                      fontSize: "1.14rem",
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
                  minWidth: "120px",
                  width: "15%",
                  height: "2.79rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.71rem",
                  borderRadius: "0.29rem",
                  padding: "0.57rem",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.3s ease",
                  marginRight: "0.5rem"
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
                    fontSize: "1.14rem",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#FFFFFF",
                    whiteSpace: "nowrap"
                  }}
                >
                  検索する
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Spacer to account for absolute positioned Hero Section */}
      <div style={{ height: "66.14rem" }}></div>

      {/* New Trucks Section */}
      <section 
        style={{
          width: "78.57vw",
          maxWidth: "1100px",
          gap: "2.86rem",
          opacity: 1,
          paddingBottom: "2.857rem",
          background: "#FFFFFF",
          margin: "0 auto",
          marginTop: "0",
          marginBottom: "2.86rem"
        }}
      >
        {/* NEW TRUCK and 新着車両 section */}
        <div style={{ marginBottom: "2.857rem" }}>
          <div 
            style={{
              width: "14.41%",
              height: "1.21rem",
              margin: "0 auto 2px auto",
              fontFamily: "Noto Sans JP",
              fontWeight: "400",
              fontStyle: "Regular",
              fontSize: "1rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "left",
              color: "#2B5EC5",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              borderRadius: "0.14rem",
              whiteSpace: "nowrap",
              paddingLeft: "0",
            }}
          >
            NEW TRUCK
          </div>
          <div 
            style={{
              width: "14.41%",
              height: "3rem",
              margin: "0 auto 0.57rem auto",
              fontFamily: "Noto Sans JP",
              fontWeight: "700",
              fontStyle: "Bold",
              fontSize: "2.86rem",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
            }}
          >
            新着車両
          </div>
        </div>

        <div 
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 現在、X台の在庫が閲覧可能です section */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ opacity: 1, fontFamily: "Noto Sans JP", fontWeight: "400", fontStyle: "Regular", fontSize: "1.14rem", lineHeight: "100%", letterSpacing: "0%", color: "#1A1A1A" }}>
              現在、<span style={{ opacity: 1, fontFamily: "Noto Sans JP", fontWeight: "700", fontStyle: "Bold", fontSize: "2.29rem", lineHeight: "100%", letterSpacing: "0%", color: "#EA1313", textDecoration: "underline" }}>{latestVehicles.length}</span>台の在庫が閲覧可能です
            </p>
          </div>

          {/* 新着車輌の表示 */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.43rem",
              width: "100%",
              maxWidth: "85.71rem",
              marginBottom: "3.43rem"
            }}
          >
            {latestVehicles.map((vehicle, index) => (
              <Card 
                key={vehicle.id}
                style={{
                  width: "100%",
                  height: "41.93rem",
                  gap: "0.86rem",
                  opacity: 1,
                  borderRadius: "0",
                  paddingBottom: "1.14rem",
                  borderWidth: "0.07rem",
                  background: "#FFFFFF",
                  border: "0.07rem solid #F2F2F2",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                <CardContent style={{ padding: "0" }}>
                  {/* ヘッダーバー */}
                  <div 
                    style={{
                      height: "2.79rem",
                      background: "#1A1A1A",
                      padding: "0.57rem 0.86rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ 
                      width: "10rem",
                      height: "1.64rem",
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "700",
                      fontStyle: "Bold",
                      fontSize: "1.14rem",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#FFFFFF",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {(vehicle.maker === "三菱ふそう" ? "三菱" : vehicle.maker)}
                    </span>
                    <span style={{ 
                      width: "6.36rem",
                      height: "1.21rem",
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      fontStyle: "Regular",
                      fontSize: "1rem",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#FFFFFF",
                      whiteSpace: "nowrap"
                    }}>
                      {vehicle.modelCode || vehicle.model}
                    </span>
                  </div>
                  
                  {/* 問い合わせ番号 */}
                  <div 
                    style={{
                      height: "2.5rem",
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <span style={{
                      width: "11.21rem",
                      height: "1.36rem",
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      fontStyle: "Regular",
                      fontSize: "1.14rem",
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
                      height: "12.86rem",
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
                          height: "2.79rem",
                          backgroundColor: vehicle.isSoldOut ? "#EA1313" : "#666666",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <span style={{
                          width: "3.43rem",
                          height: "1.64rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.14rem",
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
                      height: "19.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* ボディタイプ */}
                    <div 
                      style={{
                        height: "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        background: "#FFFFFF",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "16.57rem",
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
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
                        height: "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.79rem",
                        color: "#374151",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "5.71rem",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "4rem",
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>本体価格</span>
                      </div>
                      <div style={{ 
                        width: "12.86rem",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <div>
                          <span style={{
                            width: "4.07rem",
                            height: "1.64rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "700",
                            fontStyle: "Bold",
                            fontSize: "2.29rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5"
                          }}>
                            {vehicle.price ? Math.floor(vehicle.price / 10000) : "000"}
                          </span>
                          <span style={{
                            width: "4.07rem",
                            height: "1rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "0.86rem",
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
                        height: "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.79rem",
                        color: "#374151",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "5.71rem",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "4rem",
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>年式</span>
                      </div>
                      <div style={{ 
                        width: "12.86rem",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
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
                        height: "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.79rem",
                        color: "#374151",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "5.71rem",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "4rem",
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>走行距離</span>
                      </div>
                      <div style={{ 
                        width: "12.86rem",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          width: "6.29rem",
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
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
                        height: "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.79rem",
                        color: "#374151",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "5.71rem",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "4rem",
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>積載量</span>
                      </div>
                      <div style={{ 
                        width: "12.86rem",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          width: "6.29rem",
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
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
                        height: "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.79rem",
                        color: "#374151",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "5.71rem",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "4rem",
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>シフト</span>
                      </div>
                      <div style={{ 
                        width: "12.86rem",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          width: "6.29rem",
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
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
                        height: "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.79rem",
                        color: "#374151",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        width: "5.71rem",
                        height: "100%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          width: "4rem",
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>車検期限</span>
                      </div>
                      <div style={{ 
                        width: "12.86rem",
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          width: "6.29rem",
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
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
                    height: "4.29rem", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    background: "#FFFFFF"
                  }}>
                    <Link href={`/vehicle/${vehicle.id}`}>
                      <Button 
                        style={{
                          width: "11.43rem",
                          height: "2.29rem",
                          gap: "0.57rem",
                          opacity: 1,
                          paddingTop: "0.29rem",
                          paddingRight: "0.57rem",
                          paddingBottom: "0.29rem",
                          paddingLeft: "0.57rem",
                          borderRadius: "0.29rem",
                          border: "0.07rem solid #333333",
                          background: "#FFFFFF",
                          boxShadow: "0.14rem 0.14rem 0.14rem 0px #00000040",
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
                          width: "6rem",
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "1.43rem",
                          letterSpacing: "0%",
                          color: "#333333",
                          display: "flex",
                          alignItems: "center",
                          transform: "translateY(-0.07rem)"
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
                            height: "1.43rem",
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
                  width: "15.71rem",
                  height: "2.86rem",
                  gap: 0,
                  opacity: 1,
                  padding: "0",
                  borderRadius: "0.29rem",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  boxShadow: "0.14rem 0.14rem 0.14rem 0px #00000040",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.29rem",
                    opacity: 1,
                    fontFamily: "Noto Sans JP",
                    fontWeight: 700,
                    fontStyle: "Bold",
                    fontSize: "1.14rem",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#FFFFFF",
                    margin: 0,
                    padding: 0
                  }}
                >
                  在庫をもっと見る
                  <ChevronRight
                    style={{
                      width: "1.71rem",
                      height: "1.71rem",
                      opacity: 1,
                      color: "#FFFFFF",
                      margin: 0,
                      padding: 0
                    }}
                  />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        style={{
          width: "102.86rem",
          gap: "2.86rem",
          opacity: 1,
          paddingBottom: "1.71rem",
          background: "#FFFFFF",
          margin: "2.86rem auto"
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
            padding: "0 1.43rem"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.29rem" }}>
            <div 
              style={{
                width: "31vw",
                height: "1.21rem",
                margin: "0 auto 0.143rem auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "1rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              FEATURE
            </div>
            <div 
              style={{
                width: "31vw",
                minWidth: "22.86rem",
                height: "4.14rem",
                margin: "0 auto 0 auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "2.86rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
            >
              ノアコーポレーションの特徴3点
            </div>
          </div>

          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2.29rem",
              width: "100%",
              maxWidth: "85.71rem",
              marginBottom: "3.43rem",
              alignItems: "center"
            }}
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  width: index === 2 ? "60.64rem" : "60.64rem",
                  height: "16.07rem",
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
                        width: "24.07rem",
                        height: "100%",
                        backgroundImage: "url('/reason1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                    <div 
                      style={{
                        width: "25.71rem",
                        height: "100%",
                        backgroundColor: "#E6E6E6",
                        position: "relative"
                      }}
                    >
                      <h3 
                        style={{
                          width: "24rem",
                          height: "auto",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.43rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          whiteSpace: "pre-line",
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
                        width: "10.86rem",
                        height: "100%",
                        backgroundColor: "white",
                        position: "relative"
                      }}
                    >
                      <div 
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.86rem"
                        }}
                      >
                        <div 
                          style={{
                            width: "4.57rem",
                            height: "1.71rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "1.43rem",
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
                            width: "4rem",
                            height: "3.36rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "600",
                            fontStyle: "SemiBold",
                            fontSize: "3.5rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "translateY(-0.57rem)",
                            marginRight: "0.5rem"
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
                        width: "10.86rem",
                        height: "100%",
                        backgroundColor: "white",
                        position: "relative"
                      }}
                    >
                      <div 
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.86rem",
                          zIndex: 10
                        }}
                      >
                        <div 
                          style={{
                            width: "4.57rem",
                            height: "1.71rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "1.43rem",
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
                            width: "4rem",
                            height: "3.36rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "600",
                            fontStyle: "SemiBold",
                            fontSize: "3.5rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "translateY(-0.57rem)",
                            marginRight: "0.5rem"
                          }}
                        >
                          {feature.number}
                        </div>
                      </div>
                    </div>
                    <div 
                      style={{
                        width: "25.71rem",
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
                          width: "22.86rem",
                          height: "auto",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.43rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          whiteSpace: "pre-line",
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
                        width: "24.07rem",
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
                        width: "24.07rem",
                        height: "100%",
                        backgroundImage: "url('/reason3.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />
                    <div 
                      style={{
                        width: "25.71rem",
                        height: "100%",
                        backgroundColor: "#E6E6E6",
                        position: "relative"
                      }}
                    >
                      <h3 
                        style={{
                          width: "22.86rem",
                          height: "auto",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.43rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          whiteSpace: "pre-line",
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
                        width: "10.86rem",
                        height: "100%",
                        backgroundColor: "white",
                        position: "relative"
                      }}
                    >
                      <div 
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.86rem"
                        }}
                      >
                        <div 
                          style={{
                            width: "4.57rem",
                            height: "1.71rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
                            fontSize: "1.43rem",
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
                            width: "4rem",
                            height: "3.36rem",
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "600",
                            fontStyle: "SemiBold",
                            fontSize: "3.5rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "translateY(-0.57rem)",
                            marginRight: "0.5rem"
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
                  width: "15.71rem",
                  height: "2.86rem",
                  gap: "2.57rem",
                  opacity: 1,
                  paddingTop: "0.57rem",
                  paddingRight: "0.86rem",
                  paddingBottom: "0.57rem",
                  paddingLeft: "0.86rem",
                  borderRadius: "0.29rem",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  boxShadow: "0.14rem 0.14rem 0.14rem 0 #00000040",
                  color: "#FFFFFF",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "1.14rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <span style={{ 
                  height: "1.64rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center"
                }}>詳しく見る</span>
                <svg
                  width="7.4"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "13.71rem",
                    color: "#FFFFFF"
                  }}
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="4"
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
          maxWidth: "100vw",
          minHeight: "auto",
          gap: "40px",
          opacity: 1,
          paddingTop: "1.71rem",
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
          {/* 見出し（白枠の外） */}
          <div 
            style={{
              width: "66.67vw",
              maxWidth: "960px",
              margin: "2.857rem auto 1.14rem auto",
              textAlign: "center"
            }}
          >
            <div 
              style={{
                width: "13vw",
                height: "1.21rem",
                margin: "0 auto 0.143rem auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "1rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              FLOW
            </div>
            <div 
              style={{
                width: "13vw",
                height: "4.14rem",
                margin: "0 auto 0 auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "2.86rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
            >
              ご利用の流れ
            </div>
          </div>
          
                    {/* 白枠コンテンツ */}
          <div
            style={{
              width: "66.67vw",
              maxWidth: "960px",
              backgroundColor: "white",
              padding: "2.857rem 0.86rem",
              margin: "2.857rem auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.86rem"
            }}
          >
            <p 
              style={{ 
                width: "55.43rem",
                height: "4rem",
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "1.14rem",
                lineHeight: "2rem",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#1A1A1A",
                margin: 0
              }}
            >
              初回お問い合わせからご納車まで、わかりやすくスムーズなお取引を心がけております。中古トラックの購入がはじめての方も、どうぞお気軽にお問い合わせください。
            </p>
            {flowSteps.map((step, index) => (
              <div key={index}>
                <div 
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    marginTop: index === 0 ? "2.143rem" : "0",
                    marginBottom: index < flowSteps.length - 1 ? "0.57rem" : "0",
                    width: "100%",
                    height: "9.714rem"
                  }}
                >
                  <div 
                    style={{
                      width: "7.71rem",
                      height: "9.714rem",
                      opacity: 1,
                      borderRight: "0.07rem solid #DEEBEF",
                      padding: "1.14rem 0.57rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1.71rem"
                    }}
                  >
                    <div 
                      style={{
                        width: "2.86rem",
                        height: "1.43rem",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "1rem",
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
                        width: "3.07rem",
                        height: "3.29rem",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "2.57rem",
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
                  <div style={{ flex: 1, height: "9.714rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 
                      style={{
                        width: "8.57rem",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "1.43rem",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#1A1A1A",
                        marginBottom: "0.86rem",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.57rem"
                      }}
                    >
                      {step.title}
                                            <img
                        src={`/${step.number === "01" ? "mail.svg" : step.number === "02" ? "airport_shuttle.svg" : step.number === "03" ? "calculate.svg" : "handshake.svg"}`}
                        alt={`FLOW ${step.number} icon`}
                        style={{
                          width: step.number === "01" ? "2.38rem" : "2.86rem",
                          height: step.number === "01" ? "1.91rem" : "2.86rem",
                          opacity: 1,
                          objectFit: "contain",
                          filter: "brightness(0.4)"
                        }}
                      />
                      {step.number === "01" && "☎"}
                    </h3>
                    <p 
                      style={{
                        width: "98%",
                        opacity: 1,
                        fontFamily: "Noto Sans JP",
                        fontWeight: "400",
                        fontStyle: "Regular",
                        fontSize: "1.14rem",
                        lineHeight: "2rem",
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
                      marginBottom: "0.57rem"
                    }}
                  >
                    <div 
                      style={{
                        width: "4.43rem",
                        height: "1.43rem",
                        opacity: 1,
                        display: "block",
                        background: "none",
                        borderLeft: "2.21rem solid transparent",
                        borderRight: "2.21rem solid transparent",
                        borderTop: "1.43rem solid #2563eb"
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
                width: "15vw",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              QUESTION
            </div>
            <div 
              style={{
                width: "15vw",
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
                whiteSpace: "nowrap",
              }}
            >
              よくあるご質問
            </div>
          </div>

          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              width: "100%",
              maxWidth: "800px"
            }}
          >
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                className="!p-0 !m-0 !border-0 !shadow-none"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  margin: 0
                }}
              >
                <CardContent className="!p-0" style={{ padding: 0 }}>
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
                width: "9vw",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              SHOP INFO
            </div>
            <div 
              style={{
                width: "9vw",
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
                whiteSpace: "nowrap",
              }}
            >
              店舗情報
            </div>
          </div>

          {/* 3つのフレームのコンテナ */}
          <div 
            style={{
              display: "flex",
              gap: "2px",
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
                      width: "100%",
                      minHeight: "55px",
                      gap: "10px",
                      opacity: 1,
                      padding: "10px 12px",
                      borderBottom: "1px solid #e5e7eb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}>
                      <span style={{ 
                        width: "auto",
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
                        flex: "1",
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
                      width: "100%",
                      minHeight: "55px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        minWidth: "80px",
                        minHeight: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <span style={{ 
                          width: "auto",
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
                        flex: "1",
                        minHeight: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}>
                        <span style={{ 
                          width: "auto",
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
                      width: "100%",
                      minHeight: "55px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        minWidth: "80px",
                        minHeight: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <span style={{ 
                          width: "auto",
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
                        flex: "1",
                        minHeight: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}>
                        <span style={{ 
                          width: "auto",
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
                      width: "100%",
                      minHeight: "55px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        minWidth: "80px",
                        minHeight: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <span style={{ 
                          width: "auto",
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
                        flex: "1",
                        minHeight: "55px",
                        gap: "10px",
                        opacity: 1,
                        padding: "12px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}>
                        <span style={{ 
                          width: "auto",
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
                width: "9vw",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#2B5EC5",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              NEWS
            </div>
            <div 
              style={{
                width: "9vw",
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
                whiteSpace: "nowrap",
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
              gap: "2px",
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
