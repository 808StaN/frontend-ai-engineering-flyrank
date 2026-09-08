import { expect, test } from '@playwright/test'

test('sends a message and renders the mocked assistant response', async ({
  page,
}) => {
  await page.route('**/api/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: {
        'x-vercel-ai-ui-message-stream': 'v1',
      },
      body: [
        'data: {"type":"start","messageId":"assistant-e2e"}',
        'data: {"type":"text-start","id":"response-e2e"}',
        'data: {"type":"text-delta","id":"response-e2e","delta":"Your mocked capstone answer is ready."}',
        'data: {"type":"text-end","id":"response-e2e"}',
        'data: {"type":"finish"}',
        'data: [DONE]',
        '',
      ].join('\n\n'),
    })
  })

  await page.goto('/chat')

  const composer = page.getByRole('textbox', {
    name: 'Message FlyRank Advisor',
  })
  await composer.fill('What should I build first?')
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByText('What should I build first?')).toBeVisible()
  await expect(
    page.getByText('Your mocked capstone answer is ready.', { exact: true }),
  ).toBeVisible()
})
