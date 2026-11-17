import React from 'react';
import { LayoutProfileContext, LayoutProfile, defaultLayoutProfile } from './LayoutProfile';
import { FallbackPaginationEngine } from "../../document/engine/FallbackPaginationEngine";
import { CanonicalDocument, DocumentSection, DocumentBlock, DocumentNode, HeadingBlock, ParagraphBlock, TableBlock, ListBlock, ImageBlock, AttachmentBlock, ContainerBlock, TimelineBlock, CalendarGridBlock } from '../../document/CanonicalDocumentTypes';

interface CanonicalRendererProps {
  overrides?: Record<string, string>;
  onSaveOverride?: (blockId: string, newText: string) => void;
  document: CanonicalDocument;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  scale: number;
  layoutProfile?: LayoutProfile;
}

const normalizeChapterId = (id?: string) => {
  if (!id) return '';
  return id.toLowerCase().replace('front_matter_', '');
};

const CalendarGridComponent: React.FC<{ block: CalendarGridBlock }> = ({ block }) => {
  // Determine start year and month. Typically Academic Year starts in July.
  let startYear = new Date().getFullYear();
  if (block.academicYear) {
    const match = block.academicYear.match(/(\d{4})/);
    if (match) startYear = parseInt(match[1]);
  }
  
  const months = [
    { name: 'JULI', month: 6, year: startYear },
    { name: 'AGUSTUS', month: 7, year: startYear },
    { name: 'SEPTEMBER', month: 8, year: startYear },
    { name: 'OKTOBER', month: 9, year: startYear },
    { name: 'NOVEMBER', month: 10, year: startYear },
    { name: 'DESEMBER', month: 11, year: startYear },
    { name: 'JANUARI', month: 0, year: startYear + 1 },
    { name: 'FEBRUARI', month: 1, year: startYear + 1 },
    { name: 'MARET', month: 2, year: startYear + 1 },
    { name: 'APRIL', month: 3, year: startYear + 1 },
    { name: 'MEI', month: 4, year: startYear + 1 },
    { name: 'JUNI', month: 5, year: startYear + 1 },
  ];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const getEventColor = (type: string) => {
    switch (type) {
      case 'NATIONAL_HOLIDAY': return 'bg-red-500 text-white';
      case 'REGIONAL_HOLIDAY': return 'bg-orange-500 text-white';
      case 'SCHOOL_HOLIDAY': return 'bg-yellow-400 text-black';
      case 'ASSESSMENT': return 'bg-blue-400 text-white';
      case 'PROJECT_WEEK': return 'bg-green-500 text-white';
      case 'REPORT_DISTRIBUTION': return 'bg-slate-800 text-white';
      case 'SEMESTER_BOUNDARY': return 'bg-purple-500 text-white';
      case 'MPLS': return 'bg-lime-400 text-black';
      case 'SCHOOL_EVENT': return 'bg-cyan-500 text-white';
      default: return 'bg-white text-slate-800';
    }
  };

  const getEventForDate = (dateStr: string) => {
    return block.events.find(e => {
      if (e.endDate) {
        return dateStr >= e.date && dateStr <= e.endDate;
      }
      return e.date === dateStr;
    });
  };

  const renderMonth = (monthData: typeof months[0]) => {
    const daysInMonth = getDaysInMonth(monthData.month, monthData.year);
    const firstDay = getFirstDayOfMonth(monthData.month, monthData.year);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center p-1 border border-slate-200"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const event = getEventForDate(dateStr);
      const isSunday = new Date(monthData.year, monthData.month, i).getDay() === 0;
      
      let className = "text-center p-1 border border-slate-300 font-medium text-xs md:text-sm";
      if (event) {
        className += ` ${getEventColor(event.type)}`;
      } else if (isSunday) {
        className += " bg-red-500 text-white";
      } else {
        className += " bg-white text-slate-800";
      }

      days.push(
        <div key={`day-${i}`} className={className}>
          {i}
        </div>
      );
    }

    return (
      <div key={monthData.name} className="w-full break-inside-avoid mb-6">
        <h4 className="text-center font-bold mb-2 text-sm">BULAN : {monthData.name} {monthData.year}</h4>
        <div className="grid grid-cols-7 gap-0 border-t border-l border-slate-300">
          {['MING', 'SEN', 'SEL', 'RABU', 'KMS', 'JUM', 'SAB'].map((d, idx) => (
            <div key={d} className={`text-center font-bold text-xs p-1 border-r border-b border-slate-300 ${idx === 0 ? 'bg-red-500 text-white' : 'bg-white'}`}>{d}</div>
          ))}
          {days.map((day, idx) => (
            <div key={idx} className="border-r border-b border-slate-300">
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="my-8 print-no-break page-break-inside-avoid">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {months.map(renderMonth)}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="font-bold mb-2 col-span-full">Keterangan:</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500"></div> Libur Nasional / Minggu</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500"></div> Libur Daerah</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400"></div> Libur Semester / Sekolah</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400"></div> Penilaian / Asesmen</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500"></div> Pelaksanaan Kokurikuler / P5</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-800"></div> Penyerahan Rapor</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500"></div> Awal / Akhir Semester</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-lime-400"></div> MPLS</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-cyan-500"></div> Kegiatan Sekolah Lainnya</div>
      </div>
    </div>
  );
};

export const CanonicalRenderer: React.FC<CanonicalRendererProps> = ({ document, selectedNodeId, onSelectNode, scale, layoutProfile, overrides = {}, onSaveOverride }) => {
  const pageNumbers = FallbackPaginationEngine.estimatePages(document);
  const isKsp = document.metadata?.title?.includes('KSP') || document.metadata?.title?.includes('Kurikulum');

  return (
    <LayoutProfileContext.Provider value={layoutProfile || defaultLayoutProfile}>
    <div id="printable-doc-export" className="flex flex-col gap-12 print:block print:gap-0 pb-24 print:pb-0 items-center w-full">
      {document.sections.map((section, index) => {
        const normalizedId = normalizeChapterId(section.chapterId || section.id);
        return (
          <SectionRenderer overrides={overrides} onSaveOverride={onSaveOverride}
            key={section.id}
            section={section}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            scale={scale}
            isCover={normalizedId === 'cover' || normalizedId === 'chapter-cover'}
            isTOC={normalizedId === 'toc' || normalizedId === 'chapter-toc'}
            isApproval={normalizedId === 'approval' || normalizedId === 'chapter-approval'}
            isFirst={index === 0}
            isKsp={isKsp}
            pageNumbers={pageNumbers}
          />
        );
      })}
    </div>
    </LayoutProfileContext.Provider>
  );
};

const SectionRenderer: React.FC<{ pageNumbers?: any; section: DocumentSection; selectedNodeId: string | null; onSelectNode: (id: string) => void; scale: number; isCover: boolean; isTOC: boolean; isApproval: boolean; isFirst?: boolean; isKsp?: boolean; overrides: Record<string, string>; onSaveOverride?: (id: string, val: string) => void }> = ({ section, selectedNodeId, onSelectNode, scale, isCover, isTOC, isApproval, isFirst, isKsp, overrides, onSaveOverride, pageNumbers }) => {
  const profile = React.useContext(LayoutProfileContext);
  // Determine top margin based on GDDS (4cm for chapter start, 3cm otherwise - we'll just use 3cm for now, or 4cm for BAB)
  
  const normalizedId = normalizeChapterId(section.chapterId || section.id);
  const needsPageBreak = !isFirst;

  return (
    <div className={`enterprise-page-composer-wrapper block ${needsPageBreak ? 'print:break-before-page' : 'print:break-before-auto'}`} style={needsPageBreak ? { pageBreakBefore: 'always', breakBefore: 'page' } : {}}>
    <div
      id={section.id}
      className={`bg-white shadow-lg print:shadow-none gdds-doc portrait-section w-[210mm] print:w-full ${isTOC ? 'min-h-fit print:min-h-0' : 'min-h-[297mm] print:min-h-0'} mx-auto box-border ${isCover ? 'text-center gdds-cover-layout print:h-[237mm] p-0' : 'pt-[3cm] pb-[3cm] pl-[4cm] pr-[3cm] print:p-0'}`}
    >
      <div className={`text-gray-900 print:text-black ${isCover ? 'text-center h-full flex flex-col justify-between pt-[3cm] pb-[3cm] pl-[3cm] pr-[3cm] print:p-8' : ''}`} >
        {isFirst || isCover ? null : <div className="absolute bottom-6 left-0 right-0 text-center text-sm print:text-[12pt] font-serif print:block">{pageNumbers?.[section.chapterId] || ''}</div>}
        {section.blocks.map((block) => (
          <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} 
            key={block.id} 
            block={block} 
            selectedNodeId={selectedNodeId} 
            onSelectNode={onSelectNode} 
            isCover={isCover}
            isTOC={isTOC}
            isApproval={isApproval}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

const BlockRenderer: React.FC<{ block: DocumentBlock; selectedNodeId: string | null; onSelectNode: (id: string) => void; isCover: boolean; isTOC: boolean; isApproval: boolean; tocLevel?: number; overrides: Record<string, string>; onSaveOverride?: (id: string, val: string) => void; pageNumbers?: Record<string, string> }> = ({ block, selectedNodeId, onSelectNode, isCover, isTOC, isApproval, tocLevel = 1, overrides, onSaveOverride, pageNumbers }) => {
  const profile = React.useContext(LayoutProfileContext);
  const isSelected = selectedNodeId === block.id;
  const [isHovered, setIsHovered] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  
  let originalText = '';
  const isEditable = (block.type === 'PARAGRAPH' || block.type === 'HEADING') && !isCover && !isTOC && !isApproval && !block.id.startsWith('gsls-signature');
  
  if (isEditable) {
    if (block.type === 'PARAGRAPH') {
      originalText = (block as any).nodes.map((n: any) => n.type === 'TEXT' ? n.text : '').join('');
    } else if (block.type === 'HEADING') {
      originalText = (block as any).nodes.map((n: any) => n.type === 'TEXT' ? n.text : '').join('');
    }
  }
  
  const effectiveText = overrides[block.id] !== undefined ? overrides[block.id] : originalText;
  const [editText, setEditText] = React.useState(effectiveText);

  React.useEffect(() => {
    setEditText(effectiveText);
  }, [effectiveText]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editText.trim()) {
      alert("Teks tidak boleh kosong.");
      return;
    }
    if (onSaveOverride) {
      onSaveOverride(block.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditText(effectiveText);
    setIsEditing(false);
  };

  const baseClasses = `transition-colors cursor-pointer border border-transparent hover:border-blue-200 relative ${isSelected ? 'bg-blue-50 border-blue-400' : ''}`;

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="p-4 bg-white border border-blue-400 shadow-md rounded-md print:hidden my-2 z-50 relative">
          <textarea maxLength={2000} 
            className="w-full min-h-[100px] p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-sans text-sm print:text-[12pt]"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded border border-gray-300" onClick={handleCancel}>Batal</button>
            <button className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded" onClick={handleSave}>Simpan Perubahan</button>
          </div>
        </div>
      );
    }

    switch (block.type) {
      case 'HEADING':
        const level = (block as HeadingBlock).level;
        const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}` as any;
        
        if (block.layoutStyle === 'TOC_TITLE') return <HeadingTag className="gdds-title-doc">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as HeadingBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</HeadingTag>;
        if (block.layoutStyle === 'CARD_TITLE') return <HeadingTag className="text-lg font-bold text-slate-800 mb-2">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as HeadingBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</HeadingTag>;
        if (block.layoutStyle === 'CARD_SECTION_HEADING') return <HeadingTag className="font-bold text-slate-800 text-sm print:text-[12pt] mb-2">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as HeadingBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</HeadingTag>;
        if (block.layoutStyle === 'CARD_ITEM_TITLE') return <HeadingTag className="font-bold text-slate-800 text-sm print:text-[12pt] mb-1">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as HeadingBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</HeadingTag>;
        
        let sizeClass = '';
        if (isCover) {
          if (level === 1) sizeClass = 'gdds-cover-title-1';
          else if (level === 2) sizeClass = 'gdds-cover-title-2';
          else if (level === 3) sizeClass = 'gdds-cover-title-3';
          else sizeClass = 'gdds-cover-text';
        } else {
          if (level === 1) sizeClass = 'gdds-title-bab';
          else if (level === 2) sizeClass = 'gdds-heading-2';
          else sizeClass = 'gdds-heading-3';
        }
        
        let alignClass = '';
        if (isCover || isApproval) {
          alignClass = 'text-center uppercase';
        }
        
        return (
          <HeadingTag className={`${sizeClass} ${alignClass} text-black`}>
            {isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as HeadingBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </HeadingTag>
        );
      case 'PARAGRAPH':
        if (block.layoutStyle === 'SIGNATURE_ROLE') return <p className="text-slate-800 m-0 leading-snug whitespace-pre-line">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</p>;
        if (block.layoutStyle === 'SIGNATURE_NAME') return <p className="gdds-signature-name">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</p>;
        if (block.layoutStyle === 'SIGNATURE_NIP') return <p className="text-slate-800 m-0 leading-snug">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</p>;
        
        if (block.layoutStyle === 'CARD_DESC') return <p className="text-slate-700 text-sm print:text-[12pt] mb-4 text-justify">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</p>;
        if (block.layoutStyle === 'CARD_ITEM_DESC') return <p className="text-slate-700 text-sm print:text-[12pt] mb-2">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</p>;
        if (block.layoutStyle === 'METRIC_LABEL') return <span className="font-bold text-slate-800 mr-1">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</span>;
        if (block.layoutStyle === 'METRIC_VALUE') return <span className="text-slate-600">{isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}</span>;
        
        if (block.layoutStyle === 'TOC_ITEM_LEVEL_1' || block.layoutStyle === 'TOC_ITEM_LEVEL_2') {
          const hasLink = (block as ParagraphBlock).nodes.some(n => n.type === 'LINK');
          if (hasLink) {
             const refId = ((block as ParagraphBlock).nodes.find(n => n.type === 'LINK') as any)?.url;
             const marginLeft = block.layoutStyle === 'TOC_ITEM_LEVEL_2' ? '1cm' : '0';
             const fontWeight = block.layoutStyle === 'TOC_ITEM_LEVEL_1' ? 'font-bold' : 'font-normal';
             return (
               <div className="gdds-toc-layout" style={{ marginLeft }}>
                 <span className={`gdds-toc-title ${fontWeight}`}>
                   {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                 </span>
                 <div className="gdds-toc-leader"></div>
                 <span className={`gdds-toc-page ${fontWeight}`}>{pageNumbers?.[refId] || ''}</span>
               </div>
             )
          }
        }
        
        let pClass = isCover ? 'gdds-cover-text' : isApproval ? 'gdds-p-no-indent text-center' : 'gdds-p';
        if (isApproval) pClass = 'gdds-p-no-indent text-center';
        if (block.id.startsWith('gsls-signature')) {
          pClass = 'gdds-p-no-indent'; 
          if (block.id.includes('-name')) {
            pClass += ' gsls-signature-name';
          }
        }
        
        const style: React.CSSProperties = {};
        if (profile.paragraphSpacing && !block.id.startsWith('gsls-signature')) {
          style.marginBottom = `${profile.paragraphSpacing}pt`;
        }
        return (
          <p className={pClass} style={style}>
            {isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </p>
        );
      case 'LIST':
        const ListTag = (block as ListBlock).ordered ? 'ol' : 'ul';
        return (
          <ListTag className={`gdds-list ${((block as ListBlock).ordered) ? 'list-decimal' : 'list-disc'}`}>
            {(block as ListBlock).items.map((item) => (
              <li key={item.id} className="gdds-list-item">
                {item.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
              </li>
            ))}
          </ListTag>
        );
      case 'TABLE': {
        const tableBlock = block as TableBlock;
        const isFixed = tableBlock.columnStrategy === 'fixed' || tableBlock.columnStrategy === 'proportional';
        return (
          <div className="overflow-x-auto print:overflow-visible w-full gdds-table-block print:block mb-4">
            <table className={`w-full border-collapse border border-black text-sm print:text-[12pt] print:text-[12pt] ${isFixed ? 'table-fixed' : 'table-auto'}`}>
            <thead>
              {tableBlock.head.map((row) => (
                <tr key={row.id} className="bg-gray-200 break-inside-avoid print:break-inside-avoid">
                  {row.cells.map((cell, idx) => {
                    const widthStyle = tableBlock.columnWidths && tableBlock.columnWidths[idx] ? { width: tableBlock.columnWidths[idx] } : {};
                    return (
                      <th key={cell.id} colSpan={cell.colSpan} rowSpan={cell.rowSpan} className="border border-black p-1.5 text-center font-bold align-middle break-words whitespace-normal min-w-[30px]" style={widthStyle}>
                        {cell.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {tableBlock.body.map((row) => (
                <tr key={row.id} className="break-inside-avoid print:break-inside-avoid">
                  {row.cells.map(cell => (
                    <td key={cell.id} colSpan={cell.colSpan} rowSpan={cell.rowSpan} className="border border-black p-1.5 align-top break-words whitespace-normal min-w-[30px]">
                      {cell.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table></div>
        );
      }
      case 'IMAGE': {
        const imageUrl = (block as ImageBlock).url;
        if (typeof imageUrl !== 'string' || imageUrl.trim() === '') return null;
        
        if (isCover) {
          return (
            <img src={imageUrl} alt={(block as ImageBlock).altText} className="w-32 md:w-40 h-auto object-contain" style={{ transform: `scale(${profile.coverLogoScale || 1})` }} />
          );
        }
        return (
          <div className="gdds-image-block print-no-break">
            <img src={imageUrl} alt={(block as ImageBlock).altText} className="w-32 h-auto" />
          </div>
        );
      }
      case 'ATTACHMENT':
        return (
          <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg gdds-attachment-block">
            <div className="text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </div>
            <div>
              <p className="font-medium text-sm print:text-[12pt]">{(block as AttachmentBlock).filename}</p>
              <p className="text-xs text-gray-500">{(block as AttachmentBlock).uri}</p>
            </div>
          </div>
        );
      case 'PAGE_BREAK':
        return (
          <div className="break-after-page print:break-after-page" style={{ pageBreakAfter: 'always', breakAfter: 'page' }}></div>
        );
      case 'CONTAINER':
        switch (block.layoutStyle) {
          case 'COVER_MAIN':
            return (
              <div className="flex flex-col items-center w-full h-full justify-between">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'COVER_MIDDLE':
            return (
              <div className="flex flex-col items-center w-full gdds-cover-middle grow justify-center py-8">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'COVER_BOTTOM':
            return (
              <div className="flex flex-col items-center w-full gdds-cover-bottom pb-8 shrink-0 mt-16">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'COVER_LOGOS':
            return (
              <div className="gdds-cover-logos print-no-break">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'TOC_CONTAINER':
            return (
              <div className="flex flex-col">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'SIGNATURE_GRID':
            return (
             <div className="print-no-break page-break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
               <div className="gdds-signature-grid">
                 {(block as ContainerBlock).blocks.map(b => (
                   <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                 ))}
               </div>
             </div>
            );
          case 'SIGNATURE_CELL':
          case 'SIGNATURE_CELL_RIGHT':
            return (
              <div className={`gsls-signature-cell ${block.layoutStyle === 'SIGNATURE_CELL_RIGHT' ? 'right' : 'center'} print-no-break`}>
                <div className="gsls-signature-content">
                  <div className="gsls-role-block">
                    {(block as ContainerBlock).blocks.filter(b => b.layoutStyle === 'SIGNATURE_ROLE').map(b => (
                      <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                    ))}
                  </div>
                  <div className="gsls-signature-space" style={profile.approvalSignatureHeight ? { height: `${profile.approvalSignatureHeight}cm` } : undefined}></div>
                  <div className="gsls-identity-block">
                    {(block as ContainerBlock).blocks.filter(b => b.layoutStyle !== 'SIGNATURE_ROLE').map(b => (
                      <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                    ))}
                  </div>
                </div>
              </div>
            );
          case 'CARD_CONTAINER':
            return (
              <div className="mb-8">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'CARD_ITEM_CONTAINER':
            return (
              <div className="mt-[12pt] mb-[12pt] pl-4 border-l-2 border-slate-200 page-break-inside-avoid">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'METRICS_GRID':
            return (
              <div className="grid grid-cols-2 gap-4 text-xs print:text-[11pt] bg-slate-50 p-3 rounded border border-slate-200">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          case 'METRIC_ITEM':
            return (
              <div>
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
          default:
            if (isTOC) {
              return (
                <div className="flex flex-col">
                  {(block as ContainerBlock).blocks.map((b, idx) => (
                    <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} tocLevel={idx === 0 ? 1 : 2} pageNumbers={pageNumbers} />
                  ))}
                </div>
              );
            }
            return (
              <div className="flex flex-col">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride} key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} pageNumbers={pageNumbers} />
                ))}
              </div>
            );
        }
      case 'TIMELINE': {
        const timelineBlock = block as TimelineBlock;
        return (
          <div className="w-full my-4 border-l-2 border-slate-300 ml-4 print:ml-2">
            {timelineBlock.items.map((item) => (
              <div key={item.id} className="mb-4 relative pl-4 break-inside-avoid print:break-inside-avoid">
                <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-white ${item.itemStyle === 'milestone' ? 'bg-blue-600' : item.itemStyle === 'deadline' ? 'bg-red-500' : 'bg-slate-500'}`} />
                <div className="text-sm print:text-[12pt] text-slate-500 font-semibold">
                  {item.start} {item.end ? `- ${item.end}` : ''}
                </div>
                <div className="font-bold text-slate-800">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-sm print:text-[12pt] text-slate-600 mt-1">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      case 'CALENDAR_GRID':
        return <CalendarGridComponent block={block as CalendarGridBlock} />;
      default:
        return <div>Unknown Block Type</div>;
    }
  };

  return (
    <div 
      id={block.id} 
      className={baseClasses} 
      onClick={(e) => { e.stopPropagation(); onSelectNode(block.id); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderContent()}
      {isEditable && isHovered && !isEditing && (
        <button 
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          className="absolute top-0 right-0 m-1 px-2 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded shadow-sm hover:bg-blue-50 print:hidden z-10"
        >
          Edit
        </button>
      )}
    </div>
  );
};

const NodeRenderer: React.FC<{ node: DocumentNode }> = ({ node }) => {
  if (node.type === 'TEXT') {
    return <span id={node.id}>{node.text}</span>;
  }
  if (node.type === 'LINK') {
    return (
      <a id={node.id} href={'#' + node.url} className="text-black hover:underline cursor-pointer">
        {node.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
      </a>
    );
  }
  return null;
};
