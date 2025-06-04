"use client"

import { Button } from "@/components/ui/button"

export default function StoreCreatePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">店舗登録</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">店舗名</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="例：○○店"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">住所</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="例：東京都渋谷区○○1-1-1"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">電話番号</label>
              <input
                type="tel"
                className="w-full border rounded px-2 py-1"
                placeholder="例：000-0000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">FAX番号</label>
              <input
                type="tel"
                className="w-full border rounded px-2 py-1"
                placeholder="例：000-0000-0000"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">営業時間</h3>
              <div className="space-y-4">
                {["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"].map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <input type="checkbox" id={`day-${day}`} className="mr-2" />
                      <label htmlFor={`day-${day}`}>{day}</label>
                    </div>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                    />
                    <span>〜</span>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="px-8">
              登録
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 