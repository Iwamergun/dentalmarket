'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  MessageSquare, User, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarRating } from './StarRating'
import { RatingSummary } from './RatingSummary'
import { createClient } from '@/lib/supabase/client'

interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title: string | null
  comment: string
  is_approved: boolean
  created_at: string
  updated_at: string
  user?: {
    email: string
    user_metadata?: {
      first_name?: string
      last_name?: string
    }
  }
}

interface ReviewListProps {
  productId: string
  pageSize?: number
}

export function ReviewList({ productId, pageSize = 5 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  })
  const supabase = createClient()

  const totalPages = Math.ceil(totalCount / pageSize)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      // Onaylı yorumları çek
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: fetchError, count } = await (supabase as any)
        .from('product_reviews')
        .select('*', { count: 'exact' })
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (fetchError) {
        if (fetchError.message?.includes('does not exist')) {
          setReviews([])
          setTotalCount(0)
          return
        }
        throw fetchError
      }

      setReviews(data || [])
      setTotalCount(count || 0)

      // İstatistikleri hesapla (tüm onaylı yorumlardan)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: allReviews } = await (supabase as any)
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('is_approved', true)

      if (allReviews && allReviews.length > 0) {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        let totalRating = 0

        allReviews.forEach((review: { rating: number }) => {
          distribution[review.rating as keyof typeof distribution]++
          totalRating += review.rating
        })

        setStats({
          averageRating: totalRating / allReviews.length,
          totalReviews: allReviews.length,
          ratingDistribution: distribution,
        })
      }
    } catch (err) {
      console.error('Yorumlar yüklenirken hata:', err)
      setError('Yorumlar yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [productId, page, pageSize, supabase])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Kullanıcı adını formatla
  const formatUserName = (review: Review) => {
    if (review.user?.user_metadata?.first_name) {
      const firstName = review.user.user_metadata.first_name
      const lastName = review.user.user_metadata.last_name || ''
      return `${firstName} ${lastName.charAt(0)}.`
    }
    if (review.user?.email) {
      const emailParts = review.user.email.split('@')
      return emailParts[0].slice(0, 3) + '***'
    }
    return 'Anonim'
  }

  // Loading skeleton
  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-background-card rounded-xl border border-border p-6 h-40 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background-card rounded-xl border border-border p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={fetchReviews} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tekrar Dene
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats.totalReviews > 0 && (
        <RatingSummary
          averageRating={stats.averageRating}
          totalReviews={stats.totalReviews}
          ratingDistribution={stats.ratingDistribution}
        />
      )}

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="bg-background-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-deep flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Henüz yorum yapılmamış
          </h3>
          <p className="text-text-secondary">
            Bu ürün hakkında ilk yorumu siz yapın!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-background-card rounded-xl border border-border p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {formatUserName(review)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {format(new Date(review.created_at), 'd MMMM yyyy', { locale: tr })}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>

                {/* Content */}
                {review.title && (
                  <h4 className="font-semibold text-text-primary mb-2">
                    {review.title}
                  </h4>
                )}
                <p className="text-text-secondary whitespace-pre-line">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Sadece mevcut sayfa etrafındaki 2 sayfayı göster
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - page) <= 1
                  ) {
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                        className="w-9"
                      >
                        {pageNum}
                      </Button>
                    )
                  }
                  // Üç nokta göster
                  if (
                    (pageNum === 2 && page > 3) ||
                    (pageNum === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNum} className="px-2 text-text-muted">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
