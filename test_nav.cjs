const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  // click Dokumen Perencanaan
  await page.evaluate(() => {
    const sidebarItems = Array.from(document.querySelectorAll('aside div, aside button'));
    const item = sidebarItems.find(el => el.textContent.includes('Dokumen Perencanaan'));
    if (item) item.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  
  const text = await page.evaluate(() => {
    return document.body.innerText.substring(0, 500);
  });
  console.log("Body text:", text);
  
  await browser.close();
})();
