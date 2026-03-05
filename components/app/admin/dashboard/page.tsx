import { createServerClient } from '@/lib/supabaseServer'
import ProductTable from '@/components/ProductTable'

export default async function AdminDashboard() {
  const supabase = createServerClient()
  const { data: products } = await supabase.from('products').select('*')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
      <ProductTable products={products || []} />
    </div>
  )
}