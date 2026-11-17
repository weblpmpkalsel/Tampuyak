import { CanonicalDocument } from '../../CanonicalDocumentTypes';
import { DocumentAdapter, DocumentArtifact } from '../AdapterContracts';
import { AdapterRegistry } from '../registry/AdapterRegistry';

/**
 * KSP (Kurikulum Satuan Pendidikan) Adapter
 * 
 * Enforces:
 * - Enterprise Rule 058: Return canonical DocumentArtifact (No KSP-specific artifact contracts)
 * - Enterprise Rule 060: No Workspace coupling
 * - Enterprise Rule 061: Never generate HTML, PDF, DOCX, or presentation output
 * - Enterprise Rule 062: Preserve document order established by Canonical Document
 */
export class KspAdapter implements DocumentAdapter<CanonicalDocument> {
  public adapt(document: CanonicalDocument): DocumentArtifact<CanonicalDocument> {
    // Rule 062: Preserve document order by passing through canonical structure natively.
    // Adapters may transform structure (Rule 054), but here we map 1:1 as the base KSP implementation
    // while strictly avoiding any HTML/PDF generation (Rule 061).
    
    return {
      metadata: {
        artifactId: `ksp-artifact-${document.metadata.documentId}`,
        generatedAt: new Date().toISOString(),
        sourceDocumentId: document.metadata.documentId,
        artifactType: 'KSP'
      },
      content: {
        id: document.id,
        metadata: { ...document.metadata },
        sections: [...document.sections]
      }
    };
  }
}

