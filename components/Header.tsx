'use client'
import Link from 'next/link'
import { FiShoppingCart, FiUser } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
export default function Header() {
  const { items } = useCart()
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="bg-gray-900 border-b border-amber-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-amber-400">
          عطور فاخرة
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="hover:text-amber-400 transition">الرئيسية</Link>
          <Link href="/cart" className="relative">
            <FiShoppingCart className="text-2xl" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/admin/login">
            <FiUser className="text-2xl" />
          </Link>
        </nav>
      </div>
    </header>
  )
}