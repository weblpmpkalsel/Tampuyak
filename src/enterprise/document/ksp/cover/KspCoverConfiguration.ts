export interface KspCoverConfiguration {
  readonly schoolName: string;
  readonly schoolStatus?: string; // e.g., "SEKOLAH PENGGERAK"
  readonly educationLevel: string; // e.g., "SD", "SMP"
  readonly npsn: string;
  readonly address: string;
  readonly village: string;
  readonly district: string;
  readonly regencyOrCity: string;
  readonly province: string;
  readonly educationAuthorityRegion: string;
  readonly academicYear: string;
  readonly schoolLogoUrl: string;
  readonly governmentLogoUrl: string; // e.g., Tut Wuri Handayani
}
