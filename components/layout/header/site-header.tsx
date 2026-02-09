import Link from 'next/link'
import Image from 'next/image'
import NavLinks from './nav-links'
import BurgerMenu from './burger-menu'
import RegionSelector from './region-selector'
import CartPreview from '@/components/cart/preview/cart-preview'
import { getRegions } from '@/lib/data/regions'
import ClientToastErrorHandler from '@/components/feedback/client-toast-error-handler'
import { getRegionId, setRegionId } from '@/lib/cookies'
import { getCart } from '@/lib/data/cart'

export default async function SiteHeader() {
  const regionId = await getRegionId()
  const currentRegionError = !regionId ? 'Failed to load region' : null
  const { regions, error: regionsError } = await getRegions()
  const regionSelectorDisabled = !!regionsError || regions.length <= 1
  const currentRegion = regions.find((r) => r.id === regionId) || null

  const { cart } = await getCart()

  return (
    <ClientToastErrorHandler errors={[regionsError, currentRegionError]}>
      <header className="relative z-50 w-full px-4 sm:px-8 md:px-12 lg:px-18 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-3 items-center">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            {/* mobile: burger + region selector */}
            <div className="md:hidden">
              <BurgerMenu />
            </div>

            <div className="md:hidden">
              <RegionSelector
                regions={regions}
                currentRegion={currentRegion}
                disabled={regionSelectorDisabled}
                onRegionChange={setRegionId}
              />
            </div>

            {/* desktop: logo on left */}
            <Link href="/" aria-label="Home" className="hidden md:inline-flex">
              <Image
                src="/bw-logo.svg"
                alt="h2bc"
                width={200}
                height={80}
                className="h-12 md:h-18 w-auto"
                priority
              />
            </Link>
          </div>

          {/* CENTER */}
          <div className="flex items-center justify-center">
            {/* mobile: logo centered */}
            <Link href="/" aria-label="Home" className="md:hidden inline-flex">
              <Image
                src="/bw-logo.svg"
                alt="h2bc"
                width={200}
                height={80}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* desktop: nav links centered */}
            <nav
              aria-label="Primary"
              className="hidden md:flex items-center justify-center flex-1"
            >
              <NavLinks ulClassName="flex items-center gap-5 lg:gap-12 text-2xl leading-none tracking-wide" />
            </nav>
          </div>

          {/* RIGHT */}
          <nav
            aria-label="Shop"
            className="flex items-center justify-end gap-2"
          >
            {/* desktop: region dropdown on right */}
            <div className="hidden md:block">
              <RegionSelector
                regions={regions}
                currentRegion={currentRegion}
                disabled={regionSelectorDisabled}
                onRegionChange={setRegionId}
              />
            </div>

            <CartPreview cart={cart} />
          </nav>
        </div>
      </header>
    </ClientToastErrorHandler>
  )
}
