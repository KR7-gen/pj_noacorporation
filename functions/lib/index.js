"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testNegotiationDeadlineAlert = exports.sendNegotiationDeadlineAlert = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
// Firebase Admin SDKの初期化
admin.initializeApp();
const db = admin.firestore();
// メール送信の設定
const getEmailConfig = () => {
    var _a, _b;
    // 環境変数から取得を試行
    const envUser = process.env.EMAIL_USER;
    const envPass = process.env.EMAIL_PASSWORD;
    // Firebase Functions Configから取得を試行
    const configUser = (_a = functions.config().gmail) === null || _a === void 0 ? void 0 : _a.user;
    const configPass = (_b = functions.config().gmail) === null || _b === void 0 ? void 0 : _b.pass;
    return {
        user: envUser || configUser || 'your-email@gmail.com',
        pass: envPass || configPass || 'your-app-password',
    };
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: getEmailConfig()
});
// 商談期限アラート機能
exports.sendNegotiationDeadlineAlert = functions.pubsub
    .schedule('0 9 * * *') // 毎日9時に実行
    .timeZone('Asia/Tokyo')
    .onRun(async (context) => {
    try {
        console.log('商談期限アラート機能開始:', new Date().toISOString());
        // 明日の日付を取得（日本時間）
        const today = new Date();
        const japanTime = new Date(today.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
        japanTime.setDate(japanTime.getDate() + 1); // 明日
        const tomorrowString = japanTime.toISOString().split('T')[0]; // YYYY-MM-DD形式
        console.log('明日の日付:', tomorrowString);
        // 商談中の車両で、明日が商談期限の車両を取得
        const vehiclesRef = db.collection('vehicles');
        const snapshot = await vehiclesRef
            .where('isNegotiating', '==', true)
            .where('negotiationDeadline', '==', tomorrowString)
            .get();
        console.log('対象車両数:', snapshot.docs.length);
        if (snapshot.empty) {
            console.log('商談期限前日の車両はありません');
            return null;
        }
        // メール本文を作成
        let emailBody = `お疲れ様です。

以下の車両が本日、商談期限を迎えます。
ご確認の上、必要な対応をお願いいたします。

------------------------------------
■ 対象車両情報

`;
        // 各車両の情報を追加
        snapshot.docs.forEach((doc, index) => {
            const vehicle = doc.data();
            const vehicleName = `${vehicle.maker} ${vehicle.model}`;
            const inquiryNumber = vehicle.inquiryNumber || '未設定';
            const year = vehicle.year || '未設定';
            const modelCode = vehicle.modelCode || '未設定';
            const vehicleUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'}/vehicle/${doc.id}`;
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
        // メール送信
        const emailConfig = getEmailConfig();
        const mailOptions = {
            from: emailConfig.user,
            to: 'kuribayashi0515@gmail.com, kosaku.tsubata@gmail.com',
            subject: `【商談期限アラート】本日商談期限の車両があります（${tomorrowString}）`,
            text: emailBody
        };
        console.log('メール送信開始...');
        const result = await transporter.sendMail(mailOptions);
        console.log('メール送信成功:', result.messageId);
        // 送信ログをFirestoreに保存
        await db.collection('emailLogs').add({
            type: 'negotiationDeadlineAlert',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            recipient: 'kuribayashi0515@gmail.com, kosaku.tsubata@gmail.com',
            subject: mailOptions.subject,
            vehicleCount: snapshot.docs.length,
            vehicleIds: snapshot.docs.map(doc => doc.id),
            success: true
        });
        return { success: true, messageId: result.messageId, vehicleCount: snapshot.docs.length };
    }
    catch (error) {
        console.error('商談期限アラート機能エラー:', error);
        // エラーログをFirestoreに保存
        try {
            await db.collection('emailLogs').add({
                type: 'negotiationDeadlineAlert',
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                recipient: 'kuribayashi0515@gmail.com, kosaku.tsubata@gmail.com',
                error: error instanceof Error ? error.message : String(error),
                success: false
            });
        }
        catch (logError) {
            console.error('エラーログ保存失敗:', logError);
        }
        throw error;
    }
});
// 手動実行用のHTTP関数（テスト用）
exports.testNegotiationDeadlineAlert = functions.https.onRequest(async (req, res) => {
    try {
        console.log('手動テスト実行開始');
        // 今日の日付を取得（日本時間）
        const today = new Date();
        const japanTime = new Date(today.getTime() + (9 * 60 * 60 * 1000));
        const todayString = japanTime.toISOString().split('T')[0];
        console.log('今日の日付:', todayString);
        // 商談中の車両で、今日が商談期限の車両を取得
        const vehiclesRef = db.collection('vehicles');
        const snapshot = await vehiclesRef
            .where('isNegotiating', '==', true)
            .where('negotiationDeadline', '==', todayString)
            .get();
        console.log('対象車両数:', snapshot.docs.length);
        if (snapshot.empty) {
            res.json({
                success: true,
                message: '商談期限当日の車両はありません',
                date: todayString,
                vehicleCount: 0
            });
            return;
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
            const vehicleUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'}/vehicle/${doc.id}`;
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
        // メール送信
        const emailConfig = getEmailConfig();
        const mailOptions = {
            from: emailConfig.user,
            to: 'kuribayashi0515@gmail.com, kosaku.tsubata@gmail.com',
            subject: `【商談期限アラート】本日商談期限の車両があります（${todayString}）`,
            text: emailBody
        };
        console.log('メール送信開始...');
        const result = await transporter.sendMail(mailOptions);
        console.log('メール送信成功:', result.messageId);
        res.json({
            success: true,
            message: 'メール送信成功',
            messageId: result.messageId,
            date: todayString,
            vehicleCount: snapshot.docs.length,
            vehicles
        });
    }
    catch (error) {
        console.error('テスト実行エラー:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
//# sourceMappingURL=index.js.map