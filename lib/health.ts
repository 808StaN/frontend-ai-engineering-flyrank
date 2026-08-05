export type HealthCheckResult = {
  ok: boolean
  status: number | null
  fetchedAt: string
  sourceUrl: string
  payload: unknown
  error?: string
}

const DEFAULT_HEALTH_CHECK_URL =
  'https://jsonplaceholder.typicode.com/posts/1'

export async function fetchHealthCheckData(): Promise<HealthCheckResult> {
  const sourceUrl =
    process.env.HEALTH_CHECK_API_URL ?? DEFAULT_HEALTH_CHECK_URL

  try {
    const response = await fetch(sourceUrl, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        fetchedAt: new Date().toISOString(),
        sourceUrl,
        payload: null,
        error: `Upstream API responded with status ${response.status}`,
      }
    }

    const payload = await response.json()

    return {
      ok: true,
      status: response.status,
      fetchedAt: new Date().toISOString(),
      sourceUrl,
      payload,
    }
  } catch (error) {
    return {
      ok: false,
      status: null,
      fetchedAt: new Date().toISOString(),
      sourceUrl,
      payload: null,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error while fetching health data',
    }
  }
}
