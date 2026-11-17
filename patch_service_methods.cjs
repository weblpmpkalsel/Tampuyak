const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

const newMethods = `
  public startTracking(dto: StartTrackingDTO): FollowUp {
    const updatedActionPlans = dto.followUp.actionPlans.map(ap => 
      ap.id === dto.actionPlanId ? { ...ap, status: ActionPlanStatus.TRACKING_ACTIVE } : ap
    );
    return {
      ...dto.followUp,
      actionPlans: updatedActionPlans
    };
  }

  public updateTracking(dto: UpdateTrackingDTO): FollowUp {
    const updatedActionPlans = dto.followUp.actionPlans.map(ap => {
      if (ap.id === dto.actionPlanId) {
        const log: TrackingLog = {
          id: this.generateId(),
          date: Date.now(),
          type: 'TEACHER_PROGRESS',
          notes: dto.notes,
          evidenceUrl: dto.evidenceUrl
        };
        return {
          ...ap,
          trackingLogs: [...(ap.trackingLogs || []), log]
        };
      }
      return ap;
    });
    return {
      ...dto.followUp,
      actionPlans: updatedActionPlans
    };
  }

  public scheduleFollowUpReview(dto: ScheduleFollowUpReviewDTO): FollowUp {
    const updatedActionPlans = dto.followUp.actionPlans.map(ap => {
      if (ap.id === dto.actionPlanId) {
        const log: TrackingLog = {
          id: this.generateId(),
          date: Date.now(),
          type: 'SUPERVISOR_MONITORING',
          notes: dto.notes,
          nextReviewDate: dto.nextReviewDate
        };
        return {
          ...ap,
          status: ActionPlanStatus.FOLLOW_UP_REVIEW,
          trackingLogs: [...(ap.trackingLogs || []), log]
        };
      }
      return ap;
    });
    return {
      ...dto.followUp,
      actionPlans: updatedActionPlans
    };
  }

  public completeTracking(dto: CompleteTrackingDTO): FollowUp {
    const updatedActionPlans = dto.followUp.actionPlans.map(ap => 
      ap.id === dto.actionPlanId ? { ...ap, status: ActionPlanStatus.TRACKING_COMPLETED } : ap
    );
    return {
      ...dto.followUp,
      actionPlans: updatedActionPlans
    };
  }
`;

if (!code.includes("public startTracking")) {
  code = code.replace(
    /^}$/m,
    newMethods + "\n}"
  );
}

fs.writeFileSync(file, code);
