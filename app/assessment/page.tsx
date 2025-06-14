"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AssessmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">買取査定フォーム</h1>
      
      {/* 上部のお問い合わせリンク */}
      <div className="mb-8 text-center">
        <Link href="/contact">
          <Button variant="outline" className="w-full sm:w-auto">
            お問い合わせフォームはこちら
          </Button>
        </Link>
      </div>

      {/* 査定フォーム */}
      <form className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="maker">メーカー</Label>
            <Input
              id="maker"
              placeholder="例）いすゞ"
            />
          </div>
          <div>
            <Label htmlFor="model">車種</Label>
            <Input
              id="model"
              placeholder="例）エルフ"
            />
          </div>
          <div>
            <Label htmlFor="year">年式</Label>
            <Input
              id="year"
              placeholder="例）2020年"
            />
          </div>
          <div>
            <Label htmlFor="mileage">走行距離</Label>
            <Input
              id="mileage"
              placeholder="例）100,000km"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="condition">車両の状態</Label>
          <Textarea
            id="condition"
            placeholder="車両の状態について詳しく教えてください"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">お名前</Label>
            <Input
              id="name"
              placeholder="例）山田太郎"
            />
          </div>
          <div>
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="例）090-1234-5678"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="例）example@example.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="remarks">備考</Label>
          <Textarea
            id="remarks"
            placeholder="その他ご要望などございましたらご記入ください"
          />
        </div>

        <div className="text-center">
          <Link href="/contact">
            <Button type="button" className="w-full sm:w-auto">
              査定を依頼する
            </Button>
          </Link>
        </div>
      </form>

      {/* 下部のお問い合わせリンク */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold mb-4">CONTACT</h2>
        <p className="text-gray-600 mb-4">
          査定に関するご質問やご不明点がございましたら、お気軽にお問い合わせください。
        </p>
        <Link href="/contact">
          <Button className="w-full sm:w-auto">
            お問い合わせフォームへ
          </Button>
        </Link>
      </div>
    </div>
  )
} 