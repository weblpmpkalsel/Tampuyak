import { PlanningContextService } from './planning/PlanningContextService';
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { DocumentModel, DocumentChapter, DocumentSection } from './DocumentCompositionEngine/DocumentModel';
import { useWorkspace } from './workspace/WorkspaceContext';
import { EditableRegion } from './workspace/EditableRegion';
import { DefaultDocumentLayoutConfig, EnterpriseLayoutRegistry } from './enterprise/document/layout/LayoutEngine';

interface EnterpriseDocumentViewerProps {
  document: DocumentModel;
  title?: string;
  generatedBy?: string;
  settings?: any;
}

const EnterpriseDocumentViewerContent: React.FC<EnterpriseDocumentViewerProps> = ({ document, title, generatedBy, settings }) => {
  const { state } = useWorkspace();

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
        
        const chapter1El = window.document.getElementById(`chapter-bab1`) || window.document.getElementById(`chapter-${document.chapter1?.id}`);
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


  if (!document || !document.cover || !document.approval || !document.toc || !document.chapter1 || !document.chapter2 || !document.chapter3 || !document.chapter4 || !document.chapter5 || !document.appendix) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white p-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-red-600 mb-4">DOCUMENT COMPOSITION FAILURE</h2>
          <p className="text-lg text-slate-700">Missing chapters. The Document Composition Engine failed to generate a complete document model.</p>
        </div>
      </div>
    );
  }

  const renderSection = (section: DocumentSection, sectionIndex: number = 0) => {
    const isAppendix = section.title?.startsWith('Lampiran');
    
    return (
      <React.Fragment key={`frag-${sectionIndex}`}>
        <div key={`sec-${sectionIndex}`} className={`mb-8 section-container`}>
        {section.title && <EditableRegion id={`section-title-${section.id}`} fallback={section.title} as="h3" data-toc-id={section.id} className="gdds-heading-2" />}
        {section.paragraphs.filter(p => p.trim() !== "").map((p, idx) => {
          const isPhotoPlaceholder = p.startsWith('[Ruang Foto');
          return (
            <p key={idx} className={isPhotoPlaceholder ? 'border-2 border-dashed border-slate-300 p-12 text-center text-slate-400 bg-slate-50 mb-6' : 'gdds-p whitespace-pre-line'}>
              {p.split(/(\*\*.*?\*\*)/).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}
            </p>
          );
        })}
        {section.metadata?.targets && (
          <div className="mb-6">
            <h4 className="font-bold text-slate-800 mb-2 mt-6">Proyeksi Target Capaian (4 Tahun):</h4>
            <div className="overflow-x-auto print:overflow-visible w-full gdds-table-block print:block">
              <table className="w-full table-auto border-collapse border border-slate-300 text-sm print:text-[12pt]">
              <thead>
                <tr className="break-inside-avoid print:break-inside-avoid bg-slate-100 print:bg-slate-50">
                  <th className="w-1/4 border border-slate-300 p-3 text-left whitespace-normal">Tahun 1</th>
                  <th className="w-1/4 border border-slate-300 p-3 text-left whitespace-normal">Tahun 2</th>
                  <th className="w-1/4 border border-slate-300 p-3 text-left whitespace-normal">Tahun 3</th>
                  <th className="w-1/4 border border-slate-300 p-3 text-left whitespace-normal">Tahun 4</th>
                </tr>
              </thead>
              <tbody>
                <tr className="break-inside-avoid print:break-inside-avoid">
                  <td className="border border-slate-300 p-3 text-center align-top whitespace-normal">{section.metadata.targets.targetY1 ?? section.metadata.targets.y1 ?? '-'}{typeof (section.metadata.targets.targetY1 ?? section.metadata.targets.y1) === 'number' ? '%' : ''}</td>
                  <td className="border border-slate-300 p-3 text-center align-top whitespace-normal">{section.metadata.targets.targetY2 ?? section.metadata.targets.y2 ?? '-'}{typeof (section.metadata.targets.targetY2 ?? section.metadata.targets.y2) === 'number' ? '%' : ''}</td>
                  <td className="border border-slate-300 p-3 text-center align-top whitespace-normal">{section.metadata.targets.targetY3 ?? section.metadata.targets.y3 ?? '-'}{typeof (section.metadata.targets.targetY3 ?? section.metadata.targets.y3) === 'number' ? '%' : ''}</td>
                  <td className="border border-slate-300 p-3 text-center font-bold text-blue-700 align-top whitespace-normal">{section.metadata.targets.targetY4 ?? section.metadata.targets.y4 ?? '-'}{typeof (section.metadata.targets.targetY4 ?? section.metadata.targets.y4) === 'number' ? '%' : ''}</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        )}
        {section.tables && section.tables.map((table, idx) => {
          if (table.type === 'signature_block') {
            return (
              <div key={idx} className={`signature-block mt-16 ${DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? "page-break-inside-avoid print-no-break" : ""}`} style={DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? { pageBreakInside: 'avoid', breakInside: 'avoid' } : {}}>
                <div className="flex justify-end mt-12 pr-8">
                  <p className="text-slate-900">{table.location}</p>
                </div>
                <div className="gdds-signature-grid">
                  {table.signatures.map((sig: any, sIdx: number) => (
                    <div key={sIdx} className="gsls-signature-cell center">
                      <div className="gsls-signature-content">
                        <div className="gsls-role-block">
                          <p className="text-slate-800 m-0 leading-snug whitespace-pre-line">{sig.label}</p>
                        </div>
                        <div className="gsls-signature-space"></div>
                        <div className="gsls-identity-block">
                          <p className="gdds-signature-name relative z-20 leading-snug">{sig.name}</p>
                          <p className="text-slate-800 relative z-20 m-0 leading-snug">NIP. {sig.nip}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return (
          <div key={idx} className="mt-[12pt] mb-[12pt]">
            {table.title && <h4 className="font-bold text-slate-800 mb-3">{table.title}</h4>}
            {table.data && (table.data.identification || (Array.isArray(table.data) && table.title && table.title.includes('Identifikasi'))) ? (
              // IRB Matrix
              <div className="overflow-x-auto print:overflow-visible w-full gdds-table-block print:block">
                <table className="w-full table-auto text-sm print:text-[12pt] border-collapse border border-slate-300">
                <thead>
                  <tr className="break-inside-avoid print:break-inside-avoid bg-slate-100 print:bg-slate-50">
                    <th className="w-[30%] border border-slate-300 p-3 text-left whitespace-normal">Identifikasi</th>
                    <th className="w-[30%] border border-slate-300 p-3 text-left whitespace-normal">Refleksi</th>
                    <th className="w-[40%] border border-slate-300 p-3 text-left whitespace-normal">Tindakan Benahi</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(table.data) ? table.data.map((row: any, rIndex: number) => (
                    <tr className="break-inside-avoid print:break-inside-avoid" key={rIndex}>
                      <td className="border border-slate-300 p-3 align-top whitespace-normal">{row['Identifikasi (Identification)'] || row.identification || '-'}</td>
                      <td className="border border-slate-300 p-3 align-top whitespace-normal">{row['Refleksi (Reflection)'] || row.reflection || '-'}</td>
                      <td className="border border-slate-300 p-3 align-top whitespace-normal">{row['Tindakan Benahi (Improvement)'] || row.improvement || '-'}</td>
                    </tr>
                  )) : (
                    <tr className="break-inside-avoid print:break-inside-avoid">
                      <td className="border border-slate-300 p-3 align-top whitespace-normal">{table.data.identification}</td>
                      <td className="border border-slate-300 p-3 align-top whitespace-normal">{table.data.reflection}</td>
                      <td className="border border-slate-300 p-3 align-top whitespace-normal">{table.data.improvement}</td>
                    </tr>
                  )}
                </tbody>
              </table></div>
            ) : table.program || (table.title && table.title.startsWith('Program:')) ? (
              // Program Table
              <div className="mb-8">
                {table.program && <h4 className="text-lg font-bold text-slate-800 mb-2">{table.program}</h4>}
                {table.description && <p className="text-slate-700 text-sm print:text-[12pt] mb-4 text-justify">{table.description}</p>}
                <h5 className="font-bold text-slate-800 text-sm print:text-[12pt] mb-2">Rencana Kegiatan:</h5>
                {table.activities ? table.activities.map((act: any, j: number) => (
                  <div key={j} className="mt-[12pt] mb-[12pt] pl-4 border-l-2 border-slate-200 page-break-inside-avoid">
                    <h5 className="font-bold text-slate-800 text-sm print:text-[12pt] mb-1">{String.fromCharCode(97 + j)}. {act.title}</h5>
                    <p className="text-slate-700 text-sm print:text-[12pt] mb-2">{act.description}</p>
                    {act.data && (
                      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                        <div><span className="font-bold text-slate-800">Output:</span> <span className="text-slate-600">{act.data.output}</span></div>
                        <div><span className="font-bold text-slate-800">Outcome:</span> <span className="text-slate-600">{act.data.outcome}</span></div>
                        <div><span className="font-bold text-slate-800">Impact:</span> <span className="text-slate-600">{act.data.impact}</span></div>
                        <div><span className="font-bold text-slate-800">Risk & Mitigation:</span> <span className="text-slate-600">{act.data.risk} &rarr; {act.data.mitigation}</span></div>
                      </div>
                    )}
                  </div>
                )) : Array.isArray(table.data) ? (
                  <div className="overflow-x-auto print:overflow-visible w-full gdds-table-block print:block">
                    <table className="w-full table-auto text-sm print:text-[12pt] border-collapse border border-slate-300">
                    <thead>
                       <tr className="break-inside-avoid print:break-inside-avoid bg-slate-100 print:bg-slate-50">
                         <th className="w-[25%] border border-slate-300 p-3 text-left whitespace-normal">Kegiatan</th>
                         <th className="w-[45%] border border-slate-300 p-3 text-left whitespace-normal">Deskripsi / Output</th>
                         <th className="w-[15%] border border-slate-300 p-3 text-left whitespace-normal">Jadwal</th>
                         <th className="w-[15%] border border-slate-300 p-3 text-left whitespace-normal">Penanggung Jawab</th>
                       </tr>
                    </thead>
                    <tbody>
                       {table.data.map((row: any, i: number) => (
                         <tr className="break-inside-avoid print:break-inside-avoid" key={i}>
                           <td className="border border-slate-300 p-3 align-top whitespace-normal">{row['Kegiatan (Activity)'] || '-'}</td>
                           <td className="border border-slate-300 p-3 align-top whitespace-normal">{row['Deskripsi / Output'] || '-'}</td>
                           <td className="border border-slate-300 p-3 align-top whitespace-normal">{row['Jadwal Pelaksanaan'] || '-'}</td>
                           <td className="border border-slate-300 p-3 align-top whitespace-normal">{row['Penanggung Jawab'] || '-'}</td>
                         </tr>
                       ))}
                    </tbody>
                  </table></div>
                ) : null}
              </div>
            ) : table.amount !== undefined ? (
              // Budget Table
              <div className="flex justify-between border-b border-slate-200 py-2 page-break-inside-avoid">
                <span>{table.title}</span>
                <span className="font-bold">Rp {table.amount.toLocaleString('id-ID')}</span>
              </div>
            ) : Array.isArray(table.data) ? (
              // Generic Data List (like in Appendix)
              <div className="mt-[12pt] mb-[12pt]">
                <div className="overflow-x-auto print:overflow-visible w-full gdds-table-block print:block">
                  <table className="w-full table-auto border-collapse border border-slate-300 text-sm print:text-[12pt]">
                  <thead>
                    <tr className="break-inside-avoid print:break-inside-avoid bg-slate-100 print:bg-slate-50">
                      {table.data.length > 0 && Object.keys(table.data[0]).map(key => {
                        let widthClass = "";
                        const k = key.toLowerCase();
                        if (k === 'no' || k === 'no.') widthClass = "w-[5%]";
                        else if (k === 'semester' || k === 'kuartal' || k === 'fase') widthClass = "w-[8%]";
                        else if (k.includes('tahun')) widthClass = "w-[12%]";
                        else if (k === 'skor' || k === 'nilai' || k === 'jumlah' || k === 'volume' || k === 'satuan' || k === 'target' || k.includes('jp')) widthClass = "w-[8%]";
                        else if (k.includes('harga') || k.includes('biaya') || k.includes('sumber') || k.includes('anggaran') || k.includes('dana')) widthClass = "w-[12%]";
                        else if (k.includes('kategori') || k.includes('pendekatan') || k.includes('status') || k.includes('prioritas')) widthClass = "w-[10%]";
                        else if (k.includes('program') || k.includes('kegiatan') || k.includes('nama') || k.includes('area') || k.includes('fokus') || k.includes('tanggal') || k.includes('mata pelajaran') || k.includes('sasaran')) widthClass = "w-[20%]";
                        else if (k.includes('uraian') || k.includes('deskripsi') || k.includes('analisis') || k.includes('strategi') || k.includes('indikator') || k.includes('tindak lanjut') || k.includes('keterangan')) widthClass = "w-[35%]";
                        else if (k.includes('jadwal') || k.includes('waktu') || k.includes('bulan')) widthClass = "w-[15%]";
                        else if (k.includes('penanggung') || k.includes('pj') || k.includes('pihak')) widthClass = "w-[12%]";
                        
                        return (
                          <th key={key} className={`${widthClass} border border-slate-300 p-2 text-center align-middle font-bold text-[12pt] capitalize whitespace-normal`}>
                            {key}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      return table.data.map((row: any, i: number) => (
                        <tr className="break-inside-avoid print:break-inside-avoid" key={i}>
                          {Object.keys(table.data[0] || {}).map((key: string, j: number) => {
                             const val = row[key];
                             const k = key.toLowerCase();
                             const isNumericCol = ['no', 'semester', 'kuartal'].includes(k);
                             
                             return (
                               <td key={j} className={`border border-slate-300 p-2 align-top text-[12pt] whitespace-pre-line ${isNumericCol ? "text-center" : "text-left"}`}>
                                 {val == null || val === '' ? '-' : typeof val === 'object' ? '[Nested Data]' : String(val).split(/(\*\*.*?\*\*)/).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part)}
                               </td>
                             );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table></div>
              </div>
            ) : null}
          </div>
          );
        })}
      </div>
      </React.Fragment>
    );
  };

  const renderChapter = (chapter: DocumentChapter, fixedId: string = "") => {
    if (!chapter) return null;
    if (!chapter.title && (!chapter.paragraphs || chapter.paragraphs.length === 0) && (!chapter.sections || chapter.sections.length === 0)) return null;
    const chapterLayout = EnterpriseLayoutRegistry.getLayout(fixedId || chapter.id, title);
    const orientationClass = chapterLayout.orientation === 'landscape' ? 'landscape-section ' : 'portrait-section ';
    
    // Semua chapter dan section utama butuh page break sebelum mereka, kecuali cover
    const needsPageBreak = true;

    return (
      <div key={fixedId || chapter.id} className={`enterprise-page-composer-wrapper block print:break-before-page`} style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
        <div id={`chapter-${fixedId || chapter.id}`} className={`${orientationClass} gdds-page-wrapper`}>
        <EditableRegion id={`chapter-title-${fixedId || chapter.id}`} fallback={chapter.title} as="h2" data-toc-id={fixedId || chapter.id} className="gdds-title-bab" />
        {chapter.subtitle && <EditableRegion id={`chapter-subtitle-${fixedId || chapter.id}`} fallback={chapter.subtitle} as="h3" className="gdds-heading-2 text-center" />}
        {chapter.paragraphs && chapter.paragraphs.filter(p => p.trim() !== "").map((p, idx) => (
          <p key={idx} className="gdds-p whitespace-pre-line">
            {p.split(/(\*\*.*?\*\*)/).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}
          </p>
        ))}
        {chapter.sections && chapter.sections.map((section, idx) => renderSection(section, idx))}
      </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`relative z-10 w-full font-serif text-black print:bg-white print:!p-0 workspace-mode-${state.workspaceMode} ${state.workspaceMode === 'printPreview' ? 'bg-slate-50 py-8' : 'bg-white'}`}>
      
      {/* Cover Page */}
      <div className="enterprise-page-composer-wrapper block print:break-before-auto">
      {/* PERBAIKAN: Flex col, hapus fixed height print agar tidak overflow */}
      <div id="chapter-cover" className={`portrait-section gdds-page-wrapper text-center gdds-cover-layout flex flex-col justify-between overflow-hidden`}>
        
        {/* Top Header */}
        <div className="w-full shrink-0 gdds-cover-top">
           <EditableRegion id="cover-province" as="h3" fallback={`PEMERINTAH ${['SMA', 'SMK', 'SLB'].includes(settings?.school?.level) ? (settings?.school?.province ? (String(settings.school.province).toUpperCase().includes('PROVINSI') ? String(settings.school.province).toUpperCase() : `PROVINSI ${String(settings.school.province).toUpperCase()}`) : "PROVINSI") : (settings?.school?.regency ? (String(settings.school.regency).toUpperCase().includes('KAB') || String(settings.school.regency).toUpperCase().includes('KOTA') ? String(settings.school.regency).toUpperCase() : `KABUPATEN ${String(settings.school.regency).toUpperCase()}`) : "KABUPATEN/KOTA")}`} className="gdds-cover-title-3" />
           <EditableRegion id="cover-regency" as="h3" fallback={settings?.school?.instansi ? String(settings.school.instansi).toUpperCase() : "DINAS PENDIDIKAN"} className="gdds-cover-title-3" />
           <EditableRegion id="cover-school-name" as="h2" fallback={settings?.school?.name || "NAMA SEKOLAH"} className="gdds-cover-title-2" />
        </div>

        {/* Logo & Title */}
        <div className="w-full flex flex-col items-center justify-center grow py-8 gdds-cover-middle">
           {typeof (settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo) === 'string' && (settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo).trim() !== '' ? (
             <img src={settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo} className="w-auto max-w-[10rem] h-auto max-h-32 md:max-h-40 object-contain mb-8" alt="Logo" />
           ) : typeof (settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl) === 'string' && (settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl).trim() !== '' ? (
             <img src={settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl} className="w-auto max-w-[10rem] h-auto max-h-32 md:max-h-40 object-contain mb-8" alt="Logo" />
           ) : (
             <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm print:text-[12pt] mb-8">
               [Logo Instansi]
             </div>
           )}
           
           {/* Document Title */}
           <div className="w-full shrink-0 mt-4">
              {(() => {
                const planningContext = PlanningContextService.getInstance().getContext();
                const planningYearRaw = planningContext.selectedPlanningYear || 'Y1';
                const planningYearNum = planningYearRaw.replace('Y', '');
                const activeYearObj = settings?.academicYears?.find((y: any) => y.isActive);
                const fallbackYear = new Date().getFullYear();
                const baseYearStr = activeYearObj?.name || `${fallbackYear}/${fallbackYear + 1}`;
                const rkjmStartYear = parseInt(baseYearStr.split('/')[0]) || fallbackYear;
                const computedStartYear = rkjmStartYear + (parseInt(planningYearNum) - 1);
                const activeAcademicYear = `${computedStartYear}/${computedStartYear + 1}`;
                
                if (title === 'RKT') {
                  return (
                    <>
                      <EditableRegion id="cover-title-1" as="h1" fallback={"RENCANA KERJA\nTAHUNAN"} type="multiline" className="gdds-cover-title-1" />
                      <EditableRegion id="cover-title-2" as="h2" fallback="(RKT)" className="gdds-cover-title-2" />
                      <EditableRegion id="cover-title-3" as="h3" fallback={`TAHUN KE-${planningYearNum} RKJM`} className="gdds-cover-title-3 mt-12" />
                      <EditableRegion id="cover-title-4" as="h3" fallback={`TAHUN PELAJARAN ${activeAcademicYear}`} className="gdds-cover-title-3" />
                    </>
                  );
                } else if (title?.includes('RKAS') || title?.includes('Anggaran')) {
                  return (
                    <>
                      <EditableRegion id="cover-title-1" as="h1" fallback="RENCANA KEGIATAN DAN ANGGARAN SEKOLAH" type="multiline" className="gdds-cover-title-1" />
                      <EditableRegion id="cover-title-2" as="h2" fallback="(RKAS)" className="gdds-cover-title-2" />
                      <EditableRegion id="cover-title-3" as="h3" fallback="TAHUN ANGGARAN" className="gdds-cover-title-3 mt-12" />
                      <EditableRegion id="cover-title-4" as="h3" fallback={activeAcademicYear} className="gdds-cover-title-3" />
                    </>
                  );
                } else if (title?.includes('Kurikulum') || title?.includes('KSP')) {
                  return (
                    <>
                      <EditableRegion id="cover-title-1" as="h1" fallback="KURIKULUM SATUAN PENDIDIKAN" type="multiline" className="gdds-cover-title-1" />
                      <EditableRegion id="cover-title-2" as="h2" fallback="(KSP)" className="gdds-cover-title-2" />
                      <EditableRegion id="cover-title-3" as="h3" fallback="TAHUN PELAJARAN" className="gdds-cover-title-3 mt-12" />
                      <EditableRegion id="cover-title-4" as="h3" fallback={activeAcademicYear} className="gdds-cover-title-3" />
                    </>
                  );
                } else {
                  return (
                    <>
                      <EditableRegion id="cover-title-1" as="h1" fallback={"RENCANA KERJA\nJANGKA MENENGAH"} type="multiline" className="gdds-cover-title-1" />
                      <EditableRegion id="cover-title-2" as="h2" fallback="(RKJM)" className="gdds-cover-title-2" />
                      <EditableRegion id="cover-title-3" as="h3" fallback="PERIODE" className="gdds-cover-title-3 mt-12" />
                      <EditableRegion id="cover-title-4" as="h3" fallback={`${rkjmStartYear} - ${rkjmStartYear + 4}`} className="gdds-cover-title-3" />
                    </>
                  );
                }
              })()}
           </div>
        </div>

        {/* Bottom Metadata */}
        <div className="w-full shrink-0 gdds-cover-bottom">
           <EditableRegion id="cover-address" as="p" fallback={settings?.school?.address || "Alamat Sekolah"} className="gdds-cover-text font-bold" />
           <p className="gdds-cover-text font-bold">NPSN: <EditableRegion id="cover-npsn" fallback={settings?.school?.npsn || "-"} /></p>
           <EditableRegion id="cover-location" as="p" fallback={`Kecamatan ${settings?.school?.district || "-"}, ${settings?.school?.regency || "-"}, Provinsi ${settings?.school?.province || "-"}`} className="gdds-cover-text font-bold" />
        </div>
      </div>
      </div>

      {/* Approval Page */}
      {title?.includes('RKAS') || title?.includes('Anggaran') ? (
        renderChapter(document.approval)
      ) : (
      <>
      <div className="enterprise-page-composer-wrapper block print:break-before-page" style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
      <div id="chapter-approval" className={`portrait-section gdds-page-wrapper`}>
         <h3 data-toc-id="chapter-approval" className="gdds-title-doc">LEMBAR PENGESAHAN</h3>
         <p className="gdds-p">
           Dokumen {title} {settings?.school?.name || "sekolah"} ini disusun berdasarkan hasil analisis Rapor Pendidikan dan kondisi nyata sekolah.
           Setelah melalui proses pembahasan dan pertimbangan oleh seluruh pemangku kepentingan, maka dokumen ini disahkan dan disetujui untuk digunakan sebagai pedoman penyelenggaraan pendidikan di {settings?.school?.name || "sekolah"}.
         </p>
         
         <div className={DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? "print-no-break page-break-inside-avoid" : ""} style={DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? { pageBreakInside: 'avoid', breakInside: 'avoid' } : {}}>
           <div className="flex justify-end mt-12 pr-8">
             <p className="text-slate-900">{settings?.school?.district || "Kecamatan"}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </div>
           <div className="gdds-signature-grid">
             <div className="gsls-signature-cell center">
               <div className="gsls-signature-content"><div className="gsls-role-block"><p className="text-slate-800 m-0 leading-snug">Menyetujui,<br/>Ketua Komite Sekolah</p></div><div className="gsls-signature-space"></div><div className="gsls-identity-block"><EditableRegion id="approval-committee-name" fallback={settings?.komite?.name || "Nama Ketua Komite"} as="p" className="gdds-signature-name" /></div></div>
             </div>
             
             <div className="gsls-signature-cell center">
               <div className="gsls-signature-content"><div className="gsls-role-block"><p className="text-slate-800 m-0 leading-snug">Mengesahkan,<br/>Kepala Sekolah</p></div><div className="gsls-signature-space"></div><div className="gsls-identity-block"><EditableRegion id="approval-principal-name" fallback={settings?.principal?.name || "Nama Kepala Sekolah"} as="p" className="gdds-signature-name" />
               <p className="text-slate-800 m-0 leading-snug">NIP. <EditableRegion id="approval-principal-nip" fallback={settings?.principal?.nip || "-"} /></p></div></div>
             </div>
           </div>
           
           {settings?.pengawas?.name && (
             <div className="gdds-signature-grid" style={{ gridTemplateColumns: '1fr' }}>
               <div className="gsls-signature-cell center">
                 <div className="gsls-signature-content"><div className="gsls-role-block"><p className="text-slate-800 m-0 leading-snug">Mengetahui,<br/>Pengawas Sekolah</p></div><div className="gsls-signature-space"></div><div className="gsls-identity-block"><EditableRegion id="approval-pengawas-name" fallback={settings.pengawas.name} as="p" className="gdds-signature-name" />
                 <p className="text-slate-800 m-0 leading-snug">NIP. <EditableRegion id="approval-pengawas-nip" fallback={settings.pengawas.nip || "-"} /></p></div></div>
               </div>
             </div>
           )}
         </div>
      </div>
      </div>
      </>
      )}

      {/* Table of Contents */}
      <div className="enterprise-page-composer-wrapper block print:break-before-page" style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
      <div id="chapter-toc" className={`portrait-section gdds-page-wrapper`}>
        <EditableRegion id="toc-title" fallback={document.toc.title} as="h3" data-toc-id="chapter-toc" className="gdds-title-doc" />
        <div className="w-full mx-auto text-slate-800">
          <div className="mb-2">
            <div className="gdds-toc-layout">
              <span className="font-bold text-slate-900">LEMBAR PENGESAHAN</span>
              <div className="gdds-toc-leader"></div>
              <span className="gdds-toc-page font-bold text-slate-900">{pageNumbers['chapter-approval'] || 'i'}</span>
            </div>
          </div>
          <div className="mb-6">
            <div className="gdds-toc-layout">
              <span className="gdds-toc-title font-bold text-slate-900 uppercase">{document.toc.title}</span>
              <div className="gdds-toc-leader"></div>
              <span className="gdds-toc-page font-bold text-slate-900">{pageNumbers['chapter-toc'] || 'ii'}</span>
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
              <div className="gdds-toc-layout mt-4">
                <span className="gdds-toc-title font-bold text-slate-900 uppercase">{chapter.title}</span>
                <div className="gdds-toc-leader"></div>
                <span className="gdds-toc-page font-bold text-slate-900">{pageNumbers[i === 0 ? "bab1" : i === 1 ? "bab2" : i === 2 ? "bab3" : i === 3 ? "bab4" : i === 4 ? "bab5" : "lampiran"] || '-'}</span>
              </div>
              {chapter.sections && chapter.sections.length > 0 && (
                <div className="pl-6 mt-2">
                  {chapter.sections.map((section, j) => section.title && (
                    <div key={section.id} className="gdds-toc-layout">
                      <span className="gdds-toc-title text-slate-800">{section.title}</span>
                      <div className="gdds-toc-leader"></div>
                      <span className="gdds-toc-page text-slate-700">{pageNumbers[section.id] || '-'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* PERBAIKAN TOTAL: Blok Style untuk Print */}
      <style>{`
        /* 1. KUNCI UTAMA: Atur Kertas dan Matikan Margin Browser */
        @media print {
          @page {
            size: A4 portrait;
            margin: 3cm 3cm 3cm 4cm !important; 
          }
          
          @page landscape-page {
            size: A4 landscape;
            margin: 3cm !important;
          }
          
          body, html {
            width: 100%;
            height: auto;
            background: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hilangkan override yang merusak dimensi */
          #printable-doc-export, #printable-doc-preview {
            transform: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
        
        /* 2. Definisi Kertas A4 yang Benar */
        .portrait-section {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding-top: 3cm;
          padding-bottom: 3cm;
          padding-left: 4cm;
          padding-right: 3cm;
          background: white;
          box-sizing: border-box;
          position: relative;
        }
        
        .landscape-section {
          width: 297mm;
          min-height: 210mm;
          margin: 0 auto;
          padding-top: 3cm;
          padding-bottom: 3cm;
          padding-left: 3cm;
          padding-right: 3cm;
          background: white;
          box-sizing: border-box;
          position: relative;
        }

        @media print {
          .portrait-section {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            min-height: auto !important; 
            height: auto !important;
          }
          .landscape-section {
            page: landscape-page;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            min-height: auto !important; 
            height: auto !important;
          }

          /* Khusus Cover pastikan tinggi 1 halaman pas */
          #chapter-cover.portrait-section {
            height: 237mm !important; /* A4 297mm - 6cm margins */
            min-height: 237mm !important;
          }
        }
        
        /* Efek Bayangan Hanya untuk Preview Layar */
        .workspace-mode-printPreview .portrait-section,
        .workspace-mode-printPreview .landscape-section {
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          border: 1px solid #cbd5e1;
          margin-bottom: 2rem;
        }

        /* 3. PERBAIKAN TABEL AGAR PROFESIONAL SAAT DI-PRINT */
        table {
          page-break-inside: auto;
          border-collapse: collapse;
          width: 100%;
        }
        
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        
        thead {
          display: table-header-group;
        }
        
        tfoot {
          display: table-footer-group;
        }
        
        .signature-block, img {
          page-break-inside: avoid;
        }

        /* 4. Utilities untuk mencegah teks terpotong */
        .page-break-inside-avoid {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      `}</style>

      <div className="hidden print:hidden print-header">
        <span className="font-bold">{settings?.school?.name || "Nama Sekolah"}</span>
        <span className="uppercase">{title}</span>
      </div>

      {/* Dynamic Chapters */}
      <div className="print:mt-0">
        {renderChapter(document.chapter1, "bab1")}
        {renderChapter(document.chapter2, "bab2")}
        {renderChapter(document.chapter3, "bab3")}
        {renderChapter(document.chapter4, "bab4")}
        {renderChapter(document.chapter5, "bab5")}
        {renderChapter(document.appendix, "lampiran")}
      </div>

      <div className="hidden print:hidden print-footer">
      </div>
    </div>
  );
};

export const EnterpriseDocumentViewer: React.FC<EnterpriseDocumentViewerProps> = (props) => {
  return (
    // PERBAIKAN: Hapus kelas flex yang memaksa tinggi (h-full) pada saat cetak
    <div className="flex flex-col min-h-screen w-full print:block print:h-auto print:min-h-0">
      <div className="flex-1 bg-slate-50 relative print:block">
        <EnterpriseDocumentViewerContent {...props} />
      </div>
    </div>
  );
};