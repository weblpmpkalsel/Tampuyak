const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  page.exposeFunction('logError', (msg) => {
    console.log('BROWSER ERROR CAUGHT:', msg);
  });

  await page.evaluateOnNewDocument(() => {
    window.addEventListener('error', e => {
      window.logError(e.message + ' ' + e.filename + ':' + e.lineno);
    });
    window.addEventListener('unhandledrejection', e => {
      window.logError(e.reason);
    });
  });

  await page.goto('http://localhost:3000');
  
  // Try to click something that opens the validation panel?
  // We don't know the UI, but we can wait for 5s
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await browser.close();
})();
