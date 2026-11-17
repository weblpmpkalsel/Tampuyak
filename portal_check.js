import puppeteer from 'puppeteer';

async function runExperiment() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/debug', { waitUntil: 'networkidle0' });
  
  const html = await page.content();
  console.log('HTML size:', html.length);
  
  const children = await page.evaluate(() => {
    return Array.from(document.body.children).map(child => {
      const computed = window.getComputedStyle(child);
      let owner = 'unknown';
      if (child.id === 'root') owner = 'react (main)';
      else if (child.id === 'react-joyride-portal') owner = 'react-joyride';
      else if (child.id === 'print-root') owner = 'DedicatedPrintRoot';
      
      return {
        tagName: child.tagName,
        id: child.id,
        className: child.className,
        position: computed.position,
        top: computed.top,
        left: computed.left,
        width: computed.width,
        height: computed.height,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        zIndex: computed.zIndex,
        pointerEvents: computed.pointerEvents,
        owner: owner
      };
    });
  });
  
  console.log(JSON.stringify(children, null, 2));
  await browser.close();
}
runExperiment();
