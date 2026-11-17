const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Click Dokumen KSP in Sidebar
  await page.evaluate(() => {
    const kspItem = Array.from(document.querySelectorAll('aside div')).find(el => el.textContent.includes('Dokumen KSP'));
    if (kspItem) kspItem.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click first document "Lihat Dokumen"
  await page.evaluate(() => {
    const docCards = Array.from(document.querySelectorAll('.enterprise-card button'));
    const btn = docCards.find(b => b.textContent.includes('Lihat') || b.textContent.includes('Lanjutkan'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  
  // We are in KSP document. Let's hide the print-guard, and then print
  await page.evaluate(() => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
    
    // Also, make sure print layout is triggered. 
    // In Tampuyak, there is a print:hidden on the main UI and print:block on the print document.
    // So page.pdf will just work if we are in the document view.
  });

  await page.pdf({ path: 'ksp_verified.pdf', format: 'A4', printBackground: true });
  console.log("KSP generated.");

  await browser.close();
})();
