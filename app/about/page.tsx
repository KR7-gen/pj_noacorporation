"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin } from "lucide-react"
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

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
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
              width: "161px",
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
              margin: "0 auto 8px auto"
            }}>COMPANY INFORMATION</div>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>企業情報</h2>
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
              gap: "32px",
              opacity: 1,
              display: "flex",
              flexDirection: "column",
              marginBottom: "48px"
            }}
          >
            <Card 
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px", textAlign: "center" }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                    <div style={{ 
                      position: "relative",
                      width: "100%",
                      height: "60px"
                    }}>
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
                        backgroundColor: "#dbeafe",
                        padding: "16px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "nowrap"
                      }}>販売事業者</div>
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
                        backgroundColor: "#dcfce7",
                        padding: "16px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "nowrap"
                      }}>販売代行事業者</div>
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
                        backgroundColor: "#fef3c7",
                        padding: "16px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "nowrap"
                      }}>お客様</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", marginBottom: "8px" }}>委託</div>
                      <div style={{ fontSize: "14px", marginTop: "8px" }}>希望の中古車輌を購入</div>
                    </div>
                  </div>
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <span style={{ backgroundColor: "#f3f4f6", padding: "4px 12px", borderRadius: "4px", fontSize: "14px" }}>販売のみ</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px", textAlign: "center" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "24px" }}>当社</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ backgroundColor: "#dbeafe", padding: "16px", borderRadius: "8px" }}>当社</div>
                    <div style={{ fontSize: "14px" }}>直販</div>
                    <div style={{ backgroundColor: "#fef3c7", padding: "16px", borderRadius: "8px" }}>お客様</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "14px" }}>希望の中古車輌を購入</div>
                  </div>
                </div>
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <span style={{ backgroundColor: "#f3f4f6", padding: "4px 12px", borderRadius: "4px", fontSize: "14px" }}>仕入・保管</span>
                </div>
              </CardContent>
            </Card>
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
          width: "1440px",
          height: "1563px",
          gap: "60px",
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
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>MEMBER</h2>
            <p style={{ fontSize: "20px", color: "#6b7280" }}>メンバー紹介</p>
          </div>

          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
              width: "100%",
              maxWidth: "1200px"
            }}
          >
            {members.map((member, index) => (
              <Card 
                key={index} 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  height: "100%"
                }}
              >
                <CardContent style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <div 
                      style={{
                        width: "96px",
                        height: "96px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "50%",
                        margin: "0 auto 16px auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div style={{ color: "#9ca3af" }}>写真</div>
                    </div>
                    <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>{member.name}</h3>
                    <p style={{ color: "#2563eb", fontWeight: "500" }}>{member.role}</p>
                  </div>
                  <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section 
        id="access" 
        style={{
          width: "1440px",
          height: "673px",
          gap: "40px",
          opacity: 1,
          paddingTop: "60px",
          paddingRight: "40px",
          paddingBottom: "60px",
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
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>ACCESS</h2>
            <p style={{ fontSize: "20px", color: "#6b7280" }}>アクセス</p>
          </div>

          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "32px",
              width: "100%",
              maxWidth: "800px"
            }}
          >
            <Card 
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px" }}>
                <div 
                  style={{
                    width: "100%",
                    height: "256px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px"
                  }}
                >
                  <div style={{ color: "#9ca3af" }}>Googleマップ</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin style={{ width: "20px", height: "20px", color: "#2563eb" }} />
                    <span style={{ fontWeight: "500" }}>{companyInfo.address}</span>
                  </div>
                  <div style={{ marginLeft: "28px", fontSize: "14px", color: "#6b7280" }}>
                    <p>・〇〇より0分</p>
                    <p>・〇〇より0分</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "24px" }}>店舗情報</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "500" }}>所在地</span>
                    <span>{companyInfo.address}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "500" }}>TEL</span>
                    <span>{companyInfo.phone}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "500" }}>FAX</span>
                    <span>{companyInfo.fax}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "500" }}>営業時間</span>
                    <span>{companyInfo.hours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section ここから置換 */}
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
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "16px" }}>CONTACT</h2>
            <p style={{ fontSize: "20px", marginBottom: "16px" }}>お問い合わせ</p>
            <p style={{ marginBottom: "32px" }}>
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
            <Card 
              style={{
                backgroundColor: "white",
                color: "#374151",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px", textAlign: "center" }}>
                <Phone style={{ width: "48px", height: "48px", margin: "0 auto 16px auto", color: "#2563eb" }} />
                <h3 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "16px" }}>お電話でのお問い合わせ</h3>
                <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}>TEL. 000-000-0000</p>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>受付時間：月〜土 00:00~00:00</p>
              </CardContent>
            </Card>

            <Card 
              style={{
                backgroundColor: "white",
                color: "#374151",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            >
              <CardContent style={{ padding: "32px", textAlign: "center" }}>
                <div 
                  style={{
                    width: "48px",
                    height: "48px",
                    margin: "0 auto 16px auto",
                    backgroundColor: "#2563eb",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div 
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "white",
                      borderRadius: "4px"
                    }}
                  ></div>
                </div>
                <h3 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "16px" }}>フォームでのお問い合わせ</h3>
                <Link href="/contact">
                  <Button 
                    style={{
                      marginBottom: "16px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                    }}
                  >
                    お問い合わせフォームへ
                  </Button>
                </Link>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>24時間受付中</p>
              </CardContent>
            </Card>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/purchase">
              <Button 
                variant="outline" 
                size="lg" 
                style={{
                  backgroundColor: "white",
                  color: "#2563eb",
                  border: "2px solid white",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                トラック買取をご希望の方はこちら
                <br />
                <span style={{ fontSize: "14px" }}>無料査定実施中！！</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Contact Section ここまで置換 */}
    </div>
  )
}
