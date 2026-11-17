import { RkasGenerator } from './src/rkas/generator/RkasGenerator';
import { Chapter2Builder } from './src/RKASDocument/Chapter2Builder';
import { BudgetBuilder } from './src/budget/BudgetBuilder';

const planningActivity = {
  accountCode: "5.1.02.01",
  fundingSource: "BOS Reguler",
  amount: 2500000,
  price: 2500000,
  activity: "Program Peningkatan Literasi",
  subActivity: "Pelatihan Literasi Dasar",
  budgetItem: "Biaya Pelaksanaan Pelatihan",
  komponen: "Bahan Habis Pakai",
  unit: "Paket",
  volume: 1
};

console.log("=== Stage 1: planningActivity ===");
console.log(JSON.stringify(planningActivity, null, 2));

const budgetResult = BudgetBuilder.build({
  resolvedReference: undefined,
  year: 2026,
  planningActivity: planningActivity
});

console.log("\n=== Stage 2: BudgetLine ===");
console.log(JSON.stringify(budgetResult.budgetStructure?.lines[0], null, 2));

console.log("\n=== Stage 3: BudgetStructure ===");
console.log(JSON.stringify(budgetResult.budgetStructure, null, 2));

const request = {
  year: 2026,
  schoolId: "TEST-01",
  planningActivities: [planningActivity],
  recommendationCandidates: [],
  existingActivities: []
};
const result = RkasGenerator.generate(request as any);

console.log("\n=== Stage 4: Chapter2Builder input (RkasGeneratorResult) ===");
console.log(JSON.stringify(result, null, 2));

const builder = new Chapter2Builder();
const doc = builder.build(result as any, {});

console.log("\n=== Stage 5: EnterpriseDocumentViewer table.data ===");
console.log(JSON.stringify(doc.sections[0].tables[0].data, null, 2));
