'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { toast } from 'sonner'

interface ImageUploaderProps {
  onUpload: (path: string) => void
  currentImage?: string | null
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageUploader({ onUpload, currentImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayImage = preview || (currentImage ? getImageUrl(currentImage) : null)

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Sadece JPEG, PNG ve WebP formatları desteklenir')
      return false
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Dosya boyutu 10MB\'dan büyük olamaz')
      return false
    }
    return true
  }

  const uploadFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Yükleme başarısız')
      }

      onUpload(data.path)
      toast.success('Görsel başarıyla yüklendi')
    } catch (error) {
      setPreview(null)
      toast.error(error instanceof Error ? error.message : 'Görsel yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const clearImage = () => {
    setPreview(null)
    onUpload('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Ürün Görseli</label>

      {displayImage ? (
        <div className="relative w-48 h-48 rounded-lg border border-gray-200 overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt="Ürün görseli"
            className="w-full h-full object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                {dragActive ? (
                  <Upload className="w-6 h-6 text-blue-500" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {dragActive ? 'Bırakın' : 'Görsel yüklemek için tıklayın veya sürükleyin'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — Maks 10MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
