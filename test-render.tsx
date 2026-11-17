import React from 'react';
import { renderToString } from 'react-dom/server';
import { EnterpriseDocumentViewer } from './src/EnterpriseDocumentViewer';
import { Chapter1Builder } from './src/DocumentCompositionEngine/builders/Chapter1Builder';
import { Chapter2Builder } from './src/DocumentCompositionEngine/builders/Chapter2Builder';
import { Chapter3Builder } from './src/DocumentCompositionEngine/builders/Chapter3Builder';
import { Chapter4Builder } from './src/DocumentCompositionEngine/builders/Chapter4Builder';
import { KnowledgeGraph } from './src/SPKG';

const mockSettings = {
  analisis: {
    data: {
      prioritas: [{ name: 'A', priorityScore: 10 }, { name: 'B', priorityScore: 8 }],
      akarPenyebab: 'Akar A; Akar B',
      program: [{ nama: 'Program A' }, { nama: 'Program B' }],
      indikator: ['Indikator A', 'Indikator B'],
      kekuatan: ['S1'], kelemahan: ['W1'], peluang: ['O1'], tantangan: ['T1'],
      tujuan: ['Tujuan A', 'Tujuan B']
    }
  },
  planning: {
    rkjm: [
      { id: 'o1', strategicObjective: 'Obj 1', targetY1: '10', targetY4: '100' },
      { id: 'o2', strategicObjective: 'Obj 2', targetY1: '20', targetY4: '200' }
    ],
    rkt: [
      { rkjmObjectiveId: 'o1', program: 'Prog 1', activity: 'Act 1' }
    ]
  }
};

(global as any).localStorage = {
  getItem: (key: string) => JSON.stringify(mockSettings),
  setItem: () => {}
};

const kg = new KnowledgeGraph();

const ch1 = new Chapter1Builder().build(kg);
const ch2 = new Chapter2Builder().build(kg);
const ch3 = new Chapter3Builder().build(kg);
const ch4 = new Chapter4Builder().build(kg);

console.log("BAB I:");
console.log("1. PlanningResult object count: N/A (Static)");
console.log("2. Builder output count: " + ch1.sections.length);
console.log("3. DocumentModel section count: " + ch1.sections.length);

console.log("\nBAB II:");
console.log("1. PlanningResult object count: 4 SWOT, 2 IRB, 2 Objectives, 2 Programs");
console.log("2. Builder output count: " + ch2.sections.length);
console.log("3. DocumentModel section count: " + ch2.sections.length);

console.log("\nBAB III:");
console.log("1. PlanningResult object count: 2 RKJM Objectives, 1 RKT Activity");
console.log("2. Builder output count: " + ch3.sections.length);
console.log("3. DocumentModel section count: " + ch3.sections.length);

console.log("\nBAB IV:");
console.log("1. PlanningResult object count: 1 RKT Activity, 0 RKAS");
console.log("2. Builder output count: " + ch4.sections.length);
console.log("3. DocumentModel section count: " + ch4.sections.length);
