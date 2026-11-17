import { GeneratedActivity, GeneratedBudget } from './PlanningIntelligenceEngine';

export class BudgetAllocationEngine {
    static allocate(activities: GeneratedActivity[], budgetSettings: any): GeneratedBudget[] {
        const totalPagu = budgetSettings?.totalPagu || 0;
        const fundingSource = budgetSettings?.status === "Kinerja" ? "BOS Kinerja" : "BOS Reguler";
        
        const budgets: GeneratedBudget[] = [];
        let budgetCounter = 1;
        const seenBudgets = new Set<string>();
        
        if (!totalPagu || totalPagu <= 0 || activities.length === 0) {
            activities.forEach(act => {
                const budgetIdKey = `${act.programId}-${act.name}`;
                if (!seenBudgets.has(budgetIdKey)) {
                    seenBudgets.add(budgetIdKey);
                    budgets.push({
                        id: `BUD-${budgetCounter++}`,
                        activityId: act.id,
                        accountCategory: 'Belanja Barang dan Jasa',
                        fundingSource: fundingSource,
                        estimatedCost: "Belum dialokasikan",
                        allocatedAmount: "Belum dialokasikan",
                        unit: 'Kegiatan',
                        volume: '1',
                        priority: 'Tinggi',
                        budgetNarrative: `Pendanaan untuk mendukung ${act.name} termasuk pengadaan materi, narasumber, dan konsumsi.`,
                        canonicalReferences: act.canonicalReferences || []
                    });
                }
            });
            return budgets;
        }

        // We want to distribute the totalPagu to all unique activities
        // Let's first collect all unique activities
        const uniqueActivities: GeneratedActivity[] = [];
        activities.forEach(act => {
            const budgetIdKey = `${act.programId}-${act.name}`;
            if (!seenBudgets.has(budgetIdKey)) {
                seenBudgets.add(budgetIdKey);
                uniqueActivities.push(act);
            }
        });
        
        const numActivities = uniqueActivities.length;
        let baseAllocation = Math.floor(totalPagu / numActivities);
        let remaining = totalPagu - (baseAllocation * numActivities);

        uniqueActivities.forEach((act, index) => {
            let amount = baseAllocation + (index === 0 ? remaining : 0);
            
            // Format amount as string representation
            budgets.push({
                id: `BUD-${budgetCounter++}`,
                activityId: act.id,
                accountCategory: 'Belanja Barang dan Jasa',
                fundingSource: fundingSource,
                estimatedCost: amount.toString(), // Keep for backwards compatibility
                allocatedAmount: amount, // The explicit request
                unit: 'Kegiatan',
                volume: '1',
                priority: 'Tinggi',
                budgetNarrative: `Pendanaan untuk mendukung ${act.name} termasuk pengadaan materi, narasumber, dan konsumsi.`,
                canonicalReferences: act.canonicalReferences || []
            });
        });

        return budgets;
    }

    // Reallocate existing RKAS items
    static reallocate(rkasItems: any[], budgetSettings: any): any[] {
        const totalPagu = budgetSettings?.totalPagu || 0;
        const fundingSource = budgetSettings?.status === "Kinerja" ? "BOS Kinerja" : "BOS Reguler";
        
        if (!totalPagu || totalPagu <= 0 || rkasItems.length === 0) {
            return rkasItems.map(item => ({
                ...item,
                amount: "Belum dialokasikan",
                totalCost: "Belum dialokasikan",
                unitPrice: 0,
                unitCost: "Belum dialokasikan",
                allocatedAmount: "Belum dialokasikan",
                fundingSource: fundingSource
            }));
        }

        const numActivities = rkasItems.length;
        let baseAllocation = Math.floor(totalPagu / numActivities);
        let remaining = totalPagu - (baseAllocation * numActivities);

        return rkasItems.map((item, index) => {
            let amount = baseAllocation + (index === 0 ? remaining : 0);
            return {
                ...item,
                amount: amount,
                totalCost: amount.toString(),
                unitPrice: amount,
                unitCost: amount.toString(),
                allocatedAmount: amount,
                fundingSource: fundingSource
            };
        });
    }
}
