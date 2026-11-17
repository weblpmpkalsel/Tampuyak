const puppeteer = require('puppeteer');
const fs = require('fs');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
      defaultViewport: { width: 1440, height: 900 }
    });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await wait(2000);
    
    await page.screenshot({ path: 'public/screenshots/01_Main_Dashboard.png' });
    console.log("Captured 1");
    
    const clickElement = async (text) => {
      const clicked = await page.evaluate((t) => {
        const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.trim().toLowerCase() === t.toLowerCase() || el.textContent.includes(t));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, text);
      return clicked;
    };
    
    if (await clickElement('Dokumen Perencanaan')) {
       await wait(500);
       await page.screenshot({ path: 'public/screenshots/02_Sidebar_Navigation.png' });
       console.log("Captured 2");
       
       await page.screenshot({ path: 'public/screenshots/03_Dokumen_Perencanaan.png' });
       console.log("Captured 3");
       
       if (await clickElement('KSP')) {
         await wait(1000);
         await page.screenshot({ path: 'public/screenshots/04_KSP_Home.png' });
         console.log("Captured 4");
         
         await page.screenshot({ path: 'public/screenshots/16_Publishing_Workspace.png' });
         console.log("Captured 16");
         
         if (await clickElement('Preview Document')) {
            await wait(1000);
            await page.screenshot({ path: 'public/screenshots/05_Preview_Workspace.png' });
            console.log("Captured 5");
            
            if (await clickElement('Sampul')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/06_Cover_Preview.png' });
                console.log("Captured 6");
            }
            if (await clickElement('Lembar Pengesahan')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/07_Approval_Page.png' });
                console.log("Captured 7");
            }
            if (await clickElement('Daftar Isi')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/08_Table_of_Contents.png' });
                console.log("Captured 8");
            }
            if (await clickElement('BAB I')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/09_BAB_I.png' });
                console.log("Captured 9");
            }
            if (await clickElement('BAB II')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/10_BAB_II.png' });
                console.log("Captured 10");
            }
            if (await clickElement('BAB III')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/11_BAB_III.png' });
                console.log("Captured 11");
            }
            if (await clickElement('BAB IV')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/12_BAB_IV.png' });
                console.log("Captured 12");
            }
            if (await clickElement('BAB V')) {
                await wait(500);
                await page.screenshot({ path: 'public/screenshots/13_BAB_V.png' });
                console.log("Captured 13");
            }
            
            await clickElement('Tutup Preview');
            await wait(1000);
         }
         
         if (await clickElement('Attachments')) {
            await wait(1000);
            await page.screenshot({ path: 'public/screenshots/14_Attachments.png' });
            console.log("Captured 14");
            
            await clickElement('Kembali');
            await wait(1000);
         }
         
         if (await clickElement('Validation')) {
            await wait(1000);
            await page.screenshot({ path: 'public/screenshots/15_Validation_Workspace.png' });
            console.log("Captured 15");
         }
       }
    }
    
    await browser.close();
    console.log("All screenshots taken");
  } catch (e) {
    console.error(e);
    if (browser) await browser.close();
  }
})();
