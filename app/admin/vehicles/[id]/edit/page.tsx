"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getVehicle, updateVehicle } from "@/lib/firebase-utils"
import type { Vehicle } from "@/types"

// プルダウンの選択肢
const bodyTypes = [
  "クレーン",
  "ダンプ",
  "平ボディ",
  "車輌運搬車",
  "ミキサー車",
  "高所作業車",
  "アルミバン",
  "アルミウィング",
  "キャリアカー",
  "塵芥車",
  "アームロール",
  "バス",
  "冷蔵冷凍車",
  "タンクローリー",
  "特装車・その他"
]

const makers = [
  "日野",
  "いすゞ",
  "三菱ふそう",
  "UD",
  "その他"
]

const sizes = [
  "大型",
  "増トン",
  "中型",
  "小型"
]

const years = [
  "R7",
  "R6",
  "R5",
  "R4",
  "R3",
  "R2",
  "R1",
  "H31",
  "H30",
  "H29",
  "H28",
  "H27"
]

const missions = [
  "MT",
  "AT・SAT"
]

const shifts = [
  "5速",
  "6速",
  "7速",
  "12速"
]

const inspectionStatuses = [
  "有",
  "無"
]

const fuels = [
  "ディーゼル",
  "ガソリン",
  "ハイブリッド",
  "電気"
]

const turbos = [
  "有",
  "無"
]

const equipmentOptions = [
  "有",
  "無"
]

export default function VehicleEditPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const fetchedVehicle = await getVehicle(vehicleId)
        if (fetchedVehicle) {
          setVehicle(fetchedVehicle)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!vehicle) return

    try {
      setSaving(true)
      const formData = new FormData(e.currentTarget)
      
      const updatedVehicle: Partial<Vehicle> = {
        name: formData.get('name') as string,
        price: parseInt(formData.get('price') as string) || 0,
        totalPayment: parseInt(formData.get('totalPayment') as string) || 0,
        wholesalePrice: parseInt(formData.get('wholesalePrice') as string) || 0,
        bodyType: formData.get('bodyType') as string,
        maker: formData.get('maker') as string,
        size: formData.get('size') as string,
        model: formData.get('model') as string,
        modelCode: formData.get('modelCode') as string,
        year: formData.get('year') as string,
        mileage: formData.get('mileage') as string,
        loadingCapacity: parseInt(formData.get('loadingCapacity') as string) || 0,
        mission: formData.get('mission') as string,
        shift: formData.get('shift') as string,
        inspectionStatus: formData.get('inspectionStatus') as string,
        inspectionDate: formData.get('inspectionDate') as string,
        outerLength: parseInt(formData.get('outerLength') as string) || 0,
        outerWidth: parseInt(formData.get('outerWidth') as string) || 0,
        outerHeight: parseInt(formData.get('outerHeight') as string) || 0,
        innerLength: parseInt(formData.get('innerLength') as string) || 0,
        innerWidth: parseInt(formData.get('innerWidth') as string) || 0,
        innerHeight: parseInt(formData.get('innerHeight') as string) || 0,
        totalWeight: parseInt(formData.get('totalWeight') as string) || 0,
        engineModel: formData.get('engineModel') as string,
        horsepower: parseInt(formData.get('horsepower') as string) || 0,
        turbo: formData.get('turbo') as string,
        displacement: parseInt(formData.get('displacement') as string) || 0,
        fuel: formData.get('fuel') as string,
        inquiryNumber: formData.get('inquiryNumber') as string,
        chassisNumber: formData.get('chassisNumber') as string,
        bodyMaker: formData.get('bodyMaker') as string,
        bodyModel: formData.get('bodyModel') as string,
        bodyYear: formData.get('bodyYear') as string,
        equipment: formData.get('equipment') as string,
        etc: formData.get('etc') as string,
        backCamera: formData.get('backCamera') as string,
        recordBook: formData.get('recordBook') as string,
        powerWindow: formData.get('powerWindow') as string,
        driveRecorder: formData.get('driveRecorder') as string,
        airConditioner: formData.get('airConditioner') as string,
        electricMirror: formData.get('electricMirror') as string,
        abs: formData.get('abs') as string,
        aluminumWheel: formData.get('aluminumWheel') as string,
        airSuspensionSeat: formData.get('airSuspensionSeat') as string,
        carNavigation: formData.get('carNavigation') as string,
        dpf: formData.get('dpf') as string,
        pmMuffler: formData.get('pmMuffler') as string,
        centralDoorLock: formData.get('centralDoorLock') as string,
        description: formData.get('description') as string,
        updatedAt: new Date()
      }

      await updateVehicle(vehicleId, updatedVehicle)
      router.push('/admin/vehicles')
    } catch (err) {
      setError("車両の更新に失敗しました")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">読み込み中...</div>
  }

  if (error || !vehicle) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-gray-600 mb-4">{error || "車両が見つかりませんでした"}</p>
          <Button onClick={() => router.push('/admin/vehicles')}>
            車両一覧に戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">車両編集</h1>
        <Button variant="outline" onClick={() => router.push('/admin/vehicles')}>
          一覧に戻る
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">基本情報</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">管理番号</label>
                <input
                  type="text"
                  name="managementNumber"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.managementNumber || ''}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">トラック名</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.name || ''}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">車両価格（税抜）</label>
                <input
                  type="number"
                  name="price"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.price || 0}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">支払総額（税抜）</label>
                <input
                  type="number"
                  name="totalPayment"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.totalPayment || 0}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">業販金額</label>
                <input
                  type="number"
                  name="wholesalePrice"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.wholesalePrice || 0}
                />
              </div>
            </div>
          </div>

          {/* 車両情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">車両情報</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">ボディタイプ</label>
                  <select
                    name="bodyType"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.bodyType || ''}
                  >
                    <option value="">選択</option>
                    {bodyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">メーカー</label>
                  <select
                    name="maker"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.maker || ''}
                  >
                    <option value="">選択</option>
                    {makers.map((maker) => (
                      <option key={maker} value={maker}>{maker}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">大きさ</label>
                  <select
                    name="size"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.size || ''}
                  >
                    <option value="">選択</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車種</label>
                  <input
                    type="text"
                    name="model"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.model || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">型式</label>
                  <input
                    type="text"
                    name="modelCode"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.modelCode || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">年式</label>
                  <select
                    name="year"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.year || ''}
                  >
                    <option value="">選択</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">走行距離（km）</label>
                  <input
                    type="number"
                    name="mileage"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.mileage || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">積載量（kg）</label>
                  <input
                    type="number"
                    name="loadingCapacity"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.loadingCapacity || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">ミッション</label>
                  <select
                    name="mission"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.mission || ''}
                  >
                    <option value="">選択</option>
                    {missions.map((mission) => (
                      <option key={mission} value={mission}>{mission}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">シフト</label>
                  <select
                    name="shift"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.shift || ''}
                  >
                    <option value="">選択</option>
                    {shifts.map((shift) => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車検状態</label>
                  <select
                    name="inspectionStatus"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.inspectionStatus || ''}
                  >
                    <option value="">選択</option>
                    {inspectionStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車検有効期限</label>
                  <input
                    type="text"
                    name="inspectionDate"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.inspectionDate || ''}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">外寸長（mm）</label>
                  <input
                    type="number"
                    name="outerLength"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.outerLength || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">外寸幅（mm）</label>
                  <input
                    type="number"
                    name="outerWidth"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.outerWidth || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">外寸高（mm）</label>
                  <input
                    type="number"
                    name="outerHeight"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.outerHeight || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">内寸長（mm）</label>
                  <input
                    type="number"
                    name="innerLength"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.innerLength || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">内寸幅（mm）</label>
                  <input
                    type="number"
                    name="innerWidth"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.innerWidth || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">内寸高（mm）</label>
                  <input
                    type="number"
                    name="innerHeight"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.innerHeight || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車両総重量（kg）</label>
                  <input
                    type="number"
                    name="totalWeight"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.totalWeight || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">原動機型式</label>
                  <input
                    type="text"
                    name="engineModel"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.engineModel || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">馬力（ps）</label>
                  <input
                    type="number"
                    name="horsepower"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.horsepower || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">ターボ</label>
                  <select
                    name="turbo"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.turbo || ''}
                  >
                    <option value="">選択</option>
                    {turbos.map((turbo) => (
                      <option key={turbo} value={turbo}>{turbo}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">排気量（cc）</label>
                  <input
                    type="number"
                    name="displacement"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.displacement || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">燃料</label>
                  <select
                    name="fuel"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.fuel || ''}
                  >
                    <option value="">選択</option>
                    {fuels.map((fuel) => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">問合せ番号</label>
                  <input
                    type="text"
                    name="inquiryNumber"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.inquiryNumber || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体番号</label>
                  <input
                    type="text"
                    name="chassisNumber"
                    className="w-full border rounded px-2 py-1"
                    defaultValue={vehicle.chassisNumber || ''}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 上物情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">上物情報</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">上物メーカー</label>
                <input
                  type="text"
                  name="bodyMaker"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.bodyMaker || ''}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">上物型式</label>
                <input
                  type="text"
                  name="bodyModel"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.bodyModel || ''}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">上物年式</label>
                <select
                  name="bodyYear"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.bodyYear || ''}
                >
                  <option value="">選択</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">装備・仕様（右記以外の）</label>
                <input
                  type="text"
                  name="equipment"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.equipment || ''}
                />
              </div>
            </div>
          </div>

          {/* 装備品 */}
          <div>
            <h3 className="text-lg font-medium mb-4">装備品</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">ETC</label>
                <select
                  name="etc"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.etc || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">バックカメラ</label>
                <select
                  name="backCamera"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.backCamera || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">記録簿</label>
                <select
                  name="recordBook"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.recordBook || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">パワーウィンドウ</label>
                <select
                  name="powerWindow"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.powerWindow || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">ドラレコ</label>
                <select
                  name="driveRecorder"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.driveRecorder || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">エアコン</label>
                <select
                  name="airConditioner"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.airConditioner || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">電動ミラー</label>
                <select
                  name="electricMirror"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.electricMirror || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">ABS</label>
                <select
                  name="abs"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.abs || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">アルミホイール</label>
                <select
                  name="aluminumWheel"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.aluminumWheel || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">エアサスシート</label>
                <select
                  name="airSuspensionSeat"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.airSuspensionSeat || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">カーナビ</label>
                <select
                  name="carNavigation"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.carNavigation || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">DPF</label>
                <select
                  name="dpf"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.dpf || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">PMマフラー</label>
                <select
                  name="pmMuffler"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.pmMuffler || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">集中ドアロック</label>
                <select
                  name="centralDoorLock"
                  className="w-full border rounded px-2 py-1"
                  defaultValue={vehicle.centralDoorLock || ''}
                >
                  <option value="">選択</option>
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 車両説明 */}
          <div>
            <h3 className="text-lg font-medium mb-4">車両説明</h3>
            <textarea
              name="description"
              rows={4}
              className="w-full border rounded px-2 py-1"
              defaultValue={vehicle.description || ''}
              placeholder="車両の詳細説明を入力してください"
            />
          </div>

          <div className="flex justify-center gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/vehicles')}>
              キャンセル
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 