"use client"

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
  const [selectedPaymentPeriod, setSelectedPaymentPeriod] = useState(5)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const fetchedVehicle = await getVehicle(vehicleId)
        if (fetchedVehicle) {
          setVehicle(fetchedVehicle)
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

  // デバッグ用：車両データチェック
  useEffect(() => {
    if (vehicle) {
      console.log('車両データ全体:', JSON.stringify(vehicle, null, 2));
      console.log('車両情報フィールド:', {
        modelCode: vehicle.modelCode,
        shift: vehicle.shift,
        engineModel: vehicle.engineModel,
        turbo: vehicle.turbo
      });
      console.log('個別フィールド値:');
      console.log('- modelCode:', vehicle.modelCode);
      console.log('- shift:', vehicle.shift);
      console.log('- engineModel:', vehicle.engineModel);
      console.log('- turbo:', vehicle.turbo);
      
      console.log('データベースの全フィールド名:');
      Object.keys(vehicle).forEach(key => {
        console.log(`- ${key}:`, vehicle[key as keyof Vehicle]);
      });
    }
  }, [vehicle]);

  const images = useMemo(() => {
    if (!vehicle) return ["/placeholder.jpg"];
    
    if (vehicle.imageUrls && vehicle.imageUrls.length > 0) {
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

  const shouldShowSimulation = vehicle ? (() => {
    const currentYear = new Date().getFullYear();
    
    let isWithinYearLimit = false;
    if (vehicle.year) {
      const yearStr = String(vehicle.year);
      if (yearStr.startsWith('R')) {
        const reiwaYear = parseInt(yearStr.substring(1));
        const gregorianYear = 2018 + reiwaYear;
        isWithinYearLimit = gregorianYear >= 2022;
      } else {
        const vehicleYear = Number(vehicle.year);
        isWithinYearLimit = vehicleYear >= 2022;
      }
    }
    
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("画像読み込みエラー:", e.currentTarget.src);
    e.currentTarget.src = "/placeholder.jpg";
  }

  return (
    <div className="bg-white" style={{ minHeight: '2800px', paddingBottom: '100px' }}>
      
      {/* 1. 車両タイトル */}
      <section className="w-[70%] mx-auto pt-15 pb-10 bg-white opacity-100">
        <div className="w-full max-w-[1000px] h-[45px] mx-auto p-2 bg-[#1A1A1A] opacity-100 mb-2">
          <div className="flex items-center gap-4" style={{ whiteSpace: 'nowrap', overflow: 'visible' }}>
            <span className="w-auto min-w-[70px] h-[29px] opacity-100 font-bold text-center text-white whitespace-nowrap">
              {vehicle.inquiryNumber || vehicle.id}
            </span>
            <span className="w-5 h-[29px] opacity-100 font-bold text-center text-white">｜</span>
            <span className="w-auto min-w-[70px] h-[29px] opacity-100 font-bold text-center text-white whitespace-nowrap">
              {vehicle.maker}
            </span>
            <span className="w-5 h-[29px] opacity-100 font-bold text-center text-white">｜</span>
            <span className="w-auto min-w-[70px] h-[29px] opacity-100 font-bold text-center text-white whitespace-nowrap">
              {vehicle.bodyType || "---"}
            </span>
            <span className="w-5 h-[29px] opacity-100 font-bold text-center text-white">｜</span>
            <span className="w-auto min-w-[70px] h-[29px] opacity-100 font-bold text-center text-white whitespace-nowrap">
              {vehicle.model}
            </span>
            <span className="w-5 h-[29px] opacity-100 font-bold text-center text-white">｜</span>
            <span className="w-auto min-w-[70px] h-[29px] opacity-100 font-bold text-center text-white whitespace-nowrap">
              {vehicle.year && vehicle.month 
                ? `${vehicle.year}年${String(vehicle.month).replace(/月$/, '')}月` 
                : vehicle.year 
                  ? `${vehicle.year}年` 
                  : ""
              }
            </span>
          </div>
        </div>
      </section>

      {/* 2. 車検期限の表示 */}
      <section className="w-[1440px] mx-auto pr-10 pb-10 pl-10 bg-white opacity-100">
        {vehicle.inspectionStatus && (
          <div className="w-[1000px] h-[39px] mx-auto gap-2 opacity-100 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-[88px] h-[39px] bg-[#2B5EC5] opacity-100 flex items-center justify-center">
                <span className="w-16 h-[23px] opacity-100 font-bold text-white flex items-center justify-center">
                  {vehicle.inspectionStatus}
                </span>
              </div>
              {(vehicle.inspectionStatus === "車検付き" || vehicle.inspectionStatus === "予備検査") && vehicle.inspectionDate && (
                <span className="text-gray-900">
                  {vehicle.inspectionDate}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 3. 写真・価格情報 */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100">
        <div className="w-full max-w-[1000px] h-[470px] mx-auto gap-8 opacity-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            
            {/* 3-1. 車両写真 */}
            <div className="lg:col-span-2">
              <div className="h-full">
                {/* メイン写真 */}
                <div className="relative h-[360px] overflow-hidden flex items-center justify-center w-[480px] opacity-100">
                  {/* 商談中・SOLD OUT表示 */}
                  {vehicle.isSoldOut && (
                    <div className="absolute top-0 left-0 right-0 text-white text-center py-3 font-bold z-20 bg-[#EA1313]">
                      SOLD OUT
                    </div>
                  )}
                  {vehicle.isNegotiating && !vehicle.isSoldOut && (
                    <div className="absolute top-0 left-0 right-0 text-white text-center py-3 font-bold z-20 bg-[#666666]">
                      商談中
                      {vehicle.negotiationDeadline && (
                        <span className="ml-2 font-normal">
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
                  <div className="mt-4 relative w-[472px] h-[98px]">
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

            {/* 3-2. 車両価格 */}
            <div className="space-y-4 w-[488px] h-[273px] relative -left-[176px]">
              {/* Price Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>車両価格</span>
                      <span className="font-bold text-blue-600">
                        ¥{(vehicle.price || 0).toLocaleString()}
                      </span>
                    </div>
                    {vehicle.totalPayment && (
                      <div className="flex justify-between items-center">
                        <span>車両価格（税込）</span>
                        <span className="font-semibold">
                          ¥{(vehicle.totalPayment || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 3-3. 価格シュミレーション */}
              {shouldShowSimulation && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">毎月の支払額</span>
                      <span className="font-bold text-blue-600">
                        {vehicle[`simulation${selectedPaymentPeriod}Year` as keyof Vehicle] 
                          ? formatNumberWithCommas(Number(vehicle[`simulation${selectedPaymentPeriod}Year` as keyof Vehicle])) 
                          : "---"}円
                      </span>
                    </div>
                    <div>
                      <span className="font-medium block mb-2">返済期間</span>
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
      </section>

      {/* 4. 車両メイン情報 */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100">
        
        {/* 4-1. 車両情報 */}
        <div className="w-full max-w-[1000px] mx-auto gap-3 opacity-100 mb-6">
          <h2 className="text-2xl font-bold mb-6">DETAIL(車輌情報)</h2>
          <div style={{height: '25.143rem'}}>
            <div className="grid grid-rows-8 grid-cols-4">
              {/* 1行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>メーカー</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.maker}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車体寸法（mm）</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>L{formatNumberWithCommas(vehicle.outerLength)} × W{formatNumberWithCommas(vehicle.outerWidth)} × H{formatNumberWithCommas(vehicle.outerHeight)}</span>
              {/* 2行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車種</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.vehicleType || vehicle.model}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車両総重量</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{formatNumberWithCommas(vehicle.totalWeight)}kg</span>
              {/* 3行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>型式</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.modelCode || vehicle.model || "---"}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>原動機型式</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.engineModel || "---"}</span>
              {/* 4行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>年式</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.year && vehicle.month ? `${vehicle.year}年${vehicle.month}月` : vehicle.year ? `${vehicle.year}年` : ""}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>馬力</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{formatNumberWithCommas(vehicle.horsepower)}ps</span>
              {/* 5行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>走行距離</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{formatNumberWithCommas(vehicle.mileage)}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>過給機</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.turbo || "---"}</span>
              {/* 6行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>最大積載量</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{formatNumberWithCommas(vehicle.loadingCapacity)}kg</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>排気量</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{formatNumberWithCommas(vehicle.displacement)}cc</span>
              {/* 7行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>シフト</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.mission || vehicle.shift || "---"}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>燃料</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.fuel || "---"}</span>
              {/* 8行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車検有効期限</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0'}}>{vehicle.inspectionDate || "---"}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>お問合せ番号</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0'}}>{vehicle.inquiryNumber || vehicle.id}</span>
            </div>
          </div>
          
          <div className="w-full max-w-[1000px] mx-auto text-sm text-gray-600 space-y-1 mb-6">
            <p>※1 支払い総額は、千葉ナンバー登録にかかる費用を基に算出しています。また、店頭でお渡しでの価格となります。</p>
            <p>※2 抹消車両は、登録時最大積載量が減トンされる可能性が御座います。</p>
          </div>
        </div>

        {/* 4-2. 車検証・状態表 */}
        <div className="w-full max-w-[1000px] mx-auto mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => vehicle.inspectionImageUrl && window.open(vehicle.inspectionImageUrl, '_blank')}
              className="bg-[#333333] text-white px-3 py-2 rounded flex items-center justify-center gap-1"
              style={{
                height: '2.5rem',
                width: '8.5rem',
              }}
            >
              <svg
                width="0.875rem"
                height="1.125rem"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  opacity: 1,
                  transform: 'rotate(0deg)',
                }}
              >
                <path
                  d="M14 2H2C1.45 2 1 2.45 1 3V17C1 17.55 1.45 18 2 18H14C14.55 18 15 17.55 15 17V3C15 2.45 14.55 2 14 2ZM14 17H2V3H14V17Z"
                  fill="white"
                />
                <path
                  d="M4 5H12V7H4V5ZM4 9H12V11H4V9ZM4 13H8V15H4V13Z"
                  fill="white"
                />
              </svg>
              <span className="font-bold text-sm">車検証を確認</span>
            </button>
            <button
              onClick={() => vehicle.conditionImageUrl && window.open(vehicle.conditionImageUrl, '_blank')}
              className="bg-[#333333] text-white px-3 py-2 rounded flex items-center justify-center gap-1"
              style={{
                height: '2.5rem',
                width: '8.5rem',
              }}
            >
              <svg
                width="0.875rem"
                height="1.125rem"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  opacity: 1,
                  transform: 'rotate(0deg)',
                }}
              >
                <path
                  d="M14 2H2C1.45 2 1 2.45 1 3V17C1 17.55 1.45 18 2 18H14C14.55 18 15 17.55 15 17V3C15 2.45 14.55 2 14 2ZM14 17H2V3H14V17Z"
                  fill="white"
                />
                <path
                  d="M4 5H12V7H4V5ZM4 9H12V11H4V9ZM4 13H8V15H4V13Z"
                  fill="white"
                />
              </svg>
              <span className="font-bold text-sm">状態表を確認</span>
            </button>
          </div>
        </div>

        {/* 4-3. 上物情報 */}
        <div className="w-full max-w-[1000px] mx-auto gap-3 opacity-100 mb-6">
          <h2 className="text-2xl font-bold mb-6">上物情報</h2>
          <div style={{height: '12.571rem'}}>
            <div className="grid grid-rows-4 grid-cols-4" style={{gap: '0'}}>
              {/* 1行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>メーカー</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.bodyMaker || "---"}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>内寸（L）</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.innerLength ? `${formatNumberWithCommas(vehicle.innerLength)}mm` : "---"}</span>
              {/* 2行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>型式</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.bodyModel || vehicle.modelCode || "---"}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>内寸（W）</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.innerWidth ? `${formatNumberWithCommas(vehicle.innerWidth)}mm` : "---"}</span>
              {/* 3行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>年式</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.bodyYear || "---"}</span>
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>内寸（H）</span>
              <span className="px-4 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0'}}>{vehicle.innerHeight ? `${formatNumberWithCommas(vehicle.innerHeight)}mm` : "---"}</span>
              {/* 4行目 */}
              <span className="font-medium px-4 flex items-center" style={{background: '#F2F2F2', height: '3.143rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>装備/仕様</span>
              <span className="px-4 flex items-center col-span-3" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0'}}>{vehicle.equipment || "---"}</span>
            </div>
          </div>
        </div>
      </section>

            {/* 5. 装備情報 */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100">
        <div className="w-full max-w-[1000px] mx-auto gap-3 opacity-100 mb-6">
          <h2 className="text-2xl font-bold mb-6">装備品</h2>
          <div style={{
            width: '100%',
            maxWidth: '1000px',
            height: 'calc(2.143rem * 2 + 0.643rem * 1)',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridTemplateRows: 'repeat(2, 2.143rem)',
              gap: '0.643rem'
            }}>
              {/* 装備品リスト */}
              {[
                { key: 'etc', label: 'ETC', value: vehicle.etc },
                { key: 'backCamera', label: 'バックカメラ', value: vehicle.backCamera },
                { key: 'recordBook', label: '記録簿', value: vehicle.recordBook },
                { key: 'powerWindow', label: 'パワーウィンドウ', value: vehicle.powerWindow },
                { key: 'driveRecorder', label: 'ドラレコ', value: vehicle.driveRecorder },
                { key: 'airConditioner', label: 'エアコン', value: vehicle.airConditioner },
                { key: 'electricMirror', label: '電動ミラー', value: vehicle.electricMirror },
                { key: 'abs', label: 'ABS', value: vehicle.abs },
                { key: 'aluminumWheel', label: 'アルミホイール', value: vehicle.aluminumWheel },
                { key: 'airSuspensionSeat', label: 'エアサスシート', value: vehicle.airSuspensionSeat },
                { key: 'carNavigation', label: 'カーナビ', value: vehicle.carNavigation },
                { key: 'dpf', label: 'DPF', value: vehicle.dpf },
                { key: 'pmMuffler', label: 'PMマフラー', value: vehicle.pmMuffler },
                { key: 'centralDoorLock', label: '集中ドアロック', value: vehicle.centralDoorLock }
              ].map((item) => (
                <div 
                  key={item.key}
                  className="flex items-center justify-center border"
                  style={{
                    background: item.value ? '#E3F2FD' : '#F5F5F5',
                    borderColor: item.value ? '#1976D2' : '#CCCCCC',
                    borderRadius: '7.143rem',
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 400,
                    fontStyle: 'Regular',
                    fontSize: '0.857rem',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#1a1a1a',
                    width: '100%',
                    height: '2.143rem'
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. 問い合わせフォーム */}
      <section className="w-full max-w-[1000px] mx-auto pb-10 opacity-100" style={{background: '#BCBCBC'}}>
        <div className="w-full max-w-[1000px] mx-auto" style={{paddingTop: '1.429rem'}}>
          {/* 見出しテキスト */}
          <h2 
            className="text-center"
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontStyle: 'Bold',
              fontSize: '1.143rem', // 16px ÷ 14px = 1.143rem
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              textShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
              marginBottom: '1.43rem',
              marginTop: '1.429rem', // 20px ÷ 14px = 1.429rem
            }}
          >
            今ご覧の車両が気になったらお気軽にご相談ください！<br />
            販売価格のご相談も承っております。
          </h2>
          
          {/* 電話問い合わせとメール問い合わせのコンテナ */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2.286rem', // 32px ÷ 14px = 2.286rem
              marginTop: '1.429rem', // 20px ÷ 14px = 1.429rem
            }}
          >
            {/* 電話問い合わせ */}
            <div 
              style={{
                width: '38.4%',
                height: '8.429rem', // 118px ÷ 14px = 8.429rem
                backgroundColor: '#FFFFFF',
                borderRadius: '0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.5rem',
                position: 'relative',
              }}
            >
              {/* ①問い合わせ番号 */}
              <div style={{width: '28%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', top: '5rem'}}>
                <p style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: '400',
                  fontStyle: 'normal',
                  fontSize: '0.857rem', // 12px ÷ 14px = 0.857rem
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#1A1A1A',
                  margin: '0 0 0.5rem 0'
                }}>
                  問合せ番号
                </p>
                <p style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: '700',
                  fontStyle: 'normal',
                  fontSize: '1.143rem', // 16px ÷ 14px = 1.143rem
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#1A1A1A',
                  margin: '0'
                }}>
                  {vehicle.inquiryNumber || vehicle.id}
                </p>
              </div>
              
              {/* 吹き出し（問い合わせ番号の中央に位置） */}
              <div style={{width: '28%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '0.3rem', left: '0', zIndex: 1001}}>
                {/* 吹き出しの長方形 */}
                <div style={{
                  width: '78.21%', // 21.9% ÷ 28% = 78.21%
                  height: '3.429rem', // 48px ÷ 14px = 3.429rem
                  backgroundColor: '#2B5EC5',
                  border: '1px solid #2B5EC5',
                  borderRadius: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                  <p style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: '700',
                    fontStyle: 'normal',
                    fontSize: '0.714rem', // 10px ÷ 14px = 0.714rem
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    margin: '0',
                    zIndex: 10000,
                    position: 'relative'
                  }}>
                    こちらの番号を<br />お伝えください
                  </p>
                </div>
                
                {/* 吹き出しの三角形 */}
                <div style={{
                  width: '0',
                  height: '0',
                  borderLeft: '1rem solid transparent',
                  borderRight: '0.4rem solid transparent',
                  borderTop: '2rem solid #2B5EC5',
                  position: 'absolute',
                  top: '2.5rem',
                  left: '60%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  zIndex: 9999
                }}></div>
              </div>
              
              {/* ②小見出しと電話番号 */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '72%', alignItems: 'flex-start', position: 'relative'}}>
                {/* 小見出し */}
                <div style={{position: 'absolute', top: '0rem', backgroundColor: '#F2F2F2', height: '2.571rem', width: '106.5%', left: '-6.5%', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <h3 className="text-lg font-semibold" style={{writingMode: 'horizontal-tb'}}>お電話でのお問い合わせ</h3>
                </div>
                
                {/* 電話番号 */}
                <div className="flex items-center gap-4" style={{position: 'absolute', top: '5rem'}}>
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">028-612-1472</p>
                    <p className="text-sm text-gray-600">年中無休 9:00-17:00</p>
                  </div>
                </div>
              </div>
              
              {/* 縦の境界線 */}
              <div style={{position: 'absolute', top: '0', left: '28%', width: '1px', height: '100%', backgroundColor: '#CCCCCC', zIndex: 1000}}></div>
            </div>
            
            {/* メール問い合わせ */}
            <div 
              style={{
                width: '38.4%',
                height: '8.429rem', // 118px ÷ 14px = 8.429rem
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* ①小見出し */}
              <h3 className="text-lg font-semibold mb-3">メールでの問い合わせ</h3>
              
              {/* ②問い合わせボタン */}
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => window.location.href = '/contact'}
              >
                <FileText className="w-4 h-4 mr-2" />
                お問合せ問い合わせフォーム
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 関連車両 */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100">
        <div className="w-full max-w-[1000px] mx-auto">
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
        </div>
      </section>

      {/* 8. 検索ボタン */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100">
        <div className="w-full max-w-[1000px] mx-auto">
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
        </div>
      </section>
    </div>
  )
} 