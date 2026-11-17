import { DocumentSynchronizationEngine } from './src/DocumentSynchronizationEngine';
import { PlanningIntelligenceEngine } from './src/PlanningIntelligenceEngine';

const settings = {
    analisis: {
        status: "Disetujui",
        data: {
            program: [{ id: 'prog-1', nama: 'Program 1' }],
            kegiatan: [{ id: 'keg-1', programId: 'prog-1', nama: 'Kegiatan A' }, { id: 'keg-2', programId: 'prog-1', nama: 'Kegiatan B' }]
        }
    },
    rapor: { isLocked: false, data: {}, target: {} },
    identity: { namaKepsek: 'Admin' }
};

const engine = new PlanningIntelligenceEngine();
const mockRapor = [
    { indicator: "A.1", score: 50, problem: "Literasi rendah", rootCause: "Buku kurang", recommendation: "Beli buku", kegiatan: "Beli buku" }
];
engine.initialize(mockRapor);
engine.synthesize();
const knowledgeGraph = engine.getKnowledgeGraph();
const canonicalObjects = engine.getCanonicalObjects();

const pendingImport = {
    parsedData: {},
    metadata: { parserMode: "Enterprise Deterministic Pipeline", officialVersion: "1.0" },
    recommendations: [],
    rkt: [],
    rkas: [],
    schoolData: {},
    canonicalObjects: canonicalObjects,
    knowledgeGraph: knowledgeGraph,
    dataCoverage: {},
    fileInfo: { fileName: 'test.xlsx', importTimestamp: Date.now() }
};

try {
    const result = DocumentSynchronizationEngine.sync(settings, pendingImport, []);
    const rp = result.relationalPlanning;
    
    console.log(JSON.stringify(rp.programs, null, 2));
    
} catch (e) {
    console.error('FAIL', e);
}
