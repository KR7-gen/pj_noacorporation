import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import nodemailer from 'nodemailer';

// デバッグ用：環境変数の確認
console.log('環境変数確認:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '設定済み' : '未設定');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '設定済み' : '未設定');
console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);

// メール送信の設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'kuribayashi0515@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'ystufoeahxjlgnwu'
  }
});

export async function POST(request: NextRequest) {
  try {
    console.log('商談期限アラートテスト開始');
    
    // 今日の日付を取得（日本時間）
    const today = new Date();
    const japanTime = new Date(today.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
    const todayString = japanTime.toISOString().split('T')[0]; // YYYY-MM-DD形式
    
    console.log('今日の日付:', todayString);
    
    // 商談中の車両で、今日が商談期限の車両を取得
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(
      vehiclesRef,
      where('isNegotiating', '==', true),
      where('negotiationDeadline', '==', todayString)
    );
    
    const snapshot = await getDocs(q);
    console.log('対象車両数:', snapshot.docs.length);
    
    if (snapshot.empty) {
      console.log('商談期限当日の車両はありません');
      return NextResponse.json({ 
        success: true, 
        message: '商談期限当日の車両はありません',
        date: todayString,
        vehicleCount: 0
      });
    }
    
    // メール本文を作成
    let emailBody = `お疲れ様です。

以下の車両が本日、商談期限を迎えます。
ご確認の上、必要な対応をお願いいたします。

------------------------------------
■ 対象車両情報

`;

    // 各車両の情報を追加
    const vehicles = [];
    snapshot.docs.forEach((doc) => {
      const vehicle = doc.data();
      const vehicleName = `${vehicle.maker} ${vehicle.model}`;
      const inquiryNumber = vehicle.inquiryNumber || '未設定';
      const year = vehicle.year || '未設定';
      const modelCode = vehicle.modelCode || '未設定';
      const vehicleUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/vehicle/${doc.id}`;
      
      vehicles.push({
        id: doc.id,
        name: vehicleName,
        inquiryNumber,
        year,
        modelCode,
        url: vehicleUrl
      });
      
      emailBody += `・車両名　　　：${vehicleName}
・問い合わせ番号：${inquiryNumber}
・年式　　　　：${year}年
・型式　　　　：${modelCode}
・商談期限　　：本日
・車両URL　　：${vehicleUrl}

`;
    });
    
    emailBody += `------------------------------------

※13時時点での自動通知です。
※ステータス変更などご対応後は、改めて商談状況をご確認ください。

---

このメールはシステムによる自動送信です。
ご不明点がある場合は管理担当までご連絡ください。`;

    console.log('メール送信設定確認:');
    console.log('送信者:', process.env.EMAIL_USER);
    console.log('受信者: kuribayashi0515@gmail.com');
    console.log('件名:', `【商談期限アラート】本日商談期限の車両があります（${todayString}）`);

    // メール送信
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'kuribayashi0515@gmail.com',
      subject: `【商談期限アラート】本日商談期限の車両があります（${todayString}）`,
      text: emailBody
    };
    
    console.log('メール送信開始...');
    
    // メール送信前の設定確認
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('環境変数が設定されていません。デフォルト値を使用します。');
    }
    
    const result = await transporter.sendMail(mailOptions);
    console.log('メール送信成功:', result.messageId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'メール送信成功',
      messageId: result.messageId,
      date: todayString,
      vehicleCount: snapshot.docs.length,
      vehicles
    });
    
  } catch (error) {
    console.error('商談期限アラートテストエラー:', error);
    console.error('エラーの詳細:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // エラーメッセージをユーザーフレンドリーにする
    let errorMessage = 'メール送信に失敗しました';
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'メール認証に失敗しました。環境変数を確認してください。';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'ネットワーク接続に失敗しました。';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 });
  }
} 