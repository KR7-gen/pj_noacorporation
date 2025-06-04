"use client"

import { Button } from "@/components/ui/button"

// モックデータ（実際はAPIから取得）
const storeData = {
  id: 1,
  name: "○○店",
  tel: "000-0000-0000",
  fax: "000-0000-0000",
  address: "東京都渋谷区○○1-1-1",
  businessHours: {
    monday: { start: "09:00", end: "18:00", closed: false },
    tuesday: { start: "09:00", end: "18:00", closed: false },
    wednesday: { start: "09:00", end: "18:00", closed: false },
    thursday: { start: "09:00", end: "18:00", closed: false },
    friday: { start: "09:00", end: "18:00", closed: false },
    saturday: { start: "10:00", end: "17:00", closed: false },
    sunday: { start: "10:00", end: "17:00", closed: true }
  }
}

export default function StoreEditPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">店舗編集</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">店舗名</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                defaultValue={storeData.name}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">住所</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                defaultValue={storeData.address}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">電話番号</label>
              <input
                type="tel"
                className="w-full border rounded px-2 py-1"
                defaultValue={storeData.tel}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">FAX番号</label>
              <input
                type="tel"
                className="w-full border rounded px-2 py-1"
                defaultValue={storeData.fax}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">営業時間</h3>
              <div className="space-y-4">
                {[
                  { day: "月曜日", key: "monday" },
                  { day: "火曜日", key: "tuesday" },
                  { day: "水曜日", key: "wednesday" },
                  { day: "木曜日", key: "thursday" },
                  { day: "金曜日", key: "friday" },
                  { day: "土曜日", key: "saturday" },
                  { day: "日曜日", key: "sunday" }
                ].map(({ day, key }) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        defaultChecked={!storeData.businessHours[key].closed}
                        className="mr-2"
                      />
                      <label htmlFor={`day-${day}`}>{day}</label>
                    </div>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                      defaultValue={storeData.businessHours[key].start}
                    />
                    <span>〜</span>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                      defaultValue={storeData.businessHours[key].end}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="px-8">
              保存
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 