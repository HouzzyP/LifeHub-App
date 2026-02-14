import { test, expect } from '@playwright/test';

test('loads LifeHub and navigates to Gym', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /LifeHub/i })).toBeVisible();

    await page.getByText('Gym', { exact: true }).click();
    await expect(page.getByText(/GymTracker/i)).toBeVisible();
});
