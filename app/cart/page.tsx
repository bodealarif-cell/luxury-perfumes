'use client'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { FiTrash2 } from 'react-icons/fi'

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">سلتك فارغة</p>
        <Link href="/" className="text-amber-400 hover:underline">
          تسوق الآن
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">سلة المشتريات</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-gray-900 p-4 rounded-lg flex gap-4">
              <div className="relative w-24 h-24">
                <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-amber-400">{item.price} د.أ</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-800 rounded"
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-800 rounded"
                  >+</button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mr-4 text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">إجمالي السلة</h2>
          <div className="flex justify-between mb-4">
            <span>المجموع:</span>
            <span className="text-amber-400 font-bold">{total} د.أ</span>
          </div>
          <button className="bg-amber-600 hover:bg-amber-700 w-full py-3 rounded-lg">
            إتمام الشراء
          </button>
        </div>
      </div>
    </div>
  )
}