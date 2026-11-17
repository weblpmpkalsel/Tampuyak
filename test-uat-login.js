import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const appUrl = 'http://localhost:3000';
  console.log('Navigating to ' + appUrl + '/login');
  
  await page.goto(appUrl + '/login', { waitUntil: 'networkidle2' });
  
  // Try to login with some user
  const email = 'admin@sd.mock';
  const password = 'Password123!';
  
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  
  await page.click('button[type="submit"]');
  
  try {
    await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
        page.waitForFunction(() => {
            const bodyText = document.body.innerText;
            return bodyText.includes('Login gagal') || 
                   bodyText.includes('Email atau kata sandi tidak valid') || 
                   bodyText.includes('Metode login ini belum diaktifkan');
        }, { timeout: 10000 })
    ]);
  } catch(e) {}
  
  console.log('Current URL: ' + page.url());
  const content = await page.content();
  
  if (page.url().includes('/dashboard') || page.url().includes('/workspace')) {
      console.log('Dashboard Accessible: YES');
  } else {
      console.log('Dashboard Accessible: NO');
      if (content.includes('Metode login ini belum diaktifkan')) {
          console.log('Error: Metode login ini belum diaktifkan');
      }
      if (content.includes('Email atau kata sandi tidak valid')) {
          console.log('Error: Email atau kata sandi tidak valid');
      }
      if (content.includes('Login gagal')) {
          console.log('Error: Login gagal');
      }
  }
  
  await browser.close();
})();
