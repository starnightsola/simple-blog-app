import { test, expect } from '@playwright/experimental-ct-react';
import Button from '../../src/components/ui/button';


test('ボタンがレンダリングされ、クリックできる', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  await expect(component).toContainText('Click me');
});