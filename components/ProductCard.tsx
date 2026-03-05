import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  rating: number
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500 transition">
        <div className="relative h-64">
          <Image
            src={product.image_url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-amber-400 font-bold">{product.price} د.أ</span>
            <span className="text-sm text-gray-400">⭐ {product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}