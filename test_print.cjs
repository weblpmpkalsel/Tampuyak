const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting browser...");
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  console.log("Navigating to app...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log("Waiting for app to load...");
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Extracting HTML length before print mode...");
  let htmlLength = await page.evaluate(() => document.documentElement.innerHTML.length);
  console.log("HTML Length:", htmlLength);
  
  console.log("Triggering PDF generation (which uses print media query)...");
  await page.pdf({
    path: 'test_print_output.pdf',
    format: 'A4',
    printBackground: true
  });
  console.log("Generated test_print_output.pdf");
  
  await browser.close();
})();
