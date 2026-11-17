export class AdministrativeMetadataAdapter {
  static normalize(adminMetadata: any) {
    if (!adminMetadata) return {};
    
    return {
      administrasi: {
        establishmentPlace: adminMetadata.establishmentPlace || '',
        academicYear: adminMetadata.academicYear || '',
        establishmentDate: adminMetadata.establishmentDate || '',
        documentNumber: adminMetadata.documentNumber || '',
      },
      approval: {
        date: adminMetadata.establishmentDate || adminMetadata.approvalDate || '',
        documentNumber: adminMetadata.documentNumber || '',
      },
      pengawas: {
        ...(adminMetadata.supervisorName && { name: adminMetadata.supervisorName }),
        ...(adminMetadata.supervisorNip && { nip: adminMetadata.supervisorNip })
      },
      kepalaDinas: {
        ...(adminMetadata.headOfOfficeName && { name: adminMetadata.headOfOfficeName }),
        ...(adminMetadata.headOfOfficeNip && { nip: adminMetadata.headOfOfficeNip }),
        ...(adminMetadata.headOfOfficePosition && { jabatan: adminMetadata.headOfOfficePosition })
      },
      komite: {
        ...(adminMetadata.committeeName && { name: adminMetadata.committeeName })
      },
      principal: {
        ...(adminMetadata.principalName && { name: adminMetadata.principalName }),
        ...(adminMetadata.principalNip && { nip: adminMetadata.principalNip })
      }
    };
  }
}
