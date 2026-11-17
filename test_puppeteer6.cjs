const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // click button to open KSP Validation Panel
  // we can just evaluate code to render it directly!
  await page.evaluate(() => {
    // we can't easily render it, but what if we just throw?
  });
  
  await browser.close();
})();
