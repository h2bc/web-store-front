'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { removeItemFromCart } from '@/lib/data/cart'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { HttpTypes } from '@medusajs/types'

interface CartPreviewItemProps {
  item: HttpTypes.StoreCartLineItem
  currencyCode?: string
  onRemoveSuccess?: () => void
}

export default function CartPreviewItem({
  item,
  currencyCode,
  onRemoveSuccess,
}: CartPreviewItemProps) {
  const router = useRouter()
  const [isRemoving, setIsRemoving] = useState(false)
  const [isPending, startTransition] = useTransition()

  const thumbnail = item.variant?.product?.thumbnail || item.thumbnail
  const title = item.variant?.product?.title || item.title
  const subtitle = item.variant?.product?.subtitle
  const variantTitle = item.variant?.title
  const slug = item.variant?.product?.handle

  const handleRemove = async () => {
    setIsRemoving(true)
    const { error } = await removeItemFromCart(item.id)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Item removed from cart')
      startTransition(() => {
        router.refresh()
        onRemoveSuccess?.()
      })
    }

    setIsRemoving(false)
  }

  return (
    <div className="flex gap-4 py-4">
      {/* Thumbnail */}
      {thumbnail && slug && (
        <Link href={`/shop/${slug}`} className="relative flex-shrink-0">
          <div className="relative w-20 h-20">
            <Image
              src={thumbnail}
              alt={title || 'Product'}
              fill
              className="pink-img-shadow object-contain"
              sizes="80px"
            />
          </div>
        </Link>
      )}

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="flex-1 min-w-0">
            {slug ? (
              <Link
                href={`/shop/${slug}`}
                className="text-base font-medium hover:underline line-clamp-1"
              >
                {title}
              </Link>
            ) : (
              <p className="text-base font-medium line-clamp-1">{title}</p>
            )}

            {subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {subtitle}
              </p>
            )}

            {variantTitle && variantTitle !== 'Default Variant' && (
              <p className="text-sm text-muted-foreground">{variantTitle}</p>
            )}

            <p className="text-sm text-muted-foreground mt-1">
              Qty: {item.quantity}
            </p>
          </div>

          {/* Remove button */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8"
            onClick={handleRemove}
            disabled={isRemoving || isPending}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Price */}
        <div className="text-base font-medium mt-2">
          {formatPrice(item.unit_price, currencyCode)}
        </div>
      </div>
    </div>
  )
}
