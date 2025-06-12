import { test, expect } from '@playwright/test';

test.describe('記事編集ページ', () => {
  test('既存のデータを編集して保存できる', async ({ page }) => {
    await page.goto('https://simple-blog-app-beta.vercel.app/posts/1/edit');

    // 入力フォームが既に埋まっている
    const titleInput = page.getByLabel('タイトル');
    const contentInput = page.getByLabel('本文');

    await expect(titleInput).toHaveValue(/.+/);
    await expect(contentInput).toHaveValue(/.+/);

    // 内容を変更して保存
    await titleInput.fill('編集後のタイトル');
    await contentInput.fill('これは編集後の本文です');
    await page.getByRole('button', { name: '保存' }).click();

    // 詳細ページに戻り、変更が反映されているか確認
    await expect(page).toHaveURL(/\/posts\/1$/);
    await expect(page.getByTestId('post-title')).toHaveText('編集後のタイトル');
    await expect(page.getByTestId('post-content')).toHaveText('これは編集後の本文です');
  });
});
