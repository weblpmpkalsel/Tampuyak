import { CanonicalObject } from '../SPKG';

export class NarrativeBuilder {
  private isInstructional(text: string): boolean {
    const instructionalKeywords = [
      '\\bcara 1\\b', '\\bcara 2\\b', '\\bcara\\b', '\\bgunakan lembar\\b', '\\blihat lembar\\b', '\\bklik\\b',
      '\\bsilakan\\b', '\\bunduh\\b', '\\bdownload\\b', '\\btautan\\b', '\\bbuka tautan\\b', 'https://', 'http://',
      'guru\\.kemendikdasmen', 'raporpendidikan', '\\bworksheet\\b', '\\bworkbook\\b', '\\bsheet\\b', '\\blembar\\b',
      '\\bpetunjuk\\b', '\\bpanduan\\b', '\\btemplate\\b', '\\blembar ini\\b', '\\bkolom ini\\b',
      '\\bcontoh pengisian\\b', '\\bsebagai referensi\\b', '\\bdiisi dengan\\b', '\\bcara pengisian\\b',
      '\\bpertanyaan pemantik\\b', '\\blangkah-langkah\\b', '\\bisikan\\b', '\\btutorial\\b',
      '\\brekomendasi keseluruhan\\b', '\\brekomendasi prioritas\\b', '\\banda dapat\\b', '\\[contoh\\]',
      '\\bkumpulan materi\\b', '\\brencanakan upaya\\b'
    ];
    const regexes = instructionalKeywords.map(pattern => new RegExp(pattern, 'i'));
    return regexes.some(regex => regex.test(text));
  }

  private cleanNarrative(text: string): string {
    const lines = text.split(/(?<=[.!?])\s+|\n+/);
    const validLines = lines.filter(line => {
      const lower = line.toLowerCase();
      return !this.isInstructional(line) && line.trim().length > 0 && !lower.includes('ind-');
    });
    
    let cleaned = validLines.join(' ').replace(/\s+/g, ' ').trim();
    cleaned = cleaned.replace(/IND-\d+/gi, '');
    cleaned = cleaned.replace(/Recommendation \d+/gi, '');
    cleaned = cleaned.replace(/Capaian\s*\(\-\)/gi, '');
    cleaned = cleaned.replace(/Trend\s*\(\-\)/gi, '');
    cleaned = cleaned.replace(/\bNode\b/gi, '');
    cleaned = cleaned.replace(/\bObject\b/gi, '');
    cleaned = cleaned.replace(/\bParser\b/gi, '');
    return cleaned.replace(/\s+/g, ' ').trim();
  }

  private extractTheme(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('literasi')) return 'Literasi';
    if (lowerText.includes('numerasi')) return 'Numerasi';
    if (lowerText.includes('karakter')) return 'Karakter';
    if (lowerText.includes('kepemimpinan')) return 'Kepemimpinan';
    if (lowerText.includes('guru') || lowerText.includes('pendidik')) return 'Pendidik dan Tenaga Kependidikan';
    if (lowerText.includes('pembelajaran')) return 'Proses Pembelajaran';
    if (lowerText.includes('asesmen')) return 'Asesmen Pembelajaran';
    if (lowerText.includes('digital') || lowerText.includes('tik')) return 'Digitalisasi Sekolah';
    if (lowerText.includes('sarana') || lowerText.includes('prasarana')) return 'Sarana dan Prasarana';
    if (lowerText.includes('mitra') || lowerText.includes('kemitraan') || lowerText.includes('orang tua')) return 'Kemitraan';
    if (lowerText.includes('iklim') || lowerText.includes('keamanan') || lowerText.includes('kebinekaan') || lowerText.includes('inklusi') || lowerText.includes('kekerasan')) return 'Iklim Lingkungan Belajar';
    return 'Manajemen Tata Kelola';
  }

  private getDeterministicVariant(seedString: string, variants: string[]): string {
    let sum = 0;
    for (let i = 0; i < seedString.length; i++) {
      sum += seedString.charCodeAt(i);
    }
    return variants[sum % variants.length];
  }

  private composeThemeNarrative(theme: string, nodes: CanonicalObject[], type: string): string {
    const intros = [
      `Pada aspek ${theme}, capaian satuan pendidikan merefleksikan kondisi fundamental yang memerlukan perhatian strategis.`,
      `Menelaah dimensi ${theme}, terlihat adanya urgensi untuk merekalibrasi tata kelola dan implementasi program agar lebih berdampak.`,
      `Dalam hal ${theme}, evaluasi objektif memperlihatkan pola yang membutuhkan intervensi spesifik guna menjamin keselarasan dengan Standar Nasional Pendidikan.`,
      `Tinjauan terhadap elemen ${theme} menegaskan kembali pentingnya penguatan kapasitas kelembagaan secara berkelanjutan.`
    ];
    const intro = this.getDeterministicVariant(theme + 'intro', intros);

    let evidence = '';
    let interpretation = '';
    let rootCause = '';
    let implication = '';
    let direction = '';

    if (type === 'Indicator') {
      let validCount = 0;
      let trendInfo = '';
      nodes.forEach(n => {
        const desc = n.description || '';
        if (desc.includes('Capaian:') && !desc.includes('(-)')) {
          validCount++;
          if (desc.toLowerCase().includes('naik')) trendInfo = 'menunjukkan tren peningkatan';
          if (desc.toLowerCase().includes('turun')) trendInfo = 'mengalami tren penurunan yang memerlukan mitigasi';
        }
      });

      if (validCount > 0) {
        evidence = `Berdasarkan bukti empiris capaian kinerja, indikator pada area ini telah terpetakan secara sistemik. Dinamika yang terekam, termasuk di antaranya capaian yang ${trendInfo || 'cenderung fluktuatif'}, menjadi landasan utama analisis.`;
      } else {
        evidence = `Berdasarkan data yang tersedia, indikator ini belum memiliki data pembanding yang memadai sehingga analisis difokuskan pada rekomendasi prioritas yang diterbitkan dalam Rapor Pendidikan.`;
      }
      
      const interpretations = [
        `Secara pedagogis dan manajerial, profil tersebut mengindikasikan bahwa proses transformasi mutu belum sepenuhnya merata di seluruh lini layanan sekolah.`,
        `Kondisi ini merepresentasikan realitas operasional di mana eksekusi standar pelayanan pendidikan masih menemui berbagai kendala struktural.`,
        `Dari perspektif mutu, hal ini mencerminkan dinamika adaptasi kelembagaan yang masih berada pada fase transisi menuju perbaikan.`
      ];
      interpretation = this.getDeterministicVariant(theme + 'interp', interpretations);

      const rootCauses = [
        `Akar permasalahan yang melatarbelakangi kesenjangan ini ditengarai bersumber pada belum optimalnya pendayagunaan sumber daya dan pendekatan instruksional yang kurang adaptif terhadap kebutuhan ekosistem belajar.`,
        `Penelusuran lebih lanjut menunjukkan bahwa faktor utama yang menghambat adalah kurangnya sinkronisasi antara perencanaan strategis dengan implementasi harian di ruang kelas.`,
        `Kondisi ini dipicu oleh keterbatasan dalam pengembangan kompetensi internal serta belum terbangunnya budaya evaluasi diri yang kuat.`
      ];
      rootCause = this.getDeterministicVariant(theme + 'root', rootCauses);

      const implications = [
        `Implikasi dari kondisi ini adalah tingginya risiko stagnasi pada luaran pembelajaran jika tidak segera ditindaklanjuti secara komprehensif.`,
        `Dampak langsungnya terlihat pada lambatnya pencapaian target mutu, yang menuntut adanya intervensi korektif secara terstruktur.`,
        `Bila tidak diurai secara sistemik, kerentanan ini berpotensi menghambat peningkatan kualitas dan daya saing lulusan secara akumulatif.`
      ];
      implication = this.getDeterministicVariant(theme + 'imp', implications);

      const directions = [
        `Oleh karena itu, strategi perbaikan diarahkan pada penguatan kompetensi, penyediaan daya dukung yang memadai, serta pelibatan aktif seluruh pemangku kepentingan dalam perencanaan yang terfokus.`,
        `Sebagai solusi fundamental, satuan pendidikan memprioritaskan redesain program yang berorientasi pada hasil terukur (outcome-based) dan penguatan kapasitas kelembagaan.`,
        `Untuk itu, langkah taktis yang ditempuh berfokus pada pendampingan intensif dan optimalisasi manajemen berbasis sekolah guna menghadirkan transformasi yang nyata.`
      ];
      direction = this.getDeterministicVariant(theme + 'dir', directions);

    } else if (type === 'IRB' || type === 'Recommendation') {
      const evidences = [
        `Telaah mendalam terhadap hasil evaluasi menunjukkan adanya kendala struktural maupun operasional yang spesifik pada area ini.`,
        `Identifikasi kebutuhan perbaikan menyoroti berbagai aspek yang memerlukan pembenahan mendesak di tingkat satuan pendidikan.`,
        `Berdasarkan sintesis data kinerja, teridentifikasi sejumlah celah kualitas yang menuntut penyelesaian strategis.`
      ];
      evidence = this.getDeterministicVariant(theme + 'ev2', evidences);

      const interpretations = [
        `Hal ini bermakna bahwa praktik baik yang telah diinisiasi belum bertransformasi menjadi budaya mutu yang mapan, sehingga masih menyisakan ruang kerentanan.`,
        `Kondisi ini menggarisbawahi belum terciptanya kesinambungan antara komitmen awal dengan konsistensi eksekusi program layanan.`,
        `Realitas ini menandaskan pentingnya menjembatani visi kelembagaan dengan realitas kapasitas sumber daya yang tersedia.`
      ];
      interpretation = this.getDeterministicVariant(theme + 'interp2', interpretations);

      const rootCauses = [
        `Penelusuran kausalitas menegaskan bahwa akar masalah bertumpu pada kelemahan manajerial serta kesenjangan kapasitas sumber daya manusia dalam menerjemahkan kebijakan menjadi aksi nyata di ruang kelas.`,
        `Secara fundamental, hal ini diakibatkan oleh sistem penjaminan mutu internal yang belum berjalan efektif dalam memonitor setiap tahapan proses pembelajaran.`,
        `Kelemahan pada dimensi pengawasan dan evaluasi program ditengarai menjadi faktor determinan yang memperlebar kesenjangan capaian.`
      ];
      rootCause = this.getDeterministicVariant(theme + 'root2', rootCauses);

      const implications = [
        `Dampak langsung dari situasi ini adalah kurang optimalnya penyerapan materi oleh peserta didik dan terhambatnya pencapaian profil kompetensi lulusan.`,
        `Kondisi ini berimplikasi pada belum terwujudnya iklim pembelajaran yang berpihak pada kebutuhan individual siswa.`,
        `Sebagai akibatnya, capaian standar kompetensi seringkali tertunda, yang pada akhirnya membatasi efektivitas layanan pendidikan secara keseluruhan.`
      ];
      implication = this.getDeterministicVariant(theme + 'imp2', implications);

      const directions = [
        `Menyikapi hal tersebut, satuan pendidikan mengartikulasikan langkah taktis berupa intervensi strategis yang terstruktur, guna memastikan penyelesaian akar masalah secara tuntas dan berkelanjutan.`,
        `Untuk mengurai persoalan ini, perumusan kebijakan diarahkan pada penguatan kompetensi esensial dan reviu berkala terhadap metode operasional sekolah.`,
        `Oleh karena itu, strategi penanganan difokuskan pada pembenahan manajemen tata kelola dan peningkatan kapasitas pendidik secara terintegrasi.`
      ];
      direction = this.getDeterministicVariant(theme + 'dir2', directions);

    } else if (type === 'SWOT') {
      evidence = `Pemetaan lingkungan internal dan eksternal memberikan gambaran utuh mengenai posisi strategis sekolah saat ini.`;
      interpretation = `Keberadaan kekuatan dan peluang merepresentasikan daya ungkit yang dapat dimaksimalkan, sementara kelemahan dan ancaman merupakan area kritis yang tidak dapat diabaikan.`;
      rootCause = `Kerentanan pada aspek kelemahan umumnya dipicu oleh inersia institusional dan terbatasnya inovasi, sedangkan ancaman eksternal seringkali hadir karena kurangnya adaptasi terhadap perubahan kebijakan sektoral.`;
      implication = `Jika pemetaan ini tidak ditindaklanjuti, satuan pendidikan berisiko kehilangan momentum untuk berkembang dan berpotensi mengalami regresi mutu layanan.`;
      direction = `Dengan demikian, perumusan program kerja diprioritaskan pada integrasi keunggulan komparatif dengan mitigasi risiko yang ketat, guna memastikan organisasi tetap tangguh dan responsif.`;

    } else if (type === 'Priority' || type === 'StrategicObjective' || type === 'Program' || type === 'Activity') {
      evidence = `Prioritisasi pada dimensi ini merupakan manifestasi dari komitmen sekolah dalam menindaklanjuti hasil evaluasi Rapor Pendidikan secara proporsional.`;
      interpretation = `Langkah ini menggambarkan kesadaran kolektif bahwa intervensi harus dikonsentrasikan pada area yang memiliki dampak (multiplier effect) terbesar terhadap perbaikan sistem.`;
      rootCause = `Keputusan ini diambil untuk memutus rantai inefisiensi dan ketidakteraturan program yang selama ini ditengarai menjadi pemicu rendahnya capaian standar mutu.`;
      implication = `Tanpa penentuan sasaran yang tajam, eksekusi program rentan kehilangan arah dan berpotensi bermuara pada inefektivitas serapan anggaran.`;
      direction = `Sebagai tindak lanjut, setiap aktivitas operasional telah dirancang secara presisi dengan mempedomani parameter keberhasilan yang jelas, demi menghadirkan perubahan nyata di lapangan.`;

    } else {
      evidence = `Analisis menyeluruh pada aspek ini memberikan wawasan penting terkait arsitektur mutu satuan pendidikan.`;
      interpretation = `Temuan yang ada menandaskan perlunya penyelarasan antara visi kelembagaan dengan realitas operasional.`;
      rootCause = `Kesenjangan yang terjadi umumnya bermula dari rantai koordinasi yang terputus serta kurangnya sinkronisasi dalam perencanaan awal.`;
      implication = `Hal ini berimplikasi pada krusialnya upaya penguatan tata kelola dan sistem penjaminan mutu internal secara masif.`;
      direction = `Oleh sebab itu, arah kebijakan strategis difokuskan pada pengarusutamaan perbaikan berkelanjutan di seluruh lini layanan.`;
    }

    return `${intro} ${evidence} ${interpretation} ${rootCause} ${implication} ${direction}`;
  }

  public buildNarrative(nodes: CanonicalObject[]): string[] {
    const validNodes = nodes.filter(node => {
      const textToClean = (node.description || '') + ' ' + (node.title || '');
      const cleaned = this.cleanNarrative(textToClean);
      return cleaned.trim() !== '';
    });

    if (validNodes.length === 0) return [];

    const type = validNodes[0].type;
    const nonThematicTypes = ['Background', 'Vision', 'Mission', 'LegalBasis', 'PlanningMethodology', 'Purpose', 'Evaluation', 'Monitoring', 'Target', 'IndicatorSuccess', 'Risk', 'Mitigation', 'Budget', 'RKAS', 'FundingSource', 'FinancialSustainability', 'Implementation', 'ContinuousImprovement'];
    
    if (nonThematicTypes.includes(type)) {
       if (['Target', 'IndicatorSuccess'].includes(type)) {
         return ['Penetapan target dan indikator keberhasilan dilakukan secara terukur (SMART), menjamin setiap program memiliki parameter evaluasi yang definitif. Pendekatan ini menegaskan komitmen sekolah terhadap transparansi dan akuntabilitas kinerja berkelanjutan.'];
       } else if (['Risk', 'Mitigation'].includes(type)) {
         return ['Identifikasi potensi risiko dan perumusan strategi mitigasi komprehensif merupakan wujud tata kelola sekolah yang proaktif dan antisipatif. Langkah ini memastikan kelangsungan dan efektivitas program di tengah dinamika perubahan kebijakan maupun tantangan operasional lapangan.'];
       } else if (['Budget', 'RKAS', 'FundingSource'].includes(type)) {
         return ['Struktur anggaran dirancang dengan memegang teguh prinsip efisiensi, efektivitas, dan keberpihakan mutlak pada peningkatan mutu pembelajaran. Alokasi pembiayaan diarahkan secara proporsional untuk mendukung intervensi strategis yang diyakini memiliki daya ungkit tertinggi terhadap pencapaian target standar.'];
       }
       return validNodes.map(node => this.cleanNarrative(node.description || node.title || ''));
    }

    const groupedByTheme: { [theme: string]: CanonicalObject[] } = {};
    for (const node of validNodes) {
       const textToClean = (node.description || '') + ' ' + (node.title || '');
       const cleanedDesc = this.cleanNarrative(textToClean);
       const theme = this.extractTheme(cleanedDesc);
       if (!groupedByTheme[theme]) groupedByTheme[theme] = [];
       groupedByTheme[theme].push(node);
    }

    const paragraphs: string[] = [];
    for (const [theme, themeNodes] of Object.entries(groupedByTheme)) {
       paragraphs.push(this.composeThemeNarrative(theme, themeNodes, type));
    }
    
    return paragraphs;
  }
}

