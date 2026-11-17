const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 1600 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Navigate to Dokumen Perencanaan -> KSP
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.enterprise-sidebar-item'));
    const target = btns.find(b => b.textContent.includes('Dokumen Perencanaan'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
     const cards = Array.from(document.querySelectorAll('.enterprise-card'));
     const card = cards.find(c => c.textContent.toLowerCase().includes('ksp') || c.textContent.toLowerCase().includes('kurikulum operasional'));
     if (card) {
        const btn = card.querySelector('button');
        if (btn) btn.click();
     }
  });
  await new Promise(r => setTimeout(r, 3000));

  // Open Preview
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.includes('Preview Document'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 3000));

  // INJECT EXTREME DATA into DOM before Print!
  // Find cover text elements and make them huge.
  await page.evaluate(() => {
     const cover = document.getElementById('cover');
     if (cover) {
       const spans = cover.querySelectorAll('span');
       if (spans.length > 0) spans[0].textContent = "EXTREME_LONG_SCHOOL_NAME_THAT_WRAPS_MULTIPLE_LINES_AND_TAKES_UP_SPACE_12345 ".repeat(10);
     }
     
     // Inject extreme table
     const tables = document.querySelectorAll('table');
     if (tables.length > 0) {
        const tbody = tables[0].querySelector('tbody');
        if (tbody) {
          for(let i=0; i<100; i++) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td class="border border-black px-4 py-2">Row ${i}</td><td class="border border-black px-4 py-2">` + "LONG_DATA ".repeat(20) + `</td>`;
            tbody.appendChild(tr);
          }
        }
     }
  });

  await page.emulateMediaType('print');
  await new Promise(r => setTimeout(r, 2000));

  // Verify Cover Height
  const coverHeight = await page.evaluate(() => {
      const cover = document.querySelector('.print-section-override');
      return cover ? cover.getBoundingClientRect().height : 0;
  });

  fs.writeFileSync('stress_test_result.txt', `Cover Height: ${coverHeight}\n`);

  await browser.close();
})();
