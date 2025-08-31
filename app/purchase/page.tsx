"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Upload, Download, PhoneCall, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import ContactForm from "../components/ContactForm"
import { getSoldOutVehicles, convertYearToJapaneseEra } from "@/lib/firebase-utils"
import type { Vehicle } from "@/types"
import Image from "next/image"

// ============================================================================
// データ定義
// ============================================================================

// デフォルトの買取実績（データがない場合のフォールバック）
const defaultAchievements = [
  {
    maker: "日野レンジャー",
    year: "平成00年",
    price: "000",
    status: "高価買取",
  },
  {
    maker: "いすゞ エルフ",
    year: "平成00年",
    price: "000",
    status: "高価買取",
  },
  {
    maker: "UD クオン",
    year: "平成00年",
    price: "000",
    status: "高価買取",
  },
]

const reasons = [
  {
    title: "自社で再生、直販するから高値で買える！",
    description:
      "当社は、お客様からお預かりしたトラックを自社で整備・再生し、仲介業者を通さずに直接再販売しています。そのため、他社様とは異なる査定基準を持っており、相場よりも高く中古トラックを買い取ることが可能になっています。1円でも高く買い取ってほしい･･･そんなお客様の想いに、精一杯お応えさせていただきます！",
  },
  {
    title: "熟練の買取査定士によるスピード査定！",
    description:
      "査定を対応するのは、これまで10,000台を超える中古トラックを買い付けてきたトラック買取のエキスパートが率いる査定専門チーム。どんなタイプの車輛でも、高く買取できるポイントを見極めて査定いたします。故障で動かなくなった状態のトラックでも、まずは一度ご相談ください！また、実車査定にお伺いする前の段階でも、フォームから車輛情報を入力・写真をお送りいただければ、目安となる買取金額を1営業日以内にご回答いたします。",
  },
  {
    title: "お客様の面倒は一切なし。スムーズなお取引！",
    description:
      "車の売却にあたって避けられない煩わしい書類手続き。お忙しいお客様に代わって、弊社が代行処理いたします。トラックの売却・譲渡がはじめてのお客様も安心してお任せください。取引後の社名消しや、車輛の引き渡しお支払い方法など、お客様のご要望に合わせて迅速に対応させていただきます。",
  },
]

const reviews = [
  {
    price: "000",
    truck: "いすゞ エルフ",
    location: "茨城県",
    customer: "A様(運送業)",
    title: "他社よりも高い金額を提示してもらえました",
    comment:
      "複数社に連絡しましたが、ノアコーポレーションさんが他社よりも20万円ほど高く買い取っていただけました。次もまたお願いします！",
    reviewNumber: "01",
  },
  {
    price: "000",
    truck: "日野 レンジャー",
    location: "栃木県",
    customer: "B様(農業)",
    title: "はじめての買取でしたが、安心してお願いできました",
    comment:
      "初めてのことでしたが書類手続きなどもスムーズに案内していただき、とても楽でした。スタッフの方の対応も気持ちがよく、迅速な反応で助かりました。",
    reviewNumber: "02",
  },
  {
    price: "000",
    truck: "UD クオン",
    location: "埼玉県",
    customer: "C様(建設業)",
    title: "故障車も買い取ってもらえて感謝です",
    comment:
      "電話で相談したところ、動かない車でも大丈夫とのことで、査定いただきました。急なことで困っていましたが、まず相談してよかったです。",
    reviewNumber: "03",
  },
]

const faqs = [
  {
    question: "査定はいつでも可能ですか？",
    answer:
      "はい。お客様のご都合の良いお時間に当社のLINEに査定車両の情報をお送りください。",
  },
  {
    question: "どんな情報を送ればいいですか?",
    answer:
      "車検証・車両の外観、内観・直近の不具合等があればお知らせください。",
  },
  {
    question: "LINEで査定にお金はかかりますか？",
    answer:
      "LINEで査定は無料でご利用いただけます。",
  },
  {
    question: "ノアコーポレションで購入も買取もした事がないけど利用できますか？",
    answer:
      "はい。初めての方もご利用いただけます。初めてが不安という方にはお電話での対応も365日しておりますので、お客様のお手隙なタイミングでお問合せください。",
  },
]

// ============================================================================
// 子コンポーネント定義
// ============================================================================

// 1. キャッチコピーセクション
const HeroSection = () => (
  <section className="relative w-full h-[51.357rem]">
    {/* 背景要素 */}
    <div className="absolute inset-0 flex">
      {/* 1. 長方形 - 右から1番目 */}
      <div 
        className="w-1/4 h-full"
        style={{
          background: 'linear-gradient(90deg, #444444 0%, #959595 100%)'
        }}
      />
      
      {/* 2. 長方形 - 右から2番目 */}
      <div 
        className="w-[7%] h-full"
        style={{
          background: '#C3C3C3'
        }}
      />
      
      {/* 3. 背景画像 - 右から3番目（68%） */}
      <div className="w-[68%] h-full relative">
        {/* 背景画像 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background_for_purchace.png)'
          }}
        />
        {/* 半透明オーバーレイ */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: '#00000033'
          }}
        />
      </div>
    </div>
    
    {/* コンテンツレイヤー */}
    <div className="relative z-10 h-full flex">
      {/* 左側エリア（見出しと強み） */}
      <div className="w-1/4 h-full flex flex-col justify-between text-white">
        {/* 1. 見出し */}
        <h1 
          className="font-bold absolute"
          style={{
            fontFamily: 'Noto Sans JP',
            fontWeight: 700,
            fontStyle: 'Bold',
            fontSize: '2.571rem',
            lineHeight: '100%',
            letterSpacing: '0%',
            left: '7.5rem',
            top: '7.929rem'
          }}
        >
          気軽に無料で買取依頼
        </h1>
        
        {/* 2. キャッチコピー */}
        <div 
          className="relative bg-white absolute"
          style={{
            width: '52.9vw',
            height: '6.786rem',
            left: '7.5rem',
            top: '11.071rem',
            transform: 'skewX(-20deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h2 
            className="font-bold text-black"
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontStyle: 'Bold',
              fontSize: '4.571rem',
              lineHeight: '100%',
              letterSpacing: '0%',
              transform: 'skewX(20deg)'
            }}
          >
            LINEで即日査定!!
          </h2>
        </div>
        
        {/* 2. 買取における強み */}
        <div className="absolute" style={{ left: '14.286rem', top: '28.429rem' }}>
          <div 
            className="bg-blue-600 text-white rounded"
            style={{
              padding: '0.857rem',
              marginBottom: '1.429rem',
              display: 'block',
              width: 'fit-content'
            }}
          >
            <span 
              className="font-medium"
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: '1.714rem',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              高価買取に挑戦。
            </span>
          </div>
          <div 
            className="bg-blue-600 text-white rounded"
            style={{
              padding: '0.857rem',
              marginBottom: '1.429rem',
              display: 'block',
              width: 'fit-content'
            }}
          >
            <span 
              className="font-medium"
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: '1.714rem',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              LINEでのスピード査定
            </span>
          </div>
          <div 
            className="bg-blue-600 text-white rounded"
            style={{
              padding: '0.857rem',
              display: 'block',
              width: 'fit-content'
            }}
          >
            <span 
              className="font-medium"
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: '1.714rem',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              車両引上げ / 書類手続きはすべて代行
            </span>
          </div>
        </div>
      </div>
      
      {/* 右側エリア（問い合わせフォーム） */}
              <div className="absolute" style={{ right: '14.64rem', bottom: '8.786rem' }}>
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-sm inline-block" style={{ padding: '1.429rem', height: '9.857rem' }}>
            <p 
              className="text-black font-medium mb-4 whitespace-nowrap"
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontStyle: 'Bold',
                fontSize: '1.428rem',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              \ LINEで簡単に査定額が分かります！ /
            </p>
            <Link href="/contact">
              <Button 
                className="text-white border-0"
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontStyle: 'Bold',
                  fontSize: '1.428rem',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  height: '3.214rem',
                  marginTop: '1.2rem',
                  background: 'linear-gradient(180deg, #1154AF 0%, #053B65 100%)',
                  boxShadow: '0.143rem 0.143rem 0.143rem 0 #00000040',
                  backgroundColor: 'transparent'
                }}
              >
                まずはお友達登録 &nbsp;&gt;
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// 2. 買取実績セクション
const AchievementSection = ({ achievements, loading }: { achievements: Vehicle[], loading: boolean }) => {
  // 買取価格を計算（車両価格（税込）から100万円を引く）
  const calculatePurchasePrice = (totalPayment: number): number => {
    return Math.max(0, totalPayment - 1000000)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
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
              ACHIEVEMENT
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
              当社買取実績
            </div>
          </div>
        </div>

                 <div className="flex justify-center gap-1 mb-8" style={{ gap: '1.42rem' }}>
           {loading ? (
             // ローディング中はデフォルトの表示
             defaultAchievements.map((item, index) => (
               <div key={index} className="text-center relative overflow-hidden" style={{ width: '20.8%', height: '27.643rem' }}>
                 <div className="p-0 h-full">
                  {/* 1. 車両画像 */}
                  <div className="w-full bg-gray-200 flex items-center justify-center" style={{ height: '14.286rem' }}>
                    <div className="text-gray-400">車両画像</div>
                  </div>
                  
                  {/* 2. 車名・年式 */}
                  <div className="px-3" style={{ height: '7.714rem', padding: '0 0.857rem' }}>
                    <h3 
                      className="font-bold mb-2" 
                      style={{ 
                        fontSize: '1.429rem', 
                        padding: '1.143rem',
                        borderBottom: '0.071rem solid #CCCCCC'
                      }}
                    >
                      {item.maker}
                    </h3>
                    <p 
                      className="mb-4 font-bold" 
                      style={{ 
                        fontSize: '1.143rem', 
                        padding: '0.857rem',
                        borderBottom: '0.071rem solid #CCCCCC',
                        color: '#1a1a1a'
                      }}
                    >
                      年式: {item.year}
                    </p>
                  </div>
                  
                  {/* 3. 買取価格 */}
                    <div className="absolute bottom-0 w-full" style={{ height: '3.929rem', background: '#E6E6E6' }}>
                      <div className="h-full flex items-center" style={{ padding: '0 0.857rem' }}>
                        <span className="text-2xl font-bold">当社買取額：{item.price}万円</span>
                      </div>
                    </div>
                  
                  {/* 4. 高価買取マーク */}
                   <div 
                     className="absolute text-white text-sm font-bold flex items-center justify-center"
                     style={{
                       width: '5.143rem',
                       height: '5.143rem',
                       bottom: '0.857rem',
                       right: '0',
                       background: '#EA1313',
                       border: '0.143rem solid #666666',
                       borderRadius: '50%',
                       zIndex: 10,
                       fontSize: '1.428rem',
                       textAlign: 'center',
                                            lineHeight: '1.2'
                   }}
                 >
                   高価<br />買取
                 </div>
                </div>
              </div>
            ))
          ) : achievements.length > 0 ? (
            // 実際のSOLD OUT車両データを表示
            achievements.map((vehicle, index) => {
              const purchasePrice = calculatePurchasePrice(vehicle.totalPayment || 0)
              const japaneseYear = convertYearToJapaneseEra(vehicle.year)
              const vehicleName = `${vehicle.maker || ""} ${vehicle.vehicleType || ""}`.trim()
              
              return (
                <div key={vehicle.id} className="text-center relative overflow-hidden" style={{ width: '20.8%', height: '27.643rem' }}>
                  <div className="p-0 h-full">
                    {/* 1. 車両画像 */}
                    <div className="w-full flex items-center justify-center overflow-hidden" style={{ height: '14.286rem' }}>
                      {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
                        <Image
                          src={vehicle.imageUrls[0]}
                          alt={vehicleName}
                          width={200}
                          height={150}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg"
                          }}
                        />
                      ) : (
                        <div className="text-gray-400">車両画像</div>
                      )}
                    </div>
                    
                    {/* 2. 車名・年式 */}
                    <div className="px-3" style={{ height: '7.714rem', padding: '0 0.857rem' }}>
                      <h3 
                        className="font-bold mb-2" 
                        style={{ 
                          fontSize: '1.429rem', 
                          padding: '1.143rem',
                          borderBottom: '0.071rem solid #CCCCCC'
                        }}
                      >
                        {vehicleName}
                      </h3>
                      <p 
                        className="mb-4 font-bold" 
                        style={{ 
                          fontSize: '1.143rem', 
                          padding: '0.857rem',
                          borderBottom: '0.071rem solid #CCCCCC',
                          color: '#1a1a1a'
                        }}
                      >
                        年式: {japaneseYear}
                      </p>
                    </div>
                    
                                               {/* 3. 買取価格 */}
                        <div className="absolute bottom-0 w-full" style={{ height: '3.929rem', background: '#E6E6E6' }}>
                          <div className="h-full flex items-center" style={{ padding: '0 0.857rem' }}>
                            <span className="text-2xl font-bold">
                              当社買取額：{Math.floor(purchasePrice / 10000)}万円
                            </span>
                          </div>
                        </div>
                       
                       {/* 4. 高価買取マーク */}
                       <div 
                         className="absolute text-white font-bold flex items-center justify-center"
                         style={{
                           width: '5.143rem',
                           height: '5.143rem',
                           bottom: '0.857rem',
                           right: '0',
                           background: '#EA1313',
                           border: '0.143rem solid #666666',
                           borderRadius: '50%',
                           zIndex: 10,
                           fontSize: '1.428rem',
                           textAlign: 'center',
                           lineHeight: '1.2'
                         }}
                       >
                         高価<br />買取
                       </div>
                  </div>
                </div>
              )
            })
          ) : (
            // データがない場合はデフォルト表示
            defaultAchievements.map((item, index) => (
              <div key={index} className="text-center relative overflow-hidden" style={{ width: '20.8%', height: '27.643rem' }}>
                <div className="p-0 h-full">
                  {/* 1. 車両画像 */}
                  <div className="w-full bg-gray-200 flex items-center justify-center" style={{ height: '14.286rem' }}>
                    <div className="text-gray-400">車両画像</div>
                  </div>
                  
                  {/* 2. 車名・年式 */}
                  <div className="px-3" style={{ height: '7.714rem', padding: '0 0.857rem' }}>
                    <h3 
                      className="font-bold mb-2" 
                      style={{ 
                        fontSize: '1.429rem', 
                        padding: '1.143rem',
                        borderBottom: '0.071rem solid #CCCCCC'
                      }}
                    >
                      {item.maker}
                    </h3>
                    <p 
                      className="mb-4 font-bold" 
                      style={{ 
                        fontSize: '1.143rem', 
                        padding: '0.857rem',
                        borderBottom: '0.071rem solid #CCCCCC',
                        color: '#1a1a1a'
                      }}
                    >
                      年式: {item.year}
                    </p>
                  </div>
                  
                   {/* 3. 買取価格 */}
                   <div className="absolute bottom-0 w-full" style={{ height: '3.929rem', background: '#E6E6E6' }}>
                     <div className="h-full flex items-center" style={{ padding: '0 0.857rem' }}>
                       <span className="text-2xl font-bold">当社買取額：{item.price}万円</span>
                     </div>
                   </div>
                   
                   {/* 4. 高価買取マーク */}
                   <div 
                     className="absolute text-white font-bold flex items-center justify-center"
                     style={{
                       width: '5.143rem',
                       height: '5.143rem',
                       bottom: '0.857rem',
                       right: '0',
                       background: '#EA1313',
                       border: '0.143rem solid #666666',
                       borderRadius: '50%',
                       zIndex: 10,
                       fontSize: '1.428rem',
                       textAlign: 'center',
                       lineHeight: '1.2'
                     }}
                   >
                     高価<br />買取
                   </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4 font-bold">
            当社買取実績の一部です。年式が古い・状態が悪い車両でも買取価格に自信があります。
          </p>
          <p className="text-lg font-bold">お気軽に是非一度ご相談ください。</p>
        </div>
      </div>
    </section>
  )
}

// 3. 査定依頼セクション
const AssessmentRequestSection = () => (
  <section 
    className="h-[26.857rem] text-white"
    style={{ background: '#CCCCCC' }}
  >
    <div className="container mx-auto px-4">
        {/* 見出しと小見出しの横並び配置 */}
       <div className="flex justify-center items-start" style={{ paddingTop: '7.143rem', gap: '9.35rem' }}>
         {/* 見出し（左） */}
         <div>
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
               CONTACT
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
               LINEで査定依頼
             </div>
           </div>
         </div>

         {/* 小見出しと問い合わせ（右） */}
         <div className="text-center">
           <p className="text-[1.143rem] font-bold mb-[1.714rem] text-black">車両の査定 / 売却を検討されている方は、まずはLINEでお問い合わせください。</p>
           
           <p className="text-[1.143rem] font-bold mb-[1.714rem] text-black">\ 車検証や車両画像で簡単に査定額が判明します /</p>
           
           {/* 買取査定フォームと電話番号の横並び配置 */}
           <div className="flex justify-center gap-[2.857rem]">
             {/* 買取査定フォーム（左） */}
             <Link href="/contact">
               <div 
                 className="h-[3.214rem] flex items-center justify-center rounded-lg px-6 whitespace-nowrap"
                 style={{
                   background: 'linear-gradient(180deg, #1154AF 0%, #053B65 100%)',
                   boxShadow: '2px 2px 2px 0px #00000040'
                 }}
               >
                 <span className="text-[1.429rem] font-bold text-white">LINEで査定を依頼する</span>
                 <span className="text-[1.429rem] font-bold text-white">&nbsp;&gt;</span>
               </div>
             </Link>
             
             {/* 電話番号セクション（右） */}
             <div>
               <div className="h-[3.214rem] flex items-center bg-white border-2 border-blue-600 rounded-lg px-6 mb-2 whitespace-nowrap">
                 <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                 </svg>
                 <span className="text-[1.429rem] font-bold text-blue-600">028-612-1472</span>
               </div>
               <p className="text-sm text-gray-700">（受付時間）08:00~17:00</p>
             </div>
           </div>
         </div>
       </div>
    </div>
  </section>
)

 // 4. 選ばれる理由セクション
 const ReasonSection = () => (
   <section className="py-16" style={{ display: 'flex', justifyContent: 'center' }}>
     <div style={{ width: '70%', maxWidth: '1000px', padding: 0 }}>
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
              REASON
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
              ノアコーポレーションの買取査定の特徴
            </div>
          </div>
        </div>

        {/* 強み1 */}
          <div className="w-full mb-12">
           <div className="flex items-center" style={{ gap: '4.2%' }}>
            <div className="w-[50%] self-stretch">
              <div className="w-full h-full overflow-hidden" style={{ margin: 0 }}>
                <Image
                  src="/1st_strengths.jpg"
                  alt="自社で再生、直販するから高値で買える"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                  style={{ margin: 0 }}
                />
              </div>
            </div>
           <div className="w-[45.8%]">
             <div className="text-center mb-4">
             </div>
             <div className="text-center mb-4">
               <h3 className="text-[2.428rem] text-[#666666] font-bold">LINEですぐに金額判明</h3>
             </div>
             <div className="text-center">
               <p className="text-[1rem] text-[#666666] leading-relaxed">
               当社ではLINEによるスピード買取に挑戦しております。<br />既存のお問い合わせ→日程調整→現社確認→査定額提示という手順を<br />すべてLINEで行う事により、<br />どこよりも早く査定金額を知ることができます。
               </p>
             </div>
           </div>
         </div>
       </div>

        {/* 強み2 */}
          <div className="w-full mb-12">
           <div className="flex items-center" style={{ gap: '4.2%' }}>
            <div className="w-[45.8%]">
              <div className="text-center mb-4">
              </div>
              <div className="text-center mb-4">
                <h3 className="text-[2.428rem] text-[#666666] font-bold">全国どこでもOK!!<br />不動車 / 事故車でも買取OK!!</h3>
              </div>
              <div className="text-center">
                <p className="text-[1rem] text-[#666666] leading-relaxed">
                ノアコーポレーションではLINEでの買取を行っておりますので、<br />全国どこでも、どんな状態の車両でも買取させていただきます。<br />買取実施には、まずはLINEよりお気軽にお問い合わせくださいませ。
                </p>
              </div>
            </div>
               <div className="w-[50%] self-stretch" style={{ margin: 0 }}>
                <div className="w-full h-full overflow-hidden" style={{ margin: 0 }}>
                  <Image
                    src="/2nd_strengths.jpg"
                    alt="熟練の買取査定士によるスピード査定"
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                    style={{ margin: 0 }}
                  />
                </div>
              </div>
          </div>
        </div>

        {/* 強み3 */}
          <div className="w-full mb-12">
          <div className="flex items-center" style={{ gap: '4.2%' }}>
                      <div className="w-[50%] self-stretch">
              <div className="w-full h-full overflow-hidden" style={{ margin: 0 }}>
                <Image
                  src="/3rd_strengths.jpg"
                  alt="お客様の面倒は一切なし。スムーズなお取引"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                  style={{ margin: 0 }}
                />
              </div>
            </div>
                      <div className="w-[45.8%]">
              <div className="text-center mb-4">
              </div>
              <div className="text-center mb-4">
                <h3 className="text-[2.428rem] text-[#666666] font-bold">当社に決めていただければ<br />面倒な手続きは一切なし。</h3>
              </div>
              <div className="text-center">
                <p className="text-[1rem] text-[#666666] leading-relaxed">
                当社ノアコーポレーションに売却を決めていただけましたら、<br />引上げ及びその後の書類手続きなど<br />すべて弊社で代行させていただきます。また、会社名や会社カラーなども当社の責任をもって対応させいただきます。
                </p>
              </div>
            </div>
         </div>
       </div>
    </div>
  </section>
)


// 5. FAQセクション
const FAQSection = () => (
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
            LINEで査定のよくあるご質問
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
                  flex: 1,
                  fontFamily: "Noto Sans JP, sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "1.429rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#1A1A1A",
                  display: "flex",
                  alignItems: "center"
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
                   alignItems: "flex-start",
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
)



// 6. ドキュメントセクション
const DocumentSection = () => (
  <section className="py-16" style={{background: '#E6E6E6'}}>
    <div className="container mx-auto px-4">
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
            DOCUMENT
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
            ご売却に必要な書類
          </div>
        </div>
      </div>

      <div className="w-[69.4%] max-w-[1000px] mx-auto">
        <div className="text-center mb-6">
          <p className="text-[1.143rem] font-bold mb-4">ダウンロードはこちら</p>
          <div className="flex justify-center gap-[2.286rem]">
                         <Button 
               variant="outline"
               className="text-[1.143rem] font-bold text-white"
               style={{
                 background: '#666666',
                 width: '200px',
                 height: '40px'
               }}
               onClick={() => {
                 try {
                   const link = document.createElement('a');
                   link.href = '/transfer-certificate.pdf';
                   link.download = '譲渡証明書.pdf';
                   link.target = '_blank';
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
                 } catch (error) {
                   console.error('PDFダウンロードエラー:', error);
                   alert('PDFのダウンロードに失敗しました。');
                 }
               }}
             >
               譲渡証明書PDF
               <Download className="w-4 h-4 ml-2" />
             </Button>
                         <Button 
               variant="outline"
               className="text-[1.143rem] font-bold text-white"
               style={{
                 background: '#666666',
                 width: '200px',
                 height: '40px'
               }}
               onClick={() => {
                 try {
                   const link = document.createElement('a');
                   link.href = '/power-of-attorney.pdf';
                   link.download = '委任状.pdf';
                   link.target = '_blank';
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
                 } catch (error) {
                   console.error('PDFダウンロードエラー:', error);
                   alert('PDFのダウンロードに失敗しました。');
                 }
               }}
             >
               委任状PDF
               <Download className="w-4 h-4 ml-2" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// 7. お問い合わせセクション
const ContactSection = () => (
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
                  028-612-1472
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
)

// ============================================================================
// メインコンポーネント
// ============================================================================

export default function PurchasePage() {
  const [formData, setFormData] = useState({
    maker: "",
    model: "",
    type: "",
    year: "",
    mileage: "",
    transmission: "",
    address: "",
    name: "",
    phone: "",
    email: "",
    privacy: false
  })
  
  const [achievements, setAchievements] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.privacy) {
      alert("個人情報の取り扱いに同意してください。")
      return
    }
  }

  // SOLD OUT車両を取得して買取実績として表示
  useEffect(() => {
    const fetchSoldOutVehicles = async () => {
      try {
        setLoading(true)
        const soldOutVehicles = await getSoldOutVehicles(3)
        setAchievements(soldOutVehicles)
      } catch (error) {
        console.error("SOLD OUT車両の取得に失敗:", error)
        setAchievements([])
      } finally {
        setLoading(false)
      }
    }

    fetchSoldOutVehicles()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* 1. キャッチコピー */}
      <HeroSection />
      
      {/* 2. 買取実績 */}
      <AchievementSection achievements={achievements} loading={loading} />
      
      {/* 3. 査定依頼 */}
      <AssessmentRequestSection />
      
      {/* 4. 選ばれる理由 */}
      <ReasonSection />
      
      {/* 5. FAQ */}
      <FAQSection />
      
      {/* 6. ドキュメント */}
      <DocumentSection />
      
      {/* 7. お問い合わせ */}
      <ContactSection />
    </div>
  )
}
