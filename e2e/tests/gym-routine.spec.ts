import { test, expect } from '@playwright/test';

test.describe('Gym Tracker - Routine CRUD', () => {
    test('creates routine with optional day label and targets, then edits in View/Edit mode', async ({ page }) => {
        await page.goto('/');

        // Navigate to Gym
        await page.getByText('Gym', { exact: true }).click();
        await expect(page.getByText(/GymTracker/i)).toBeVisible();

        // Create new routine (click the Plus button)
        const plusButton = page.locator('button.premium-button').last();
        await plusButton.click();
        await expect(page.getByRole('heading', { name: /New Routine/i })).toBeVisible();

        // Fill routine name
        const nameInput = page.getByPlaceholder(/Back Day|Pecho|brazos/i);
        await nameInput.fill('Back Day Test');

        // Fill optional day label
        const dayInput = page.getByPlaceholder(/Optional label/i);
        await dayInput.fill('Monday');

        // Wait for exercises to load
        await expect(page.getByText('Bench Press').first()).toBeVisible({ timeout: 10000 });

        // Select "Bench Press" exercise by clicking the button that contains it
        await page.getByRole('button', { name: 'Bench Press' }).first().click();

        // Wait for selected exercises section
        await expect(page.getByText('Selected Exercises')).toBeVisible();

        // Fill targets - find inputs in the targets editor section
        const selectedSection = page.locator('h3:has-text("Selected Exercises")').locator('..');
        await selectedSection.locator('input').nth(0).fill('3'); // sets
        await selectedSection.locator('input').nth(1).fill('10'); // reps
        await selectedSection.locator('input').nth(2).fill('80'); // weight

        // Save routine
        const createButton = page.getByRole('button', { name: /Create Routine/i });
        await createButton.click();

        // Wait for navigation back to list + data to load
        await page.waitForTimeout(1500);
        await expect(page.getByText('Back Day Test')).toBeVisible();
        await expect(page.getByText('Monday')).toBeVisible();

        // Open routine detail
        await page.getByText('Back Day Test').click();

        // Verify we're in detail view (should see "View" button)
        await expect(page.getByRole('button', { name: /View/i })).toBeVisible();
        await expect(page.getByText('Monday')).toBeVisible();

        // Switch to Edit mode
        await page.getByRole('button', { name: /Edit/i }).click();

        // Verify we're now in edit mode - should see the routine name input
        await expect(page.getByPlaceholder('Routine name')).toBeVisible();

        // Edit routine name
        const editNameInput = page.getByPlaceholder('Routine name');
        await editNameInput.clear();
        await editNameInput.fill('Back Day Updated');

        // Save changes
        await page.getByRole('button', { name: /Save Changes/i }).click();

        // Verify updated routine in list
        await page.waitForTimeout(1000);
        await expect(page.getByText('Back Day Updated')).toBeVisible();
    });
});
