import { MotionButtonDemo } from '@/components/motion/MotionButtonDemo'

export const metadata = {
  title: 'Button Motion | FlyRank Capstone',
  description: 'Accessible micro-interaction states for a capstone send button.',
}

export default function MotionPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Frontend AI engineering
        </p>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Buttons with a Brain
        </h1>
        <p className="max-w-3xl text-base text-muted sm:text-lg">
          A deterministic demo of motion that communicates a send action from
          intent through loading, success, or recovery.
        </p>
      </div>

      <MotionButtonDemo />
    </section>
  )
}
