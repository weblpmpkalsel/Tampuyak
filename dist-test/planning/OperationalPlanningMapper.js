"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationalPlanningMapper = void 0;
var OperationalPlanningMapper = /** @class */ (function () {
    function OperationalPlanningMapper() {
    }
    /**
     * Maps a PlanningDistribution (metadata) to an OperationalPlanningActivity,
     * injecting the required IDs and default operational properties.
     * This bridges the distribution logic to the operational execution domain.
     */
    OperationalPlanningMapper.fromDistribution = function (operationalId, programRefId, distribution) {
        return {
            operationalPlanningId: operationalId,
            activityReferenceId: distribution.activityReferenceId,
            programReferenceId: programRefId,
            planningYear: "Y".concat(distribution.planningYear),
            semester: distribution.recommendedSemester,
            quarter: distribution.recommendedQuarter,
            priority: 'MEDIUM',
            sequence: distribution.recommendedSequence,
            dependencyReferences: distribution.dependencyReferences || [],
            recommendationReferences: [],
            executionReference: null,
            status: 'PLANNED',
            metadata: distribution.metadata || {}
        };
    };
    return OperationalPlanningMapper;
}());
exports.OperationalPlanningMapper = OperationalPlanningMapper;
