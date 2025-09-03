"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// 移行用の初期データ
const initialStores = [
  {
    name: "株式会社Noa Corporation",
    address: "栃木県さくら市向河原3994-1",
    phone: "028-612-1472",
    businessHours: "月～日 09:00~17:00"
  },
  {
    name: "ノアコーポレーション 車両センター",
    address: "栃木県宇都宮市宮山田町406-4",
    phone: "028-612-1474",
    businessHours: "月～日 09:00~17:00"
  }
]

export default function StoreMigratePage() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)
  const [existingStores, setExistingStores] = useState<any[]>([])
  const [loadingExisting, setLoadingExisting] = useState(false)

  // 既存の店舗データを取得
  const fetchExistingStores = async () => {
    try {
      setLoadingExisting(true)
      const response = await fetch('/api/stores')
      if (response.ok) {
        const data = await response.json()
        setExistingStores(data)
        console.log('既存の店舗データ:', data)
      } else {
        console.error('店舗データ取得エラー:', response.status)
      }
    } catch (error) {
      console.error('店舗データ取得エラー:', error)
    } finally {
      setLoadingExisting(false)
    }
  }

  const handleMigration = async () => {
    setIsMigrating(true)
    setMigrationStatus(null)

    try {
      // 各店舗をFirebase Firestoreに追加
      const results = []
      
      for (const store of initialStores) {
        const response = await fetch('/api/stores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(store)
        })
        
        if (response.ok) {
          const result = await response.json()
          results.push({ success: true, store: store.name, id: result.storeId })
        } else {
          results.push({ success: false, store: store.name, error: '登録に失敗' })
        }
      }

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      if (failureCount === 0) {
        setMigrationStatus({
          success: true,
          message: `全${successCount}店舗の移行が完了しました`,
          details: results.map(r => `${r.store}: ${r.success ? '成功' : r.error}`).join('\n')
        })
      } else {
        setMigrationStatus({
          success: false,
          message: `${successCount}店舗成功、${failureCount}店舗失敗`,
          details: results.map(r => `${r.store}: ${r.success ? '成功' : r.error}`).join('\n')
        })
      }
    } catch (error) {
      setMigrationStatus({
        success: false,
        message: '移行中にエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">店舗データ移行</h1>
        <p className="text-gray-600 mt-2">
          既存の店舗データをFirebase Firestoreに移行します
        </p>
      </div>

      {/* 既存の店舗データ確認 */}
      <Card>
        <CardHeader>
          <CardTitle>既存の店舗データ</CardTitle>
          <CardDescription>
            現在Firebaseに保存されている店舗データ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={fetchExistingStores}
              disabled={loadingExisting}
              variant="outline"
              className="mb-4"
            >
              {loadingExisting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  取得中...
                </>
              ) : (
                '既存データを確認'
              )}
            </Button>
            
            {existingStores.length > 0 ? (
              existingStores.map((store: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold">ID: {store.id}</h3>
                  <p className="text-sm text-gray-600">{store.name}</p>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <p className="text-sm text-gray-600">TEL: {store.phone}</p>
                  <p className="text-sm text-gray-600">営業時間: {store.businessHours}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">店舗データがありません</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>移行対象データ</CardTitle>
          <CardDescription>
            以下の店舗データが移行されます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {initialStores.map((store, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold">{store.name}</h3>
                <p className="text-sm text-gray-600">{store.address}</p>
                <p className="text-sm text-gray-600">TEL: {store.phone}</p>
                <p className="text-sm text-gray-600">営業時間: {store.businessHours}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={handleMigration}
          disabled={isMigrating}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              移行中...
            </>
          ) : (
            '移行を開始'
          )}
        </Button>
      </div>

      {migrationStatus && (
        <Alert className={migrationStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {migrationStatus.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={migrationStatus.success ? "text-green-800" : "text-red-800"}>
            <div className="font-semibold">{migrationStatus.message}</div>
            {migrationStatus.details && (
              <pre className="mt-2 text-sm whitespace-pre-wrap">{migrationStatus.details}</pre>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mt-4"
        >
          戻る
        </Button>
      </div>
    </div>
  )
}
