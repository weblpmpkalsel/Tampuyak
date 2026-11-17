import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const appUrl = 'http://localhost:3000';
  console.log('Navigating to ' + appUrl + '/register');
  
  await page.goto(appUrl + '/register', { waitUntil: 'networkidle0' });
  
  // Fill registration form
  const email = 'testuser_' + Date.now() + '@example.com';
  const password = 'Password123!';
  
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  await page.click('input[name="agreeTerms"]');
  
  console.log('Submitting registration for ' + email);
  await page.click('button[type="submit"]');
  
  // wait for either navigation or an error message to show up
  try {
    await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
        page.waitForFunction(() => {
            const bodyText = document.body.innerText;
            return bodyText.includes('Gagal mendaftar') || 
                   bodyText.includes('Email sudah digunakan') || 
                   bodyText.includes('Metode pendaftaran ini belum diaktifkan');
        }, { timeout: 10000 })
    ]);
  } catch(e) {
      console.log('Timeout waiting for response.');
  }
  
  console.log('Current URL: ' + page.url());
  await page.screenshot({ path: 'dashboard-auth-test.png' });
  
  const content = await page.content();
  
  if (page.url().includes('/dashboard') || page.url().includes('/workspace/setup')) {
      console.log('Dashboard Accessible: YES');
  } else {
      console.log('Dashboard Accessible: NO');
      if (content.includes('Gagal mendaftar')) {
          console.log('Error found on page: Gagal mendaftar');
      }
      if (content.includes('Metode pendaftaran ini belum diaktifkan')) {
          console.log('Error found on page: Metode pendaftaran ini belum diaktifkan');
      }
  }
  
  await browser.close();
})();
