import puppeteer from 'puppeteer';

async function runExperiment() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Set content directly or navigate to localhost?
  // Let's assume dev server is running on 3000. Wait, we can just start it or check if it's running.
  
  await browser.close();
}
runExperiment();
