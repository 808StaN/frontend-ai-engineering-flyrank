import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PlaceholderCard, PlaceholderPage } from '@/components/PlaceholderPage'

const validProjectIds = new Set(['flyrank-seo', 'content-studio', 'analytics-hub'])

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params

  if (!validProjectIds.has(projectId)) {
    notFound()
  }

  const title = projectId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  return (
    <PlaceholderPage
      title={title}
      description={`Placeholder detail view for project "${projectId}".`}
    >
      <PlaceholderCard
        title="Scope"
        body="High-level goals, target users, and success metrics will live here."
      />
      <PlaceholderCard
        title="Milestones"
        body="Weekly deliverables and deployment checkpoints for the capstone."
      />
      <PlaceholderCard
        title="Back to list"
        body="Return to the projects index to browse other initiatives."
      />
      <div className="sm:col-span-2 xl:col-span-3">
        <Link href="/projects" className="text-sm font-medium no-underline">
          ← Back to projects
        </Link>
      </div>
    </PlaceholderPage>
  )
}
