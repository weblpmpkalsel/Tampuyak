const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 6000));
  
  // Set view to KSP
  await page.evaluate(() => { window.setCurrentView('documentDetail_ksp'); });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
  });
  await page.pdf({ path: 'ksp_final.pdf', format: 'A4', printBackground: true });
  console.log("KSP generated");

  // Set view to RKJM
  await page.evaluate(() => { window.setCurrentView('documentDetail_rkjm'); });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
  });
  await page.pdf({ path: 'rkjm_final.pdf', format: 'A4', printBackground: true });
  console.log("RKJM generated");

  // Set view to RKAS
  await page.evaluate(() => { window.setCurrentView('documentDetail_rkas'); });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
  });
  await page.pdf({ path: 'rkas_final.pdf', format: 'A4', printBackground: true });
  console.log("RKAS generated");

  // Set view to RKT
  await page.evaluate(() => { window.setCurrentView('documentDetail_rkt'); });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
  });
  await page.pdf({ path: 'rkt_final.pdf', format: 'A4', printBackground: true });
  console.log("RKT generated");

  await browser.close();
})();
