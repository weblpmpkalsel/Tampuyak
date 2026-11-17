export interface TaxonomyEntry {
  id: string;
  displayName: string;
  description: string;
  governmentTags: string[];
  simuridTags: string[];
  deepLearningTags: string[];
}

export interface TaxonomyGroup {
  id: string;
  displayName: string;
  description?: string;
  entries: TaxonomyEntry[];
}

export interface PedagogicalDictionary {
  version: string;
  locale: string;
  groups: TaxonomyGroup[];
}

export function searchTaxonomy(entries: TaxonomyEntry[], query: string): TaxonomyEntry[] {
  const lowerQuery = query.toLowerCase();
  return entries.filter(e => 
    e.displayName.toLowerCase().includes(lowerQuery) || 
    e.description.toLowerCase().includes(lowerQuery) ||
    e.governmentTags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    e.simuridTags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    e.deepLearningTags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}
