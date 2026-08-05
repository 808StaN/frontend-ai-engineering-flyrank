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
    </PlaceholderPage>
  )
}
