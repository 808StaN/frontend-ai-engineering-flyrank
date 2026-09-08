import { expect, test } from '@playwright/test'

test('moves keyboard users past navigation with the skip link', async ({
  page,
}) => {
  await page.goto('/')

  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to main content' }),
  ).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
})
