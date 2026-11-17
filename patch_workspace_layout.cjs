const fs = require('fs');
let content = fs.readFileSync('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx', 'utf8');

if (!content.includes("import { LayoutProfile, defaultLayoutProfile } from './LayoutProfile'")) {
  content = content.replace("import { CanonicalDocument } from '../../document/CanonicalDocumentTypes';", "import { CanonicalDocument } from '../../document/CanonicalDocumentTypes';\nimport { LayoutProfile, defaultLayoutProfile } from './LayoutProfile';");
}

const searchState = `  const [rightTab, setRightTab] = useState<'DOCUMENT' | 'KNOWLEDGE' | 'VALIDATION'>('DOCUMENT');`;
const replaceState = `  const [rightTab, setRightTab] = useState<'DOCUMENT' | 'KNOWLEDGE' | 'VALIDATION' | 'LAYOUT'>('DOCUMENT');
  const [layoutProfile, setLayoutProfile] = useState<LayoutProfile>(defaultLayoutProfile);`;

if (content.includes(searchState)) {
  content = content.replace(searchState, replaceState);
}

const searchRender = `          <CanonicalRenderer
            document={document}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            scale={scale}
          />`;

const replaceRender = `          <CanonicalRenderer
            document={document}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            scale={scale}
            layoutProfile={layoutProfile}
          />`;

if (content.includes(searchRender)) {
  content = content.replace(searchRender, replaceRender);
}

const searchTabs = `          <button 
            className={\`flex-1 py-3 text-xs font-semibold uppercase tracking-wider \${rightTab === 'VALIDATION' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}\`}
            onClick={() => setRightTab('VALIDATION')}
          >
            Validation
          </button>
        </div>`;

const replaceTabs = `          <button 
            className={\`flex-1 py-3 text-xs font-semibold uppercase tracking-wider \${rightTab === 'VALIDATION' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}\`}
            onClick={() => setRightTab('VALIDATION')}
          >
            Validation
          </button>
          <button 
            className={\`flex-1 py-3 text-xs font-semibold uppercase tracking-wider \${rightTab === 'LAYOUT' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}\`}
            onClick={() => setRightTab('LAYOUT')}
          >
            Layout
          </button>
        </div>`;

if (content.includes(searchTabs)) {
  content = content.replace(searchTabs, replaceTabs);
}

const searchContent = `          {rightTab === 'VALIDATION' && (`;

const layoutContent = `          {rightTab === 'LAYOUT' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Layout Profile</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Cover Logo Scale</label>
                  <input type="range" min="0.5" max="2" step="0.1" value={layoutProfile.coverLogoScale} onChange={e => setLayoutProfile({...layoutProfile, coverLogoScale: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.coverLogoScale}x</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Cover Top Offset (cm)</label>
                  <input type="range" min="-3" max="5" step="0.5" value={layoutProfile.coverTopOffset} onChange={e => setLayoutProfile({...layoutProfile, coverTopOffset: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.coverTopOffset} cm</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Approval Signature Height (cm)</label>
                  <input type="range" min="2" max="6" step="0.1" value={layoutProfile.approvalSignatureHeight} onChange={e => setLayoutProfile({...layoutProfile, approvalSignatureHeight: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.approvalSignatureHeight} cm</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Approval Column Gap (cm)</label>
                  <input type="range" min="0" max="5" step="0.5" value={layoutProfile.approvalColumnGap} onChange={e => setLayoutProfile({...layoutProfile, approvalColumnGap: parseFloat(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.approvalColumnGap} cm</div>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-2">Paragraph Spacing (pt)</label>
                  <input type="range" min="0" max="24" step="1" value={layoutProfile.paragraphSpacing} onChange={e => setLayoutProfile({...layoutProfile, paragraphSpacing: parseInt(e.target.value)})} className="w-full" />
                  <div className="text-right text-xs text-gray-500">{layoutProfile.paragraphSpacing} pt</div>
                </div>
              </div>
            </div>
          )}
          {rightTab === 'VALIDATION' && (`;

if (content.includes(searchContent)) {
  content = content.replace(searchContent, layoutContent);
}

fs.writeFileSync('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx', content);
console.log('patched workspace layout');
