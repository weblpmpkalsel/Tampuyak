const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  const docs = ['rkjm', 'rkt', 'rkas'];
  for (const doc of docs) {
    // Navigate to Dokumen Perencanaan first to reset
    await page.evaluate(() => {
      const sidebarItems = Array.from(document.querySelectorAll('aside div, aside button'));
      const item = sidebarItems.find(el => el.textContent.includes('Dokumen Perencanaan'));
      if (item) item.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Now click the specific document card
    await page.evaluate((docId) => {
       const cards = Array.from(document.querySelectorAll('.enterprise-card'));
       const card = cards.find(c => c.textContent.toLowerCase().includes(docId));
       if (card) {
          const btn = card.querySelector('button');
          if (btn) btn.click();
       }
    }, doc);
    await new Promise(r => setTimeout(r, 2000));

    const text = await page.evaluate(() => {
       const preview = document.getElementById('printable-doc-preview');
       return preview ? preview.innerText.substring(0, 500) : 'NOT FOUND';
    });
    console.log(`\n=== ${doc} ===\n`, text);
  }
  await browser.close();
})();
