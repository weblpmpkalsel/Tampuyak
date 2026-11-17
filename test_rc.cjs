const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Navigate to KSP
  await page.evaluate(() => {
    const sidebarItems = Array.from(document.querySelectorAll('aside div'));
    const kspItem = sidebarItems.find(el => el.textContent.includes('Dokumen KSP'));
    if (kspItem) kspItem.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const docCards = Array.from(document.querySelectorAll('.enterprise-card'));
    if (docCards.length > 0) {
       const btn = docCards[0].querySelector('button');
       if (btn) btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  
  // Force visible overflow before print
  await page.addStyleTag({content: `
    * {
      overflow: visible !important;
      height: auto !important;
    }
    #print-guard {
      display: none !important;
    }
  `});

  await page.pdf({
    path: 'KSP_RC.pdf',
    format: 'A4',
    printBackground: true
  });
  console.log("Generated KSP_RC.pdf");
  
  // RKJM
  await page.evaluate(() => {
    const sidebarItems = Array.from(document.querySelectorAll('header div span'));
    const homeItem = sidebarItems.find(el => el.textContent.includes('Tampuyak OS'));
    if (homeItem) homeItem.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const sidebarItems = Array.from(document.querySelectorAll('aside div'));
    const item = sidebarItems.find(el => el.textContent.includes('Dokumen Perencanaan'));
    if (item) item.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const tab = tabs.find(el => el.textContent.includes('RKJM'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Cetak Tersertifikasi') || b.textContent.includes('Cetak Draft'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.pdf({
    path: 'RKJM_RC.pdf',
    format: 'A4',
    printBackground: true
  });
  console.log("Generated RKJM_RC.pdf");
  
  await browser.close();
})();
