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
  
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  page.on('response', response => {
    if (response.status() === 404) {
      console.log('404:', response.url());
    }
  });

  try {
    console.log('Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Check if the app is visible or if there's a white screen
    const html = await page.evaluate(() => document.body.innerHTML);
    if (html.length < 500) {
      console.log('HTML is suspiciously small:', html);
    } else {
      console.log('HTML loaded fine.');
    }
    
    // Simulate user clicking on Settings
    console.log('Attempting to navigate to Settings...');
    const settingsBtn = await page.$('button[title="Pengaturan"]');
    if (settingsBtn) {
      await settingsBtn.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const schoolTab = await page.$('button:has-text("Profil Institusi")');
      if (schoolTab) {
        await schoolTab.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try typing in the name field
        const nameInput = await page.$('input[value=""]');
        if (nameInput) {
          await nameInput.type('Test');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    
  } catch (e) {
    console.log('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
