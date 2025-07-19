export interface Vehicle {
  id?: string;
  managementNumber?: string;
  name: string;
  maker: string;
  model: string;
  year: string;
  month?: string; // 月を追加
  mileage: string;
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
  equipment?: string[]; // ←ここをstring[]に修正
  etc?: string;
  backCamera?: string;
  recordBook?: string;
  powerWindow?: string;
  driveRecorder?: string;
  airConditioner?: string;
  electricMirror?: string;
  abs?: string;
  aluminumWheel?: string;
  airSuspensionSeat?: string;
  carNavigation?: string;
  dpf?: string;
  pmMuffler?: string;
  centralDoorLock?: string;
  // 車検証と状態表の画像
  inspectionImageUrl?: string;
  conditionImageUrl?: string;
  // 商談関連フィールド
  negotiationDeadline?: string;
  salesRepresentative?: string;
  customerName?: string;
  isNegotiating?: boolean;
  isSoldOut?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
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