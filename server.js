// server.js
const express = require('express');
const { chromium } = require('playwright');
const { traCuu1CCCD } = require('./traMST');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

app.post('/api/tra-mst', async (req, res) => {
  const { cccds } = req.body;

  if (!Array.isArray(cccds)) {
    return res.status(400).json({ error: 'Trường "cccds" phải là một mảng CCCD hợp lệ' });
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true, slowMo: 100 });
    context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36',
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    const results = [];
    for (const cccd of cccds) {
      const result = await traCuu1CCCD(page, cccd);
      results.push(result);
    }

    await browser.close();
    return res.json(results);
  } catch (err) {
    if (browser) await browser.close();
    return res.status(500).json({ error: err, details: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại: http://localhost:${PORT}/api/tra-mst`);
});
