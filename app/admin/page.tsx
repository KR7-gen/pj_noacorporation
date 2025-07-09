"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getVehicles, deleteVehicle } from "@/lib/firebase-utils"
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

export default function AdminVehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const fetchedVehicles = await getVehicles()
        setVehicles(fetchedVehicles)
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>写真</TableHead>
              <TableHead>管理番号</TableHead>
              <TableHead>メーカー</TableHead>
              <TableHead>車種</TableHead>
              <TableHead>型式</TableHead>
              <TableHead>年式</TableHead>
              <TableHead>ボディタイプ</TableHead>
              <TableHead>大きさ</TableHead>
              <TableHead>積載量</TableHead>
              <TableHead>車検有効期限</TableHead>
              <TableHead>車両価格</TableHead>
              <TableHead>支払総額</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
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
                  />
                </TableCell>
                <TableCell>{vehicle.managementNumber || vehicle.id}</TableCell>
                <TableCell>{vehicle.maker}</TableCell>
                <TableCell>{vehicle.model || "---"}</TableCell>
                <TableCell>{vehicle.modelCode || "---"}</TableCell>
                <TableCell>{vehicle.year || "---"}</TableCell>
                <TableCell>{vehicle.bodyType || "---"}</TableCell>
                <TableCell>{vehicle.size || "---"}</TableCell>
                <TableCell>{vehicle.loadingCapacity ? `${vehicle.loadingCapacity}kg` : "---"}</TableCell>
                <TableCell>{vehicle.inspectionDate || "---"}</TableCell>
                <TableCell>
                  {vehicle.price ? `${vehicle.price.toLocaleString()}円` : "---"}
                </TableCell>
                <TableCell>
                  {vehicle.totalPayment
                    ? `${vehicle.totalPayment.toLocaleString()}円`
                    : "---"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
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