import { test, expect } from '@playwright/test';

test('記事を新規作成し、一覧に表示される', async ({ page }) => {
  const BASE_URL = 'https://simple-blog-app-beta.vercel.app';
  await page.goto(BASE_URL);

  // 1. 「新しい記事を作成」ページへ遷移
  await page.getByTestId('create-link').click();

  // 2. タイトル・本文を入力
  const title = `E2E Test Title ${Date.now()}`;
  const content = 'これは自動テストで作成された記事です。';
  await page.getByTestId('title-input').fill(title);
  await page.getByTestId('content-input').fill(content);

  // 3. 「投稿する」ボタンをクリック
  await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/posts') && res.status() === 201),
    page.getByTestId('submit-button').click(),
  ]);

  // 4. トップページにリダイレクトされ、記事が表示されていることを確認
  await expect(page).toHaveURL(BASE_URL);

  const cards = page.locator('[data-testid="post-card"]');
  await expect.poll(() => cards.count(), { timeout: 5000 }).toBeGreaterThan(0);

  // 5. 入力したタイトルを含むカードが表示されていること
  await expect(page.locator('[data-testid="post-card"]', { hasText: title })).toBeVisible();
});
