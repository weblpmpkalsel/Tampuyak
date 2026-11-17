import { DocumentSynchronizationEngine } from "./src/DocumentSynchronizationEngine.ts";

const dummySettings = {
    rapor: {
        isLocked: false,
        data: {},
        target: {}
    },
    planning: {}
};

const dummyPendingImport = {
    parsedData: {},
    metadata: {
        recommendationsImported: 0,
        rktImported: 0,
        rkasImported: 0,
        parserMode: "Tampuyak AI"
    },
    recommendations: [],
    rkt: [],
    rkas: [],
    schoolData: {},
    canonicalObjects: [],
    knowledgeGraph: { nodes: [], edges: [] },
    dataCoverage: {},
    fileInfo: {}
};

DocumentSynchronizationEngine.sync(dummySettings, dummyPendingImport, []);
