import { CanonicalKnowledgeGraph, CanonicalPlanning, CanonicalBudget, CanonicalRecommendation, CanonicalSchool, CanonicalIndicator } from "./EducationReportParser";

export interface SWOTItem {
    category: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
    evidence: string;
    recommendationSource?: string;
    confidence: number;
    reasoning: string;
    sourceRecommendationIds?: string[];
    sourceIndicatorIds?: string[];
    sourceIRBIds?: string[];
    confidenceScore?: number;
}

export interface IRBRecord {
    problem: string;
    evidence: string;
    rootCause: string;
    improvementStrategy: string;
    responsibleUnit: string;
    expectedResult: string;
    priorityLevel: string;
}

export interface StrategicObjective {
    id: string;
    objective: string;
    baseline: string;
    target: string;
    successIndicator: string;
    responsibleUnit: string;
    risk: string;
    mitigation: string;
    timeline: string;
    canonicalReferences: string[];
}

export interface GeneratedProgram {
    id: string;
    objectiveId: string;
    name: string;
    description: string;
    output: string;
    outcome: string;
    impact: string;
    responsibleUnit: string;
    timeline: string;
    risk?: string;
    mitigation?: string;
    canonicalReferences?: string[];
}

export interface GeneratedActivity {
    id: string;
    programId: string;
    name: string;
    schedule: string;
    output: string;
    successIndicator: string;
    budgetCategory: string;
    risk: string;
    mitigation: string;
    personInCharge?: string;
    canonicalReferences?: string[];
}

export interface GeneratedBudget {
    id: string;
    activityId: string;
    accountCategory: string;
    fundingSource: string;
    estimatedCost: string;
    unit: string;
    volume: string;
    priority: string;
    budgetNarrative: string;
    canonicalReferences?: string[];
    allocatedAmount?: number | string;
}

export class PlanningIntelligenceEngine {
    
    // STEP 1: SWOT ENGINE
    static generateSWOT(canonical: any): SWOTItem[] {
        const { schoolData, indicators, recommendations } = canonical;
        const swot: SWOTItem[] = [];
        
        if (indicators && Array.isArray(indicators) && indicators.length > 0) {
            // Priority 1: Indicators
            indicators.forEach((ind: any) => {
                const scoreRaw = ind.score || ind.value || ind.nilai;
                const score = scoreRaw ? parseFloat(scoreRaw) : NaN;
                
                if ((!isNaN(score) && score >= 80) || ind.category === 'Hijau') {
                    swot.push({
                        category: 'Strength',
                        evidence: `Indikator ${ind.name || ind.id} mencapai skor ${scoreRaw || 'Baik'}`,
                        confidence: 90,
                        reasoning: 'Skor di atas rata-rata atau kategori Hijau menunjukkan kekuatan sekolah.'
                    });
                } else if ((!isNaN(score) && score < 60) || ind.category === 'Merah') {
                    swot.push({
                        category: 'Weakness',
                        evidence: `Indikator ${ind.name || ind.id} memiliki skor ${scoreRaw || 'Kurang'}`,
                        confidence: 95,
                        reasoning: 'Skor di bawah standar nasional mengindikasikan area kelemahan yang perlu diintervensi.'
                    });
                } else if (ind.trend === 'Naik') {
                    swot.push({
                        category: 'Opportunity',
                        evidence: `Indikator ${ind.name || ind.id} menunjukkan tren Naik`,
                        confidence: 85,
                        reasoning: 'Tren positif dapat dimanfaatkan untuk percepatan peningkatan mutu.'
                    });
                } else if (ind.trend === 'Turun') {
                    swot.push({
                        category: 'Threat',
                        evidence: `Indikator ${ind.name || ind.id} menunjukkan tren Turun`,
                        confidence: 85,
                        reasoning: 'Tren negatif dapat menjadi ancaman jika tidak segera diatasi.'
                    });
                } else {
                    swot.push({
                        category: 'Weakness',
                        evidence: `Capaian pada indikator ${ind.name || ind.id} perlu ditingkatkan`,
                        confidence: 70,
                        reasoning: 'Berdasarkan prioritas indikator rapor pendidikan.'
                    });
                }
            });
            
            // Build SWOT using indicators AND recommendations
            if (recommendations && Array.isArray(recommendations)) {
                 recommendations.forEach((rec: any) => {
                     swot.push({
                         category: 'Opportunity',
                         evidence: `Peluang perbaikan: ${rec.problem || rec.name}`,
                         confidence: 80,
                         reasoning: `Rekomendasi tindakan: ${rec.recommendation || rec.benahi}`
                     });
                 });
            }
        } else if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
            // Priority 2: Recommendations
            recommendations.forEach((rec: any) => {
                 swot.push({
                     category: 'Weakness',
                     evidence: `Masalah teridentifikasi: ${rec.problem || rec.name}`,
                     confidence: 90,
                     reasoning: `Akar masalah: ${rec.rootCause || 'Kelemahan spesifik'}`
                 });
                 if (rec.recommendation || rec.benahi) {
                     swot.push({
                         category: 'Opportunity',
                         evidence: `Peluang perbaikan melalui program: ${rec.recommendation || rec.benahi}`,
                         confidence: 85,
                         reasoning: 'Terdapat arahan rekomendasi untuk perbaikan'
                     });
                 }
            });
        } else {
            // Priority 3: IRB
            const irbData = PlanningIntelligenceEngine.generateIRB(canonical);
            if (irbData && irbData.length > 0) {
                irbData.forEach(irb => {
                     swot.push({
                         category: 'Weakness',
                         evidence: irb.problem,
                         confidence: 80,
                         reasoning: irb.rootCause
                     });
                });
            }
        }
        
        return swot;
    }

    // SWOT OPTIMIZATION ENGINE
    static optimizeSWOT(swot: SWOTItem[]): SWOTItem[] {
        const preTotal = swot.length;
        const preStrength = swot.filter(s => s.category === 'Strength').length;
        const preWeakness = swot.filter(s => s.category === 'Weakness').length;
        const preOpportunity = swot.filter(s => s.category === 'Opportunity').length;
        const preThreat = swot.filter(s => s.category === 'Threat').length;

        (/* console.log removed */ (..._args: any[]) => {})(`\nSWOT BEFORE OPTIMIZATION\nTotal:\n${preTotal}\nStrength:\n${preStrength}\nWeakness:\n${preWeakness}\nOpportunity:\n${preOpportunity}\nThreat:\n${preThreat}\n`);

        const themes = [
            { key: "Numerasi", keywords: ["numerasi", "matematika", "angka", "hitungan", "A.2"] },
            { key: "Literasi", keywords: ["literasi", "membaca", "baca", "teks", "A.1"] },
            { key: "Karakter", keywords: ["karakter", "sikap", "perilaku", "moral", "agama", "pancasila", "iman", "A.3"] },
            { key: "Iklim Sekolah", keywords: ["iklim", "keamanan", "perundungan", "kebinekaan", "inklusivitas", "kekerasan", "D.1", "D.2", "D.3", "D.4", "D.8", "E.1", "E.2", "E.3"] },
            { key: "Kepemimpinan", keywords: ["kepemimpinan", "kepala sekolah", "manajemen", "visi", "E.5", "E.4"] },
            { key: "Guru", keywords: ["guru", "pendidik", "pengajar", "pedagogik", "profesional", "gtk", "C.1", "C.2", "C.3", "C.8", "D.17"] },
            { key: "Sarana", keywords: ["sarana", "prasarana", "fasilitas", "bangunan", "perpustakaan", "tht"] },
            { key: "Digitalisasi", keywords: ["digital", "teknologi", "komputer", "internet", "tik", "platform"] },
            { key: "Kemitraan", keywords: ["mitra", "orang tua", "masyarakat", "komite", "industri", "du/di", "E.6"] },
            { key: "Lainnya", keywords: [] }
        ];

        const optimized: SWOTItem[] = [];
        const categories = ['Strength', 'Weakness', 'Opportunity', 'Threat'];

        categories.forEach(category => {
            const items = swot.filter(s => s.category === category);
            
            // Group by theme
            const grouped = new Map<string, SWOTItem[]>();
            items.forEach(item => {
                const text = (item.evidence + " " + item.reasoning).toLowerCase();
                let assignedTheme = "Lainnya";
                for (const theme of themes) {
                    if (theme.keywords.length > 0 && theme.keywords.some(k => text.includes(k.toLowerCase()))) {
                        assignedTheme = theme.key;
                        break;
                    }
                }
                if (!grouped.has(assignedTheme)) grouped.set(assignedTheme, []);
                grouped.get(assignedTheme)!.push(item);
            });

            const mergedCategoryItems: SWOTItem[] = [];

            grouped.forEach((themeItems, theme) => {
                if (themeItems.length === 0) return;

                // Sort items by a simulated importance/confidence score
                themeItems.sort((a, b) => b.confidence - a.confidence);
                
                const rep = themeItems[0];
                
                let summaryEvidence = rep.evidence;
                if (themeItems.length > 1) {
                    // Refine statements to be high-level if multiple indicators hit the same theme
                    if (category === 'Strength') summaryEvidence = `Capaian positif pada area ${theme} (Dikelompokkan dari ${themeItems.length} indikator)`;
                    else if (category === 'Weakness') summaryEvidence = `Tantangan kinerja pada area ${theme} yang perlu ditingkatkan (Dikelompokkan dari ${themeItems.length} kelemahan)`;
                    else if (category === 'Opportunity') summaryEvidence = `Peluang perbaikan mutu pada area ${theme} melalui intervensi terarah (Dikelompokkan dari ${themeItems.length} rekomendasi)`;
                    else if (category === 'Threat') summaryEvidence = `Ancaman tren penurunan pada area ${theme} (Dikelompokkan dari ${themeItems.length} indikator)`;
                }

                mergedCategoryItems.push({
                    category: category as any,
                    evidence: summaryEvidence,
                    confidence: rep.confidence,
                    reasoning: `Hasil optimasi dan sintesis dari ${themeItems.length} item terkait ${theme}. ` + rep.reasoning,
                    sourceIndicatorIds: [],
                    sourceRecommendationIds: [],
                    sourceIRBIds: [],
                    confidenceScore: rep.confidence + (themeItems.length * 5)
                });
            });

            // Rank by confidenceScore and limit
            mergedCategoryItems.sort((a, b) => (b.confidenceScore || 0) - (a.confidenceScore || 0));
            optimized.push(...mergedCategoryItems.slice(0, 8)); // Max 8 per category
        });

        const postTotal = optimized.length;
        const postStrength = optimized.filter(s => s.category === 'Strength').length;
        const postWeakness = optimized.filter(s => s.category === 'Weakness').length;
        const postOpportunity = optimized.filter(s => s.category === 'Opportunity').length;
        const postThreat = optimized.filter(s => s.category === 'Threat').length;

        (/* console.log removed */ (..._args: any[]) => {})(`\nSWOT AFTER OPTIMIZATION\nTotal:\n${postTotal}\nStrength:\n${postStrength}\nWeakness:\n${postWeakness}\nOpportunity:\n${postOpportunity}\nThreat:\n${postThreat}\n`);

        return optimized;
    }

    // STEP 2: IRB ENGINE
    static generateIRB(canonical: any): IRBRecord[] {
        const { recommendations, indicators } = canonical;
        const irb: IRBRecord[] = [];
        
        if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
            recommendations.forEach((rec: any) => {
                 irb.push({
                     problem: rec.problem || rec.name || 'Identifikasi Masalah',
                     evidence: 'Merujuk pada rapor pendidikan',
                     rootCause: rec.rootCause || rec.akarPenyebab || 'Perlu analisis mendalam',
                     improvementStrategy: rec.recommendation || rec.benahi || 'Perumusan program perbaikan',
                     responsibleUnit: 'Tim Penjaminan Mutu Sekolah',
                     expectedResult: 'Peningkatan capaian indikator',
                     priorityLevel: 'Tinggi'
                 });
            });
        } else if (indicators && Array.isArray(indicators) && indicators.length > 0) {
            // Generate IRB analytically from lowest indicators
            const weakIndicators = indicators.filter((ind: any) => {
                const score = parseFloat(ind.score || ind.value || ind.nilai);
                return (!isNaN(score) && score < 60) || ind.category === 'Merah' || ind.trend === 'Turun';
            });
            
            // If no clear weaknesses, pick the first few to have at least something
            const targetIndicators = weakIndicators.length > 0 ? weakIndicators : indicators.slice(0, 3);
            
            targetIndicators.forEach((ind: any) => {
                irb.push({
                    problem: `Capaian rendah pada indikator ${ind.name || ind.id}`,
                    evidence: `Skor: ${ind.score || ind.value || ind.nilai || 'Tidak tersedia'}`,
                    rootCause: 'Kapasitas dan proses pembelajaran belum optimal',
                    improvementStrategy: 'Peningkatan kompetensi dan perbaikan layanan',
                    responsibleUnit: 'Tim Penjaminan Mutu Sekolah',
                    expectedResult: 'Peningkatan skor dan capaian indikator menjadi Hijau',
                    priorityLevel: 'Tinggi'
                });
            });
        }
        
        return irb;
    }

    // STEP 3: STRATEGIC OBJECTIVES
    static generateStrategicObjectives(swot: SWOTItem[], irb: IRBRecord[]): StrategicObjective[] {
        const objectives: StrategicObjective[] = [];
        const seenObjectives = new Set<string>();
        let objCounter = 1;
        
        irb.forEach((item, idx) => {
            const problemLower = item.problem.toLowerCase();
            const objectiveText = `Meningkatkan capaian numerasi dan literasi peserta didik secara terukur pada area ${item.problem} hingga mencapai kategori Baik berdasarkan Rapor Pendidikan`;
            
            if (!seenObjectives.has(objectiveText)) {
                seenObjectives.add(objectiveText);
                objectives.push({
                    id: `OBJ-${objCounter++}`,
                    objective: `Meningkatkan capaian pada area ${item.problem} peserta didik hingga mencapai kategori Baik berdasarkan evaluasi Rapor Pendidikan`,
                    baseline: 'Di bawah capaian minimum standar nasional',
                    target: 'Kategori Baik (Hijau) pada siklus evaluasi berikutnya',
                    successIndicator: `Skor rapor pendidikan untuk dimensi ${item.problem} meningkat minimal 10 poin atau naik satu peringkat kategori`,
                    responsibleUnit: item.responsibleUnit,
                    risk: 'Keterbatasan waktu pendidik dalam mendampingi kegiatan di luar jam pelajaran efektif',
                    mitigation: 'Pengintegrasian kegiatan peningkatan mutu ke dalam kegiatan intrakurikuler dan kokurikuler',
                    timeline: '1 Tahun Ajaran',
                    canonicalReferences: []
                });
            }
        });
        
        return objectives;
    }

    // STEP 4: PROGRAM GENERATOR
    static generatePrograms(objectives: StrategicObjective[]): GeneratedProgram[] {
        const programs: GeneratedProgram[] = [];
        const seenPrograms = new Set<string>();
        let progCounter = 1;
        
        objectives.forEach((obj, idx) => {
            let programName = 'Program Penguatan Kompetensi Sekolah';
            const problemLower = obj.objective.toLowerCase();
            
            if (problemLower.includes('literasi')) {
                programName = 'Program Penguatan Literasi';
            } else if (problemLower.includes('numerasi')) {
                programName = 'Program Penguatan Numerasi Sekolah';
            } else if (problemLower.includes('guru') || problemLower.includes('pendidik')) {
                programName = 'Program Pengembangan Kompetensi Guru';
            } else if (problemLower.includes('kepemimpinan') || problemLower.includes('kepala')) {
                programName = 'Program Optimalisasi Tata Kelola';
            } else if (problemLower.includes('karakter')) {
                programName = 'Program Pembinaan Karakter Siswa';
            } else if (problemLower.includes('iklim') || problemLower.includes('keamanan') || problemLower.includes('kekerasan')) {
                programName = 'Program Penguatan Budaya Positif';
            } else if (problemLower.includes('kemitraan') || problemLower.includes('mitra')) {
                programName = 'Program Kemitraan Sekolah';
            } else if (problemLower.includes('digital') || problemLower.includes('teknologi')) {
                programName = 'Program Digitalisasi Pembelajaran';
            } else {
                const cleanedProblem = obj.objective.replace('Meningkatkan capaian pada area ', '').replace(' peserta didik hingga mencapai kategori Baik berdasarkan evaluasi Rapor Pendidikan', '').substring(0, 30);
                programName = `Program Akselerasi Mutu: ${cleanedProblem}`;
            }

            if (!seenPrograms.has(programName)) {
                seenPrograms.add(programName);
                programs.push({
                    id: `PROG-${progCounter++}`,
                    objectiveId: obj.id,
                    name: programName,
                    description: `Program sistematis yang dirancang untuk mendukung ketercapaian tujuan: ${obj.objective}`,
                    output: 'Tersedianya dokumen perencanaan, pelaksanaan, dan instrumen evaluasi yang relevan',
                    outcome: obj.successIndicator,
                    impact: 'Peningkatan layanan pendidikan dan capaian belajar siswa secara komprehensif',
                    responsibleUnit: obj.responsibleUnit,
                    timeline: obj.timeline,
                    risk: 'Pelaksanaan tidak konsisten akibat padatnya kegiatan rutin sekolah',
                    mitigation: 'Penyusunan jadwal yang terintegrasi di kalender pendidikan sekolah',
                    canonicalReferences: obj.canonicalReferences || []
                });
            }
        });
        
        return programs;
    }

    // STEP 5: ACTIVITY GENERATOR
    static generateActivities(programs: GeneratedProgram[]): GeneratedActivity[] {
        const activities: GeneratedActivity[] = [];
        let actCounter = 1;
        const seenActivities = new Set<string>();
        
        programs.forEach(prog => {
            const actTemplates = [
                { name: `Peningkatan Kompetensi Guru (In-House Training)`, cat: 'Pengembangan SDM' },
                { name: `Pelaksanaan Komunitas Belajar (Kombel) Secara Rutin`, cat: 'Pengembangan SDM' },
                { name: `Supervisi Akademik dan Mentoring`, cat: 'Monitoring' },
                { name: `Evaluasi Program dan Refleksi Bersama`, cat: 'Evaluasi' }
            ];
            
            actTemplates.forEach(template => {
                 const uniqueName = `${template.name} - ${prog.name}`;
                 if (!seenActivities.has(uniqueName)) {
                     seenActivities.add(uniqueName);
                     activities.push({
                         id: `ACT-${actCounter++}`,
                         programId: prog.id,
                         name: template.name,
                         schedule: 'Semester 1 & 2',
                         output: 'Dokumen absensi, notulensi, dan laporan keterlaksanaan',
                         successIndicator: 'Tingkat partisipasi guru mencapai 90% dan terdapat rencana tindak lanjut',
                         budgetCategory: template.cat,
                         risk: 'Peserta kurang fokus karena beban kerja lain',
                         mitigation: 'Fasilitasi kegiatan interaktif dan pemberian penghargaan',
                         personInCharge: prog.responsibleUnit || 'Kepala Sekolah',
                         canonicalReferences: prog.canonicalReferences || []
                     });
                 }
            });
        });
        
        return activities;
    }

    // STEP 6: RKAS GENERATOR
    static generateRKAS(activities: GeneratedActivity[]): GeneratedBudget[] {
        const budgets: GeneratedBudget[] = [];
        let budgetCounter = 1;
        const seenBudgets = new Set<string>();
        
        activities.forEach(act => {
            const budgetIdKey = `${act.programId}-${act.name}`;
            if (!seenBudgets.has(budgetIdKey)) {
                seenBudgets.add(budgetIdKey);
                
                let cost = '1000000';
                let vol = '1';
                if (act.name.includes('Training') || act.name.includes('Workshop')) {
                    cost = '2500000';
                    vol = '2';
                } else if (act.name.includes('Kombel')) {
                    cost = '500000';
                    vol = '10';
                }
                
                budgets.push({
                     id: `BUD-${budgetCounter++}`,
                     activityId: act.id,
                     accountCategory: 'Belanja Barang dan Jasa',
                     fundingSource: 'BOS Reguler',
                     estimatedCost: cost,
                     unit: 'Kegiatan',
                     volume: vol,
                     priority: 'Tinggi',
                     budgetNarrative: `Pendanaan untuk mendukung ${act.name} termasuk pengadaan materi, narasumber, dan konsumsi.`,
                     canonicalReferences: act.canonicalReferences || []
                });
            }
        });
        
        return budgets;
    }

    // STEP 8: DOCUMENT VALIDATION is done dynamically checking these arrays
    static validateDocument(swot: SWOTItem[], objectives: StrategicObjective[], programs: GeneratedProgram[], activities: GeneratedActivity[], budgets: GeneratedBudget[], narratives: any): { valid: boolean, errors: string[] } {
        const errors: string[] = [];
        
        // 1. Duplicate SWOT
        const swotKeys = new Set();
        swot.forEach(s => {
            const key = `${s.category}-${s.evidence}`;
            if (swotKeys.has(key)) errors.push(`Duplicate SWOT: ${s.evidence}`);
            swotKeys.add(key);
        });

        // 2. Duplicate Objectives
        const objKeys = new Set();
        objectives.forEach(o => {
            if (objKeys.has(o.objective)) errors.push(`Duplicate Objective: ${o.objective}`);
            objKeys.add(o.objective);
        });

        // 3. Duplicate Programs
        const progKeys = new Set();
        programs.forEach(p => {
            if (progKeys.has(p.name)) errors.push(`Duplicate Program: ${p.name}`);
            progKeys.add(p.name);
        });

        // 4. Duplicate Activities
        const actKeys = new Set();
        activities.forEach(a => {
            const key = `${a.programId}-${a.name}`;
            if (actKeys.has(key)) errors.push(`Duplicate Activity: ${a.name}`);
            actKeys.add(key);
        });

        // 5. Orphan Budgets
        budgets.forEach(b => {
            if (!activities.some(a => a.id === b.activityId)) {
                errors.push(`Orphan Budget: ${b.budgetNarrative}`);
            }
        });

        // 6. Generic Text Checks
        const checkGeneric = (text: string, context: string) => {
            if (!text) return;
            const lower = text.toLowerCase();
            if (lower.includes("lorem ipsum") || lower.includes("placeholder") || lower.includes("program intervensi") || lower.includes("program perbaikan") || lower.includes("program peningkatan")) {
                errors.push(`Invalid wording in ${context}: ${text}`);
            }
        };

        programs.forEach(p => checkGeneric(p.name, "Program Name"));
        activities.forEach(a => checkGeneric(a.name, "Activity Name"));
        budgets.forEach(b => checkGeneric(b.budgetNarrative, "Budget Narrative"));

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

