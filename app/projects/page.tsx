import Link from 'next/link'
import { PlaceholderCard, PlaceholderPage } from '@/components/PlaceholderPage'

const projects = [
  {
    id: 'flyrank-seo',
    name: 'FlyRank SEO Assistant',
    summary: 'AI-assisted content optimization workflow.',
  },
  {
    id: 'content-studio',
    name: 'Content Studio',
    summary: 'Editorial planning and publishing pipeline.',
  },
  {
    id: 'analytics-hub',
    name: 'Analytics Hub',
    summary: 'Performance dashboards for marketing teams.',
  },
]

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projects"
      description="Browse capstone projects. Each card links to a project detail placeholder."
    >
      {projects.map((project) => (
        <article
          key={project.id}
          className="glass-card p-4 sm:p-5"
        >
          <h2 className="text-lg font-semibold text-foreground">{project.name}</h2>
          <p className="mt-2 text-sm text-muted sm:text-base">{project.summary}</p>
          <Link
            href={`/projects/${project.id}`}
            className="mt-4 inline-block text-sm font-medium no-underline"
          >
            View project details
          </Link>
        </article>
      ))}
      <PlaceholderCard
        title="Create project"
        body="Future flow for starting a new capstone initiative."
      />
    </PlaceholderPage>
  )
}
