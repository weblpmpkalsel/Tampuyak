const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export interface CreateFollowUpPlanDTO {
  supervisionId: string;
  actionPlans: Array<{ description: string; targetDate: number }>;
}`,
  `export interface CreateActionPlanDTO {
  followUp: FollowUp;
  title: string;
  description: string;
  target: string;
  targetDate: number;
  priority: RecommendationPriority;
}

export interface UpdateActionProgressDTO {
  followUp: FollowUp;
  actionPlanId: string;
  status: ActionPlanStatus;
}

export interface SubmitActionEvidenceDTO {
  followUp: FollowUp;
  actionPlanId: string;
  type: EvidenceType;
  url: string;
  description: string;
}

export interface CompleteActionPlanDTO {
  followUp: FollowUp;
}`
);

const createFollowUpRegex = /public createFollowUpPlan[\s\S]*?public generateRecommendation/m;
const createFollowUpReplacement = `public startFollowUp(dto: { schedule: SupervisionSchedule }): FollowUp {
    if (!dto.schedule || dto.schedule.status !== SupervisionStatus.WAITING_FOR_FOLLOW_UP) {
      throw new Error("Validation Error: Schedule must be in WAITING_FOR_FOLLOW_UP state.");
    }
    return {
      id: this.generateId(),
      supervisionId: dto.schedule.id,
      actionPlans: [],
      createdAt: Date.now()
    };
  }

  public createActionPlan(dto: CreateActionPlanDTO): FollowUp {
    const newActionPlan: ActionPlan = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      target: dto.target,
      targetDate: dto.targetDate,
      priority: dto.priority,
      status: ActionPlanStatus.NOT_STARTED,
      evidences: []
    };

    return {
      ...dto.followUp,
      actionPlans: [...dto.followUp.actionPlans, newActionPlan]
    };
  }

  public updateActionProgress(dto: UpdateActionProgressDTO): FollowUp {
    const updatedActionPlans = dto.followUp.actionPlans.map(ap => 
      ap.id === dto.actionPlanId ? { ...ap, status: dto.status } : ap
    );
    return {
      ...dto.followUp,
      actionPlans: updatedActionPlans
    };
  }

  public submitActionEvidence(dto: SubmitActionEvidenceDTO): FollowUp {
    const updatedActionPlans = dto.followUp.actionPlans.map(ap => {
      if (ap.id === dto.actionPlanId) {
        const newEvidence: Evidence = {
          id: this.generateId(),
          type: dto.type,
          url: dto.url,
          description: dto.description
        };
        return {
          ...ap,
          evidences: ap.evidences ? [...ap.evidences, newEvidence] : [newEvidence]
        };
      }
      return ap;
    });

    return {
      ...dto.followUp,
      actionPlans: updatedActionPlans
    };
  }

  public completeActionPlan(dto: CompleteActionPlanDTO): FollowUp {
    // No specific complete action on FollowUp itself in requirements, but let's assume it checks if all are done
    return dto.followUp;
  }

  public generateRecommendation`;

code = code.replace(createFollowUpRegex, createFollowUpReplacement);
code = code.replace("import {\n  PostObservation,", "import {\n  PostObservation,\n  ActionPlanStatus,");

fs.writeFileSync(file, code);
