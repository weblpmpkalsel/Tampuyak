const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 5000));
  
  // Set view to KSP
  await page.evaluate(() => { window.setCurrentView('documentDetail_ksp'); });
  await new Promise(r => setTimeout(r, 2000));
  
  // Trigger export DOCX via DocumentExportEngine
  const results = await page.evaluate(async () => {
    try {
      const engine = new window.DocumentExportEngine();
      const documentModel = window.generateAppDocument('ksp', window.KnowledgeGraph.getInstance(), window.appSettings);
      const exportMeta = {
        title: "KSP Document",
        generatedBy: "System",
        version: 1,
        qualityScore: 100
      };
      
      const docxUrl = await engine.generateDocx(documentModel, exportMeta);
      
      const printDoc = document.getElementById("printable-doc-export");
      // Wait for it to be generated or we can just pass the preview doc
      const previewDoc = document.getElementById("printable-doc-preview");
      
      return { success: true, docxUrl, hasPrintDoc: !!printDoc, hasPreviewDoc: !!previewDoc };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  
  console.log("Results:", results);
  
  await browser.close();
})();
