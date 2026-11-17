"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetAllocationEngine = void 0;
var BudgetAllocationEngine = /** @class */ (function () {
    function BudgetAllocationEngine() {
    }
    BudgetAllocationEngine.allocate = function (activities, budgetSettings) {
        var totalPagu = (budgetSettings === null || budgetSettings === void 0 ? void 0 : budgetSettings.totalPagu) || 0;
        var fundingSource = (budgetSettings === null || budgetSettings === void 0 ? void 0 : budgetSettings.status) === "Kinerja" ? "BOS Kinerja" : "BOS Reguler";
        var budgets = [];
        var budgetCounter = 1;
        var seenBudgets = new Set();
        if (!totalPagu || totalPagu <= 0 || activities.length === 0) {
            activities.forEach(function (act) {
                var budgetIdKey = "".concat(act.programId, "-").concat(act.name);
                if (!seenBudgets.has(budgetIdKey)) {
                    seenBudgets.add(budgetIdKey);
                    budgets.push({
                        id: "BUD-".concat(budgetCounter++),
                        activityId: act.id,
                        accountCategory: 'Belanja Barang dan Jasa',
                        fundingSource: fundingSource,
                        estimatedCost: "Belum dialokasikan",
                        allocatedAmount: "Belum dialokasikan",
                        unit: 'Kegiatan',
                        volume: '1',
                        priority: 'Tinggi',
                        budgetNarrative: "Pendanaan untuk mendukung ".concat(act.name, " termasuk pengadaan materi, narasumber, dan konsumsi."),
                        canonicalReferences: act.canonicalReferences || []
                    });
                }
            });
            return budgets;
        }
        // We want to distribute the totalPagu to all unique activities
        // Let's first collect all unique activities
        var uniqueActivities = [];
        activities.forEach(function (act) {
            var budgetIdKey = "".concat(act.programId, "-").concat(act.name);
            if (!seenBudgets.has(budgetIdKey)) {
                seenBudgets.add(budgetIdKey);
                uniqueActivities.push(act);
            }
        });
        var numActivities = uniqueActivities.length;
        var baseAllocation = Math.floor(totalPagu / numActivities);
        var remaining = totalPagu - (baseAllocation * numActivities);
        uniqueActivities.forEach(function (act, index) {
            var amount = baseAllocation + (index === 0 ? remaining : 0);
            // Format amount as string representation
            budgets.push({
                id: "BUD-".concat(budgetCounter++),
                activityId: act.id,
                accountCategory: 'Belanja Barang dan Jasa',
                fundingSource: fundingSource,
                estimatedCost: amount.toString(), // Keep for backwards compatibility
                allocatedAmount: amount, // The explicit request
                unit: 'Kegiatan',
                volume: '1',
                priority: 'Tinggi',
                budgetNarrative: "Pendanaan untuk mendukung ".concat(act.name, " termasuk pengadaan materi, narasumber, dan konsumsi."),
                canonicalReferences: act.canonicalReferences || []
            });
        });
        return budgets;
    };
    // Reallocate existing RKAS items
    BudgetAllocationEngine.reallocate = function (rkasItems, budgetSettings) {
        var totalPagu = (budgetSettings === null || budgetSettings === void 0 ? void 0 : budgetSettings.totalPagu) || 0;
        var fundingSource = (budgetSettings === null || budgetSettings === void 0 ? void 0 : budgetSettings.status) === "Kinerja" ? "BOS Kinerja" : "BOS Reguler";
        if (!totalPagu || totalPagu <= 0 || rkasItems.length === 0) {
            return rkasItems.map(function (item) { return (__assign(__assign({}, item), { amount: "Belum dialokasikan", totalCost: "Belum dialokasikan", unitPrice: 0, unitCost: "Belum dialokasikan", allocatedAmount: "Belum dialokasikan", fundingSource: fundingSource })); });
        }
        var numActivities = rkasItems.length;
        var baseAllocation = Math.floor(totalPagu / numActivities);
        var remaining = totalPagu - (baseAllocation * numActivities);
        return rkasItems.map(function (item, index) {
            var amount = baseAllocation + (index === 0 ? remaining : 0);
            return __assign(__assign({}, item), { amount: amount, totalCost: amount.toString(), unitPrice: amount, unitCost: amount.toString(), allocatedAmount: amount, fundingSource: fundingSource });
        });
    };
    return BudgetAllocationEngine;
}());
exports.BudgetAllocationEngine = BudgetAllocationEngine;
