const fs = require('fs');

function addOnClose(fileName, componentName) {
  let code = fs.readFileSync(fileName, 'utf8');
  
  if (code.includes(`export const ${componentName} = ({ onClose }: { onClose?: () => void })`)) {
    return;
  }
  
  code = code.replace(
    `export const ${componentName} = () => {`,
    `import { ArrowLeft } from 'lucide-react';\nexport const ${componentName} = ({ onClose }: { onClose?: () => void }) => {`
  );
  
  // Find the first return statement which returns the outer div
  const returnStr = `return (\n    <div`;
  const replaceReturnStr = `return (\n    <div className="flex flex-col h-full bg-white relative">\n      {onClose && (
        <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4 shrink-0 shadow-sm z-10 sticky top-0">
          <button 
            onClick={onClose} 
            className="px-3 py-1.5 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      )}\n      <div`;
  
  if (code.includes(returnStr)) {
      code = code.replace(returnStr, replaceReturnStr);
      // Close the added div at the very end
      const lastDivIndex = code.lastIndexOf('</div>');
      if (lastDivIndex !== -1) {
          code = code.substring(0, lastDivIndex) + '</div>\n    </div>' + code.substring(lastDivIndex + 6);
      }
      fs.writeFileSync(fileName, code);
      console.log(`Updated ${fileName}`);
  } else {
    // maybe it has a different return statement
    console.log(`Could not find return statement in ${fileName}`);
  }
}

addOnClose('src/ksp/KSPValidationPanel.tsx', 'KSPValidationPanel');
addOnClose('src/ksp/KSPAttachmentPanel.tsx', 'KSPAttachmentPanel');
