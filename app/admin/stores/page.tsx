"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Store } from "@/lib/store-data"

export default function StoresPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      // キャッシュを無効化するためのタイムスタンプを追加
      const timestamp = Date.now()
      console.log(`Fetching stores at ${timestamp}`)
      
      const response = await fetch(`/api/stores?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (!response.ok) {
        throw new Error('店舗一覧の取得に失敗しました')
      }
      const data = await response.json()
      console.log('Fetched stores:', data)
      
      // APIから取得したデータをlocalStorageに保存して同期
      if (typeof window !== 'undefined') {
        localStorage.setItem('store_data', JSON.stringify(data))
      }
      
      setStores(data)
    } catch (error) {
      console.error('店舗一覧取得エラー:', error)
      setError(error instanceof Error ? error.message : '不明なエラー')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  // URLパラメータの変更を監視（編集・削除後のリフレッシュ用）
  useEffect(() => {
    const refresh = searchParams.get('refresh')
    if (refresh === 'true') {
      fetchStores()
      // パラメータをクリア
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('refresh')
      router.replace(newUrl.pathname, { scroll: false })
    }
  }, [searchParams, fetchStores, router])

  // ページがフォーカスされた時に再読み込み
  useEffect(() => {
    const handleFocus = () => {
      fetchStores()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchStores])

  // 手動リフレッシュ機能
  const handleRefresh = () => {
    fetchStores()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">店舗一覧</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200"
          >
            更新
          </Button>
          <Link href="/admin/stores/new">
            <Button className="bg-gray-600 hover:bg-gray-700 text-white">
              新規店舗登録
            </Button>
          </Link>
        </div>
      </div>

      {/* 検索フォーム */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="キーワード検索"
            className="flex-1 border rounded px-2 py-1"
          />
          <Button className="bg-gray-600 hover:bg-gray-700 text-white">
            検索
          </Button>
        </div>
      </div>

      {/* 店舗一覧テーブル */}
      <div className="bg-white rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p>店舗一覧を読み込み中...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>エラー: {error}</p>
            <Button onClick={fetchStores} className="mt-2">
              再試行
            </Button>
          </div>
        ) : stores.length === 0 ? (
          <div className="p-8 text-center">
            <p>店舗が登録されていません</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">店舗名</th>
                <th className="px-4 py-3 text-left">住所</th>
                <th className="px-4 py-3 text-left">電話番号</th>
                <th className="px-4 py-3 text-left">営業時間</th>
                <th className="px-4 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-4 py-3">{store.name}</td>
                  <td className="px-4 py-3">{store.address}</td>
                  <td className="px-4 py-3">{store.phone}</td>
                  <td className="px-4 py-3">{store.businessHours}</td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/stores/${store.id}/edit`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        編集
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} 