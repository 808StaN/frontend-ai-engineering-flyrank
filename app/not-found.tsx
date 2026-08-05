import Link from 'next/link'
import { PlaceholderPage } from '@/components/PlaceholderPage'

export default function NotFound() {
  return (
    <PlaceholderPage
      title="Page not found"
      description="The route you requested does not exist in the capstone skeleton."
    >
      <div className="sm:col-span-2 xl:col-span-3">
        <Link href="/" className="text-sm font-medium no-underline">
          ← Back to dashboard
        </Link>
      </div>
    </PlaceholderPage>
  )
}
