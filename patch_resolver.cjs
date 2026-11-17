const fs = require('fs');
let code = fs.readFileSync('src/reference/ReferenceResolver.ts', 'utf-8');

const targetMetadata = `      if (request.activityCode) {
        const metadataResult = RkasReferenceResolver.resolveActivityMetadata(request.activityCode);
        
        if (metadataResult.success && metadataResult.data) {
          if (!resolved.program) {
            resolved.program = {
              id: metadataResult.data.program.id,
              code: metadataResult.data.program.kode,
              name: metadataResult.data.program.nama
            };
          }
          
          if (!resolved.activity) {
            resolved.activity = {
              id: metadataResult.data.kegiatan.id,
              code: metadataResult.data.kegiatan.kode,
              name: metadataResult.data.kegiatan.nama
            };
          }
        } else if (metadataResult.error && !resolved.program) {
          warnings.push(\`Failed to resolve metadata for activity code \${request.activityCode}: \${metadataResult.error}\`);
        }
      }`;

const replacementMetadata = `      // Set Identity explicitly from request to preserve it
      if (!resolved.activity) {
         resolved.activity = {
            id: request.activityId || original.id || 'UNGROUPED_ACTIVITY',
            code: request.activityCode || original.kode || '-',
            name: request.activityName || original.nama || original.subActivity || '-'
         };
      }
      
      if (!resolved.program) {
         resolved.program = {
             id: original.programId || 'UNGROUPED_PROGRAM',
             code: original.programCode || '-',
             name: original.programName || original.program || original.activity || 'UNGROUPED_PROGRAM'
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
          warnings.push(\`Failed to resolve metadata for activity code \${request.activityCode}: \${metadataResult.error}\`);
        }
      }`;

code = code.replace(targetMetadata, replacementMetadata);
fs.writeFileSync('src/reference/ReferenceResolver.ts', code);
console.log("ReferenceResolver patched!");
