const { chromium } = require('playwright');
const fs = require('fs');
const { google } = require('googleapis');

// Nhập CCCD tại đây
const cccd = '079198014518';

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'MST';

async function traCuuVaLuu() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Truy cập trang masothue.com
    await page.goto('https://masothue.com');

    // 2. Nhập CCCD vào ô tìm kiếm
    await page.fill('input[name="keyword"]', cccd);
    await page.keyboard.press('Enter');

    // 3. Chờ kết quả hiện ra
    await page.waitForSelector('a[href^="/"][href*="-"]', { timeout: 5000 });
    const link = await page.$eval('a[href^="/"][href*="-"]', el => el.href);

    // 4. Truy cập trang chi tiết
    await page.goto(link, { waitUntil: 'domcontentloaded' });

    // 5. Lấy thông tin
    const mst = await page.$eval('.tax-code', el => el.textContent.trim());
    const name = await page.$eval('.info strong', el => el.textContent.trim());
    const address = await page.$eval('.info + .info', el => el.textContent.trim());

    console.log({ cccd, mst, name, address });

    // 6. Ghi vào Google Sheets
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[cccd, mst, name, address]],
      },
    });

    console.log('✅ Ghi vào Google Sheets thành công!');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await browser.close();
  }
}

traCuuVaLuu();
