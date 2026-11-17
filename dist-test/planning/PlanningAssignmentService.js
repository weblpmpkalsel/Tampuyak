"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningAssignmentService = void 0;
var PlanningAssignmentService = /** @class */ (function () {
    function PlanningAssignmentService() {
    }
    /**
     * Determines the operational planning assignment for an activity based on
     * business rules, explicitly provided distribution, and recommendations.
     *
     * This is a decision service. It does not mutate execution state or distribute activities.
     */
    PlanningAssignmentService.prototype.determineAssignment = function (annualPlanningActivity, // Referencing the strategic domain activity
    distribution, recommendations, businessRules, context) {
        try {
            if (!annualPlanningActivity || !annualPlanningActivity.id) {
                throw new Error("Invalid AnnualPlanningActivity: missing ID");
            }
            // Determine year based on explicit distribution or default logic.
            var year = distribution && distribution.planningYear >= 1 && distribution.planningYear <= 4
                ? "Y".concat(distribution.planningYear)
                : 'Y1';
            // Determine priority from recommendations or default
            var priority = 'MEDIUM';
            if (recommendations && recommendations.length > 0) {
                var crit = recommendations.find(function (r) { return r.priority === 'CRITICAL'; });
                var high = recommendations.find(function (r) { return r.priority === 'HIGH'; });
                if (crit)
                    priority = 'CRITICAL';
                else if (high)
                    priority = 'HIGH';
            }
            var assignment = {
                assignmentId: "ASSIGN-".concat(annualPlanningActivity.id, "-").concat(Date.now()),
                activityReferenceId: annualPlanningActivity.id,
                planningCycleId: (context === null || context === void 0 ? void 0 : context.planningCycleId) || 'CYCLE-DEFAULT',
                planningSnapshotVersion: (context === null || context === void 0 ? void 0 : context.planningSnapshotVersion) || '1.0.0',
                planningYear: year,
                semester: (distribution === null || distribution === void 0 ? void 0 : distribution.recommendedSemester) || 1,
                quarter: (distribution === null || distribution === void 0 ? void 0 : distribution.recommendedQuarter) || 1,
                priority: priority,
                sequence: (distribution === null || distribution === void 0 ? void 0 : distribution.recommendedSequence) || 1,
                dependencyReferences: (distribution === null || distribution === void 0 ? void 0 : distribution.dependencyReferences) || [],
                recommendationReferences: (recommendations === null || recommendations === void 0 ? void 0 : recommendations.map(function (r) { return r.recommendationId; })) || [],
                assignmentStatus: 'DRAFT',
                assignmentSource: distribution ? 'BUSINESS_RULES' : 'DEFAULT',
                assignmentReason: distribution ? 'Assigned based on explicitly provided planning distribution.' : 'Default assignment applied.',
                createdAt: Date.now(),
                createdBy: (context === null || context === void 0 ? void 0 : context.userId) || 'SYSTEM',
                businessRuleVersion: (businessRules === null || businessRules === void 0 ? void 0 : businessRules.version) || '1.0.0',
                assignmentVersion: '1.0.0',
                schemaVersion: '1.0.0',
                metadata: {}
            };
            return {
                success: true,
                assignment: assignment,
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [error.message]
            };
        }
    };
    return PlanningAssignmentService;
}());
exports.PlanningAssignmentService = PlanningAssignmentService;
