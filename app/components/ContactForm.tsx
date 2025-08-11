"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addInquiry } from "@/lib/firebase-utils"
import { useRouter } from "next/navigation"

// 都道府県のリスト
const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
]

interface ContactFormProps {
  inquiryNumber?: string;
  inquiryType?: string;
  maker?: string;
  model?: string;
  type?: string;
  year?: string;
  mileage?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export default function ContactForm({ 
  inquiryNumber,
  inquiryType,
  maker,
  model,
  type,
  year,
  mileage,
  name,
  phone,
  email
}: ContactFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    name: name || "",
    prefecture: "",
    phone: phone || "",
    email: email || "",
    inquiryType: inquiryType || "",
    inquiryNumber: inquiryNumber || "",
    remarks: "",
    // 車両情報
    maker: maker || "",
    model: model || "",
    type: type || "",
    year: year || "",
    mileage: mileage || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName) newErrors.companyName = "会社名を入力してください"
    if (!formData.name) newErrors.name = "お名前を入力してください"
    if (!formData.prefecture) newErrors.prefecture = "都道府県を選択してください"
    if (!formData.phone) newErrors.phone = "電話番号を入力してください"
    if (!formData.email) newErrors.email = "メールアドレスを入力してください"
    if (!formData.inquiryType) newErrors.inquiryType = "お問い合わせ内容を選択してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // inquiryTypeの値を日本語にマッピング
      const typeMap: Record<string, "購入" | "買取" | "その他"> = {
        search: "購入",
        sell: "買取",
        other: "その他"
      };
      const type = typeMap[formData.inquiryType];

      // 会社名＋名前を連結
      const fullName = `${formData.companyName} ${formData.name}`;

      // Firebaseに送信
      await addInquiry({
        type,
        fullName,
        company: formData.companyName,
        name: formData.name,
        prefecture: formData.prefecture,
        phone: formData.phone,
        email: formData.email,
        remarks: formData.remarks,
        status: "未対応",
      });

      // 送信成功後の処理
      alert("お問い合わせを送信しました。ありがとうございます。");
      router.push("/"); // トップページにリダイレクト
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-[2.571rem] font-bold mb-6 text-center" style={{color: '#2B5EC5'}}>お問い合わせフォーム</h1>
      <p className="text-[1.143rem] mb-8 text-center">必要事項をご記入の上、お問い合わせください。</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 会社名 */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            <Label htmlFor="companyName" className="text-[1.143rem] font-bold">会社名</Label>
          </div>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="例）株式会社ノアコーポレーション"
            className={errors.companyName ? "border-red-500" : ""}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* お名前 */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            <Label htmlFor="name" className="text-[1.143rem] font-bold">お名前</Label>
          </div>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="例）ノア太郎"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* 都道府県 */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            <Label htmlFor="prefecture" className="text-[1.143rem] font-bold">都道府県</Label>
          </div>
          <Select
            value={formData.prefecture}
            onValueChange={(value) => handleChange("prefecture", value)}
          >
            <SelectTrigger className={errors.prefecture ? "border-red-500" : ""}>
              <SelectValue placeholder="都道府県を選択" />
            </SelectTrigger>
            <SelectContent>
              {prefectures.map((prefecture) => (
                <SelectItem key={prefecture} value={prefecture}>
                  {prefecture}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.prefecture && (
            <p className="text-red-500 text-sm mt-1">{errors.prefecture}</p>
          )}
        </div>

        {/* 電話番号 */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            <Label htmlFor="phone" className="text-[1.143rem] font-bold">電話番号</Label>
          </div>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="例）0123456789"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            <Label htmlFor="email" className="text-[1.143rem] font-bold">メールアドレス</Label>
          </div>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="例）xxxx@xxx.jp"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* お問い合わせ内容 */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            <Label className="text-[1.143rem] font-bold">お問い合わせ内容</Label>
          </div>
          <RadioGroup
            value={formData.inquiryType}
            onValueChange={(value) => handleChange("inquiryType", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="search" id="inquiry-search" />
              <Label htmlFor="inquiry-search" className="text-[1.143rem]">車両を探している</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="inquiry-sell" />
              <Label htmlFor="inquiry-sell" className="text-[1.143rem]">車両を売りたい</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="inquiry-other" />
              <Label htmlFor="inquiry-other" className="text-[1.143rem]">その他</Label>
            </div>
          </RadioGroup>
          {errors.inquiryType && (
            <p className="text-red-500 text-sm mt-1">{errors.inquiryType}</p>
          )}
        </div>

        {/* 車両情報 */}
        {formData.inquiryType === "sell" && (
          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">車両情報</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-[0.857rem] text-white px-2 py-0.5 rounded" style={{background: '#666666'}}>任意</span>
                  <Label htmlFor="maker" className="text-[1.143rem] font-bold">メーカー</Label>
                </div>
                <Input
                  id="maker"
                  value={formData.maker}
                  onChange={(e) => handleChange("maker", e.target.value)}
                  placeholder="例）いすゞ"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-[0.857rem] text-white px-2 py-0.5 rounded" style={{background: '#666666'}}>任意</span>
                  <Label htmlFor="model" className="text-[1.143rem] font-bold">車種</Label>
                </div>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="例）エルフ"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-[0.857rem] text-white px-2 py-0.5 rounded" style={{background: '#666666'}}>任意</span>
                  <Label htmlFor="type" className="text-[1.143rem] font-bold">型式</Label>
                </div>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  placeholder="例）NMR85H"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-[0.857rem] text-white px-2 py-0.5 rounded" style={{background: '#666666'}}>任意</span>
                  <Label htmlFor="year" className="text-[1.143rem] font-bold">年式</Label>
                </div>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                  placeholder="例）2020年"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-[0.857rem] text-white px-2 py-0.5 rounded" style={{background: '#666666'}}>任意</span>
                  <Label htmlFor="mileage" className="text-[1.143rem] font-bold">走行距離</Label>
                </div>
                <Input
                  id="mileage"
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                  placeholder="例）100,000km"
                />
              </div>
            </div>
          </div>
        )}

        {/* 問い合わせ番号 */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white px-2 py-0.5 rounded" style={{background: '#666666'}}>任意</span>
            <Label htmlFor="inquiryNumber" className="text-[1.143rem] font-bold">問い合わせ番号</Label>
          </div>
          <Input
            id="inquiryNumber"
            value={formData.inquiryNumber}
            onChange={(e) => handleChange("inquiryNumber", e.target.value)}
            placeholder="例）V00001"
            disabled={!!inquiryNumber}
          />
        </div>

        {/* フリー備考欄 */}
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[0.857rem] text-white px-2 py-0.5 rounded" style={{background: '#666666'}}>任意</span>
            <Label htmlFor="remarks" className="text-[1.143rem] font-bold">フリー備考欄</Label>
          </div>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            placeholder="その他ご要望などございましたらご記入ください"
            className="min-h-[150px]"
          />
        </div>

        {/* 送信ボタン */}
        <div className="text-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-white rounded-lg disabled:opacity-50 text-[1.143rem] font-bold"
            style={{
              background: 'linear-gradient(180deg, #1154AF 0%, #053B65 100%)',
              boxShadow: '2px 2px 2px 0px #00000040',
              width: '220px',
              height: '39px'
            }}
          >
            {isSubmitting ? "送信中..." : "送信する"}
          </Button>
        </div>
      </form>
    </div>
  )
} 