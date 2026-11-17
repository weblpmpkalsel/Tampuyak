import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    console.log('Navigating...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('Done waiting.');
  } catch (e) {
    console.log('Puppeteer Script Error:', e.message);
  } finally {
    await browser.close();
  }
})();
