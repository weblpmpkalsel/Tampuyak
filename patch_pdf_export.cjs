const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

const targetMethodStart = "public async generatePDF(htmlContent: HTMLElement | string, metadata: ExportMetadata): Promise<string> {";

const replacementMethod = `  public async generatePDF(htmlContent: HTMLElement | string, metadata: ExportMetadata): Promise<string> {
    let isLandscape = false;
    if (typeof htmlContent === 'string') {
      isLandscape = htmlContent.includes('landscape-section');
    } else {
      isLandscape = htmlContent.classList.contains('landscape-section') || htmlContent.querySelector('.landscape-section') !== null;
    }

    const opt = {
      margin:       1,
      filename:     \`\${metadata.title}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
    };

    const originalGetComputedStyle = window.getComputedStyle;
    const proxyGetComputedStyle = function(el: Element, pseudoElt?: string | null) {
      const style = originalGetComputedStyle(el, pseudoElt);
      return new Proxy(style, {
        get(target: any, prop: string | symbol) {
          if (prop === 'getPropertyValue') {
            return function(propName: string) {
              const val = target.getPropertyValue(propName);
              if (val && typeof val === 'string' && val.includes('oklch')) {
                if (propName.includes('background') || propName.includes('border') && val.includes('transparent')) return 'transparent';
                if (propName.includes('background')) return 'rgb(255, 255, 255)';
                return 'rgb(0, 0, 0)';
              }
              return val;
            };
          }
          let val = target[prop];
          if (typeof val === 'string' && val.includes('oklch')) {
            if (prop.toString().includes('background')) return 'rgb(255, 255, 255)';
            return 'rgb(0, 0, 0)';
          }
          if (typeof val === 'function') {
            return val.bind(target);
          }
          return val;
        }
      });
    };

    window.getComputedStyle = proxyGetComputedStyle as any;

    try {
      const pdfBlob = await html2pdf().from(htmlContent).set(opt as any).output('blob');
      return URL.createObjectURL(pdfBlob);
    } finally {
      window.getComputedStyle = originalGetComputedStyle;
    }
  }`;

// Find the start of generatePDF and replace it to the end of the class
const classEndIdx = code.lastIndexOf('}');
const methodStartIdx = code.indexOf(targetMethodStart);

if (methodStartIdx !== -1) {
  code = code.substring(0, methodStartIdx) + replacementMethod + "\n}\n";
  fs.writeFileSync('src/DocumentExportEngine.ts', code);
  console.log("Patched generatePDF");
} else {
  console.log("Method not found");
}
