"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Upload, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ContactForm from "../components/ContactForm"

const achievements = [
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
      "複数社に連絡しましたが、グルーウェーブさんが他社よりも20万円ほど高く買い取っていただけました。次もまたお願いします！",
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">(テキスト)トラック買取</h1>
            <p className="text-2xl md:text-3xl mb-8">キャッチコピー！！</p>
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-xl font-bold">高額査定</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">スピード査定</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">書類手続きはすべて代行</div>
              </div>
            </div>
            <p className="text-xl mb-8">簡単5分！車両情報入力で査定額が分かります！</p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                買取査定フォーム
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ACHIEVEMENT</h2>
            <p className="text-xl text-gray-600">当社買取実績</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {achievements.map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400">車両画像</div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.maker}</h3>
                  <p className="text-gray-600 mb-4">年式: {item.year}</p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">当社買取額：{item.price}万円</span>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full inline-block ml-2">{item.status}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              当社買取実績の一部です。年式が古い・状態が悪い車両でも買取価格に自信があります。
            </p>
            <p className="text-lg font-bold">お気軽に是非一度ご相談ください。</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">CONTACT</h2>
            <p className="text-xl">査定をご希望の方、ご売却を検討されている方は下記よりご連絡ください。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <h3 className="font-bold text-xl mb-4">査定依頼</h3>
                <p className="text-sm mb-4">車輌情報入力で査定額が分かります！査定申込も受付！</p>
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700">買取査定フォーム</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-bold text-xl mb-4">お電話でのお問い合わせ</h3>
                <p className="text-3xl font-bold mb-2">000-000-0000</p>
                <p className="text-sm text-gray-600">受付時間：00:00~00:00(日・祝日定休)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reason Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">REASON</h2>
            <p className="text-xl text-gray-600 mb-4">トラック買取で当社が選ばれる理由</p>
            <p className="text-lg font-bold">独自の査定基準！他社様と比べてみてください</p>
          </div>

          <div className="space-y-12">
            {reasons.map((reason, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{reason.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{reason.description}</p>
                    </div>
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-gray-400">イメージ画像</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-blue-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">車検切れ・不動車もOK！</h4>
                <p className="text-sm">どんな車輛にも対応</p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">書類手続きは当社にお任せ！</h4>
                <p className="text-sm">即時振り込み・現金支払いも可能</p>
              </div>
              <div className="bg-yellow-100 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">お客様の面倒は一切なし。</h4>
                <p className="text-sm">スムーズなお取引！</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">REVIEW</h2>
            <p className="text-xl text-gray-600">お客様の声</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-500 mb-2">当社買取価格</div>
                    <div className="text-3xl font-bold text-green-600 mb-2">{review.price}万円</div>
                    <div className="text-lg font-bold mb-1">{review.truck}</div>
                    <div className="text-sm text-gray-600 mb-2">{review.location}</div>
                    <div className="text-sm font-medium">{review.customer}</div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm text-gray-500">/ Review {review.reviewNumber}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA 2 */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">CONTACT</h2>
            <p className="text-xl">査定をご希望の方、ご売却を検討されている方は下記よりご連絡ください。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <h3 className="font-bold text-xl mb-4">査定依頼</h3>
                <p className="text-sm mb-4">車輌情報入力で査定額が分かります！査定申込も受付！</p>
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700">買取査定フォーム</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white text-gray-900">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-bold text-xl mb-4">お電話でのお問い合わせ</h3>
                <p className="text-3xl font-bold mb-2">000-000-0000</p>
                <p className="text-sm text-gray-600">受付時間：00:00~00:00(日・祝日定休)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">QUESTION</h2>
            <p className="text-xl text-gray-600">よくあるご質問</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded font-bold mr-4">Q.</span>
                    <span className="font-bold">{faq.question}</span>
                  </div>
                  <div>
                    <span className="bg-gray-600 text-white px-3 py-1 rounded font-bold mr-4">A.</span>
                    <span className="text-gray-700">{faq.answer}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Document Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">DOCUMENT</h2>
              <p className="text-xl text-gray-600">ご売却に必要な書類</p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <p className="text-lg font-medium mb-4">ダウンロードはこちら</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      譲渡証明書PDF
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      委任状PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
