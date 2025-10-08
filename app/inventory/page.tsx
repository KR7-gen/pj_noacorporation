"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {useIsMobile} from "@/hooks/use-mobile"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, ChevronRight, ChevronDown, ArrowUpDown } from "lucide-react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Vehicle } from "@/types"

// 車両タイプのアイコンデータ（2行×6列の並び順に合わせる）
const vehicleTypeIcons = [
  // 1行目
  { id: 1, type: "クレーン", icon: "/icons/crane.png" },
  { id: 2, type: "ダンプ・ローダーダンプ", typeMobile: "ダンプ・\nローダー\nダンプ", icon: "/icons/dump.png" },
  { id: 3, type: "ミキサー車", icon: "/icons/mixer.png" },
  { id: 4, type: "アームロール", icon: "/icons/arm-roll.png" },
  { id: 5, type: "重機回送車・セルフクレーン", typeMobile: "重機回送車・\nセルフ\nクレーン", icon: "/icons/carrier.png" },
  { id: 6, type: "キャリアカー・車両運搬車", typeMobile: "キャリアカー\n・車両運搬車", icon: "/icons/car-carrier.png" },
  // 2行目
  { id: 7, type: "高所作業車", icon: "/icons/aerial.png" },
  { id: 8, type: "塵芥車", icon: "/icons/garbage.png" },
  { id: 9, type: "平ボディ", icon: "/icons/flatbed.png" },
  { id: 10, type: "バン・ウイング", typeMobile: "バン・\nウイング", icon: "/icons/van.png" },
  { id: 11, type: "冷蔵冷凍車", icon: "/refrigerated_car.jpg" },
  { id: 12, type: "特装車・その他", typeMobile: "特装車・\nその他", icon: "/icons/special.png" },
]

// プルダウンの選択肢
const bodyTypes = [
  "クレーン",
  "ダンプ・ローダーダンプ",
  "ミキサー車",
  "アームロール",
  "重機回送車・セルフクレーン",
  "キャリアカー・車両運搬車",
  "高所作業車",
  "塵芥車",
  "平ボディ",
  "バン・ウイング",
  "冷蔵冷凍車",
  "特装車・その他"
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

export default function InventoryPage() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 検索条件の状態管理
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all")
  const [formType, setFormType] = useState(searchParams.get("type") || "all")
  const [formMaker, setFormMaker] = useState(searchParams.get("maker") || "all")
  const [formSize, setFormSize] = useState(searchParams.get("size") || "all")
  const [formKeyword, setFormKeyword] = useState(searchParams.get("keyword") || "")
  const [showSoldNegotiating, setShowSoldNegotiating] = useState(searchParams.get("hideSold") !== "true")
  const [tempShowSoldNegotiating, setTempShowSoldNegotiating] = useState(searchParams.get("hideSold") !== "true")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [vehiclesPerPage, setVehiclesPerPage] = useState<number>(20)

  // ソート機能の状態管理
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // URLパラメータが変更されたときに検索条件を更新
  useEffect(() => {
    const type = searchParams.get("type") || "all";
    const maker = searchParams.get("maker") || "all";
    const size = searchParams.get("size") || "all";
    const keyword = searchParams.get("keyword") || "";
    
    setSelectedType(type);
    setFormType(type);
    setFormMaker(maker);
    setFormSize(size);
    setFormKeyword(keyword);
  }, [searchParams]);

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
        // ダミー車両を110台生成（灰色プレースホルダー表示のため imageUrls は空）
        const bodyTypeCycle = [
          "クレーン",
          "ダンプ・ローダーダンプ",
          "ミキサー車",
          "アームロール",
          "重機回送車・セルフクレーン",
          "キャリアカー・車両運搬車",
          "高所作業車",
          "塵芥車",
          "平ボディ",
          "バン・ウイング",
          "冷蔵冷凍車",
          "特装車・その他",
        ];
        const makerCycle = ["日野", "いすゞ", "三菱ふそう", "UD", "トヨタ", "日産", "マツダ", "その他"];
        const sizeCycle = ["大型", "増トン", "中型", "小型"];
        const dummyVehicles: Vehicle[] = Array.from({length: 110}, (_, i) => {
          const idx = i + 1;
          return {
            id: `DUMMY-${idx}`,
            name: `ダミー車両 ${idx}`,
            maker: makerCycle[i % makerCycle.length],
            model: `D-${idx}`,
            modelCode: `DM${idx}`,
            bodyType: bodyTypeCycle[i % bodyTypeCycle.length],
            vehicleType: bodyTypeCycle[i % bodyTypeCycle.length],
            size: sizeCycle[i % sizeCycle.length],
            price: undefined,
            year: undefined,
            month: undefined,
            mileage: undefined,
            loadingCapacity: undefined,
            mission: undefined,
            shift: undefined,
            inspectionStatus: undefined,
            inquiryNumber: `N${String(idx).padStart(5, '0')}`,
            imageUrls: [],
            isPrivate: false,
            isTemporarySave: false,
            isSoldOut: false,
            isNegotiating: false,
          } as unknown as Vehicle;
        });
        const combined = [...dummyVehicles, ...fetchedVehicles];
        setVehicles(combined);
        setFilteredVehicles(combined);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const normalizeType = (t: string) => {
    const s = (t || "").trim();
    if (!s) return "";
    if (s === "ダンプ") return "ダンプ・ローダーダンプ";
    if (s === "車輌運搬車" || s === "キャリアカー") return "キャリアカー・車両運搬車";
    if (s === "アルミウィング" || s === "アルミバン") return "バン・ウイング";
    if (s === "重機運搬車") return "重機回送車・セルフクレーン";
    return s;
  };

  // 検索条件に基づいてフィルタリング
  useEffect(() => {
    let filtered = vehicles;

    // ボディタイプでフィルタリング（bodyType が未設定の場合は vehicleType を参照）
    if (formType && formType !== "all") {
      filtered = filtered.filter(vehicle => {
        const type = normalizeType(vehicle.bodyType || vehicle.vehicleType || "");
        return type === normalizeType(formType);
      });
    }

    // メーカーでフィルタリング
    if (formMaker && formMaker !== "all") {
      filtered = filtered.filter(vehicle => vehicle.maker === formMaker);
    }

    // サイズでフィルタリング
    if (formSize && formSize !== "all") {
      filtered = filtered.filter(vehicle => vehicle.size === formSize);
    }

    // キーワードでフィルタリング
    if (formKeyword) {
      const keyword = formKeyword.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.inquiryNumber?.toLowerCase().includes(keyword) ||
        vehicle.maker?.toLowerCase().includes(keyword) ||
        vehicle.model?.toLowerCase().includes(keyword) ||
        vehicle.bodyType?.toLowerCase().includes(keyword)
      );
    }

    setFilteredVehicles(filtered);
    setCurrentPage(1); // 検索時にページを1に戻す
  }, [vehicles, formType, formMaker, formSize, formKeyword]);

  // フィルタリング処理
  useEffect(() => {
    let filtered = vehicles;

    // 非公開車両と一時保存車両を除外
    filtered = filtered.filter(vehicle => !vehicle.isPrivate && !vehicle.isTemporarySave);

    // SOLD/商談中の車両を除外（チェックが外れている場合）
    if (!showSoldNegotiating) {
      filtered = filtered.filter(vehicle => !vehicle.isSoldOut && !vehicle.isNegotiating);
    }

    // ボディタイプでフィルタリング（bodyType が未設定の場合は vehicleType を参照）
    if (selectedType !== "all") {
      filtered = filtered.filter(vehicle => {
        const type = normalizeType(vehicle.bodyType || vehicle.vehicleType || "");
        return type === normalizeType(selectedType);
      });
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
  }, [vehicles, selectedType, formMaker, formSize, formKeyword, showSoldNegotiating]);

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
    if (!tempShowSoldNegotiating) params.set("hideSold", "true")
    
    setShowSoldNegotiating(tempShowSoldNegotiating)
    router.push(`/inventory?${params.toString()}`)
    setCurrentPage(1) // 検索時に1ページ目に戻る
  }

  // ソート機能
  const handleSort = (field: string) => {
    if (sortField === field) {
      // 同じフィールドの場合は方向を切り替え
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // 新しいフィールドの場合は昇順で開始
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // ソートされた車両リストを取得
  const getSortedVehicles = () => {
    if (!sortField) {
      // デフォルト並び替え
      // 1) SOLD OUT は末尾へ
      // 2) それ以外は作成日時の昇順（最初に出品されたものが先頭）
      const toTime = (value: any): number => {
        if (!value) return Number.MAX_SAFE_INTEGER
        // Firestore Timestamp
        if (typeof value === 'object' && value !== null) {
          if (typeof (value as any).toDate === 'function') {
            try { return (value as any).toDate().getTime() } catch { /* noop */ }
          }
          if (value instanceof Date) return value.getTime()
        }
        // 数値 or 文字列
        const t = new Date(value).getTime()
        return isNaN(t) ? Number.MAX_SAFE_INTEGER : t
      }

      return [...filteredVehicles].sort((a, b) => {
        const aSold = a.isSoldOut ? 1 : 0
        const bSold = b.isSoldOut ? 1 : 0
        if (aSold !== bSold) return aSold - bSold
        const aTime = toTime((a as any).createdAt)
        const bTime = toTime((b as any).createdAt)
        // 昇順（古い=先に出品）
        return aTime - bTime
      })
    }

    return [...filteredVehicles].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "price":
          aValue = a.price || 0
          bValue = b.price || 0
          break
        case "year":
          // 年式の比較（R6年 → 2024年 のような変換）
          const parseYear = (year: any) => {
            if (!year) return 0
            if (typeof year === 'string') {
              // R6年 → 2024年 のような変換
              if (year.startsWith('R')) {
                return 2018 + parseInt(year.substring(1))
              }
              // 数字のみの場合はそのまま
              const num = parseInt(year)
              return isNaN(num) ? 0 : num
            }
            return parseInt(year) || 0
          }
          aValue = parseYear(a.year)
          bValue = parseYear(b.year)
          break
        case "mileage":
          aValue = a.mileage || 0
          bValue = b.mileage || 0
          break
        default:
          return 0
      }

      if (sortDirection === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }

  // ソートされた車両リスト
  const sortedVehicles = getSortedVehicles()

  // ページネーション計算（ソートされたリストを使用）
  const totalPages = Math.ceil(sortedVehicles.length / vehiclesPerPage)
  const startIndex = (currentPage - 1) * vehiclesPerPage
  const endIndex = startIndex + vehiclesPerPage
  const currentVehicles = sortedVehicles.slice(startIndex, endIndex)

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
          width: "100%",
          maxWidth: "100vw",
          gap: "2.28rem",
          opacity: 1,
          paddingTop: "0px",
          paddingRight: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          margin: "0 auto",
          background: "#F5F5F5",
          minHeight: "auto"
        }}
      >
        {/* ヘッダー */}
        <div 
          className="inventory-hero"
          style={{
            width: "100%",
            minHeight: "28.57rem",
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
            className="inventory-hero-title"
            style={{
              fontFamily: "Noto Sans JP",
              fontWeight: "700",
              fontStyle: "Bold",
              fontSize: "2.857rem",
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
            padding: "3.43rem 1.43rem 0 1.43rem",
            flex: "1"
          }}
        >
          <div 
            className="inventory-type-icons"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0.57rem",
              width: "77.08%",
              margin: "0 auto"
            }}
          >
            {vehicleTypeIcons.map((icon) => (
              <div
                key={icon.id}
                onClick={() => handleIconClick(icon.type)}
                style={{
                  height: "8rem",
                  borderRadius: "0.29rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedType === icon.type ? "#E3F2FD" : "white",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0.07rem 0.21rem rgba(0, 0, 0, 0.1)",
                  opacity: 1,
                  cursor: "pointer",
                  border: selectedType === icon.type ? "2px solid #2196F3" : "2px solid transparent"
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
                        icon.type === "重機回送車・セルフクレーン" ? "/carrier.jpg" :
                        icon.type === "キャリアカー・車両運搬車" ? "/car_carrier.png" :
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
                      marginTop: icon.type === "ダンプ・ローダーダンプ" ? "0.2rem" : "0"
                    }}
                  >
                    {icon.type === "ダンプ・ローダーダンプ" ? "ダンプ・\nローダーダンプ" : 
                     icon.type === "重機回送車・セルフクレーン" ? "重機回送車・\nセルフクレーン" :
                     icon.type === "キャリアカー・車両運搬車" ? "キャリアカー・\n車両運搬車" : icon.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div 
          className="search-section"
          style={{
            padding: "0.857rem 1.43rem 2.86rem 1.43rem",
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
            className="inventory-search-container"
          >
            {/* 左側の検索フィールド群 */}
            <div 
              className="inventory-search-left"
              style={{
                width: "60%",
                display: "flex",
                alignItems: "center"
              }}
            >
              {/* 車両検索（ボディタイプ） */}
              <div 
                className="inventory-search-type"
                style={{
                  width: "50%",
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
                    fontSize: "0.9rem",
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
                  {bodyTypes.map((type) => (
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
                className="inventory-search-maker"
                style={{
                  width: "36%",
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
                    fontSize: "0.9rem",
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
                className="inventory-search-size"
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
                    fontSize: "0.9rem",
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

           {/* SOLD/商談中表示制御 */}
             <div 
               className="inventory-search-sold"
               style={{
                 width: "15%",
                 display: "flex",
                 flexDirection: "column",
                 alignItems: "center",
                 justifyContent: "center",
                 padding: "0.29rem"
               }}
             >
               <div 
                 style={{
                   display: "flex",
                   alignItems: "center",
                   gap: "0.29rem",
                   cursor: "pointer",
                   height: "2.5rem"
                 }}
                 onClick={() => setTempShowSoldNegotiating(!tempShowSoldNegotiating)}
               >
                 <div 
                   style={{
                     width: "2.285rem",
                     height: "2.285rem",
                     border: "1px solid #1A1A1A",
                     backgroundColor: tempShowSoldNegotiating ? "#1A1A1A" : "transparent",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     cursor: "pointer"
                   }}
                 >
                    {tempShowSoldNegotiating && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          color: "white"
                        }}
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                 </div>
                 <div 
                   style={{
                     display: "flex",
                     flexDirection: "column",
                     gap: "0.1rem",
                     justifyContent: "center",
                     height: "2.5rem"
                   }}
                 >
                   <span 
                     style={{
                       fontFamily: "Noto Sans JP",
                       fontWeight: "400",
                       fontSize: "0.86rem",
                       lineHeight: "100%",
                       letterSpacing: "0%",
                       color: "#1A1A1A",
                       whiteSpace: "nowrap"
                     }}
                   >
                     SOLD OUT/商談中
                   </span>
                   <span 
                     style={{
                       fontFamily: "Noto Sans JP",
                       fontWeight: "400",
                       fontSize: "0.86rem",
                       lineHeight: "100%",
                       letterSpacing: "0%",
                       color: "#1A1A1A",
                       whiteSpace: "nowrap"
                     }}
                   >
                     表示する
                   </span>
                 </div>
               </div>
             </div>

            {/* 右側のフリーワードと検索ボタン */}
            <div 
              className="inventory-search-right"
              style={{
                width: "31%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              {/* 車両検索（フリーワード） */}
              <div 
                className="inventory-search-keyword"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "80%",
                  justifyContent: "flex-end"
                }}
              >
                <span 
                  className="inventory-search-keyword-label"
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontWeight: "400",
                    fontSize: "0.9rem",
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
                    value={formKeyword}
                    onChange={(e) => setFormKeyword(e.target.value)}
                    placeholder="フリーワード"
                    className="inventory-search-input"
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
                className="inventory-search-button"
                onClick={handleSearch}
                style={{
                  minWidth: "7rem",
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

        {/* 結果件数とソート */}
        <div 
          style={{
            marginBottom: "1rem",
            padding: "0"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.71rem", flexDirection: "column", justifyContent: "center", width: "100%" }}>
            <p 
              style={{
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontSize: "1rem",
                color: "#666666",
                margin: 0
              }}
            >
              検索結果: <span style={{ fontWeight: "600" }}>{filteredVehicles.length}</span>件
              {vehicles.length === 0 && (
                <span style={{ marginLeft: "0.57rem", color: "#FF6B35" }}>
                  （車両データが登録されていません。adminで車両を登録してください）
                </span>
              )}
            </p>
            
            {/* ソートボタン */}
            {filteredVehicles.length > 0 && (
              <div style={{ display: "flex", gap: "0.57rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => handleSort("price")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.29rem",
                  padding: "0.57rem 0.86rem",
                  border: "0.07rem solid #CCCCCC",
                  borderRadius: "0.29rem",
                  background: sortField === "price" ? "#E3F2FD" : "#FFFFFF",
                  color: sortField === "price" ? "#1976D2" : "#666666",
                  fontFamily: "Noto Sans JP",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = sortField === "price" ? "#BBDEFB" : "#F5F5F5"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = sortField === "price" ? "#E3F2FD" : "#FFFFFF"
                }}
              >
                <ArrowUpDown size={16} />
                価格：{sortField === "price" ? (sortDirection === "asc" ? "安い" : "高い") : "安い/高い"}
              </button>
              
              <button
                onClick={() => handleSort("year")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.29rem",
                  padding: "0.57rem 0.86rem",
                  border: "0.07rem solid #CCCCCC",
                  borderRadius: "0.29rem",
                  background: sortField === "year" ? "#E3F2FD" : "#FFFFFF",
                  color: sortField === "year" ? "#1976D2" : "#666666",
                  fontFamily: "Noto Sans JP",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = sortField === "year" ? "#BBDEFB" : "#F5F5F5"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = sortField === "year" ? "#E3F2FD" : "#FFFFFF"
                }}
              >
                <ArrowUpDown size={16} />
                年式：{sortField === "year" ? (sortDirection === "asc" ? "古い" : "新しい") : "新しい/古い"}
              </button>
              
              <button
                onClick={() => handleSort("mileage")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.29rem",
                  padding: "0.57rem 0.86rem",
                  border: "0.07rem solid #CCCCCC",
                  borderRadius: "0.29rem",
                  background: sortField === "mileage" ? "#E3F2FD" : "#FFFFFF",
                  color: sortField === "mileage" ? "#1976D2" : "#666666",
                  fontFamily: "Noto Sans JP",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = sortField === "mileage" ? "#BBDEFB" : "#F5F5F5"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = sortField === "mileage" ? "#E3F2FD" : "#FFFFFF"
                }}
              >
                <ArrowUpDown size={16} />
                走行距離：{sortField === "mileage" ? (sortDirection === "asc" ? "少ない" : "多い") : "多い/少ない"}
              </button>

              {/* 1ページあたりの掲載台数切替 */}
              <div style={{ display: "flex", gap: "0.29rem", marginLeft: "0.86rem" }}>
                {[20, 50, 100].map((size) => (
                  <button
                    key={size}
                    onClick={() => { setVehiclesPerPage(size); setCurrentPage(1); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.29rem",
                      padding: "0.57rem 0.86rem",
                      border: "0.07rem solid #CCCCCC",
                      borderRadius: "0.29rem",
                      background: vehiclesPerPage === size ? "#E3F2FD" : "#FFFFFF",
                      color: vehiclesPerPage === size ? "#1976D2" : "#666666",
                      fontFamily: "Noto Sans JP",
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = vehiclesPerPage === size ? "#BBDEFB" : "#F5F5F5"
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = vehiclesPerPage === size ? "#E3F2FD" : "#FFFFFF"
                    }}
                  >
                    {size}台/ページ
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

       {/* 車両一覧 */}
        <div style={{ 
          width: "77.08%", 
          margin: "0 auto", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          minHeight: "auto",
          paddingTop: "1rem",
          paddingBottom: "1.43rem"
        }}>
          {filteredVehicles.length === 0 ? (
            <div 
              style={{
                textAlign: "center",
                padding: "3.43rem 1.43rem"
              }}
            >
              <p 
                style={{
                  fontFamily: "Noto Sans JP",
                  fontWeight: "400",
                  fontSize: "1.29rem",
                  color: "#666666"
                }}
              >
                該当する車両が見つかりませんでした。
              </p>
            </div>
          ) : (
            <>
            <div 
              className="inventory-vehicle-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: `repeat(${Math.ceil(currentVehicles.length / 4)}, 1fr)`,
                gap: "1.43rem",
                width: "100%",
                maxWidth: "85.71rem",
                margin: "0 auto",
                padding: "0"
              }}
            >
              {currentVehicles.map((vehicle) => (
              <Card 
                className="inventory-card"
                key={vehicle.id}
                style={{
                  width: "100%",
                  gap: "0.86rem",
                  opacity: 1,
                  borderRadius: "0px",
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
                      background: "#1A1A1A",
                      padding: "0.57rem 0.86rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span className="card-title-maker" style={{
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "700",
                      fontStyle: "Bold",
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
                    <span className="card-title-modelcode" style={{
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      fontStyle: "Regular",
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
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "0.7rem",
                      paddingBottom: "0.7rem",
                      justifyContent: "center"
                    }}
                  >
                    <span className="vehicle-inquiry-number" style={{
                      opacity: 1,
                      fontFamily: "Noto Sans JP",
                      fontWeight: "400",
                      fontStyle: "Regular",
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
                        height: "13.8rem",
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
                          paddingTop: "0.5rem",
                          paddingBottom: "0.5rem",
                          backgroundColor: vehicle.isSoldOut ? "#EA1313" : "#666666",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <span style={{
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
                      height: window.innerWidth <= 1023 ? "auto" : "19.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* ボディタイプ */}
                    <div 
                      style={{
                        height: window.innerWidth <= 1023 ? "calc(18rem / 6)" : "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        background: "#FFFFFF",
                        borderBottom: "0.07rem solid #F2F2F2"
                      }}
                    >
                      <div style={{
                        height: "100%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <span className="body-type-text" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
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
                        height: window.innerWidth <= 1023 ? "calc(18rem / 6)" : "calc(19.5rem / 6)",
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
                        <span className="spec-label" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
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
                        <div>
                          <span className="price-main spec-value" style={{
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "700",
                            fontStyle: "Bold",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2B5EC5"
                          }}>
                            {vehicle.price ? Math.floor(vehicle.price / 10000) : "000"}
                          </span>
                          <span className="price-unit spec-value" style={{
                            opacity: 1,
                            fontFamily: "Noto Sans JP",
                            fontWeight: "400",
                            fontStyle: "Regular",
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
                        height: window.innerWidth <= 1023 ? "calc(18rem / 6)" : "calc(19.5rem / 6)",
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
                        <span className="spec-label" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
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
                        <span className="spec-value" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
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
                        height: window.innerWidth <= 1023 ? "calc(18rem / 6)" : "calc(19.5rem / 6)",
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
                        <span className="spec-label" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
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
                        <span className="spec-value" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
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
                        height: window.innerWidth <= 1023 ? "calc(18rem / 6)" : "calc(19.5rem / 6)",
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
                        <span className="spec-label" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
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
                        <span className="spec-value" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
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
                        height: window.innerWidth <= 1023 ? "calc(18rem / 6)" : "calc(19.5rem / 6)",
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
                        <span className="spec-label" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A"
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
                        <span className="spec-value" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
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
                        height: window.innerWidth <= 1023 ? "calc(18rem / 6)" : "calc(19.5rem / 6)",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.79rem",
                        color: "#374151",
                        borderBottom: "0.07rem solid #F2F2F2",
                        visibility: "visible",
                        opacity: 1,
                        position: "relative",
                        zIndex: 1
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
                        <span className="spec-label" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          visibility: "visible",
                          display: "block"
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
                        <span className="spec-value" style={{
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "400",
                          fontStyle: "Regular",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1A1A1A",
                          visibility: "visible",
                          display: "block"
                        }}>
                          {vehicle.inspectionStatus || "抹消"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 詳細ボタン */}
                  <div className="card-detail-button-container" style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    position: "relative"
                  }}>
                    <Link href={`/vehicle/${vehicle.id}`}>
                      <Button 
                        className="card-detail-button"
                        style={{
                          gap: "0.57rem",
                          opacity: 1,
                          borderRadius: "0.29rem",
                          border: "0.07rem solid #333333",
                          background: "#FFFFFF",
                          boxShadow: "0.14rem 0.14rem 0.14rem 0px #00000040",
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
                          opacity: 1,
                          fontFamily: "Noto Sans JP",
                          fontWeight: "700",
                          fontStyle: "Bold",
                          fontSize: "1rem",
                          lineHeight: "1.43rem",
                          letterSpacing: "0%",
                          color: "#333333",
                          display: "flex",
                          alignItems: "center"
                        }}>
                          詳細はこちら
                        </span>
                        <svg
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

            {/* ページネーション */}
            {totalPages >= 1 && (
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.57rem",
                  marginTop: "1.43rem",
                  marginBottom: "1.43rem"
                }}
              >
                {/* 前へボタン */}
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "3.43rem",
                      height: "3.43rem",
                      border: "0.07rem solid #CCCCCC",
                      borderRadius: "0.29rem",
                      background: "#FFFFFF",
                      color: "#666666",
                      fontFamily: "Noto Sans JP",
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F5F5F5"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FFFFFF"
                    }}
                  >
                    前へ
                  </button>
                )}

                {/* ページ番号 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (!isMobile) return true
                    if (currentPage === 1) {
                      // 1ページ目特例: 1,2,3,最後のみ
                      return page === 1 || page === 2 || page === 3 || page === totalPages
                    }
                    // 通常: 現在の前後1ページ＋最初・最後
                    const near = page >= currentPage - 1 && page <= currentPage + 1
                    const edge = page === 1 || page === totalPages
                    return near || edge
                  })
                  .map((page, idx, arr) => {
                  // 現在のページの前後2ページと最初・最後のページを表示
                  const shouldShow = true
                  
                  if (!shouldShow) {
                    // 省略記号を表示
                    // モバイル・デスクトップともに省略記号はフィルタ後の隙間に応じて表示
                    const prev = arr[idx - 1]
                    if (prev && page - prev > 1) {
                      return (
                        <span 
                          key={page}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "3.43rem",
                            height: "3.43rem",
                            color: "#CCCCCC",
                            fontFamily: "Noto Sans JP",
                            fontSize: "1rem"
                          }}
                        >
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "3.43rem",
                        height: "3.43rem",
                        border: "0.07rem solid #CCCCCC",
                        borderRadius: "0.29rem",
                        background: "#999999",
                        color: "#FFFFFF",
                        fontFamily: "Noto Sans JP",
                        fontSize: "1rem",
                        fontWeight: "400",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#777777"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#999999"
                      }}
                    >
                      {page}
                    </button>
                  )
                })}

                {/* 次へボタン */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "3.43rem",
                      height: "3.43rem",
                      border: "0.07rem solid #CCCCCC",
                      borderRadius: "0.29rem",
                      background: "#FFFFFF",
                      color: "#666666",
                      fontFamily: "Noto Sans JP",
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F5F5F5"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FFFFFF"
                    }}
                  >
                    次へ
                  </button>
                )}
              </div>
            )}
            </>
          )}
        </div>
      </div>
      
      
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
            className="contact-header"
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
                {/* ②お問い合わせ */}
                <div 
                  className="contact-title"
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
            className="contact-description"
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
            className="contact-cards-container"
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
              className="contact-phone-card"
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
                  <Phone 
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
                      className="phone-number"
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
              className="contact-form-card"
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
              <CardContent className="contact-form-content" style={{ 
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
                <Link href="/contact" className="contact-form-button">
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
          <div className="contact-purchase-container" style={{ display: "flex", justifyContent: "center" }}>
            <Card 
              className="contact-purchase-card"
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
    </div>
  )
}
