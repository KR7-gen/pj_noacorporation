export interface Vehicle {
  id?: string;
  managementNumber?: string;
  name: string;
  maker: string;
  model: string;
  year: string;
  mileage: string;
  price: number;
  totalPrice?: number;
  description: string;
  imageUrls: string[];
  bodyType?: string;
  size?: string;
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
  chassisNumber?: string;
  bodyMaker?: string;
  bodyModel?: string;
  bodyYear?: string;
  equipment?: string;
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