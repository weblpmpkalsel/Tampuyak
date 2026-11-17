const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const content = await page.evaluate(() => document.getElementById('root')?.innerHTML);
  console.log('HTML:', content?.substring(0, 300));
  
  await browser.close();
})();
