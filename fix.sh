sed -i '34,49c\
    context: {\
      profile: { schoolName: metadata.schoolName } as any,\
      academicYear: { year: metadata.academicYear } as any,\
      community: { parents: "heterogen dengan berbagai profesi", industryPartners: ["PT Maju Jaya", "CV Karya Mandiri"] } as any,\
      facilities: { classrooms: 18, library: "1 Ruang Perpustakaan Standard", internet: "Tersedia 100 Mbps" } as any,\
      governance: { accreditationStatus: "A", accreditationBody: "BAN-S/M" } as any,\
      organization: { principal: metadata.principalName, vicePrincipal: "Bapak Wakil, S.Pd." } as any\
    },\
    students: {\
      totalStudents: 320,\
      genderDistribution: { male: 150, female: 170 },\
      generalCharacteristics: ["Aktif", "Kreatif", "Memiliki rasa ingin tahu tinggi"],\
      dominantLearningNeeds: ["Pembelajaran visual dan kinestetik", "Bimbingan membaca awal"]\
    }\
  };' src/enterprise/document/ksp/KspDocumentAssembler.ts
