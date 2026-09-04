import Link from 'next/link'
import { PlaceholderCard, PlaceholderPage } from '@/components/PlaceholderPage'

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Overview of capstone activity, deployment status, and upcoming workstreams."
    >
      <PlaceholderCard
        title="Active sprint"
        body="Track weekly assignments and capstone milestones from a single overview."
      />
      <PlaceholderCard
        title="Preview deployments"
        body="Every push to GitHub creates a live preview URL on Vercel."
      />
      <PlaceholderCard
        title="AI workflow"
        body="Use Cursor rules and plan-first prompts to keep implementation consistent."
      />
      <article className="glass-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-foreground">Capstone Advisor</h2>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Hold a streaming conversation with the AI assistant about your next
          implementation or review step.
        </p>
        <Link
          href="/chat"
          className="mt-4 inline-block text-sm font-medium no-underline"
        >
          Open AI chat
        </Link>
      </article>
      <article className="glass-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-foreground">3D Product Viewer</h2>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Inspect the Luma Desk Lamp in 3D, switch material finishes, and try
          responsive mouse or touch controls.
        </p>
        <Link
          href="/viewer"
          className="mt-4 inline-block text-sm font-medium no-underline"
        >
          Open product viewer
        </Link>
      </article>
    </PlaceholderPage>
  )
}
