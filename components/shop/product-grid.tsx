import ProductCard from './product-card'
import NoProductsLabel from './no-products-label'
import type { ProductItem } from '@/lib/types/product'

const PRIORITY_COUNT = 4

interface ProductGridProps {
  products: ProductItem[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <NoProductsLabel />
  }

  return products.map((p, idx) => (
    <ProductCard key={p.slug} {...p} priority={idx < PRIORITY_COUNT} />
  ))
}
