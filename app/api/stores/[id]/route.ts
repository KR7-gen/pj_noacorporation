import { NextRequest, NextResponse } from 'next/server'
import { getStore, updateStore, deleteStore } from '@/lib/firebase-utils'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = params.id
    
    console.log(`DELETE request for store ${storeId}`)
    
    // 店舗が存在するかチェック
    const store = await getStore(storeId)
    
    if (!store) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    // Firebase Firestoreから削除
    await deleteStore(storeId)
    
    console.log(`店舗ID ${storeId} を削除しました`)
    
    return NextResponse.json(
      { message: '店舗が正常に削除されました' },
      { status: 200 }
    )
  } catch (error) {
    console.error('店舗削除エラー:', error)
    return NextResponse.json(
      { error: '店舗の削除に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = params.id
    
    console.log(`GET request for store ${storeId}`)
    
    // Firebase Firestoreから店舗詳細を取得
    const store = await getStore(storeId)
    
    if (!store) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(store)
  } catch (error) {
    console.error('店舗取得エラー:', error)
    return NextResponse.json(
      { error: '店舗の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = params.id
    const body = await request.json()
    
    console.log('PUT request received:', { storeId, body })
    
    // 店舗が存在するかチェック
    const store = await getStore(storeId)
    
    if (!store) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    // Firebase Firestoreを更新
    await updateStore(storeId, body)
    
    // 更新後の詳細データを取得
    const updatedStore = await getStore(storeId)
    
    console.log(`店舗ID ${storeId} を更新しました`)
    
    return NextResponse.json(
      { message: '店舗が正常に更新されました', store: updatedStore },
      { status: 200 }
    )
  } catch (error) {
    console.error('店舗更新エラー:', error)
    return NextResponse.json(
      { error: '店舗の更新に失敗しました' },
      { status: 500 }
    )
  }
} 