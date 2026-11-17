const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const docs = ['ksp', 'rkjm', 'rkt', 'rkas'];
const downloadDir = path.resolve('./downloads');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir,
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 6000));
  
  for (const doc of docs) {
    console.log(`Processing ${doc}...`);
    await page.evaluate((d) => { window.setCurrentView(`documentDetail_${d}`); }, doc);
    await new Promise(r => setTimeout(r, 2000));
    
    // Click Export PDF
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      let pdfBtn = Array.from(buttons).find(b => b.title === "Ekspor PDF");
      if(pdfBtn) pdfBtn.click();
    });
    
    // Wait for generation
    await new Promise(r => setTimeout(r, 12000));
    
    // Click PDF download
    await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      let pdfLink = Array.from(links).find(l => l.innerText.includes('Download PDF'));
      if(pdfLink) pdfLink.click();
    });
    await new Promise(r => setTimeout(r, 4000));
    
    // Click DOCX download
    await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      let docxLink = Array.from(links).find(l => l.innerText.includes('Download DOCX'));
      if(docxLink) docxLink.click();
    });
    await new Promise(r => setTimeout(r, 4000));
    
    // Close modal
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      // The close button is the one with the X icon inside the modal header
      let closeBtn = Array.from(buttons).find(b => b.innerHTML.includes('lucide-x')); 
      if(closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
  }
  
  await browser.close();
  
  console.log("Downloads:", fs.readdirSync(downloadDir));
  for (const f of fs.readdirSync(downloadDir)) {
    const stat = fs.statSync(path.join(downloadDir, f));
    console.log(`- ${f}: ${stat.size} bytes`);
  }
})();
