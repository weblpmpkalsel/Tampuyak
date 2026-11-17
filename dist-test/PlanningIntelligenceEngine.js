"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningIntelligenceEngine = void 0;
var PlanningIntelligenceEngine = /** @class */ (function () {
    function PlanningIntelligenceEngine() {
    }
    // STEP 1: SWOT ENGINE
    PlanningIntelligenceEngine.generateSWOT = function (canonical) {
        var schoolData = canonical.schoolData, indicators = canonical.indicators, recommendations = canonical.recommendations;
        var swot = [];
        if (indicators && Array.isArray(indicators) && indicators.length > 0) {
            // Priority 1: Indicators
            indicators.forEach(function (ind) {
                var scoreRaw = ind.score || ind.value || ind.nilai;
                var score = scoreRaw ? parseFloat(scoreRaw) : NaN;
                if ((!isNaN(score) && score >= 80) || ind.category === 'Hijau') {
                    swot.push({
                        category: 'Strength',
                        evidence: "Indikator ".concat(ind.name || ind.id, " mencapai skor ").concat(scoreRaw || 'Baik'),
                        confidence: 90,
                        reasoning: 'Skor di atas rata-rata atau kategori Hijau menunjukkan kekuatan sekolah.'
                    });
                }
                else if ((!isNaN(score) && score < 60) || ind.category === 'Merah') {
                    swot.push({
                        category: 'Weakness',
                        evidence: "Indikator ".concat(ind.name || ind.id, " memiliki skor ").concat(scoreRaw || 'Kurang'),
                        confidence: 95,
                        reasoning: 'Skor di bawah standar nasional mengindikasikan area kelemahan yang perlu diintervensi.'
                    });
                }
                else if (ind.trend === 'Naik') {
                    swot.push({
                        category: 'Opportunity',
                        evidence: "Indikator ".concat(ind.name || ind.id, " menunjukkan tren Naik"),
                        confidence: 85,
                        reasoning: 'Tren positif dapat dimanfaatkan untuk percepatan peningkatan mutu.'
                    });
                }
                else if (ind.trend === 'Turun') {
                    swot.push({
                        category: 'Threat',
                        evidence: "Indikator ".concat(ind.name || ind.id, " menunjukkan tren Turun"),
                        confidence: 85,
                        reasoning: 'Tren negatif dapat menjadi ancaman jika tidak segera diatasi.'
                    });
                }
                else {
                    swot.push({
                        category: 'Weakness',
                        evidence: "Capaian pada indikator ".concat(ind.name || ind.id, " perlu ditingkatkan"),
                        confidence: 70,
                        reasoning: 'Berdasarkan prioritas indikator rapor pendidikan.'
                    });
                }
            });
            // Build SWOT using indicators AND recommendations
            if (recommendations && Array.isArray(recommendations)) {
                recommendations.forEach(function (rec) {
                    swot.push({
                        category: 'Opportunity',
                        evidence: "Peluang perbaikan: ".concat(rec.problem || rec.name),
                        confidence: 80,
                        reasoning: "Rekomendasi tindakan: ".concat(rec.recommendation || rec.benahi)
                    });
                });
            }
        }
        else if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
            // Priority 2: Recommendations
            recommendations.forEach(function (rec) {
                swot.push({
                    category: 'Weakness',
                    evidence: "Masalah teridentifikasi: ".concat(rec.problem || rec.name),
                    confidence: 90,
                    reasoning: "Akar masalah: ".concat(rec.rootCause || 'Kelemahan spesifik')
                });
                if (rec.recommendation || rec.benahi) {
                    swot.push({
                        category: 'Opportunity',
                        evidence: "Peluang perbaikan melalui program: ".concat(rec.recommendation || rec.benahi),
                        confidence: 85,
                        reasoning: 'Terdapat arahan rekomendasi untuk perbaikan'
                    });
                }
            });
        }
        else {
            // Priority 3: IRB
            var irbData = PlanningIntelligenceEngine.generateIRB(canonical);
            if (irbData && irbData.length > 0) {
                irbData.forEach(function (irb) {
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
    };
    // SWOT OPTIMIZATION ENGINE
    PlanningIntelligenceEngine.optimizeSWOT = function (swot) {
        var preTotal = swot.length;
        var preStrength = swot.filter(function (s) { return s.category === 'Strength'; }).length;
        var preWeakness = swot.filter(function (s) { return s.category === 'Weakness'; }).length;
        var preOpportunity = swot.filter(function (s) { return s.category === 'Opportunity'; }).length;
        var preThreat = swot.filter(function (s) { return s.category === 'Threat'; }).length;
        console.log("\nSWOT BEFORE OPTIMIZATION\nTotal:\n".concat(preTotal, "\nStrength:\n").concat(preStrength, "\nWeakness:\n").concat(preWeakness, "\nOpportunity:\n").concat(preOpportunity, "\nThreat:\n").concat(preThreat, "\n"));
        var themes = [
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
        var optimized = [];
        var categories = ['Strength', 'Weakness', 'Opportunity', 'Threat'];
        categories.forEach(function (category) {
            var items = swot.filter(function (s) { return s.category === category; });
            // Group by theme
            var grouped = new Map();
            items.forEach(function (item) {
                var text = (item.evidence + " " + item.reasoning).toLowerCase();
                var assignedTheme = "Lainnya";
                for (var _i = 0, themes_1 = themes; _i < themes_1.length; _i++) {
                    var theme = themes_1[_i];
                    if (theme.keywords.length > 0 && theme.keywords.some(function (k) { return text.includes(k.toLowerCase()); })) {
                        assignedTheme = theme.key;
                        break;
                    }
                }
                if (!grouped.has(assignedTheme))
                    grouped.set(assignedTheme, []);
                grouped.get(assignedTheme).push(item);
            });
            var mergedCategoryItems = [];
            grouped.forEach(function (themeItems, theme) {
                if (themeItems.length === 0)
                    return;
                // Sort items by a simulated importance/confidence score
                themeItems.sort(function (a, b) { return b.confidence - a.confidence; });
                var rep = themeItems[0];
                var summaryEvidence = rep.evidence;
                if (themeItems.length > 1) {
                    // Refine statements to be high-level if multiple indicators hit the same theme
                    if (category === 'Strength')
                        summaryEvidence = "Capaian positif pada area ".concat(theme, " (Dikelompokkan dari ").concat(themeItems.length, " indikator)");
                    else if (category === 'Weakness')
                        summaryEvidence = "Tantangan kinerja pada area ".concat(theme, " yang perlu ditingkatkan (Dikelompokkan dari ").concat(themeItems.length, " kelemahan)");
                    else if (category === 'Opportunity')
                        summaryEvidence = "Peluang perbaikan mutu pada area ".concat(theme, " melalui intervensi terarah (Dikelompokkan dari ").concat(themeItems.length, " rekomendasi)");
                    else if (category === 'Threat')
                        summaryEvidence = "Ancaman tren penurunan pada area ".concat(theme, " (Dikelompokkan dari ").concat(themeItems.length, " indikator)");
                }
                mergedCategoryItems.push({
                    category: category,
                    evidence: summaryEvidence,
                    confidence: rep.confidence,
                    reasoning: "Hasil optimasi dan sintesis dari ".concat(themeItems.length, " item terkait ").concat(theme, ". ") + rep.reasoning,
                    sourceIndicatorIds: [],
                    sourceRecommendationIds: [],
                    sourceIRBIds: [],
                    confidenceScore: rep.confidence + (themeItems.length * 5)
                });
            });
            // Rank by confidenceScore and limit
            mergedCategoryItems.sort(function (a, b) { return (b.confidenceScore || 0) - (a.confidenceScore || 0); });
            optimized.push.apply(optimized, mergedCategoryItems.slice(0, 8)); // Max 8 per category
        });
        var postTotal = optimized.length;
        var postStrength = optimized.filter(function (s) { return s.category === 'Strength'; }).length;
        var postWeakness = optimized.filter(function (s) { return s.category === 'Weakness'; }).length;
        var postOpportunity = optimized.filter(function (s) { return s.category === 'Opportunity'; }).length;
        var postThreat = optimized.filter(function (s) { return s.category === 'Threat'; }).length;
        console.log("\nSWOT AFTER OPTIMIZATION\nTotal:\n".concat(postTotal, "\nStrength:\n").concat(postStrength, "\nWeakness:\n").concat(postWeakness, "\nOpportunity:\n").concat(postOpportunity, "\nThreat:\n").concat(postThreat, "\n"));
        return optimized;
    };
    // STEP 2: IRB ENGINE
    PlanningIntelligenceEngine.generateIRB = function (canonical) {
        var recommendations = canonical.recommendations, indicators = canonical.indicators;
        var irb = [];
        if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
            recommendations.forEach(function (rec) {
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
        }
        else if (indicators && Array.isArray(indicators) && indicators.length > 0) {
            // Generate IRB analytically from lowest indicators
            var weakIndicators = indicators.filter(function (ind) {
                var score = parseFloat(ind.score || ind.value || ind.nilai);
                return (!isNaN(score) && score < 60) || ind.category === 'Merah' || ind.trend === 'Turun';
            });
            // If no clear weaknesses, pick the first few to have at least something
            var targetIndicators = weakIndicators.length > 0 ? weakIndicators : indicators.slice(0, 3);
            targetIndicators.forEach(function (ind) {
                irb.push({
                    problem: "Capaian rendah pada indikator ".concat(ind.name || ind.id),
                    evidence: "Skor: ".concat(ind.score || ind.value || ind.nilai || 'Tidak tersedia'),
                    rootCause: 'Kapasitas dan proses pembelajaran belum optimal',
                    improvementStrategy: 'Peningkatan kompetensi dan perbaikan layanan',
                    responsibleUnit: 'Tim Penjaminan Mutu Sekolah',
                    expectedResult: 'Peningkatan skor dan capaian indikator menjadi Hijau',
                    priorityLevel: 'Tinggi'
                });
            });
        }
        return irb;
    };
    // STEP 3: STRATEGIC OBJECTIVES
    PlanningIntelligenceEngine.generateStrategicObjectives = function (swot, irb) {
        var objectives = [];
        var seenObjectives = new Set();
        var objCounter = 1;
        irb.forEach(function (item, idx) {
            var problemLower = item.problem.toLowerCase();
            var objectiveText = "Meningkatkan capaian numerasi dan literasi peserta didik secara terukur pada area ".concat(item.problem, " hingga mencapai kategori Baik berdasarkan Rapor Pendidikan");
            if (!seenObjectives.has(objectiveText)) {
                seenObjectives.add(objectiveText);
                objectives.push({
                    id: "OBJ-".concat(objCounter++),
                    objective: "Meningkatkan capaian pada area ".concat(item.problem, " peserta didik hingga mencapai kategori Baik berdasarkan evaluasi Rapor Pendidikan"),
                    baseline: 'Di bawah capaian minimum standar nasional',
                    target: 'Kategori Baik (Hijau) pada siklus evaluasi berikutnya',
                    successIndicator: "Skor rapor pendidikan untuk dimensi ".concat(item.problem, " meningkat minimal 10 poin atau naik satu peringkat kategori"),
                    responsibleUnit: item.responsibleUnit,
                    risk: 'Keterbatasan waktu pendidik dalam mendampingi kegiatan di luar jam pelajaran efektif',
                    mitigation: 'Pengintegrasian kegiatan peningkatan mutu ke dalam kegiatan intrakurikuler dan kokurikuler',
                    timeline: '1 Tahun Ajaran',
                    canonicalReferences: []
                });
            }
        });
        return objectives;
    };
    // STEP 4: PROGRAM GENERATOR
    PlanningIntelligenceEngine.generatePrograms = function (objectives) {
        var programs = [];
        var seenPrograms = new Set();
        var progCounter = 1;
        objectives.forEach(function (obj, idx) {
            var programName = 'Program Penguatan Kompetensi Sekolah';
            var problemLower = obj.objective.toLowerCase();
            if (problemLower.includes('literasi')) {
                programName = 'Program Penguatan Literasi';
            }
            else if (problemLower.includes('numerasi')) {
                programName = 'Program Penguatan Numerasi Sekolah';
            }
            else if (problemLower.includes('guru') || problemLower.includes('pendidik')) {
                programName = 'Program Pengembangan Kompetensi Guru';
            }
            else if (problemLower.includes('kepemimpinan') || problemLower.includes('kepala')) {
                programName = 'Program Optimalisasi Tata Kelola';
            }
            else if (problemLower.includes('karakter')) {
                programName = 'Program Pembinaan Karakter Siswa';
            }
            else if (problemLower.includes('iklim') || problemLower.includes('keamanan') || problemLower.includes('kekerasan')) {
                programName = 'Program Penguatan Budaya Positif';
            }
            else if (problemLower.includes('kemitraan') || problemLower.includes('mitra')) {
                programName = 'Program Kemitraan Sekolah';
            }
            else if (problemLower.includes('digital') || problemLower.includes('teknologi')) {
                programName = 'Program Digitalisasi Pembelajaran';
            }
            else {
                var cleanedProblem = obj.objective.replace('Meningkatkan capaian pada area ', '').replace(' peserta didik hingga mencapai kategori Baik berdasarkan evaluasi Rapor Pendidikan', '').substring(0, 30);
                programName = "Program Akselerasi Mutu: ".concat(cleanedProblem);
            }
            if (!seenPrograms.has(programName)) {
                seenPrograms.add(programName);
                programs.push({
                    id: "PROG-".concat(progCounter++),
                    objectiveId: obj.id,
                    name: programName,
                    description: "Program sistematis yang dirancang untuk mendukung ketercapaian tujuan: ".concat(obj.objective),
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
    };
    // STEP 5: ACTIVITY GENERATOR
    PlanningIntelligenceEngine.generateActivities = function (programs) {
        var activities = [];
        var actCounter = 1;
        var seenActivities = new Set();
        programs.forEach(function (prog) {
            var actTemplates = [
                { name: "Peningkatan Kompetensi Guru (In-House Training)", cat: 'Pengembangan SDM' },
                { name: "Pelaksanaan Komunitas Belajar (Kombel) Secara Rutin", cat: 'Pengembangan SDM' },
                { name: "Supervisi Akademik dan Mentoring", cat: 'Monitoring' },
                { name: "Evaluasi Program dan Refleksi Bersama", cat: 'Evaluasi' }
            ];
            actTemplates.forEach(function (template) {
                var uniqueName = "".concat(template.name, " - ").concat(prog.name);
                if (!seenActivities.has(uniqueName)) {
                    seenActivities.add(uniqueName);
                    activities.push({
                        id: "ACT-".concat(actCounter++),
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
    };
    // STEP 6: RKAS GENERATOR
    PlanningIntelligenceEngine.generateRKAS = function (activities) {
        var budgets = [];
        var budgetCounter = 1;
        var seenBudgets = new Set();
        activities.forEach(function (act) {
            var budgetIdKey = "".concat(act.programId, "-").concat(act.name);
            if (!seenBudgets.has(budgetIdKey)) {
                seenBudgets.add(budgetIdKey);
                var cost = '1000000';
                var vol = '1';
                if (act.name.includes('Training') || act.name.includes('Workshop')) {
                    cost = '2500000';
                    vol = '2';
                }
                else if (act.name.includes('Kombel')) {
                    cost = '500000';
                    vol = '10';
                }
                budgets.push({
                    id: "BUD-".concat(budgetCounter++),
                    activityId: act.id,
                    accountCategory: 'Belanja Barang dan Jasa',
                    fundingSource: 'BOS Reguler',
                    estimatedCost: cost,
                    unit: 'Kegiatan',
                    volume: vol,
                    priority: 'Tinggi',
                    budgetNarrative: "Pendanaan untuk mendukung ".concat(act.name, " termasuk pengadaan materi, narasumber, dan konsumsi."),
                    canonicalReferences: act.canonicalReferences || []
                });
            }
        });
        return budgets;
    };
    // STEP 8: DOCUMENT VALIDATION is done dynamically checking these arrays
    PlanningIntelligenceEngine.validateDocument = function (swot, objectives, programs, activities, budgets, narratives) {
        var errors = [];
        // 1. Duplicate SWOT
        var swotKeys = new Set();
        swot.forEach(function (s) {
            var key = "".concat(s.category, "-").concat(s.evidence);
            if (swotKeys.has(key))
                errors.push("Duplicate SWOT: ".concat(s.evidence));
            swotKeys.add(key);
        });
        // 2. Duplicate Objectives
        var objKeys = new Set();
        objectives.forEach(function (o) {
            if (objKeys.has(o.objective))
                errors.push("Duplicate Objective: ".concat(o.objective));
            objKeys.add(o.objective);
        });
        // 3. Duplicate Programs
        var progKeys = new Set();
        programs.forEach(function (p) {
            if (progKeys.has(p.name))
                errors.push("Duplicate Program: ".concat(p.name));
            progKeys.add(p.name);
        });
        // 4. Duplicate Activities
        var actKeys = new Set();
        activities.forEach(function (a) {
            var key = "".concat(a.programId, "-").concat(a.name);
            if (actKeys.has(key))
                errors.push("Duplicate Activity: ".concat(a.name));
            actKeys.add(key);
        });
        // 5. Orphan Budgets
        budgets.forEach(function (b) {
            if (!activities.some(function (a) { return a.id === b.activityId; })) {
                errors.push("Orphan Budget: ".concat(b.budgetNarrative));
            }
        });
        // 6. Generic Text Checks
        var checkGeneric = function (text, context) {
            if (!text)
                return;
            var lower = text.toLowerCase();
            if (lower.includes("lorem ipsum") || lower.includes("placeholder") || lower.includes("program intervensi") || lower.includes("program perbaikan") || lower.includes("program peningkatan")) {
                errors.push("Invalid wording in ".concat(context, ": ").concat(text));
            }
        };
        programs.forEach(function (p) { return checkGeneric(p.name, "Program Name"); });
        activities.forEach(function (a) { return checkGeneric(a.name, "Activity Name"); });
        budgets.forEach(function (b) { return checkGeneric(b.budgetNarrative, "Budget Narrative"); });
        return {
            valid: errors.length === 0,
            errors: errors
        };
    };
    return PlanningIntelligenceEngine;
}());
exports.PlanningIntelligenceEngine = PlanningIntelligenceEngine;
