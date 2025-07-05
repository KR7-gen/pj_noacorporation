import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 })
    }

    // ファイルの基本情報
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    }

    // ファイルの内容を読み取り
    const csvText = await file.text()
    
    // 詳細な分析
    const analysis = {
      fileInfo,
      totalLength: csvText.length,
      first500Chars: csvText.substring(0, 500),
      firstLine: csvText.split('\n')[0],
      firstLineLength: csvText.split('\n')[0].length,
      charCodes: Array.from(csvText.split('\n')[0]).map(char => ({
        char: char,
        code: char.charCodeAt(0),
        hex: char.charCodeAt(0).toString(16)
      })),
      hasBOM: csvText.startsWith('\uFEFF'),
      lineCount: csvText.split('\n').length,
      lines: csvText.split('\n').slice(0, 3) // 最初の3行
    }

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('テスト処理エラー:', error)
    return NextResponse.json({ error: 'テスト処理でエラーが発生しました' }, { status: 500 })
  }
} 