import { seedInitialGraph, KnowledgeGraph } from './SPKG';
import { DocumentCompositionEngine } from './DocumentCompositionEngine/DocumentCompositionEngine';

seedInitialGraph();
const kg = KnowledgeGraph.getInstance();
const compositionEngine = new DocumentCompositionEngine();
const doc = compositionEngine.composeDocument(kg);

const bab2 = doc.chapter3;
(/* console.log removed */ (..._args: any[]) => {})(JSON.stringify(bab2, null, 2));
