import { PlaceholderCard, PlaceholderPage } from '@/components/PlaceholderPage'

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Profile and workspace preferences placeholder. The validated settings form from FE-03 will be integrated here later."
    >
      <PlaceholderCard
        title="Profile"
        body="Display name, email, and notification preferences."
      />
      <PlaceholderCard
        title="Theme"
        body="Light, dark, and system appearance options."
      />
      <PlaceholderCard
        title="Workspace"
        body="Team defaults, deployment targets, and integration hooks."
      />
    </PlaceholderPage>
  )
}
