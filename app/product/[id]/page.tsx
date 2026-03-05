import { createServerClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import Reviews from '@/components/Reviews'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) return notFound()

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative h-96 md:h-auto">
        <Image
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-300 mb-4">{product.description}</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl text-amber-400 font-bold">{product.price} د.أ</span>
          <span className="text-gray-400">⭐ {product.rating}</span>
        </div>
        <AddToCartButton product={product} />
        <Reviews productId={product.id} />
      </div>
    </div>
  )
}