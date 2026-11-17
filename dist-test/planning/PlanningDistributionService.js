"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningDistributionService = void 0;
var PlanningDistributionService = /** @class */ (function () {
    function PlanningDistributionService(engine) {
        this.engine = engine;
    }
    /**
     * Determines the planning year ('Y1', 'Y2', 'Y3', 'Y4') for an activity.
     * If a specific distribution is registered in the engine, it uses that.
     * Otherwise, it uses a deterministic distribution logic based on index
     * to ensure activities are distributed across 4 years instead of all piling up in Y1.
     */
    PlanningDistributionService.prototype.assignYearToActivity = function (activityReferenceId, fallbackIndex) {
        if (fallbackIndex === void 0) { fallbackIndex = 0; }
        if (this.engine) {
            var distribution = this.engine.getPlanningDistribution(activityReferenceId);
            if (distribution && distribution.planningYear >= 1 && distribution.planningYear <= 4) {
                return "Y".concat(distribution.planningYear);
            }
        }
        // Default distribution if not explicitly registered: distribute evenly across 4 years (1-4)
        // Round-robin distribution
        var defaultYear = (fallbackIndex % 4) + 1;
        return "Y".concat(defaultYear);
    };
    return PlanningDistributionService;
}());
exports.PlanningDistributionService = PlanningDistributionService;
