import { NextRequest, NextResponse } from 'next/server'
import { addStore, getStores } from '@/lib/firebase-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('POST request received:', body)
    
    // Firebase Firestoreに新規店舗を作成
    const newId = await addStore(body)
    
    console.log(`店舗ID ${newId} を作成しました`)
    
    return NextResponse.json(
      { message: '店舗が正常に作成されました', storeId: newId },
      { status: 201 }
    )
  } catch (error) {
    console.error('店舗作成エラー:', error)
    return NextResponse.json(
      { error: '店舗の作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Firebase Firestoreから店舗一覧を取得
    const stores = await getStores()
    const response = NextResponse.json(stores)
    
    // キャッシュを無効化するヘッダーを追加
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('店舗一覧取得エラー:', error)
    return NextResponse.json(
      { error: '店舗一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
} 