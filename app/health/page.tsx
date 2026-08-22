import { PlaceholderPage } from '@/components/PlaceholderPage'
import { fetchHealthCheckData } from '@/lib/health'

export default async function HealthPage() {
  const result = await fetchHealthCheckData()

  return (
    <PlaceholderPage
      title="Health check"
      description="Server-rendered status page that fetches data from a public API on each request."
    >
      <article className="glass-card p-4 sm:col-span-2 sm:p-5 xl:col-span-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              result.ok
                ? 'border border-success/30 bg-success/10 text-success'
                : 'border border-danger/30 bg-danger/10 text-danger'
            }`}
          >
            {result.ok ? 'Healthy' : 'Unhealthy'}
          </span>
          <p className="text-sm text-muted">
            Checked at {new Date(result.fetchedAt).toLocaleString()}
          </p>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-foreground">Source URL</dt>
            <dd className="mt-1 break-all text-muted">{result.sourceUrl}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">HTTP status</dt>
            <dd className="mt-1 text-muted">{result.status ?? 'N/A'}</dd>
          </div>
        </dl>

        {result.error && (
          <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
            {result.error}
          </p>
        )}

        {result.payload !== null && (
          <pre className="mt-4 overflow-x-auto rounded-md bg-surface-muted p-4 text-xs text-foreground sm:text-sm">
            {JSON.stringify(result.payload, null, 2)}
          </pre>
        )}
      </article>
    </PlaceholderPage>
  )
}
