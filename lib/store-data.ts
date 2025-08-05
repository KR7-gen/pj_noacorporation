// 永続的な店舗データストア
export interface Store {
  id: number
  name: string
  address: string
  phone: string
  businessHours: string
}

export interface DetailedStore {
  id: number
  name: string
  tel: string
  fax: string
  address: string
  businessHours: {
    monday: { start: string; end: string; closed: boolean }
    tuesday: { start: string; end: string; closed: boolean }
    wednesday: { start: string; end: string; closed: boolean }
    thursday: { start: string; end: string; closed: boolean }
    friday: { start: string; end: string; closed: boolean }
    saturday: { start: string; end: string; closed: boolean }
    sunday: { start: string; end: string; closed: boolean }
  }
}

// 初期データ
const initialStores: Store[] = [
  {
    id: 1,
    name: "○○店",
    address: "東京都渋谷区○○1-1-1",
    phone: "000-0000-0000",
    businessHours: "月〜金 09:00~18:00"
  },
  {
    id: 2,
    name: "△△店",
    address: "東京都新宿区△△2-2-2",
    phone: "000-0000-0001",
    businessHours: "月〜金 09:00~18:00"
  },
  {
    id: 3,
    name: "□□店",
    address: "東京都品川区□□3-3-3",
    phone: "000-0000-0002",
    businessHours: "月〜金 09:00~18:00"
  }
]

// サーバーサイド用のファイルストレージ
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const getStoragePath = () => {
  return join(process.cwd(), 'data', 'stores.json')
}

const ensureDataDirectory = () => {
  const fs = require('fs')
  const path = require('path')
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

const loadFromFile = (): Store[] => {
  try {
    ensureDataDirectory()
    const filePath = getStoragePath()
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to load stores from file:', error)
  }
  return [...initialStores]
}

const saveToFile = (stores: Store[]) => {
  try {
    ensureDataDirectory()
    const filePath = getStoragePath()
    writeFileSync(filePath, JSON.stringify(stores, null, 2), 'utf8')
  } catch (error) {
    console.error('Failed to save stores to file:', error)
  }
}

// ブラウザのlocalStorageを使用してデータを永続化
class StoreDataManager {
  private stores: Store[] = []
  private storageKey = 'store_data'

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      // クライアントサイド
      try {
        const stored = localStorage.getItem(this.storageKey)
        if (stored) {
          this.stores = JSON.parse(stored)
        } else {
          this.stores = [...initialStores]
          this.saveToStorage()
        }
      } catch (error) {
        console.error('Failed to load stores from storage:', error)
        this.stores = [...initialStores]
      }
    } else {
      // サーバーサイド
      this.stores = loadFromFile()
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      // クライアントサイド
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stores))
      } catch (error) {
        console.error('Failed to save stores to storage:', error)
      }
    } else {
      // サーバーサイド
      saveToFile(this.stores)
    }
  }

  getAllStores(): Store[] {
    return [...this.stores]
  }

  getStoreById(id: number): Store | null {
    return this.stores.find(store => store.id === id) || null
  }

  getDetailedStoreById(id: number): DetailedStore | null {
    const store = this.getStoreById(id)
    if (!store) return null

    return {
      id: store.id,
      name: store.name,
      tel: store.phone,
      fax: store.phone, // デフォルト値
      address: store.address,
      businessHours: {
        monday: { start: "09:00", end: "18:00", closed: false },
        tuesday: { start: "09:00", end: "18:00", closed: false },
        wednesday: { start: "09:00", end: "18:00", closed: false },
        thursday: { start: "09:00", end: "18:00", closed: false },
        friday: { start: "09:00", end: "18:00", closed: false },
        saturday: { start: "10:00", end: "17:00", closed: false },
        sunday: { start: "10:00", end: "17:00", closed: true }
      }
    }
  }

  addStore(storeData: any): number {
    const newId = Math.max(...this.stores.map(store => store.id), 0) + 1
    
    // businessHoursオブジェクトを文字列に変換
    let businessHoursString = "月〜金 09:00~18:00"
    if (storeData.businessHours) {
      const hours = storeData.businessHours
      const openDays = []
      
      if (hours.monday && !hours.monday.closed) openDays.push("月")
      if (hours.tuesday && !hours.tuesday.closed) openDays.push("火")
      if (hours.wednesday && !hours.wednesday.closed) openDays.push("水")
      if (hours.thursday && !hours.thursday.closed) openDays.push("木")
      if (hours.friday && !hours.friday.closed) openDays.push("金")
      if (hours.saturday && !hours.saturday.closed) openDays.push("土")
      if (hours.sunday && !hours.sunday.closed) openDays.push("日")
      
      if (openDays.length > 0) {
        const firstOpenDay = openDays[0]
        let startTime = "09:00"
        let endTime = "18:00"
        
        const dayMap = { "月": "monday", "火": "tuesday", "水": "wednesday", "木": "thursday", "金": "friday", "土": "saturday", "日": "sunday" }
        const dayKey = dayMap[firstOpenDay as keyof typeof dayMap]
        if (dayKey && hours[dayKey]) {
          startTime = hours[dayKey].start || startTime
          endTime = hours[dayKey].end || endTime
        }
        
        let displayDays = ""
        if (openDays.length === 7) {
          displayDays = "月～日"
        } else if (openDays.length === 1) {
          displayDays = openDays[0]
        } else {
          displayDays = `${openDays[0]}～${openDays[openDays.length - 1]}`
        }
        
        businessHoursString = `${displayDays} ${startTime}~${endTime}`
      } else {
        businessHoursString = "定休日"
      }
    }
    
    const newStore: Store = {
      id: newId,
      name: storeData.name,
      address: storeData.address,
      phone: storeData.tel || storeData.phone,
      businessHours: businessHoursString
    }
    
    this.stores.push(newStore)
    this.saveToStorage()
    
    return newId
  }

  updateStore(storeId: number, updatedData: any): boolean {
    const storeIndex = this.stores.findIndex(store => store.id === storeId)
    if (storeIndex === -1) return false

    // businessHoursオブジェクトを文字列に変換
    let businessHoursString = "月〜金 09:00~18:00"
    if (updatedData.businessHours) {
      const hours = updatedData.businessHours
      const openDays = []
      
      if (hours.monday && !hours.monday.closed) openDays.push("月")
      if (hours.tuesday && !hours.tuesday.closed) openDays.push("火")
      if (hours.wednesday && !hours.wednesday.closed) openDays.push("水")
      if (hours.thursday && !hours.thursday.closed) openDays.push("木")
      if (hours.friday && !hours.friday.closed) openDays.push("金")
      if (hours.saturday && !hours.saturday.closed) openDays.push("土")
      if (hours.sunday && !hours.sunday.closed) openDays.push("日")
      
      if (openDays.length > 0) {
        const firstOpenDay = openDays[0]
        let startTime = "09:00"
        let endTime = "18:00"
        
        const dayMap = { "月": "monday", "火": "tuesday", "水": "wednesday", "木": "thursday", "金": "friday", "土": "saturday", "日": "sunday" }
        const dayKey = dayMap[firstOpenDay as keyof typeof dayMap]
        if (dayKey && hours[dayKey]) {
          startTime = hours[dayKey].start || startTime
          endTime = hours[dayKey].end || endTime
        }
        
        let displayDays = ""
        if (openDays.length === 7) {
          displayDays = "月～日"
        } else if (openDays.length === 1) {
          displayDays = openDays[0]
        } else {
          displayDays = `${openDays[0]}～${openDays[openDays.length - 1]}`
        }
        
        businessHoursString = `${displayDays} ${startTime}~${endTime}`
      } else {
        businessHoursString = "定休日"
      }
    }

    this.stores[storeIndex] = {
      ...this.stores[storeIndex],
      name: updatedData.name || this.stores[storeIndex].name,
      address: updatedData.address || this.stores[storeIndex].address,
      phone: updatedData.tel || updatedData.phone || this.stores[storeIndex].phone,
      businessHours: businessHoursString
    }

    this.saveToStorage()
    return true
  }

  deleteStore(storeId: number): boolean {
    const initialLength = this.stores.length
    this.stores = this.stores.filter(store => store.id !== storeId)
    
    if (this.stores.length !== initialLength) {
      this.saveToStorage()
      return true
    }
    return false
  }

  resetToInitial(): void {
    this.stores = [...initialStores]
    this.saveToStorage()
  }
}

// シングルトンインスタンス
export const storeDataManager = new StoreDataManager() 