import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  console.log('Navigating to ' + appUrl + '/register');
  
  await page.goto(appUrl + '/register', { waitUntil: 'networkidle0' });
  
  // Fill registration form
  const email = 'testuser_' + Date.now() + '@example.com';
  const password = 'Password123!';
  
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  await page.click('input[name="agreeTerms"]');
  
  console.log('Submitting registration for ' + email);
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Navigated to: ' + page.url());
  
  if (page.url().includes('/dashboard')) {
      console.log('Dashboard Accessible: YES');
  } else {
      console.log('Dashboard Accessible: NO');
      console.log('Page content:', await page.content());
  }
  
  await page.screenshot({ path: 'dashboard-auth-test.png' });
  
  await browser.close();
})();
