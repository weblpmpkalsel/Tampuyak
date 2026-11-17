const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 1600 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.enterprise-sidebar-item'));
    const target = btns.find(b => b.textContent.includes('Dokumen Perencanaan'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
     const cards = Array.from(document.querySelectorAll('.enterprise-card'));
     const card = cards.find(c => c.textContent.toLowerCase().includes('kurikulum satuan'));
     if (card) {
        const btn = card.querySelector('button');
        if (btn) btn.click();
     }
  });
  await new Promise(r => setTimeout(r, 3000));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.includes('Preview Document'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 3000));

  const html = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('body_dom.html', html);

  await browser.close();
})();
