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
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 6000));
  
  // Set view to KSP
  await page.evaluate(() => { window.setCurrentView('documentDetail_ksp'); });
  await new Promise(r => setTimeout(r, 2000));
  
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
  // Click export PDF
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    let pdfBtn = Array.from(buttons).find(b => b.title === "Ekspor PDF");
    if(pdfBtn) pdfBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 5000));
  
  console.log("Clicking download link...");
  // Try to click the download PDF button in the modal
  const clicked = await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    let downloadLink = Array.from(links).find(l => l.innerText.includes('Download PDF'));
    if(downloadLink) {
      downloadLink.click();
      return true;
    }
    return false;
  });
  
  console.log("Clicked:", clicked);
  
  await new Promise(r => setTimeout(r, 2000));
  
  if (fs.existsSync('./downloads')) {
    console.log("Downloads:", fs.readdirSync('./downloads'));
  } else {
    console.log("No downloads folder");
  }
  
  await browser.close();
})();
