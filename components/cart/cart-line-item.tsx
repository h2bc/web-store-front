'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { HttpTypes } from '@medusajs/types'
import { Button } from '@/components/ui/button'
import { removeItemFromCart } from '@/lib/data/cart'
import { formatPrice } from '@/lib/utils'

interface CartLineItemProps {
  item: HttpTypes.StoreCartLineItem
  currencyCode?: string
  onRemoveSuccess?: () => void
  onNavigate?: () => void
  imageSize?: 'sm' | 'md'
}

const imageSizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-24 h-24',
} as const

export default function CartLineItem({
  item,
  currencyCode,
  onRemoveSuccess,
  onNavigate,
  imageSize = 'md',
}: CartLineItemProps) {
  const router = useRouter()
  const [isRemoving, setIsRemoving] = useState(false)
  const [isPending, startTransition] = useTransition()

  const thumbnail = item.thumbnail
  const title = item.product_title
  const subtitle = item.product_subtitle
  const size = item.variant_title
  const slug = item.product_handle

  const handleRemove = async () => {
    setIsRemoving(true)
    const { error } = await removeItemFromCart(item.id)

    if (error) {
      toast.error(error)
    } else {
      startTransition(() => {
        router.refresh()
        onRemoveSuccess?.()
      })
    }

    setIsRemoving(false)
  }

  return (
    <div className="flex gap-4 py-4">
      {thumbnail && (
        <div
          className={`relative shrink-0 ${imageSizeClasses[imageSize]} overflow-visible pink-img-shadow`}
        >
          {slug ? (
            <Link
              href={`/shop/${slug}`}
              className="relative block w-full h-full"
              onClick={() => onNavigate?.()}
            >
              <Image
                src={thumbnail}
                alt={title || 'Product'}
                fill
                className="object-contain"
                sizes={imageSize === 'sm' ? '80px' : '96px'}
              />
            </Link>
          ) : (
            <Image
              src={thumbnail}
              alt={title || 'Product'}
              fill
              className="object-contain"
              sizes={imageSize === 'sm' ? '80px' : '96px'}
            />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {slug ? (
          <Link
            href={`/shop/${slug}`}
            className="text-base font-medium hover:underline line-clamp-1"
            onClick={() => onNavigate?.()}
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

        <p className="text-sm text-muted-foreground mt-1">
          {size && size !== 'Default Variant' ? `Size: ${size} · ` : ''}
          Qty: {item.quantity}
        </p>

        <div className="text-base font-medium mt-2">
          {formatPrice(item.unit_price, currencyCode)}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 self-center h-8 w-8"
        onClick={handleRemove}
        disabled={isRemoving || isPending}
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
