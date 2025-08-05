"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BusinessHours {
  [key: string]: {
    start: string
    end: string
    closed: boolean
  }
}

export default function StoreCreatePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    tel: "",
    fax: "",
    businessHours: {
      monday: { start: "09:00", end: "18:00", closed: false },
      tuesday: { start: "09:00", end: "18:00", closed: false },
      wednesday: { start: "09:00", end: "18:00", closed: false },
      thursday: { start: "09:00", end: "18:00", closed: false },
      friday: { start: "09:00", end: "18:00", closed: false },
      saturday: { start: "10:00", end: "17:00", closed: false },
      sunday: { start: "10:00", end: "17:00", closed: true }
    } as BusinessHours
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // 営業時間データを整形
      const businessHoursData = {}
      Object.keys(formData.businessHours).forEach(day => {
        const dayData = formData.businessHours[day]
        businessHoursData[day] = {
          start: dayData.start,
          end: dayData.end,
          closed: dayData.closed
        }
      })
      
      // 保存用データを準備
      const saveData = {
        name: formData.name,
        address: formData.address,
        tel: formData.tel,
        fax: formData.fax,
        businessHours: businessHoursData
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">店舗登録</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">店舗名</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="例：○○店"
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
                placeholder="例：東京都渋谷区○○1-1-1"
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
                placeholder="例：000-0000-0000"
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
                placeholder="例：000-0000-0000"
                value={formData.fax}
                onChange={(e) => handleInputChange('fax', e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">営業時間</h3>
              <div className="space-y-4">
                {[
                  { day: "月曜日", key: "monday" },
                  { day: "火曜日", key: "tuesday" },
                  { day: "水曜日", key: "wednesday" },
                  { day: "木曜日", key: "thursday" },
                  { day: "金曜日", key: "friday" },
                  { day: "土曜日", key: "saturday" },
                  { day: "日曜日", key: "sunday" }
                ].map(({ day, key }) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        checked={!formData.businessHours[key].closed}
                        onChange={(e) => handleBusinessHoursChange(key, 'closed', !e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={`day-${day}`}>{day}</label>
                    </div>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                      value={formData.businessHours[key].start}
                      onChange={(e) => handleBusinessHoursChange(key, 'start', e.target.value)}
                    />
                    <span>〜</span>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                      value={formData.businessHours[key].end}
                      onChange={(e) => handleBusinessHoursChange(key, 'end', e.target.value)}
                    />
                  </div>
                ))}
              </div>
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