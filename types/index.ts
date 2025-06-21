export interface Vehicle {
  id?: string;
  managementNumber?: string;
  name: string;
  maker: string;
  model: string;
  year: number;
  mileage: number;
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