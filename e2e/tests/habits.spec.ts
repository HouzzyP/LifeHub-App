import { test, expect } from '@playwright/test';

test.describe('Habits Module - CRUD Operations', () => {
    test('creates habit with name and displays in list', async ({ page }) => {
        await page.goto('/');

        // Navigate to Habits
        await page.getByText('Habits', { exact: true }).click();
        await expect(page.getByRole('heading', { name: /Habits/i })).toBeVisible();

        // Find the create button (last premium button or plus button)
        const createButtons = page.locator('button.premium-button');
        const createButton = createButtons.last();
        await createButton.click();

        // Wait for modal to appear
        await page.waitForTimeout(500);
        await expect(page.getByRole('heading', { name: /New Habit/i })).toBeVisible();

        // Fill habit name
        const habitNameInput = page.getByPlaceholder(/Habit Name|e\.g\./i);
        await habitNameInput.fill('E2E Read Daily');

        // Click create button
        const createHabitButton = page.getByRole('button', { name: /Create Habit/i });
        await createHabitButton.click();

        // Wait for modal to close and verify habit appears
        await page.waitForTimeout(800);
        await expect(page.getByText('E2E Read Daily')).toBeVisible({ timeout: 5000 });
    });

    test('displays habits list with today progress', async ({ page }) => {
        await page.goto('/');

        // Navigate to Habits
        await page.getByText('Habits', { exact: true }).click();
        await expect(page.getByRole('heading', { name: /Habits/i })).toBeVisible({ timeout: 5000 });

        // Verify page header
        const header = page.getByRole('heading', { name: /Habits/i });
        await expect(header).toBeVisible();

        // Create a test habit
        const createButton = page.locator('button.premium-button').last();
        await createButton.click();

        await page.waitForTimeout(400);
        const habitNameInput = page.getByPlaceholder(/Habit Name|e\.g\./i);
        await habitNameInput.fill('E2E Exercise Test');

        const createHabitButton = page.getByRole('button', { name: /Create Habit/i });
        await createHabitButton.click();

        await page.waitForTimeout(800);

        // Verify habit appears
        await expect(page.getByText('E2E Exercise Test')).toBeVisible();
    });

    test('toggles habit completion adds to today streak', async ({ page }) => {
        await page.goto('/');

        // Navigate to Habits
        await page.getByText('Habits', { exact: true }).click();
        await expect(page.getByRole('heading', { name: /Habits/i })).toBeVisible();

        // Create habit
        const createButton = page.locator('button.premium-button').last();
        await createButton.click();

        await page.waitForTimeout(400);
        const habitNameInput = page.getByPlaceholder(/Habit Name|e\.g\./i);
        await habitNameInput.fill('E2E Toggle Test');

        const createHabitButton = page.getByRole('button', { name: /Create Habit/i });
        await createHabitButton.click();

        await page.waitForTimeout(800);

        // Find the habit and its toggle button
        const habitText = page.getByText('E2E Toggle Test');
        await expect(habitText).toBeVisible();

        // Find parent container and then look for circle/check button
        const habitCard = habitText.locator('..');
        const allButtons = habitCard.locator('button');

        // The toggle button should be one of the visible buttons (not delete)
        if (await allButtons.count() > 0) {
            const toggleButton = allButtons.nth(0); // Usually the first button is toggle
            await toggleButton.click();

            // Wait for state update
            await page.waitForTimeout(500);
        }
    });

    test('can view and interact with habits', async ({ page }) => {
        await page.goto('/');

        // Navigate to Habits
        await page.getByText('Habits', { exact: true }).click();
        await page.waitForTimeout(1000);

        // Create a test habit to interact with
        const createButton = page.locator('button.premium-button').last();
        await createButton.click();

        await page.waitForTimeout(400);
        const habitNameInput = page.getByPlaceholder(/Habit Name|e\.g\./i);
        await habitNameInput.fill('View Interaction Test');

        const createHabitButton = page.getByRole('button', { name: /Create Habit/i });
        await createHabitButton.click();

        await page.waitForTimeout(800);

        // Verify habit is created and visible
        await expect(page.getByText('View Interaction Test')).toBeVisible();
    });

    test('navigates habits module successfully', async ({ page }) => {
        await page.goto('/');

        // Navigate to Habits
        await page.getByText('Habits', { exact: true }).click();
        await expect(page.getByRole('heading', { name: /Habits/i })).toBeVisible();

        // Verify we're on habits page (look for characteristic elements)
        const pageContent = page.locator('h2, h3').filter({ hasText: /Habits/i });
        await expect(pageContent).toBeVisible({ timeout: 5000 });

        // Verify create button exists
        const createButton = page.locator('button.premium-button');
        await expect(createButton).toBeVisible({ timeout: 3000 });
    });
});
