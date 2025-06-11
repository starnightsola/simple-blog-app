import { test, expect } from '@playwright/test';
test.describe('トップページ', () => {
  const BASE_URL = 'https://simple-blog-app-beta.vercel.app';

  // ✅ テスト①: 記事一覧が表示されるかを確認
  test('記事一覧が表示される', async ({ page }) => {
    await page.goto(BASE_URL);

    // APIレスポンス（記事一覧）が完了するまで待機
    await page.waitForResponse(
      res => res.url().includes('/api/posts') && res.status() === 200,
      { timeout: 30000 }
    );

    const cards = page.locator('[data-testid="post-card"]');

    // post-cardが1つ以上描画されるまで待機
    await expect.poll(async () => {
      return (await cards.count()) > 0;
    }, { timeout: 30000 }).toBe(true);

    // 最初のカードが視認可能になるまで待機（アニメーション後）
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  // ✅ テスト②: 記事タイトルをクリックして詳細ページへ遷移できるかを確認
  test('記事タイトルをクリックして詳細ページに遷移できる', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.waitForResponse(
      res => res.url().includes('/api/posts') && res.status() === 200,
      { timeout: 30000 }
    );

    const cards = page.locator('[data-testid="post-card"]');

    await expect.poll(async () => {
      return (await cards.count()) > 0;
    }, { timeout: 30000 }).toBe(true);

    const firstCard = cards.first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // カードをクリック → 詳細ページへ
    await firstCard.click();

    // 詳細ページのh2見出しが表示されているか確認
    await expect(page.getByTestId('post-title-detail')).toBeVisible({ timeout: 5000 });
    // URLが `/posts/数字` の形式であることを確認
    await expect(page).toHaveURL(/\/posts\/\d+/);
  });
});