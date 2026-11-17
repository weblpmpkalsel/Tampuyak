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

  try {
    console.log('Navigating...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    console.log('Injecting corrupted data into localStorage...');
    await page.evaluate(() => {
      const data = {
        guru: { "0": { id: 1, nama: "Corrupted" } },
        tendik: { "0": { id: 1, nama: "Corrupted" } },
        rombel: { "0": { id: 1, nama: "Corrupted" } }
      };
      localStorage.setItem('tampuyak_settings_v3', JSON.stringify(data));
    });
    
    console.log('Reloading page with corrupted data...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if it's white screen (no generic container, etc)
    const html = await page.evaluate(() => document.body.innerHTML);
    if (html.length < 500 || html.includes('data.map is not a function')) {
      console.log('CRASH CONFIRMED!');
    } else {
      console.log('NO CRASH ON LOAD.');
    }
    
    // Now try to open Pengaturan > Guru
    console.log('Clicking Pengaturan...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pengaturan') || b.title === 'Pengaturan');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Clicking Guru tab...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Guru');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    const htmlAfter = await page.evaluate(() => document.body.innerHTML);
    if (htmlAfter.length < 500) {
      console.log('CRASH ON GURU TAB CONFIRMED!');
    }

  } catch (e) {
    console.log('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
