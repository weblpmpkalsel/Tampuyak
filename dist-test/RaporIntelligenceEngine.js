"use strict";
// ==========================================
// RAPOR PENDIDIKAN INTELLIGENCE ENGINE (RPIE)
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaporIntelligenceEngine = void 0;
var RaporIntelligenceEngine = /** @class */ (function () {
    function RaporIntelligenceEngine() {
        this.dimensions = [];
    }
    RaporIntelligenceEngine.prototype.loadData = function (rawData, dictionary) {
        var _this = this;
        this.dimensions = [];
        // Parse dimensions from dictionary
        dictionary.forEach(function (dictDim) {
            var dimId = dictDim.dimensi.split(":")[0].trim().replace("Dimensi ", "");
            var dimName = dictDim.dimensi;
            var elements = [];
            var indicators = [];
            dictDim.indikator.forEach(function (ind) {
                var _a;
                var indValue = ((_a = rawData[ind.id]) === null || _a === void 0 ? void 0 : _a.nilai) ? parseFloat(rawData[ind.id].nilai) : 0;
                var target = 100; // Benchmark target
                var gap = target - indValue;
                var status = 'Merah';
                if (indValue >= 80)
                    status = 'Hijau';
                else if (indValue >= 60)
                    status = 'Kuning';
                // Calculate priority (Gap -> Urgency -> Impact)
                var urgency = gap > 40 ? 3 : gap > 20 ? 2 : 1;
                var impact = dimId === 'A' || dimId === 'D' ? 3 : 2;
                var priorityScore = urgency * impact * gap;
                var rootCauses = [];
                var recommendations = [];
                if (status !== 'Hijau') {
                    rootCauses.push({
                        id: "RC-".concat(ind.id, "-1"),
                        description: "Kurangnya optimalisasi pada aspek ".concat(ind.nama.toLowerCase()),
                        evidence: "Capaian masih berada di angka ".concat(indValue, " (Kategori ").concat(status, ")"),
                        relatedDimensionId: dimId,
                        relatedElementId: ind.id.split(".")[0]
                    });
                    recommendations.push("Peningkatan kapasitas dan program intervensi untuk ".concat(ind.nama.toLowerCase()));
                }
                var indicator = {
                    id: ind.id,
                    name: ind.nama,
                    dimensionId: dimId,
                    elementId: ind.id.split(".")[0], // Simplified element ID mapping
                    value: indValue,
                    target: target,
                    gap: gap,
                    trend: 'Tetap', // Could be calculated if historical data exists
                    status: status,
                    priorityScore: priorityScore,
                    evidence: "Data Rapor Pendidikan: ".concat(ind.nama, " = ").concat(indValue),
                    recommendations: recommendations,
                    rootCauses: rootCauses
                };
                indicators.push(indicator);
            });
            // Group by Element
            var elementMap = new Map();
            indicators.forEach(function (ind) {
                if (!elementMap.has(ind.elementId)) {
                    elementMap.set(ind.elementId, {
                        id: ind.elementId,
                        name: "Elemen ".concat(ind.elementId),
                        indicators: []
                    });
                }
                elementMap.get(ind.elementId).indicators.push(ind);
            });
            elements.push.apply(elements, Array.from(elementMap.values()));
            var dimScore = indicators.length > 0 ? indicators.reduce(function (acc, ind) { return acc + ind.value; }, 0) / indicators.length : 0;
            _this.dimensions.push({
                id: dimId,
                name: dimName,
                score: dimScore,
                nationalBenchmark: 70,
                provincialBenchmark: 65,
                districtBenchmark: 60,
                schoolBenchmark: 60,
                trend: 'Tetap',
                category: dimScore >= 80 ? 'Baik' : dimScore >= 60 ? 'Sedang' : 'Kurang',
                priorityScore: indicators.reduce(function (acc, ind) { return acc + ind.priorityScore; }, 0),
                elements: elements
            });
        });
    };
    RaporIntelligenceEngine.prototype.getDimensions = function () {
        return this.dimensions;
    };
    RaporIntelligenceEngine.prototype.getAllIndicators = function () {
        return this.dimensions.flatMap(function (d) { return d.elements.flatMap(function (e) { return e.indicators; }); });
    };
    RaporIntelligenceEngine.prototype.getSWOT = function () {
        var indicators = this.getAllIndicators();
        return {
            strengths: indicators.filter(function (i) { return i.status === 'Hijau'; }).sort(function (a, b) { return b.value - a.value; }),
            weaknesses: indicators.filter(function (i) { return i.status === 'Merah' || i.status === 'Kuning'; }).sort(function (a, b) { return b.priorityScore - a.priorityScore; }),
            opportunities: indicators.filter(function (i) { return i.status === 'Kuning' && i.trend === 'Naik'; }),
            threats: indicators.filter(function (i) { return i.status === 'Kuning' && i.trend === 'Turun'; })
        };
    };
    RaporIntelligenceEngine.prototype.getIRB = function () {
        var weaknesses = this.getSWOT().weaknesses;
        return weaknesses.map(function (ind, i) {
            var _a;
            return ({
                id: "IRB-".concat(i + 1),
                identifikasi: ind,
                refleksi: ind.rootCauses[0] || { id: 'N/A', description: 'Perlu analisis mendalam', evidence: ind.evidence, relatedDimensionId: ind.dimensionId, relatedElementId: ind.elementId },
                benahi: ind.recommendations[0] || 'Perumusan program strategis peningkatan mutu.',
                rationale: "Karena capaian ".concat(ind.name, " masih ").concat(ind.status, " (").concat(ind.value, "), maka akar masalah ").concat((((_a = ind.rootCauses[0]) === null || _a === void 0 ? void 0 : _a.description) || '').toLowerCase(), " harus diselesaikan agar memenuhi standar nasional.")
            });
        });
    };
    RaporIntelligenceEngine.prototype.getTopPriorities = function (limit) {
        if (limit === void 0) { limit = 10; }
        return this.getAllIndicators()
            .filter(function (i) { return i.gap > 0; })
            .sort(function (a, b) { return b.priorityScore - a.priorityScore; })
            .slice(0, limit);
    };
    return RaporIntelligenceEngine;
}());
exports.RaporIntelligenceEngine = RaporIntelligenceEngine;
