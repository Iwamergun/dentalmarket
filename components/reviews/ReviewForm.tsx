'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, Loader2, Send, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Lütfen bir puan seçin').max(5),
  title: z.string().max(100, 'Başlık en fazla 100 karakter olabilir').optional(),
  comment: z.string()
    .min(10, 'Yorum en az 10 karakter olmalıdır')
    .max(1000, 'Yorum en fazla 1000 karakter olabilir'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { user, loading: authLoading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  })

  const currentRating = watch('rating')

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast.error('Yorum yapabilmek için giriş yapmalısınız')
      return
    }

    setSubmitting(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: data.rating,
          title: data.title || null,
          comment: data.comment,
          is_approved: false, // Onay bekliyor
        })

      if (insertError) {
        if (insertError.code === '23505') {
          toast.error('Bu ürüne zaten yorum yapmışsınız')
          return
        }
        throw insertError
      }

      toast.success('Yorumunuz başarıyla gönderildi. Onaylandıktan sonra yayınlanacaktır.')
      reset()
      onReviewSubmitted?.()
    } catch (err) {
      console.error('Yorum gönderilirken hata:', err)
      toast.error('Yorum gönderilirken bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  // Auth loading
  if (authLoading) {
    return (
      <div className="bg-background-card rounded-xl border border-border p-6">
        <div className="h-40 animate-pulse bg-background-deep rounded-lg" />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="bg-background-card rounded-xl border border-border p-6 text-center">
        <LogIn className="w-10 h-10 mx-auto mb-3 text-text-muted" />
        <h3 className="font-semibold text-text-primary mb-2">Yorum Yapmak İçin Giriş Yapın</h3>
        <p className="text-sm text-text-secondary mb-4">
          Bu ürün hakkında yorum yapabilmek için hesabınıza giriş yapmanız gerekmektedir.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/giris">
            <Button variant="outline">Giriş Yap</Button>
          </Link>
          <Link href="/kayit">
            <Button>Üye Ol</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Yorum Yaz</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Puanınız *</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue('rating', star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-colors',
                    (hoveredStar || currentRating) >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              </button>
            ))}
            {currentRating > 0 && (
              <span className="ml-2 text-sm text-text-secondary">
                {currentRating === 1 && 'Çok Kötü'}
                {currentRating === 2 && 'Kötü'}
                {currentRating === 3 && 'Orta'}
                {currentRating === 4 && 'İyi'}
                {currentRating === 5 && 'Mükemmel'}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-xs text-red-500">{errors.rating.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Başlık (Opsiyonel)</label>
          <Input
            {...register('title')}
            placeholder="Yorumunuz için kısa bir başlık"
            disabled={submitting}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Yorumunuz *</label>
          <textarea
            {...register('comment')}
            placeholder="Bu ürün hakkındaki düşüncelerinizi yazın..."
            disabled={submitting}
            rows={4}
            className={cn(
              'flex w-full rounded-lg border bg-background-deep px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
              errors.comment ? 'border-red-500' : 'border-border'
            )}
          />
          {errors.comment && (
            <p className="text-xs text-red-500">{errors.comment.message}</p>
          )}
          <p className="text-xs text-text-muted">
            {watch('comment')?.length || 0}/1000 karakter
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Yorumu Gönder
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-text-muted">
          * Yorumunuz moderatör onayından sonra yayınlanacaktır.
        </p>
      </form>
    </div>
  )
}
