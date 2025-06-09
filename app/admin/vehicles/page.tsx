"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">車両一覧</h1>
        <Link href="/admin/vehicles/new">
          <Button>新規登録</Button>
        </Link>
      </div>

      {/* 一覧表示部分は後で実装 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p>車両一覧を表示予定</p>
      </div>
    </div>
  )
} 