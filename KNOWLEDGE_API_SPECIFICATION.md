# Knowledge API Specification

All application logic must retrieve master data through the Knowledge API singleton. Hardcoding data arrays in React components is strictly prohibited.

## Core Methods

### `KnowledgeAPI.getRegulations(version?: string)`
Returns the list of active (or version-specific) official regulations.

### `KnowledgeAPI.getRKASCodes(filters: { snp?: string, category?: string, activeYear?: string })`
Retrieves official RKAS activity codes matching the filter criteria.

### `KnowledgeAPI.getSNP(id?: string)`
Fetches the 8 National Education Standards or a specific standard.

### `KnowledgeAPI.getRaporIndicators(dimension?: string)`
Retrieves Rapor Pendidikan indicators and their mapped AI recommendations.

### `KnowledgeAPI.getDocumentTemplate(type: "RKJM" | "RKT" | "RKAS" | "KSP", version: string)`
Returns the blueprint, mandatory sections, and certification rules for a specific document.

### `KnowledgeAPI.search(query: string)`
Universal semantic search. Queries all underlying master databases and returns cross-referenced results (Regulations, SNP, RKAS codes).

### `KnowledgeAPI.getRecommendations(context: any)`
Invokes the AI Recommendation Engine to suggest SNP, RKAS Codes, and Monitoring Indicators based on active context (e.g., selected Rapor gap).

### `KnowledgeAPI.getTraceabilityLineage(objectId: string, objectType: string)`
Returns the full hierarchical lineage (e.g., Rapor -> RKJM -> RKT -> RKAS -> Monitoring).
