"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getVehicles, deleteVehicle, updateVehicle, testFirebaseConnection } from "@/lib/firebase-utils"
import type { Vehicle } from "@/types"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { formatNumberWithCommas, formatInputWithCommas } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  // インライン編集用の状態
  const [editingValues, setEditingValues] = useState<{
    [key: string]: { wholesalePrice: string; price: string; totalPayment: string }
  }>({})
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState<{[key: string]: boolean}>({})
  
  // 画像エラー状態を管理
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  
  // ソート状態管理
  const [sortField, setSortField] = useState<'inspectionDate' | 'negotiationDeadline' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        console.log("車両データ取得開始...")
        
        // Firebase接続テスト
        const connectionTest = await testFirebaseConnection()
        console.log("Firebase接続テスト結果:", connectionTest)
        
        if (!connectionTest) {
          throw new Error("Firebase接続に失敗しました")
        }
        
        const fetchedVehicles = await getVehicles()
        console.log("取得した車両数:", fetchedVehicles.length)
        setVehicles(fetchedVehicles)
        setFilteredVehicles(fetchedVehicles)
        
        // 初期編集値を設定
        const initialEditingValues: { [key: string]: { wholesalePrice: string; price: string; totalPayment: string } } = {}
        fetchedVehicles.forEach(vehicle => {
          if (vehicle.id) {
            initialEditingValues[vehicle.id] = {
              wholesalePrice: vehicle.wholesalePrice ? formatNumberWithCommas(vehicle.wholesalePrice) : '',
              price: vehicle.price ? formatNumberWithCommas(vehicle.price) : '',
              totalPayment: vehicle.totalPayment ? formatNumberWithCommas(vehicle.totalPayment) : ''
            }
          }
        })
        setEditingValues(initialEditingValues)
        
        setError(null)
      } catch (err) {
        console.error("車両取得エラーの詳細:", err)
        setError(`車両の読み込みに失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // 検索フィルタリング
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles)
      return
    }

    const filtered = vehicles.filter(vehicle => {
      const query = searchQuery.toLowerCase()
      const inquiryNumber = vehicle.inquiryNumber?.toLowerCase() || ""
      const chassisNumber = vehicle.chassisNumber?.toLowerCase() || ""
      
      return inquiryNumber.includes(query) || chassisNumber.includes(query)
    })
    
    setFilteredVehicles(filtered)
  }, [searchQuery, vehicles])

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const confirmDelete = async () => {
    if (selectedVehicle && selectedVehicle.id) {
      try {
        await deleteVehicle(selectedVehicle.id)
        setVehicles(vehicles.filter((v) => v.id !== selectedVehicle.id))
        setSelectedVehicle(null)
      } catch (err) {
        setError("車両の削除に失敗しました。")
        console.error(err)
      }
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/vehicles/${id}/edit`)
  }

  // 編集値の変更を処理
  const handleValueChange = (vehicleId: string, field: 'wholesalePrice' | 'price' | 'totalPayment', value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [field]: value
      }
    }))
    setHasChanges(prev => ({
      ...prev,
      [vehicleId]: true
    }))
  }

  // 個別保存処理
  const handleSave = async (vehicleId: string) => {
    try {
      setSaving(true)
      
      const vehicle = vehicles.find(v => v.id === vehicleId)
      const editingValue = editingValues[vehicleId]
      if (!vehicle || !editingValue) return

      const updates: any = {}
      let hasUpdates = false

      // 業販金額の更新
      const newWholesalePrice = Number(editingValue.wholesalePrice.replace(/,/g, '')) || 0
      if (newWholesalePrice !== vehicle.wholesalePrice) {
        updates.wholesalePrice = newWholesalePrice
        hasUpdates = true
      }

      // 車両価格の更新
      const newPrice = Number(editingValue.price.replace(/,/g, '')) || 0
      if (newPrice !== vehicle.price) {
        updates.price = newPrice
        hasUpdates = true
      }

      // 車両総額の更新
      const newTotalPayment = Number(editingValue.totalPayment.replace(/,/g, '')) || 0
      if (newTotalPayment !== vehicle.totalPayment) {
        updates.totalPayment = newTotalPayment
        hasUpdates = true
      }

      if (hasUpdates) {
        updates.updatedAt = new Date()
        await updateVehicle(vehicleId, updates)
        
        // ローカル状態を更新
        setVehicles(prev => prev.map(v => 
          v.id === vehicleId 
            ? { ...v, ...updates }
            : v
        ))

        // 編集値を更新
        setEditingValues(prev => ({
          ...prev,
          [vehicleId]: {
            wholesalePrice: formatNumberWithCommas(newWholesalePrice),
            price: formatNumberWithCommas(newPrice),
            totalPayment: formatNumberWithCommas(newTotalPayment)
          }
        }))

        setHasChanges(prev => ({
          ...prev,
          [vehicleId]: false
        }))
      }
    } catch (err) {
      setError("価格の更新に失敗しました。")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // 入力値のフォーマット処理
  const handleInputChange = (value: string) => {
    return formatInputWithCommas(value)
  }

  // ソート処理
  const handleSort = (field: 'inspectionDate' | 'negotiationDeadline') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // ソートされた車両リストを取得
  const getSortedVehicles = () => {
    if (!sortField) return filteredVehicles

    return [...filteredVehicles].sort((a, b) => {
      let aValue: string = ''
      let bValue: string = ''

      if (sortField === 'inspectionDate') {
        aValue = a.inspectionDate || ''
        bValue = b.inspectionDate || ''
      } else if (sortField === 'negotiationDeadline') {
        aValue = a.negotiationDeadline || ''
        bValue = b.negotiationDeadline || ''
      }

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mb-6" />
        <div className="rounded-md border">
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-20 w-32" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            ページを再読み込み
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">車両一覧</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push("/admin/vehicles/import")}
          >
            CSV一括インポート
          </Button>
          <Button onClick={() => router.push("/admin/vehicles/new")}>
            新規車両登録
          </Button>
        </div>
      </div>

      {/* 検索欄 */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="問い合わせ番号または車体番号で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="px-4 py-2"
            >
              クリア
            </Button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            検索結果: {filteredVehicles.length}件
          </p>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>問い合わせ番号</TableHead>
              <TableHead>メーカー</TableHead>
              <TableHead>ボディタイプ</TableHead>
              <TableHead>サイズ</TableHead>
              <TableHead>車体番号</TableHead>
              <TableHead>業販金額</TableHead>
              <TableHead>車両価格</TableHead>
              <TableHead>車両総額</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('inspectionDate')}>
                  <span>車検有効期限</span>
                  <span className="text-xs">
                    {sortField === 'inspectionDate' 
                      ? (sortDirection === 'asc' ? '↑' : '↓')
                      : '↕'
                    }
                  </span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('negotiationDeadline')}>
                  <span>商談期限</span>
                  <span className="text-xs">
                    {sortField === 'negotiationDeadline' 
                      ? (sortDirection === 'asc' ? '↑' : '↓')
                      : '↕'
                    }
                  </span>
                </div>
              </TableHead>
              <TableHead>非公開</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedVehicles().map((vehicle, index) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.inquiryNumber || "---"}</TableCell>
                <TableCell>{vehicle.maker}</TableCell>
                <TableCell>{vehicle.bodyType || "---"}</TableCell>
                <TableCell>{vehicle.size || "---"}</TableCell>
                <TableCell>{vehicle.chassisNumber || "---"}</TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={editingValues[vehicle.id!]?.wholesalePrice || ''}
                    onChange={(e) => handleValueChange(vehicle.id!, 'wholesalePrice', handleInputChange(e.target.value))}
                    className="w-24 border rounded px-2 py-1 text-sm"
                    placeholder="業販金額"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={editingValues[vehicle.id!]?.price || ''}
                    onChange={(e) => handleValueChange(vehicle.id!, 'price', handleInputChange(e.target.value))}
                    className="w-24 border rounded px-2 py-1 text-sm"
                    placeholder="価格"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={editingValues[vehicle.id!]?.totalPayment || ''}
                    onChange={(e) => handleValueChange(vehicle.id!, 'totalPayment', handleInputChange(e.target.value))}
                    className="w-24 border rounded px-2 py-1 text-sm"
                    placeholder="総額"
                  />
                </TableCell>
                <TableCell>
                  {vehicle.inspectionStatus && vehicle.inspectionDate 
                    ? `${vehicle.inspectionStatus} ${vehicle.inspectionDate}`
                    : vehicle.inspectionStatus || vehicle.inspectionDate || "---"
                  }
                </TableCell>
                <TableCell>
                  {vehicle.salesRepresentative && vehicle.negotiationDeadline
                    ? `${vehicle.salesRepresentative} ${vehicle.negotiationDeadline}`
                    : vehicle.salesRepresentative || vehicle.negotiationDeadline || "---"
                  }
                </TableCell>
                <TableCell>
                  {vehicle.isTemporarySave ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      一時保存
                    </span>
                  ) : vehicle.isPrivate ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      非公開
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      公開
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {hasChanges[vehicle.id!] && (
                      <Button
                        onClick={() => handleSave(vehicle.id!)}
                        disabled={saving}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {saving ? "保存中..." : "保存"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vehicle.id!)}
                    >
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(vehicle)}
                    >
                      削除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedVehicle && (
        <AlertDialog open onOpenChange={() => setSelectedVehicle(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                「{selectedVehicle.name}
                」を削除すると、元に戻すことはできません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
} 