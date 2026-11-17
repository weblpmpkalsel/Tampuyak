const puppeteer = require('puppeteer');

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
  
  // Force enable export buttons
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(b => {
      if(b.title === "Ekspor DOCX" || b.title === "Ekspor PDF" || b.title === "Cetak Versi Tersertifikasi") {
        b.disabled = false;
      }
    });
  });
  
  // Click export DOCX
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    let docxBtn = Array.from(buttons).find(b => b.title === "Ekspor DOCX");
    if(docxBtn) docxBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  // Try to click the download DOCX button in the modal
  await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    let downloadLink = Array.from(links).find(l => l.innerText.includes('Download DOCX'));
    if(downloadLink) downloadLink.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const fs = require('fs');
  if (fs.existsSync('./downloads')) {
    console.log("Downloads:", fs.readdirSync('./downloads'));
  } else {
    console.log("No downloads folder");
  }
  
  await browser.close();
})();
