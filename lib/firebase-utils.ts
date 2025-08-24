import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { Vehicle, Store, Inquiry, Announcement } from "@/types";

// Firebase接続テスト関数
export const testFirebaseConnection = async () => {
  try {
    console.log("Firebase接続テスト開始...");
    const testCollection = collection(db, "test");
    console.log("テストコレクション参照作成成功");
    return true;
  } catch (error) {
    console.error("Firebase接続テスト失敗:", error);
    return false;
  }
};

// 共通の日時変換関数
const convertTimestamp = (timestamp: any) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

// 年式を日本語の元号形式に変換する関数
export const convertYearToJapaneseEra = (year: string | number): string => {
  if (!year) return "";
  
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
  
  if (yearNum >= 2019) {
    return `令和${yearNum - 2018}年`;
  } else if (yearNum >= 1989) {
    return `平成${yearNum - 1988}年`;
  } else if (yearNum >= 1926) {
    return `昭和${yearNum - 1925}年`;
  } else {
    return `${yearNum}年`;
  }
};

// 問い合わせ番号の自動生成関数
const generateInquiryNumber = async (): Promise<string> => {
  try {
    console.log("問い合わせ番号生成開始...");
    
    // 既存の車両から最大の問い合わせ番号を取得
    const vehiclesCollection = collection(db, "vehicles");
    const querySnapshot = await getDocs(vehiclesCollection);
    
    console.log("既存車両数:", querySnapshot.docs.length);
    
    let maxNumber = 10000; // 10001からスタートするため、初期値は10000
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log("車両データ:", doc.id, data.inquiryNumber);
      if (data.inquiryNumber) {
        // "N"プレフィックスを除去して数値部分のみを取得
        const numberPart = data.inquiryNumber.replace(/^N/, '');
        const number = parseInt(numberPart, 10);
        console.log("解析された番号:", numberPart, "→", number);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
          console.log("新しい最大値:", maxNumber);
        }
      }
    });
    
    // 次の番号を生成（N + 5桁以上）
    const nextNumber = maxNumber + 1;
    const generatedNumber = `N${nextNumber.toString()}`;
    console.log("生成された問い合わせ番号:", generatedNumber);
    
    return generatedNumber;
  } catch (error) {
    console.error("問い合わせ番号生成エラー:", error);
    // エラーの場合は現在のタイムスタンプベースで生成
    const timestamp = Date.now();
    const fallbackNumber = `N${timestamp}`;
    console.log("フォールバック番号生成:", fallbackNumber);
    return fallbackNumber;
  }
};

// 車両関連の操作
export const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log("車両追加開始...");
    console.log("入力データ:", vehicle);
    
    // 問い合わせ番号を自動生成
    const inquiryNumber = await generateInquiryNumber();
    console.log("生成された問い合わせ番号:", inquiryNumber);
    
    const vehicleDataWithInquiry = {
      ...vehicle,
      inquiryNumber, // 自動生成された問い合わせ番号を追加
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("保存する車両データ（問い合わせ番号含む）:", vehicleDataWithInquiry);
    
    const docRef = await addDoc(collection(db, "vehicles"), vehicleDataWithInquiry);
    console.log("車両保存成功、ドキュメントID:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle: ", error);
    throw error;
  }
};

export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
  try {
    const docRef = doc(db, "vehicles", id);
    
    // undefinedのフィールドを除外
    const cleanedVehicle = Object.fromEntries(
      Object.entries(vehicle).filter(([_, value]) => value !== undefined)
    );
    
    await updateDoc(docRef, {
      ...cleanedVehicle,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating vehicle: ", error);
    throw error;
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    const docRef = doc(db, "vehicles", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting vehicle: ", error);
    throw error;
  }
};

// 画像URLの正規化関数
export const normalizeImageUrls = (vehicle: any): string[] => {
  const urls: string[] = [];
  
  // imageUrls配列がある場合
  if (vehicle.imageUrls && Array.isArray(vehicle.imageUrls)) {
    urls.push(...vehicle.imageUrls.filter((url: string) => url && url.trim() !== ""));
  }
  
  // imageUrl単体がある場合（配列に含まれていない場合のみ追加）
  if (vehicle.imageUrl && vehicle.imageUrl.trim() !== "" && !urls.includes(vehicle.imageUrl)) {
    urls.unshift(vehicle.imageUrl); // 最初に追加
  }
  
  // 一時的なURLのみを除外（実際の車両写真は保持）
  const filteredUrls = urls.filter(url =>
  url &&
  url.trim() !== "" &&
  url !== "/placeholder.jpg" &&
  !url.includes("temp_") &&
  !url.startsWith("blob:") &&
  !url.startsWith("data:")
);
  
  console.log("正規化された画像URL:", {
    original: { imageUrls: vehicle.imageUrls, imageUrl: vehicle.imageUrl },
    normalized: filteredUrls
  });
  
  return filteredUrls.length > 0 ? filteredUrls : ["/placeholder.jpg"];
};

// 最新の車両を取得する関数（新着車輌用）
export const getLatestVehicles = async (limit: number = 4): Promise<Vehicle[]> => {
  try {
    console.log(`最新${limit}台の車両を取得中...`);
    
    const vehiclesCollection = collection(db, "vehicles");
    const q = query(
      vehiclesCollection,
      orderBy("createdAt", "desc"),
      // limit(limit) // Firestoreの制限により、インデックスが必要な場合があるため一時的にコメントアウト
    );
    
    const querySnapshot = await getDocs(q);
    console.log("最新車両クエリ結果:", querySnapshot.docs.length, "件のドキュメント");
    
    const vehicles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log("最新車両データ:", doc.id, data);
      
      // 画像URLを正規化
      const normalizedImageUrls = normalizeImageUrls(data);
      
      return {
        id: doc.id,
        ...data,
        imageUrls: normalizedImageUrls,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      } as Vehicle;
    });
    
    // 作成日時でソートして最新の4台を返す
    const sortedVehicles = vehicles
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    console.log("最新車両取得完了:", sortedVehicles.length, "台");
    return sortedVehicles;
  } catch (error) {
    console.error("最新車両取得エラー:", error);
    // インデックスが構築中の場合は、全件取得してソート
    try {
      console.log("インデックス構築中のため、全件取得でフォールバック...");
      const allVehicles = await getVehicles();
      const sortedVehicles = allVehicles
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      console.log("フォールバック成功:", sortedVehicles.length, "台");
      return sortedVehicles;
    } catch (fallbackError) {
      console.error("フォールバックエラー:", fallbackError);
      return [];
    }
  }
};

// 車両データ取得時の画像URL処理を改善
export const getVehicles = async () => {
  try {
    console.log("Firebaseから車両データを取得中...")
    console.log("Firestore db オブジェクト:", db)
    
    const vehiclesCollection = collection(db, "vehicles");
    console.log("vehiclesコレクション参照:", vehiclesCollection)
    
    const querySnapshot = await getDocs(vehiclesCollection);
    console.log("Firestoreクエリ結果:", querySnapshot.docs.length, "件のドキュメント")
    
    const vehicles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log("ドキュメントデータ:", doc.id, data);
      
      // 画像URLを正規化
      const normalizedImageUrls = normalizeImageUrls(data);
      
      return {
        id: doc.id,
        ...data,
        imageUrls: normalizedImageUrls, // 正規化された画像URLを設定
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      };
    }) as Vehicle[];
    
    console.log("変換後の車両データ:", vehicles)
    return vehicles;
  } catch (error) {
    console.error("Error getting vehicles: ", error);
    console.error("エラーの詳細:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

export const getVehicle = async (id: string) => {
  try {
    const docRef = doc(db, "vehicles", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // 画像URLを正規化
      const normalizedImageUrls = normalizeImageUrls(data);
      
      return {
        id: docSnap.id,
        ...data,
        imageUrls: normalizedImageUrls, // 正規化された画像URLを設定
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      } as Vehicle;
    }
    return null;
  } catch (error) {
    console.error("Error getting vehicle: ", error);
    throw error;
  }
};

// SOLD OUTの車両を取得する関数
export const getSoldOutVehicles = async (limit: number = 3) => {
  try {
    console.log("SOLD OUT車両データを取得中...");
    
    const vehiclesCollection = collection(db, "vehicles");
    
    // インデックスが構築中の場合のフォールバック処理
    try {
      // まず、インデックス付きクエリを試行
      const soldOutQuery = query(
        vehiclesCollection,
        where("isSoldOut", "==", true),
        orderBy("updatedAt", "desc")
      );
      
      const querySnapshot = await getDocs(soldOutQuery);
      console.log("SOLD OUT車両数:", querySnapshot.docs.length);
      
      const vehicles = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // 画像URLを正規化
        const normalizedImageUrls = normalizeImageUrls(data);
        
        return {
          id: doc.id,
          ...data,
          imageUrls: normalizedImageUrls,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt)
        };
      }) as Vehicle[];
      
      // 最新の3台を返す
      return vehicles.slice(0, limit);
    } catch (indexError) {
      console.log("インデックスがまだ構築中です。フォールバック処理を実行します。");
      
      // インデックスなしで全車両を取得し、クライアント側でフィルタリング
      const allVehiclesQuery = query(vehiclesCollection);
      const querySnapshot = await getDocs(allVehiclesQuery);
      
      const allVehicles = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // 画像URLを正規化
        const normalizedImageUrls = normalizeImageUrls(data);
        
        return {
          id: doc.id,
          ...data,
          imageUrls: normalizedImageUrls,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt)
        };
      }) as Vehicle[];
      
      // SOLD OUT車両をフィルタリングし、updatedAtでソート
      const soldOutVehicles = allVehicles
        .filter(vehicle => vehicle.isSoldOut === true)
        .sort((a, b) => {
          const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
          const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, limit);
      
      console.log("フォールバック処理でSOLD OUT車両数:", soldOutVehicles.length);
      return soldOutVehicles;
    }
  } catch (error) {
    console.error("Error getting sold out vehicles: ", error);
    throw error;
  }
};

// 新規登録された車両を最新順で取得する関数
export const getNewlyRegisteredVehicles = async (limitCount: number = 4): Promise<Vehicle[]> => {
  try {
    console.log("新規登録車両データを取得中...");
    
    const vehiclesCollection = collection(db, "vehicles");
    
    // インデックスが構築中の場合のフォールバック処理
    try {
      // まず、インデックス付きクエリを試行（作成日時で降順ソート）
      const newVehiclesQuery = query(
        vehiclesCollection,
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(newVehiclesQuery);
      console.log("新規登録車両数:", querySnapshot.docs.length);
      
      const vehicles = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("新規登録車両データ:", doc.id, data);
        
        // 画像URLを正規化
        const normalizedImageUrls = normalizeImageUrls(data);
        
        return {
          id: doc.id,
          ...data,
          imageUrls: normalizedImageUrls,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt)
        } as Vehicle;
      });
      
      console.log("新規登録車両取得完了:", vehicles.length, "台");
      return vehicles;
    } catch (indexError) {
      console.log("インデックスがまだ構築中です。フォールバック処理を実行します。");
      
      // インデックスなしで全車両を取得し、クライアント側でソート
      const allVehiclesQuery = query(vehiclesCollection);
      const querySnapshot = await getDocs(allVehiclesQuery);
      
      const allVehicles = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // 画像URLを正規化
        const normalizedImageUrls = normalizeImageUrls(data);
        
        return {
          id: doc.id,
          ...data,
          imageUrls: normalizedImageUrls,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt)
        };
      }) as Vehicle[];
      
      // 作成日時でソートして最新の車両を返す
      const sortedVehicles = allVehicles
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, limitCount);
      
      console.log("フォールバック処理で新規登録車両数:", sortedVehicles.length);
      return sortedVehicles;
    }
  } catch (error) {
    console.error("新規登録車両取得エラー:", error);
    return [];
  }
};

// 店舗関連の操作
export const addStore = async (store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "stores"), {
      ...store,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding store: ", error);
    throw error;
  }
};

export const updateStore = async (id: string, store: Partial<Store>) => {
  try {
    const docRef = doc(db, "stores", id);
    await updateDoc(docRef, {
      ...store,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating store: ", error);
    throw error;
  }
};

export const deleteStore = async (id: string) => {
  try {
    const docRef = doc(db, "stores", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting store: ", error);
    throw error;
  }
};

export const getStores = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "stores"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Store[];
  } catch (error) {
    console.error("Error getting stores: ", error);
    throw error;
  }
};

// お問い合わせ関連の操作
export const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      ...inquiry,
      status: "未対応",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding inquiry: ", error);
    throw error;
  }
};

export const updateInquiry = async (id: string, inquiry: Partial<Inquiry>) => {
  try {
    const docRef = doc(db, "inquiries", id);
    await updateDoc(docRef, {
      ...inquiry,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating inquiry: ", error);
    throw error;
  }
};

export const deleteInquiry = async (id: string) => {
  try {
    const docRef = doc(db, "inquiries", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting inquiry: ", error);
    throw error;
  }
};

export const getInquiries = async () => {
  try {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Inquiry[];
  } catch (error) {
    console.error("Error getting inquiries: ", error);
    throw error;
  }
};

// お知らせ関連の操作
export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "announcements"), {
      ...announcement,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding announcement: ", error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, announcement: Partial<Announcement>) => {
  try {
    const docRef = doc(db, "announcements", id);
    await updateDoc(docRef, {
      ...announcement,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating announcement: ", error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    const docRef = doc(db, "announcements", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting announcement: ", error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "announcements"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as Announcement[];
  } catch (error) {
    console.error("Error getting announcements: ", error);
    throw error;
  }
};

// 画像アップロード関連
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    console.log("画像アップロード開始:", { fileName: file.name, path });
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("画像アップロード成功:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

export const deleteImage = async (path: string) => {
  try {
    console.log("画像削除開始:", path);
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log("画像削除成功:", path);
  } catch (error) {
    console.error("Error deleting image: ", error);
    throw error;
  }
}; 