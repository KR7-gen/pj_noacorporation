"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin, PhoneCall, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const companyInfo = {
  name: "株式会社 Noa Corporation",
  established: "2009年",
  capital: "000万円",
  address: "〒329-1326　栃木県さくら市向河原3994-1",
  phone: "028-612-1474",
  fax: "028-612-1471",
  hours: "08:00~17:00 年中無休",
  business: "中古トラック販売・トラック買取・中古重機各種取扱い",
  license: "第411220001786号",
}

const members = [
  {
    name: "代表　谷口",
    role: "代表取締役",
    description:
      '見た目は今どき？！中身は職人その名も代表谷口‼️\nやってみないとお客さんと対等に話せないと思い、小さい頃から働く車が大大大好き過ぎて仕事でダンプ屋さんもレッカー屋さんもやっちゃいました笑\n触れた車は数知れず売った車も数知れず\n座右の銘はお馴染みの名台詞\n「私失敗しないので」\nを掲げて失敗しない車選びを全力でサポート致します🫡\nちなみに365日24時間熱い漢です‼️‼️',
  },
  {
    name: "番頭　山田",
    role: "取締役",
    description:
      "困った時の必殺技は４次元ポケット\nトラック界のドラえもん🐖\nその名も山田大輔‼️\nしょうがないな〜のび太くんばりにお客様の要望をすぐ解決🤞\n社長と一緒にダンプ屋さんもレッカー屋さんもやって働く車に触れてきました😀\n心も身体も熱い漢、山田大輔を宜しくお願いします😀",
  },
  {
    name: "営業　中村",
    role: "入庫検査担当",
    description:
      "お客様の欲しいトラックを見抜く、\n見た目は子供、頭脳はトラックマイスター\n\nその名も名探偵中村\n\n真実はいつもひとつ！\nお客様のお探しの車両を探偵の様にお探しして事件と同じく解決しちゃいます",
  },
]

// メンバーを役職別にグループ化
const memberGroups = {
  representative: members.filter(member => member.role === "代表取締役"),
  director: members.filter(member => member.role === "取締役"),
  employees: members.filter(member => member.role !== "代表取締役" && member.role !== "取締役"),
}

export default function AboutPage() {
  const router = useRouter();
  const renderWithLineBreaks = (text: string) => {
    const parts = String(text).split("\n");
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 ? <br /> : null}
      </span>
    ));
  };

  return (
    <div className="about-page min-h-screen bg-white" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* About Us Hero Section */}
      <section 
        style={{
          width: "100vw",
          maxWidth: "100vw",
          opacity: 1,
          backgroundImage: "url('/sub_background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          margin: 0,
          padding: 0,
          overflow: "hidden"
        }}
      >
        {/* Gradient Overlay（背景に戻す） */}
        <div 
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            background: "linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, rgba(255, 255, 255, 0) 100%)",
            zIndex: 1
          }}
        />
        <h1 
          style={{
            width: "23.929rem",
            fontSize: "3.429rem",
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 700,
            fontStyle: "bold",
            lineHeight: "100%",
            letterSpacing: 0,
            color: "white",
            textShadow: "0.286rem 0.286rem 0.286rem #0000004D",
            opacity: 1,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent"
          }}
        >
          私たちについて
        </h1>
      </section>

      {/* Responsive overrides for smartphone */}
      <style jsx>{`
        .sp-only-br { display: none; }
        @media (max-width: 640px) {
          .about-page > section { margin-top: 0 !important; padding-left: 1.143rem !important; padding-right: 1.143rem !important; }
          .about-page > section + section { margin-top: 1.5rem !important; }
          .company-section { padding-left: 1.143rem !important; padding-right: 1.143rem !important; padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .company-title { font-size: 2rem !important; }
          .company-card { width: 100% !important; max-width: 100% !important; height: auto !important; margin: 0 auto !important; }
          .company-card > div > div { flex-direction: column !important; align-items: flex-start !important; }
          .company-card > div > div > span:first-child { width: 100% !important; margin: 0 0 0.571rem 0 !important; }
          .company-card > div > div > span:last-child { margin-left: 0 !important; width: 100% !important; white-space: normal !important; }
          .features-section { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; padding-left: 1.143rem !important; padding-right: 1.143rem !important; }
          .features-title { font-size: 2rem !important; white-space: normal !important; }
          .features-container { width: 100% !important; max-width: 100% !important; }
          .feature-heading { white-space: nowrap !important; }
          .example-row { flex-direction: column !important; margin-left: -2rem !important; margin-right: -2rem !important; width: calc(100% + 4rem) !important; }
          .example-row > div:not(.example-arrow) { width: 100% !important; }
          .example-arrow { width: 2rem !important; height: 2rem !important; flex: 0 0 auto !important; align-self: center; }
          .example-arrow svg { transform: rotate(90deg); }
          .sp-only-br { display: inline; }
          .feature-card { width: 100% !important; overflow: hidden; }
          .feature-card p { overflow-wrap: anywhere; word-break: break-word; }
          .members-section { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .members-section { width: 100% !important; max-width: 100% !important; padding-left: 1.143rem !important; padding-right: 1.143rem !important; }
          .members-title { font-size: 2rem !important; white-space: normal !important; }
          .member-row { flex-direction: column !important; height: auto !important; gap: 1rem !important; }
          .member-row .member-photo { order: 1; width: 100% !important; height: auto !important; min-height: 12rem; }
          .member-row .member-text { order: 2; width: 100% !important; }
          .employees-grid { flex-direction: column !important; align-items: stretch !important; position: static !important; gap: 1rem !important; width: 100% !important; }
          :global(.member-employee-card) { width: 100% !important; position: static !important; left: auto !important; transform: none !important; display: block !important; }
          .access-section { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .access-section .access-inner { width: 100% !important; max-width: 100% !important; }
          .contact-section { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .about-page > .contact-section { padding-left: 0 !important; padding-right: 0 !important; }
          .contact-inner { padding-left: 1.143rem !important; padding-right: 1.143rem !important; }
          .access-title { font-size: 2rem !important; white-space: normal !important; }
          /* widen contact cards on mobile */
          .contact-cards-container { grid-template-columns: 1fr !important; width: 100% !important; max-width: 100% !important; }
          .contact-phone-card, .contact-form-card, .contact-purchase-card { width: 100% !important; }
          .contact-purchase-container { width: 100% !important; }
        }
      `}</style>

      {/* Company Info */}
      <section 
        className="company-section"
        style={{
          width: "100%",
          maxWidth: "100vw",
          gap: "2.857rem",
          opacity: 1,
          paddingTop: "2rem",
          paddingBottom: "2rem",
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
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ marginBottom: "2.857rem", display: "flex", justifyContent: "center" }}>
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div className="company-title"
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
                会社情報
              </div>
            </div>
          </div>

          {/* カードの枠を削除し、内容だけ表示 */}
          <div className="company-card" style={{ width: "55%",  opacity: 1, margin: "0 auto",marginBottom:"5rem", }}>
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.143rem"
              }}
            >
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>会社名</span>
                 <span style={{
                   width: "auto",
                   minWidth: 0,
                   height: "1.357rem",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 400,
                   fontStyle: "normal",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   color: "#1A1A1A",
                   opacity: 1,
                   textAlign: "left",
                   display: "flex",
                   alignItems: "center",
                   whiteSpace: "nowrap",
                   marginLeft: "14rem"
                 }}>{companyInfo.name}</span>
               </div>
                <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>設立年月</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.established}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>資本金</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.capital}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>所在地</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.address}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>電話番号</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.phone}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>FAX番号</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.fax}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>営業時間</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.hours}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>事業内容</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.business}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>古物法に基づく表示</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.license}</span>
               </div>
                <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "1.142rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>適格請求書（インボイス）<br/>発行事業者登録番号</span>
                 <span style={{ marginLeft: "14rem" }}>T5060001025151</span>
               </div>
                <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "10%",
                   height: "1.643rem",
                   color: "#1a1a1a",
                   fontFamily: "'Noto Sans JP', sans-serif",
                   fontWeight: 700,
                   fontStyle: "bold",
                   fontSize: "1.143rem",
                   lineHeight: "100%",
                   letterSpacing: 0,
                   opacity: 1,
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   borderRadius: "0.286rem",
                   textAlign: "left",
                   whiteSpace: "nowrap"
                 }}>加盟協会</span>
                 <span style={{ marginLeft: "14rem" }}>JU・日本中古自動車販売協会連合会 / 自動車公正取引協議会</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ノアの特徴４選*/}
       <section 
         className="features-section"
         style={{
           width: "100%",
           maxWidth: "100vw",
           gap: "2.857rem",
           opacity: 1,
            paddingTop: "2rem",
           paddingRight: "2.857rem",
            paddingBottom: "2rem",
           paddingLeft: "2.857rem",
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
             justifyContent: "center",
             alignItems: "center"
           }}
         >
            <div style={{ marginBottom: "2.857rem", display: "flex", justifyContent: "center" }}>
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div 
                  className="features-title"
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
                  ノアコーポレーションの<span className="sp-only-br"><br/></span>特徴4点
                </div>
              </div>
            </div>

           <div className="features-container" style={{
              width: "60%",
              opacity: 1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "1.143rem",
              lineHeight: "1.8",
              letterSpacing: 0,
              color: "#1A1A1A",
              textAlign: "left",
              margin: "0 auto 2.286rem auto"
            }}>

              {/* 特徴1 */}
               <div className="feature-card" style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                <h3 className="feature-heading" style={{
                   fontSize: "1.429rem",
                   fontWeight: "700",
                   color: "#1a1a1a",
                   marginBottom: "1rem",
                   display: "flex",
                   alignItems: "center",
                   gap: "0.571rem"
                 }}>
                  <span style={{
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    width: "1.714rem",
                    height: "1.714rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "700"
                  }}>1</span>
                  ユーザーからの直接仕入れ
                </h3>
                <p style={{
                  fontSize: "1.143rem",
                  lineHeight: "1.8",
                  color: "#1A1A1A",
                  margin: 0
                }}>
                  当社では、ユーザーからのLINEで査定などによるユーザー買取を行った車両を国家資格である2級自動車整備士を持った従業員が丹念に車両の確認を行い、次のオーナー様が気持ちよく利用できるように整備し、業界最安値を目指した価格で販売させていただいております。
                </p>
              </div>

              {/* 特徴2 */}
               <div className="feature-card" style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                <h3 className="feature-heading" style={{
                   fontSize: "1.429rem",
                   fontWeight: "700",
                   color: "#1a1a1a",
                   marginBottom: "1rem",
                   display: "flex",
                   alignItems: "center",
                   gap: "0.571rem"
                 }}>
                  <span style={{
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    width: "1.714rem",
                    height: "1.714rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "700"
                  }}>2</span>
                  自社塗装施設を完備
                </h3>
                <p style={{
                  fontSize: "1.143rem",
                  lineHeight: "1.8",
                  color: "#1A1A1A",
                  margin: "0 0 1.5rem 0"
                }}>
                  当社では、自社による塗装設備を保有しておりますので、車は気に入ったけど色が気に入らないと言ったような場合にも自社でご希望の色に塗装させていただきます。
                </p>
                
                {/* 塗装事例画像 */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                  marginTop: "1.5rem",
                  width: "100%"
                }}>
                  {/* 1行目：1番目の事例 */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%"
                  }}>
                    <h4 style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      textAlign: "center",
                      margin: "0 0 0.5rem 0"
                    }}>
                      塗装事例 1
                    </h4>
                    <div className="example-row" style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%"
                    }}>
                      {/* Before */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #666666"
                        }}>
                          <img 
                            src="/1_before_painting_examples.JPG"
                            alt="塗装前の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            backgroundColor: "#666666",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            BEFORE
                          </div>
                        </div>
                      </div>
                      
                      {/* 矢印 */}
                      <div className="example-arrow" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "2rem",
                        height: "2rem",
                        background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                        borderRadius: "50%",
                        flexShrink: 0
                      }}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: "white"
                          }}
                        >
                          <path
                            d="M8 4L16 12L8 20"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      
                      {/* After */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #1154AF",
                          background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                          backgroundClip: "padding-box"
                        }}>
                          <img 
                            src="/1_after_painting_examples.JPG"
                            alt="塗装後の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "bottom"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            AFTER
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2行目：2番目の事例 */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%"
                  }}>
                    <h4 style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      textAlign: "center",
                      margin: "0 0 0.5rem 0"
                    }}>
                      塗装事例 2
                    </h4>
                    <div className="example-row" style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%"
                    }}>
                      {/* Before */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #666666"
                        }}>
                          <img 
                            src="/2_before_painting_examples.JPG"
                            alt="塗装前の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            backgroundColor: "#666666",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            BEFORE
                          </div>
                        </div>
                      </div>
                      
                      {/* 矢印 */}
                      <div className="example-arrow" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "2rem",
                        height: "2rem",
                        background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                        borderRadius: "50%",
                        flexShrink: 0
                      }}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: "white"
                          }}
                        >
                          <path
                            d="M8 4L16 12L8 20"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      
                      {/* After */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #1154AF",
                          background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                          backgroundClip: "padding-box"
                        }}>
                          <img 
                            src="/2_after_painting_examples.JPG"
                            alt="塗装後の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            AFTER
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 特徴3 */}
               <div className="feature-card" style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                <h3 className="feature-heading" style={{
                   fontSize: "1.429rem",
                   fontWeight: "700",
                   color: "#1a1a1a",
                   marginBottom: "1rem",
                   display: "flex",
                   alignItems: "center",
                   gap: "0.571rem"
                 }}>
                  <span style={{
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    width: "1.714rem",
                    height: "1.714rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "700"
                  }}>3</span>
                  自社による上物載せ替え可能
                </h3>
                <p style={{
                  fontSize: "1.143rem",
                  lineHeight: "1.8",
                  color: "#1A1A1A",
                  margin: "0 0 1.5rem 0"
                }}>
                  当社では、熟練したメンバーにより多くの車両を自社で載せ替えし、生まれ替えさせてきました。平ボディーからクレーン付き、アルミバンから二輪車用積載車。など多くの載せ替えを実施しております。
                </p>
                
                {/* 載せ替え事例画像 */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                  marginTop: "1.5rem",
                  width: "100%"
                }}>
                  {/* 1行目：1番目の事例 */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%"
                  }}>
                    <h4 style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      textAlign: "center",
                      margin: "0 0 0.5rem 0"
                    }}>
                      載せ替え事例 1
                    </h4>
                    <div className="example-row" style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%"
                    }}>
                      {/* Before */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #666666"
                        }}>
                          <img 
                            src="/1_before_replacing_examples.JPG"
                            alt="載せ替え前の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            backgroundColor: "#666666",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            BEFORE
                          </div>
                        </div>
                      </div>
                      
                      {/* 矢印 */}
                      <div className="example-arrow" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "2rem",
                        height: "2rem",
                        background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                        borderRadius: "50%",
                        flexShrink: 0
                      }}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: "white"
                          }}
                        >
                          <path
                            d="M8 4L16 12L8 20"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      
                      {/* After */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #1154AF",
                          background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                          backgroundClip: "padding-box"
                        }}>
                          <img 
                            src="/1_after_replacing_examples.JPG"
                            alt="載せ替え後の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "bottom"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            AFTER
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2行目：2番目の事例 */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%"
                  }}>
                    <h4 style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      textAlign: "center",
                      margin: "0 0 0.5rem 0"
                    }}>
                      載せ替え事例 2
                    </h4>
                    <div className="example-row" style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%"
                    }}>
                      {/* Before */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #666666"
                        }}>
                          <img 
                            src="/2_before_replacing_examples.JPG"
                            alt="載せ替え前の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "bottom"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            backgroundColor: "#666666",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            BEFORE
                          </div>
                        </div>
                      </div>
                      
                      {/* 矢印 */}
                      <div className="example-arrow" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "2rem",
                        height: "2rem",
                        background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                        borderRadius: "50%",
                        flexShrink: 0
                      }}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: "white"
                          }}
                        >
                          <path
                            d="M8 4L16 12L8 20"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      
                      {/* After */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        flex: "1"
                      }}>
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          border: "2px solid #1154AF",
                          background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                          backgroundClip: "padding-box"
                        }}>
                          <img 
                            src="/2_after_replacing_examples.JPG"
                            alt="載せ替え後の状態"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "bottom"
                            }}
                          />
                          <div style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            background: "linear-gradient(180deg, #1154AF 0%, #053B65 100%)",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            fontWeight: "600"
                          }}>
                            AFTER
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 特徴4 */}
               <div className="feature-card" style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                <h3 className="feature-heading" style={{
                   fontSize: "1.429rem",
                   fontWeight: "700",
                   color: "#1a1a1a",
                   marginBottom: "1rem",
                   display: "flex",
                   alignItems: "center",
                   gap: "0.571rem"
                 }}>
                  <span style={{
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    width: "1.714rem",
                    height: "1.714rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "700"
                  }}>4</span>
                  大手運送会社のグループ会社
                </h3>
                <p style={{
                  fontSize: "1.143rem",
                  lineHeight: "1.8",
                  color: "#1A1A1A",
                  margin: 0
                }}>
                  当社は、東京都江戸川区の株式会社 スワローロジスティクス ( https://www.swallowgroup.jp/corporation/ ) の一員でございます。法令順守の運送業の一員として弊社でも法令順守、安全第一での営業を行っております。ご利用いただくお客様も安心安全に当社サービスをご利用いただけると思います。車両の購入、売却、塗装、車両のご相談など、小さな事でも弊社にお気軽にお問い合わせ下さい。
                </p>
              </div>

            </div>
            
         </div>
       </section>

      {/* Member Section */}
      <section 
        className="members-section"
        style={{
          width: "56.53%",
          gap: "60px",
          opacity: 1,
          paddingTop: "2rem",
          paddingBottom: "2rem",
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
            justifyContent: "center",
            alignItems: "center"
          }}
        >
            <div style={{ marginBottom: "2.857rem", display: "flex", justifyContent: "center" }}>
             <div 
               style={{
                 display: "flex",
                 flexDirection: "column",
                 alignItems: "flex-start",
               }}
             >
              <div 
                className="members-title"
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
                 メンバー紹介
               </div>
             </div>
           </div>

            <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "48px",
              width: "100%",
              maxWidth: "1200px"
            }}
          >
            {/* 代表取締役セクション */}
            <div style={{ width: "100%" }}>
              <h3 style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                marginBottom: "24px",
                textAlign: "center",
                color: "#1a1a1a"
              }}>
              </h3>
              <div 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%"
                }}
              >
                {memberGroups.representative.map((member, index) => (
                  <div 
                    className="member-row"
                    key={index} 
                    style={{
                      width: "100%",
                      margin: "0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}
                  >
                    {/* 名前と説明（左の70.5%） */}
                    <div className="member-text" style={{
                      width: "70.5%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      padding: "0"
                    }}>
                      <h3 style={{ 
                        fontWeight: "bold", 
                        fontSize: "1.14rem", 
                        marginBottom: "0.57rem",
                        color: "#1a1a1a",
                        marginLeft: "0",
                        marginRight: "0"
                      }}>
                        {member.name}
                      </h3>
                      <p style={{ 
                        fontSize: "1.14rem", 
                        color: "#1a1a1a", 
                        lineHeight: "1.6",
                        marginLeft: "0",
                        marginRight: "0",
                        fontWeight: "400"
                      }}>
                        {renderWithLineBreaks(member.description)}
                      </p>
                    </div>
                    
                    {/* 写真（右の29.5%） */}
                    <div 
                      className="member-photo"
                      style={{
                        width: "29.5%",
                        height: "100%",
                        backgroundColor: "#808080",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1rem",
                        margin: "0"
                      }}
                    >
                      <img 
                        src="/member_ceo.jpg"
                        alt="代表取締役の写真"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 取締役セクション */}
            <div style={{ width: "100%" }}>
              <h3 style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                marginBottom: "24px",
                textAlign: "center",
                color: "#1a1a1a"
              }}>
              </h3>
              <div 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%"
                }}
              >
                {memberGroups.director.map((member, index) => (
                  <div 
                    className="member-row"
                    key={index} 
                    style={{
                      width: "100%",
                      margin: "0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}
                  >
                    {/* 名前と説明（左の70.5%） */}
                    <div className="member-text" style={{
                      width: "70.5%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      padding: "0"
                    }}>
                      <h3 style={{ 
                        fontWeight: "bold", 
                        fontSize: "1.14rem", 
                        marginBottom: "0.57rem",
                        color: "#1a1a1a",
                        marginLeft: "0",
                        marginRight: "0"
                      }}>
                        {member.name}
                      </h3>
                      <p style={{ 
                        fontSize: "1.14rem", 
                        color: "#1a1a1a", 
                        lineHeight: "1.6",
                        marginLeft: "0",
                        marginRight: "0",
                        fontWeight: "400"
                      }}>
                        {renderWithLineBreaks(member.description)}
                      </p>
                    </div>
                    
                    {/* 写真（右の29.5%） */}
                    <div 
                      className="member-photo"
                      style={{
                        width: "29.5%",
                        height: "100%",
                        backgroundColor: "#808080",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1rem",
                        margin: "0"
                      }}
                    >
                      <img 
                        src="/member_2nd.jpg"
                        alt="取締役の写真"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 社員セクション */}
            <div style={{ width: "100%" }}>
              <h3 style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                marginBottom: "24px",
                textAlign: "center",
                color: "#1a1a1a"
              }}>
              </h3>
              <div 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%"
                }}
              >
                {memberGroups.employees.map((member, index) => (
                  <div 
                    className="member-row"
                    key={index} 
                    style={{
                      width: "100%",
                      margin: "0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}
                  >
                    {/* 名前と説明（左の70.5%） */}
                    <div className="member-text" style={{
                      width: "70.5%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      padding: "0"
                    }}>
                      <h3 style={{ 
                        fontWeight: "bold", 
                        fontSize: "1.14rem", 
                        marginBottom: "0.57rem",
                        color: "#1a1a1a",
                        marginLeft: "0",
                        marginRight: "0"
                      }}>
                        {member.name}
                      </h3>
                      <p style={{ 
                        fontSize: "1.14rem", 
                        color: "#1a1a1a", 
                        lineHeight: "1.6",
                        marginLeft: "0",
                        marginRight: "0",
                        fontWeight: "400"
                      }}>
                        {renderWithLineBreaks(member.description)}
                      </p>
                    </div>
                    
                    {/* 写真（右の29.5%） */}
                    <div 
                      className="member-photo"
                      style={{
                        width: "29.5%",
                        height: "100%",
                        backgroundColor: "#808080",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1rem",
                        margin: "0"
                      }}
                    >
                      <img 
                        src="/member_3rd.png"
                        alt="入庫検査担当の写真"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section 
        id="access" 
        className="access-section"
        style={{
          width: "100%",
          paddingTop: "2rem",
          paddingBottom: "2rem",
          background: "#FFFFFF"
        }}
      >
        <div 
          className="access-inner"
          style={{
            width: "56%",
            margin: "0 auto"
          }}
        >
            <div style={{ marginBottom: "2.857rem", display: "flex", justifyContent: "center" }}>
             <div 
               style={{
                 display: "flex",
                 flexDirection: "column",
                 alignItems: "flex-start",
               }}
             >
              <div 
                className="access-title"
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
                 アクセス
               </div>
             </div>
           </div>

          <div 
            style={{
              width: "100%",
              height: "22.36rem",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "32px"
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3210.8543762615753!2d139.99547797635924!3d36.51745839711242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601f4b5a0e8e2b91%3A0x1234567890abcdef!2z44CSMzI5LTEzMjYg5qCD5pyo55yM44GV44GP44KJ5biC5ZCR5rKz5Y6f77yT77yZ77yZ77yU4oiS77yR!5e0!3m2!1sja!2sjp!4v1234567890123"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px",
            width: "100%"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: "500" }}>{companyInfo.address}</span>
            </div>
            <div style={{ fontSize: "14px", color: "#1a1a1a" }}>
              <p>・上河内スマートICより車で13分</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
       <section 
        className="contact-section"
         style={{
           width: "100%",
           maxWidth: "100vw",
           opacity: 1,
           paddingTop: "2rem",
           paddingBottom: "2rem",
           background: "#666666",
           color: "white",
           margin: "0 auto",
           display: "flex",
           justifyContent: "center",
           alignItems: "center"
         }}
       >
        <div 
          className="contact-inner"
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
  )
}
