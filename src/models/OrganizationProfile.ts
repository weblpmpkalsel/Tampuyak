export interface OrganizationProfile {
  // Step 1: School Profile
  schoolName: string;
  npsn: string;
  nss: string;
  educationLevel: string;
  status: string;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;

  // Step 2: Leadership
  principalName: string;
  principalNip: string;
  principalPhone: string;
  principalEmail: string;
  principalAppointmentDate: string;

  // Step 3: Academic Profile
  academicYear: string;
  semester: string;
  schoolVision: string;
  schoolMission: string;
  schoolMotto: string;

  // Step 4: Identity
  schoolLogoUrl?: string;
  schoolStampUrl?: string;

  // Metadata
  workspaceId: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
