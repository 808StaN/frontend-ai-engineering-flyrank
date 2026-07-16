# AI-Assisted Workflow Comparison (FE-03)

This document compares two approaches to building the same feature — a user settings form with validation — using Cursor.

## Feature

Both rounds implement a settings form with display name, email, and theme (light / dark / system). Branches:

- `workflow/round-1-vague` — single lazy prompt: *"make a settings form"*
- `workflow/round-2-precise` — plan-mode specification with file paths, stack constraints, a11y requirements, edge cases, and tests

## Correctness

**Round 1** produced a working form in under a minute, but validation was ad hoc: empty checks and `email.includes('@')`. That accepts `a@b` and rejects valid addresses with spaces. Theme was a free-text input, so values like `"lite"` would save without error.

**Round 2** moved rules into `src/schemas/settingsSchema.ts` with Zod (name length 2–50, proper email, theme enum) and wired them through `react-hook-form`. Three Vitest tests cover empty submit, invalid email, and whitespace trimming. The build and test suite both pass before merge.

## Accessibility

**Round 1** used `<span>` labels not associated with inputs (`htmlFor` / `id` missing). Screen readers could not reliably connect field names to controls. Errors were a single shared `<p>` without `aria-describedby` or `aria-invalid`. Success feedback used `alert()`, which interrupts keyboard flow.

**Round 2** added proper `<label htmlFor>`, per-field error IDs, `aria-invalid`, `role="alert"` on errors, and an `aria-live` success region. Theme became a `<select>` instead of a text field.

## Edge cases

| Case | Round 1 | Round 2 |
|------|---------|---------|
| Empty submit | One generic message | Field-level messages |
| Invalid email | Weak `@` check | Zod `.email()` |
| Whitespace in values | Saved as typed | `.trim()` in schema |
| Invalid theme | Any string accepted | Enum blocks bad values |

## Manual review effort

Round 1 needed ~15–20 minutes of review to list problems (labels, theme input, `alert`, no tests) even though generation was fast. Fixing everything would have taken longer than Round 2.

Round 2 spent ~10 minutes writing the specification and plan, then ~15 minutes implementing. Review was mostly confirming tests and diff scope — about 5 minutes. Total time was similar, but Round 2 shipped higher quality with less rework.

## AI mistake caught

In Round 1, the model rendered labels as `<span>` elements above inputs instead of accessible `<label htmlFor="...">` pairs. This is a concrete defect: the form looks fine visually but fails basic accessibility checks.

In Round 2, the first build failed because Zod v4 rejected `errorMap` on `z.enum()` — caught immediately by TypeScript, not manual QA.

## Conclusion

A vague prompt optimizes for speed of first output, not quality of outcome. A precise, plan-first prompt with verification steps (tests + build) produces code that is easier to review, more accessible, and safer to extend. For capstone work, specification-driven prompting in Cursor is worth the upfront cost.
