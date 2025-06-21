"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getInquiries, updateInquiry, deleteInquiry } from "@/lib/firebase-utils"
import { Inquiry } from "@/types"
import { Search, Eye, Edit, Trash2, Mail } from "lucide-react"

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState("")

  // お問い合わせデータを取得
  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const data = await getInquiries()
      setInquiries(data)
    } catch (error) {
      console.error("お問い合わせデータの取得に失敗しました:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  // 検索フィルター
  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // お問い合わせ詳細表示
  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setReplyText(inquiry.reply || "")
    setIsViewDialogOpen(true)
  }

  // お問い合わせ編集
  const handleEdit = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setReplyText(inquiry.reply || "")
    setIsEditDialogOpen(true)
  }

  // 返信保存
  const handleSaveReply = async () => {
    if (!selectedInquiry?.id) return

    try {
      await updateInquiry(selectedInquiry.id, {
        reply: replyText,
        status: replyText ? "対応中" : "未対応"
      })
      
      setIsEditDialogOpen(false)
      setSelectedInquiry(null)
      setReplyText("")
      await fetchInquiries() // 一覧を再取得
      alert("返信を保存しました")
    } catch (error) {
      console.error("保存に失敗しました:", error)
      alert("保存に失敗しました")
    }
  }

  // ステータス更新
  const handleStatusChange = async (id: string, status: "未対応" | "対応中" | "完了") => {
    try {
      await updateInquiry(id, { status })
      await fetchInquiries() // 一覧を再取得
    } catch (error) {
      console.error("ステータス更新に失敗しました:", error)
      alert("ステータス更新に失敗しました")
    }
  }

  // お問い合わせ削除
  const handleDelete = async (id: string) => {
    if (!confirm("このお問い合わせを削除しますか？")) return

    try {
      await deleteInquiry(id)
      await fetchInquiries() // 一覧を再取得
      alert("お問い合わせを削除しました")
    } catch (error) {
      console.error("削除に失敗しました:", error)
      alert("削除に失敗しました")
    }
  }

  // ステータスに応じたバッジの色
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "未対応":
        return <Badge variant="destructive">{status}</Badge>
      case "対応中":
        return <Badge variant="secondary">{status}</Badge>
      case "完了":
        return <Badge variant="default">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // タイプに応じたバッジの色
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "購入":
        return <Badge variant="default">{type}</Badge>
      case "買取":
        return <Badge variant="secondary">{type}</Badge>
      case "その他":
        return <Badge variant="outline">{type}</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">お問い合わせ管理</h1>
      </div>

      {/* 検索バー */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="名前、会社名、メールアドレスで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* お問い合わせ一覧 */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => (
          <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{inquiry.fullName}</CardTitle>
                  <p className="text-sm text-gray-600">{inquiry.company}</p>
                  <div className="flex gap-2 mt-2">
                    {getTypeBadge(inquiry.type)}
                    {getStatusBadge(inquiry.status)}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{inquiry.createdAt.toLocaleDateString()}</p>
                  <p>{inquiry.createdAt.toLocaleTimeString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">メールアドレス</p>
                  <p className="font-medium">{inquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">電話番号</p>
                  <p className="font-medium">{inquiry.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">都道府県</p>
                  <p className="font-medium">{inquiry.prefecture}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ステータス</p>
                  <Select
                    value={inquiry.status}
                    onValueChange={(value: "未対応" | "対応中" | "完了") => 
                      handleStatusChange(inquiry.id!, value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="未対応">未対応</SelectItem>
                      <SelectItem value="対応中">対応中</SelectItem>
                      <SelectItem value="完了">完了</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {inquiry.remarks && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">お問い合わせ内容</p>
                  <p className="text-sm bg-gray-50 p-3 rounded">{inquiry.remarks}</p>
                </div>
              )}

              {inquiry.reply && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">返信内容</p>
                  <p className="text-sm bg-blue-50 p-3 rounded">{inquiry.reply}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(inquiry)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  詳細
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(inquiry)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  返信
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(inquiry.id!)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  削除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">お問い合わせが見つかりません</p>
        </div>
      )}

      {/* 詳細表示ダイアログ */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>お問い合わせ詳細</DialogTitle>
            <DialogDescription>
              お問い合わせの詳細情報を確認できます
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>お名前</Label>
                  <p className="font-medium">{selectedInquiry.fullName}</p>
                </div>
                <div>
                  <Label>会社名</Label>
                  <p className="font-medium">{selectedInquiry.company}</p>
                </div>
                <div>
                  <Label>メールアドレス</Label>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <Label>電話番号</Label>
                  <p className="font-medium">{selectedInquiry.phone}</p>
                </div>
                <div>
                  <Label>都道府県</Label>
                  <p className="font-medium">{selectedInquiry.prefecture}</p>
                </div>
                <div>
                  <Label>お問い合わせ種別</Label>
                  <p className="font-medium">{selectedInquiry.type}</p>
                </div>
              </div>
              
              <div>
                <Label>お問い合わせ内容</Label>
                <p className="bg-gray-50 p-3 rounded">{selectedInquiry.remarks}</p>
              </div>
              
              {selectedInquiry.reply && (
                <div>
                  <Label>返信内容</Label>
                  <p className="bg-blue-50 p-3 rounded">{selectedInquiry.reply}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <p>受信日時: {selectedInquiry.createdAt.toLocaleString()}</p>
                <p>更新日時: {selectedInquiry.updatedAt.toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 返信編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>返信を編集</DialogTitle>
            <DialogDescription>
              お客様への返信内容を入力してください
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <Label>お客様からのお問い合わせ</Label>
                <p className="bg-gray-50 p-3 rounded text-sm">{selectedInquiry.remarks}</p>
              </div>
              
              <div>
                <Label htmlFor="reply">返信内容</Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="お客様への返信内容を入力してください..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveReply}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 