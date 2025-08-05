"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { DetailedStore } from "@/lib/store-data"

export default function StoreEditPage() {
  const router = useRouter()
  const params = useParams()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storeData, setStoreData] = useState<DetailedStore | null>(null)
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
    }
  })

  // 店舗データを取得
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true)
        const storeId = params.id
        const response = await fetch(`/api/stores/${storeId}`)
        
        if (!response.ok) {
          throw new Error('店舗データの取得に失敗しました')
        }
        
        const data = await response.json()
        setStoreData(data)
        setFormData({
          name: data.name,
          address: data.address,
          tel: data.tel,
          fax: data.fax,
          businessHours: data.businessHours
        })
      } catch (error) {
        console.error('店舗データ取得エラー:', error)
        setError(error instanceof Error ? error.message : '不明なエラー')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchStoreData()
    }
  }, [params.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const storeId = params.id
      console.log(`店舗ID ${storeId} を削除中...`)
      
      // 実際のAPI呼び出し
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '削除に失敗しました')
      }
      
      const result = await response.json()
      console.log("店舗の削除が完了しました:", result.message)
      
      // 削除成功後の処理
      console.log("削除成功:", result.message)
      
      // 成功メッセージを表示してから遷移
      alert("店舗が正常に削除されました")
      
      // 一覧ページに遷移（リフレッシュパラメータ付き）
      console.log("一覧ページに遷移します")
      router.push('/admin/stores?refresh=true')
    } catch (error) {
      console.error("店舗の削除に失敗しました:", error)
      alert(`店舗の削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const storeId = params.id
      console.log(`店舗ID ${storeId} を保存中...`)
      
      // 営業時間データを整形
      const businessHoursData = {}
      Object.keys(formData.businessHours).forEach(day => {
        const dayData = formData.businessHours[day]
        businessHoursData[day] = {
          start: dayData.start,
          end: dayData.end,
          closed: dayData.closed // そのまま使用
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
      
      console.log('Saving data:', saveData)
      
      // API呼び出し
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '保存に失敗しました')
      }
      
      const result = await response.json()
      console.log("店舗の保存が完了しました:", result.message)
      
      // 成功メッセージを表示
      alert("店舗情報が正常に保存されました")
      
      // 一覧ページに戻る（リフレッシュパラメータ付き）
      router.push("/admin/stores?refresh=true")
      
    } catch (error) {
      console.error("店舗の保存に失敗しました:", error)
      alert(`店舗の保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsSaving(false)
    }
  }

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

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>店舗データを読み込み中...</p>
        </div>
      </div>
    )
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラー: {error}</p>
          <Button onClick={() => window.location.reload()}>
            再読み込み
          </Button>
        </div>
      </div>
    )
  }

  // データが取得できていない場合
  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>店舗データが見つかりません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">店舗編集</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>店舗を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消すことができません。店舗「{storeData.name}」を完全に削除します。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "削除中..." : "削除"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
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
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 