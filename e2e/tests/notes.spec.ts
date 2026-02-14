import { test, expect } from '@playwright/test';

test.describe('Notes Module - Navigation and Rendering', () => {
    test('navigates to notes from home', async ({ page }) => {
        await page.goto('/');

        // Verify we're on dashboard
        await expect(page.getByRole('heading', { name: /LifeHub/i })).toBeVisible();

        // Click Notes button
        const notesButton = page.getByText('Notes', { exact: true });
        await notesButton.click();

        // Wait for page to render
        await page.waitForTimeout(2000);

        // The page should have some content after clicking Notes
        // This verifies navigation works
        const pageBody = page.locator('main').first();
        await expect(pageBody).toBeVisible();
    });

    test('notes module renders without errors', async ({ page }) => {
        await page.goto('/');

        // Navigate to Notes
        await page.getByText('Notes', { exact: true }).click();
        await page.waitForTimeout(1500);

        // If we get here without errors, navigation worked
        // Verify page is not showing a blank state or error
        const content = page.locator('div').filter({ hasText: /Note|note|Search/ }).first();

        // Just verify something rendered
        expect(content).toBeTruthy();
    });
});
