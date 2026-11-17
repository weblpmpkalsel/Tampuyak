const fs = require('fs');
let content = fs.readFileSync('src/enterprise/document/layout/LayoutEngine.ts', 'utf8');

content = content.replace(
  'export interface DocumentLayoutConfig {',
  'export interface DocumentLayoutConfig {\n  orientation?: "portrait" | "landscape";'
);

content = content.replace(
  'export const DefaultDocumentLayoutConfig: DocumentLayoutConfig = {',
  'export const DefaultDocumentLayoutConfig: DocumentLayoutConfig = {\n  orientation: "portrait",'
);

content = content.replace(
  '    return {',
  '    return {\n      orientation: override.orientation || DefaultDocumentLayoutConfig.orientation,'
);

fs.writeFileSync('src/enterprise/document/layout/LayoutEngine.ts', content);
