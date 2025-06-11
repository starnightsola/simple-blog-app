import { test, expect } from '@playwright/test';

// アプリのトップページにアクセスして「記事一覧」があるか確認
test('トップページに記事一覧が表示される', async ({ page }) => {
  await page.goto('https://simple-blog-app-beta.vercel.app');

  // h2の見出しに「記事一覧」と含まれているか
  await expect(page.getByRole('heading', { name: '記事一覧' })).toBeVisible()
  await page.waitForTimeout(3000); // 3秒待機（Renderが起きるまで待つ）
  
});

