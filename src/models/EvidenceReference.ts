export type EvidenceVerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export interface EvidenceReference {
  evidenceId: string;
  evidenceType: string;
  evidenceName: string;
  referenceUri: string;
  uploadedBy: string;
  uploadedAt: number;
  verificationStatus: EvidenceVerificationStatus;
  notes?: string;
}
