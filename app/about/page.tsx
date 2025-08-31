"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin, PhoneCall, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const companyInfo = {
  name: "株式会社 Noa Corporation",
  representative: "代表取締役：谷口和平",
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
    name: "代表取締役　名前",
    role: "代表取締役",
    description:
      '中古トラックオークションでの買い付け "だけ" に10年以上従事していた経験を持つ、トラック仕入れのプロ中のプロ。お客様に喜んでいただける車輛の見極めと、どこよりも安く落札するスキルには、他者の追随を許さない自信があります。プライベートでは、クラシックカーが好き。',
  },
  {
    name: "取締役　名前",
    role: "取締役",
    description:
      "様々な職種を経験し、持ち前の思考力とセンスで、他の人では考えつかないような切り口から事業を広げるファンタジスタでありながら、縁の下の力持ち。中古車の仕入においても、幅広い人脈と独自の感性から、トラックを探し出す。趣味は釣り。",
  },
  {
    name: "名前",
    role: "入庫検査担当",
    description:
      "車両のあらゆる部位の状態から、過去の車の使われ方を推測し、トラックの全体像を把握する「検査の匠」。すべての販売車両に対して、ノアコーポレーション独自の車輌状態レポートを作成し、その車輌の本当の価値をお客さんにお伝えしている",
  },
  {
    name: "名前",
    role: "営業担当",
    description:
      "トラック業界歴15年。トラック市場を知り尽くし、お客様満足に命をかける営業マン。状況によっては「購入はもう少し待った方が良いかもしれません」など、会社の売上よりもお客様を優先してしまうこともしばしば。",
  },
  {
    name: "名前",
    role: "システム担当",
    description:
      "全くの異業種からトラック業界に飛び込み、IT化や効率化が進まない業態に風穴を開けているシステム担当。販売プロセスにおけるコストカットを徹底することで、お客様への最終的なご提供価格の引き下げに貢献している。",
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

  return (
    <div className="min-h-screen bg-white" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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

      {/* Company Info */}
      <section 
        style={{
          width: "100%",
          maxWidth: "100vw",
          gap: "2.857rem",
          opacity: 1,
          paddingTop: "7.143rem",
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
                INFORMATION
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
                会社情報
              </div>
            </div>
          </div>

          {/* カードの枠を削除し、内容だけ表示 */}
          <div style={{ width: "57.143rem", height: "44.714rem", opacity: 1, maxWidth: "57.143rem", margin: "0 auto" }}>
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.143rem"
              }}
            >
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
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
                   width: "14rem",
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
                   textAlign: "left"
                 }}>代表</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.representative}</span>
               </div>
                             <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>設立年月</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.established}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>資本金</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.capital}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>所在地</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.address}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>電話番号</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.phone}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>FAX番号</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.fax}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>営業時間</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.hours}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>事業内容</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.business}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>古物法に基づく表示</span>
                 <span style={{ marginLeft: "14rem" }}>{companyInfo.license}</span>
               </div>
                             <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>適格請求書（インボイス）発行事業者登録番号</span>
                 <span style={{ marginLeft: "14rem" }}>T5060001025151</span>
               </div>
                             <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.571rem" }}>
                 <span style={{
                   width: "14rem",
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
                   textAlign: "left"
                 }}>加盟協会</span>
                 <span style={{ marginLeft: "14rem" }}>JU・日本中古自動車販売協会連合会 / 自動車公正取引協議会</span>
               </div>
            </div>
          </div>
        </div>
      </section>

             {/* ノアの特徴４選*/}
       <section 
         style={{
           width: "100%",
           maxWidth: "100vw",
           gap: "2.857rem",
           opacity: 1,
           paddingTop: "5.714rem",
           paddingRight: "2.857rem",
           paddingBottom: "5.714rem",
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
                  FEATURE
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
                  ノアコーポレーションの特徴　4点
                </div>
              </div>
            </div>

                       <div style={{
              width: "58.571rem",
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
               <div style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                 <h3 style={{
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
               <div style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                 <h3 style={{
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
                  margin: 0
                }}>
                  当社では、自社による塗装設備を保有しておりますので、車は気に入ったけど色が気に入らないと言ったような場合にも自社でご希望の色に塗装させていただきます。
                </p>
              </div>

              {/* 特徴3 */}
               <div style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                 <h3 style={{
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
                  margin: 0
                }}>
                  当社では、熟練したメンバーにより多くの車両を自社で載せ替えし、生まれ替えさせてきました。平ボディーからクレーン付き、アルミバンから二輪車用積載車。など多くの載せ替えを実施しております。
                </p>
              </div>

              {/* 特徴4 */}
               <div style={{ 
                 marginBottom: "2.857rem",
                 padding: "2rem",
                 border: "1px solid #e5e7eb",
                 borderRadius: "0.571rem",
                 backgroundColor: "#fafafa"
               }}>
                 <h3 style={{
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
        style={{
          width: "56.53%",
          height: "1563px",
          gap: "60px",
          opacity: 1,
          paddingTop: "80px",
          paddingBottom: "80px",
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
                 MEMBER
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
                    key={index} 
                    style={{
                      width: "100%",
                      height: "320px",
                      margin: "0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}
                  >
                    {/* 名前と説明（左の70.5%） */}
                    <div style={{
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
                        {member.description}
                      </p>
                    </div>
                    
                    {/* 写真（右の29.5%） */}
                    <div 
                      style={{
                        width: "29.5%",
                        height: "22.86rem",
                        backgroundColor: "#808080",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1rem",
                        margin: "0"
                      }}
                    >
                      ダミー画像
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
                    key={index} 
                    style={{
                      width: "100%",
                      height: "320px",
                      margin: "0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start"
                    }}
                  >
                    {/* 名前と説明（左の70.5%） */}
                    <div style={{
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
                        {member.description}
                      </p>
                    </div>
                    
                    {/* 写真（右の29.5%） */}
                    <div 
                      style={{
                        width: "29.5%",
                        height: "22.86rem",
                        backgroundColor: "#808080",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1rem",
                        margin: "0"
                      }}
                    >
                      ダミー画像
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
                  width: "100%",
                  position: "relative"
                }}
              >
                {memberGroups.employees.map((member, index) => (
                  <Card 
                    key={index} 
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      width: "25.8%",
                      position: index === 1 ? "absolute" : "relative",
                      left: index === 1 ? "50%" : "auto",
                      transform: index === 1 ? "translateX(-50%)" : "none"
                    }}
                  >
                    <CardContent style={{ padding: "0", textAlign: "center", display: "flex", flexDirection: "column", height: "100%" }}>
                      {/* 写真（最上部） */}
                      <div 
                        style={{
                          width: "100%",
                          height: "15rem",
                          backgroundColor: "#808080",
                          margin: "0",
                          marginBottom: "1.14rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1rem"
                        }}
                      >
                        ダミー画像
                      </div>
                      
                      {/* 名前と説明文（写真の下） */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <h3 style={{ 
                          fontWeight: "bold", 
                          fontSize: "1.14rem", 
                          marginBottom: "8px",
                          color: "#1a1a1a"
                        }}>{member.name}</h3>
                        <p style={{ 
                          color: "#1a1a1a", 
                          fontWeight: "500", 
                          marginBottom: "8px",
                          fontSize: "1rem"
                        }}>{member.role}</p>
                        <p style={{ 
                          fontSize: "1.14rem", 
                          color: "#1a1a1a", 
                          lineHeight: "1.6",
                          fontWeight: "400"
                        }}>{member.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section 
        id="access" 
        style={{
          width: "100%",
          paddingTop: "60px",
          paddingBottom: "60px",
          background: "#FFFFFF"
        }}
      >
        <div 
          style={{
            width: "100%",
            maxWidth: "1000px",
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
                 ACCESS
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3210.1234567890123!2d139.12345678901234!3d36.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDA3JzM0LjQiTiAxMznCsDA3JzM0LjQiRQ!5e0!3m2!1sja!2sjp!4v1234567890123"
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
    </div>
  )
}
