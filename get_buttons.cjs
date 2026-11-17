const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).map(el => el.textContent.trim()).filter(t => t.length > 0);
  });
  console.log(texts);
  
  await browser.close();
})();
