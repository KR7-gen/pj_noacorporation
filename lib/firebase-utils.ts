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
  Timestamp 
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

// 車両関連の操作
export const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "vehicles"), {
      ...vehicle,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle: ", error);
    throw error;
  }
};

export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
  try {
    const docRef = doc(db, "vehicles", id);
    await updateDoc(docRef, {
      ...vehicle,
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
      return {
        id: doc.id,
        ...data,
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
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: convertTimestamp(docSnap.data().createdAt),
        updatedAt: convertTimestamp(docSnap.data().updatedAt)
      } as Vehicle;
    }
    return null;
  } catch (error) {
    console.error("Error getting vehicle: ", error);
    throw error;
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
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

export const deleteImage = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image: ", error);
    throw error;
  }
}; 