import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  console.log('Navigating to ' + appUrl + '/register');
  
  await page.goto(appUrl + '/register', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'dashboard-auth-test-register.png' });
  
  const content = await page.content();
  console.log("HTML:", content.substring(0, 1000));
  
  await browser.close();
})();
