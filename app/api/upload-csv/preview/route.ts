import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Papa from 'papaparse'

// フィールドマッピング
const fieldMapping: { [key: string]: string } = {
  'NO.': 'managementNumber',
  'トラック名': 'name',
  '車両価格': 'price',
  '車両価格(税込)': 'totalPayment',
  '業販金額': 'wholesalePrice',
  'ボディタイプ': 'bodyType',
  'メーカー': 'maker',
  '大きさ': 'size',
  '車種': 'model',
  '型式': 'modelCode',
  '年式': 'year',
  '走行距離（㎞）': 'mileage',
  '積載量（kg）': 'loadingCapacity',
  'ミッション': 'mission',
  'シフト': 'shift',
  '車検状態': 'inspectionStatus',
  '車検有効期限': 'inspectionDate',
  '外寸長（㎜）': 'outerLength',
  '外寸幅（㎜）': 'outerWidth',
  '外寸高（㎜）': 'outerHeight',
  '車両総重量（kg）': 'totalWeight',
  '原動機型式': 'engineModel',
  '馬力（ps）': 'horsepower',
  'ターボ': 'turbo',
  '排気量（cc）': 'displacement',
  '燃料': 'fuel',
  '問い合わせ番号': 'inquiryNumber',
  '車体番号': 'chassisNumber',
  '上物メーカー': 'bodyMaker',
  '上物型式': 'bodyModel',
  '上物年式': 'bodyYear',
  '装備・仕様（右記以外の）': 'equipment',
  'ETC': 'etc',
  'バックカメラ': 'backCamera',
  '記録簿': 'recordBook',
  'パワーウィンドウ': 'powerWindow',
  'ドラレコ': 'driveRecorder',
  'エアコン': 'airConditioner',
  '電動ミラー': 'electricMirror',
  'ABS': 'abs',
  'アルミホイール': 'aluminumWheel',
  'エアサスシート': 'airSuspensionSeat',
  'カーナビ': 'carNavigation',
  'DPF': 'dpf',
  'PMマフラー': 'pmMuffler',
  '集中ドアロック': 'centralDoorLock',
  '内寸長（㎜）': 'innerLength',
  '内寸幅（㎜）': 'innerWidth',
  '内寸高（㎜）': 'innerHeight',
  '在庫店舗名': 'storeName',
}

// 必須フィールド
const requiredFields = ['managementNumber', 'maker']

// 数値フィールド
const numericFields = ['price', 'wholesalePrice', 'totalPayment', 'mileage', 'loadingCapacity', 'outerLength', 'outerWidth', 'outerHeight', 'innerLength', 'innerWidth', 'innerHeight', 'totalWeight', 'horsepower', 'displacement']

// 日付フィールド
const dateFields = ['inspectionDate']

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'CSVファイルを選択してください' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'ファイルサイズは10MB以下にしてください' }, { status: 400 })
    }

    // CSVファイルを読み取り
    const csvText = await file.text()
    console.log('CSVファイルの最初の500文字:', csvText.substring(0, 500))
    console.log('CSVファイルの文字コード:', csvText.charCodeAt(0), csvText.charCodeAt(1), csvText.charCodeAt(2))
    console.log('BOM確認:', csvText.startsWith('\uFEFF') ? 'BOMあり' : 'BOMなし')
    
    // BOMを除去
    let processedText = csvText.replace(/^\uFEFF/, '')
    
    // PapaParseを使用してCSVを解析（元のテキストをそのまま使用）
    const parseResult = Papa.parse(processedText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    })
    
    console.log('PapaParse解析結果:', parseResult)
    
    // ヘッダー行の詳細分析
    const firstLine = processedText.split('\n')[0]
    console.log('ヘッダー行（生データ）:', firstLine)
    console.log('ヘッダー行の文字数:', firstLine.length)
    console.log('ヘッダー行の各文字のコード:', Array.from(firstLine).map(char => char.charCodeAt(0)))

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        error: `CSVファイルの解析でエラーが発生しました: ${parseResult.errors[0].message}` 
      }, { status: 400 })
    }

    const rows = parseResult.data as any[]
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSVファイルにデータがありません' }, { status: 400 })
    }

    // ヘッダーの検証
    const headers = Object.keys(rows[0] || {})
    console.log('検出されたヘッダー:', headers)
    console.log('ヘッダー数:', headers.length)
    
    const expectedHeaders = ['NO.', 'トラック名', '車両価格', '車両価格(税込)', '業販金額', 'ボディタイプ', 'メーカー', '大きさ', '車種', '型式', '年式', '走行距離（㎞）', '積載量（kg）', 'ミッション', 'シフト', '車検状態', '車検有効期限', '外寸長（㎜）', '外寸幅（㎜）', '外寸高（㎜）', '車両総重量（kg）', '原動機型式', '馬力（ps）', 'ターボ', '排気量（cc）', '燃料', '問い合わせ番号', '車体番号', '上物メーカー', '上物型式', '上物年式', '装備・仕様（右記以外の）', 'ETC', 'バックカメラ', '記録簿', 'パワーウィンドウ', 'ドラレコ', 'エアコン', '電動ミラー', 'ABS', 'アルミホイール', 'エアサスシート', 'カーナビ', 'DPF', 'PMマフラー', '集中ドアロック', '内寸長（㎜）', '内寸幅（㎜）', '内寸高（㎜）', '在庫店舗名']
    console.log('期待されるヘッダー数:', expectedHeaders.length)
    
    // 各ヘッダーの詳細比較
    console.log('=== ヘッダー詳細比較 ===')
    expectedHeaders.forEach((expected, index) => {
      const found = headers.find(h => h === expected)
      console.log(`${index + 1}. 期待: "${expected}" (${expected.length}文字) - 検出: ${found ? `"${found}" (${found.length}文字)` : '見つかりません'}`)
    })
    
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header))
    console.log('不足しているヘッダー:', missingHeaders)
    
    if (missingHeaders.length > 0) {
      return NextResponse.json({ 
        error: `CSVファイルの形式が正しくありません。以下のヘッダーが必要です: ${expectedHeaders.join(', ')}` 
      }, { status: 400 })
    }

    // 既存データの重複チェック用データを取得
    const existingVehicles = await getExistingVehicles()

    // データの検証とプレビュー作成
    const previewData: PreviewData[] = []
    const currentUploadVehicles: any[] = [] // 現在のアップロード処理内での重複チェック用
    let totalErrors = 0
    let totalDuplicates = 0

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const errors: ValidationError[] = []
      let isDuplicate = false
      let duplicateReason = ''

      // データ変換
      const vehicleData: any = {}
      headers.forEach((header) => {
        const englishField = fieldMapping[header] || header
        vehicleData[englishField] = row[header] || ''
      })

      // 必須フィールドの検証
      requiredFields.forEach(field => {
        if (!vehicleData[field] || vehicleData[field].toString().trim() === '') {
          errors.push({
            row: i + 1,
            field: field,
            message: `${field}は必須項目です`
          })
        }
      })

      // 数値フィールドの検証
      numericFields.forEach(field => {
        if (vehicleData[field] && vehicleData[field].toString().trim() !== '') {
          const numericValue = vehicleData[field].toString().replace(/[^\d]/g, '')
          if (numericValue === '' || isNaN(parseInt(numericValue))) {
            errors.push({
              row: i + 1,
              field: field,
              message: `${field}は数値で入力してください`
            })
          }
        }
      })

      // 日付フィールドの検証
      dateFields.forEach(field => {
        if (vehicleData[field] && vehicleData[field].toString().trim() !== '') {
          const dateValue = vehicleData[field].toString()
          // 「-」は許可（一時抹消などの場合）
          if (dateValue !== '-' && !isValidDate(dateValue)) {
            errors.push({
              row: i + 1,
              field: field,
              message: `${field}は有効な日付形式で入力してください（例: 2024-12-31）`
            })
          }
        }
      })

      // 既存データとの重複チェック
      if (vehicleData.chassisNumber && vehicleData.chassisNumber.toString().trim() !== '') {
        const duplicateByChassis = existingVehicles.find(v => v.chassisNumber === vehicleData.chassisNumber)
        if (duplicateByChassis) {
          isDuplicate = true
          duplicateReason = `車体番号 "${vehicleData.chassisNumber}" が既に登録されています`
        }
      }

      if (vehicleData.inquiryNumber && vehicleData.inquiryNumber.toString().trim() !== '') {
        const duplicateByInquiry = existingVehicles.find(v => v.inquiryNumber === vehicleData.inquiryNumber)
        if (duplicateByInquiry) {
          isDuplicate = true
          duplicateReason = duplicateReason ? 
            `${duplicateReason}、問合せ番号 "${vehicleData.inquiryNumber}" も重複` : 
            `問合せ番号 "${vehicleData.inquiryNumber}" が既に登録されています`
        }
      }

      // 現在のアップロード処理内での重複チェック
      if (!isDuplicate) {
        if (vehicleData.chassisNumber && vehicleData.chassisNumber.toString().trim() !== '') {
          const currentUploadDuplicateByChassis = currentUploadVehicles.find(v => v.chassisNumber === vehicleData.chassisNumber)
          if (currentUploadDuplicateByChassis) {
            isDuplicate = true
            duplicateReason = `車体番号 "${vehicleData.chassisNumber}" が現在のアップロード処理内で重複`
          }
        }
        if (!isDuplicate && vehicleData.inquiryNumber && vehicleData.inquiryNumber.toString().trim() !== '') {
          const currentUploadDuplicateByInquiry = currentUploadVehicles.find(v => v.inquiryNumber === vehicleData.inquiryNumber)
          if (currentUploadDuplicateByInquiry) {
            isDuplicate = true
            duplicateReason = `問合せ番号 "${vehicleData.inquiryNumber}" が現在のアップロード処理内で重複`
          }
        }
      }

      if (errors.length > 0) {
        totalErrors += errors.length
      }
      if (isDuplicate) {
        totalDuplicates++
      }

      previewData.push({
        row: i + 1,
        data: vehicleData,
        errors,
        isDuplicate,
        duplicateReason
      })

      // 現在のアップロード処理内での重複チェック用に追加（エラーがない場合のみ）
      if (errors.length === 0 && !isDuplicate) {
        currentUploadVehicles.push(vehicleData)
      }
    }

    return NextResponse.json({
      success: true,
      previewData,
      summary: {
        totalRows: previewData.length,
        totalErrors,
        totalDuplicates,
        validRows: previewData.filter(p => p.errors.length === 0 && !p.isDuplicate).length
      }
    })

  } catch (error) {
    console.error('プレビュー処理エラー:', error)
    return NextResponse.json({ error: 'プレビュー処理でエラーが発生しました' }, { status: 500 })
  }
}

// 既存の車両データを取得
async function getExistingVehicles() {
  try {
    const vehiclesRef = collection(db, 'vehicles')
    const snapshot = await getDocs(vehiclesRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('既存データ取得エラー:', error)
    return []
  }
}

// 日付形式の検証
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
} 