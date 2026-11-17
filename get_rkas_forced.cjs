const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));
  
  // Hide guard
  await page.evaluate(() => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
  });

  await page.pdf({ path: 'rkas_forced.pdf', format: 'A4', printBackground: true });
  console.log("RKAS forced generated.");

  await browser.close();
})();
