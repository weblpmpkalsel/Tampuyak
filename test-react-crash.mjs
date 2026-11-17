import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push('PAGE LOG: ' + msg.text()));
  page.on('pageerror', err => logs.push('PAGE ERROR: ' + err.toString()));
  page.on('requestfailed', request => logs.push('REQUEST FAILED: ' + request.url() + ' ' + request.failure()?.errorText));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log(logs.join('\n'));
  await browser.close();
})();
