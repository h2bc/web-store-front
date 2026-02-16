import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: string[]
  active: string
}) {
  return (
    <>
      {/* Mobile horizontal filter bar */}
      <div className="lg:hidden overflow-x-auto">
        <div
          className="flex w-max mx-auto whitespace-nowrap pb-3"
          role="tablist"
          aria-label="Product categories"
        >
          {categories.map((cat) => {
            const selected = active === cat
            const href = cat === 'ALL' ? '/shop' : `/shop?category=${cat}`
            return (
              <Link
                key={cat}
                href={href}
                aria-selected={selected}
                className={cn(
                  'px-4 py-2 text-sm no-underline hover:underline',
                  selected ? 'font-bold' : 'font-normal'
                )}
              >
                {active === cat ? `> ${cat}` : cat}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop left filter column */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <nav aria-label="Product categories" className="flex flex-col">
            {categories.map((cat) => {
              const selected = active === cat
              const href = cat === 'ALL' ? '/shop' : `/shop?category=${cat}`
              return (
                <Link
                  key={cat}
                  href={href}
                  aria-selected={selected}
                  className={cn(
                    'px-4 py-2 text-md no-underline hover:underline justify-start',
                    selected ? 'font-bold' : 'font-normal'
                  )}
                >
                  {active === cat ? `> ${cat}` : cat}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
