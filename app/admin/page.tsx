"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getVehicles, deleteVehicle, updateVehicle } from "@/lib/firebase-utils"
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

export default function AdminPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  // インライン編集用の状態
  const [editingField, setEditingField] = useState<{
    vehicleId: string;
    field: 'price' | 'totalPayment' | 'wholesalePrice';
  } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const fetchedVehicles = await getVehicles()
        setVehicles(fetchedVehicles)
        setFilteredVehicles(fetchedVehicles)
        setError(null)
      } catch (err) {
        setError("車両の読み込みに失敗しました。")
        console.error(err)
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

  // インライン編集開始
  const startEditing = (vehicleId: string, field: 'price' | 'totalPayment' | 'wholesalePrice', currentValue: number) => {
    setEditingField({ vehicleId, field })
    setEditValue(formatNumberWithCommas(currentValue))
  }

  // インライン編集キャンセル
  const cancelEditing = () => {
    setEditingField(null)
    setEditValue("")
  }

  // インライン編集保存
  const saveEditing = async () => {
    if (!editingField) return

    try {
      setSaving(true)
      const numericValue = Number(editValue.replace(/,/g, ''))
      
      const updatedVehicle = {
        [editingField.field]: numericValue,
        updatedAt: new Date(),
      }

      await updateVehicle(editingField.vehicleId, updatedVehicle)
      
      // ローカル状態を更新
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === editingField.vehicleId 
          ? { ...vehicle, [editingField.field]: numericValue }
          : vehicle
      ))

      setEditingField(null)
      setEditValue("")
    } catch (err) {
      setError("価格の更新に失敗しました。")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // 入力値のフォーマット処理
  const handleEditValueChange = (value: string) => {
    const formattedValue = formatInputWithCommas(value)
    setEditValue(formattedValue)
  }

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>エラー: {error}</div>
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
              <TableHead>写真</TableHead>
              <TableHead>問い合わせ番号</TableHead>
              <TableHead>車体番号</TableHead>
              <TableHead>メーカー</TableHead>
              <TableHead>車種</TableHead>
              <TableHead>型式</TableHead>
              <TableHead>年式</TableHead>
              <TableHead>ボディタイプ</TableHead>
              <TableHead>大きさ</TableHead>
              <TableHead>積載量</TableHead>
              <TableHead>車検状態</TableHead>
              <TableHead>車検有効期限</TableHead>
              <TableHead>車両価格</TableHead>
              <TableHead>車両価格（税込）</TableHead>
              <TableHead>業販金額</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <Image
                    src={
                      vehicle.imageUrls?.[0] ||
                      vehicle.imageUrl ||
                      "/placeholder.jpg"
                    }
                    alt={`${vehicle.maker} ${vehicle.managementNumber || vehicle.id} の画像`}
                    width={120}
                    height={80}
                    className="rounded-md object-cover"
                    onError={(e) => {
                      console.log("画像読み込みエラー:", e.currentTarget.src);
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </TableCell>
                <TableCell>{vehicle.inquiryNumber || "---"}</TableCell>
                <TableCell>{vehicle.chassisNumber || "---"}</TableCell>
                <TableCell>{vehicle.maker || "---"}</TableCell>
                <TableCell>{vehicle.model || "---"}</TableCell>
                <TableCell>{vehicle.type || "---"}</TableCell>
                <TableCell>{vehicle.year || "---"}</TableCell>
                <TableCell>{vehicle.bodyType || "---"}</TableCell>
                <TableCell>{vehicle.size || "---"}</TableCell>
                <TableCell>{vehicle.loadCapacity || "---"}</TableCell>
                <TableCell>{vehicle.inspectionStatus || "---"}</TableCell>
                <TableCell>{vehicle.inspectionExpiry || "---"}</TableCell>
                <TableCell>
                  {editingField?.vehicleId === vehicle.id && editingField?.field === 'price' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => handleEditValueChange(e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing();
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <Button size="sm" onClick={saveEditing} disabled={saving}>保存</Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>キャンセル</Button>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => startEditing(vehicle.id!, 'price', vehicle.price || 0)}
                    >
                      {vehicle.price ? `¥${formatNumberWithCommas(vehicle.price)}` : "---"}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingField?.vehicleId === vehicle.id && editingField?.field === 'totalPayment' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => handleEditValueChange(e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing();
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <Button size="sm" onClick={saveEditing} disabled={saving}>保存</Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>キャンセル</Button>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => startEditing(vehicle.id!, 'totalPayment', vehicle.totalPayment || 0)}
                    >
                      {vehicle.totalPayment ? `¥${formatNumberWithCommas(vehicle.totalPayment)}` : "---"}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingField?.vehicleId === vehicle.id && editingField?.field === 'wholesalePrice' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => handleEditValueChange(e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing();
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <Button size="sm" onClick={saveEditing} disabled={saving}>保存</Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>キャンセル</Button>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => startEditing(vehicle.id!, 'wholesalePrice', vehicle.wholesalePrice || 0)}
                    >
                      {vehicle.wholesalePrice ? `¥${formatNumberWithCommas(vehicle.wholesalePrice)}` : "---"}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(vehicle.id!)}
                    >
                      編集
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
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

      {/* 削除確認ダイアログ */}
      <AlertDialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>車両を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消すことができません。車両「{selectedVehicle?.maker} {selectedVehicle?.model}」を削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 