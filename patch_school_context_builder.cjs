const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/knowledge/builders/SchoolContextBuilder.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace EducatorKnowledgeDomain
content = content.replace(
  /export interface EducatorKnowledgeDomain \{[\s\S]*?\}/,
  `export interface EducatorKnowledgeDomain {
  totalTeachers?: number;
  certifications?: string[];
  leadershipHierarchy?: string[];
  specializedStaff?: string[];
  generalCharacteristics?: string[];
}

export function buildEducatorCharacteristicDomain(raw?: any): EducatorKnowledgeDomain | undefined {
  if (!raw) return undefined;
  return {
    generalCharacteristics: raw.pendidik ? [raw.pendidik] : undefined
  };
}`
);

// Replace PartnershipKnowledgeDomain
content = content.replace(
  /export interface PartnershipKnowledgeDomain \{[\s\S]*?\}/,
  `export interface PartnershipKnowledgeDomain {
  parentCommunities?: string[];
  industryLinkages?: string[];
  localGovernmentPartners?: string[];
  generalCharacteristics?: string[];
}

export function buildPartnershipDomain(raw?: any): PartnershipKnowledgeDomain | undefined {
  if (!raw) return undefined;
  return {
    generalCharacteristics: raw.orangTua ? [raw.orangTua] : undefined
  };
}`
);

// Replace CulturalKnowledgeDomain
content = content.replace(
  /export interface CulturalKnowledgeDomain \{[\s\S]*?\}/,
  `export interface CulturalKnowledgeDomain {
  localWisdomTraditions?: string[];
  prevailingRegionalCharacteristics?: string[];
  environmentalFactors?: string[];
}

export function buildCulturalDomain(raw?: any): CulturalKnowledgeDomain | undefined {
  if (!raw) return undefined;
  return {
    prevailingRegionalCharacteristics: raw.lokasi ? [raw.lokasi] : undefined,
    environmentalFactors: raw.lingkungan ? [raw.lingkungan] : undefined
  };
}`
);

fs.writeFileSync(file, content);
console.log("Updated SchoolContextBuilder.ts");
