"use client"

import { useState, useCallback, useMemo } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { uploadImage, deleteImage } from "@/lib/firebase-utils"
import { X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  vehicleId?: string
}

interface SortableImageProps {
  id: string
  imageUrl: string
  onDelete: (imageUrl: string) => void
  isSelectionMode: boolean
  isSelected: boolean
  onToggleSelection: (imageUrl: string) => void
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

const SortableImage = ({ id, imageUrl, onDelete, isSelectionMode, isSelected, onToggleSelection, onImageError }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelection(imageUrl)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-gray-100 rounded-lg overflow-hidden cursor-pointer ${
        isSelectionMode && isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt="車両画像"
        className="w-full h-32 object-cover"
        onError={onImageError}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
        {!isSelectionMode && (
          <>
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(imageUrl)
                }}
                className="h-6 w-6 p-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div
              {...attributes}
              {...listeners}
              className="absolute top-2 left-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-white" />
            </div>
          </>
        )}
        {isSelectionMode && (
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                onToggleSelection(imageUrl)
              }}
              className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ImageUploader({ images, onImagesChange, vehicleId }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // フィルタリングされた画像URL（ダミー写真と一時的なURLを除外）
  const filteredImageUrls = useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    
    return images.filter(url => 
      url && 
      url.trim() !== "" && 
      url !== "/placeholder.jpg" &&
      !url.includes("temp_") && 
      !url.startsWith("blob:") &&
      !url.startsWith("data:")
    );
  }, [images]);

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!vehicleId) {
      alert("車両IDが必要です")
      return
    }
    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const timestamp = Date.now()
        const fileName = `${vehicleId}_${timestamp}_${index}.${file.name.split('.').pop()}`
        const path = `vehicles/${vehicleId}/${fileName}`
        return await uploadImage(file, path)
      })
      const newImageUrls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...newImageUrls])
    } catch (error) {
      console.error("画像アップロードエラー:", error)
      alert("画像のアップロードに失敗しました")
    } finally {
      setUploading(false)
    }
  }, [images, onImagesChange, vehicleId])

  const handleDelete = useCallback((imageUrl: string) => {
    const newImages = filteredImageUrls.filter(img => img !== imageUrl)
    onImagesChange(newImages)
  }, [filteredImageUrls, onImagesChange])

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = filteredImageUrls.indexOf(active.id)
      const newIndex = filteredImageUrls.indexOf(over.id)
      
      const newImages = arrayMove(filteredImageUrls, oldIndex, newIndex)
      onImagesChange(newImages)
    }
  }, [filteredImageUrls, onImagesChange])

  const handleToggleSelection = useCallback((imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl) 
        ? prev.filter(img => img !== imageUrl)
        : [...prev, imageUrl]
    )
  }, [])

  const handleBulkDelete = useCallback(() => {
    const newImages = filteredImageUrls.filter(img => !selectedImages.includes(img))
    onImagesChange(newImages)
    setSelectedImages([])
  }, [filteredImageUrls, selectedImages, onImagesChange])

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false)
    setSelectedImages([])
  }, [])

  // 画像エラーハンドラー
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("ImageUploader - 画像読み込みエラー:", e.currentTarget.src);
    // エラーが発生した画像を削除
    const imageUrl = e.currentTarget.src;
    handleDelete(imageUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          style={{ position: 'absolute', left: '-9999px' }}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          style={{
            border: '1px solid #ccc',
            padding: 8,
            display: 'inline-block',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: uploading ? '#eee' : '#fff',
            borderRadius: 4,
            color: uploading ? '#aaa' : '#222',
            pointerEvents: uploading ? 'none' : 'auto',
          }}
        >
          {uploading ? 'アップロード中...' : '写真を選択'}
        </label>
        {!vehicleId && (
          <p className="text-sm text-gray-500">
            車両を保存してから写真をアップロードできます
          </p>
        )}
      </div>
      {filteredImageUrls.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">アップロード済み写真 ({filteredImageUrls.length}枚)</p>
            {!isSelectionMode && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSelectionMode(true)}
              >
                一括削除モード
              </Button>
            )}
          </div>
          
          {isSelectionMode && (
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={selectedImages.length === 0}
              >
                一括削除 ({selectedImages.length}枚)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelSelection}
              >
                キャンセル
              </Button>
            </div>
          )}
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredImageUrls}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImageUrls.map((imageUrl) => (
                  <SortableImage
                    key={imageUrl}
                    id={imageUrl}
                    imageUrl={imageUrl}
                    onDelete={handleDelete}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedImages.includes(imageUrl)}
                    onToggleSelection={handleToggleSelection}
                    onImageError={handleImageError}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
} 