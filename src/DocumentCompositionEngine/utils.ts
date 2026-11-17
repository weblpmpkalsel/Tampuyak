export function generateId(type: string): string {
  return `${type.toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function sanitizeAndSummarize(text: string | null | undefined, maxWords: number): string {
  if (!text) return '-';
  
  let sanitized = text.replace(/https?:\/\/[^\s]+/g, '');
  sanitized = sanitized.replace(/guru\.kemendikdasmen\.go\.id/gi, '');
  
  const blacklist = [
    '\\bcara 1\\b', '\\bcara 2\\b', '\\bcara\\b', '\\bklik\\b', '\\bpanduan\\b', '\\btutorial\\b', 
    '\\bworksheet\\b', '\\bworkbook\\b', '\\blembar\\b', '\\bsheet\\b', '\\bpetunjuk\\b', 
    '\\bdownload\\b', '\\bunduh\\b', '\\breferensi pengisian\\b', '\\blangkah\\b',
    '\\bcontoh pengisian\\b', '\\bsebagai referensi\\b', '\\bdiisi dengan\\b',
    '\\bcara pengisian\\b', '\\bpertanyaan pemantik\\b', '\\bkumpulan materi\\b',
    '\\brencanakan upaya\\b', '\\brekomendasi keseluruhan\\b', '\\brekomendasi prioritas\\b',
    '\\banda dapat\\b', '\\bsilakan\\b', '\\bgunakan lembar\\b', '\\[contoh\\]',
    '\\bbuka tautan\\b', '\\btautan\\b'
  ];
  
  const blacklistRegexes = blacklist.map(pattern => new RegExp(pattern, 'i'));
  
  let lines = sanitized.split('\n');
  lines = lines.map(line => {
    const sentences = line.split(/(?<=\.)\s+/);
    const cleanSentences = sentences.filter(sentence => {
      return !blacklistRegexes.some(regex => regex.test(sentence));
    });
    return cleanSentences.join(' ');
  });
  
  sanitized = lines.filter(line => line.trim().length > 0).join(' ').trim();
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  if (!sanitized) return '-';

  let semantic = sanitized;

  semantic = semantic.replace(/^(Program|Kegiatan)\s+/i, '');

  const verbMap: Record<string, string> = {
    'meningkatkan': 'Penguatan',
    'peningkatan': 'Penguatan',
    'memperkuat': 'Penguatan',
    'mengembangkan': 'Pengembangan',
    'mengoptimalkan': 'Optimalisasi',
    'menyusun': 'Penyusunan',
    'melaksanakan': 'Pelaksanaan',
    'melakukan': 'Pelaksanaan',
    'menerapkan': 'Penerapan',
    'memanfaatkan': 'Pemanfaatan',
    'mengintegrasikan': 'Integrasi'
  };

  const termMap: Record<string, string> = {
    'komunitas belajar guru': 'komunitas belajar',
    'komunitas praktisi': 'komunitas belajar',
    'pembelajaran berdiferensiasi': 'pembelajaran berdiferensiasi',
    'berbasis asesmen diagnostik': '',
    'asesmen diagnostik': 'asesmen diagnostik',
    'dalam implementasi': 'dalam'
  };

  const firstWordMatch = semantic.match(/^([a-z]+)\b/i);
  if (firstWordMatch) {
    const fwLower = firstWordMatch[1].toLowerCase();
    if (verbMap[fwLower]) {
      semantic = semantic.replace(new RegExp(`^${firstWordMatch[1]}\\b`, 'i'), verbMap[fwLower]);
    }
  }

  const sortedTerms = Object.keys(termMap).sort((a, b) => b.length - a.length);
  for (const key of sortedTerms) {
    const value = termMap[key];
    semantic = semantic.replace(new RegExp(`\\b${key}\\b`, 'gi'), value);
  }

  semantic = semantic.replace(/\s+/g, ' ').trim();
  semantic = semantic.replace(/\s+\./g, '.');
  
  if (semantic.length > 0) {
    semantic = semantic.charAt(0).toUpperCase() + semantic.slice(1);
    
    if (!semantic.endsWith('.')) {
        semantic += '.';
    }
  }

  if (semantic === '.') return '-';

  return semantic;
}
