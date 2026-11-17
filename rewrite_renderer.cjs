const fs = require('fs');

let content = `import React from 'react';
import { CanonicalDocument, DocumentSection, DocumentBlock, DocumentNode, HeadingBlock, ParagraphBlock, TableBlock, ListBlock, ImageBlock, AttachmentBlock, ContainerBlock } from '../../document/CanonicalDocumentTypes';

interface CanonicalRendererProps {
  document: CanonicalDocument;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  scale: number;
}

export const CanonicalRenderer: React.FC<CanonicalRendererProps> = ({ document, selectedNodeId, onSelectNode, scale }) => {
  return (
    <div className="flex flex-col gap-12 pb-24 items-center bg-gray-100 p-8 min-h-screen">
      {document.sections.map((section, index) => (
        <SectionRenderer
          key={section.id}
          section={section}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          scale={scale}
          isCover={section.chapterId === 'COVER'}
          isTOC={section.chapterId === 'TOC'}
          isApproval={section.chapterId === 'APPROVAL'}
        />
      ))}
    </div>
  );
};

const SectionRenderer: React.FC<{ section: DocumentSection; selectedNodeId: string | null; onSelectNode: (id: string) => void; scale: number; isCover: boolean; isTOC: boolean; isApproval: boolean }> = ({ section, selectedNodeId, onSelectNode, scale, isCover, isTOC, isApproval }) => {
  // Determine top margin based on GDDS (4cm for chapter start, 3cm otherwise - we'll just use 3cm for now, or 4cm for BAB)
  const topMargin = section.chapterId.startsWith('BAB_') ? 4 : 3;

  return (
    <div
      id={section.id}
      className={\`bg-white shadow-lg print:shadow-none gdds-doc page-break-after \${isCover ? 'flex flex-col justify-center' : ''}\`}
      style={{
        width: \`\${210 * scale}mm\`,
        minHeight: \`\${297 * scale}mm\`,
        paddingTop: \`\${topMargin * scale}cm\`,
        paddingBottom: \`\${3 * scale}cm\`,
        paddingLeft: \`\${4 * scale}cm\`,
        paddingRight: \`\${3 * scale}cm\`,
        transformOrigin: 'top center',
        boxSizing: 'border-box'
      }}
    >
      <div className={\`flex flex-col text-gray-900 \${isCover ? 'items-center justify-center text-center h-full' : ''}\`} style={{ fontSize: \`\${scale}rem\` }}>
        {section.blocks.map((block) => (
          <BlockRenderer 
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
  );
};

const BlockRenderer: React.FC<{ block: DocumentBlock; selectedNodeId: string | null; onSelectNode: (id: string) => void; isCover: boolean; isTOC: boolean; isApproval: boolean }> = ({ block, selectedNodeId, onSelectNode, isCover, isTOC, isApproval }) => {
  const isSelected = selectedNodeId === block.id;
  const baseClasses = \`transition-colors cursor-pointer border border-transparent hover:border-blue-200 \${isSelected ? 'bg-blue-50 border-blue-400' : ''}\`;

  const renderContent = () => {
    switch (block.type) {
      case 'HEADING':
        const level = (block as HeadingBlock).level;
        const HeadingTag = \`h\${Math.min(Math.max(level, 1), 6)}\` as any;
        
        let sizeClass = '';
        if (isCover) {
          if (level === 1) sizeClass = 'gdds-title-doc my-4';
          else if (level === 2) sizeClass = 'gdds-title-bab my-3';
          else sizeClass = 'gdds-heading-2 text-center my-2';
        } else {
          if (level === 1) sizeClass = 'gdds-title-bab';
          else if (level === 2) sizeClass = 'gdds-heading-2';
          else sizeClass = 'gdds-heading-3';
        }

        return (
          <HeadingTag className={sizeClass}>
            {(block as HeadingBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </HeadingTag>
        );
      case 'PARAGRAPH':
        // Handle TOC
        if (isTOC) {
          // A TOC paragraph from TOC builder might have dot leaders... 
          // Wait, TOC builder creates TOC structure. We need to check TOC Builder.
          // For now, we'll just render it as normal or with TOC specific classes if it's a TOC row
          // We can check if nodes have link.
          const hasLink = (block as ParagraphBlock).nodes.some(n => n.type === 'LINK');
          if (hasLink) {
             return (
               <div className="gdds-toc-row">
                 <span className="font-bold flex-shrink-0">
                   {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                 </span>
                 <div className="gdds-toc-dots"></div>
                 <span className="font-bold"></span>
               </div>
             )
          }
        }
        
        let pClass = isCover || isApproval ? 'gdds-p-no-indent text-center' : 'gdds-p';
        // For approval, left align mostly except when centered
        if (isApproval) pClass = 'gdds-p-no-indent';
        
        return (
          <p className={pClass}>
            {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </p>
        );
      case 'LIST':
        const ListTag = (block as ListBlock).ordered ? 'ol' : 'ul';
        return (
          <ListTag className={\`pl-6 mb-2 \${((block as ListBlock).ordered) ? 'list-decimal' : 'list-disc'}\`}>
            {(block as ListBlock).items.map((item) => (
              <li key={item.id} className="gdds-list-item">
                {item.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
              </li>
            ))}
          </ListTag>
        );
      case 'TABLE':
        return (
          <table className="w-full border-collapse border border-black mb-4 text-sm mt-4">
            <thead>
              {(block as TableBlock).head.map((row) => (
                <tr key={row.id} className="bg-gray-200">
                  {row.cells.map(cell => (
                    <th key={cell.id} className="border border-black px-4 py-2 text-center font-bold">
                      {cell.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {(block as TableBlock).body.map((row) => (
                <tr key={row.id}>
                  {row.cells.map(cell => (
                    <td key={cell.id} className="border border-black px-4 py-2">
                      {cell.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'IMAGE':
        return (
          <div className="flex justify-center my-6 print-no-break">
            <img src={(block as ImageBlock).url} alt={(block as ImageBlock).altText} className="w-32 h-auto" />
          </div>
        );
      case 'ATTACHMENT':
        return (
          <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg my-4">
            <div className="text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </div>
            <div>
              <p className="font-medium text-sm">{(block as AttachmentBlock).filename}</p>
              <p className="text-xs text-gray-500">{(block as AttachmentBlock).uri}</p>
            </div>
          </div>
        );
      case 'CONTAINER':
        // Check if this is the signature container
        if (block.id === 'approval-container-school-signatures') {
           return (
              <div className="gdds-signature-grid print-no-break">
                {(block as ContainerBlock).blocks.map(b => (
                  <div key={b.id} className="gdds-signature-cell gdds-signature-center">
                    <BlockRenderer block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                  </div>
                ))}
              </div>
           );
        }
        
        if (block.id === 'approval-container-verification' || block.id === 'approval-container-education-office') {
            return (
               <div className="mt-8 flex justify-center print-no-break">
                 <div className="w-1/2 text-center">
                    {(block as ContainerBlock).blocks.map(b => (
                      <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                    ))}
                 </div>
               </div>
            )
        }

        return (
          <div className="flex flex-col">
            {(block as ContainerBlock).blocks.map(b => (
              <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
            ))}
          </div>
        );
      default:
        return <div>Unknown Block Type</div>;
    }
  };

  return (
    <div id={block.id} className={baseClasses} onClick={(e) => { e.stopPropagation(); onSelectNode(block.id); }}>
      {renderContent()}
    </div>
  );
};

const NodeRenderer: React.FC<{ node: DocumentNode }> = ({ node }) => {
  if (node.type === 'TEXT') {
    return <span id={node.id}>{node.text}</span>;
  }
  if (node.type === 'LINK') {
    return (
      <a id={node.id} href={node.url} className="text-black hover:underline cursor-pointer">
        {node.nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
      </a>
    );
  }
  return null;
};
`;

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);
console.log('Renderer updated');
