const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000');
  
  // check for React errors
  const rootContent = await page.evaluate(() => {
    return document.getElementById('root')?.innerHTML;
  });
  console.log('Root content:', rootContent?.substring(0, 100));
  
  await browser.close();
})();
