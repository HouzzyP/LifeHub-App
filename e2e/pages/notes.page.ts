import { Page, expect } from '@playwright/test';

/**
 * Notes Page Object - encapsulates Notes module interactions
 * Following Playwright best practices: locators by role/text, not CSS selectors
 * Reference: https://playwright.dev/docs/best-practices
 */
export class NotesPage {
    constructor(private page: Page) {}

    /**
     * Navigate to Notes via the "More" modal menu
     * User flow: Dashboard → Click "More" → Click "Notes"
     */
    async navigateToNotesViaMore() {
        // Step 1: Click "More" button (by role for accessibility + resilience)
        const moreButton = this.page.getByRole('button', { name: /More/i });
        await expect(moreButton).toBeVisible();
        await moreButton.click();

        // Step 2: Wait for modal and click "Notes" option
        const notesOption = this.page.getByText('Notes', { exact: true });
        await expect(notesOption).toBeVisible();
        await notesOption.click();

        // Step 3: Verify notes page loaded (main content area visible)
        await expect(this.page.locator('main')).toBeVisible();
    }

    /**
     * Click the Create Note button
     */
    async clickCreateNote() {
        const createButton = this.page.getByRole('button', { name: /Create/i });
        await expect(createButton).toBeVisible();
        await createButton.click();
    }

    /**
     * Search for notes by query
     */
    async searchForNote(query: string) {
        const searchInput = this.page.getByPlaceholder(/Search notes/i);
        await searchInput.fill(query);
    }

    /**
     * Filter notes by category
     */
    async filterByCategory(category: string) {
        const categoryButton = this.page.getByRole('button', { name: new RegExp(category, 'i') });
        await expect(categoryButton).toBeVisible();
        await categoryButton.click();
    }

    /**
     * Verify search input is visible
     */
    async searchInputIsVisible() {
        const searchInput = this.page.getByPlaceholder(/Search notes/i);
        await expect(searchInput).toBeVisible();
    }

    /**
     * Verify "All" category filter button is visible
     */
    async allCategoryFilterIsVisible() {
        const allButton = this.page.getByRole('button', { name: /^All$/i });
        await expect(allButton).toBeVisible();
    }

    /**
     * Verify notes page content area (main element)
     */
    async pageContentIsVisible() {
        const pageContent = this.page.locator('main').first();
        await expect(pageContent).toBeVisible();
    }
}
