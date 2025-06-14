"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

const companyInfo = {
  name: "会社名",
  representative: "代表取締役：名前",
  established: "0000年00月00日",
  capital: "000万円",
  address: "〒000-0000　住所",
  phone: "000-000-0000",
  fax: "000-000-0000",
  hours: "00:00~00:00(定休日：日曜・祝日)",
  business: "中古トラック販売・トラック買取・中古重機各種取扱い",
  license: "第000000000000号",
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
      {/* Header */}
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">私たちについて</h1>
          <p className="text-xl mt-2">COMPANY INFORMATION</p>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">当社買取実績</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">会社名</span>
                      <span>{companyInfo.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">代表</span>
                      <span>{companyInfo.representative}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">設立年月</span>
                      <span>{companyInfo.established}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">資本金</span>
                      <span>{companyInfo.capital}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">所在地</span>
                      <span>{companyInfo.address}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">電話番号</span>
                      <span>{companyInfo.phone}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">FAX番号</span>
                      <span>{companyInfo.fax}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">営業時間</span>
                      <span>{companyInfo.hours}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">事業内容</span>
                      <span>{companyInfo.business}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">古物法に基づく表示</span>
                      <span>{companyInfo.license}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reason Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">REASON</h2>
              <p className="text-xl text-gray-600">安さの理由</p>
            </div>

            <div className="mb-12">
              <p className="text-lg leading-relaxed mb-8">
                中古トラック業界には、２パターンのプレイヤーが存在します。
                <br />
                私たちのように、独自の仕入れルートからトラックを直接仕入れて在庫を保有する「トラック販売業者」と、自社在庫は保有せずに全国の販売事業者と提携してトラックの紹介・販売だけを行う「販売代行業者」です。
              </p>

              <p className="text-lg leading-relaxed mb-8">
                販売代行業者は、高い資本力や知名度をを持っているため、中古トラックを探しているお客様からすぐに見つけやすく、またすばやく手厚く対応をしてもらえるという絶大なメリットがあります。一方、トラック販売事業者から支払われる販売手数料を主としたビジネスモデルであるため、お客様への最終的な販売価格はどうしても高くなります。また、自社保有在庫ではないため、個々の車輛の品質を担保することまでは難しくなってきます。
              </p>
            </div>

            {/* Business Model Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-center">販売代行事業者</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-blue-100 p-4 rounded">販売事業者</div>
                      <div className="text-sm">委託</div>
                      <div className="bg-green-100 p-4 rounded">販売代行事業者</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm mb-2">委託</div>
                      <div className="bg-yellow-100 p-4 rounded inline-block">お客様</div>
                      <div className="text-sm mt-2">希望の中古車輌を購入</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded">販売のみ</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-center">当社</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-blue-100 p-4 rounded">当社</div>
                      <div className="text-sm">直販</div>
                      <div className="bg-yellow-100 p-4 rounded">お客様</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm">希望の中古車輌を購入</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded">仕入・保管</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-lg leading-relaxed">
              <p className="mb-6">
                私たちグルーウェーブは、自社在庫に責任を持つトラック販売事業者でありながら、個別のお客様への直販体制にも力を入れています。そのため、不要なコストを排除し、お客様に品質と価格のバランスが取れた車輛をご紹介できています。
              </p>
              <p>
                また、「仕入れ」「入庫検査」「販売」「バックオフィス」すべてのプロセスにおいて、業界随一のプロフェッショナルが揃っていることも、お客様にご満足いただけている理由のひとつ。
                <br />
                グルーウェーブがこだわる「品質の透明性と安さ」を支えるチームについて、詳しくは、下記メンバー紹介をご覧ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Member Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">MEMBER</h2>
              <p className="text-xl text-gray-600">メンバー紹介</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div className="text-gray-400">写真</div>
                      </div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-blue-600 font-medium">{member.role}</p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section id="access" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ACCESS</h2>
              <p className="text-xl text-gray-600">アクセス</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8">
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-gray-400">Googleマップ</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{companyInfo.address}</span>
                    </div>
                    <div className="ml-7 text-sm text-gray-600">
                      <p>・〇〇より0分</p>
                      <p>・〇〇より0分</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">店舗情報</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">所在地</span>
                      <span>{companyInfo.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">TEL</span>
                      <span>{companyInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">FAX</span>
                      <span>{companyInfo.fax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">営業時間</span>
                      <span>{companyInfo.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">CONTACT</h2>
            <p className="text-xl mb-4">お問い合わせ</p>
            <p className="mb-8">
              在庫車輛の詳細/その他お問い合わせ/業販価格のご確認など
              <br />
              お電話またはお問い合わせフォームよりお気軽にお問い合わせください。
              <br />
              在庫にないトラックのご紹介も可能です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-xl mb-4">お電話でのお問い合わせ</h3>
                <p className="text-3xl font-bold mb-2">TEL. {companyInfo.phone}</p>
                <p className="text-sm text-gray-600">受付時間：月〜土 00:00~00:00</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <h3 className="font-bold text-xl mb-4">フォームでのお問い合わせ</h3>
                <a href="/contact" className="mb-4 inline-block bg-blue-600 text-white hover:bg-blue-700 rounded px-4 py-2">お問い合わせフォームへ</a>
                <p className="text-sm text-gray-600">24時間受付中</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/purchase">
              <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                トラック買取をご希望の方はこちら
                <br />
                <span className="text-sm">無料査定実施中！！</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
