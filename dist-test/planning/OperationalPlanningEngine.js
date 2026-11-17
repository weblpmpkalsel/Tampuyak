"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationalPlanningEngine = void 0;
var OperationalPlanningEngine = /** @class */ (function () {
    function OperationalPlanningEngine() {
        this.planningYears = new Map();
        this.distributions = new Map();
        this.recommendations = new Map();
        this.context = null;
    }
    /**
     * Initializes or updates the context metadata for the orchestration.
     * This does NOT modify Execution or Annual Planning data.
     */
    OperationalPlanningEngine.prototype.setContext = function (context) {
        this.context = context;
    };
    /**
     * Retrieves the current context and audit metadata.
     */
    OperationalPlanningEngine.prototype.getContext = function () {
        return this.context;
    };
    /**
     * Orchestration method to store a planning year reference.
     * NEVER duplicates actual execution or planning data.
     */
    OperationalPlanningEngine.prototype.registerPlanningYear = function (year) {
        this.planningYears.set(year.yearNumber, year);
    };
    /**
     * Orchestration method to store distribution metadata.
     */
    OperationalPlanningEngine.prototype.registerDistribution = function (distribution) {
        this.distributions.set(distribution.activityReferenceId, distribution);
    };
    /**
     * Orchestration method to store a recommendation.
     */
    OperationalPlanningEngine.prototype.registerRecommendation = function (recommendation) {
        this.recommendations.set(recommendation.recommendationId, recommendation);
    };
    /**
     * Exposes read-only access to a PlanningYear.
     */
    OperationalPlanningEngine.prototype.getPlanningYear = function (yearNumber) {
        return this.planningYears.get(yearNumber);
    };
    /**
     * Exposes read-only access to all PlanningYears.
     */
    OperationalPlanningEngine.prototype.getAllPlanningYears = function () {
        return Array.from(this.planningYears.values());
    };
    /**
     * Exposes read-only access to a PlanningDistribution by activity reference ID.
     */
    OperationalPlanningEngine.prototype.getPlanningDistribution = function (activityReferenceId) {
        return this.distributions.get(activityReferenceId);
    };
    /**
     * Exposes read-only access to all distributions for a specific year.
     */
    OperationalPlanningEngine.prototype.getPlanningDistributionsForYear = function (yearNumber) {
        return Array.from(this.distributions.values()).filter(function (d) { return d.planningYear === yearNumber; });
    };
    /**
     * Returns summary metadata for a given planning year.
     */
    OperationalPlanningEngine.prototype.getPlanningSummary = function (yearNumber) {
        var year = this.getPlanningYear(yearNumber);
        if (!year)
            return null;
        return year.summaryMetadata;
    };
    /**
     * Exposes read-only access to a PlanningRecommendation.
     */
    OperationalPlanningEngine.prototype.getRecommendation = function (recommendationId) {
        return this.recommendations.get(recommendationId);
    };
    /**
     * Exposes read-only access to all PlanningRecommendations.
     */
    OperationalPlanningEngine.prototype.getAllRecommendations = function () {
        return Array.from(this.recommendations.values());
    };
    return OperationalPlanningEngine;
}());
exports.OperationalPlanningEngine = OperationalPlanningEngine;
