import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  let hasError = false;

  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('404')) {
      console.log('BROWSER ERROR:', msg.text());
      hasError = true;
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    hasError = true;
  });

  try {
    console.log('Navigating...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Get all sidebar menu items
    const menuItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(b => b.textContent).filter(t => t);
    });

    for (const menu of ['Dashboard', 'Identitas Sekolah', 'Perencanaan', 'Evaluasi & Supervisi', 'Keuangan', 'E-Office', 'Manajemen Data', 'Pengaturan']) {
       console.log('Clicking menu:', menu);
       await page.evaluate((m) => {
         const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes(m) || b.title === m);
         if (btn) btn.click();
       }, menu);
       await new Promise(r => setTimeout(r, 500));
       
       // If we are on Settings (Pengaturan), click all its tabs
       if (menu === 'Pengaturan') {
          const tabs = ['Profil Institusi', 'Identitas Sekolah', 'Sarana & Prasarana', 'Potensi', 'Pejabat', 'Guru', 'Tenaga Pendidik', 'Peserta Didik', 'Rombongan Belajar', 'Komite', 'Anggaran BOS', 'Manajemen AI'];
          for (const tab of tabs) {
             console.log('  Clicking tab:', tab);
             await page.evaluate((t) => {
               const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === t || (b.textContent && b.textContent.includes(t)));
               if (btn) btn.click();
             }, tab);
             await new Promise(r => setTimeout(r, 200));
             
             // Try to type in the first input if available
             await page.evaluate(() => {
                const input = document.querySelector('input');
                if (input) {
                   input.value = 'Test';
                   input.dispatchEvent(new Event('input', { bubbles: true }));
                   input.dispatchEvent(new Event('change', { bubbles: true }));
                }
             });
             await new Promise(r => setTimeout(r, 100));
          }
       }
    }
    
    if (hasError) {
      console.log('Finished with ERRORS.');
    } else {
      console.log('Finished NO ERRORS.');
    }
  } catch (e) {
    console.log('Puppeteer Script Error:', e.message);
  } finally {
    await browser.close();
  }
})();
