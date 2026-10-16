import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('UT-01: Login Form Validation', () => {
  test('UT-01.1: empty username and password', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อไม่กรอก Username และ Password' }
  }, async ({ page }) => {
    await test.step('เปิดหน้า Login', async () => {
      await page.goto(BASE_URL);
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
    await test.step('ส่งฟอร์มโดยไม่กรอกข้อมูล', async () => {
      await page.locator('[data-test="login-button"]').click();
    });
    await test.step('ตรวจสอบ Error และ URL', async () => {
      await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
      await expect(page).not.toHaveURL(/inventory\.html/);
      await expect(page).toHaveURL(BASE_URL);
    });
  });

  test('UT-01.2: missing password', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อกรอก Username แต่ไม่กรอก Password' }
  }, async ({ page }) => {
    await test.step('เปิดหน้า Login และกรอก Username', async () => {
      await page.goto(BASE_URL);
      await page.locator('[data-test="username"]').fill('standard_user');
    });
    await test.step('กด Login โดยไม่กรอก Password', async () => {
      await page.locator('[data-test="login-button"]').click();
    });
    await test.step('ตรวจสอบ Error และ URL', async () => {
      await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
      await expect(page).not.toHaveURL(/inventory\.html/);
      await expect(page).toHaveURL(BASE_URL);
    });
  });

  test('UT-01.3: invalid login details', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อกรอก Username และ Password ที่ไม่ถูกต้อง' }
  }, async ({ page }) => {
    await test.step('เปิดหน้า Login และกรอกข้อมูลที่ไม่ถูกต้อง', async () => {
      await page.goto(BASE_URL);
      await page.locator('[data-test="username"]').fill('invalid_user');
      await page.locator('[data-test="password"]').fill('wrong_password');
    });
    await test.step('กด Login', async () => {
      await page.locator('[data-test="login-button"]').click();
    });
    await test.step('ตรวจสอบ Error และ URL', async () => {
      await expect(page.locator('[data-test="error"]')).toContainText(
        'Username and password do not match any user in this service'
      );
      await expect(page).not.toHaveURL(/inventory\.html/);
      await expect(page).toHaveURL(BASE_URL);
    });
  });
});