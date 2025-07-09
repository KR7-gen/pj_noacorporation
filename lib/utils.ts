import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// カンマ区切り表示用のユーティリティ関数
export function formatNumberWithCommas(value: string | number | undefined): string {
  if (!value) return "";
  const numValue = typeof value === 'string' ? value.replace(/,/g, '') : value.toString();
  const num = parseFloat(numValue);
  if (isNaN(num)) return value.toString();
  return num.toLocaleString();
}

// 入力時のカンマ区切り処理
export function formatInputWithCommas(value: string): string {
  const numValue = value.replace(/[^\d]/g, '');
  if (!numValue) return "";
  const num = parseInt(numValue);
  if (isNaN(num)) return "";
  return num.toLocaleString();
}
