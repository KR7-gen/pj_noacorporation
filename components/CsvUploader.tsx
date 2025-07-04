'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Upload, FileText, CheckCircle, AlertCircle, Eye, XCircle, RefreshCw } from 'lucide-react'

interface ValidationError {
  row: number
  field: string
  message: string
}

interface PreviewData {
  row: number
  data: any
  errors: ValidationError[]
  isDuplicate: boolean
  duplicateReason?: string
}

interface UploadResult {
  success: boolean
  message: string
  successCount?: number
  errorCount?: number
  skippedCount?: number
  updatedCount?: number
  totalProcessed?: number
  detailedResults?: any[]
}

interface PreviewSummary {
  totalRows: number
  totalErrors: number
  totalDuplicates: number
  validRows: number
}

export default function CsvUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [previewData, setPreviewData] = useState<PreviewData[]>([])
  const [previewSummary, setPreviewSummary] = useState<PreviewSummary | null>(null)
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file)
        setResult(null)
        setPreviewData([])
        setPreviewSummary(null)
        setShowPreview(false)
      } else {
        setResult({
          success: false,
          message: 'CSVファイルを選択してください'
        })
      }
    }
  }

  const handlePreview = async () => {
    if (!selectedFile) {
      setResult({
        success: false,
        message: 'ファイルを選択してください'
      })
      return
    }

    setIsPreviewing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload-csv/preview', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setPreviewData(data.previewData)
        setPreviewSummary(data.summary)
        setShowPreview(true)
        setResult({
          success: true,
          message: `プレビュー完了: ${data.summary.validRows}件有効, ${data.summary.totalErrors}件エラー, ${data.summary.totalDuplicates}件重複`
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'プレビューに失敗しました'
        })
      }
    } catch (error) {
      console.error('プレビューエラー:', error)
      setResult({
        success: false,
        message: 'プレビュー処理でエラーが発生しました'
      })
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setResult({
        success: false,
        message: 'ファイルを選択してください'
      })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('overwriteDuplicates', overwriteDuplicates.toString())

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          successCount: data.successCount,
          errorCount: data.errorCount,
          skippedCount: data.skippedCount,
          updatedCount: data.updatedCount,
          totalProcessed: data.totalProcessed,
          detailedResults: data.detailedResults
        })
        setSelectedFile(null)
        setPreviewData([])
        setPreviewSummary(null)
        setShowPreview(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setResult({
          success: false,
          message: data.error || 'アップロードに失敗しました'
        })
      }
    } catch (error) {
      console.error('アップロードエラー:', error)
      setResult({
        success: false,
        message: 'アップロード処理でエラーが発生しました'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setResult(null)
    setPreviewData([])
    setPreviewSummary(null)
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">成功</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">エラー</Badge>
      case 'skipped':
        return <Badge className="bg-yellow-100 text-yellow-800">スキップ</Badge>
      case 'updated':
        return <Badge className="bg-blue-100 text-blue-800">更新</Badge>
      default:
        return <Badge variant="outline">未処理</Badge>
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        CSV一括アップロード
      </h3>

      <div className="space-y-4">
        {/* ファイル選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSVファイルを選択
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* 選択されたファイル */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}

        {/* 重複時の処理選択 */}
        {showPreview && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">重複データの処理</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overwriteDuplicates"
                checked={overwriteDuplicates}
                onCheckedChange={(checked) => setOverwriteDuplicates(checked as boolean)}
              />
              <label htmlFor="overwriteDuplicates" className="text-sm text-yellow-800">
                重複データがある場合は上書きする
              </label>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              ※ チェックしない場合は重複データをスキップします
            </p>
          </div>
        )}

        {/* プレビューサマリー */}
        {previewSummary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">プレビュー結果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{previewSummary.totalRows}</div>
                  <div className="text-sm text-gray-600">総行数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{previewSummary.validRows}</div>
                  <div className="text-sm text-gray-600">有効データ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{previewSummary.totalErrors}</div>
                  <div className="text-sm text-gray-600">エラー</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{previewSummary.totalDuplicates}</div>
                  <div className="text-sm text-gray-600">重複</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* プレビューデータ */}
        {showPreview && previewData.length > 0 && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">全て ({previewData.length})</TabsTrigger>
              <TabsTrigger value="valid">有効 ({previewData.filter(p => p.errors.length === 0 && !p.isDuplicate).length})</TabsTrigger>
              <TabsTrigger value="error">エラー ({previewData.filter(p => p.errors.length > 0).length})</TabsTrigger>
              <TabsTrigger value="duplicate">重複 ({previewData.filter(p => p.isDuplicate).length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <PreviewTable data={previewData} />
            </TabsContent>
            <TabsContent value="valid" className="mt-4">
              <PreviewTable data={previewData.filter(p => p.errors.length === 0 && !p.isDuplicate)} />
            </TabsContent>
            <TabsContent value="error" className="mt-4">
              <PreviewTable data={previewData.filter(p => p.errors.length > 0)} />
            </TabsContent>
            <TabsContent value="duplicate" className="mt-4">
              <PreviewTable data={previewData.filter(p => p.isDuplicate)} />
            </TabsContent>
          </Tabs>
        )}

        {/* 結果表示 */}
        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
              {result.message}
              {result.success && (
                <div className="mt-2 text-sm space-y-1">
                  {result.successCount !== undefined && <p>新規追加: {result.successCount}件</p>}
                  {result.updatedCount !== undefined && <p>更新: {result.updatedCount}件</p>}
                  {result.skippedCount !== undefined && <p>スキップ: {result.skippedCount}件</p>}
                  {result.errorCount !== undefined && <p>失敗: {result.errorCount}件</p>}
                  {result.totalProcessed !== undefined && <p>処理件数: {result.totalProcessed}件</p>}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* ボタン */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handlePreview}
            disabled={!selectedFile || isPreviewing}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isPreviewing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                プレビュー中...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                プレビュー
              </>
            )}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || !showPreview}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                アップロード中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                アップロード
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isUploading || isPreviewing}
            className="flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            クリア
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/vehicle-template.csv', '_blank')}
            type="button"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            サンプルダウンロード
          </Button>
        </div>

        {/* ヘルプ */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">CSVファイル形式</h4>
          <p className="mb-2">以下のヘッダーを含むCSVファイルをアップロードしてください：</p>
          <code className="text-xs bg-white p-2 rounded block">
            NO.,トラック名,車両価格,支払総額,業販金額,ボディタイプ,メーカー,大きさ,車種,型式,年式,走行距離（㎞）,積載量（kg）,ミッション,シフト,車検状態,車検有効期限,内寸長（㎜）,内寸幅（㎜）,内寸高（㎜）,車両総重量（kg）,原動機型式,馬力（ps）,ターボ,排気量（cc）,燃料,問合せ番号,車体番号
          </code>
          <p className="mt-2 text-xs">※ NO.とメーカーは必須項目です</p>
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800 font-medium">注意事項：</p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• 車体番号または問合せ番号で重複チェックを行います</li>
              <li>• プレビューで内容を確認してからアップロードしてください</li>
              <li>• 文字コードはUTF-8で保存してください</li>
              <li>• サンプルファイルは <code className="bg-white px-1 rounded">/vehicle-template.csv</code> からダウンロードできます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// プレビューテーブルコンポーネント
function PreviewTable({ data }: { data: PreviewData[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        データがありません
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">行</TableHead>
            <TableHead className="w-24">状態</TableHead>
            <TableHead>管理番号</TableHead>
            <TableHead>メーカー</TableHead>
            <TableHead>車種</TableHead>
            <TableHead>価格</TableHead>
            <TableHead>エラー/重複</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.row}>
              <TableCell className="font-medium">{item.row}</TableCell>
              <TableCell>
                {item.errors.length > 0 ? (
                  <Badge className="bg-red-100 text-red-800">エラー</Badge>
                ) : item.isDuplicate ? (
                  <Badge className="bg-yellow-100 text-yellow-800">重複</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">有効</Badge>
                )}
              </TableCell>
              <TableCell>{item.data.managementNumber || '-'}</TableCell>
              <TableCell>{item.data.maker || '-'}</TableCell>
              <TableCell>{item.data.model || '-'}</TableCell>
              <TableCell>{item.data.price ? `¥${item.data.price.toLocaleString()}` : '-'}</TableCell>
              <TableCell className="max-w-xs">
                <div className="space-y-1">
                  {item.errors.map((error, index) => (
                    <div key={index} className="text-xs text-red-600">
                      {error.field}: {error.message}
                    </div>
                  ))}
                  {item.isDuplicate && (
                    <div className="text-xs text-yellow-600">
                      {item.duplicateReason}
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 