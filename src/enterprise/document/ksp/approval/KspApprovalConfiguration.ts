export interface KspApprovalConfiguration {
  readonly documentNumber?: string;
  readonly regencyOrCity: string;
  readonly province: string;
  readonly educationAuthorityRegion: string;
  readonly approvalDate: string;

  readonly schoolName: string;
  
  readonly principalName: string;
  readonly principalNip: string;
  readonly principalPosition: string; // e.g., "Kepala Sekolah"

  readonly schoolCommitteeName?: string; // e.g., "Ketua Komite Sekolah"

  readonly supervisorName: string;
  readonly supervisorNip: string;
  readonly supervisorPosition: string; // e.g., "Pengawas Pembina"

  readonly headOfEducationOfficeName: string;
  readonly headOfEducationOfficeNip: string;
  readonly headOfEducationOfficePosition: string; // e.g., "Kepala Cabang Dinas Pendidikan"
}
