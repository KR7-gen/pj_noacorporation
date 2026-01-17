export interface Vehicle {
  id?: string;
  managementNumber?: string;
  name: string;
  maker: string;
  model: string;
  year: string;
  month?: string; // 月を追加
  mileage: number;
  mileageStatus?: string;
  price: number;
  totalPrice?: number;
  description: string;
  imageUrls: string[];
  bodyType?: string;
  size?: string;
  vehicleType?: string; // 車種を追加
  chassisNumber?: string; // 車体番号を追加
  inspectionDate?: string;
  wholesalePrice: number;
  totalPayment: number;
  expiryDate: string;
  imageUrl?: string;
  // 新しいフィールド
  modelCode?: string;
  loadingCapacity?: number;
  mission?: string;
  shift?: string;
  inspectionStatus?: string;
  outerLength?: number;
  outerWidth?: number;
  outerHeight?: number;
  innerLength?: number;
  innerWidth?: number;
  innerHeight?: number;
  totalWeight?: number;
  engineModel?: string;
  horsepower?: number;
  turbo?: string;
  displacement?: number;
  fuel?: string;
  inquiryNumber?: string;
  bodyMaker?: string;
  bodyModel?: string;
  bodyYear?: string;
  equipment?: string; // 装備品をカンマ区切り文字列として保存
  etc?: boolean;
  backCamera?: boolean;
  recordBook?: boolean;
  powerWindow?: boolean;
  driveRecorder?: boolean;
  airConditioner?: boolean;
  electricMirror?: boolean;
  abs?: boolean;
  aluminumWheel?: boolean;
  airSuspensionSeat?: boolean;
  carNavigation?: boolean;
  dpf?: boolean;
  pmMuffler?: boolean;
  centralDoorLock?: boolean;
  // 車検証の画像
  inspectionImageUrl?: string;
  // 商談関連フィールド
  negotiationDeadline?: string;
  salesRepresentative?: string;
  customerName?: string;
  isNegotiating?: boolean;
  isSoldOut?: boolean;
  isPrivate?: boolean;
  isTemporarySave?: boolean; // 一時保存状態
  // 買取実績表示フラグ
  reflectInPurchaseAchievements?: boolean;
  // 支払額シミュレーション
  simulation2Year?: string;
  simulation3Year?: string;
  simulation4Year?: string;
  simulation5Year?: string;
  // 店舗関連フィールド
  storeName?: string; // 在庫店舗名
  storeId?: string; // 店舗ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inquiry {
  id?: string;
  type: "購入" | "買取" | "その他";
  fullName: string;
  company: string;
  name: string;
  prefecture: string;
  phone: string;
  email: string;
  remarks: string;
  status: "未対応" | "対応中" | "完了";
  reply?: string;
  exteriorImage?: string;
  vehicleInspectionImage?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
} 