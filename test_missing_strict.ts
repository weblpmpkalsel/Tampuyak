import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { buildEducatorCharacteristicDomain, buildStudentCharacteristicDomain, buildInfrastructureDomain, buildPartnershipDomain, buildCulturalDomain, buildSpecialProgramDomain, buildAchievementDomain } from './src/enterprise/knowledge/builders/SchoolContextBuilder';

const settings = {
  karakteristik: {
    lokasi: [],
    lingkungan: "",
    pesertaDidik: "",
    guru: "",
    orangTua: "",
  },
  potensi: { daerah: [], kearifanLokal: [] },
  programUnggulan: [],
  academicYears: [
    {
      id: `ay-1`,
      name: `2026/2027`,
      semester: "Ganjil",
      isActive: true,
      createdAt: Date.now(),
    },
  ],
  school: {},
  identitas: {},
  pesertaDidik: { total: 0, lakiLaki: 0, perempuan: 0, jumlahRombel: 0 },
  guru: [],
  tendik: [],
  sarpras: {
    ruangKelas: 0,
    perpustakaan: 0,
    laboratorium: 0,
    uks: 0,
    toilet: 0,
    mushola: 0,
    lapangan: 0,
    ruangGuru: 0,
    ruangKepsek: 0,
  },
  komite: { name: "", phone: "" },
  prestasi: undefined,
  academicCalendar: undefined,
  learningLoad: undefined,
  learningOrganization: undefined,
  intracurricular: undefined,
  cocurricular: undefined,
  extracurricular: undefined,
  learningPolicy: undefined,
  evaluation: undefined
};

const metadata = KspMetadataAdapter.adapt(settings);

const students = buildStudentCharacteristicDomain(metadata.rawStudents, metadata.rawRombel);
const educators = buildEducatorCharacteristicDomain(metadata.rawCharacteristics, metadata.rawTeachers, metadata.rawEducationStaff, metadata.principalName, metadata.principalPosition);
const infrastructure = buildInfrastructureDomain(metadata.rawFacilities);
const partnerships = buildPartnershipDomain(metadata.rawCharacteristics, metadata.rawCommittee);
const culture = buildCulturalDomain(metadata.rawCharacteristics, metadata.rawPotential);
const specialPrograms = buildSpecialProgramDomain(metadata.rawSpecialPrograms);
const achievements = buildAchievementDomain(metadata.rawAchievements);

console.log("Student:", (students && (students.generalCharacteristics?.length > 0 || students.totalStudents || students.genderDistribution || students.classes?.length > 0)) ? "PRESENT" : "MISSING");
console.log("Teacher:", (educators && (educators.teacherStatistics?.length > 0 || (educators.generalCharacteristics && educators.generalCharacteristics[0]))) ? "PRESENT" : "MISSING");
console.log("Education Staff:", (educators && educators.staffStatistics?.length > 0) ? "PRESENT" : "MISSING");
console.log("Facilities:", (infrastructure && infrastructure.facilities?.length > 0) ? "PRESENT" : "MISSING");
console.log("Calendar:", metadata.rawAcademicCalendar ? "PRESENT" : "MISSING");
console.log("Committee:", (partnerships && partnerships.committeeName) ? "PRESENT" : "MISSING");
console.log("Potential:", (culture && culture.regionalPotentials?.length > 0) ? "PRESENT" : "MISSING");
console.log("Achievements:", (achievements && achievements.achievements?.length > 0) ? "PRESENT" : "MISSING");
console.log("Special Programs:", (specialPrograms && specialPrograms.programs?.length > 0) ? "PRESENT" : "MISSING");

