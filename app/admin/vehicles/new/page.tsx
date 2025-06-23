"use client"

import { Button } from "@/components/ui/button"

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

const mileages = [
  "上限なし",
  "10万km",
  "20万km",
  "30万km",
  "40万km",
  "50万km",
  "60万km",
  "70万km",
  "80万km",
  "90万km",
  "100万km"
]

const loadCapacities = [
  "1.0t",
  "1.5t",
  "2.0t",
  "2.5t",
  "3.0t",
  "3.5t",
  "4.0t",
  "4.5t",
  "5.0t",
  "5.5t",
  "6.0t"
]

const missions = [
  "MT",
  "AT・SAT"
]

const vehicleStatuses = [
  "車検付き",
  "車検切れ",
  "抹消",
  "予備検査"
]

export default function VehicleNewPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">車両登録</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form className="space-y-8">
          {/* 基本情報 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">トラック名</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="日野 レンジャー"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">車両価格（税抜）</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                placeholder="5000000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">支払総額（税抜）</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                placeholder="5500000"
              />
            </div>
          </div>

          {/* 毎月支払額シミュレーション */}
          <div>
            <h3 className="text-lg font-medium mb-4">毎月支払額シミュレーション</h3>
            <div className="grid grid-cols-4 gap-6">
              {[2, 3, 4, 4].map((year, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium">{year}年</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="円（税別）〜"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 画像アップロード */}
          <div>
            <h3 className="text-lg font-medium mb-4">画像登録</h3>
            <div className="grid grid-cols-4 gap-4">
              {Array(14).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-gray-400">＋</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Button variant="destructive">一括削除</Button>
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
                    className="w-full border rounded px-2 py-1"
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
                    className="w-full border rounded px-2 py-1"
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
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">型式</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">年式</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">走行距離</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {mileages.map((mileage) => (
                      <option key={mileage} value={mileage}>{mileage}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">積載量（下限）</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {loadCapacities.map((capacity) => (
                      <option key={capacity} value={capacity}>{capacity}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">積載量（上限）</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {loadCapacities.map((capacity) => (
                      <option key={capacity} value={capacity}>{capacity}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">ミッション</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {missions.map((mission) => (
                      <option key={mission} value={mission}>{mission}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車検状態</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">選択</option>
                    {vehicleStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車検有効期限</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車体寸法</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      placeholder="L (mm)"
                    />
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      placeholder="W (mm)"
                    />
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      placeholder="H (mm)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">車両総重量</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">原動機型式</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">馬力</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">排気量</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">燃料</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">問い合わせ番号</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 車検証画像 */}
          <div>
            <h3 className="text-lg font-medium mb-4">車検証画像</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[1.4/1] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-400">＋</span>
              </div>
              <div className="aspect-[1.4/1] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-400">＋</span>
              </div>
            </div>
          </div>

          {/* 状態写真画像 */}
          <div>
            <h3 className="text-lg font-medium mb-4">状態写真画像</h3>
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
              <span className="text-gray-400">＋</span>
            </div>
          </div>

          {/* 上物情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">上物情報</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">内寸</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="L (mm)"
                  />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="W (mm)"
                  />
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="H (mm)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">年式</label>
                <select
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">選択</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">店舗</label>
                <select
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">選択</option>
                  <option value="store1">○○店</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="px-8">
              登録完了
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 