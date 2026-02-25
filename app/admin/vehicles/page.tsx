"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { getAllVehicles, getAllVehiclesCount, getAllVehiclesPage, deleteVehicle, updateVehicle } from "@/lib/firebase-utils"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminVehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  
  // 検索フィルター用の状態
  const [selectedMaker, setSelectedMaker] = useState<string>("all")
  const [selectedBodyType, setSelectedBodyType] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [freeWordSearch, setFreeWordSearch] = useState<string>("")
  const [debouncedFreeWordSearch, setDebouncedFreeWordSearch] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageCursors, setPageCursors] = useState<Record<number, any>>({})
  const [isPageLoading, setIsPageLoading] = useState(false)
  const vehiclesPerPage = 50
  
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

  // 固定の選択肢（指定に合わせて統一）
  const fixedMakers = [
    "日野",
    "いすゞ",
    "三菱ふそう",
    "UD",
    "トヨタ",
    "日産",
    "マツダ",
    "その他",
  ]

  const fixedBodyTypes = [
    "クレーン",
    "ダンプ・ローダーダンプ",
    "ミキサー車",
    "アームロール",
    "重機回送車・セルフクレーン",
    "キャリアカー・車両運搬車",
    "高所作業車",
    "塵芥車",
    "平ボディ",
    "バン・ウイング",
    "冷蔵冷凍車",
    "特装車・その他",
  ]
  const fixedSizes = ["大型", "増トン", "中型", "小型"]

  const filters = useMemo(() => ({
    maker: selectedMaker,
    bodyType: selectedBodyType,
    size: selectedSize,
    status: selectedStatus
  }), [selectedMaker, selectedBodyType, selectedSize, selectedStatus])

  const useServerPaging = debouncedFreeWordSearch.trim() === ""
  const pageCursorsRef = useRef<Record<number, any>>({})

  useEffect(() => {
    pageCursorsRef.current = pageCursors
  }, [pageCursors])

  useEffect(() => {
    if (!useServerPaging) return
    let isActive = true
    const fetchPage = async () => {
      try {
        setLoading(true)
        setError(null)
        setPageCursors({})
        pageCursorsRef.current = {}
        const [count, pageResult] = await Promise.all([
          getAllVehiclesCount(filters),
          getAllVehiclesPage({
            pageSize: vehiclesPerPage,
            filters,
            sortField,
            sortDirection
          })
        ])
        if (!isActive) return
        setTotalCount(count)
        setVehicles(pageResult.vehicles)
        setCurrentPage(1)
        setPageCursors({ 1: pageResult.lastDoc })
        pageCursorsRef.current = { 1: pageResult.lastDoc }
      } catch (err) {
        console.error("車両取得エラーの詳細:", err)
        if (!isActive) return
        setError(`車両の読み込みに失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`)
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchPage()
    return () => {
      isActive = false
    }
  }, [useServerPaging, filters, sortField, sortDirection])

  useEffect(() => {
    if (useServerPaging) return
    let isActive = true
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedVehicles = await getAllVehicles()
        if (!isActive) return
        setVehicles(fetchedVehicles)
        setTotalCount(fetchedVehicles.length)
        setCurrentPage(1)
        setPageCursors({})
        pageCursorsRef.current = {}
      } catch (err) {
        console.error("車両取得エラーの詳細:", err)
        if (!isActive) return
        setError(`車両の読み込みに失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`)
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchAll()
    return () => {
      isActive = false
    }
  }, [useServerPaging])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFreeWordSearch(freeWordSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [freeWordSearch])

  // 検索フィルタリング
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles

    // メーカーフィルター
    if (selectedMaker && selectedMaker !== "all") {
      filtered = filtered.filter(vehicle => vehicle.maker === selectedMaker)
    }

    // ボディタイプフィルター
    if (selectedBodyType && selectedBodyType !== "all") {
      filtered = filtered.filter(vehicle => vehicle.bodyType === selectedBodyType)
    }

    // サイズフィルター
    if (selectedSize && selectedSize !== "all") {
      filtered = filtered.filter(vehicle => vehicle.size === selectedSize)
    }

    // 掲載状態フィルター
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(vehicle => {
        switch (selectedStatus) {
          case '公開':
            return !vehicle.isPrivate && !vehicle.isSoldOut && !vehicle.isTemporarySave
          case '非公開':
            return vehicle.isPrivate && !vehicle.isSoldOut && !vehicle.isTemporarySave
          case '商談中':
            return vehicle.isNegotiating
          case 'SOLD':
            return vehicle.isSoldOut
          case '一時保存':
            return vehicle.isTemporarySave
          default:
            return true
        }
      })
    }

    // フリーワード検索
    if (debouncedFreeWordSearch.trim()) {
      const query = debouncedFreeWordSearch.toLowerCase()
      filtered = filtered.filter(vehicle => {
        const inquiryNumber = (vehicle.inquiryNumber ? String(vehicle.inquiryNumber).toLowerCase() : "") || ""
        const chassisNumber = (vehicle.chassisNumber ? String(vehicle.chassisNumber).toLowerCase() : "") || ""
        const name = (vehicle.name ? String(vehicle.name).toLowerCase() : "") || ""
        const maker = (vehicle.maker ? String(vehicle.maker).toLowerCase() : "") || ""
        const model = (vehicle.model ? String(vehicle.model).toLowerCase() : "") || ""
        const description = (vehicle.description ? String(vehicle.description).toLowerCase() : "") || ""
        const bodyType = (vehicle.bodyType ? String(vehicle.bodyType).toLowerCase() : "") || ""
        const bodyMaker = (vehicle.bodyMaker ? String(vehicle.bodyMaker).toLowerCase() : "") || ""
        const bodyModel = (vehicle.bodyModel ? String(vehicle.bodyModel).toLowerCase() : "") || ""
        const bodyYear = (vehicle.bodyYear ? String(vehicle.bodyYear).toLowerCase() : "") || ""
        const equipment = (vehicle.equipment ? String(vehicle.equipment).toLowerCase() : "") || ""
        const inspectionStatus = (vehicle.inspectionStatus ? String(vehicle.inspectionStatus).toLowerCase() : "") || ""
        const inspectionDate = vehicle.inspectionDate ? (() => {
          try {
            const date = new Date(vehicle.inspectionDate)
            if (!isNaN(date.getTime())) {
              // 日付を複数の形式で検索可能にする
              const year = date.getFullYear()
              const month = date.getMonth() + 1
              const day = date.getDate()
              return `${year}年${month}月${day}日 ${year}/${month}/${day} ${year}-${month}-${day} ${String(vehicle.inspectionDate).toLowerCase()}`
            }
            return String(vehicle.inspectionDate).toLowerCase()
          } catch {
            return String(vehicle.inspectionDate).toLowerCase()
          }
        })() : ""
        
        return inquiryNumber.includes(query) || 
               chassisNumber.includes(query) || 
               name.includes(query) ||
               maker.includes(query) ||
               model.includes(query) ||
               description.includes(query) ||
               bodyType.includes(query) ||
               bodyMaker.includes(query) ||
               bodyModel.includes(query) ||
               bodyYear.includes(query) ||
               (vehicle.innerLength && String(vehicle.innerLength).includes(query)) ||
               (vehicle.innerWidth && String(vehicle.innerWidth).includes(query)) ||
               (vehicle.innerHeight && String(vehicle.innerHeight).includes(query)) ||
               equipment.includes(query) ||
               inspectionStatus.includes(query) ||
               inspectionDate.includes(query)
      })
    }
    
    return filtered
  }, [selectedMaker, selectedBodyType, selectedSize, selectedStatus, debouncedFreeWordSearch, vehicles])


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
  const sortedVehicles = useMemo(() => {
    if (!sortField) {
      // デフォルトは作成日時の降順（最新が上）
      return [...filteredVehicles].sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime()
        const bDate = new Date(b.createdAt).getTime()
        return bDate - aDate
      })
    }

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
  }, [filteredVehicles, sortField, sortDirection])

  const totalItems = useServerPaging ? totalCount : sortedVehicles.length
  const totalPages = Math.max(1, Math.ceil(totalItems / vehiclesPerPage))
  const startIndex = (currentPage - 1) * vehiclesPerPage
  const endIndex = startIndex + vehiclesPerPage
  const paginatedVehicles = useServerPaging
    ? sortedVehicles
    : sortedVehicles.slice(startIndex, endIndex)

  useEffect(() => {
    if (useServerPaging) return
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [useServerPaging, selectedMaker, selectedBodyType, selectedSize, selectedStatus, debouncedFreeWordSearch, sortField, sortDirection, currentPage])

  const visiblePages = useMemo(() => {
    const maxPageButtons = 10
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const half = Math.floor(maxPageButtons / 2)
    let start = Math.max(1, currentPage - half)
    let end = start + maxPageButtons - 1
    if (end > totalPages) {
      end = totalPages
      start = end - maxPageButtons + 1
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  const handlePageChange = async (page: number) => {
    if (!useServerPaging) {
      setCurrentPage(page)
      return
    }
    if (page < 1 || page > totalPages) return
    if (isPageLoading) return
    setIsPageLoading(true)
    try {
      let cursor = null
      if (page > 1) {
        const existingCursor = pageCursorsRef.current[page - 1]
        if (existingCursor) {
          cursor = existingCursor
        } else {
          const nextCursors = { ...pageCursorsRef.current }
          let lastDoc = null
          for (let p = 1; p < page; p += 1) {
            if (nextCursors[p]) {
              lastDoc = nextCursors[p]
              continue
            }
            const result = await getAllVehiclesPage({
              pageSize: vehiclesPerPage,
              cursor: lastDoc,
              filters,
              sortField,
              sortDirection
            })
            nextCursors[p] = result.lastDoc
            lastDoc = result.lastDoc
          }
          setPageCursors(nextCursors)
          pageCursorsRef.current = nextCursors
          cursor = nextCursors[page - 1] || null
        }
      }
      const pageResult = await getAllVehiclesPage({
        pageSize: vehiclesPerPage,
        cursor,
        filters,
        sortField,
        sortDirection
      })
      setVehicles(pageResult.vehicles)
      setPageCursors(prev => {
        const next = { ...prev, [page]: pageResult.lastDoc }
        pageCursorsRef.current = next
        return next
      })
      setCurrentPage(page)
    } catch (err) {
      console.error("車両取得エラーの詳細:", err)
      setError("車両の読み込みに失敗しました。")
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    if (paginatedVehicles.length === 0) return
    setEditingValues(prev => {
      const next = { ...prev }
      let didChange = false
      paginatedVehicles.forEach(vehicle => {
        if (!vehicle.id || next[vehicle.id]) return
        next[vehicle.id] = {
          wholesalePrice: vehicle.wholesalePrice ? formatNumberWithCommas(vehicle.wholesalePrice) : "",
          price: vehicle.price ? formatNumberWithCommas(vehicle.price) : "",
          totalPayment: vehicle.totalPayment ? formatNumberWithCommas(vehicle.totalPayment) : ""
        }
        didChange = true
      })
      return didChange ? next : prev
    })
  }, [paginatedVehicles])

  if (loading && vehicles.length === 0) {
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

      {/* 検索フィルター */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* メーカー */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メーカー</label>
            <Select value={selectedMaker} onValueChange={setSelectedMaker}>
              <SelectTrigger>
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {fixedMakers.map((maker) => (
                  <SelectItem key={maker} value={maker}>{maker}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ボディタイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ボディタイプ</label>
            <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
              <SelectTrigger>
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {fixedBodyTypes.map((bodyType) => (
                  <SelectItem key={bodyType} value={bodyType}>{bodyType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* サイズ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">サイズ</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {fixedSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 掲載状態 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">掲載状態</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="公開">公開</SelectItem>
                <SelectItem value="非公開">非公開</SelectItem>
                <SelectItem value="商談中">商談中</SelectItem>
                <SelectItem value="SOLD">SOLD</SelectItem>
                <SelectItem value="一時保存">一時保存</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* フリーワード検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">フリーワード</label>
            <Input
              type="text"
              placeholder="車名、問い合わせ番号など..."
              value={freeWordSearch}
              onChange={(e) => setFreeWordSearch(e.target.value)}
            />
          </div>
        </div>

        {/* フィルタークリアボタン */}
        {(selectedMaker !== "all" || selectedBodyType !== "all" || selectedSize !== "all" || selectedStatus !== "all" || freeWordSearch) && (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedMaker("all")
                setSelectedBodyType("all")
                setSelectedSize("all")
                setSelectedStatus("all")
                setFreeWordSearch("")
              }}
              className="px-4 py-2"
            >
              フィルターをクリア
            </Button>
            <p className="text-sm text-gray-600">
              検索結果: {filteredVehicles.length}件
            </p>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right whitespace-nowrap">操作</TableHead>
              <TableHead className="whitespace-nowrap">問合せ番号</TableHead>
              <TableHead className="whitespace-nowrap">基本情報</TableHead>
              <TableHead className="whitespace-nowrap">金額</TableHead>
              <TableHead className="whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('inspectionDate')}>
                  <span className="whitespace-nowrap">車検有効期限</span>
                  <span className="text-xs whitespace-nowrap">
                    {sortField === 'inspectionDate' 
                      ? (sortDirection === 'asc' ? '↑' : '↓')
                      : '↕'
                    }
                  </span>
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('negotiationDeadline')}>
                  <span className="whitespace-nowrap">商談期限</span>
                  <span className="text-xs whitespace-nowrap">
                    {sortField === 'negotiationDeadline' 
                      ? (sortDirection === 'asc' ? '↑' : '↓')
                      : '↕'
                    }
                  </span>
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap">状態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVehicles.map((vehicle, index) => (
              <TableRow key={vehicle.id}>
                <TableCell className="text-right whitespace-nowrap">
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
                <TableCell className="align-top whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium whitespace-nowrap">{vehicle.inquiryNumber || "---"}</div>
                    {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
                      <div className="relative w-24 h-16">
                        <Image
                          src={vehicle.imageUrls[0]}
                          alt={`${vehicle.maker} ${vehicle.model}`}
                          fill
                          className="object-cover rounded"
                          loading="lazy"
                          sizes="96px"
                          onError={() => {
                            setImageErrors(prev => new Set(prev).add(vehicle.id!))
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500 whitespace-nowrap">写真なし</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top whitespace-nowrap">
                  <div className="flex flex-col text-sm gap-1">
                    <div className="whitespace-nowrap">{vehicle.maker || "---"}</div>
                    <div className="whitespace-nowrap">{vehicle.size || "---"}</div>
                    <div className="whitespace-nowrap">{vehicle.bodyType || "---"}</div>
                    <div className="whitespace-nowrap">{vehicle.chassisNumber || "---"}</div>
                  </div>
                </TableCell>
                <TableCell className="align-top whitespace-nowrap">
                  <div className="flex flex-col text-sm gap-1 whitespace-nowrap">
                    <label className="flex items-center gap-2">
                      <span className="text-gray-600">業販金額</span>
                      <input
                        type="text"
                        value={editingValues[vehicle.id!]?.wholesalePrice || ''}
                        onChange={(e) => handleValueChange(vehicle.id!, 'wholesalePrice', handleInputChange(e.target.value))}
                        className="w-28 border rounded px-2 py-1 text-sm"
                        placeholder="業販金額"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="text-gray-600">車両価格</span>
                      <input
                        type="text"
                        value={editingValues[vehicle.id!]?.price || ''}
                        onChange={(e) => handleValueChange(vehicle.id!, 'price', handleInputChange(e.target.value))}
                        className="w-28 border rounded px-2 py-1 text-sm"
                        placeholder="車両価格"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="text-gray-600">車両総額</span>
                      <input
                        type="text"
                        value={editingValues[vehicle.id!]?.totalPayment || ''}
                        onChange={(e) => handleValueChange(vehicle.id!, 'totalPayment', handleInputChange(e.target.value))}
                        className="w-28 border rounded px-2 py-1 text-sm"
                        placeholder="車両総額"
                      />
                    </label>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {vehicle.inspectionStatus && vehicle.inspectionDate 
                    ? `${vehicle.inspectionStatus} ${vehicle.inspectionDate}`
                    : vehicle.inspectionStatus || vehicle.inspectionDate || "---"
                  }
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {vehicle.isNegotiating
                    ? (
                        (vehicle.salesRepresentative || vehicle.negotiationDeadline)
                          ? `${vehicle.salesRepresentative || ''}${vehicle.salesRepresentative && vehicle.negotiationDeadline ? ' ' : ''}${vehicle.negotiationDeadline || ''}`
                          : '---'
                      )
                    : '---'}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {vehicle.isTemporarySave && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        一時保存
                      </span>
                    )}
                    {vehicle.isSoldOut && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        SOLD OUT
                      </span>
                    )}
                    {!vehicle.isTemporarySave && (
                      vehicle.isPrivate ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          非公開
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          公開
                        </span>
                      )
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isPageLoading}
          >
            前へ
          </Button>
          {visiblePages.map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              disabled={isPageLoading}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || isPageLoading}
          >
            次へ
          </Button>
        </div>
      )}

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