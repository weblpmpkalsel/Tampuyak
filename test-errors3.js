import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    } else {
      console.log('BROWSER LOG:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  try {
    console.log('Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Check if the app is visible or if there's a white screen
    const html = await page.evaluate(() => document.body.innerHTML);
    
    // Click on E-Office if present
    console.log('Clicking E-Office...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('E-Office'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click on Settings (Pengaturan)
    console.log('Clicking Pengaturan...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Pengaturan') || b.title === 'Pengaturan');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Try typing in inputs
    console.log('Typing...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      if (inputs.length > 0) {
        inputs[0].value = 'Test';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click on other tabs
    console.log('Clicking other tabs...');
    const tabs = ['Pejabat', 'Tenaga Pendidik', 'Peserta Didik', 'Komite'];
    for (const tab of tabs) {
       await page.evaluate((t) => {
         const btns = Array.from(document.querySelectorAll('button'));
         const btn = btns.find(b => b.textContent.includes(t));
         if (btn) btn.click();
       }, tab);
       await new Promise(r => setTimeout(r, 500));
    }
    
  } catch (e) {
    console.log('Puppeteer Script Error:', e.message);
  } finally {
    await browser.close();
  }
})();
