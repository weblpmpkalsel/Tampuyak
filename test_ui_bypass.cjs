const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Set up download behavior
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './downloads',
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 6000));
  
  // Set view to KSP
  await page.evaluate(() => { window.setCurrentView('documentDetail_ksp'); });
  await new Promise(r => setTimeout(r, 2000));
  
  // Create a custom button that calls the window.setPrintMode directly if we could.
  // Wait, the setPrintMode is a React state. We can't access it easily.
  // Let's just mock getValidationIssues or we can add a global function in Tampuyak.tsx
  // No, we can just click "Lanjutkan Ekspor PDF" if it shows a modal!
  
  // Force enable export buttons
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(b => {
      if(b.title === "Ekspor DOCX" || b.title === "Ekspor PDF" || b.title === "Cetak Versi Tersertifikasi") {
        b.disabled = false;
      }
    });
  });
  
  console.log("Clicking export PDF...");
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    let pdfBtn = Array.from(buttons).find(b => b.title === "Ekspor PDF");
    if(pdfBtn) pdfBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Let's check if the validation modal appeared
  const validationModal = await page.evaluate(() => {
    return !!document.body.innerText.includes("Validasi Dokumen");
  });
  
  console.log("Validation modal appeared:", validationModal);
  
  // Is there a button to continue anyway?
  // Let's dump the buttons
  const modalButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText);
  });
  console.log("Modal buttons:", modalButtons);
  
  await browser.close();
})();
