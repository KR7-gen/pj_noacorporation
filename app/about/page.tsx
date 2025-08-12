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
      "車両のあらゆる部位の状態から、過去の車の使われ方を推測し、トラックの全体像を把握する「検査の匠」。すべての販売車両に対して、グルーウェーブ独自の車輌状態レポートを作成し、その車輌の本当の価値をお客さんにお伝えしている",
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
          height: "400px",
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
            width: "335px",
            height: "70px",
            fontSize: "48px",
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 700,
            fontStyle: "bold",
            lineHeight: "100%",
            letterSpacing: 0,
            color: "white",
            textShadow: "4px 4px 4px #0000004D",
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
          width: "1440px",
          height: "921px",
          gap: "40px",
          opacity: 1,
          paddingTop: "100px",
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
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{
              width: "auto",
              height: "auto",
              opacity: 1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "1rem",
              lineHeight: "100%",
              letterSpacing: 0,
              color: "white",
              textAlign: "center",
              margin: "0 auto 8px auto",
              color: "#2B5EC5",
              padding: "0.29rem 0.57rem",
              borderRadius: "0.14rem",
              display: "inline-block"
            }}>COMPANY INFORMATION</div>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>会社情報</h2>
          </div>

          {/* カードの枠を削除し、内容だけ表示 */}
          <div style={{ width: "800px", height: "626px", opacity: 1, maxWidth: "800px", margin: "0 auto" }}>
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>会社名</span>
                <span style={{
                  width: "auto",
                  minWidth: 0,
                  height: "19px",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  color: "#1A1A1A",
                  opacity: 1,
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  marginLeft: "160px"
                }}>{companyInfo.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>代表</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.representative}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>設立年月</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.established}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>資本金</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.capital}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>所在地</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.address}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>電話番号</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.phone}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>FAX番号</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.fax}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>営業時間</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.hours}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>事業内容</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.business}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                <span style={{
                  width: "160px",
                  height: "23px",
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                  opacity: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "4px",
                  textAlign: "left"
                }}>古物法に基づく表示</span>
                <span style={{ marginLeft: "160px" }}>{companyInfo.license}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reason Section & Business Model Diagram */}
      <section 
        style={{
          width: "1440px",
          height: "1418px",
          gap: "40px",
          opacity: 1,
          paddingTop: "80px",
          paddingRight: "40px",
          paddingBottom: "80px",
          paddingLeft: "40px",
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
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{
              width: "55px",
              height: "17px",
              opacity: 1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: 0,
              color: "#2B5EC5",
              textAlign: "center",
              margin: "0 auto 16px auto"
            }}>REASON</h2>
            <p style={{
              width: "200px",
              height: "58px",
              opacity: 1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "40px",
              lineHeight: "100%",
              letterSpacing: 0,
              color: "#1A1A1A",
              textAlign: "center",
              margin: "0 auto 32px auto"
            }}>安さの理由</p>
          </div>

          <div style={{
            width: "820px",
            minHeight: "19px",
            opacity: 1,
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: 0,
            color: "#1A1A1A",
            textAlign: "left",
            margin: "0 auto 32px auto"
          }}>
            <p style={{ marginBottom: "16px" }}>
              <span style={{
                width: "820px",
                height: "36px",
                opacity: 1,
                display: "inline-block"
              }}>
                中古トラック業界には、２パターンのプレイヤーが存在します。
              </span><br />
              <span style={{
                width: "820px",
                height: "56px",
                opacity: 1,
                display: "inline-block",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "28px",
                letterSpacing: 0
              }}>
                私たちのように、独自の仕入れルートからトラックを直接仕入れて在庫を保有する「トラック販売業者」と、自社在庫は保有せずに全国の販売事業者と提携してトラックの紹介・販売だけを行う「販売代行業者」です。
              </span>
            </p>
            <p style={{ marginBottom: "16px" }}>
              <span style={{
                width: "820px",
                height: "112px",
                opacity: 1,
                display: "inline-block",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "28px",
                letterSpacing: 0
              }}>
                販売代行業者は、高い資本力や知名度をを持っているため、中古トラックを探しているお客様からすぐに見つけやすく、またすばやく手厚く対応をしてもらえるという絶大なメリットがあります。一方、トラック販売事業者から支払われる販売手数料を主としたビジネスモデルであるため、お客様への最終的な販売価格はどうしても高くなります。また、自社保有在庫ではないため、個々の車輛の品質を担保することまでは難しくなってきます。
              </span>
            </p>

          </div>

          {/* Business Model Diagram */}
          <div 
            style={{
              width: "820px",
              height: "634px",
              gap: "10px",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              marginBottom: "-80px"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                    <div style={{ 
                      position: "relative",
                      width: "100%",
                      height: "60px"
                    }}>
                      {/* 吹き出し全体 */}
                      <div style={{
                        width: "534px",
                        height: "61px",
                        opacity: 1,
                        position: "absolute",
                        top: "-50px",
                        left: "-13px"
                      }}>
                        {/* Rectangle 14 - 楕円部分 */}
                        <div style={{
                          width: "240px",
                          height: "48px",
                          opacity: 1,
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                          backgroundColor: "#666666",
                          borderRadius: "25px"
                        }}></div>
                        
                        {/* Polygon 2 - 三角部分 */}
                        <div style={{
                          width: "18px",
                          height: "18px",
                          opacity: 1,
                          position: "absolute",
                          top: "43px",
                          left: "111px",
                          backgroundColor: "#666666",
                          clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)"
                        }}></div>
                        
                        {/* 仕入・保管テキスト */}
                        <div style={{
                          width: "120px",
                          height: "28px",
                          opacity: 1,
                          position: "absolute",
                          top: "11px",
                          left: "60px",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontStyle: "bold",
                          fontSize: "24px",
                          lineHeight: "28px",
                          letterSpacing: 0,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>仕入・保管</div>
                      </div>
                      <div style={{
                        width: "214px",
                        height: "232px",
                        opacity: 1,
                        position: "absolute",
                        top: "13px",
                        left: "0px",
                        backgroundColor: "#F2F2F2",
                        borderRadius: "8px"
                      }}>
                        <img 
                          src="/truck_sales_company.png"
                          alt="販売事業者"
                          style={{
                            width: "161px",
                            height: "136px",
                            opacity: 1,
                            position: "absolute",
                            top: "62px",
                            left: "26px",
                            objectFit: "contain"
                          }}
                        />
                      </div>
                      <div style={{
                        width: "100px",
                        height: "28px",
                        opacity: 1,
                        position: "absolute",
                        top: "13px",
                        left: "56.93px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "20px",
                        lineHeight: "28px",
                        letterSpacing: 0,
                        color: "#333333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "nowrap"
                      }}>販売事業者                      </div>
                      
                      {/* 販売代行事業者用の吹き出し全体 */}
                      <div style={{
                        width: "534px",
                        height: "61px",
                        opacity: 1,
                        position: "absolute",
                        top: "-50px",
                        left: "281px"
                      }}>
                        {/* Rectangle 14 - 楕円部分 */}
                        <div style={{
                          width: "240px",
                          height: "48px",
                          opacity: 1,
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                          backgroundColor: "#666666",
                          borderRadius: "25px"
                        }}></div>
                        
                        {/* Polygon 2 - 三角部分 */}
                        <div style={{
                          width: "18px",
                          height: "18px",
                          opacity: 1,
                          position: "absolute",
                          top: "43px",
                          left: "111px",
                          backgroundColor: "#666666",
                          clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)"
                        }}></div>
                        
                        {/* 仕入・保管テキスト */}
                        <div style={{
                          width: "120px",
                          height: "28px",
                          opacity: 1,
                          position: "absolute",
                          top: "11px",
                          left: "60px",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontStyle: "bold",
                          fontSize: "24px",
                          lineHeight: "28px",
                          letterSpacing: 0,
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>販売のみ</div>
                      </div>
                      
                      <div style={{
                        width: "216px",
                        height: "232px",
                        opacity: 1,
                        position: "absolute",
                        top: "13px",
                        left: "292.57px",
                        backgroundColor: "#F2F2F2",
                        borderRadius: "8px"
                      }}>
                        <img 
                          src="/truck_sales_agency.png"
                          alt="販売代行事業者"
                          style={{
                            width: "142px",
                            height: "120px",
                            opacity: 1,
                            position: "absolute",
                            top: "78px",
                            left: "37px",
                            objectFit: "contain"
                          }}
                        />
                      </div>
                      <div style={{
                        width: "140px",
                        height: "28px",
                        opacity: 1,
                        position: "absolute",
                        top: "13px",
                        left: "331.07px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "20px",
                        lineHeight: "28px",
                        letterSpacing: 0,
                        color: "#333333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "nowrap"
                      }}>販売代行事業者</div>
                      <div style={{
                        width: "214px",
                        height: "232px",
                        opacity: 1,
                        position: "absolute",
                        top: "13px",
                        left: "587.14px",
                        backgroundColor: "#F1F6FF",
                        borderRadius: "8px"
                      }}>
                        <img 
                          src="/customer.png"
                          alt="お客様"
                          style={{
                            width: "122px",
                            height: "104px",
                            opacity: 1,
                            position: "absolute",
                            top: "64px",
                            left: "50px",
                            objectFit: "contain"
                          }}
                        />
                      </div>
                      <div style={{
                        width: "60px",
                        height: "28px",
                        opacity: 1,
                        position: "absolute",
                        top: "13px",
                        left: "664.14px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "20px",
                        lineHeight: "28px",
                        letterSpacing: 0,
                        color: "#333333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "nowrap"
                      }}>お客様</div>
                    </div>

                    <div style={{
                      width: "160px",
                      height: "28px",
                      opacity: 1,
                      position: "absolute",
                      top: "195px",
                      left: "614.14px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "16px",
                      lineHeight: "28px",
                      letterSpacing: 0,
                      color: "#333333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>希望の中古車輌を購入</div>
                    
                    {/* 1つ目の矢印全体 */}
                    <div style={{
                      width: "78.57px",
                      height: "59.54px",
                      opacity: 1,
                      position: "absolute",
                      top: "81.63px",
                      left: "214px"
                    }}>
                      {/* 1つ目の右矢印 - Rectangle 16 */}
                      <div style={{
                        width: "53.57px",
                        height: "35.71px",
                        opacity: 1,
                        position: "absolute",
                        top: "16.96px",
                        left: "0px",
                        backgroundColor: "#2B5EC5"
                      }}></div>
                      
                      {/* 1つ目の右矢印 - Polygon 1 */}
                      <div style={{
                        width: "25px",
                        height: "59.54px",
                        opacity: 1,
                        position: "absolute",
                        top: "4px",
                        left: "53px",
                        backgroundColor: "#2B5EC5",
                        clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
                        transform: "rotate(-180deg)"
                      }}></div>
                      
                      {/* 1つ目の矢印内テキスト「委託」 */}
                      <div style={{
                        width: "40px",
                        height: "28px",
                        opacity: 1,
                        position: "absolute",
                        top: "20.6px",
                        left: "19px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "20px",
                        lineHeight: "28px",
                        letterSpacing: 0,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>委託</div>
                    </div>
                    
                    {/* 2つ目の矢印全体 */}
                    <div style={{
                      width: "78.57px",
                      height: "59.54px",
                      opacity: 1,
                      position: "absolute",
                      top: "81.63px",
                      left: "508.57px"
                    }}>
                      {/* 2つ目の右矢印 - Rectangle 16 */}
                      <div style={{
                        width: "53.57px",
                        height: "35.71px",
                        opacity: 1,
                        position: "absolute",
                        top: "16.96px",
                        left: "0px",
                        backgroundColor: "#2B5EC5"
                      }}></div>
                      
                      {/* 2つ目の右矢印 - Polygon 1 */}
                      <div style={{
                        width: "25px",
                        height: "59.54px",
                        opacity: 1,
                        position: "absolute",
                        top: "4px",
                        left: "53px",
                        backgroundColor: "#2B5EC5",
                        clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
                        transform: "rotate(-180deg)"
                      }}></div>
                      
                      {/* 2つ目の矢印内テキスト「委託」 */}
                      <div style={{
                        width: "40px",
                        height: "28px",
                        opacity: 1,
                        position: "absolute",
                        top: "20.6px",
                        left: "19px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "20px",
                        lineHeight: "28px",
                        letterSpacing: 0,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>委託</div>
                                          </div>
                    </div>
                  <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <span style={{ backgroundColor: "#f3f4f6", padding: "4px 12px", borderRadius: "4px", fontSize: "14px" }}>販売のみ</span>
                  </div>
                  
                  {/* 当社セット */}
                  <div style={{ 
                    position: "relative",
                    width: "100%",
                    height: "60px",
                    marginTop: "190px"
                  }}>
                    {/* 当社の吹き出し全体 */}
                    <div style={{
                      width: "240px",
                      height: "61px",
                      opacity: 1,
                      position: "absolute",
                      top: "-50px",
                      left: "-13px"
                    }}>
                      {/* Rectangle 14 - 楕円部分 */}
                      <div style={{
                        width: "240px",
                        height: "48px",
                        opacity: 1,
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        backgroundColor: "#666666",
                        borderRadius: "25px"
                      }}></div>
                      
                      {/* Polygon 2 - 三角部分 */}
                      <div style={{
                        width: "18px",
                        height: "18px",
                        opacity: 1,
                        position: "absolute",
                        top: "43px",
                        left: "111px",
                        backgroundColor: "#666666",
                        clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)"
                      }}></div>
                      
                      {/* 仕入・保管テキスト */}
                      <div style={{
                        width: "120px",
                        height: "28px",
                        opacity: 1,
                        position: "absolute",
                        top: "11px",
                        left: "60px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "24px",
                        lineHeight: "28px",
                        letterSpacing: 0,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>仕入・保管</div>
                    </div>
                    
                    {/* 当社背景 */}
                    <div style={{
                      width: "214px",
                      height: "232px",
                      opacity: 1,
                      position: "absolute",
                      top: "13px",
                      left: "0px",
                      backgroundColor: "#F2F2F2",
                      borderRadius: "8px"
                    }}>
                      <img 
                        src="/truck_sales_company.png"
                        alt="販売事業者"
                        style={{
                          width: "161px",
                          height: "136px",
                          opacity: 1,
                          position: "absolute",
                          top: "62px",
                          left: "26px",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                    
                    {/* 当社テキスト */}
                    <div style={{
                      width: "100px",
                      height: "28px",
                      opacity: 1,
                      position: "absolute",
                      top: "13px",
                      left: "56.93px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "20px",
                      lineHeight: "28px",
                      letterSpacing: 0,
                      color: "#333333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap"
                    }}>当社</div>
                    
                    {/* 2つ目のお客様背景 */}
                    <div style={{
                      width: "214px",
                      height: "232px",
                      opacity: 1,
                      position: "absolute",
                      top: "13px",
                      left: "587.14px",
                      backgroundColor: "#F1F6FF",
                      borderRadius: "8px"
                    }}>
                      <img 
                        src="/customer.png"
                        alt="お客様"
                        style={{
                          width: "122px",
                          height: "104px",
                          opacity: 1,
                          position: "absolute",
                          top: "64px",
                          left: "50px",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                    
                    {/* 2つ目のお客様テキスト */}
                    <div style={{
                      width: "60px",
                      height: "28px",
                      opacity: 1,
                      position: "absolute",
                      top: "13px",
                      left: "664.14px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "20px",
                      lineHeight: "28px",
                      letterSpacing: 0,
                      color: "#333333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap"
                    }}>お客様</div>
                    
                    {/* 2つ目の希望の中古車輌を購入テキスト */}
                    <div style={{
                      width: "160px",
                      height: "28px",
                      opacity: 1,
                      position: "absolute",
                      top: "195px",
                      left: "614.14px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontStyle: "bold",
                      fontSize: "16px",
                      lineHeight: "28px",
                      letterSpacing: 0,
                      color: "#333333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>希望の中古車輌を購入</div>
                    
                    {/* 当社から2つ目のお客様への矢印全体 */}
                    <div style={{
                      width: "372.98px",
                      height: "36px",
                      opacity: 1,
                      position: "absolute",
                      top: "98.45px",
                      left: "214px",
                      backgroundColor: "transparent"
                    }}>
                      {/* Rectangle 16 */}
                      <div style={{
                        width: "339px",
                        height: "36px",
                        opacity: 1,
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        background: "linear-gradient(90deg, #1154AF 0%, #053B65 100%)"
                      }}></div>
                      
                       {/* Polygon 1 */}
                        <div style={{
                          width: "33.93px",
                          height: "68.75px",
                          opacity: 1,
                          position: "absolute",
                          top: "-17px",
                          left: "338px",
                          backgroundColor: "#053B65",
                          clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)"
                        }}></div>
                      
                      {/* 直販テキスト */}
                      <div style={{
                        width: "40px",
                        height: "28px",
                        opacity: 1,
                        position: "absolute",
                        top: "4px",
                        left: "166px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontStyle: "bold",
                        fontSize: "20px",
                        lineHeight: "28px",
                        letterSpacing: 0,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>直販</div>
                    </div>
                  </div>
          </div>
          <div style={{ maxWidth: "800px", textAlign: "left" }}>
            <p style={{ marginBottom: "16px" }}>
              <span style={{
                width: "820px",
                height: "84px",
                opacity: 1,
                display: "inline-block",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "28px",
                letterSpacing: 0
              }}>
                私たちグルーウェーブは、自社在庫に責任を持つトラック販売事業者でありながら、個別のお客様への直販体制にも力を入れています。そのため、不要なコストを排除し、お客様に品質と価格のバランスが取れた車輛をご紹介できています。
              </span>
            </p>
            <p style={{ marginBottom: "16px" }}>
              <span style={{
                width: "820px",
                height: "56px",
                opacity: 1,
                display: "inline-block",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "28px",
                letterSpacing: 0
              }}>
                また、「仕入れ」「入庫検査」「販売」「バックオフィス」すべてのプロセスにおいて、業界随一のプロフェッショナルが揃っていることも、お客様にご満足いただけている理由のひとつ。
              </span>
            </p>
            <p style={{ marginBottom: "16px" }}>
              <span style={{
                width: "820px",
                height: "38px",
                opacity: 1,
                display: "inline-block",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "28px",
                letterSpacing: 0
              }}>
                グルーウェーブがこだわる「品質の透明性と安さ」を支えるチームについて、詳しくは、下記メンバー紹介をご覧ください。
              </span>
            </p>
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
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{
              width: "auto",
              height: "auto",
              opacity: 1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "1rem",
              lineHeight: "100%",
              letterSpacing: 0,
              color: "white",
              textAlign: "center",
              margin: "0 auto 8px auto",
              color: "#2B5EC5",
              padding: "0.29rem 0.57rem",
              borderRadius: "0.14rem",
              display: "inline-block"
            }}>MEMBER</div>
            <h2 style={{ 
              fontSize: "2.86rem", 
              fontWeight: "bold", 
              marginBottom: "16px",
              color: "#1a1a1a"
            }}>メンバー紹介</h2>
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
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{
              width: "auto",
              height: "auto",
              opacity: 1,
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "1rem",
              lineHeight: "100%",
              letterSpacing: 0,
              color: "white",
              textAlign: "center",
              margin: "0 auto 8px auto",
              color: "#2B5EC5",
              padding: "0.29rem 0.57rem",
              borderRadius: "0.14rem",
              display: "inline-block"
            }}>ACCESS</div>
            <h2 style={{ 
              fontSize: "2.86rem", 
              fontWeight: "bold", 
              marginBottom: "16px",
              color: "#1a1a1a"
            }}>アクセス</h2>
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
              <p>・〇〇より0分</p>
              <p>・〇〇より0分</p>
            </div>
          </div>
        </div>
      </section>

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
          {/* ①と②のコンテナ */}
          <div 
            style={{
              width: "240px",
              height: "75px",
              margin: "0 auto 32px auto",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* ①CONTACT */}
            <div 
              style={{
                width: "62px",
                height: "17px",
                margin: "0 auto 16px auto",
                fontFamily: "Noto Sans JP",
                fontWeight: "400",
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              CONTACT
            </div>
            {/* ②お問い合わせ */}
            <div 
              style={{
                width: "240px",
                height: "58px",
                fontFamily: "Noto Sans JP",
                fontWeight: "700",
                fontStyle: "Bold",
                fontSize: "40px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              お問い合わせ
            </div>
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
                  <PhoneCall 
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
