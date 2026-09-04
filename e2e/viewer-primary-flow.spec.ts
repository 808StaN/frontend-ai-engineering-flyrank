import { expect, test } from '@playwright/test'

test('lets the user select a product finish', async ({ page }) => {
  await page.goto('/viewer')

  await expect(
    page.getByRole('heading', { name: 'Product Viewer' }),
  ).toBeVisible()
  await expect(
    page.getByRole('group', { name: 'Lamp color' }),
  ).toBeVisible()

  await page.getByText('Green', { exact: true }).click()

  await expect(page.getByRole('radio', { name: 'Green' })).toBeChecked()
  await expect(page.getByText('Green finish selected.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible()
})

test.describe('on a 375px mobile viewport', () => {
  test.use({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
  })

  test('keeps the finish picker and reset control visible', async ({ page }) => {
    await page.goto('/viewer')

    await expect(page.getByRole('radio', { name: 'Blue' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible()
  })
})
