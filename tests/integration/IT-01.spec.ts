import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {
  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    // REAL: เปิดเว็บไซต์ SauceDemo และ Login จริง
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  await test.step('สร้าง Inventory Stub', async () => {
    // STUB: แทนที่ DOM ของหน้า Inventory ด้วยหน้าจำลองระดับ Browser
    await page.setContent(`
      <!doctype html>
      <html>
        <body>
          <h1 data-test="stub-status">Mock Inventory Ready</h1>
          <ul data-test="stub-inventory-list">
            <li data-test="stub-item" class="stub-item">Mock Backpack</li>
            <li data-test="stub-item" class="stub-item">Mock Bike Light</li>
          </ul>
        </body>
      </html>
    `);
  });

  await test.step('ตรวจสอบผลจาก Stub', async () => {
    await expect(page.locator('[data-test="stub-status"]')).toHaveText('Mock Inventory Ready');

    const items = page.locator('[data-test="stub-item"]');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveText('Mock Backpack');
    await expect(items.nth(1)).toHaveText('Mock Bike Light');
    await expect(items).toHaveText(['Mock Backpack', 'Mock Bike Light']);
  });
});