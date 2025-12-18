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

// 日付を和暦形式に変換する関数（車検期限表示用）
export function formatInspectionDateToJapaneseEra(date: string | Date | undefined): string {
  if (!date) return "";
  
  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  
  // 日付のみを比較するため、時刻を0にリセット
  const dateOnly = new Date(year, month - 1, day);
  const reiwaStart = new Date(2019, 4, 1); // 2019年5月1日（月は0始まりなので4）
  const heiseiStart = new Date(1989, 0, 8); // 1989年1月8日
  const showaStart = new Date(1926, 0, 1); // 1926年1月1日
  
  let era: string;
  let eraYear: number;
  
  // 令和：2019年5月1日〜
  if (dateOnly >= reiwaStart) {
    era = "R";
    eraYear = year - 2018;
  }
  // 平成：1989年1月8日〜2019年4月30日
  else if (dateOnly >= heiseiStart) {
    era = "H";
    eraYear = year - 1988;
  }
  // 昭和：1926年1月1日〜1989年1月7日
  else if (dateOnly >= showaStart) {
    era = "S";
    eraYear = year - 1925;
  }
  // それ以前
  else {
    return `${year}年${month}月${day}日`;
  }
  
  return `${era}${eraYear}年${month}月${day}日`;
}
