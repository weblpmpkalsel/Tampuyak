import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { buildSchoolContext } from './src/enterprise/knowledge/builders/SchoolContextBuilder';
import { buildKspBab1Section } from './src/enterprise/document/ksp/bab1/KspBab1Structure';
import fs from 'fs';

// Since we can't easily eval the entire Tampuyak file, let's just create an empty settings object 
// and populate it with what we know is in DEFAULT_SETTINGS.
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
  pesertaDidik: undefined,
  guru: undefined,
  tendik: undefined,
  sarpras: undefined,
  komite: undefined,
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

const checkMissing = () => {
    const missing = [];
    if (!metadata.rawStudents && !settings.karakteristik.pesertaDidik) missing.push("Student");
    if (!metadata.rawTeachers && !settings.karakteristik.guru) missing.push("Teacher");
    if (!metadata.rawEducationStaff) missing.push("Education Staff");
    if (!metadata.rawFacilities) missing.push("Facilities");
    if (!metadata.rawAcademicCalendar) missing.push("Calendar");
    if (!metadata.rawCommittee) missing.push("Committee");
    if (!metadata.rawPotential && (!settings.potensi.daerah.length && !settings.potensi.kearifanLokal.length)) missing.push("Potential");
    if (!metadata.rawAchievements) missing.push("Achievements");
    if (!metadata.rawSpecialPrograms || settings.programUnggulan.length === 0) missing.push("Special Programs");
    
    console.log("MISSING:", missing.join(", "));
}

checkMissing();
