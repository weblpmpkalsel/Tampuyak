const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 1600 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const docs = ['RKJM', 'RKT', 'RKAS'];
  for (const doc of docs) {
    // Navigate to Dokumen Perencanaan
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button.enterprise-sidebar-item'));
      const target = btns.find(b => b.textContent.includes('Dokumen Perencanaan'));
      if (target) target.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // Click Buka XXX
    await page.evaluate((docId) => {
       const cards = Array.from(document.querySelectorAll('.enterprise-card'));
       const card = cards.find(c => c.textContent.toLowerCase().includes(docId.toLowerCase()));
       if (card) {
          const btn = card.querySelector('button');
          if (btn) btn.click();
       }
    }, doc);
    await new Promise(r => setTimeout(r, 3000)); 

    // Emulate Print Media
    await page.emulateMediaType('print');
    await new Promise(r => setTimeout(r, 1000));

    // Capture Cover
    try {
      const cover = await page.$('#print-root #chapter-cover');
      if (cover) await cover.screenshot({ path: `${doc}_PrintPreview_1_Cover.png` });
    } catch(e) {}

    // Capture Approval
    try {
      const approval = await page.$('#print-root #chapter-approval');
      if (approval) await approval.screenshot({ path: `${doc}_PrintPreview_2_Approval.png` });
    } catch(e) {}

    // Capture Narrative Page
    try {
      const bab1 = await page.$('#print-root #chapter-bab1');
      if (bab1) await bab1.screenshot({ path: `${doc}_PrintPreview_3_Narrative.png` });
    } catch(e) {}

    // Capture Table Page
    try {
      const table = await page.$('#print-root table');
      if (table) {
          const section = await table.evaluateHandle(el => {
              let p = el.parentElement;
              while(p && !p.classList.contains('portrait-section') && !p.classList.contains('landscape-section')) {
                  p = p.parentElement;
              }
              return p || el;
          });
          if (section) await section.asElement().screenshot({ path: `${doc}_PrintPreview_4_Table.png` });
      }
    } catch(e) {}
    
    // Full print preview layout
    await page.screenshot({ path: `${doc}_PrintPreview_Full.png`, fullPage: true });

    await page.emulateMediaType('screen');
    await new Promise(r => setTimeout(r, 1000));
  }
  await browser.close();
})();
