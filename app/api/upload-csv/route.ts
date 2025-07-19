import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import Papa from 'papaparse'

// 新しいフィールドマッピング
const fieldMapping: { [key: string]: string } = {
  'NO.': 'managementNumber',
  'トラック名': 'name',
  '車両価格': 'price',
  '車両価格（税込）': 'totalPayment',
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
  '内寸長（㎜）': 'innerLength',
  '内寸幅（㎜）': 'innerWidth',
  '内寸高（㎜）': 'innerHeight',
  '車両総重量（kg）': 'totalWeight',
  '原動機型式': 'engineModel',
  '馬力（ps）': 'horsepower',
  'ターボ': 'turbo',
  '排気量（cc）': 'displacement',
  '燃料': 'fuel',
  '問合せ番号': 'inquiryNumber',
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
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const overwriteDuplicates = formData.get('overwriteDuplicates') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 })
    }

    console.log('ファイル名:', file.name)
    console.log('ファイルサイズ:', file.size)
    console.log('重複時上書き:', overwriteDuplicates)

    // CSVファイルの検証
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'CSVファイルを選択してください' }, { status: 400 })
    }

    // ファイルサイズの制限（10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'ファイルサイズは10MB以下にしてください' }, { status: 400 })
    }

    // CSVファイルを読み取り
    const csvText = await file.text()
    console.log('CSV内容（最初の500文字）:', csvText.substring(0, 500))
    
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
    
    if (parseResult.errors.length > 0) {
      console.log('CSV解析エラー:', parseResult.errors)
      return NextResponse.json({ 
        error: `CSVファイルの解析でエラーが発生しました: ${parseResult.errors[0].message}` 
      }, { status: 400 })
    }

    const rows = parseResult.data as any[]
    console.log('解析された行数:', rows.length)
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSVファイルにデータがありません' }, { status: 400 })
    }

    // ヘッダーの検証
    const headers = Object.keys(rows[0] || {})
    console.log('検出されたヘッダー:', headers)
    console.log('ヘッダー数:', headers.length)
    
    const expectedHeaders = ['NO.', 'トラック名', '車両価格', '車両価格（税込）', '業販金額', 'ボディタイプ', 'メーカー', '大きさ', '車種', '型式', '年式', '走行距離（㎞）', '積載量（kg）', 'ミッション', 'シフト', '車検状態', '車検有効期限', '外寸長（㎜）', '外寸幅（㎜）', '外寸高（㎜）', '内寸長（㎜）', '内寸幅（㎜）', '内寸高（㎜）', '車両総重量（kg）', '原動機型式', '馬力（ps）', 'ターボ', '排気量（cc）', '燃料', '問合せ番号', '車体番号', '上物メーカー', '上物型式', '上物年式', '装備・仕様（右記以外の）', 'ETC', 'バックカメラ', '記録簿', 'パワーウィンドウ', 'ドラレコ', 'エアコン', '電動ミラー', 'ABS', 'アルミホイール', 'エアサスシート', 'カーナビ', 'DPF', 'PMマフラー', '集中ドアロック']
    console.log('期待されるヘッダー数:', expectedHeaders.length)
    
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header))
    console.log('不足しているヘッダー:', missingHeaders)
    
    if (missingHeaders.length > 0) {
      console.log('ヘッダーが不足しています:', missingHeaders)
      return NextResponse.json({ 
        error: `CSVファイルの形式が正しくありません。以下のヘッダーが必要です: ${expectedHeaders.join(', ')}` 
      }, { status: 400 })
    }

    // 既存データの重複チェック用データを取得
    const existingVehicles = await getExistingVehicles()
    
    // データ行を処理（2行目をスキップ）
    const vehicles = []
    const currentUploadVehicles: any[] = [] // 現在のアップロード処理内での重複チェック用
    let successCount = 0
    let errorCount = 0
    let skippedCount = 0
    let updatedCount = 0
    const detailedResults: any[] = []

    for (let i = 1; i < rows.length; i++) {
      try {
        const row = rows[i]
        console.log(`行 ${i + 1} の値:`, row)
        
        const vehicleData: any = {}

        // ヘッダーと値をマッピング（日本語→英語に変換）
        headers.forEach((header) => {
          const englishField = fieldMapping[header] || header
          vehicleData[englishField] = row[header] || ''
        })

        console.log(`行 ${i + 1} の変換後データ:`, vehicleData)

        // 必須フィールドの検証
        if (!vehicleData['managementNumber'] || !vehicleData['maker']) {
          console.log(`行 ${i + 1}: 必須フィールドが不足 - 管理番号: "${vehicleData['managementNumber']}", メーカー: "${vehicleData['maker']}"`)
          errorCount++
          detailedResults.push({
            row: i + 1,
            status: 'error',
            message: '必須フィールドが不足しています'
          })
          continue
        }

        // 数値フィールドの変換（カンマを除去してから数値に変換）
        if (vehicleData['price']) {
          vehicleData['price'] = parseInt(vehicleData['price'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['wholesalePrice']) {
          vehicleData['wholesalePrice'] = parseInt(vehicleData['wholesalePrice'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['totalPayment']) {
          vehicleData['totalPayment'] = parseInt(vehicleData['totalPayment'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['mileage']) {
          vehicleData['mileage'] = parseInt(vehicleData['mileage'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['loadingCapacity']) {
          vehicleData['loadingCapacity'] = parseInt(vehicleData['loadingCapacity'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['outerLength']) {
          vehicleData['outerLength'] = parseInt(vehicleData['outerLength'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['outerWidth']) {
          vehicleData['outerWidth'] = parseInt(vehicleData['outerWidth'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['outerHeight']) {
          vehicleData['outerHeight'] = parseInt(vehicleData['outerHeight'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['innerLength']) {
          vehicleData['innerLength'] = parseInt(vehicleData['innerLength'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['innerWidth']) {
          vehicleData['innerWidth'] = parseInt(vehicleData['innerWidth'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['innerHeight']) {
          vehicleData['innerHeight'] = parseInt(vehicleData['innerHeight'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['totalWeight']) {
          vehicleData['totalWeight'] = parseInt(vehicleData['totalWeight'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['horsepower']) {
          vehicleData['horsepower'] = parseInt(vehicleData['horsepower'].toString().replace(/[^\d]/g, '')) || 0
        }
        if (vehicleData['displacement']) {
          vehicleData['displacement'] = parseInt(vehicleData['displacement'].toString().replace(/[^\d]/g, '')) || 0
        }

        // 既存データとの重複チェック
        let existingVehicle = null
        if (vehicleData.chassisNumber && vehicleData.chassisNumber.toString().trim() !== '') {
          existingVehicle = existingVehicles.find(v => v.chassisNumber === vehicleData.chassisNumber)
        }
        if (!existingVehicle && vehicleData.inquiryNumber && vehicleData.inquiryNumber.toString().trim() !== '') {
          existingVehicle = existingVehicles.find(v => v.inquiryNumber === vehicleData.inquiryNumber)
        }

        // 現在のアップロード処理内での重複チェック
        let currentUploadDuplicate = null
        if (vehicleData.chassisNumber && vehicleData.chassisNumber.toString().trim() !== '') {
          currentUploadDuplicate = currentUploadVehicles.find(v => v.chassisNumber === vehicleData.chassisNumber)
        }
        if (!currentUploadDuplicate && vehicleData.inquiryNumber && vehicleData.inquiryNumber.toString().trim() !== '') {
          currentUploadDuplicate = currentUploadVehicles.find(v => v.inquiryNumber === vehicleData.inquiryNumber)
        }

        if (currentUploadDuplicate) {
          console.log(`行 ${i + 1}: 現在のアップロード処理内で重複 - 車体番号: "${vehicleData.chassisNumber}", 問合せ番号: "${vehicleData.inquiryNumber}"`)
          errorCount++
          detailedResults.push({
            row: i + 1,
            status: 'error',
            message: '現在のアップロード処理内で重複データが検出されました'
          })
          continue
        }

        if (existingVehicle) {
          if (overwriteDuplicates) {
            // 既存データを更新
            const docRef = doc(db, 'vehicles', existingVehicle.id)
            await updateDoc(docRef, {
              ...vehicleData,
              updatedAt: new Date()
            })
            console.log(`行 ${i + 1}: 既存データ更新成功 - ID: ${existingVehicle.id}`)
            updatedCount++
            detailedResults.push({
              row: i + 1,
              status: 'updated',
              message: `既存データを更新しました（ID: ${existingVehicle.id}）`
            })
          } else {
            // 重複データをスキップ
            console.log(`行 ${i + 1}: 重複データをスキップ`)
            skippedCount++
            detailedResults.push({
              row: i + 1,
              status: 'skipped',
              message: '重複データのためスキップしました'
            })
          }
        } else {
          // 新規データを追加
          const docRef = await addDoc(collection(db, 'vehicles'), {
            ...vehicleData,
            createdAt: new Date(),
            updatedAt: new Date()
          })

          console.log(`行 ${i + 1}: Firebase保存成功 - ID: ${docRef.id}`)
          successCount++
          detailedResults.push({
            row: i + 1,
            status: 'success',
            message: `新規データを追加しました（ID: ${docRef.id}）`
          })
          vehicles.push(vehicleData)
          
          // 現在のアップロード処理内での重複チェック用に追加
          currentUploadVehicles.push(vehicleData)
        }
      } catch (error) {
        console.error(`行 ${i + 1} の処理でエラー:`, error)
        errorCount++
        detailedResults.push({
          row: i + 1,
          status: 'error',
          message: `処理エラー: ${error}`
        })
      }
    }

    console.log('最終結果:', { successCount, errorCount, skippedCount, updatedCount, totalProcessed: rows.length - 1 })

    return NextResponse.json({
      success: true,
      message: `アップロード完了: ${successCount}件新規追加, ${updatedCount}件更新, ${skippedCount}件スキップ, ${errorCount}件失敗`,
      successCount,
      errorCount,
      skippedCount,
      updatedCount,
      totalProcessed: rows.length - 1,
      detailedResults
    })

  } catch (error) {
    console.error('CSVアップロードエラー:', error)
    return NextResponse.json({ error: 'アップロード処理でエラーが発生しました' }, { status: 500 })
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