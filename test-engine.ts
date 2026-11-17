import { RaporIntelligenceEngine } from './src/RaporIntelligenceEngine.js';

const rpie = new RaporIntelligenceEngine();
const dict = [
  {
    dimensi: "Dimensi A",
    indikator: [
      { id: "A.1", nama: "Kemampuan Literasi" },
      { id: "A.2", nama: "Kemampuan Numerasi" }
    ]
  }
];

const rawData = {
  "A.1": { nilai: "82.50" },
  "A.2": { nilai: 80 }
};

rpie.loadData(rawData, dict);
console.log(rpie.getTopPriorities(5));
