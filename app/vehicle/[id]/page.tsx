"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Camera, Phone, ChevronLeft, ChevronRight, Mail } from "lucide-react"
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
          // 非公開車両または一時保存車両の場合はエラーを表示
          if (fetchedVehicle.isPrivate || fetchedVehicle.isTemporarySave) {
            setError("この車両は非公開です")
            return
          }
          
          setVehicle(fetchedVehicle)
          const allVehicles = await getVehicles()
                  const related = allVehicles
          .filter(v => v.id !== vehicleId)
          .filter(v => !v.isPrivate && !v.isTemporarySave) // 非公開車両と一時保存車両を除外
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
      
      console.log('装備品フィールド値:');
      console.log('- etc:', vehicle.etc);
      console.log('- backCamera:', vehicle.backCamera);
      console.log('- recordBook:', vehicle.recordBook);
      console.log('- powerWindow:', vehicle.powerWindow);
      console.log('- driveRecorder:', vehicle.driveRecorder);
      console.log('- airConditioner:', vehicle.airConditioner);
      console.log('- electricMirror:', vehicle.electricMirror);
      console.log('- abs:', vehicle.abs);
      console.log('- aluminumWheel:', vehicle.aluminumWheel);
      console.log('- airSuspensionSeat:', vehicle.airSuspensionSeat);
      console.log('- carNavigation:', vehicle.carNavigation);
      console.log('- dpf:', vehicle.dpf);
      console.log('- pmMuffler:', vehicle.pmMuffler);
      console.log('- centralDoorLock:', vehicle.centralDoorLock);
      
      console.log('データベースの全フィールド名:');
      Object.keys(vehicle).forEach(key => {
        console.log(`- ${key}:`, vehicle[key as keyof Vehicle]);
      });
    }
  }, [vehicle]);

  const images = useMemo(() => {
    if (!vehicle) return [];
    
    if (vehicle.imageUrls && vehicle.imageUrls.length > 0) {
      const validImages = vehicle.imageUrls.filter(url => 
        url && 
        url.trim() !== "" && 
        url !== "/placeholder.jpg" &&
        !url.includes("temp_") && 
        !url.startsWith("blob:") &&
        !url.startsWith("data:")
      );
      return validImages;
    }
    
    if (vehicle.imageUrl && vehicle.imageUrl.trim() !== "" && vehicle.imageUrl !== "/placeholder.jpg") {
      return [vehicle.imageUrl];
    }
    
    return [];
  }, [vehicle?.imageUrls, vehicle?.imageUrl]);

  const shouldShowSimulation = true; // すべての車両にシミュレーションを表示

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
    // エラーが発生した画像を非表示にする
    e.currentTarget.style.display = "none";
  }

  return (
    <div className="bg-white">
      {/* 1. 車両タイトル */}
      <section className="w-[70%] mx-auto pt-4 bg-white opacity-100">
        <div className="w-full max-w-[1000px] h-[3.214rem] mx-auto bg-[#1A1A1A] opacity-100 mb-2 flex items-center justify-start" style={{ padding: '0 1rem' }}>
          <div className="flex items-center gap-[0.58rem]" style={{ whiteSpace: 'nowrap', overflow: 'visible', lineHeight: '1' }}>
            <span className="w-auto opacity-100 font-bold text-white whitespace-nowrap" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>
              {vehicle.inquiryNumber || vehicle.id}
            </span>
            <span className="opacity-100 font-bold text-white" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>｜</span>
            <span className="w-auto opacity-100 font-bold text-white whitespace-nowrap" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>
              {vehicle.maker}
            </span>
            <span className="opacity-100 font-bold text-white" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>｜</span>
            <span className="w-auto opacity-100 font-bold text-white whitespace-nowrap" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>
              {vehicle.bodyType || "---"}
            </span>
            <span className="opacity-100 font-bold text-white" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>｜</span>
            <span className="w-auto opacity-100 font-bold text-white whitespace-nowrap" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>
              {vehicle.model}
            </span>
            <span className="opacity-100 font-bold text-white" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>｜</span>
            <span className="w-auto opacity-100 font-bold text-white whitespace-nowrap" style={{ fontSize: '1.429rem !important', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'inherit', fontWeight: 'bold !important', textSizeAdjust: '100%' }}>
              {vehicle.year && vehicle.month 
                ? `${String(vehicle.year).replace(/年$/, '')}年${String(vehicle.month).replace(/月$/, '')}月` 
                : vehicle.year 
                  ? `${String(vehicle.year).replace(/年$/, '')}年` 
                  : ""
              }
            </span>
          </div>
        </div>
      </section>

      {/* 2. 車検期限の表示 */}
      <section className="w-[70%] mx-auto pt-4 bg-white opacity-100">
        {vehicle.inspectionStatus && (
          <div className="w-[1000px] h-[2.786rem] mx-auto gap-2 opacity-100 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-[6.286rem] h-[2.786rem] bg-[#2B5EC5] opacity-100 flex items-center justify-center">
                <span className="w-16 h-[1.643rem] opacity-100 font-bold text-white flex items-center justify-center">
                  {vehicle.inspectionStatus}
                </span>
              </div>
              {(vehicle.inspectionStatus === "車検付き" || vehicle.inspectionStatus === "予備検査") && vehicle.inspectionDate && (
                <span className="text-gray-900 font-bold text-[1.14rem]">
                  {(() => {
                    const date = new Date(vehicle.inspectionDate);
                    if (!isNaN(date.getTime())) {
                      const y = date.getFullYear();
                      const m = date.getMonth() + 1;
                      const d = date.getDate();
                      return `${y}年${m}月${d}日`;
                    }
                    return String(vehicle.inspectionDate);
                  })()}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 3. 写真・価格情報 */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100">
        <div className="w-full max-w-[1000px] h-[33.571rem] mx-auto gap-8 opacity-100 mb-8 ">
          <div className="flex gap-8 h-full">
            
            {/* 3-1. 車両写真 */}
            <div className="w-[48%]">
              <div className="h-full">
                {/* メイン写真 */}
                <div className="relative h-[25.714rem] overflow-hidden flex items-center justify-center w-full opacity-100">
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
                  {images.length > 0 ? (
                    <img
                      src={images[currentIndex]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover select-none"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">画像がありません</p>
                      </div>
                    </div>
                  )}
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
                  <div className="mt-4 relative w-full h-[7rem]">
                    <div 
                      className="flex gap-1 transition-transform duration-300"
                      style={{ 
                        transform: `translateX(-${Math.floor(currentIndex / 14) * 33.714}rem)`,
                        width: `${Math.ceil(images.length / 14) * 33.714}rem`
                      }}
                    >
                      {Array.from({ length: Math.ceil(images.length / 14) }, (_, pageIndex) => (
                        <div 
                          key={pageIndex}
                          style={{ 
                            display: 'grid',
                            gridTemplateRows: 'repeat(2, 3.357rem)',
                            gridTemplateColumns: 'repeat(7, 4.571rem)',
                            height: '7rem',
                            gap: '0.286rem'
                          }}
                        >
                          {images.slice(pageIndex * 14, (pageIndex + 1) * 14).map((img, idx) => (
                            <img
                              key={pageIndex * 14 + idx}
                              src={img}
                              alt={`サムネイル${pageIndex * 14 + idx + 1}`}
                              className={`object-cover rounded cursor-pointer border-2 ${currentIndex === pageIndex * 14 + idx ? 'border-blue-600' : 'border-transparent'}`}
                              style={{ 
                                height: '3.357rem'
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
            <div className="w-[52%] mb-4">
              {/* Price Table */}
               <div style={{
                 display: 'grid',
                 gridTemplateColumns: '30% 70%',
                 gridTemplateRows: '4rem 4rem',
                 border: '1px solid #CCCCCC',
                 borderRadius: '0.286rem'
               }}>
                {/* 左上：車両価格（ラベル） */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '4rem',
                    borderRight: '1px solid #CCCCCC',
                    borderBottom: '1px solid #CCCCCC',
                    background: '#F2F2F2',
                    paddingLeft: '0.75rem'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#1A1A1A'
                    }}>車両価格</span>
                  </div>
                  
                {/* 右上：車両価格（金額） */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '4rem',
                    borderBottom: '1px solid #CCCCCC',
                    background: '#FFFFFF',
                    paddingLeft: '0.75rem'
                  }}>
                  <span style={{
                    color: '#1A1A1A'
                  }}>
                    <span style={{
                      fontSize: '2.57rem',
                      fontWeight: 'bold',
                      color: '#2B5EC5'
                    }}>
                      {Math.round((vehicle.price || 0) / 10000)}
                    </span>
                    <span style={{
                      fontFamily: 'Noto Sans JP',
                      fontWeight: '400',
                      fontStyle: 'normal',
                      fontSize: '1rem',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}>万円（税別）</span>
                  </span>
                </div>
                
                {/* 左下：税込み価格（ラベル） */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: '4rem',
                  borderRight: '1px solid #CCCCCC',
                  background: '#F2F2F2',
                  paddingLeft: '0.75rem'
                }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#1A1A1A'
                  }}>税込価格</span>
                </div>
                
                {/* 右下：支払い総額（金額） */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: '3.71rem',
                  background: '#FFFFFF',
                  paddingLeft: '1rem'
                }}>
                  <span style={{
                    color: '#1A1A1A'
                  }}>
                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#1A1A1A',
                    }}>
                      {Math.round(((vehicle.totalPayment || vehicle.price || 0)) / 10000)}
                    </span>
                    <span style={{
                      fontFamily: 'Noto Sans JP',
                      fontWeight: '400',
                      fontStyle: 'normal',
                      fontSize: '1rem',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}>万円（税込）</span>
                  </span>
                </div>
              </div>

              {/* 3-3. 価格シュミレーション */}
              {shouldShowSimulation && (
                <div style={{ marginTop: '1.429rem' }}>
                  {/* タイトル */}
                  <div style={{
                    textAlign: 'left',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      fontFamily: 'Noto Sans JP',
                      fontWeight: '400',
                      fontStyle: 'normal',
                      fontSize: '1rem',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#1A1A1A'
                    }}>毎月返済額シュミレーション</span>
                  </div>
                  
                  {/* Simulation Table */}
                   <div style={{
                     display: 'grid',
                     gridTemplateColumns: '28.7% 71.3%',
                     gridTemplateRows: '4rem',
                     border: '1px solid #CCCCCC',
                     borderRadius: '0.286rem'
                   }}>
                     {/* 左：毎月の支払額（ラベル） */}
                     <div style={{
                       display: 'flex',
                       justifyContent: 'flex-start',
                       alignItems: 'center',
                       height: '4rem',
                       borderRight: '1px solid #CCCCCC',
                       background: '#F2F2F2',
                       paddingLeft: '1rem'
                     }}>
                       <span style={{
                         fontSize: '1rem',
                         fontWeight: 'bold',
                         color: '#1A1A1A',
                         whiteSpace: 'nowrap',
                       }}>毎月の支払額</span>
                     </div>
                     
                     {/* 右：毎月の支払額（金額） */}
                     <div style={{
                       display: 'flex',
                       justifyContent: 'flex-start',
                       alignItems: 'center',
                       height: '4rem',
                       background: '#FFFFFF',
                       paddingLeft: '1rem'
                     }}>
                       <span style={{
                         color: '#1154AF'
                       }}>
                         <span style={{
                           fontFamily: 'Noto Sans JP',
                           fontWeight: '700',
                           fontStyle: 'normal',
                           fontSize: '2.57rem',
                           lineHeight: '100%',
                           letterSpacing: '0%'
                         }}>
                           {(() => {
                             const totalAmount = vehicle.totalPayment || vehicle.price || 0;
                             if (totalAmount > 0) {
                               // 年利8.2%で84回支払いの計算
                               const annualRate = 0.082;
                               const monthlyRate = annualRate / 12;
                               const numberOfPayments = 84; // 84回支払い
                               const monthlyPayment = (totalAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
                               return (monthlyPayment / 10000).toFixed(1);
                             }
                             return "---";
                           })()}
                         </span>
                         <span style={{
                           fontFamily: 'Noto Sans JP',
                           fontWeight: '400',
                           fontStyle: 'normal',
                           fontSize: '1rem',
                           lineHeight: '100%',
                           letterSpacing: '0%',
                           color: '#1A1A1A'
                         }}>万円</span>
                       </span>
                     </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 車両メイン情報 */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100">
        
        {/* 4-1. 車両情報 */}
        <div className="w-full max-w-[1000px] mx-auto gap-3 opacity-100 mb-6">
          <h2 className="text-xl font-bold mb-4">車輌情報</h2>
          <div style={{height: 'auto'}}>
            <div className="grid grid-rows-8 grid-cols-4">
              {/* 1行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>メーカー</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.maker}</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車体寸法（cm）</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>L{formatNumberWithCommas(vehicle.outerLength)}cm × W{formatNumberWithCommas(vehicle.outerWidth)}cm × H{formatNumberWithCommas(vehicle.outerHeight)}cm</span>
              {/* 2行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車種</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.vehicleType || vehicle.model}</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車両総重量</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{formatNumberWithCommas(vehicle.totalWeight)}kg</span>
              {/* 3行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>型式</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.modelCode || vehicle.model || "---"}</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>原動機型式</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.engineModel || "---"}</span>
              {/* 4行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>年式</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.year && vehicle.month ? `${vehicle.year}年${vehicle.month.toString().replace('月', '')}月` : vehicle.year ? `${vehicle.year}年` : ""}</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>馬力</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{formatNumberWithCommas(vehicle.horsepower)}ps</span>
              {/* 5行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>走行距離</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{formatNumberWithCommas(vehicle.mileage)}km</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>過給機</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.turbo || "---"}</span>
              {/* 6行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>最大積載量</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{formatNumberWithCommas(vehicle.loadingCapacity)}kg</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>排気量</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{formatNumberWithCommas(vehicle.displacement)}cc</span>
              {/* 7行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>シフト</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.mission || vehicle.shift || "---"}</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>燃料</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '0.875rem'}}>{vehicle.fuel || "---"}</span>
              {/* 8行目 */}
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>車検有効期限</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontSize: '0.875rem'}}>{vehicle.inspectionDate ? (() => {
                const date = new Date(vehicle.inspectionDate);
                if (isNaN(date.getTime())) {
                  return vehicle.inspectionDate;
                }
                return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
              })() : "---"}</span>
              <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>お問合せ番号</span>
              <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontSize: '0.875rem'}}>{vehicle.inquiryNumber || vehicle.id}</span>
            </div>
          </div>
          
          <div className="w-full max-w-[1000px] mx-auto text-sm text-gray-600 space-y-1 mb-6">
            <p>※ 抹消車両は、登録時最大積載量が減トンされる可能性が御座います。</p>
          </div>
        </div>

        {/* 4-2. 車検証*/}
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
          </div>
        </div>

          {/* 4-3. 上物情報 */}
         <div className="w-full max-w-[1000px] mx-auto gap-3 opacity-100 mb-6">
           <h2 className="text-xl font-bold mb-4">上物情報</h2>
           <div style={{height: 'auto'}}>
             <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '3.142rem 3.142rem 3.142rem 6.2rem', gap: '0'}}>
               {/* 1行目 */}
               <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>メーカー</span>
               <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '1rem'}}>{vehicle.bodyMaker || "---"}</span>
               <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>内寸（L）</span>
               <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '1rem'}}>{vehicle.innerLength ? `${formatNumberWithCommas(vehicle.innerLength)}cm` : "---"}</span>
               {/* 2行目 */}
               <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>型式</span>
               <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '1rem'}}>{vehicle.bodyModel || vehicle.modelCode || "---"}</span>
               <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>内寸（W）</span>
               <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '1rem'}}>{vehicle.innerWidth ? `${formatNumberWithCommas(vehicle.innerWidth)}cm` : "---"}</span>
               {/* 3行目 */}
               <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>年式</span>
               <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '1rem'}}>{vehicle.bodyYear || "---"}</span>
               <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '3.142rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>内寸（H）</span>
               <span className="px-3 flex items-center" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 0 0', fontSize: '1rem'}}>{vehicle.innerHeight ? `${formatNumberWithCommas(vehicle.innerHeight)}cm` : "---"}</span>
               {/* 4行目 */}
               <span className="font-medium px-3 flex items-center" style={{background: '#F2F2F2', height: '6.2rem', width: '100%', borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontFamily: 'Noto Sans JP', fontWeight: 700, fontStyle: 'normal', fontSize: '1rem', lineHeight: '100%', letterSpacing: '0%'}}>装備/仕様</span>
               <span className="px-3 flex items-center col-span-3" style={{borderStyle: 'solid', borderColor: '#CCCCCC', borderWidth: '1px 1px 1px 0', fontSize: '1rem', height: '6.2rem'}}>{vehicle.equipment || "---"}</span>
             </div>
           </div>
         </div>
      </section>


      {/* 5. 問い合わせフォーム */}
       <section className="w-[70%] mx-auto pb-10 bg-white opacity-100" style={{position: 'relative', zIndex: 1}}>
          <div className="w-full max-w-[1000px] mx-auto" style={{paddingTop: '1.429rem', paddingBottom: '1.429rem', background: '#BCBCBC'}}>
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
                gap: '2.286rem',
                marginTop: '1.429rem',
                marginBottom: '0',
              }}
            >
             {/* 電話問い合わせ */}
              <div 
                style={{
                  width: '40%',
                  height: '8.429rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0',
                  boxShadow: '0 0.286rem 0.429rem rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
               {/* ①問い合わせ番号 */}
               <div style={{width: '28%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', top: '5rem'}}>
                 <p style={{
                   fontFamily: 'Noto Sans JP',
                   fontWeight: '400',
                   fontStyle: 'normal',
                   fontSize: '0.857rem',
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
                   fontSize: '1.143rem',
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
                   width: '78.21%',
                   height: '3.429rem',
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
                     fontSize: '0.714rem',
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
                  <div style={{position: 'absolute', top: '0rem', backgroundColor: '#F2F2F2', height: '2.571rem', width: '100%', left: '0%', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <h3 className="text-lg font-semibold" style={{writingMode: 'horizontal-tb'}}>お電話でのお問い合わせ</h3>
                  </div>
                  
                  {/* 在庫店舗名 */}
                  {vehicle?.storeName && (
                    <div style={{position: 'absolute', top: '3.3rem', width: '100%', left: '0%', display: 'flex', justifyContent: 'center'}}>
                      <p style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 700,
                        fontStyle: 'normal',
                        fontSize: '0.875rem',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#1f2937'
                      }}>{vehicle.storeName}</p>
                    </div>
                  )}
                  
                  {/* 電話番号 */}
                  <div style={{position: 'absolute', top: '5rem', width: '100%', left: '0%', display: 'flex', justifyContent: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <Phone style={{
                        height: '1.286rem',
                        transform: 'rotate(0deg)',
                        opacity: 1,
                        color: '#1a1a1a'
                      }} />
                      <p style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 700,
                        fontStyle: 'normal',
                        fontSize: '1.429rem',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#1f2937'
                      }}>028-612-1472</p>
                    </div>
                  </div>
                  
                  {/* 営業時間 */}
                  <div style={{position: 'absolute', top: '7rem', width: '100%', left: '0%', display: 'flex', justifyContent: 'center'}}>
                    <p style={{
                      fontFamily: 'Noto Sans JP',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '0.857rem',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#1a1a1a'
                    }}>（受付時間）8:00-17:00</p>
                  </div>
               </div>
               
                {/* 縦の境界線 */}
               <div style={{position: 'absolute', top: '0', left: '28%', width: '1px', height: '100%', backgroundColor: '#CCCCCC', zIndex: 1000}}></div>
             </div>
             
             {/* メール問い合わせ */}
              <div 
                style={{
                  width: '40%',
                  height: '8.429rem', // 118px ÷ 14px = 8.429rem
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: '0',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
               {/* ①小見出し */}
               <h3 className="text-lg font-semibold mb-3">メールでの問い合わせ</h3>
               
               {/* ②問い合わせボタン */}
                  <Button 
                   style={{
                     width: '60%',
                     height: '4rem',
                     background: 'linear-gradient(180deg, #1154AF 0%, #053B65 100%)',
                     boxShadow: '0.143rem 0.143rem 0.143rem 0px #0000000D',
                     border: 'none',
                     borderRadius: '0',
                     color: '#FFFFFF',
                     fontFamily: 'Noto Sans JP',
                     fontWeight: 700,
                     fontStyle: 'normal',
                     fontSize: '1rem',
                     lineHeight: '100%',
                     letterSpacing: '0%',
                     textAlign: 'center',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: '0.5rem',
                     cursor: 'pointer',
                     transition: 'opacity 0.2s'
                   }}
                   onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                   onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                   onClick={() => window.location.href = '/contact'}
                 >
                   <Mail style={{
                     width: '1.429rem',
                     height: '1.143rem',
                     transform: 'rotate(0deg)',
                     opacity: 1
                   }} />
                   お問い合せ<br />フォーム
                 </Button>
             </div>
           </div>
        </div>
      </section>

      {/* 7. 関連する車両 */}
      <section className="w-[70%] mx-auto pb-10 bg-white opacity-100" style={{marginTop: '1.429rem'}}>
        <div className="w-full max-w-[1000px] mx-auto">
          <div style={{
            height: '3.786rem',
            width: '100%',
            background: '#2B5EC5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '1.429rem',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              margin: 0
            }}>関連する車両</h2>
          </div>
          
          
          {/* サンプルカード */}
           <div 
             className="vehicle-detail-samples"
             style={{
               display: "flex",
               justifyContent: "space-between",
               width: "100%"
             }}
           >
             {/* 他の車両のサンプル表示 */}
             {Array.from({ length: 3 }, (_, i) => (
               <Card 
                 key={i}
                 style={{
                   width: "32%",
                   gap: "0.86rem",
                   opacity: 1,
                   borderRadius: "0px",
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
                       三菱 トラック
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
                       FK4J23A
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
                       問合せ番号: N00000
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
                       src="/placeholder.jpg"
                       alt="サンプル車両"
                       style={{
                         width: "100%",
                         height: "100%",
                         objectFit: "cover"
                       }}
                     />
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
                           color: "#1A1A1A"
                         }}>
                           トラック
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
                           }}>
                             150
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
                         <span style={{
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
                           R6年9月
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
                         <span style={{
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
                           00,000km
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
                         <span style={{
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
                           4.0t
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
                           color: "#1A1A1A"
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
                           color: "#1A1A1A"
                         }}>
                           抹消
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
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>
      </section>

      {/* 8. 他の車両 */}
      <section className="w-full opacity-100" style={{marginTop: '1.429rem', background: '#F2F2F2', paddingTop: '1.429rem', paddingBottom: '1.429rem'}}>
        <div className="w-full max-w-[1000px] mx-auto">
          {/* 1. 小見出しテキスト */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <p style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontStyle: 'Bold',
              fontSize: '1.429rem', // 20px ÷ 14px = 1.429rem
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#1A1A1A',
              margin: 0
            }}>
              他の車両をお探しの方はこちらから
            </p>
          </div>

          {/* 3. ボディタイプカード */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: '2rem'
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0.286rem", // 4px ÷ 14px = 0.286rem
              width: "fit-content"
            }}>
            {[
              { id: 1, type: "クレーン", icon: "crane" },
              { id: 2, type: "ダンプ", icon: "dump" },
              { id: 3, type: "平ボディ", icon: "flatbed" },
              { id: 4, type: "車輌運搬車", icon: "carrier" },
              { id: 5, type: "ミキサー車", icon: "mixer" },
              { id: 6, type: "アルミバン", icon: "van" },
              { id: 7, type: "高所作業車", icon: "aerial" },
              { id: 8, type: "アルミウィング", icon: "wing" },
              { id: 9, type: "キャリアカー", icon: "car_carrier" },
              { id: 10, type: "塵芥車", icon: "garbage" },
              { id: 11, type: "アームロール", icon: "arm-roll" },
              { id: 12, type: "特装車・その他", icon: "special" }
            ].map((icon) => (
              <Link
                key={icon.id}
                href={`/inventory?type=${encodeURIComponent(icon.type)}`}
                style={{
                  width: "12.571rem",
                  height: "6.857rem",
                  borderRadius: "0.286rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0.071rem 0.214rem rgba(0, 0, 0, 0.1)",
                  opacity: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-0.143rem)";
                  e.currentTarget.style.boxShadow = "0 0.286rem 0.571rem rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0.071rem 0.214rem rgba(0, 0, 0, 0.1)";
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
                      width: "4.571rem", // 64px ÷ 14px = 4.571rem
                      height: "4.571rem", // 64px ÷ 14px = 4.571rem
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.571rem" // 8px ÷ 14px = 0.571rem
                    }}
                  >
                    <img 
                      src={`/${icon.icon}.${icon.type === "平ボディ" || icon.type === "アームロール" || icon.type === "キャリアカー" ? "png" : "jpg"}`}
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
                      fontSize: "1.143rem", // 16px ÷ 14px = 1.143rem
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#1A1A1A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "11.429rem" // 160px ÷ 14px = 11.429rem
                    }}
                  >
                    {icon.type}
                  </span>
                </div>
              </Link>
            ))}
            </div>
          </div>

          {/* 4. 在庫一覧へ */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: '2rem',
            width: "100%"
          }}>
            <Link href="/inventory" style={{width: "15.28vw"}}>
              <Button 
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.429rem",
                  width: "100%",
                  height: "2.857rem",
                  borderRadius: "0.286rem",
                  border: "none",
                  background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                  color: "#FFFFFF",
                  fontFamily: "Noto Sans JP",
                  fontWeight: 700,
                  fontStyle: "Bold",
                  fontSize: "1.143rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textDecoration: "none"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <span>在庫一覧へ</span>
                <ChevronRight 
                  size={20} 
                  color="#FFFFFF"
                />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 