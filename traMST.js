// traMST.js
const { chromium } = require('playwright');

async function traCuu1CCCD(page, cccd) {
  try {
    await page.goto('https://masothue.com', { waitUntil: 'domcontentloaded' });

    const currentUrl = page.url();
    if (currentUrl.includes('?r=')) {
      return { cccd, mst: null, error: 'Bị CAPTCHA' };
    }

    await page.fill('input[name="q"]', cccd);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.waitForSelector('h1', { timeout: 5000 });

    const url = page.url();
    const title = await page.textContent('h1.h1');
    // const mst = url.split('/')[3]?.split('-')[0];

    return { cccd, title, error: null };
  } catch (err) {
    return { cccd, title: null, error: err.message };
  }
}

module.exports = { traCuu1CCCD };
