import { NavLinks } from '@/components/layout/header'
import Script from 'next/script'

const MODEL_ASSET_PATH = '/h2bc_3d_logo.glb'

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="aspect-square w-56 sm:w-64 md:w-80">
          {/* @ts-expect-error: model-viewer is a custom element */}
          <model-viewer
            src={MODEL_ASSET_PATH}
            camera-controls
            disable-zoom
            disable-pan
            interaction-prompt="none"
            auto-rotate
            auto-rotate-speed="500"
            class="block w-full h-full"
          />
        </div>

        <NavLinks ulClassName="flex flex-col items-center justify-center space-y-5 text-4xl md:mt-0 sm:flex-row sm:space-y-0 sm:gap-8 md:flex-col md:space-y-5 md:gap-0" />
      </div>
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js"
        strategy="lazyOnload"
      />
    </div>
  )
}
