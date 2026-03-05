'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface Review {
  id: number
  user_id: string
  user_email: string
  rating: number
  comment: string
  created_at: string
}

interface ReviewsProps {
  productId: number
}

export default function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchReviews()
    fetchUser()
  }, [productId])

  const fetchReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('حدث خطأ أثناء تحميل التقييمات')
    } else {
      setReviews(data || [])
    }
    setLoading(false)
  }

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('يجب تسجيل الدخول لإضافة تقييم')
      return
    }
    if (userRating === 0) {
      toast.error('اختر تقييمك بالنجوم')
      return
    }

    setSubmitting(true)
    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: user.id,
        user_email: user.email,
        rating: userRating,
        comment: comment.trim() || null
      })

    if (error) {
      toast.error('حدث خطأ أثناء إضافة التقييم')
    } else {
      toast.success('تم إضافة تقييمك بنجاح')
      setUserRating(0)
      setComment('')
      fetchReviews()
    }
    setSubmitting(false)
  }

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="mt-8 border-t border-gray-800 pt-6">
      <h2 className="text-xl font-bold mb-4">التقييمات</h2>
      
      {/* متوسط التقييم */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-400 text-2xl font-bold">{averageRating}</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(star => (
            <FiStar
              key={star}
              className={`text-xl ${
                star <= Number(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-gray-400">({reviews.length} تقييم)</span>
      </div>

      {/* نموذج إضافة تقييم - يظهر فقط للمستخدمين المسجلين */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">أضف تقييمك</h3>
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setUserRating(star)}
                className="focus:outline-none"
              >
                <FiStar
                  className={`text-2xl ${
                    star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك (اختياري)"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 outline-none mb-3"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
        </form>
      ) : (
        <p className="text-gray-400 mb-6">
          <button onClick={() => router.push('/admin/login')} className="text-amber-400 hover:underline">
            سجل الدخول
          </button> لإضافة تقييم
        </p>
      )}

      {/* قائمة التقييمات */}
      {loading ? (
        <p className="text-gray-400">جاري التحميل...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400">لا توجد تقييمات بعد، كن أول من يقيم هذا المنتج</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{review.user_email || 'مستخدم'}</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <FiStar
                      key={star}
                      className={`text-sm ${
                        star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
              {review.comment && <p className="text-gray-300">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}