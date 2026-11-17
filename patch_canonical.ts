import fs from 'fs';
const file = 'src/enterprise/document/CanonicalDocumentTypes.ts';
let content = fs.readFileSync(file, 'utf8');
const replacement = `export interface DocumentTeamMember {
  readonly name: string;
  readonly role: string;
  readonly identifier?: string;
}

export interface CanonicalDocumentMetadata {
  readonly documentId: string;
  readonly title: string;
  readonly version: string;
  readonly createdAt: string;
  readonly draftingTeam?: readonly DocumentTeamMember[];
}`;
content = content.replace(/export interface CanonicalDocumentMetadata \{[\s\S]*?\}/, replacement);
fs.writeFileSync(file, content);
