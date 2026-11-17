export interface ProgramActivity {
  id: string;
  name: string;
  objectives: string;
  description: string;
  schedule: string;
  responsiblePerson: string;
  targetParticipants: string;
}

export interface ProgramIdentity {
  programName: string;
  academicYear: string;
  description: string;
}

export interface ProgramContent {
  identity: ProgramIdentity;
  activities: ProgramActivity[];
  dimensiProfilLulusan: string[];
  tujuhKebiasaan: string[];
  attachments: string[]; // Document IDs from Enterprise Document Repository
}
