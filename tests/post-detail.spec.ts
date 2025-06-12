import { test, expect } from '@playwright/test';

test.describe('記事詳細ページ', () => {
  test('詳細ページが表示され、編集ページへ遷移できる', async ({ page }) => {
    await page.goto('https://simple-blog-app-beta.vercel.app');

    const firstCard = page.locator('[data-testid="post-card"]').first();
    await firstCard.click();
    // タイトルや本文が表示されているか確認
    await expect(page.getByTestId('post-title-detail')).toBeVisible();
    await expect(page.getByTestId('post-content')).toBeVisible();

    // 編集ボタンが表示されているか確認
    const editButton = page.getByRole('link', { name: '編集する' });
    await expect(editButton).toBeVisible();

    // 編集ページへ遷移
    await editButton.click();
    await expect(page).toHaveURL(/\/posts\/\d+\/edit/);
  });
});