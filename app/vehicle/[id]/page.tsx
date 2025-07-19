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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 text-lg">
            <span>{vehicle.inquiryNumber || vehicle.id}</span>
            <span>｜</span>
            <span>{vehicle.maker}</span>
            <span>｜</span>
            <span>{vehicle.bodyType || "---"}</span>
            <span>｜</span>
            <span>{vehicle.model}</span>
            <span>｜</span>
            <span>{String(vehicle.year || "")}</span>
          </div>
        </div>
      </section>

      {/* 車検状態・有効期限表示 */}
      {vehicle.inspectionStatus && (
        <section className="bg-gray-50 py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 text-lg">
              <span className="text-gray-900">{vehicle.inspectionStatus}</span>
              {(vehicle.inspectionStatus === "車検付き" || vehicle.inspectionStatus === "予備検査") && vehicle.inspectionDate && (
                <>
                  <span className="text-gray-400">｜</span>
                  <span className="text-gray-900">{vehicle.inspectionDate}</span>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Vehicle Image Slider */}
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* 商談中・SOLD OUT表示 */}
                  {vehicle.isSoldOut && (
                    <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-3 font-bold text-lg z-20">
                      SOLD OUT
                    </div>
                  )}
                  {vehicle.isNegotiating && !vehicle.isSoldOut && (
                    <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-3 font-bold text-lg z-20">
                      商談中
                      {vehicle.negotiationDeadline && (
                        <span className="ml-2 text-sm font-normal">
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
                {/* サムネイル一覧 */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 px-4 pb-4 overflow-x-auto">
                    {images.map((img, idx) => (
                      <img
                        key={img}
                        src={img}
                        alt={`サムネイル${idx + 1}`}
                        className={`w-24 h-16 object-cover rounded cursor-pointer border-2 ${currentIndex === idx ? 'border-blue-600' : 'border-transparent'}`}
                        onClick={() => handleThumbClick(idx)}
                        onError={handleImageError}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 毎月支払額シミュレーション */}
            {shouldShowSimulation && (
              <Card className="mb-8 w-[488px] h-[153px] ml-auto mt-0 mr-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">毎月の支払額</span>
                    <span className="text-xl font-bold text-blue-600">
                      {vehicle[`simulation${selectedPaymentPeriod}Year` as keyof Vehicle] 
                        ? formatNumberWithCommas(Number(vehicle[`simulation${selectedPaymentPeriod}Year` as keyof Vehicle])) 
                        : "---"}円
                    </span>
                  </div>
                  <div>
                    <span className="font-medium block mb-2">返済期間</span>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5].map((year) => (
                        <button
                          key={year}
                          onClick={() => setSelectedPaymentPeriod(year)}
                          className={`px-3 py-1 rounded border transition-colors text-sm ${
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

            {/* Vehicle Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">DETAIL(車輌情報)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <span>{vehicle.year && vehicle.month ? `${vehicle.year}年${vehicle.month}` : String(vehicle.year || "")}</span>
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
                
                {/* 車検証・状態表確認ボタン */}
                {(vehicle.inspectionImageUrl || vehicle.conditionImageUrl) && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">書類確認</h3>
                    <div className="flex flex-wrap gap-3">
                      {vehicle.inspectionImageUrl && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(vehicle.inspectionImageUrl, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <span className="text-red-500">📄</span>
                          車検証を確認
                        </Button>
                      )}
                      {vehicle.conditionImageUrl && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(vehicle.conditionImageUrl, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <span className="text-red-500">📄</span>
                          状態表を確認
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {vehicle.description && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">車両説明</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{vehicle.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Equipment */}
            <Card className="mb-8">
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

            {/* 車検証・状態表 */}
            {(vehicle.inspectionImageUrl || vehicle.conditionImageUrl) && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">書類・資料</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vehicle.inspectionImageUrl && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">車検証</h3>
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-red-500 text-2xl">📄</span>
                            <a 
                              href={vehicle.inspectionImageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              車検証を表示
                            </a>
                          </div>
                          <img 
                            src={vehicle.inspectionImageUrl} 
                            alt="車検証" 
                            className="max-w-full h-auto max-h-64 rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(vehicle.inspectionImageUrl, '_blank')}
                            onError={(e) => {
                              // 画像読み込みエラー時はPDFとして扱う
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center gap-2 p-4 bg-gray-50 rounded">
                                    <span class="text-red-500 text-2xl">📄</span>
                                    <span class="text-gray-700">PDFファイル</span>
                                    <a href="${vehicle.inspectionImageUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline ml-2">
                                      開く
                                    </a>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {vehicle.conditionImageUrl && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">状態表</h3>
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-red-500 text-2xl">📄</span>
                            <a 
                              href={vehicle.conditionImageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              状態表を表示
                            </a>
                          </div>
                          <img 
                            src={vehicle.conditionImageUrl} 
                            alt="状態表" 
                            className="max-w-full h-auto max-h-64 rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(vehicle.conditionImageUrl, '_blank')}
                            onError={(e) => {
                              // 画像読み込みエラー時はPDFとして扱う
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center gap-2 p-4 bg-gray-50 rounded">
                                    <span class="text-red-500 text-2xl">📄</span>
                                    <span class="text-gray-700">PDFファイル</span>
                                    <a href="${vehicle.conditionImageUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline ml-2">
                                      開く
                                    </a>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technical Specifications */}
            {(vehicle.modelCode || vehicle.loadingCapacity || vehicle.mission || vehicle.shift || 
              vehicle.inspectionStatus || vehicle.outerLength || vehicle.outerWidth || 
              vehicle.outerHeight || vehicle.innerLength || vehicle.innerWidth || 
              vehicle.innerHeight || vehicle.totalWeight || vehicle.engineModel || 
              vehicle.horsepower || vehicle.turbo || vehicle.displacement || vehicle.fuel ||
              vehicle.bodyMaker || vehicle.bodyModel || vehicle.bodyYear) && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">技術仕様</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {vehicle.modelCode && (
                        <div className="flex justify-between">
                          <span className="font-medium">型式</span>
                          <span>{vehicle.modelCode}</span>
                        </div>
                      )}
                      {vehicle.loadingCapacity && (
                        <div className="flex justify-between">
                          <span className="font-medium">積載量</span>
                          <span>{formatNumberWithCommas(vehicle.loadingCapacity)}kg</span>
                        </div>
                      )}
                      {vehicle.mission && (
                        <div className="flex justify-between">
                          <span className="font-medium">ミッション</span>
                          <span>{vehicle.mission}</span>
                        </div>
                      )}
                      {vehicle.shift && (
                        <div className="flex justify-between">
                          <span className="font-medium">シフト</span>
                          <span>{vehicle.shift}</span>
                        </div>
                      )}
                      {vehicle.inspectionStatus && (
                        <div className="flex justify-between">
                          <span className="font-medium">車検状態</span>
                          <span>{vehicle.inspectionStatus}</span>
                        </div>
                      )}
                      {vehicle.outerLength && (
                        <div className="flex justify-between">
                          <span className="font-medium">外寸長</span>
                          <span>{formatNumberWithCommas(vehicle.outerLength)}mm</span>
                        </div>
                      )}
                      {vehicle.outerWidth && (
                        <div className="flex justify-between">
                          <span className="font-medium">外寸幅</span>
                          <span>{formatNumberWithCommas(vehicle.outerWidth)}mm</span>
                        </div>
                      )}
                      {vehicle.outerHeight && (
                        <div className="flex justify-between">
                          <span className="font-medium">外寸高</span>
                          <span>{formatNumberWithCommas(vehicle.outerHeight)}mm</span>
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
                    <div className="space-y-3">
                      {vehicle.totalWeight && (
                        <div className="flex justify-between">
                          <span className="font-medium">車両総重量</span>
                          <span>{formatNumberWithCommas(vehicle.totalWeight)}kg</span>
                        </div>
                      )}
                      {vehicle.engineModel && (
                        <div className="flex justify-between">
                          <span className="font-medium">原動機型式</span>
                          <span>{vehicle.engineModel}</span>
                        </div>
                      )}
                      {vehicle.horsepower && (
                        <div className="flex justify-between">
                          <span className="font-medium">馬力</span>
                          <span>{formatNumberWithCommas(vehicle.horsepower)}ps</span>
                        </div>
                      )}
                      {vehicle.turbo && (
                        <div className="flex justify-between">
                          <span className="font-medium">ターボ</span>
                          <span>{vehicle.turbo}</span>
                        </div>
                      )}
                      {vehicle.displacement && (
                        <div className="flex justify-between">
                          <span className="font-medium">排気量</span>
                          <span>{formatNumberWithCommas(vehicle.displacement)}cc</span>
                        </div>
                      )}
                      {vehicle.fuel && (
                        <div className="flex justify-between">
                          <span className="font-medium">燃料</span>
                          <span>{vehicle.fuel}</span>
                        </div>
                      )}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">価格情報</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">車両価格</span>
                    <span className="text-2xl font-bold text-blue-600">
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
                <div className="mt-6 space-y-3">
                  <Link href="/contact" className="w-full">
                    <Button className="w-full" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      お問い合わせ
                    </Button>
                  </Link>
                  <Link href="/assessment" className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      査定依頼
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Related Vehicles */}
            {relatedVehicles.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">関連車両</h3>
                  <div className="space-y-4">
                    {relatedVehicles.map((relatedVehicle) => (
                      <Link
                        key={relatedVehicle.id}
                        href={`/vehicle/${relatedVehicle.id}`}
                        className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={relatedVehicle.imageUrls?.[0] || relatedVehicle.imageUrl || "/placeholder.jpg"}
                            alt={relatedVehicle.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{relatedVehicle.name}</h4>
                            <p className="text-xs text-gray-600">{relatedVehicle.maker}</p>
                            <p className="text-xs text-gray-600">{String(relatedVehicle.year || "")}</p>
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
        </div>
      </div>
    </div>
  )
}









