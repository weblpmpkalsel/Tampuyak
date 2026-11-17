import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  console.log('Navigating to ' + appUrl + '/register');
  
  await page.goto(appUrl + '/register', { waitUntil: 'networkidle2' });
  
  // Fill registration form
  const email = 'testuser_' + Date.now() + '@example.com';
  const password = 'Password123!';
  
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  await page.click('input[name="agreeTerms"]');
  
  console.log('Submitting registration for ' + email);
  await page.click('button[type="submit"]');
  
  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
  
  // if on /workspace/setup, it's successful because it requires auth
  console.log('Navigated to: ' + page.url());
  
  // We can take a screenshot
  await page.screenshot({ path: 'dashboard-auth-test.png' });
  
  if (page.url().includes('/dashboard') || page.url().includes('/workspace/setup')) {
      console.log('Dashboard Accessible: YES');
  } else {
      console.log('Dashboard Accessible: NO');
      // see if there's any error on page
      const content = await page.content();
      if (content.includes('Email sudah digunakan')) {
        console.log('Error: Email in use');
      }
      if (content.includes('Gagal mendaftar')) {
        console.log('Error: Generic registration error');
      }
  }
  
  await browser.close();
})();
