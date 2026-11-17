import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // To avoid timeout
  page.setDefaultNavigationTimeout(60000);
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Try to click "Mulai Sistem Tampuyak" or wait for dashboard
  const html = await page.content();
  if (html.includes('Mulai Sistem Tampuyak')) {
      await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('Mulai'));
          if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 2000));
  }
  
  // Find "Susun KSP" or similar and click
  await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('div, button, span, p, h3'));
      const kspBtn = texts.find(el => el.textContent.includes('Susun KSP') || el.textContent === 'KSP');
      if (kspBtn) kspBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 4000));
  
  const rootHtml = await page.evaluate(() => {
    return document.getElementById('root') ? document.getElementById('root').innerHTML.substring(0, 200) : 'No root';
  });
  console.log("Root HTML:", rootHtml);
  
  const printRootHtml = await page.evaluate(() => {
    const el = document.getElementById('print-root');
    return el ? el.innerHTML.substring(0, 200) : 'No print-root';
  });
  console.log("Print Root HTML:", printRootHtml);
  
  // Take screenshot
  await page.screenshot({ path: 'browser_print_p1_screen.png', fullPage: true });
  
  // Generate PDF
  await page.pdf({ path: 'browser_print_p1.pdf', format: 'A4', printBackground: true });
  
  await browser.close();
  console.log('PDF generated at browser_print_p1.pdf');
})();
