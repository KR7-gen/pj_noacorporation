import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    emailUser: process.env.EMAIL_USER ? '設定済み' : '未設定',
    emailPassword: process.env.EMAIL_PASSWORD ? '設定済み' : '未設定',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '未設定',
    nodeEnv: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('EMAIL') || key.includes('BASE_URL'))
  });
} 