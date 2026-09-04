import { ProductViewer } from '@/components/viewer/ProductViewer'

export const metadata = {
  title: 'Product Viewer | FlyRank Capstone',
  description:
    'Interactive 3D product preview with touch controls and material variants.',
}

export default function ViewerPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Frontend AI engineering
        </p>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Product Viewer
        </h1>
        <p className="max-w-3xl text-base text-muted sm:text-lg">
          Inspect the Luma Desk Lamp in 3D, choose a finish, and explore it with
          mouse or touch controls.
        </p>
      </div>

      <ProductViewer />
    </section>
  )
}
