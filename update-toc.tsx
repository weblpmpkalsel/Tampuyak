import fs from 'fs';

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// 1. Add useState, useRef, useEffect
const importStatement = `import React, { useState, useEffect, useRef } from 'react';`;
content = content.replace(`import React from 'react';`, importStatement);

const componentStart = `export const EnterpriseDocumentViewer: React.FC<EnterpriseDocumentViewerProps> = ({ document, title, generatedBy, settings }) => {`;

const hooksCode = `
  const [pageNumbers, setPageNumbers] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: any;
    const calculatePages = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!containerRef.current) return;
        const A4_HEIGHT_PX = 1123;
        
        const newPageNumbers: Record<string, string> = {};
        
        const chapter1El = window.document.getElementById(\`chapter-\${document.chapter1?.id}\`);
        let startOfContentY = 0;
        
        if (chapter1El) {
           const rect = chapter1El.getBoundingClientRect();
           startOfContentY = rect.top + window.scrollY;
        }

        const elements = containerRef.current.querySelectorAll('[data-toc-id]');
        elements.forEach(el => {
            const id = el.getAttribute('data-toc-id');
            if (!id) return;
            
            const rect = el.getBoundingClientRect();
            const absoluteY = rect.top + window.scrollY;
            
            if (absoluteY < startOfContentY) {
               if (id === 'chapter-approval') newPageNumbers[id] = 'i';
               else if (id === 'chapter-toc') newPageNumbers[id] = 'ii';
            } else {
               const offsetFromStart = absoluteY - startOfContentY;
               const pageNum = Math.floor(offsetFromStart / A4_HEIGHT_PX) + 1;
               newPageNumbers[id] = pageNum.toString();
            }
        });
        
        setPageNumbers(newPageNumbers);
      }, 500);
    };

    calculatePages();
    
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
            calculatePages();
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
    }
    
    return () => {
        if (resizeObserver) resizeObserver.disconnect();
        clearTimeout(timeout);
    };
  }, [document]);
`;

content = content.replace(componentStart, componentStart + '\n' + hooksCode);

// 2. Add containerRef to the root div
content = content.replace(
  `<div className="relative z-10 w-full bg-white font-serif text-black">`,
  `<div ref={containerRef} className="relative z-10 w-full bg-white font-serif text-black">`
);

// 3. Add data-toc-id to Chapter and Section headings, and approval/toc
content = content.replace(
  `<h3 className="text-2xl font-bold text-center mb-16 uppercase text-slate-900">LEMBAR PENGESAHAN</h3>`,
  `<h3 data-toc-id="chapter-approval" className="text-2xl font-bold text-center mb-16 uppercase text-slate-900">LEMBAR PENGESAHAN</h3>`
);

content = content.replace(
  `<h2 className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-wider text-center border-b-2 border-slate-800 pb-4">`,
  `<h2 data-toc-id={chapter.id} className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-wider text-center border-b-2 border-slate-800 pb-4">`
);

content = content.replace(
  `{section.title && <h3 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h3>}`,
  `{section.title && <h3 data-toc-id={section.id} className="text-xl font-bold text-slate-900 mb-4">{section.title}</h3>}`
);

// 4. Update the TOC rendering
const oldTocMatch = /<div id="chapter-toc"[\s\S]*?<\/div>\s*<\/div>\s*<style>/;

const newTocCode = `<div id="chapter-toc" className="page-break-before mt-10 pt-[2cm] min-h-[200mm] pb-[2cm]" style={{ pageBreakBefore: "always" }}>
        <h3 data-toc-id="chapter-toc" className="text-2xl font-bold text-center mb-16 uppercase text-slate-900">{document.toc.title}</h3>
        <div className="max-w-2xl mx-auto text-slate-800 space-y-2 text-lg">
          <div className="mb-2">
            <div className="flex items-end w-full">
              <span className="pr-2 font-bold text-slate-900">LEMBAR PENGESAHAN</span>
              <div className="flex-grow border-b-2 border-dotted border-slate-400 relative -top-[6px] mx-2"></div>
              <span className="pl-2 font-bold text-slate-900">{pageNumbers['chapter-approval'] || 'i'}</span>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-end w-full">
              <span className="pr-2 font-bold text-slate-900 uppercase">{document.toc.title}</span>
              <div className="flex-grow border-b-2 border-dotted border-slate-400 relative -top-[6px] mx-2"></div>
              <span className="pl-2 font-bold text-slate-900">{pageNumbers['chapter-toc'] || 'ii'}</span>
            </div>
          </div>

          {[
            document.chapter1,
            document.chapter2,
            document.chapter3,
            document.chapter4,
            document.chapter5,
            document.appendix
          ].filter(Boolean).map((chapter, i) => (
            <div key={chapter.id} className="mb-4">
              <div className="flex items-end w-full mt-4">
                <span className="pr-2 font-bold text-slate-900 uppercase">{chapter.title}</span>
                <div className="flex-grow border-b-2 border-dotted border-slate-400 relative -top-[6px] mx-2"></div>
                <span className="pl-2 font-bold text-slate-900">{pageNumbers[chapter.id] || '-'}</span>
              </div>
              {chapter.sections && chapter.sections.length > 0 && (
                <div className="pl-6 mt-2 space-y-2 text-base">
                  {chapter.sections.map((section, j) => section.title && (
                    <div key={section.id} className="flex items-end w-full">
                      <span className="pr-2 text-slate-800">{section.title}</span>
                      <div className="flex-grow border-b-2 border-dotted border-slate-300 relative -top-[5px] mx-2"></div>
                      <span className="pl-2 text-slate-700">{pageNumbers[section.id] || '-'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>`;

content = content.replace(oldTocMatch, newTocCode);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
