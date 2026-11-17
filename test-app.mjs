import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Wait a bit to see if React crashes
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  console.log("HTML length:", content.length);
  if (content.includes('Rate Exceeded')) {
     console.log("Rate Exceeded found in HTML!");
  }
  
  await browser.close();
})();
