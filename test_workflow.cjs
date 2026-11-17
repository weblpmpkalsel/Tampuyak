const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 6000));
  
  const results = {};
  
  // 1. Check score element
  results.scoreBefore = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Score:'));
    return el ? el.innerText : null;
  });
  
  // 2. Change planning year / academic year
  // Let's go to Settings view
  await page.evaluate(() => { window.setCurrentView('settings'); });
  await new Promise(r => setTimeout(r, 2000));
  
  // Modify some text to trigger save
  // Let's go to KSP view
  await page.evaluate(() => { window.setCurrentView('documentDetail_ksp'); });
  await new Promise(r => setTimeout(r, 2000));
  
  results.scoreAfterKsp = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Score:'));
    return el ? el.innerText : null;
  });
  
  // Let's check buttons
  results.buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      title: b.title,
      text: b.innerText,
      disabled: b.disabled
    })).filter(b => b.title || b.text.includes('Score'));
  });

  await browser.close();
  
  console.log("Workflow Results:", JSON.stringify(results, null, 2));
})();
