const idMatch = "A.1 Kemampuan Literasi".match(/^[A-E]\.\d+(\.\d+)?/);
let id = "IND-1";
if (idMatch) {
    id = idMatch[0];
}
console.log("CanonicalParser IDs:", id);

const indicators = [{ id, name: "A.1 Kemampuan Literasi", score: "82.50" }];

class CompatibilityAdapter {
    static getIndicatorsMap(canonicalIndicators: any[]) {
        const indicatorsMap: Record<string, any> = {};
        canonicalIndicators.forEach(ind => {
            if (ind.id) {
                indicatorsMap[ind.id] = {
                    nilai: ind.score?.toString() || null,
                    kategori: ind.trend || null,
                    catatan: null
                };
            }
        });
        return indicatorsMap;
    }
}

const adapterMap = CompatibilityAdapter.getIndicatorsMap(indicators);
console.log("CompatibilityAdapter Keys:", Object.keys(adapterMap));
console.log("CompatibilityAdapter Output:", adapterMap);
