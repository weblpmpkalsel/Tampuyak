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
  
  console.log("Clicking export PDF...");
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    let pdfBtn = Array.from(buttons).find(b => b.title === "Ekspor PDF");
    if(pdfBtn) pdfBtn.click();
  });
  
  // Wait enough time for PDF/DOCX to generate
  await new Promise(r => setTimeout(r, 8000));
  
  const modalLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(b => ({
      text: b.innerText,
      href: b.href
    }));
  });
  console.log("Modal links:", modalLinks);
  
  await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    let downloadLink = Array.from(links).find(l => l.innerText.includes('Download PDF'));
    if(downloadLink) downloadLink.click();
  });
  
  await new Promise(r => setTimeout(r, 4000));
  
  if (fs.existsSync('./downloads')) {
    console.log("Downloads PDF:", fs.readdirSync('./downloads'));
  } else {
    console.log("No downloads folder for PDF");
  }

  await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    let downloadLink = Array.from(links).find(l => l.innerText.includes('Download DOCX'));
    if(downloadLink) downloadLink.click();
  });
  
  await new Promise(r => setTimeout(r, 4000));
  
  if (fs.existsSync('./downloads')) {
    console.log("Downloads DOCX:", fs.readdirSync('./downloads'));
  }
  
  await browser.close();
})();
