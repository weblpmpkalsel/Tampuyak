const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

const newBlockRendererStart = `const BlockRenderer: React.FC<{ block: DocumentBlock; selectedNodeId: string | null; onSelectNode: (id: string) => void; isCover: boolean; isTOC: boolean; isApproval: boolean; tocLevel?: number; overrides: Record<string, string>; onSaveOverride?: (id: string, val: string) => void }> = ({ block, selectedNodeId, onSelectNode, isCover, isTOC, isApproval, tocLevel = 1, overrides, onSaveOverride }) => {
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

  const baseClasses = \`transition-colors cursor-pointer border border-transparent hover:border-blue-200 relative \${isSelected ? 'bg-blue-50 border-blue-400' : ''}\`;

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="p-4 bg-white border border-blue-400 shadow-md rounded-md print:hidden my-2 z-50 relative">
          <textarea 
            className="w-full min-h-[100px] p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-sans text-sm"
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
        const HeadingTag = \`h\${Math.min(Math.max(level, 1), 6)}\` as any;
        
        let sizeClass = '';
        if (isCover) {
          if (level === 1) sizeClass = 'font-bold text-3xl tracking-widest my-2';
          else if (level === 2) sizeClass = 'font-bold text-xl tracking-wide my-1';
          else if (level === 3) sizeClass = 'font-bold text-lg my-1';
          else sizeClass = 'font-bold text-base my-1';
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
          <HeadingTag className={\`\${sizeClass} \${alignClass} text-black\`}>
            {isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as HeadingBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </HeadingTag>
        );
      case 'PARAGRAPH':
        if (isTOC) {
          const hasLink = (block as ParagraphBlock).nodes.some(n => n.type === 'LINK');
          if (hasLink) {
             const marginLeft = tocLevel === 2 ? '1cm' : '0';
             const fontWeight = tocLevel === 1 ? 'font-bold' : 'font-normal';
             return (
               <div className="gdds-toc-row" style={{ marginLeft }}>
                 <span className={\`\${fontWeight} flex-shrink-0\`}>
                   {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                 </span>
                 <div className="gdds-toc-dots"></div>
                 <span className={\`\${fontWeight}\`}></span>
               </div>
             )
          }
        }
        
        let pClass = isCover || isApproval ? 'gdds-p-no-indent text-center' : 'gdds-p';
        if (isApproval) pClass = 'gdds-p-no-indent text-center';
        if (block.id.startsWith('gsls-signature')) {
          pClass = 'gdds-p-no-indent'; 
          if (block.id.includes('-name')) {
            pClass += ' gsls-signature-name';
          }
        }
        
        const style: React.CSSProperties = {};
        if (profile.paragraphSpacing && !block.id.startsWith('gsls-signature')) {
          style.marginBottom = \`\${profile.paragraphSpacing}pt\`;
        }
        return (
          <p className={pClass} style={style}>
            {isEditable && overrides[block.id] !== undefined ? overrides[block.id] : (block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </p>
        );`;

// We'll just replace the whole BlockRenderer start until `case 'LIST':`
const regex = /const BlockRenderer: React\.FC<\{ block: DocumentBlock;[\s\S]*?case 'LIST':/;
code = code.replace(regex, newBlockRendererStart + "\n      case 'LIST':");

// We also need to add the hover edit button wrap at the bottom of BlockRenderer
const endRegex = /  return \(\n    <div id=\{block\.id\} className=\{baseClasses\} onClick=\{\(e\) => \{ e\.stopPropagation\(\); onSelectNode\(block\.id\); \}\}>\n      \{renderContent\(\)\}\n    <\/div>\n  \);\n\};/;
const newEnd = `  return (
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
};`;
code = code.replace(endRegex, newEnd);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', code);
console.log("Patched BlockRenderer for inline editing");
