import { z } from 'zod'

export const capstoneReviewInputSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(20).max(1500),
  stack: z.array(z.string().trim().min(1).max(40)).min(1).max(8),
  stage: z.enum(['idea', 'planning', 'building', 'testing', 'reviewing']),
})

export const capstoneReviewResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  verdict: z.string(),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  nextSteps: z.array(z.string()),
})

export type CapstoneReviewInput = z.infer<typeof capstoneReviewInputSchema>
export type CapstoneReviewResult = z.infer<typeof capstoneReviewResultSchema>

function hasKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword))
}

/**
 * Deterministic server-side evaluator used by the AI SDK tool.
 * Its predictable result keeps the UI demo repeatable while the model decides
 * when the user's request needs a structured review.
 */
export async function reviewCapstonePlan(
  input: CapstoneReviewInput,
): Promise<CapstoneReviewResult> {
  if (input.title.toLowerCase().includes('[tool-error]')) {
    throw new Error(
      'The capstone review service could not evaluate this demonstration request.',
    )
  }

  const normalizedDescription = input.description.toLowerCase()
  const normalizedStack = input.stack.map((item) => item.toLowerCase())
  const strengths: string[] = []
  const risks: string[] = []
  const nextSteps: string[] = []
  let score = 45

  if (input.description.length >= 160) {
    score += 12
    strengths.push('The brief gives enough implementation context to guide a build.')
  } else {
    risks.push('The brief is short, so implementation scope may be ambiguous.')
  }

  if (normalizedStack.length >= 2) {
    score += 10
    strengths.push('The proposed stack identifies more than one delivery constraint.')
  } else {
    risks.push('Only one technology is named, leaving integration choices unclear.')
  }

  if (
    hasKeyword(normalizedDescription, [
      'user',
      'audience',
      'customer',
      'learner',
    ])
  ) {
    score += 10
    strengths.push('The brief names a target user or audience.')
  } else {
    nextSteps.push('Name the primary user and the problem they need solved.')
  }

  if (
    hasKeyword(normalizedDescription, [
      'metric',
      'measure',
      'success',
      'goal',
      'conversion',
    ])
  ) {
    score += 10
    strengths.push('The brief includes a success signal that can guide validation.')
  } else {
    nextSteps.push('Add one measurable success criterion for the first release.')
  }

  if (
    hasKeyword(normalizedDescription, [
      'test',
      'accessib',
      'error',
      'edge case',
      'fallback',
    ])
  ) {
    score += 8
    strengths.push('The plan acknowledges quality, accessibility, or failure handling.')
  } else {
    nextSteps.push('Define accessibility checks and one failure path before building.')
  }

  if (input.stage === 'idea' || input.stage === 'planning') {
    nextSteps.push('Turn the brief into a small, testable first milestone.')
  } else {
    score += 5
    strengths.push('The selected stage shows the plan is moving toward delivery.')
  }

  if (risks.length === 0) {
    risks.push('Validate the scope with a narrow first user flow before expanding it.')
  }

  if (nextSteps.length === 0) {
    nextSteps.push('Implement the highest-risk flow and test it with the target user.')
  }

  const boundedScore = Math.min(100, score)
  const verdict =
    boundedScore >= 80
      ? 'Strong foundation for the next build milestone.'
      : boundedScore >= 65
        ? 'Promising direction with a few planning gaps to close.'
        : 'Early draft that needs clearer scope before implementation.'

  return {
    score: boundedScore,
    verdict,
    strengths,
    risks,
    nextSteps,
  }
}
