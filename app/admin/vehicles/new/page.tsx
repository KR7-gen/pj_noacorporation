"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addVehicle } from "@/lib/firebase-utils"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewVehiclePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    managementNumber: "",
    maker: "",
    bodyType: "",
    size: "",
    price: "",
    wholesalePrice: "",
    totalPayment: "",
    expiryDate: "",
    imageUrl: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.managementNumber) newErrors.managementNumber = "管理番号を入力してください"
    if (!formData.maker) newErrors.maker = "メーカーを入力してください"
    if (!formData.bodyType) newErrors.bodyType = "車種を入力してください"
    if (!formData.size) newErrors.size = "サイズを入力してください"
    if (!formData.price) newErrors.price = "価格を入力してください"
    if (!formData.wholesalePrice) newErrors.wholesalePrice = "仕入れ価格を入力してください"
    if (!formData.totalPayment) newErrors.totalPayment = "支払総額を入力してください"
    if (!formData.expiryDate) newErrors.expiryDate = "有効期限を入力してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await addVehicle({
        managementNumber: formData.managementNumber,
        maker: formData.maker,
        bodyType: formData.bodyType,
        size: formData.size,
        price: parseInt(formData.price),
        wholesalePrice: parseInt(formData.wholesalePrice),
        totalPayment: parseInt(formData.totalPayment),
        expiryDate: formData.expiryDate,
        imageUrl: formData.imageUrl || undefined,
        // name, model, year, mileage, description, imageUrls, inspectionDate などの不足しているプロパティを適切に追加
        name: `${formData.maker} ${formData.bodyType}`, // 仮の名前
        model: '', // 必要に応じてフォームに追加
        year: new Date().getFullYear(), // 仮の年
        mileage: 0, // 仮の走行距離
        description: '', // 必要に応じてフォームに追加
        imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
        inspectionDate: formData.expiryDate // 仮
      })

      alert("車両を登録しました")
      router.push("/admin/vehicles")
    } catch (error) {
      console.error("登録エラー:", error)
      alert("登録に失敗しました。もう一度お試しください。")
    } finally {
      setIsSubmitting(false)
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/vehicles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">車両新規登録</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 管理番号 */}
          <div>
            <Label htmlFor="managementNumber" className="flex items-center">
              管理番号
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="managementNumber"
              value={formData.managementNumber}
              onChange={(e) => handleChange("managementNumber", e.target.value)}
              placeholder="例）V00001"
              className={errors.managementNumber ? "border-red-500" : ""}
            />
            {errors.managementNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.managementNumber}</p>
            )}
          </div>

          {/* メーカー */}
          <div>
            <Label htmlFor="maker" className="flex items-center">
              メーカー
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="maker"
              value={formData.maker}
              onChange={(e) => handleChange("maker", e.target.value)}
              placeholder="例）いすゞ"
              className={errors.maker ? "border-red-500" : ""}
            />
            {errors.maker && (
              <p className="text-red-500 text-sm mt-1">{errors.maker}</p>
            )}
          </div>

          {/* 車種 */}
          <div>
            <Label htmlFor="bodyType" className="flex items-center">
              車種
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="bodyType"
              value={formData.bodyType}
              onChange={(e) => handleChange("bodyType", e.target.value)}
              placeholder="例）エルフ"
              className={errors.bodyType ? "border-red-500" : ""}
            />
            {errors.bodyType && (
              <p className="text-red-500 text-sm mt-1">{errors.bodyType}</p>
            )}
          </div>

          {/* サイズ */}
          <div>
            <Label htmlFor="size" className="flex items-center">
              サイズ
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="size"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
              placeholder="例）2t"
              className={errors.size ? "border-red-500" : ""}
            />
            {errors.size && (
              <p className="text-red-500 text-sm mt-1">{errors.size}</p>
            )}
          </div>

          {/* 価格 */}
          <div>
            <Label htmlFor="price" className="flex items-center">
              価格
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="例）1500000"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* 仕入れ価格 */}
          <div>
            <Label htmlFor="wholesalePrice" className="flex items-center">
              仕入れ価格
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="wholesalePrice"
              type="number"
              value={formData.wholesalePrice}
              onChange={(e) => handleChange("wholesalePrice", e.target.value)}
              placeholder="例）1200000"
              className={errors.wholesalePrice ? "border-red-500" : ""}
            />
            {errors.wholesalePrice && (
              <p className="text-red-500 text-sm mt-1">{errors.wholesalePrice}</p>
            )}
          </div>

          {/* 支払総額 */}
          <div>
            <Label htmlFor="totalPayment" className="flex items-center">
              支払総額
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="totalPayment"
              type="number"
              value={formData.totalPayment}
              onChange={(e) => handleChange("totalPayment", e.target.value)}
              placeholder="例）1300000"
              className={errors.totalPayment ? "border-red-500" : ""}
            />
            {errors.totalPayment && (
              <p className="text-red-500 text-sm mt-1">{errors.totalPayment}</p>
            )}
          </div>

          {/* 有効期限 */}
          <div>
            <Label htmlFor="expiryDate" className="flex items-center">
              有効期限
              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded">必須</span>
            </Label>
            <Input
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(e) => handleChange("expiryDate", e.target.value)}
              placeholder="例）2024年12月31日"
              className={errors.expiryDate ? "border-red-500" : ""}
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>
        </div>

        {/* 画像URL */}
        <div>
          <Label htmlFor="imageUrl">画像URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            placeholder="例）https://example.com/image.jpg"
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:opacity-50"
          >
            {isSubmitting ? "登録中..." : "車両を登録"}
          </Button>
          <Link href="/admin/vehicles">
            <Button
              type="button"
              variant="outline"
              className="px-8 py-2"
            >
              キャンセル
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
} 