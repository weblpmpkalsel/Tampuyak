const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 800 });
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

    // Now click the specific document card Buka/Buat button
    await page.evaluate((docId) => {
       const cards = Array.from(document.querySelectorAll('.enterprise-card'));
       const card = cards.find(c => c.textContent.toLowerCase().includes(docId.toLowerCase()));
       if (card) {
          const btn = card.querySelector('button');
          if (btn) btn.click();
       }
    }, doc);
    await new Promise(r => setTimeout(r, 3000)); // wait for DocumentWorkspaceView to render

    // Inject custom print
    await page.evaluate(() => {
      window.__PRINT_CALLED = false;
      window.print = function() {
        window.__PRINT_CALLED = true;
      };
    });

    // Remove print guard just in case
    await page.evaluate(() => {
      const guard = document.getElementById('print-guard');
      if (guard) guard.style.setProperty('display', 'none', 'important');
    });

    // Take BEFORE screenshot
    await page.screenshot({ path: `${doc}_Before.png` });

    // Now click the Certified Print or Print Draft button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const printBtn = btns.find(b => b.textContent.includes('Print Draft') || b.textContent.includes('Certified Print') || b.textContent.includes('Cetak Tersertifikasi') || b.textContent.includes('Cetak Draft'));
      if (printBtn) printBtn.click();
    });

    // Wait until window.print is called
    await page.waitForFunction(() => window.__PRINT_CALLED, {timeout: 5000}).catch(()=>console.log('timeout waiting for print'));
    
    // Give it a moment for CSS print rules if any logic relies on it (though usually media print triggers automatically in page.pdf)
    await new Promise(r => setTimeout(r, 1000));

    // Wait for PDF to generate
    await page.pdf({
      path: `${doc}_FINAL.pdf`,
      format: 'A4',
      printBackground: true
    });
    console.log(`Generated ${doc}_FINAL.pdf`);
    
    // Take After screenshot to see what's on screen
    await page.screenshot({ path: `${doc}_After.png` });
  }
  await browser.close();
})();
