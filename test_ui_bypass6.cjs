const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 6000));
  
  // Set view to KSP
  await page.evaluate(() => { window.setCurrentView('documentDetail_ksp'); });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    let pdfBtn = Array.from(buttons).find(b => b.title === "Ekspor PDF");
    if(pdfBtn) pdfBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 6000));
  
  const html = await page.evaluate(() => {
    const modal = document.querySelector('.bg-slate-900\\/90');
    return modal ? modal.innerHTML : '';
  });
  
  fs.writeFileSync('modal.html', html);
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(l => ({ text: l.innerText, href: l.href.substring(0, 100) }));
  });
  
  console.log("Links found:", links);
  
  await browser.close();
})();
