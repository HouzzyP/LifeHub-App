import { test, expect } from '@playwright/test';
import { NotesPage } from '../pages/notes.page';

test.describe('Notes Module - Navigation and Rendering', () => {
    test('navigates to notes from home via More menu', async ({ page }) => {
        await page.goto('/');

        // Verify we're on dashboard
        await expect(page.getByRole('heading', { name: /LifeHub/i })).toBeVisible();

        // Use page object for navigation (Playwright Best Practices)
        const notesPage = new NotesPage(page);
        await notesPage.navigateToNotesViaMore();

        // Verify Notes page content rendered
        await notesPage.pageContentIsVisible();
    });

    test('notes module renders without errors', async ({ page }) => {
        await page.goto('/');

        // Navigate to Notes via More menu
        const notesPage = new NotesPage(page);
        await notesPage.navigateToNotesViaMore();

        // Verify searchable content exists
        await notesPage.searchInputIsVisible();

        // Verify category filters exist (at least "All" should be visible)
        await notesPage.allCategoryFilterIsVisible();
    });
});
