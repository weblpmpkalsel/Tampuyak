import { DocumentSection, DocumentBlock, HeadingBlock, ParagraphBlock, TextNode, ListBlock, ListItemNode, TableBlock, TableRowNode, TableCellNode } from '../../CanonicalDocumentTypes';
import { SchoolContextKnowledgePayload } from '../../../knowledge/builders/SchoolContextBuilder';
import { RegulatoryKnowledgePayload } from '../../../knowledge/builders/RegulatoryKnowledgeBuilder';

/**
 * Maps the School Context Knowledge Payload into the Enterprise Canonical Document Model for BAB I.
 * 
 * Enforces Architectural Rules:
 * - Enterprise Rule 044: The model must remain document agnostic.
 * - Enterprise Rule 048: No presentation attributes.
 * - Enterprise Rule 049: Every document node shall have a stable identifier.
 */
export function buildKspBab1Section(
  payload: SchoolContextKnowledgePayload, 
  regulatoryPayload?: RegulatoryKnowledgePayload
): DocumentSection {
  const { profile, context, students } = payload;
  const blocks: DocumentBlock[] = [];

  // Main Chapter Title
  blocks.push({
    id: 'bab1-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'bab1-text-main-title', type: 'TEXT', text: 'KARAKTERISTIK SATUAN PENDIDIKAN' }]
  });

  // A. Landasan Penyusunan
  blocks.push({
    id: 'bab1-heading-landasan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-landasan', type: 'TEXT', text: 'A. Landasan Penyusunan' }]
  });
  
  blocks.push({
    id: 'bab1-paragraph-landasan-intro',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab1-text-landasan-intro', 
      type: 'TEXT', 
      text: `Penyusunan Kurikulum Operasional Satuan Pendidikan (KOSP) ${profile.schoolName} berlandaskan pada peraturan perundang-undangan yang berlaku, mengacu pada pedoman nasional pendidikan serta kebijakan yang ditetapkan oleh Kementerian Pendidikan Dasar dan Menengah terkait standar nasional pendidikan, kurikulum, dan evaluasi pendidikan. Secara khusus, penyusunan kurikulum ini didasarkan pada regulasi berikut:`
    }]
  });

  if (regulatoryPayload && regulatoryPayload.regulations && regulatoryPayload.regulations.length > 0) {
    const regulationItems: ListItemNode[] = regulatoryPayload.regulations.map((reg, index) => ({
      id: `bab1-list-item-landasan-${index}`,
      type: 'LIST_ITEM',
      nodes: [{
        id: `bab1-text-landasan-reg-${index}`,
        type: 'TEXT',
        text: reg.name
      }]
    }));

    blocks.push({
      id: 'bab1-list-landasan-regulations',
      type: 'LIST',
      ordered: true,
      items: regulationItems
    });
  }

  blocks.push({
    id: 'bab1-paragraph-landasan-closing',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab1-text-landasan-closing', 
      type: 'TEXT', 
      text: `Seluruh landasan yuridis tersebut menjadi pijakan utama dalam mengembangkan program-program strategis yang mendukung tercapainya visi dan misi satuan pendidikan secara holistik dan terintegrasi.`
    }]
  });

  // B. Karakteristik Peserta Didik
  blocks.push({
    id: 'bab1-heading-karakteristik',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-karakteristik', type: 'TEXT', text: 'B. Karakteristik Peserta Didik' }]
  });

  blocks.push({
    id: 'bab1-paragraph-karakteristik-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-karakteristik-opening', type: 'TEXT', text: `Peserta didik di ${profile.schoolName} merupakan individu yang unik dengan latar belakang, potensi, dan kebutuhan belajar yang beragam.` }]
  });

  if (students) {
    const hasTotal = students.totalStudents !== undefined;
    const hasGender = students.genderDistribution !== undefined;
    const hasChars = students.generalCharacteristics && students.generalCharacteristics.length > 0;
    const hasNeeds = students.dominantLearningNeeds && students.dominantLearningNeeds.length > 0;
    const hasClasses = students.classes && students.classes.length > 0;
    
    if (hasTotal || hasGender || hasChars || hasNeeds) {
      let sentences = [];
      if (hasTotal || hasGender) {
        let popStr = `Secara demografis, sekolah memiliki jumlah peserta didik`;
        if (hasTotal) popStr += ` sebanyak ${students.totalStudents} orang`;
        if (hasGender) popStr += `${hasTotal ? ',' : ''} dengan sebaran gender terdiri dari ${students.genderDistribution!.male} laki-laki dan ${students.genderDistribution!.female} perempuan`;
        sentences.push(popStr + '.');
      }
      
      if (hasChars) {
        sentences.push(`Karakteristik umum yang menonjol dari peserta didik meliputi ${students.generalCharacteristics!.join(', ')}.`);
      }
      
      if (hasNeeds) {
        sentences.push(`Kebutuhan belajar yang dominan mencakup ${students.dominantLearningNeeds!.join(', ')}.`);
      }
      
      if (sentences.length > 0) {
        blocks.push({
          id: 'bab1-paragraph-karakteristik-data',
          type: 'PARAGRAPH',
          nodes: [{ id: 'bab1-text-karakteristik-data', type: 'TEXT', text: sentences.join(' ') }]
        });
      }
    }

    if (hasClasses) {
      blocks.push({
        id: 'bab1-paragraph-karakteristik-table-title',
        type: 'PARAGRAPH',
        nodes: [{ id: 'bab1-text-karakteristik-table-title', type: 'TEXT', text: `Tabel 1.2 Jumlah Murid ${profile.schoolLevel || profile.educationStage || 'SD'} Tahun Ajaran` }]
      });

      const headerRow: TableRowNode = {
        id: 'bab1-table-12-header',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab1-table-12-h-1', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Kelas', id: 'bab1-table-12-h-1-t' }] },
          { id: 'bab1-table-12-h-2', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Laki-laki', id: 'bab1-table-12-h-2-t' }] },
          { id: 'bab1-table-12-h-3', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Perempuan', id: 'bab1-table-12-h-3-t' }] },
          { id: 'bab1-table-12-h-4', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Jumlah', id: 'bab1-table-12-h-4-t' }] }
        ]
      };

      const rows: TableRowNode[] = students.classes!.map((cls, idx) => ({
        id: `bab1-table-12-row-${idx}`,
        type: 'TABLE_ROW',
        cells: [
          { id: `bab1-table-12-r-${idx}-c-1`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: cls.className, id: `bab1-table-12-r-${idx}-c-1-t` }] },
          { id: `bab1-table-12-r-${idx}-c-2`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: cls.maleCount.toString(), id: `bab1-table-12-r-${idx}-c-2-t` }] },
          { id: `bab1-table-12-r-${idx}-c-3`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: cls.femaleCount.toString(), id: `bab1-table-12-r-${idx}-c-3-t` }] },
          { id: `bab1-table-12-r-${idx}-c-4`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: cls.totalCount.toString(), id: `bab1-table-12-r-${idx}-c-4-t` }] }
        ]
      }));

      // Calculate totals for footer
      const totalMale = students.classes!.reduce((sum, cls) => sum + cls.maleCount, 0);
      const totalFemale = students.classes!.reduce((sum, cls) => sum + cls.femaleCount, 0);
      const grandTotal = students.classes!.reduce((sum, cls) => sum + cls.totalCount, 0);

      const footerRow: TableRowNode = {
        id: 'bab1-table-12-footer',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab1-table-12-f-1', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Total', id: 'bab1-table-12-f-1-t' }] },
          { id: 'bab1-table-12-f-2', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: totalMale.toString(), id: 'bab1-table-12-f-2-t' }] },
          { id: 'bab1-table-12-f-3', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: totalFemale.toString(), id: 'bab1-table-12-f-3-t' }] },
          { id: 'bab1-table-12-f-4', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: grandTotal.toString(), id: 'bab1-table-12-f-4-t' }] }
        ]
      };

      const tableBlock: TableBlock = {
        id: 'bab1-table-12',
        type: 'TABLE',
        head: [headerRow],
        body: [...rows, footerRow]
      };

      blocks.push(tableBlock);
    }
  }

  blocks.push({
    id: 'bab1-paragraph-karakteristik-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-karakteristik-closing', type: 'TEXT', text: `Keberagaman ini menjadi modal dasar dalam merancang lingkungan belajar yang bermakna (Meaningful), disadari sepenuhnya (Mindful), dan menyenangkan (Joyful). Pemahaman mendalam terhadap karakteristik peserta didik memungkinkan sekolah memfasilitasi setiap anak melalui pendekatan berdiferensiasi, sekaligus menanamkan nilai-nilai luhur Dimensi Profil Lulusan serta 7 Kebiasaan Anak Indonesia Hebat secara berkesinambungan.` }]
  });

  // C. Karakteristik Guru / Pendidik
  blocks.push({
    id: 'bab1-heading-pendidik',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-pendidik', type: 'TEXT', text: 'C. Karakteristik Guru dan Tenaga Kependidikan' }]
  });

  blocks.push({
    id: 'bab1-paragraph-pendidik-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-pendidik-opening', type: 'TEXT', text: `Keberhasilan proses pendidikan sangat bergantung pada kualitas, dedikasi, dan komitmen tenaga pendidik serta kependidikan di satuan pendidikan.` }]
  });

  if (payload.educators && payload.educators.generalCharacteristics && payload.educators.generalCharacteristics.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-pendidik-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-pendidik-data', type: 'TEXT', text: `Secara khusus, pendidik di ${profile.schoolName} memiliki karakteristik ${payload.educators.generalCharacteristics.join(', ')}.` }]
    });
  }

  if (payload.educators?.principal) {
    blocks.push({
      id: 'bab1-paragraph-principal-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-principal-data', type: 'TEXT', text: `Satuan pendidikan ini dipimpin oleh Kepala Sekolah bernama ${payload.educators.principal.name}.` }]
    });
  }

  if (payload.educators?.teachers && payload.educators.teachers.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-pendidik-table-title',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-pendidik-table-title', type: 'TEXT', text: 'Tabel Karakteristik Pendidik' }]
    });

    const headerRow: TableRowNode = {
      id: 'bab1-table-pendidik-header',
      type: 'TABLE_ROW',
      cells: [
        { id: 'bab1-table-pendidik-h-1', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'No', id: 'bab1-table-pendidik-h-1-t' }] },
        { id: 'bab1-table-pendidik-h-2', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Nama Pendidik', id: 'bab1-table-pendidik-h-2-t' }] },
        { id: 'bab1-table-pendidik-h-3', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Tingkat Pendidikan', id: 'bab1-table-pendidik-h-3-t' }] },
        { id: 'bab1-table-pendidik-h-4', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Sertifikasi', id: 'bab1-table-pendidik-h-4-t' }] }
      ]
    };

    const rows: TableRowNode[] = payload.educators.teachers.map((teacher, idx) => ({
      id: `bab1-table-pendidik-row-${idx}`,
      type: 'TABLE_ROW',
      cells: [
        { id: `bab1-table-pendidik-r-${idx}-c-1`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: (idx + 1).toString(), id: `bab1-table-pendidik-r-${idx}-c-1-t` }] },
        { id: `bab1-table-pendidik-r-${idx}-c-2`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: teacher.name, id: `bab1-table-pendidik-r-${idx}-c-2-t` }] },
        { id: `bab1-table-pendidik-r-${idx}-c-3`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: teacher.educationLevel || '-', id: `bab1-table-pendidik-r-${idx}-c-3-t` }] },
        { id: `bab1-table-pendidik-r-${idx}-c-4`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: teacher.certificationStatus || '-', id: `bab1-table-pendidik-r-${idx}-c-4-t` }] }
      ]
    }));

    const tableBlock: TableBlock = {
      id: 'bab1-table-pendidik',
      type: 'TABLE',
      head: [headerRow],
      body: [...rows]
    };

    blocks.push(tableBlock);
  }

  if (payload.educators?.educationStaff && payload.educators.educationStaff.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-tendik-table-title',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-tendik-table-title', type: 'TEXT', text: 'Tabel Karakteristik Tenaga Kependidikan' }]
    });

    const headerRow: TableRowNode = {
      id: 'bab1-table-tendik-header',
      type: 'TABLE_ROW',
      cells: [
        { id: 'bab1-table-tendik-h-1', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'No', id: 'bab1-table-tendik-h-1-t' }] },
        { id: 'bab1-table-tendik-h-2', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Nama Tenaga Kependidikan', id: 'bab1-table-tendik-h-2-t' }] },
        { id: 'bab1-table-tendik-h-3', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Tingkat Pendidikan', id: 'bab1-table-tendik-h-3-t' }] },
        { id: 'bab1-table-tendik-h-4', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Posisi/Jabatan', id: 'bab1-table-tendik-h-4-t' }] }
      ]
    };

    const rows: TableRowNode[] = payload.educators.educationStaff.map((staff, idx) => ({
      id: `bab1-table-tendik-row-${idx}`,
      type: 'TABLE_ROW',
      cells: [
        { id: `bab1-table-tendik-r-${idx}-c-1`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: (idx + 1).toString(), id: `bab1-table-tendik-r-${idx}-c-1-t` }] },
        { id: `bab1-table-tendik-r-${idx}-c-2`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: staff.name, id: `bab1-table-tendik-r-${idx}-c-2-t` }] },
        { id: `bab1-table-tendik-r-${idx}-c-3`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: staff.educationLevel || '-', id: `bab1-table-tendik-r-${idx}-c-3-t` }] },
        { id: `bab1-table-tendik-r-${idx}-c-4`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: staff.position || '-', id: `bab1-table-tendik-r-${idx}-c-4-t` }] }
      ]
    }));

    const tableBlock: TableBlock = {
      id: 'bab1-table-tendik',
      type: 'TABLE',
      head: [headerRow],
      body: [...rows]
    };

    blocks.push(tableBlock);
  }

  blocks.push({
    id: 'bab1-paragraph-pendidik-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-pendidik-closing', type: 'TEXT', text: `Pendidik dan tenaga kependidikan secara konsisten mengembangkan kompetensi profesionalnya melalui berbagai kegiatan pengembangan diri. Tujuannya adalah untuk senantiasa menjadi fasilitator utama yang mumpuni dalam mewujudkan pembelajaran yang adaptif, holistik, dan benar-benar berpusat pada peserta didik.` }]
  });

  // D. Karakteristik Orang Tua
  blocks.push({
    id: 'bab1-heading-orang-tua',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-orang-tua', type: 'TEXT', text: 'D. Karakteristik Orang Tua/Wali' }]
  });

  blocks.push({
    id: 'bab1-paragraph-orangtua-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-orangtua-opening', type: 'TEXT', text: `Penyelenggaraan pendidikan yang efektif dan komprehensif membutuhkan sinergi serta kemitraan yang kuat antara pihak sekolah dan keluarga.` }]
  });

  if (payload.partnerships && payload.partnerships.generalCharacteristics && payload.partnerships.generalCharacteristics.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-orangtua-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-orangtua-data', type: 'TEXT', text: `Orang tua atau wali peserta didik di ${profile.schoolName} umumnya memiliki profil ${payload.partnerships.generalCharacteristics.join(', ')}.` }]
    });
  }
  
  if (payload.partnerships && payload.partnerships.committeeName) {
    blocks.push({
      id: 'bab1-paragraph-committee-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-committee-data', type: 'TEXT', text: `Kerja sama ini diwadahi melalui Komite Sekolah yang saat ini diketuai oleh ${payload.partnerships.committeeName}${payload.partnerships.committeeContact ? ` (Kontak: ${payload.partnerships.committeeContact})` : ''}. Komite sekolah berperan aktif dalam memberikan pertimbangan, arahan, dan dukungan tenaga, pikiran, maupun finansial demi kemajuan pendidikan di ${profile.schoolName}.` }]
    });}

  blocks.push({
    id: 'bab1-paragraph-orangtua-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-orangtua-closing', type: 'TEXT', text: `Kemitraan strategis ini terus diperkuat melalui komunikasi yang berkesinambungan dan program pelibatan orang tua. Hal ini bertujuan untuk memastikan keselarasan visi program sekolah dengan lingkungan rumah, serta mewujudkan kolaborasi Tri Pusat Pendidikan (sekolah, keluarga, dan masyarakat) secara optimal.` }]
  });

  // E. Kondisi Lingkungan
  blocks.push({
    id: 'bab1-heading-lingkungan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-lingkungan', type: 'TEXT', text: 'E. Karakteristik Lingkungan Satuan Pendidikan' }]
  });

  blocks.push({
    id: 'bab1-paragraph-lingkungan-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-lingkungan-opening', type: 'TEXT', text: `Lingkungan sosial dan budaya di sekitar satuan pendidikan merupakan ekosistem yang memberikan pengaruh signifikan terhadap dinamika pembelajaran dan pembentukan karakter peserta didik.` }]
  });

  if (payload.culture && payload.culture.environmentalFactors && payload.culture.environmentalFactors.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-lingkungan-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lingkungan-data', type: 'TEXT', text: `Kondisi lingkungan di sekitar sekolah dipengaruhi oleh faktor-faktor seperti ${payload.culture.environmentalFactors.join(', ')}.` }]
    });
  }

  if (payload.culture && payload.culture.regionalPotentials && payload.culture.regionalPotentials.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-potensi-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-potensi-data', type: 'TEXT', text: `Selain itu, satuan pendidikan juga memiliki berbagai potensi daerah yang menjadi ciri khas, di antaranya: ${payload.culture.regionalPotentials.join(', ')}.` }]
    });
  }
  
  if (payload.culture && payload.culture.localWisdoms && payload.culture.localWisdoms.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-kearifan-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-kearifan-data', type: 'TEXT', text: `Kearifan lokal yang berkembang dan dijaga di lingkungan sekitar satuan pendidikan meliputi: ${payload.culture.localWisdoms.join(', ')}.` }]
    });}

  blocks.push({
    id: 'bab1-paragraph-lingkungan-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-lingkungan-closing', type: 'TEXT', text: `Sekolah secara proaktif senantiasa berupaya mengintegrasikan potensi kearifan lokal ke dalam kegiatan intrakurikuler maupun kokurikuler, sehingga proses belajar menjadi lebih kontekstual, bermakna, dan relevan dengan realitas kehidupan peserta didik sehari-hari.` }]
  });

  // F. Lokasi Sekolah
  blocks.push({
    id: 'bab1-heading-lokasi',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-lokasi', type: 'TEXT', text: 'F. Lokasi Satuan Pendidikan' }]
  });

  blocks.push({
    id: 'bab1-paragraph-lokasi-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-lokasi-opening', type: 'TEXT', text: `Letak geografis dan infrastruktur wilayah menjadi pertimbangan penting dalam pengelolaan tata ruang dan program pendidikan satuan pendidikan.` }]
  });

  if (payload.culture && payload.culture.prevailingRegionalCharacteristics && payload.culture.prevailingRegionalCharacteristics.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-lokasi-data',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lokasi-data', type: 'TEXT', text: `Secara geografis, ${profile.schoolName} berlokasi di area dengan karakteristik ${payload.culture.prevailingRegionalCharacteristics.join(', ')}.` }]
    });
  }

  blocks.push({
    id: 'bab1-paragraph-lokasi-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-lokasi-closing', type: 'TEXT', text: `Karakteristik lokasi ini dimanfaatkan secara optimal untuk merancang pengalaman belajar di luar kelas (outdoor learning) yang menyatu dengan alam dan lingkungan masyarakat. Selain itu, kondisi ini juga menjadi pedoman dalam menjamin lingkungan pendidikan yang aman, sehat, inklusif, dan mudah diakses oleh seluruh warga sekolah.` }]
  });


  // G. Sarana dan Prasarana
  blocks.push({
    id: 'bab1-heading-sarpras',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-sarpras', type: 'TEXT', text: 'G. Sarana dan Prasarana' }]
  });

  blocks.push({
    id: 'bab1-paragraph-sarpras-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-sarpras-opening', type: 'TEXT', text: `Ketersediaan sarana dan prasarana yang memadai sangat menunjang kelancaran proses pembelajaran. ${profile.schoolName} berupaya menyediakan fasilitas yang mendukung pencapaian tujuan pendidikan.` }]
  });

  if (payload.infrastructure?.facilities && payload.infrastructure.facilities.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-sarpras-table-title',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-sarpras-table-title', type: 'TEXT', text: 'Tabel Sarana dan Prasarana' }]
    });

    const headerRow: TableRowNode = {
      id: 'bab1-table-sarpras-header',
      type: 'TABLE_ROW',
      cells: [
        { id: 'bab1-table-sarpras-h-1', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'No', id: 'bab1-table-sarpras-h-1-t' }] },
        { id: 'bab1-table-sarpras-h-2', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Nama Fasilitas', id: 'bab1-table-sarpras-h-2-t' }] },
        { id: 'bab1-table-sarpras-h-3', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Jumlah', id: 'bab1-table-sarpras-h-3-t' }] },
        { id: 'bab1-table-sarpras-h-4', type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: 'Kondisi', id: 'bab1-table-sarpras-h-4-t' }] }
      ]
    };

    const rows: TableRowNode[] = payload.infrastructure.facilities.map((fac, idx) => ({
      id: `bab1-table-sarpras-row-${idx}`,
      type: 'TABLE_ROW',
      cells: [
        { id: `bab1-table-sarpras-r-${idx}-c-1`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: (idx + 1).toString(), id: `bab1-table-sarpras-r-${idx}-c-1-t` }] },
        { id: `bab1-table-sarpras-r-${idx}-c-2`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: fac.facilityName, id: `bab1-table-sarpras-r-${idx}-c-2-t` }] },
        { id: `bab1-table-sarpras-r-${idx}-c-3`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: fac.quantity.toString(), id: `bab1-table-sarpras-r-${idx}-c-3-t` }] },
        { id: `bab1-table-sarpras-r-${idx}-c-4`, type: 'TABLE_CELL', nodes: [{ type: 'TEXT', text: fac.condition || 'Baik', id: `bab1-table-sarpras-r-${idx}-c-4-t` }] }
      ]
    }));

    const tableBlock: TableBlock = {
      id: 'bab1-table-sarpras',
      type: 'TABLE',
      head: [headerRow],
      body: [...rows]
    };

    blocks.push(tableBlock);
  }

  blocks.push({
    id: 'bab1-paragraph-sarpras-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab1-text-sarpras-closing', type: 'TEXT', text: `Seluruh sarana dan prasarana dikelola dan dipelihara secara berkala untuk memastikan keamanan, kenyamanan, serta fungsionalitasnya dalam mendukung kegiatan kurikuler, kokurikuler, maupun ekstrakurikuler.` }]
  });


  // Prestasi Satuan Pendidikan
  if (payload.achievements && payload.achievements.achievements && payload.achievements.achievements.length > 0) {
    blocks.push({
      id: 'bab1-heading-prestasi',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab1-text-heading-prestasi', type: 'TEXT', text: 'Prestasi Satuan Pendidikan' }]
    });

    blocks.push({
      id: 'bab1-paragraph-prestasi-opening',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-prestasi-opening', type: 'TEXT', text: `Berbagai prestasi yang telah diraih oleh peserta didik maupun pendidik ${profile.schoolName} menjadi bukti nyata dedikasi dan kualitas program pendidikan yang diselenggarakan:` }]
    });

    const prestasiItems: ListItemNode[] = payload.achievements.achievements.map((ach, idx) => ({
      id: `bab1-list-item-prestasi-${idx}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab1-text-prestasi-${idx}`, type: 'TEXT', text: `${ach.title}${ach.level ? ` (Tingkat ${ach.level})` : ''}${ach.year ? ` - Tahun ${ach.year}` : ''}` }]
    }));

    blocks.push({
      id: 'bab1-list-prestasi',
      type: 'LIST',
      ordered: false,
      items: prestasiItems
    });
  }

  // H. Program Unggulan
  if (payload.specialPrograms && payload.specialPrograms.programs && payload.specialPrograms.programs.length > 0) {
    blocks.push({
      id: 'bab1-heading-program-unggulan',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab1-text-heading-program-unggulan', type: 'TEXT', text: 'H. Program Unggulan' }]
    });

    blocks.push({
      id: 'bab1-paragraph-program-unggulan-opening',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-program-unggulan-opening', type: 'TEXT', text: `Dalam rangka meningkatkan kualitas pendidikan dan memberikan nilai tambah bagi peserta didik, ${profile.schoolName} menyelenggarakan berbagai program unggulan sebagai berikut:` }]
    });

    const programItems: ListItemNode[] = payload.specialPrograms.programs.map((prog, idx) => ({
      id: `bab1-list-item-program-${idx}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab1-text-program-${idx}`, type: 'TEXT', text: `${prog.name}: ${prog.description}` }]
    }));

    blocks.push({
      id: 'bab1-list-program-unggulan',
      type: 'LIST',
      ordered: false,
      items: programItems
    });
  }

  return {
    id: 'bab1-section-root',
    chapterId: 'BAB_I',
    title: 'Karakteristik Satuan Pendidikan',
    blocks
  };
}
