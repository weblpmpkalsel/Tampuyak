const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.screenshot({ path: 'public/screenshot.png' });
    await browser.close();
    console.log("Screenshot taken");
  } catch (e) {
    console.error(e);
  }
})();
