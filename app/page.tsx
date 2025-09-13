"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  "ダンプ・ローダーダンプ",
  "ミキサー車",
  "アームロール",
  "重機回送車",
  "車両運搬車",
  "高所作業車",
  "塵芥車",
  "平ボディ",
  "バン・ウイング",
  "冷蔵冷凍車",
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
    question: "営業時間は何時ですか？",
    answer:
      "365日、8:00-17:00となります。このお時間に合わないという方も時間外でも、柔軟に対応いたしますので、お気軽にお問い合わせください。※店舗不在時には折り返しさせて頂きます。",
  },
  {
    question: "色替え可能ですか?",
    answer:
      "可能です。ノアコーポレションでは自社での塗装場を保有しておりますでのお客様の希望の色に車両の色を変更することが可能でございます。",
  },
  {
    question: "ローン / リースは可能ですか？",
    answer:
      "可能です。ローンの場合には提携ローン会社にて審査のうえ対応させていただきます。リース対応も可能です。",
  },
]

// 車両タイプのアイコンデータ（2行×6列の並び順に合わせる）
const vehicleTypeIcons = [
  // 1行目
  { id: 1, type: "クレーン", icon: "/icons/crane.png" },
  { id: 2, type: "ダンプ・ローダーダンプ", icon: "/icons/dump.png" },
  { id: 3, type: "ミキサー車", icon: "/icons/mixer.png" },
  { id: 4, type: "アームロール", icon: "/icons/arm-roll.png" },
  { id: 5, type: "重機回送車", icon: "/icons/carrier.png" },
  { id: 6, type: "車両運搬車", icon: "/icons/car-carrier.png" },
  // 2行目
  { id: 7, type: "高所作業車", icon: "/icons/aerial.png" },
  { id: 8, type: "塵芥車", icon: "/icons/garbage.png" },
  { id: 9, type: "平ボディ", icon: "/icons/flatbed.png" },
  { id: 10, type: "バン・ウイング", icon: "/icons/van.png" },
  { id: 11, type: "冷蔵冷凍車", icon: "/refrigerated_car.jpg" },
  { id: 12, type: "特装車・その他", icon: "/icons/special.png" },
]

// プルダウンの選択肢
const bodyTypes = [
  "クレーン",
  "ダンプ・ローダーダンプ",
  "ミキサー車",
  "アームロール",
  "重機回送車",
  "車両運搬車",
  "高所作業車",
  "塵芥車",
  "平ボディ",
  "バン・ウイング",
  "冷蔵冷凍車",
  "特装車・その他",
]

const makers = [
  "日野",
  "いすゞ",
  "三菱ふそう",
  "UD",
  "トヨタ",
  "日産",
  "マツダ",
  "その他",
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
  const router = useRouter();
  
  // 検索条件の状態管理
  const [selectedType, setSelectedType] = useState("");
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
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

    // 総車両数を取得（在庫数表示用）: SOLD OUTを除外
    getVehicles().then((allVehicles) => {
      const availableCount = allVehicles.filter(v => !(v as any).isSoldOut).length;
      setTotalVehicles(availableCount);
    }).catch((error) => {
      console.error("総車両数取得エラー:", error);
    });
  }, []);

  // 検索ボタンクリック時のハンドラー
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedType) params.append("type", selectedType);
    if (selectedMaker) params.append("maker", selectedMaker);
    if (selectedSize) params.append("size", selectedSize);
    if (searchKeyword) params.append("keyword", searchKeyword);
    
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Hero, Truck Type Grid, Search Section Combined */}
      <section 
        className="desktop-only"
        style={{
          width: "100%",
          maxWidth: "100vw",
          opacity: 1,
          top: "9rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          background: `
            linear-gradient(90deg, rgba(0, 0, 0, 0.4) 43.5%, rgba(255, 255, 255, 0) 100%),
            url('/store_photos.jpg'),
            url('/1_after_painting_examples.jpg'),
            url('/2_after_painting_examples.jpg')
          `,
          backgroundSize: "cover, 33.33% 88%, 33.33% 88%, 33.33% 88%",
          backgroundPosition: "center, left, center, right",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
          position: "absolute",
          zIndex: 1,
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
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "3.43rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "0.29rem 0.29rem 0.29rem 0px #0000004D",
                margin: "0 0 0 0",
                textAlign: "left"
              }}
              className="hidden lg:block"
            >
              豊富な在庫!!挑戦価格‼<br/>　　　ノアコーポレーション
            </h1>
            <div 
              style={{
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
                textAlign: "left",
                whiteSpace: "nowrap"
              }}
              className="hidden lg:block"
            >
              豊富な在庫車両数から、お探しの1台に出会える
              <br />
              栃木の中古トラック販売店です。
              <br />
              お気軽にお問合せ、現車確認にお越しください。
            </div>
          </div>
        </div>

        {/* Hero Section (Mobile only) */}
        <div 
          className="block lg:hidden"
          style={{
            color: "white",
            height: "auto",
            background: "linear-gradient(90deg, rgba(0, 0, 0, 0.4) 43.5%, rgba(255, 255, 255, 0) 100%), url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div 
            style={{
              width: "77.08%",
              maxWidth: "1100px",
              textAlign: "left"
            }}
          >
            <h1 
              style={{
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "18px",
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "0.29rem 0.29rem 0.29rem 0px #0000004D",
                margin: "0 0 1rem 1rem",
                textAlign: "left",
                whiteSpace: "nowrap"
              }}
            >
              豊富な在庫!!<br/>挑戦価格!!<br/>ノアコーポレーション
            </h1>
            <div 
              style={{
                height: "auto",
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontSize: "12px",
                lineHeight: "1.6",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "0.14rem 0.14rem 0.14rem rgba(0, 0, 0, 0.3)",
                margin: "0 0 1rem 1rem",
                textAlign: "left",
                whiteSpace: "nowrap"
              }}
            >
              豊富な在庫車両数から、お探しの1台に出会える
              <br />
              栃木の中古トラック販売店です。
              <br />
              お気軽にお問合せ、現車確認にお越しください。
            </div>
          </div>
        </div>


        {/* Truck Type Grid */}
        <div 
          className="hidden lg:block"
          style={{
            padding: "0rem 1.43rem 0 1.43rem",
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
                    justifyContent: "flex-start",
                    position: "relative",
                    padding: "0.57rem"
                  }}
                >
                  <div 
                    style={{
                      width: icon.type === "ダンプ・ローダーダンプ" ? "3rem" : "4.57rem",
                      height: icon.type === "ダンプ・ローダーダンプ" ? "3rem" : "4.57rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: icon.type === "ダンプ・ローダーダンプ" ? "0.5rem" : "0.29rem"
                    }}
                  >
                    <img 
                      src={
                        icon.type === "クレーン" ? "/crane.jpg" :
                        icon.type === "ダンプ・ローダーダンプ" ? "/dump.jpg" :
                        icon.type === "ミキサー車" ? "/mixer.jpg" :
                        icon.type === "アームロール" ? "/arm-roll.png" :
                        icon.type === "重機回送車" ? "/carrier.jpg" :
                        icon.type === "車両運搬車" ? "/car_carrier.png" :
                        icon.type === "高所作業車" ? "/aerial.jpg" :
                        icon.type === "塵芥車" ? "/garbage.jpg" :
                        icon.type === "平ボディ" ? "/flatbed.png" :
                        icon.type === "バン・ウイング" ? "/van.png" :
                        icon.type === "冷蔵冷凍車" ? "/refrigerated_car.jpg" :
                        "/special.jpg"
                      }
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
                      lineHeight: "120%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#1A1A1A",
                      maxWidth: "11.43rem",
                      whiteSpace: "pre-line",
                      padding: "0.17rem",
                      marginTop: icon.type === "ダンプローダーダンプ" ? "0.2rem" : "0"
                    }}
                  >
                    {icon.type === "ダンプ・ローダーダンプ" ? "ダンプ・\nローダーダンプ" : icon.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div 
          className="hidden lg:block"
          style={{
            padding: "0.857rem 1.43rem 4rem 1.43rem",
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
                    {truckTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
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
                    value={selectedMaker}
                    onChange={(e) => setSelectedMaker(e.target.value)}
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
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
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
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
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
      
      {/* スマホ版 Hero Section - 独立した要素 */}
      <section 
        className="block lg:hidden"
        style={{
          width: "100%",
          maxWidth: "100vw",
          opacity: 1,
          top: "9rem",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 1,
          backgroundColor: "#E9E9E9"
        }}
      >
        <div 
          style={{
            color: "white",
            height: "210px",
            background: `
              linear-gradient(90deg, rgba(0, 0, 0, 0.4) 43.5%, rgba(255, 255, 255, 0) 100%),
              url('/store_photos.jpg'),
              url('/1_after_painting_examples.jpg'),
              url('/2_after_painting_examples.jpg')
            `,
            backgroundSize: "cover, 33.33% 60%, 33.33% 60%, 33.33% 60%",
            backgroundPosition: "center, left, center, right",
            backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat"
          }}
        >
          <div 
            style={{
              width: "77.08%",
              maxWidth: "1100px",
              textAlign: "left"
            }}
          >
            <h1 
              style={{
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "18px",
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "0.29rem 0.29rem 0.29rem 0px #0000004D",
                margin: "0 0 1rem 1rem",
                textAlign: "left",
                whiteSpace: "nowrap"
              }}
            >
              豊富な在庫!!<br/>挑戦価格!!<br/>ノアコーポレーション
            </h1>
            <div 
              style={{
                height: "auto",
                opacity: 1,
                fontFamily: "Noto Sans JP",
                fontWeight: 700,
                fontSize: "12px",
                lineHeight: "1.6",
                letterSpacing: "0%",
                color: "#FFFFFF",
                textShadow: "0.14rem 0.14rem 0.14rem rgba(0, 0, 0, 0.3)",
                margin: "0 0 1rem 1rem",
                textAlign: "left",
                whiteSpace: "nowrap"
              }}
            >
              豊富な在庫車両数から、お探しの1台に出会える
              <br />
              栃木の中古トラック販売店です。
              <br />
              お気軽にお問合せ、現車確認にお越しください。
            </div>
          </div>
        </div>
      </section>
      
      {/* Spacer to account for absolute positioned Hero Section */}
      <div style={{ height: "55rem" }}></div>

      {/* スマホ版 Truck Type Grid - 独立した要素 */}
      <section 
        className="lg:hidden block"
        style={{
          width: "100%",
          maxWidth: "100vw",
          opacity: 1,
          top: "calc(9rem + 20rem)",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 1,
          padding: "2rem 1rem",
          background: "white"
        }}
      >
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(6, 1fr)",
            gap: "1rem",
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            height: "auto"
          }}
        >
          {vehicleTypeIcons.map((icon) => (
            <Link
              key={icon.id}
              href={`/inventory?type=${encodeURIComponent(icon.type)}`}
              style={{
                height: "8rem",
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 0.07rem 0.21rem rgba(0, 0, 0, 0.1)",
                opacity: 1,
                border: "1px solid #e5e7eb"
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
                  justifyContent: "flex-start",
                  position: "relative",
                  padding: "0.5rem"
                }}
              >
                <div 
                  style={{
                    width: icon.type === "ダンプローダーダンプ" ? "3rem" : "3.5rem",
                    height: icon.type === "ダンプローダーダンプ" ? "3rem" : "3.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: icon.type === "ダンプローダーダンプ" ? "0.5rem" : "0.29rem"
                  }}
                >
                  <img 
                    src={`/${icon.type === "クレーン" ? "crane" : 
                         icon.type === "ダンプローダーダンプ" ? "dump" :
                         icon.type === "平ボディ" ? "flatbed" :
                         icon.type === "重機回送車" ? "carrier" :
                         icon.type === "ミキサー車" ? "mixer" :
                         icon.type === "アルミバン" ? "van" :
                         icon.type === "高所作業車" ? "aerial" :
                         icon.type === "アルミウィング" ? "wing" :
                         icon.type === "車両運搬車" ? "car_carrier" :
                         icon.type === "塵芥車" ? "garbage" :
                         icon.type === "アームロール" ? "arm-roll" :
                         "special"}.${icon.type === "平ボディ" || icon.type === "アームロール" || icon.type === "車両運搬車" ? "png" : "jpg"}`}
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
                    fontSize: "0.9rem",
                    lineHeight: "120%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#1A1A1A",
                    maxWidth: "100%",
                    whiteSpace: "pre-line",
                    padding: "0.17rem",
                    marginTop: icon.type === "ダンプローダーダンプ" ? "0.2rem" : "0"
                  }}
                >
                  {icon.type === "ダンプローダーダンプ" ? "ダンプ\nローダーダンプ" : icon.type}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* スマホ版 Search Section - 独立した要素 */}
      <section 
        className="lg:hidden block"
        style={{
          width: "100%",
          maxWidth: "100vw",
          opacity: 1,
          top: "calc(9rem + 20rem + 37rem)",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 1,
          padding: "2rem 1rem",
          background: "white"
        }}
      >
        <div 
          style={{
            width: "100%",
            margin: "0 auto",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            opacity: 1,
            borderRadius: "0.5rem",
            padding: "1rem",
            background: "#f5f5f5"
          }}
        >
          {/* 車両検索（ボディタイプ） */}
          <div 
            style={{
              width: "100%",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              padding: "0 1rem",
              background: "#FFFFFF",
              position: "relative"
            }}
          >
            <select
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                fontSize: "1rem",
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
              {truckTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              style={{ 
                color: "#1A1A1A",
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }} 
            />
          </div>

          {/* 車両検索（メーカー） */}
          <div 
            style={{
              width: "100%",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              padding: "0 1rem",
              background: "#FFFFFF",
              position: "relative"
            }}
          >
            <select
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                fontSize: "1rem",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                color: "#1A1A1A",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none"
              }}
              value={selectedMaker}
              onChange={(e) => setSelectedMaker(e.target.value)}
            >
              <option value="">メーカー：すべて</option>
              {makers.map((maker) => (
                <option key={maker} value={maker}>{maker}</option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              style={{ 
                color: "#1A1A1A",
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }} 
            />
          </div>

          {/* 車両検索（大きさ） */}
          <div 
            style={{
              width: "100%",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              padding: "0 1rem",
              background: "#FFFFFF",
              position: "relative"
            }}
          >
            <select
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                fontSize: "1rem",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                color: "#1A1A1A",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none"
              }}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">大きさ：すべて</option>
              {sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              style={{ 
                color: "#1A1A1A",
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }} 
            />
          </div>

          {/* 右側のフリーワードと検索ボタン */}
          <div 
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {/* 車両検索（フリーワード） */}
            <div 
              style={{
                flex: 1,
                height: "3rem",
                display: "flex",
                alignItems: "center",
                borderRadius: "0.5rem",
                padding: "0 1rem",
                background: "#FFFFFF"
              }}
            >
              <input
                type="text"
                placeholder="問い合わせ番号、車体番号など"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "1rem",
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  color: "#1A1A1A",
                  outline: "none"
                }}
              />
            </div>

            {/* 検索ボタン */}
            <button
              onClick={handleSearch}
              style={{
                minWidth: "6rem",
                height: "3rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                color: "white",
                border: "none",
                fontSize: "1rem",
                fontFamily: "Noto Sans JP",
                fontWeight: "600",
                cursor: "pointer",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              検索する
            </button>
          </div>

        </div>
      </section>

      {/* New Trucks Section */}
      <section 
        className="new-trucks-section"
        style={{
          width: "77.08%",
          maxWidth: "79.28rem",
          gap: "2.86rem",
          opacity: 1,
          paddingBottom: "2.857rem",
          margin: "0 auto",
          marginTop: "0",
          marginBottom: "2.86rem"
        }}
      >
        {/* NEW TRUCK and 新着車両 section */}
        <div style={{ marginBottom: "2.857rem", display: "flex", justifyContent: "center" }}>
          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div 
              style={{
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "1rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#2B5EC5",
                borderRadius: "0.14rem",
                whiteSpace: "nowrap",
                paddingLeft: "0",
                marginBottom: "2px",
              }}
            >
              NEW TRUCK
            </div>
            <div 
              style={{
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "2.86rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#1A1A1A",
                whiteSpace: "nowrap",
                marginBottom: "0.57rem",
              }}
            >
              新着車両
            </div>
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
              現在、<span style={{ opacity: 1, fontFamily: "Noto Sans JP", fontWeight: "700", fontStyle: "Bold", fontSize: "2.29rem", lineHeight: "100%", letterSpacing: "0%", color: "#EA1313", textDecoration: "underline" }}>{totalVehicles}</span>台の在庫が閲覧可能です
            </p>
          </div>

          {/* 新着車輌の表示 */}
          <div 
            className="home-vehicle-grid"
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
                    className="vehicle-card-header"
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
                      {(() => {
                        const makerLabel = (vehicle.maker === "三菱ふそう" ? "三菱" : vehicle.maker) || "";
                        const typeLabel = (vehicle.vehicleType || vehicle.model || "").trim();
                        return `${makerLabel}${typeLabel ? ` ${typeLabel}` : ""}`.trim();
                      })()}
                    </span>
                    <span style={{ 
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
                    className="vehicle-inquiry-number"
                    style={{
                      height: "2.5rem",
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                        <span style={{
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
                    {vehicle.imageUrls && vehicle.imageUrls.length > 0 && vehicle.imageUrls[0] ? (
                      <img
                        src={vehicle.imageUrls[0]}
                        alt={`${vehicle.maker} ${vehicle.name}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          // エラーが発生した場合は画像を非表示にする
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f3f4f6",
                        color: "#9ca3af",
                        fontSize: "0.86rem"
                      }}>
                        画像なし
                      </div>
                    )}
                    
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
                    className="vehicle-detail-table"
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
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
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
                        height: "100%",
                        width:"30.76%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>本体価格</span>
                      </div>
                      <div style={{ 
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <div style={{ whiteSpace: "nowrap" }}>
                        <span style={{
                          height: "1.64rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "2.29rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2B5EC5"
                        }} className="price-text">
                          {vehicle.price ? Math.floor(vehicle.price / 10000) : "000"}
                        </span>
                        <span style={{
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
                        height: "100%",
                        width:"30.76%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>年式</span>
                      </div>
                      <div style={{ 
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
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
                        height: "100%",
                        width:"30.76%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>走行距離</span>
                      </div>
                      <div style={{ 
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
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
                        height: "100%",
                        width:"30.76%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>積載量</span>
                      </div>
                      <div style={{ 
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
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
                        height: "100%",
                        width:"30.76%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>シフト</span>
                      </div>
                      <div style={{ 
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
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
                        height: "100%",
                        width:"30.76%",
                        background: "#E6E6E6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span style={{
                          height: "1.43rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>車検期限</span>
                      </div>
                      <div style={{ 
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: "0.86rem"
                      }}>
                        <span style={{
                          height: "1.21rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
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
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                <span style={{ 
                  height: "1.64rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center"
                }}>在庫をもっと見る</span>
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

      {/* Features Section */}
      <section 
        style={{
          width: "100%",
          maxWidth: "100vw",
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
          <div style={{ marginBottom: "2.29rem", display: "flex", justifyContent: "center" }}>
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontStyle: "Regular",
                  fontSize: "1rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#2B5EC5",
                  marginBottom: "0.143rem",
                }}
              >
                FEATURE
              </div>
              <div 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "clamp(1.25rem, 6vw, 2.5rem)",
                  lineHeight: "1.3",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#1A1A1A",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                ノアコーポレーションの特徴3点
              </div>
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
                className={index === 0 ? "feature-row feature-row--reason1" : index === 1 ? "feature-row feature-row--reason2" : index === 2 ? "feature-row feature-row--reason3" : undefined}
                style={{
                  width: "100%",
                  maxWidth: "60.64rem",
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
                      className="feature-segment feature-segment--image"
                      style={{
                        width: "43%",
                        height: "100%",
                        backgroundImage: "url('/reason1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
                      {/* mobile only reason badge over image */}
                      <div className="mobile-only feature-reason-badge">
                        <div className="reason-label" style={{
                          height: "1.71rem",
                          fontFamily: "Noto Sans JP",
                          fontWeight: 400,
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2B5EC5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>reason</div>
                        <div className="reason-number" style={{
                          width: "auto",
                          height: "auto",
                          fontFamily: "Noto Sans JP",
                          fontWeight: 600,
                          fontStyle: "SemiBold",
                          fontSize: "2rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2B5EC5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>{feature.number}</div>
                      </div>
                    </div>
                    <div 
                      className="feature-segment feature-segment--gray"
                      style={{
                        width: "43%",
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
                      className="feature-segment feature-segment--white"
                      style={{
                        width: "14%",
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
                      className="feature-segment feature-segment--white"
                      style={{
                        width: "14%",
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
                            marginLeft: "0.5rem"
                          }}
                        >
                          {feature.number}
                        </div>
                      </div>
                    </div>
                    <div 
                      className="feature-segment feature-segment--gray"
                      style={{
                        width: "43%",
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
                          height: "auto",
                          width: "100%",
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
                      className="feature-segment feature-segment--image"
                      style={{
                        width: "43%",
                        height: "100%",
                        backgroundImage: "url('/reason2.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
                      {/* mobile only reason badge over image (same as REASON1) */}
                      <div className="mobile-only feature-reason-badge">
                        <div className="reason-label" style={{
                          height: "1.71rem",
                          fontFamily: "Noto Sans JP",
                          fontWeight: 400,
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2B5EC5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>reason</div>
                        <div className="reason-number" style={{
                          width: "auto",
                          height: "auto",
                          fontFamily: "Noto Sans JP",
                          fontWeight: 600,
                          fontStyle: "SemiBold",
                          fontSize: "2rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2B5EC5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>{feature.number}</div>
                      </div>
                    </div>
                  </>
                )}

                {/* REASON3: 画像 → グレー背景 → 白背景 */}
                {index === 2 && (
                  <>
                    <div 
                      className="feature-segment feature-segment--image"
                      style={{
                        width: "43%",
                        height: "100%",
                        backgroundImage: "url('/reason3.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
                      {/* mobile only reason badge over image (same as REASON1/2) */}
                      <div className="mobile-only feature-reason-badge">
                        <div className="reason-label" style={{
                          height: "1.71rem",
                          fontFamily: "Noto Sans JP",
                          fontWeight: 400,
                          fontStyle: "Regular",
                          fontSize: "1rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2B5EC5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>reason</div>
                        <div className="reason-number" style={{
                          width: "auto",
                          height: "auto",
                          fontFamily: "Noto Sans JP",
                          fontWeight: 600,
                          fontStyle: "SemiBold",
                          fontSize: "2rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#2B5EC5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>{feature.number}</div>
                      </div>
                    </div>
                    <div 
                      className="feature-segment feature-segment--gray"
                      style={{
                        width: "43%",
                        height: "100%",
                        backgroundColor: "#E6E6E6",
                        position: "relative"
                      }}
                    >
                      <h3 
                        style={{
                          width: "100%",
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
                      className="feature-segment feature-segment--white"
                      style={{
                        width: "14%",
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontStyle: "Regular",
                  fontSize: "1rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#2B5EC5",
                  marginBottom: "0.143rem",
                }}
              >
                FLOW
              </div>
              <div 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "2.86rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#1A1A1A",
                  whiteSpace: "nowrap",
                }}
              >
                ご利用の流れ
              </div>
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
          width: "100%",
          gap: "2.857rem",
          opacity: 1,
          background: "#FFFFFF",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div 
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "0 1.429rem",
            paddingTop: "2.857rem"
          }}
        >
          {/* QUESTIONセクション */}
          <div style={{ marginBottom: "3.429rem", display: "flex", justifyContent: "center" }}>
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontStyle: "Regular",
                  fontSize: "1rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#2B5EC5",
                  marginBottom: "0.143rem",
                }}
              >
                QUESTION
              </div>
              <div 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "2.857rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#1A1A1A",
                  whiteSpace: "nowrap",
                  marginBottom: "1.143rem",
                }}
              >
                よくあるご質問
              </div>
            </div>
          </div>

          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.143rem",
              width: "100%",
              maxWidth: "57.143rem"
            }}
          >
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                className="!p-0 !m-0 !border-0 !shadow-none"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.571rem",
                  boxShadow: "0 0.143rem 0.286rem rgba(0, 0, 0, 0.1)",
                  margin: 0
                }}
              >
                <CardContent className="!p-0" style={{ padding: 0 }}>
                  {/* Q部分デザイン */}
                  <div style={{
                    width: "58.571rem",
                    height: "3.214rem",
                    opacity: 1,
                    padding: "0.286rem 0.857rem",
                    borderRadius: "0.286rem",
                    background: "#F2F2F2",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.143rem"
                  }}>
                    <span style={{
                      width: "1.857rem",
                      height: "2.071rem",
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "1.429rem",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#1CA0C8",
                      borderRadius: "0.286rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "0.857rem"
                    }}>
                      Q.
                    </span>
                    <span style={{
                      width: "22.857rem",
                      height: "2.071rem",
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "1.429rem",
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
                    width: "58.571rem",
                    height: "5.714rem",
                    opacity: 1,
                    padding: "0.571rem 0.857rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.857rem"
                  }}>
                    <span 
                      style={{
                        width: "1.857rem",
                        height: "2.071rem",
                        fontFamily: "Noto Sans JP, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "1.429rem",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#EA1313",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "0.857rem"
                      }}
                    >
                      A.
                    </span>
                    <span style={{
                      width: "51.571rem",
                      height: "4rem",
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "1.143rem",
                      lineHeight: "2rem",
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
          width: "100%",
          maxWidth: "820px",
          gap: "2.857rem",
          opacity: 1,
          paddingTop: "4.286rem",
          paddingBottom: "4.286rem",
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
            paddingTop: "2.857rem",
            padding: "2.857rem 0 0 0"
          }}
        >
          {/* SHOP INFOセクション */}
          <div style={{ marginBottom: "1.714rem", display: "flex", justifyContent: "center" }}>
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontStyle: "Regular",
                  fontSize: "1rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#2B5EC5",
                }}
              >
                SHOP INFO
              </div>
              <div 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "700",
                  fontStyle: "Bold",
                  fontSize: "2.857rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "left",
                  color: "#1A1A1A",
                  whiteSpace: "nowrap",
                }}
              >
                店舗情報
              </div>
            </div>
          </div>

          {/* 3つのフレームのコンテナ */}
          <div 
            style={{
              display: "flex",
              width: "100%",
              marginBottom: "1.143rem",
              justifyContent: "space-between",
            }}
          >
            {/* 1. テキストフレーム */}
            <div 
              style={{
                width: "50.73%",
                opacity: 1,
                display: "flex",
                flexDirection: "column"
              }}
            >
                <div 
                  style={{
                    flex: "1"
                  }}
                >
                  <div style={{ 
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: "0"
                  }}>
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      flex: "1",
                      padding: "0"
                    }}
                  >
                    <div style={{ 
                      width: "100%",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      <div style={{ 
                        width: "27%",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        display: "flex",
                        alignItems: "flex-start",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>所在地</span>
                      </div>
                      <div style={{ 
                        flex: "1",
                        opacity: 1,
                        padding: "0 0.857rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "100%",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1.143rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "left",
                          whiteSpace: "pre-line"
                        }}>
                          〒321-0411{'\n'}栃木県宇都宮市宮山田町406-4
                        </span>
                      </div>
                    </div>
                    <div style={{ 
                      width: "100%",
                      minHeight: "3.929rem",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        width: "27%",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>TEL</span>
                      </div>
                      <div style={{ 
                        flex: "1",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "left",
                          whiteSpace: "nowrap"
                        }}>028-612-1474</span>
                      </div>
                    </div>
                    <div style={{ 
                      width: "100%",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        width: "27%",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
                        }}>FAX</span>
                      </div>
                      <div style={{ 
                        flex: "1",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "left",
                          whiteSpace: "nowrap"
                        }}>028-333-1023</span>
                      </div>
                    </div>
                    <div style={{ 
                      width: "100%",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        width: "27%",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>営業時間</span>
                      </div>
                      <div style={{ 
                        flex: "1",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "left",
                          whiteSpace: "nowrap"
                        }}>8:00~17:00</span>
                      </div>
                    </div>
                    <div style={{ 
                      width: "100%",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ 
                        width: "27%",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          whiteSpace: "nowrap"
                        }}>定休日</span>
                      </div>
                      <div style={{ 
                        flex: "1",
                        gap: "0.714rem",
                        opacity: 1,
                        padding: "0.857rem 0.857rem",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        minHeight: "2.5rem"
                      }}>
                        <span style={{ 
                          width: "auto",
                          height: "2.5rem",
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          fontSize: "1.143rem",
                          lineHeight: "2.5rem",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          textAlign: "left",
                          whiteSpace: "nowrap"
                        }}>年中無休</span>
                      </div>
                    </div>
                    {/* アクセス方法へボタン */}
                    <div style={{ 
                      width: "100%",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "auto",
                      marginBottom: "0",
                      padding: "0"
                    }}>
                      <Link href="/about#access">
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
                          }}>アクセス方法へ</span>
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
                </div>
              </div>
            </div>

            {/* 2. 写真フレーム */}
            <div 
              style={{
                width: "46.82%",
                gap: "0.286rem",
                opacity: 1,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Card 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                  overflow: "hidden"
                }}
              >
                <CardContent style={{ padding: 0, width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  {/* 1段目：大きい画像 */}
                  <div style={{ width: "100%", height: "20.991rem", marginBottom: "0.571rem" }}>
                    <img
                      src="/shopinfo_truck1.jpg"
                      alt="店舗写真1"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center bottom",
                        borderRadius: "0rem"
                      }}
                    />
                  </div>
                  {/* 2段目：小さい画像3枚横並び */}
                  <div style={{ width: "100%", display: "flex", gap: "0.571rem", justifyContent: "space-between" }}>
                    <img
                      src="/shopinfo_truck2.jpg"
                      alt="店舗写真2"
                      style={{
                        width: "31.25%",
                        height: "6.42rem",
                        objectFit: "cover",
                        objectPosition: "center bottom",
                        borderRadius: "0rem",
                        boxShadow: "0 0.143rem 0.571rem rgba(0,0,0,0.10)"
                      }}
                    />
                    <img
                      src="/shopinfo_truck3.jpg"
                      alt="店舗写真3"
                      style={{
                        width: "31.25%",
                        height: "6.42rem",
                        objectFit: "cover",
                        objectPosition: "center bottom",
                        borderRadius: "0rem",
                        boxShadow: "0 0.143rem 0.571rem rgba(0,0,0,0.10)"
                      }}
                    />
                    <img
                      src="/shopinfo_truck4.jpg"
                      alt="店舗写真4"
                      style={{
                        width: "31.25%",
                        height: "6.42rem",
                        objectFit: "cover",
                        objectPosition: "center bottom",
                        borderRadius: "0rem",
                        boxShadow: "0 0.143rem 0.571rem rgba(0,0,0,0.10)"
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
              width: "100%",
              maxWidth: "1200px",
              height: "18.333rem",
              display: "block",
              borderRadius: "0rem",
              overflow: "hidden",
              boxShadow: "0 0.143rem 0.571rem rgba(0,0,0,0.10)",
              marginTop: "1.143rem"
            }}
          >
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=%E6%A0%83%E6%9C%A8%E7%9C%8C%E3%81%95%E3%81%8F%E3%82%89%E5%B8%82%E5%90%91%E6%B2%B3%E5%8E%9F3994-1&output=embed"
              width="820"
              height="18.333rem"
              style={{ border: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </a>
        </div>
      </section>
     
     
     
       {/* Contact Section */}
          <section 
            style={{
              width: "100%",
              maxWidth: "100vw",
              opacity: 1,
              paddingTop: "4.286rem",
              paddingBottom: "4.286rem",
              background: "#666666",
              color: "white",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
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
                padding: "0 1.429rem"
              }}
            >
          {/* ①と②のコンテナ */}
          <div 
            style={{
              width: "17.143rem",
              height: "5.357rem",
              margin: "0 auto 2.286rem auto",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* ①CONTACT */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div 
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontWeight: "400",
                    fontStyle: "Regular",
                    fontSize: "1rem",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "left",
                    color: "#FFFFFF",
                    marginBottom: "0.5rem",
                  }}
                >
                  CONTACT
                </div>
                {/* ②お問い合わせ */}
                <div 
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontWeight: "700",
                    fontStyle: "Bold",
                    fontSize: "2.857rem",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "left",
                    color: "#FFFFFF",
                  }}
                >
                  お問い合わせ
                </div>
              </div>
            </div>
          </div>

          {/* ③説明文 */}
          <div 
            style={{
              width: "53.286rem",
              height: "7.429rem",
              margin: "0 auto 2.286rem auto",
              gap: "0.714rem",
              opacity: 1,
              padding: "0.714rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <p 
              style={{
                width: "51.857rem",
                height: "6rem",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "1.143rem",
                lineHeight: "2rem",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF"
              }}
            >
              車両の在庫確認 / 車両の状態、仕様確認 / 買取依頼
              <br />
              気になることがありましたら、お気軽にお問い合わせください。
            </p>
          </div>

          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2.286rem",
              maxWidth: "57.143rem",
              width: "100%",
              marginBottom: "2.286rem"
            }}
          >
            {/* ①お電話でのお問い合わせ */}
            <Card 
              style={{
                width: "28.571rem",
                height: "12.286rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.571rem",
                borderRadius: "0.571rem",
                padding: "2.286rem 2.857rem",
                border: "0.071rem solid #1A1A1A",
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
                    width: "14.571rem",
                    height: "1.714rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.286rem",
                    opacity: 1,
                    margin: "0 auto 1.143rem auto"
                  }}
                >
                  <PhoneCall 
                    style={{ 
                      width: "1.286rem", 
                      height: "1.286rem", 
                      color: "#666666",
                      marginTop: "0.213rem",
                      marginLeft: "0.214rem"
                    }} 
                  />
                  <h3 style={{ fontWeight: "bold", fontSize: "1.143rem", margin: 0 }}>お電話でのお問い合わせ</h3>
                </div>
                {/* ②電話番号＋受付時間 */}
                <div 
                  style={{
                    width: "22.857rem",
                    height: "4.929rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.286rem",
                    opacity: 1,
                    margin: "0 auto"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.571rem" }}>
                    <span 
                      style={{
                        width: "3.071rem",
                        height: "2.071rem",
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "1.429rem",
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
                        width: "17.071rem",
                        height: "3.286rem",
                        fontFamily: "Noto Sans JP",
                        fontWeight: "700",
                        fontStyle: "Bold",
                        fontSize: "2.571rem",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#2B5EC5",
                        opacity: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      028-612-1474
                    </span>
                  </div>
                  <p style={{ fontSize: "1rem", color: "#1a1a1a", margin: 0 }}>受付時間：月〜日 8:00~17:00 <br/><span style={{ whiteSpace: "nowrap" }}>※店舗不在時には折り返しさせて頂きます。</span></p>
                </div>
              </CardContent>
            </Card>

            {/* ②フォームでのお問い合わせ */}
            <Card 
              style={{
                width: "28.571rem",
                height: "12.286rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.714rem",
                borderRadius: "0.571rem",
                padding: "2.286rem 2.857rem",
                border: "0.071rem solid #1A1A1A",
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
                    width: "15.714rem",
                    height: "1.714rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.286rem",
                    opacity: 1,
                    margin: "0 auto 1.143rem auto"
                  }}
                >
                  <img 
                    src="/forum.png"
                    alt="フォーラム"
                    style={{
                      width: "1.429rem",
                      height: "1.429rem"
                    }}
                  />
                  <h3 style={{ fontWeight: "bold", fontSize: "1.143rem", margin: 0 }}>フォームでのお問い合わせ</h3>
                </div>
                {/* ④お問合せフォームへボタン */}
                <Link href="/contact">
                  <Button 
                    style={{
                      width: "20.71rem",
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
                    }}>お問い合わせフォームへ</span>
                    <svg
                      width="7.4"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "0.86rem",
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
              </CardContent>
            </Card>
          </div>

          {/* ③トラック買取の問い合わせ */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card 
              style={{
                width: "33.714rem",
                height: "7.143rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.286rem",
                borderRadius: "0.571rem",
                padding: "1.714rem 4.286rem",
                border: "0.071rem solid #1A1A1A",
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
                      width: "25.714rem",
                      height: "2.071rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 1,
                      margin: "0 auto 0.571rem auto",
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
                        fontSize: "1.429rem",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#2B5EC5",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        whiteSpace: "nowrap"
                      }}
                    >
                      買取 / 下取り ご希望の方はこちらから
                      <ChevronRight 
                        style={{
                          width: "1.714rem",
                          height: "1.714rem",
                          color: "#2B5EC5"
                        }}
                      />
                    </div>
                  </div>
                </Link>
                {/* ⑥無料査定実施中 */}
                <div 
                  style={{
                    width: "22.857rem",
                    height: "1.357rem",
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
                  LINEで査定実施中！！
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
