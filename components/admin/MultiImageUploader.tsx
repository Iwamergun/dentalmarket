'use client'

import { useState, useRef, useCallback, type Dispatch, type SetStateAction } from 'react'
import { Upload, X, ImageIcon, Loader2, Star } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { toast } from 'sonner'

export interface UploadedImage {
  /** R2 object path (e.g. "products/123-name.jpg") */
  path: string
  /** media_assets.id – null when the DB insert failed (non-fatal) */
  mediaAssetId: string | null
  /** Local object URL for preview (before upload completes) */
  previewUrl?: string
  /** Whether this file is still uploading */
  uploading?: boolean
}

interface MultiImageUploaderProps {
  images: UploadedImage[]
  onChange: Dispatch<SetStateAction<UploadedImage[]>>
  primaryIndex: number
  onPrimaryChange: (index: number) => void
  label?: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function normaliseType(raw: string): string {
  const t = raw.toLowerCase()
  if (t === 'image/jpg' || t === 'image/jpeg' || t === 'image/pjpeg') return 'image/jpeg'
  if (t === 'image/png' || t === 'image/x-png') return 'image/png'
  if (t === 'image/webp') return 'image/webp'
  return t
}

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

function validateFile(file: File): string | null {
  if (!ALLOWED.has(normaliseType(file.type))) {
    return `${file.name}: Sadece JPEG, PNG ve WebP formatları desteklenir`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `${file.name}: Dosya boyutu 10MB'dan büyük olamaz`
  }
  return null
}

export default function MultiImageUploader({
  images,
  onChange,
  primaryIndex,
  onPrimaryChange,
  label = 'Ürün Görselleri',
}: MultiImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const valid: File[] = []
      for (const file of files) {
        const err = validateFile(file)
        if (err) {
          toast.error(err)
        } else {
          valid.push(file)
        }
      }
      if (valid.length === 0) return

      // Add placeholder entries immediately so the user sees progress
      const placeholders: UploadedImage[] = valid.map((file) => {
        const normType = normaliseType(file.type)
        const normFile = normType !== file.type ? new File([file], file.name, { type: normType }) : file
        return {
          path: '',
          mediaAssetId: null,
          previewUrl: URL.createObjectURL(normFile),
          uploading: true,
        }
      })

      const startIndex = images.length
      onChange([...images, ...placeholders])

      // Upload each file, updating its placeholder when done
      await Promise.all(
        valid.map(async (file, i) => {
          const normType = normaliseType(file.type)
          const normFile = normType !== file.type ? new File([file], file.name, { type: normType }) : file
          try {
            const formData = new FormData()
            formData.append('file', normFile)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Yükleme başarısız')

            onChange((prev: UploadedImage[]) => {
              const next = [...prev]
              const idx = startIndex + i
              if (next[idx]) {
                next[idx] = {
                  path: data.path as string,
                  mediaAssetId: (data.mediaAssetId as string | null) ?? null,
                  previewUrl: next[idx].previewUrl,
                  uploading: false,
                }
              }
              return next
            })
            toast.success(`${file.name} yüklendi`)
          } catch (err) {
            toast.error(err instanceof Error ? err.message : `${file.name} yüklenemedi`)
            // Remove the failed placeholder
            onChange((prev: UploadedImage[]) => {
              const next = [...prev]
              const idx = startIndex + i
              if (next[idx]?.uploading) next.splice(idx, 1)
              return next
            })
          }
        })
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) uploadFiles(files)
    // Reset so the same file can be re-added
    e.target.value = ''
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) uploadFiles(files)
    },
    [uploadFiles]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index)
    onChange(next)
    if (primaryIndex >= next.length) {
      onPrimaryChange(Math.max(0, next.length - 1))
    } else if (primaryIndex > index) {
      onPrimaryChange(primaryIndex - 1)
    } else if (primaryIndex === index) {
      onPrimaryChange(0)
    }
  }

  const displaySrc = (img: UploadedImage) => {
    if (img.previewUrl) return img.previewUrl
    if (img.path) return getImageUrl(img.path)
    return null
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => {
            const src = displaySrc(img)
            const isPrimary = index === primaryIndex
            return (
              <div
                key={index}
                className={`relative w-28 h-28 rounded-lg border-2 overflow-hidden group cursor-pointer ${
                  isPrimary ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => !img.uploading && onPrimaryChange(index)}
                title={isPrimary ? 'Ana görsel' : 'Ana görsel olarak ayarla'}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`Görsel ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                {img.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}

                {!img.uploading && (
                  <>
                    {isPrimary && (
                      <div className="absolute top-1 left-1 bg-blue-500 rounded-full p-0.5">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          Görsele tıklayarak ana görsel olarak ayarlayabilirsiniz.
        </p>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full h-36 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <div className="p-3 bg-gray-100 rounded-full mb-2">
          {dragActive ? (
            <Upload className="w-5 h-5 text-blue-500" />
          ) : (
            <ImageIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <p className="text-sm text-gray-600 font-medium">
          {dragActive ? 'Bırakın' : 'Görsel eklemek için tıklayın veya sürükleyin'}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — Maks 10MB — Çoklu seçim</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/x-png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
