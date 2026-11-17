const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.waitForSelector('aside', { timeout: 10000 });
  
  // Click Dokumen KSP
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('aside div'));
    const ksp = items.find(el => el.textContent.includes('Dokumen KSP'));
    if (ksp) ksp.click();
  });
  
  // Wait for the "Lihat" button in KSP
  await page.waitForSelector('.enterprise-card button', { timeout: 10000 });
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.enterprise-card button'));
    const lihat = btns.find(b => b.textContent.includes('Lihat') || b.textContent.includes('Lanjutkan'));
    if (lihat) lihat.click();
  });
  
  // Wait for the document view to load (we know Cetak Draft button should exist)
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent.includes('Cetak Draft'));
  }, { timeout: 10000 });
  
  await page.evaluate(() => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
  });

  await page.pdf({ path: 'ksp_robust.pdf', format: 'A4', printBackground: true });
  console.log("KSP robust generated.");

  await browser.close();
})();
