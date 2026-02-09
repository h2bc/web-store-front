'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconBadge } from '@/components/ui/icon-badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import CartPreviewItem from './cart-preview-item'
import type { HttpTypes } from '@medusajs/types'

interface CartPreviewProps {
  cart: HttpTypes.StoreCart | null
}

export default function CartPreview({ cart }: CartPreviewProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0

  const handleCartClick = () => {
    // If on cart or checkout page, redirect to cart
    if (pathname === '/cart' || pathname === '/checkout') {
      router.push('/cart')
    } else {
      // Otherwise, open the drawer
      setOpen(true)
    }
  }

  const handleRemoveSuccess = () => {
    // If cart becomes empty, close the drawer
    if (cart?.items?.length === 1) {
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={handleCartClick} aria-label="Cart">
        {itemCount ? (
          <IconBadge badge={`${itemCount}`} badgeClassName="bg-pink-500">
            <ShoppingBag />
          </IconBadge>
        ) : (
          <ShoppingBag />
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>
              {itemCount === 0
                ? 'Your cart is empty'
                : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
            </SheetDescription>
          </SheetHeader>

          {cart?.items && cart.items.length > 0 ? (
            <>
              {/* Cart Items - scrollable area */}
              <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y">
                {cart.items.map((item) => (
                  <CartPreviewItem
                    key={item.id}
                    item={item}
                    currencyCode={cart.currency_code}
                    onRemoveSuccess={handleRemoveSuccess}
                  />
                ))}
              </div>

              {/* Free Shipping Alert */}
              <div className="border-t pt-4 pb-2">
                <p className="text-sm text-muted-foreground text-center">
                  Free shipping above €30 (LT) / €60 (Europe).{' '}
                  <Link
                    href="/shipping-returns"
                    className="underline hover:text-foreground"
                  >
                    Learn more
                  </Link>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild size="lg">
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/cart">Go to cart</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Your cart is empty</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/shop">Continue shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
