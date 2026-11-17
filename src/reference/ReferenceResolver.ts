import { ReferenceRequest, ResolvedReference } from './ReferenceTypes';
import { ReferenceResult } from './ReferenceResult';
import { ReferenceValidator } from './ReferenceValidator';
import { RkasReferenceResolver } from '../rkas/integration/RkasReferenceResolver';

export class ReferenceResolver {
  public static resolve(requests: ReferenceRequest[]): ReferenceResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const resolvedReferences: ResolvedReference[] = [];

    const seenIds = new Set<string>();

    for (const request of requests) {
      const validationErrors = ReferenceValidator.validate(request);
      
      if (validationErrors.length > 0) {
        errors.push(...validationErrors.map(e => `Request [${request.activityId || 'unknown'}]: ${e}`));
        continue;
      }

      if (seenIds.has(request.activityId)) {
        warnings.push(`Duplicate reference found for activity id: ${request.activityId}`);
        continue;
      }
      seenIds.add(request.activityId);

      const original = request.originalPayload || {};

      const resolved: ResolvedReference = {
        originalRequest: request
      };

      if (original.program) {
         resolved.program = {
             id: original.programId || '-',
             code: original.programCode || '-',
             name: original.program
         };
      }
      
      if (original.accountCode || original.accountName || original.budgetItem) {
          resolved.account = {
              code: original.accountCode || '-',
              name: original.accountName || original.budgetItem || '-',
              type: original.accountType || '-'
          };
      }

      if (original.fundingSource || original.funding) {
          resolved.funding = {
             source: original.fundingSource || original.funding || '-',
             description: original.fundingDescription || '-'
          };
      }
      
      if (original.componentId || original.componentName || original.component) {
          resolved.component = {
             id: original.componentId || '-',
             name: original.componentName || original.component || '-',
             category: original.componentCategory || '-'
          }
      }

      // Set Identity explicitly from request to preserve it
      if (!resolved.activity) {
         resolved.activity = {
            id: request.activityId || original.id || '-',
            code: request.activityCode || original.kode || '-',
            name: request.activityName || original.nama || original.subActivity || '-'
         };
      }
      
      if (!resolved.program) {
         resolved.program = {
             id: original.programId || '-',
             code: original.programCode || '-',
             name: original.programName || original.program || original.activity || '-'
         };
      }

      // Master Data enrichment ONLY
      if (request.activityCode) {
        const metadataResult = RkasReferenceResolver.resolveActivityMetadata(request.activityCode);
        
        if (metadataResult.success && metadataResult.data) {
          resolved.metadata = {
             referenceProgram: metadataResult.data.program,
             referenceActivity: metadataResult.data.kegiatan
          };
        } else if (metadataResult.error) {
          warnings.push(`Failed to resolve metadata for activity code ${request.activityCode}: ${metadataResult.error}`);
        }
      }

      resolvedReferences.push(resolved);
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      resolvedReferences,
      metadata: {
        totalProcessed: requests.length,
        totalResolved: resolvedReferences.length
      }
    };
  }
}
