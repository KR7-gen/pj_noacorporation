"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Upload, Download } from "lucide-react"
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
            fontSize: '1.714rem',
            lineHeight: '100%',
            letterSpacing: '0%',
            left: '7.5rem',
            top: '8.929rem'
          }}
        >
          (テキスト)トラック買取
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
              fontSize: '1.714rem',
              lineHeight: '100%',
              letterSpacing: '0%',
              transform: 'skewX(20deg)'
            }}
          >
            キャッチコピー!!
          </h2>
        </div>
        
        {/* 2. 買取における強み */}
        <div className="absolute" style={{ left: '14.286rem', top: '28.429rem' }}>
          <div 
            className="bg-blue-600 text-white rounded mb-5"
            style={{
              padding: '0.857rem',
              marginBottom: '1.429rem'
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
              高額査定
            </span>
          </div>
          <div 
            className="bg-blue-600 text-white rounded mb-5"
            style={{
              padding: '0.857rem',
              marginBottom: '1.429rem'
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
              スピード査定
            </span>
          </div>
          <div 
            className="bg-blue-600 text-white rounded"
            style={{
              padding: '0.857rem'
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
              書類手続きはすべて代行
            </span>
          </div>
        </div>
      </div>
      
      {/* 右側エリア（問い合わせフォーム） */}
              <div className="absolute" style={{ left: '63rem', bottom: '8.786rem' }}>
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
              \ 簡単5分!車両情報入力で査定額が分かります! /
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
                買取査定フォーム &nbsp;&gt;
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
        <div className="text-center mb-12">
          <div className="inline-block text-left">
            <h2 
              className="mb-4" 
              style={{ 
                fontSize: '1rem', 
                fontWeight: 400,
                color: '#2B5EC5'
              }}
            >
              ACHIEVEMENT
            </h2>
            <p 
              className="font-bold" 
              style={{ 
                fontSize: '2.857rem', 
                color: '#1a1a1a'
              }}
            >
              当社買取実績
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-1 mb-8" style={{ gap: '0.286rem' }}>
          {loading ? (
            // ローディング中はデフォルトの表示
            defaultAchievements.map((item, index) => (
              <Card key={index} className="text-center relative overflow-hidden" style={{ width: '20.8%', height: '27.643rem' }}>
                <CardContent className="p-0 h-full">
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
                  <div className="absolute bottom-0 w-full" style={{ height: '3.929rem', background: '#E6E6E6', margin: '0.857rem' }}>
                    <div className="px-3 h-full flex items-center" style={{ padding: '0 0.857rem' }}>
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
                      zIndex: 10
                    }}
                  >
                    高価買取
                  </div>
                </CardContent>
              </Card>
            ))
          ) : achievements.length > 0 ? (
            // 実際のSOLD OUT車両データを表示
            achievements.map((vehicle, index) => {
              const purchasePrice = calculatePurchasePrice(vehicle.totalPayment || 0)
              const japaneseYear = convertYearToJapaneseEra(vehicle.year)
              const vehicleName = `${vehicle.maker || ""} ${vehicle.vehicleType || ""}`.trim()
              
              return (
                <Card key={vehicle.id} className="text-center relative overflow-hidden" style={{ width: '20.8%', height: '27.643rem' }}>
                  <CardContent className="p-0 h-full">
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
                    <div className="absolute bottom-0 w-full" style={{ height: '3.929rem', background: '#E6E6E6', margin: '0.857rem' }}>
                      <div className="px-3 h-full flex items-center" style={{ padding: '0 0.857rem' }}>
                        <span className="text-2xl font-bold">
                          当社買取額：{Math.floor(purchasePrice / 10000)}万円
                        </span>
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
                        zIndex: 10
                      }}
                    >
                      高価買取
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            // データがない場合はデフォルト表示
            defaultAchievements.map((item, index) => (
              <Card key={index} className="text-center relative overflow-hidden" style={{ width: '20.8%', height: '27.643rem' }}>
                <CardContent className="p-0 h-full">
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
                  <div className="absolute bottom-0 w-full" style={{ height: '3.929rem', background: '#E6E6E6', margin: '0.857rem' }}>
                    <div className="px-3 h-full flex items-center" style={{ padding: '0 0.857rem' }}>
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
                      zIndex: 10
                    }}
                  >
                    高価買取
                  </div>
                </CardContent>
              </Card>
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
      <div className="flex justify-between items-start" style={{ paddingTop: '7.143rem' }}>
        {/* 見出し（左） */}
        <div style={{ marginLeft: '20rem' }}>
          <h2
            className="mb-4"
            style={{
              fontSize: '1rem',
              fontWeight: 400,
              color: '#2B5EC5'
            }}
          >
            CONTACT
          </h2>
          <p
            className="font-bold"
            style={{
              fontSize: '2.857rem',
              color: '#1a1a1a'
            }}
          >
            査定依頼
          </p>
        </div>

        {/* 小見出しと問い合わせ（右） */}
        <div className="text-center" style={{ marginLeft: 'auto', marginRight: '15rem' }}>
          <p className="text-[1.143rem] font-bold mb-[1.714rem] text-black">査定をご希望の方、ご売却を検討されている方は下記よりご連絡ください。</p>
          
          <p className="text-[1.143rem] font-bold mb-[1.714rem] text-black">\ 車輌情報入力で査定額が分かります！査定申込も受付！ /</p>
          
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
                <span className="text-[1.429rem] font-bold text-white">買取査定フォーム</span>
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
              <p className="text-sm text-gray-700">（受付時間）年中無休 09:00~17:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// 4. 選ばれる理由セクション
const ReasonSection = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center">
        <div className="w-[69.4%] max-w-[1000px] relative">
          <div className="text-center pt-[2.5rem]">
            <p className="text-[2.571rem] font-bold text-[#1a1a1a] mb-4">トラック買取で当社が選ばれる理由</p>
          </div>
          <h2 className="text-[1rem] font-normal text-[#2B5EC5] absolute top-0" style={{left: '50%', transform: 'translateX(-50%)', width: 'fit-content', marginLeft: '-18rem'}}>REASON</h2>
        </div>
      </div>

      {/* 強み1 */}
      <div className="w-[69.4%] max-w-[1000px] mx-auto mb-12">
        <div className="flex gap-8 items-center">
          <div className="w-[50%] self-stretch">
            <div className="w-full h-full overflow-hidden">
              <Image
                src="/1st_strengths.jpg"
                alt="自社で再生、直販するから高値で買える"
                width={500}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-[45.8%]">
            <div className="text-center mb-4">
              <p className="text-[1.286rem] text-[#666666] whitespace-nowrap">
                📝 独自の査定基準！他社様と比べてみてください
              </p>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-[2.428rem] text-[#666666] font-bold">自社で再生、直販するから高値で買える！</h3>
            </div>
            <div className="text-center">
              <p className="text-[1rem] text-[#666666] leading-relaxed">
                当社は、お客様からお預かりしたトラックを自社で整備・再生し、仲介業者を通さずに直接再販売しています。<br />そのため、他社様とは異なる査定基準を持っており、相場よりも高く中古トラックを買い取ることが可能になっています。1円でも高く買い取ってほしい･･･そんなお客様の想いに、精一杯お応えさせていただきます！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 強み2 */}
      <div className="w-[69.4%] max-w-[1000px] mx-auto mb-12">
        <div className="flex gap-8 items-center">
          <div className="w-[45.8%]">
            <div className="text-center mb-4">
              <p className="text-[1.286rem] text-[#666666]">
                📝 車検切れ・不動車もOK！どんな車輛にも対応
              </p>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-[2.428rem] text-[#666666] font-bold">熟練の買取査定士によるスピード査定！</h3>
            </div>
            <div className="text-center">
              <p className="text-[1rem] text-[#666666] leading-relaxed">
                査定を対応するのは、これまで10,000台を超える中古トラックを買い付けてきたトラック買取のエキスパートが率いる査定専門チーム。<br />どんなタイプの車輛でも、高く買取できるポイントを見極めて査定いたします。故障で動かなくなった状態のトラックでも、まずは一度ご相談ください！<br />また、実車査定にお伺いする前の段階でも、フォームから車輛情報を入力・写真をお送りいただければ、目安となる買取金額を1営業日以内にご回答いたします。
              </p>
            </div>
          </div>
          <div className="w-[50%] self-stretch">
            <div className="w-full h-full overflow-hidden">
              <Image
                src="/2nd_strengths.jpg"
                alt="熟練の買取査定士によるスピード査定"
                width={500}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 強み3 */}
      <div className="w-[69.4%] max-w-[1000px] mx-auto mb-12">
        <div className="flex gap-8 items-center">
          <div className="w-[50%] self-stretch">
            <div className="w-full h-full overflow-hidden">
              <Image
                src="/3rd_strengths.jpg"
                alt="お客様の面倒は一切なし。スムーズなお取引"
                width={500}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-[45.8%]">
            <div className="text-center mb-4">
              <p className="text-[1.286rem] text-[#666666]">
                📝 書類手続きは当社にお任せ！<br />
                即時振り込み・現金支払いも可能
              </p>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-[2.428rem] text-[#666666] font-bold whitespace-nowrap">お客様の面倒は一切なし。<br />スムーズなお取引！</h3>
            </div>
            <div className="text-center">
              <p className="text-[1rem] text-[#666666] leading-relaxed">
                車の売却にあたって避けられない煩わしい書類手続き。お忙しいお客様に代わって、弊社が代行処理いたします。トラックの売却・譲渡がはじめてのお客様も安心してお任せください。<br />取引後の社名消しや、車輛の引き渡しお支払い方法など、お客様のご要望に合わせて迅速に対応させていただきます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// 5. お客様の声セクション
const ReviewSection = () => {
  const [reviewMarginLeft, setReviewMarginLeft] = useState('-4rem');

  return (
    <section className="py-16" style={{background: '#F2F2F2'}}>
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center">
          <div className="w-[69.4%] max-w-[1000px] relative">
            <div className="text-center pt-[2.5rem]">
              <p className="text-[2.571rem] font-bold text-[#1a1a1a] mb-4">お客様の声</p>
            </div>
            <h2 className="text-[1rem] font-normal text-[#2B5EC5] absolute top-0" style={{left: '50%', transform: 'translateX(-50%)', width: 'fit-content', marginLeft: reviewMarginLeft}}>REVIEW</h2>
          </div>
          
          {/* 位置調整用の入力フィールド */}
          <div className="mt-4 flex items-center gap-2 hidden">
            <label className="text-sm font-medium">REVIEW位置調整:</label>
            <input
              type="number"
              value={parseFloat(reviewMarginLeft)}
              onChange={(e) => setReviewMarginLeft(`${e.target.value}rem`)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              step="0.1"
            />
            <span className="text-sm text-gray-500">rem</span>
          </div>
        </div>

      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-5 justify-center">
          {reviews.map((review, index) => (
            <Card key={index} className="border-0 shadow-lg w-[20vw] h-29">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex">
                  <div className="w-1/2">
                    <img 
                      src={`/review${review.reviewNumber}.jpg`}
                      alt={`Review ${review.reviewNumber}`}
                      className="w-full h-full object-cover object-center"
                      style={{ objectPosition: review.reviewNumber === '03' ? '50% 50%' : '10% 50%' }}
                      onError={(e) => {
                        console.error(`Failed to load image: /review${review.reviewNumber}.jpg`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-left w-1/2 pl-[0.86rem] flex flex-col gap-1 p-[0.29rem]">
                    <div className="text-[1rem] font-bold">当社買取価格</div>
                    <div className="text-[3.43rem] font-bold text-[#2B5EC5] border-b-4 border-[#2B5EC5] pb-0 leading-none">
                      {review.price}<span className="text-[1.43rem]">万円</span>
                    </div>
                    <div className="text-[1rem] font-bold">{review.truck}</div>
                    <div className="text-[0.86rem] font-normal">{review.location}</div>
                    <div className="text-[0.86rem] font-normal">{review.customer}</div>
                  </div>
                </div>

                <div className="mt-[1.14rem] mb-4 px-[1.71rem] flex-1">
                  <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                <div className="text-right mb-[1rem] mt-auto">
                  <span className="text-sm text-gray-500">/ Review {review.reviewNumber}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
  )
}

// 6. 問い合わせフォームセクション
const ContactFormSection = () => (
  <section className="py-16 FFFFFF">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <ContactForm />
      </div>
    </div>
  </section>
)

// 7. ドキュメントセクション
const DocumentSection = () => (
  <section className="py-16" style={{background: '#E6E6E6'}}>
    <div className="container mx-auto px-4">
      <div className="mb-12 flex flex-col items-center">
        <div className="w-[69.4%] max-w-[1000px] relative">
          <div className="text-center pt-[2.5rem]">
            <p className="text-[1.714rem] font-bold text-[#1a1a1a] mb-4">ご売却に必要な書類</p>
          </div>
          <h2 className="text-[1rem] font-normal text-[#2B5EC5] absolute top-0" style={{left: '50%', transform: 'translateX(-50%)', width: 'fit-content', marginLeft: '-4.7rem'}}>DOCUMENT</h2>
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
              <Download className="w-4 h-4 mr-2" />
              譲渡証明書PDF
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
              <Download className="w-4 h-4 mr-2" />
              委任状PDF
            </Button>
          </div>
        </div>
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
      
      {/* 5. お客様の声 */}
      <ReviewSection />
      
      {/* 6. 問い合わせフォーム */}
      <ContactFormSection />
      
      {/* 7. ドキュメント */}
      <DocumentSection />
    </div>
  )
}
