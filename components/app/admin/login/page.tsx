'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('بيانات الدخول غير صحيحة')
    } else {
      // التحقق من أن البريد هو بريد الأدمن
      if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        await supabase.auth.signOut()
        toast.error('غير مصرح لك بالدخول')
        return
      }
      router.push('/admin/dashboard')
      toast.success('مرحباً أيها الأدمن')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-gray-900 p-8 rounded-lg border border-amber-800">
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل دخول الأدمن</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
            required
          />
          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg">
            دخول
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          <a href="#" className="hover:text-amber-400">نسيت كلمة المرور؟</a>
        </p>
      </div>
    </div>
  )
}