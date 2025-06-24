"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Camera, Phone } from "lucide-react"
import { getVehicle, getVehicles } from "@/lib/firebase-utils"
import type { Vehicle } from "@/types"

export default function VehicleDetailPage() {
  const params = useParams()
  const vehicleId = params.id as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const fetchedVehicle = await getVehicle(vehicleId)
        if (fetchedVehicle) {
          setVehicle(fetchedVehicle)
          // 関連車両を取得（同じメーカーまたはボディタイプの車両）
          const allVehicles = await getVehicles()
          const related = allVehicles
            .filter(v => v.id !== vehicleId)
            .filter(v => 
              v.maker === fetchedVehicle.maker || 
              v.bodyType === fetchedVehicle.bodyType
            )
            .slice(0, 3)
          setRelatedVehicles(related)
        } else {
          setError("車両が見つかりませんでした")
        }
      } catch (err) {
        setError("車両の読み込みに失敗しました")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">エラー</h1>
            <p className="text-gray-600 mb-4">{error || "車両が見つかりませんでした"}</p>
            <Link href="/inventory">
              <Button>在庫一覧に戻る</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 text-lg">
            <span>{vehicle.managementNumber || vehicle.id}</span>
            <span>｜</span>
            <span>{vehicle.maker}</span>
            <span>｜</span>
            <span>{vehicle.bodyType || "---"}</span>
            <span>｜</span>
            <span>{vehicle.model}</span>
            <span>｜</span>
            <span>{String(vehicle.year || "")}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Vehicle Image */}
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={vehicle.imageUrls?.[0] || vehicle.imageUrl || "/placeholder.jpg"}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">DETAIL(車輌情報)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">メーカー</span>
                      <span>{vehicle.maker}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車種</span>
                      <span>{vehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">年式</span>
                      <span>{String(vehicle.year || "")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">走行距離</span>
                      <span>{vehicle.mileage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ボディタイプ</span>
                      <span>{vehicle.bodyType || "---"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">サイズ</span>
                      <span>{vehicle.size || "---"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">車検有効期限</span>
                      <span>{vehicle.inspectionDate || "---"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">車両価格</span>
                      <span className="font-bold text-blue-600">
                        ¥{(vehicle.price || 0).toLocaleString()}
                      </span>
                    </div>
                    {vehicle.totalPayment && (
                      <div className="flex justify-between">
                        <span className="font-medium">支払総額</span>
                        <span className="font-bold text-blue-600">
                          ¥{(vehicle.totalPayment || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {vehicle.wholesalePrice && (
                      <div className="flex justify-between">
                        <span className="font-medium">仕入れ価格</span>
                        <span>¥{(vehicle.wholesalePrice || 0).toLocaleString()}</span>
                      </div>
                    )}
                    {vehicle.expiryDate && (
                      <div className="flex justify-between">
                        <span className="font-medium">有効期限</span>
                        <span>{vehicle.expiryDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {vehicle.description && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">車両説明</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{vehicle.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Equipment */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">装備品</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vehicle.description && vehicle.description.includes("装備") ? (
                    <p className="text-gray-600">装備品情報は車両説明をご確認ください</p>
                  ) : (
                    <p className="text-gray-600">装備品情報はありません</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">価格情報</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">車両価格</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ¥{(vehicle.price || 0).toLocaleString()}
                    </span>
                  </div>
                  {vehicle.totalPayment && (
                    <div className="flex justify-between items-center">
                      <span>支払総額</span>
                      <span className="font-semibold">
                        ¥{(vehicle.totalPayment || 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  <Link href="/contact" className="w-full">
                    <Button className="w-full" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      お問い合わせ
                    </Button>
                  </Link>
                  <Link href="/assessment" className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      査定依頼
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Related Vehicles */}
            {relatedVehicles.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">関連車両</h3>
                  <div className="space-y-4">
                    {relatedVehicles.map((relatedVehicle) => (
                      <Link
                        key={relatedVehicle.id}
                        href={`/vehicle/${relatedVehicle.id}`}
                        className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={relatedVehicle.imageUrls?.[0] || relatedVehicle.imageUrl || "/placeholder.jpg"}
                            alt={relatedVehicle.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{relatedVehicle.name}</h4>
                            <p className="text-xs text-gray-600">{relatedVehicle.maker}</p>
                            <p className="text-xs text-gray-600">{String(relatedVehicle.year || "")}</p>
                            <p className="text-sm font-bold text-blue-600">
                              ¥{(relatedVehicle.price || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}









