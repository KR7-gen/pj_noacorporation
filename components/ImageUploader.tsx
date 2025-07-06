"use client"

import { useState, useCallback } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { uploadImage, deleteImage } from "@/lib/firebase-utils"
import { X, GripVertical } from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  vehicleId?: string
}

interface SortableImageProps {
  id: string
  imageUrl: string
  onDelete: (imageUrl: string) => void
}

const SortableImage = ({ id, imageUrl, onDelete }: SortableImageProps) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-gray-100 rounded-lg overflow-hidden"
    >
      <img
        src={imageUrl}
        alt="車両画像"
        className="w-full h-32 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
        <div className="absolute top-2 right-2">
          <button
            type="button"
            onClick={() => onDelete(imageUrl)}
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
      </div>
    </div>
  )
}

export default function ImageUploader({ images, onImagesChange, vehicleId }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const handleDeleteImage = useCallback(async (imageUrl: string) => {
    try {
      // Firebase Storageから削除
      const path = imageUrl.split('/o/')[1]?.split('?')[0]
      if (path) {
        const decodedPath = decodeURIComponent(path)
        await deleteImage(decodedPath)
      }
      // 配列から削除
      onImagesChange(images.filter(img => img !== imageUrl))
    } catch (error) {
      console.error("画像削除エラー:", error)
      alert("画像の削除に失敗しました")
    }
  }, [images, onImagesChange])

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = images.findIndex(img => img === active.id)
      const newIndex = images.findIndex(img => img === over.id)
      const newImages = arrayMove(images, oldIndex, newIndex)
      onImagesChange(newImages)
    }
  }, [images, onImagesChange])

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
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">アップロード済み写真 ({images.length}枚)</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((imageUrl) => (
                  <SortableImage
                    key={imageUrl}
                    id={imageUrl}
                    imageUrl={imageUrl}
                    onDelete={handleDeleteImage}
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