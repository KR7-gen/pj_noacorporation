"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, ChevronRight, ChevronDown } from "lucide-react"
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
  const [currentPage, setCurrentPage] = useState(1)
  const vehiclesPerPage = 20

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
        (vehicle.name && vehicle.name.toLowerCase().includes(keyword)) ||
        (vehicle.maker && vehicle.maker.toLowerCase().includes(keyword)) ||
        (vehicle.model && vehicle.model.toLowerCase().includes(keyword)) ||
        (vehicle.description && vehicle.description.toLowerCase().includes(keyword)) ||
        (vehicle.inquiryNumber && vehicle.inquiryNumber.toLowerCase().includes(keyword))
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
    setCurrentPage(1) // 検索時に1ページ目に戻る
  }

  // ページネーション計算
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage)
  const startIndex = (currentPage - 1) * vehiclesPerPage
  const endIndex = startIndex + vehiclesPerPage
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex)

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      <div 
        style={{
          width: "1440px",
          height: "3282px",
          gap: "32px",
          opacity: 1,
          paddingTop: "0px",
          paddingRight: "168px",
          paddingBottom: "60px",
          paddingLeft: "168px",
          margin: "0 auto",
          background: "#F5F5F5"
        }}
      >
        {/* ヘッダー */}
        <div 
          style={{
            width: "100%",
            height: "400px",
            opacity: 1,
            backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.4) 43.5%, rgba(255, 255, 255, 0) 100%), url('/sub_background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto"
          }}
        >
          <h1 
            style={{
              fontFamily: "Noto Sans JP",
              fontWeight: "700",
              fontStyle: "Bold",
              fontSize: "40px",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#FFFFFF",
              margin: "0 auto",
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
            }}
          >
            販売在庫一覧
          </h1>
        </div>

        {/* 車両タイプアイコン */}
        <div 
          style={{
            padding: "48px 20px",
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
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
              <div
                key={icon.id}
                onClick={() => handleIconClick(icon.type)}
                style={{
                  width: "176px",
                  height: "96px",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedType === icon.type ? "#E3F2FD" : "white",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  opacity: 1,
                  cursor: "pointer",
                  border: selectedType === icon.type ? "2px solid #2196F3" : "2px solid transparent"
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
                           icon.type === "車両運搬車" ? "carrier" :
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
              </div>
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
             {/* 左側の検索フィールド群 */}
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
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                >
                  <option value="all">ボディタイプ：すべて</option>
                  {truckTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
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
                  value={formMaker}
                  onChange={(e) => setFormMaker(e.target.value)}
                >
                  <option value="all">メーカー：すべて</option>
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
                  value={formSize}
                  onChange={(e) => setFormSize(e.target.value)}
                >
                  <option value="all">大きさ：すべて</option>
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
                    value={formKeyword}
                    onChange={(e) => setFormKeyword(e.target.value)}
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

        {/* 結果件数 */}
        <div 
          style={{
            marginBottom: "24px",
            padding: "0 20px"
          }}
        >
          <p 
            style={{
              fontFamily: "Noto Sans JP",
              fontWeight: "400",
              fontSize: "16px",
              color: "#666666",
              margin: 0
            }}
          >
            検索結果: <span style={{ fontWeight: "600" }}>{filteredVehicles.length}</span>件
            {vehicles.length === 0 && (
              <span style={{ marginLeft: "8px", color: "#FF6B35" }}>
                （車両データが登録されていません。adminで車両を登録してください）
              </span>
            )}
          </p>
        </div>

        {/* 車両一覧 */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {filteredVehicles.length === 0 ? (
            <div 
              style={{
                textAlign: "center",
                padding: "48px 20px"
              }}
            >
              <p 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontSize: "18px",
                  color: "#666666"
                }}
              >
                該当する車両が見つかりませんでした。
              </p>
            </div>
          ) : (
            <>
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(5, 1fr)",
                gap: "1.43rem",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto 0 auto",
                padding: "0 20px"
              }}
            >
              {currentVehicles.map((vehicle) => (
              <Card 
                key={vehicle.id}
                style={{
                  width: "260px",
                  height: "587px",
                  gap: "12px",
                  opacity: 1,
                  borderRadius: "0px",
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
                      color: "#FFFFFF",
                      whiteSpace: "nowrap"
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
                        fontSize: "12px"
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
            </>
          )}
        </div>
      </div>
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
          {/* ①タイトル */}
          <div 
            style={{
              width: "746px",
              height: "104px",
              margin: "0 auto 48px auto",
              gap: "10px",
              opacity: 1,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <h2 
              style={{
                width: "726px",
                height: "48px",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "30px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF",
                margin: "0 auto 16px auto"
              }}
            >
              CONTACT
            </h2>
            <p 
              style={{
                width: "726px",
                height: "40px",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF",
                margin: "0 auto"
              }}
            >
              お問い合わせ
            </p>
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
                  <Phone 
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
