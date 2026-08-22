type PlaceholderPageProps = {
  title: string
  description: string
  children?: React.ReactNode
}

export function PlaceholderPage({
  title,
  description,
  children,
}: PlaceholderPageProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Capstone placeholder
        </p>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base text-muted sm:text-lg">
          {description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  )
}

type PlaceholderCardProps = {
  title: string
  body: string
}

export function PlaceholderCard({ title, body }: PlaceholderCardProps) {
  return (
    <article className="glass-card p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted sm:text-base">{body}</p>
    </article>
  )
}
