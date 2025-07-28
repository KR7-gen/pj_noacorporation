"use client"

// フォントサイズ基準値
// base: 14px (0.875rem)
// sm: 12px (0.75rem) 
// lg: 16px (1rem)
// xl: 18px (1.125rem)
// 2xl: 20px (1.25rem)
// 3xl: 24px (1.5rem)
// 4xl: 32px (2rem)

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Camera, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { getVehicle, getVehicles } from "@/lib/firebase-utils"
import { formatNumberWithCommas } from "@/lib/utils"
import type { Vehicle } from "@/types"

export default function VehicleDetailPage() {
  const params = useParams()
  const vehicleId = params.id as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedPaymentPeriod, setSelectedPaymentPeriod] = useState(5) // デフォルト5年

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const fetchedVehicle = await getVehicle(vehicleId)
        if (fetchedVehicle) {
          setVehicle(fetchedVehicle)
          // 関連車両を取得（同じメーカーまたはボディタイプの車両）
          const allVehicles = await getVehicles()
          const related = allVehicles
            .filter(v => v.id !== vehicleId)
            .filter(v => 
              v.maker === fetchedVehicle.maker || 
              v.bodyType === fetchedVehicle.bodyType
            )
            .slice(0, 3)
          setRelatedVehicles(related)
        } else {
          setError("車両が見つかりませんでした")
        }
      } catch (err) {
        setError("車両の読み込みに失敗しました")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  // デバッグ用：シミュレーション条件チェック
  useEffect(() => {
    if (vehicle) {
      const currentYear = new Date().getFullYear();
      
      // 年式条件: 2022年以内（R4まで）
      let isWithinYearLimit = false;
      let gregorianYear = null;
      if (vehicle.year) {
        const yearStr = String(vehicle.year);
        if (yearStr.startsWith('R')) {
          // 令和の場合: R6 → 令和6年 → 2024年
          const reiwaYear = parseInt(yearStr.substring(1));
          gregorianYear = 2018 + reiwaYear; // 令和元年は2019年
          isWithinYearLimit = gregorianYear >= 2022;
        } else {
          // 西暦の場合
          gregorianYear = Number(vehicle.year);
          isWithinYearLimit = gregorianYear >= 2022;
        }
      }
      
      const isWithin10kKm = Number(vehicle.mileage) <= 10000;
      
      console.log('シミュレーション条件チェック:', {
        vehicleYear: vehicle.year,
        gregorianYear,
        isWithinYearLimit,
        mileage: vehicle.mileage,
        mileageType: typeof vehicle.mileage,
        isWithin10kKm,
        shouldShow: isWithinYearLimit && isWithin10kKm,
        rawVehicleData: {
          year: vehicle.year,
          yearType: typeof vehicle.year,
          mileage: vehicle.mileage,
          mileageType: typeof vehicle.mileage
        }
      });
    }
  }, [vehicle]);

  // 画像配列（imageUrlsがなければimageUrl単体、なければダミー）
  const images = useMemo(() => {
    if (!vehicle) return ["/placeholder.jpg"];
    
    if (vehicle.imageUrls && vehicle.imageUrls.length > 0) {
      // 有効な画像URLのみをフィルタリング
      const validImages = vehicle.imageUrls.filter(url => 
        url && 
        url.trim() !== "" && 
        !url.includes("temp_") && 
        !url.startsWith("blob:") &&
        !url.startsWith("data:")
      );
      return validImages.length > 0 ? validImages : ["/placeholder.jpg"];
    }
    
    if (vehicle.imageUrl && vehicle.imageUrl.trim() !== "") {
      return [vehicle.imageUrl];
    }
    
    return ["/placeholder.jpg"];
  }, [vehicle?.imageUrls, vehicle?.imageUrl]);

  // シミュレーション表示条件チェック
  const shouldShowSimulation = vehicle ? (() => {
    const currentYear = new Date().getFullYear();
    
    // 年式条件: 2022年以内（R4まで）
    let isWithinYearLimit = false;
    if (vehicle.year) {
      const yearStr = String(vehicle.year);
      if (yearStr.startsWith('R')) {
        // 令和の場合: R6 → 令和6年 → 2024年
        const reiwaYear = parseInt(yearStr.substring(1));
        const gregorianYear = 2018 + reiwaYear; // 令和元年は2019年
        isWithinYearLimit = gregorianYear >= 2022;
      } else {
        // 西暦の場合
        const vehicleYear = Number(vehicle.year);
        isWithinYearLimit = vehicleYear >= 2022;
      }
    }
    
    // 走行距離条件: 1万km以内
    const isWithin10kKm = Number(vehicle.mileage) <= 10000;
    
    return isWithinYearLimit && isWithin10kKm;
  })() : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">エラー</h1>
            <p className="text-gray-600 mb-4">{error || "車両が見つかりませんでした"}</p>
            <Link href="/inventory">
              <Button>在庫一覧に戻る</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }
  const handleThumbClick = (idx: number) => {
    setCurrentIndex(idx)
  }

  // 画像エラーハンドラー
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("画像読み込みエラー:", e.currentTarget.src);
    e.currentTarget.src = "/placeholder.jpg";
  }

  return (
    <div className="bg-white" style={{ minHeight: '2800px', paddingBottom: '100px' }}>
      {/* ①車両ページ */}
      <section 
        className="w-[1440px] mx-auto"
        style={{
          gap: '20px',
          paddingTop: '60px',
          paddingRight: '40px',
          paddingBottom: '40px',
          paddingLeft: '40px',
          background: '#FFFFFF',
          opacity: 1
        }}
      >
        {/* a車両タイトル */}
        <div 
          className="w-[1000px] h-[45px] mx-auto"
          style={{
            padding: '8px',
            background: '#1A1A1A',
            opacity: 1,
            marginBottom: '8px'
          }}
        >
          <div className="flex items-center gap-4" style={{ whiteSpace: 'nowrap', overflow: 'visible' }}>
            <span 
              style={{
                width: 'auto',
                minWidth: '70px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}
            >
              {vehicle.inquiryNumber || vehicle.id}
            </span>
            <span 
              style={{
                width: '20px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF'
              }}
            >
              ｜
            </span>
            <span 
              style={{
                width: 'auto',
                minWidth: '70px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}
            >
              {vehicle.maker}
            </span>
            <span 
              style={{
                width: '20px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF'
              }}
            >
              ｜
            </span>
            <span 
              style={{
                width: 'auto',
                minWidth: '70px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}
            >
              {vehicle.bodyType || "---"}
            </span>
            <span 
              style={{
                width: '20px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF'
              }}
            >
              ｜
            </span>
            <span 
              style={{
                width: 'auto',
                minWidth: '70px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}
            >
              {vehicle.model}
            </span>
            <span 
              style={{
                width: '20px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF'
              }}
            >
              ｜
            </span>
            <span 
              style={{
                width: 'auto',
                minWidth: '70px',
                height: '29px',
                opacity: 1,
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}
            >
              {vehicle.year && vehicle.month 
                ? `${vehicle.year}年${String(vehicle.month).replace(/月$/, '')}月` 
                : vehicle.year 
                  ? `${vehicle.year}年` 
                  : ""
              }
            </span>
          </div>
        </div>

        {/* b車検期限 */}
        {vehicle.inspectionStatus && (
          <div 
            className="w-[1000px] h-[39px] mx-auto"
            style={{
              gap: '8px',
              opacity: 1,
              marginBottom: '8px'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-[88px] h-[39px]"
                style={{
                  background: '#2B5EC5',
                  opacity: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span 
                  style={{
                    width: '64px',
                    height: '23px',
                    opacity: 1,
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontStyle: 'Bold',
                    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {vehicle.inspectionStatus}
                </span>
              </div>
              {(vehicle.inspectionStatus === "車検付き" || vehicle.inspectionStatus === "予備検査") && vehicle.inspectionDate && (
                <span 
                  className="text-gray-900"
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                  }}
                >
                  {vehicle.inspectionDate}
                </span>
              )}
            </div>
          </div>
        )}

        {/* c車両写真、価格、ローンシュミレーション */}
        <div 
          className="w-[1000px] h-[470px] mx-auto"
          style={{
            gap: '32px',
            opacity: 1,
            marginBottom: '32px'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Vehicle Image Slider */}
              <div className="h-full">
                {/* メイン写真 */}
                <div 
                  className="relative h-[360px] overflow-hidden flex items-center justify-center"
                  style={{
                    width: '480.38671875px',
                    opacity: 1,
                    left: '-0.39px'
                  }}
                >
                  {/* 商談中・SOLD OUT表示 */}
                  {vehicle.isSoldOut && (
                    <div 
                      className="absolute top-0 left-0 right-0 text-white text-center py-3 font-bold z-20" 
                      style={{ 
                        backgroundColor: "#EA1313",
                        fontFamily: 'Noto Sans JP',
                        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'
                      }}
                    >
                      SOLD OUT
                    </div>
                  )}
                  {vehicle.isNegotiating && !vehicle.isSoldOut && (
                    <div 
                      className="absolute top-0 left-0 right-0 text-white text-center py-3 font-bold z-20" 
                      style={{ 
                        backgroundColor: "#666666",
                        fontFamily: 'Noto Sans JP',
                        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'
                      }}
                    >
                      商談中
                      {vehicle.negotiationDeadline && (
                        <span 
                          className="ml-2 font-normal"
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                          }}
                        >
                          ～{new Date(vehicle.negotiationDeadline).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}まで
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* 左矢印 */}
                  {images.length > 1 && (
                    <button
                      onClick={handlePrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  {/* メイン画像 */}
                  <img
                    src={images[currentIndex]}
                    alt={vehicle.name}
                    className="w-full h-full object-cover select-none"
                    onError={handleImageError}
                  />
                  {/* 右矢印 */}
                  {images.length > 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>
                
                {/* その他写真 - カルーセル */}
                {images.length > 1 && (
                  <div className="mt-4 relative" style={{ width: '472px', height: '98px' }}>
                    <div 
                      className="flex gap-1 transition-transform duration-300"
                      style={{ 
                        transform: `translateX(-${Math.floor(currentIndex / 14) * 472}px)`,
                        width: `${Math.ceil(images.length / 14) * 472}px`
                      }}
                    >
                      {Array.from({ length: Math.ceil(images.length / 14) }, (_, pageIndex) => (
                        <div 
                          key={pageIndex}
                          style={{ 
                            display: 'grid',
                            gridTemplateRows: 'repeat(2, 47px)',
                            gridTemplateColumns: 'repeat(7, 64px)',
                            width: '472px',
                            height: '98px',
                            gap: '4px'
                          }}
                        >
                          {images.slice(pageIndex * 14, (pageIndex + 1) * 14).map((img, idx) => (
                            <img
                              key={pageIndex * 14 + idx}
                              src={img}
                              alt={`サムネイル${pageIndex * 14 + idx + 1}`}
                              className={`object-cover rounded cursor-pointer border-2 ${currentIndex === pageIndex * 14 + idx ? 'border-blue-600' : 'border-transparent'}`}
                              style={{ 
                                width: '64px',
                                height: '47px'
                              }}
                              onClick={() => handleThumbClick(pageIndex * 14 + idx)}
                              onError={handleImageError}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    
                    {/* カルーセルナビゲーション */}
                    {Math.ceil(images.length / 14) > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {Array.from({ length: Math.ceil(images.length / 14) }, (_, pageIndex) => (
                          <button
                            key={pageIndex}
                            onClick={() => {
                              const targetIndex = pageIndex * 14;
                              setCurrentIndex(targetIndex);
                            }}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              Math.floor(currentIndex / 14) === pageIndex
                                ? 'bg-blue-600'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - 価格とローンシミュレーション */}
            <div 
              className="space-y-4"
              style={{
                width: '488px',
                height: '273px',
                position: 'relative',
                left: '-176px'
              }}
            >
              {/* Price Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span 
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                        }}
                      >
                        車両価格
                      </span>
                      <span 
                        className="font-bold text-blue-600"
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)'
                        }}
                      >
                        ¥{(vehicle.price || 0).toLocaleString()}
                      </span>
                    </div>
                    {vehicle.totalPayment && (
                      <div className="flex justify-between items-center">
                        <span 
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                          }}
                        >
                          車両価格（税込）
                        </span>
                        <span 
                          className="font-semibold"
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                          }}
                        >
                          ¥{(vehicle.totalPayment || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ローンシミュレーション */}
              {shouldShowSimulation && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span 
                        className="font-medium"
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                        }}
                      >
                        毎月の支払額
                      </span>
                      <span 
                        className="font-bold text-blue-600"
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'
                        }}
                      >
                        {vehicle[`simulation${selectedPaymentPeriod}Year` as keyof Vehicle] 
                          ? formatNumberWithCommas(Number(vehicle[`simulation${selectedPaymentPeriod}Year` as keyof Vehicle])) 
                          : "---"}円
                      </span>
                    </div>
                    <div>
                      <span 
                        className="font-medium block mb-2"
                        style={{
                          fontFamily: 'Noto Sans JP',
                          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                        }}
                      >
                        返済期間
                      </span>
                      <div className="flex gap-1">
                        {[2, 3, 4, 5].map((year) => (
                          <button
                            key={year}
                            onClick={() => setSelectedPaymentPeriod(year)}
                            className={`px-2 py-1 rounded border transition-colors ${
                              selectedPaymentPeriod === year
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                            style={{
                              fontFamily: 'Noto Sans JP',
                              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                            }}
                          >
                            {year}年
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* d車両情報 */}
        <div 
          className="w-[1000px] h-[421px] mx-auto"
          style={{
            gap: '12px',
            opacity: 1,
            marginBottom: '24px'
          }}
        >
          <Card>
            <CardContent className="p-6 h-full">
              <h2 className="text-2xl font-bold mb-6">DETAIL(車輌情報)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">メーカー</span>
                    <span>{vehicle.maker}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">車種</span>
                    <span>{vehicle.vehicleType || vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">年式</span>
                    <span>
                      {vehicle.year && vehicle.month 
                        ? `${vehicle.year}年${vehicle.month}月` 
                        : vehicle.year 
                          ? `${vehicle.year}年` 
                          : ""
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">走行距離</span>
                    <span>{formatNumberWithCommas(vehicle.mileage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ボディタイプ</span>
                    <span>{vehicle.bodyType || "---"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">サイズ</span>
                    <span>{vehicle.size || "---"}</span>
                  </div>
                                      <div className="flex justify-between">
                      <span className="font-medium">車検有効期限</span>
                      <span>{vehicle.inspectionDate || "---"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車両価格（税抜）</span>
                      <span>{formatNumberWithCommas(vehicle.price)}円</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車両価格（税込）</span>
                      <span>{formatNumberWithCommas(vehicle.totalPayment)}円</span>
                    </div>
                  </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">車体寸法</span>
                    <span>
                      L{formatNumberWithCommas(vehicle.outerLength)} × 
                      W{formatNumberWithCommas(vehicle.outerWidth)} × 
                      H{formatNumberWithCommas(vehicle.outerHeight)}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">車両総重量</span>
                    <span>{formatNumberWithCommas(vehicle.totalWeight)}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">積載量</span>
                    <span>{formatNumberWithCommas(vehicle.loadingCapacity)}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">馬力</span>
                    <span>{formatNumberWithCommas(vehicle.horsepower)}ps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">排気量</span>
                    <span>{formatNumberWithCommas(vehicle.displacement)}cc</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">燃料</span>
                    <span>{vehicle.fuel || "---"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ミッション</span>
                    <span>{vehicle.mission || "---"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">車検状態</span>
                    <span>{vehicle.inspectionStatus || "---"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* e車検証・状態表 */}
        {(vehicle.inspectionImageUrl || vehicle.conditionImageUrl) && (
          <div 
            className="w-[296px] h-[40px] mx-auto"
            style={{
              gap: '24px',
              opacity: 1,
              marginBottom: '24px'
            }}
          >
            <div className="flex gap-6">
              {vehicle.inspectionImageUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(vehicle.inspectionImageUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <span className="text-red-500">📄</span>
                  車検証
                </Button>
              )}
              {vehicle.conditionImageUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(vehicle.conditionImageUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <span className="text-red-500">📄</span>
                  状態表
                </Button>
              )}
            </div>
          </div>
        )}

        {/* f上物情報 */}
        <div 
          className="w-[1000px] h-[201px] mx-auto"
          style={{
            gap: '8px',
            opacity: 1,
            marginBottom: '40px'
          }}
        >
          <Card>
            <CardContent className="p-6 h-full">
              <h2 className="text-2xl font-bold mb-6">上物情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {vehicle.bodyMaker && (
                    <div className="flex justify-between">
                      <span className="font-medium">上物メーカー</span>
                      <span>{vehicle.bodyMaker}</span>
                    </div>
                  )}
                  {vehicle.bodyModel && (
                    <div className="flex justify-between">
                      <span className="font-medium">上物型式</span>
                      <span>{vehicle.bodyModel}</span>
                    </div>
                  )}
                  {vehicle.bodyYear && (
                    <div className="flex justify-between">
                      <span className="font-medium">上物年式</span>
                      <span>{vehicle.bodyYear}</span>
                    </div>
                  )}
                  {vehicle.modelCode && (
                    <div className="flex justify-between">
                      <span className="font-medium">型式</span>
                      <span>{vehicle.modelCode}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {vehicle.engineModel && (
                    <div className="flex justify-between">
                      <span className="font-medium">原動機型式</span>
                      <span>{vehicle.engineModel}</span>
                    </div>
                  )}
                  {vehicle.turbo && (
                    <div className="flex justify-between">
                      <span className="font-medium">ターボ</span>
                      <span>{vehicle.turbo}</span>
                    </div>
                  )}
                  {vehicle.shift && (
                    <div className="flex justify-between">
                      <span className="font-medium">シフト</span>
                      <span>{vehicle.shift}</span>
                    </div>
                  )}
                  {vehicle.innerLength && (
                    <div className="flex justify-between">
                      <span className="font-medium">内寸長</span>
                      <span>{formatNumberWithCommas(vehicle.innerLength)}mm</span>
                    </div>
                  )}
                  {vehicle.innerWidth && (
                    <div className="flex justify-between">
                      <span className="font-medium">内寸幅</span>
                      <span>{formatNumberWithCommas(vehicle.innerWidth)}mm</span>
                    </div>
                  )}
                  {vehicle.innerHeight && (
                    <div className="flex justify-between">
                      <span className="font-medium">内寸高</span>
                      <span>{formatNumberWithCommas(vehicle.innerHeight)}mm</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ②装備・仕様 */}
      <section 
        className="w-[1440px] h-[161px] mx-auto"
        style={{
          gap: '20px',
          paddingRight: '40px',
          paddingBottom: '40px',
          paddingLeft: '40px',
          opacity: 1,
          marginBottom: '20px'
        }}
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">装備品</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {vehicle.etc && (
                <Badge variant="secondary" className="justify-center">ETC</Badge>
              )}
              {vehicle.backCamera && (
                <Badge variant="secondary" className="justify-center">バックカメラ</Badge>
              )}
              {vehicle.recordBook && (
                <Badge variant="secondary" className="justify-center">記録簿</Badge>
              )}
              {vehicle.powerWindow && (
                <Badge variant="secondary" className="justify-center">パワーウィンドウ</Badge>
              )}
              {vehicle.driveRecorder && (
                <Badge variant="secondary" className="justify-center">ドラレコ</Badge>
              )}
              {vehicle.airConditioner && (
                <Badge variant="secondary" className="justify-center">エアコン</Badge>
              )}
              {vehicle.electricMirror && (
                <Badge variant="secondary" className="justify-center">電動ミラー</Badge>
              )}
              {vehicle.abs && (
                <Badge variant="secondary" className="justify-center">ABS</Badge>
              )}
              {vehicle.aluminumWheel && (
                <Badge variant="secondary" className="justify-center">アルミホイール</Badge>
              )}
              {vehicle.airSuspensionSeat && (
                <Badge variant="secondary" className="justify-center">エアサスシート</Badge>
              )}
              {vehicle.carNavigation && (
                <Badge variant="secondary" className="justify-center">カーナビ</Badge>
              )}
              {vehicle.dpf && (
                <Badge variant="secondary" className="justify-center">DPF</Badge>
              )}
              {vehicle.pmMuffler && (
                <Badge variant="secondary" className="justify-center">PMマフラー</Badge>
              )}
              {vehicle.centralDoorLock && (
                <Badge variant="secondary" className="justify-center">集中ドアロック</Badge>
              )}
              {vehicle.equipment && (
                <div className="col-span-full">
                  <p className="text-sm text-gray-600 mt-2">その他装備: {vehicle.equipment}</p>
                </div>
              )}
              {!vehicle.etc && !vehicle.backCamera && !vehicle.recordBook && !vehicle.powerWindow && 
               !vehicle.driveRecorder && !vehicle.airConditioner && !vehicle.electricMirror && 
               !vehicle.abs && !vehicle.aluminumWheel && !vehicle.airSuspensionSeat && 
               !vehicle.carNavigation && !vehicle.dpf && !vehicle.pmMuffler && 
               !vehicle.centralDoorLock && !vehicle.equipment && (
                <p className="text-gray-600 col-span-full">装備品情報はありません</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ③問い合わせフォーム */}
      <section 
        className="w-[1440px] h-[312px] mx-auto"
        style={{
          opacity: 1,
          marginBottom: '20px'
        }}
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">お問い合わせ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">お名前</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="お名前を入力してください"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="電話番号を入力してください"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="メールアドレスを入力してください"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">お問い合わせ内容</label>
                  <textarea
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="お問い合わせ内容を入力してください"
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    お問い合わせ
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    査定依頼
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ④関連車両 */}
      <section 
        className="w-[1440px] h-[312px] mx-auto"
        style={{
          opacity: 1,
          marginBottom: '20px'
        }}
      >
        {relatedVehicles.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">関連車両</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedVehicles.map((relatedVehicle) => (
                  <Link
                    key={relatedVehicle.id}
                    href={`/vehicle/${relatedVehicle.id}`}
                    className="block hover:bg-gray-50 p-4 rounded-lg transition-colors border"
                  >
                    <div className="space-y-3">
                      <img
                        src={relatedVehicle.imageUrls?.[0] || relatedVehicle.imageUrl || "/placeholder.jpg"}
                        alt={relatedVehicle.name}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{relatedVehicle.name}</h4>
                        <p className="text-xs text-gray-600 mb-1">{relatedVehicle.maker}</p>
                        <p className="text-xs text-gray-600 mb-2">{String(relatedVehicle.year || "")}</p>
                        <p className="text-sm font-bold text-blue-600">
                          ¥{(relatedVehicle.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ⑤他の車両 */}
      <section 
        className="w-[1440px] h-[453px] mx-auto"
        style={{
          opacity: 1
        }}
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">他の車両</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 他の車両のサンプル表示 */}
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <img
                    src="/placeholder.jpg"
                    alt={`車両${i + 1}`}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <h4 className="font-semibold text-sm mb-1">サンプル車両 {i + 1}</h4>
                  <p className="text-xs text-gray-600 mb-1">メーカー名</p>
                  <p className="text-xs text-gray-600 mb-2">2023年</p>
                  <p className="text-sm font-bold text-blue-600">¥1,500,000</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}









