"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function StoreCreatePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    tel: "",
    fax: "",
    businessHours: "月〜金 09:00~18:00"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // 保存用データを準備
      const saveData = {
        name: formData.name,
        address: formData.address,
        phone: formData.tel,
        businessHours: formData.businessHours
      }
      
      console.log('Creating store with data:', saveData)
      
      // API呼び出し（新規作成用のエンドポイント）
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '登録に失敗しました')
      }
      
      const result = await response.json()
      console.log("店舗の登録が完了しました:", result.message)
      
      // 成功メッセージを表示
      alert("店舗が正常に登録されました")
      
      // 一覧ページに戻る（リフレッシュパラメータ付き）
      router.push("/admin/stores?refresh=true")
      
    } catch (error) {
      console.error("店舗の登録に失敗しました:", error)
      alert(`店舗の登録に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">新規店舗登録</h1>
        <p className="text-gray-600 mt-2">
          新しい店舗の情報を入力してください
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">店舗名</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">住所</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">電話番号</label>
              <input
                type="tel"
                className="w-full border rounded px-2 py-1"
                value={formData.tel}
                onChange={(e) => handleInputChange('tel', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">FAX番号</label>
              <input
                type="tel"
                className="w-full border rounded px-2 py-1"
                value={formData.fax}
                onChange={(e) => handleInputChange('fax', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">営業時間</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={formData.businessHours}
                onChange={(e) => handleInputChange('businessHours', e.target.value)}
                placeholder="例: 月〜金 09:00~18:00"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="px-8" disabled={isSaving}>
              {isSaving ? "登録中..." : "登録"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 