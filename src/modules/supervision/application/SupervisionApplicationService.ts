import { v4 as uuidv4 } from 'uuid';
import { ISupervisionRepositoryFactory } from '../persistence/ISupervisionRepositories';
import {
  PostObservation,
  ActionPlanStatus,
  SupervisionPlan,
  SupervisionSchedule,
  SupervisionStatus,
  ObservationStatus,
  AcademicCalendarSnapshot,
  RktProgramSnapshot,
  TeacherSnapshot,
  Supervisor,
  SupervisionScoreCategory,
  PreObservation,
  TeachingModuleSnapshot,
  Observation,
  ObservationSession,
  ObservationScore,
  ObservationNote,
  CoachingSession,
  CoachingStatus,
  FollowUp,
  TrackingLog,
  ActionPlan,
  Recommendation,
  RecommendationPriority,
  Evidence,
  EvidenceType,
  Reflection,
  SupervisionInstrument,
  RubricCategory,
  RubricItem
} from '../types/SupervisionTypes';

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

export interface CreateInstrumentDTO {
  name: string;
  categories: Array<{ id: string; name: string; weight: number }>;
  items: Array<{ categoryId: string; description: string; maxScore: number }>;
}

export interface ConfigureProgramInstrumentDTO {
  plan: SupervisionPlan;
  template: SupervisionInstrument;
}

export interface CreateSupervisionPlanDTO {
  title: string;
  description: string;
  academicYear: string;
  semester: string;
  rktReference?: {
    programId: string;
    programName: string;
    year: string;
  };
}

export interface AssignTeacherDTO {
  planId: string;
  teacherId: string;
  teacherNip: string;
  teacherName: string;
  teacherSubject: string;
  teacherRank: string;
}

export interface ScheduleSupervisionDTO {
  schedule: SupervisionSchedule;
  supervisorId: string;
  supervisorName: string;
  supervisorRole: string;
  scheduledDate: number;
}

export interface StartPreObservationDTO {
  schedule: SupervisionSchedule;
  notes: string;
}

export interface UploadTeachingModuleDTO {
  supervisionId: string;
  moduleTitle: string;
  moduleTopic: string;
  moduleUrl: string;
  moduleVersion: string;
  notes: string;
}

export interface StartObservationDTO {
  schedule: SupervisionSchedule;
  instrument: SupervisionInstrument;
  className: string;
  subjectName: string;
  studentCount: number;
}

export interface ScoreIndicatorDTO {
  observation: Observation;
  rubricItemId: string;
  score: number;
}

export interface AddObservationNoteDTO {
  observation: Observation;
  content: string;
}

export interface AddEvidenceDTO {
  observation: Observation;
  type: EvidenceType;
  url: string;
  description: string;
}

export interface SubmitReflectionDTO {
  supervisionId: string;
  teacherId: string;
  content: string;
}

export interface StartPostObservationDTO {
  schedule: SupervisionSchedule;
}

export interface CreateCoachingNoteDTO {
  postObservation: PostObservation;
  assessorNotes: string;
}

export interface SubmitTeacherResponseDTO {
  postObservation: PostObservation;
  agreedCommitment: string;
}

export interface CompletePostObservationDTO {
  postObservation: PostObservation;
}

export interface CreateActionPlanDTO {
  followUp: FollowUp;
  title: string;
  description: string;
  category?: string;
  target: string;
  targetDate: number;
  priority: RecommendationPriority;
  expectedEvidence?: string;
}

export interface UpdateActionProgressDTO {
  followUp: FollowUp;
  actionPlanId: string;
  status: ActionPlanStatus;
  teacherNotes?: string;
}

export interface VerifyActionPlanDTO {
  followUp: FollowUp;
  actionPlanId: string;
  isApproved: boolean;
  verifierNotes?: string;
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
}

export interface GenerateRecommendationDTO {
  planId: string;
  priority: RecommendationPriority;
  description: string;
  justification: string;
}

// ============================================================================
// APPLICATION SERVICE
// ============================================================================

/**
 * SupervisionApplicationService
 * 
 * Bertanggung jawab mengorkestrasi alur Use Case dan memanipulasi Domain Model.
 * Service ini TIDAK bergantung pada implementasi database, API, atau UI.
 * Semua persistensi data akan di-handle oleh Storage Adapter (di fase berikutnya).
 */

export interface StartTrackingDTO {
  followUp: FollowUp;
  actionPlanId: string;
}

export interface UpdateTrackingDTO {
  followUp: FollowUp;
  actionPlanId: string;
  notes: string;
  evidenceUrl?: string;
}

export interface ScheduleFollowUpReviewDTO {
  followUp: FollowUp;
  actionPlanId: string;
  notes: string;
  nextReviewDate: number;
}

export interface CompleteTrackingDTO {
  followUp: FollowUp;
  actionPlanId: string;
}

export class SupervisionApplicationService {
  constructor(private readonly repositories: ISupervisionRepositoryFactory) {}
  
  /**
   * UC: Create Supervision Instrument
   */
  public createInstrument(dto: CreateInstrumentDTO): SupervisionInstrument {
    if (!dto.name) {
      throw new Error("Validation Error: Instrument name is required.");
    }

    const categories: RubricCategory[] = dto.categories.map(c => ({
      id: c.id || this.generateId(),
      name: c.name,
      weight: c.weight,
    }));

    const items: RubricItem[] = dto.items.map(i => ({
      id: this.generateId(),
      categoryId: i.categoryId,
      description: i.description,
      maxScore: i.maxScore,
    }));

    return {
      id: this.generateId(),
      name: dto.name,
      categories,
      items,
      status: SupervisionStatus.DRAFT,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /**
   * UC: Configure Program Instrument
   */
  public configureProgramInstrument(dto: ConfigureProgramInstrumentDTO): SupervisionPlan {
    if (dto.plan.status !== SupervisionStatus.DRAFT) {
      throw new Error("Validation Error: Instrument can only be configured in DRAFT status.");
    }
    
    // Create deep copy of template for snapshot
    const instrumentSnapshot: SupervisionInstrument = JSON.parse(JSON.stringify(dto.template));
    
    // Ensure the snapshot has its own ID to separate it from the template
    instrumentSnapshot.id = this.generateId();
    
    return {
      ...dto.plan,
      instrumentSnapshot,
      status: SupervisionStatus.READY_FOR_SCHEDULING,
      updatedAt: Date.now()
    };
  }

  /**
   * UC01: Create Supervision Plan
   */
  public createSupervisionPlan(dto: CreateSupervisionPlanDTO): SupervisionPlan {
    if (!dto.title || !dto.academicYear || !dto.semester) {
      throw new Error("Validation Error: Title, Academic Year, and Semester are required.");
    }

    const calendarSnapshot: AcademicCalendarSnapshot = {
      academicYear: dto.academicYear,
      semester: dto.semester,
    };

    let rktReference: RktProgramSnapshot | undefined;
    if (dto.rktReference) {
      rktReference = {
        programId: dto.rktReference.programId,
        programName: dto.rktReference.programName,
        year: dto.rktReference.year,
      };
    }

    return {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      calendarSnapshot,
      rktReference,
      status: SupervisionStatus.DRAFT,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /**
   * UC02a: Assign Teacher to Plan
   */
  public assignTeacher(dto: AssignTeacherDTO): SupervisionSchedule {
    if (!dto.planId || !dto.teacherId) {
      throw new Error("Validation Error: Plan ID and Teacher ID are required.");
    }

    const teacherSnapshot: TeacherSnapshot = {
      id: dto.teacherId,
      nip: dto.teacherNip,
      name: dto.teacherName,
      subject: dto.teacherSubject,
      rank: dto.teacherRank
    };

    return {
      id: this.generateId(),
      planId: dto.planId,
      teacherSnapshot,
      // Leave scheduling details empty for later refinement during actual scheduling phase
      supervisor: null as any,
      scheduledDate: null as any,
      status: SupervisionStatus.DRAFT,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /**
   * UC02b: Schedule Supervision
   */
  public scheduleSupervision(dto: ScheduleSupervisionDTO): SupervisionSchedule {
    if (!dto.schedule || !dto.supervisorId || !dto.scheduledDate) {
      throw new Error("Validation Error: Schedule, Supervisor ID, and Scheduled Date are required.");
    }

    const supervisor: Supervisor = {
      id: dto.supervisorId,
      name: dto.supervisorName,
      role: dto.supervisorRole
    };

    return {
      ...dto.schedule,
      supervisor,
      scheduledDate: dto.scheduledDate,
      status: SupervisionStatus.SCHEDULED,
      updatedAt: Date.now(),
    };
  }

  /**
   * UC03: Upload Teaching Module (Pre-Observation evaluation setup)
   */
  public uploadTeachingModule(dto: UploadTeachingModuleDTO): PreObservation {
    const moduleSnapshot: TeachingModuleSnapshot = {
      title: dto.moduleTitle,
      topic: dto.moduleTopic,
      url: dto.moduleUrl,
      version: dto.moduleVersion,
    };

    return {
      id: this.generateId(),
      supervisionId: dto.supervisionId,
      moduleSnapshot,
      notes: dto.notes,
      isReadyForObservation: true,
      status: ObservationStatus.COMPLETED,
      completedAt: Date.now()
    };
  }

  /**
   * UC04: Conduct Observation
   */
  public startObservation(dto: StartObservationDTO): Observation {
    if (!dto.schedule || dto.schedule.status !== SupervisionStatus.PRE_OBSERVATION) {
      throw new Error("Validation Error: Schedule must be in PRE_OBSERVATION state.");
    }

    const session: ObservationSession = {
      id: this.generateId(),
      supervisionId: dto.schedule.id,
      teacherSnapshot: dto.schedule.teacherSnapshot,
      instrumentSnapshot: dto.instrument,
      startTime: Date.now(),
      className: dto.className,
      subjectName: dto.subjectName,
      studentCount: dto.studentCount
    };

    return {
      id: this.generateId(),
      supervisionId: dto.schedule.id,
      session,
      scores: [],
      notes: [],
      evidences: [],
      finalScoreCategory: null,
      status: ObservationStatus.IN_PROGRESS
    };
  }

  public scoreIndicator(dto: ScoreIndicatorDTO): Observation {
    if (dto.observation.status !== ObservationStatus.IN_PROGRESS) {
      throw new Error("Validation Error: Observation is not in progress.");
    }

    const existingScoreIndex = dto.observation.scores.findIndex(s => s.rubricItemId === dto.rubricItemId);
    let newScores = [...dto.observation.scores];
    
    if (existingScoreIndex >= 0) {
      newScores[existingScoreIndex] = { ...newScores[existingScoreIndex], score: dto.score };
    } else {
      newScores.push({ rubricItemId: dto.rubricItemId, score: dto.score });
    }

    return {
      ...dto.observation,
      scores: newScores
    };
  }

  public addObservationNote(dto: AddObservationNoteDTO): Observation {
    if (dto.observation.status !== ObservationStatus.IN_PROGRESS) {
      throw new Error("Validation Error: Observation is not in progress.");
    }

    const newNote: ObservationNote = {
      id: this.generateId(),
      observationId: dto.observation.id,
      content: dto.content,
      timestamp: Date.now()
    };

    return {
      ...dto.observation,
      notes: [...dto.observation.notes, newNote]
    };
  }

  public addEvidence(dto: AddEvidenceDTO): Observation {
    if (dto.observation.status !== ObservationStatus.IN_PROGRESS) {
      throw new Error("Validation Error: Observation is not in progress.");
    }

    const newEvidence: Evidence = {
      id: this.generateId(),
      type: dto.type,
      url: dto.url,
      description: dto.description
    };

    return {
      ...dto.observation,
      evidences: [...dto.observation.evidences, newEvidence]
    };
  }

  public finishObservation(observation: Observation): Observation {
    if (observation.status !== ObservationStatus.IN_PROGRESS) {
      throw new Error("Validation Error: Observation is not in progress.");
    }

    // Logic for calculating finalScoreCategory could go here based on instrumentSnapshot and scores.
    // We'll just set it to COMPLETED for now.
    return {
      ...observation,
      session: {
        ...observation.session,
        endTime: Date.now()
      },
      status: ObservationStatus.COMPLETED,
      completedAt: Date.now()
    };
  }

  public startPreObservation(dto: StartPreObservationDTO): SupervisionSchedule {
    if (!dto.schedule || dto.schedule.status !== SupervisionStatus.SCHEDULED) {
      throw new Error("Validation Error: Schedule must be in SCHEDULED state.");
    }
    return {
      ...dto.schedule,
      status: SupervisionStatus.PRE_OBSERVATION,
      updatedAt: Date.now(),
    };
  }

  public submitTeachingModule(dto: UploadTeachingModuleDTO): PreObservation {
    return {
      id: this.generateId(),
      supervisionId: dto.supervisionId,
      moduleSnapshot: {
        title: dto.moduleTitle,
        topic: dto.moduleTopic,
        url: dto.moduleUrl,
        version: dto.moduleVersion,
      },
      notes: dto.notes,
      isReadyForObservation: true,
      status: ObservationStatus.NOT_STARTED,
    };
  }

  public submitReflection(dto: SubmitReflectionDTO): Reflection {
    if (!dto.content) {
      throw new Error("Validation Error: Reflection content is required.");
    }

    return {
      id: this.generateId(),
      teacherId: dto.teacherId,
      content: dto.content,
      submittedAt: Date.now()
    };
  }

  /**
   * UC06: Conduct Coaching Session
   */
  public startPostObservation(dto: StartPostObservationDTO): PostObservation {
    if (!dto.schedule || dto.schedule.status !== SupervisionStatus.POST_OBSERVATION) {
      throw new Error("Validation Error: Schedule must be in POST_OBSERVATION state.");
    }

    const coaching: CoachingSession = {
      id: this.generateId(),
      supervisionId: dto.schedule.id,
      assessorNotes: "",
      agreedCommitment: "",
      status: CoachingStatus.SCHEDULED
    };

    return {
      id: this.generateId(),
      supervisionId: dto.schedule.id,
      coaching
    };
  }

  public createCoachingNote(dto: CreateCoachingNoteDTO): PostObservation {
    return {
      ...dto.postObservation,
      coaching: {
        ...dto.postObservation.coaching,
        assessorNotes: dto.assessorNotes,
        status: CoachingStatus.CONDUCTED
      }
    };
  }

  public submitTeacherResponse(dto: SubmitTeacherResponseDTO): PostObservation {
    return {
      ...dto.postObservation,
      coaching: {
        ...dto.postObservation.coaching,
        agreedCommitment: dto.agreedCommitment,
        status: CoachingStatus.AGREED
      }
    };
  }

  public completePostObservation(dto: CompletePostObservationDTO): PostObservation {
    if (dto.postObservation.coaching.status !== CoachingStatus.AGREED) {
      throw new Error("Validation Error: Coaching must be agreed before completion.");
    }
    
    return {
      ...dto.postObservation,
      coaching: {
        ...dto.postObservation.coaching,
        conductedAt: Date.now()
      },
      completedAt: Date.now()
    };
  }

  public startFollowUp(dto: { schedule: SupervisionSchedule }): FollowUp {
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
      category: dto.category,
      target: dto.target,
      targetDate: dto.targetDate,
      priority: dto.priority,
      expectedEvidence: dto.expectedEvidence,
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
      ap.id === dto.actionPlanId ? { ...ap, status: dto.status, teacherNotes: dto.teacherNotes || ap.teacherNotes } : ap
    );
    return {
      ...dto.followUp,
      actionPlans: updatedActionPlans
    };
  }

  public verifyActionPlan(dto: VerifyActionPlanDTO): FollowUp {
    const updatedActionPlans = dto.followUp.actionPlans.map(ap => 
      ap.id === dto.actionPlanId ? { 
        ...ap, 
        status: dto.isApproved ? ActionPlanStatus.VERIFIED : ActionPlanStatus.REVISION_NEEDED,
        verifierNotes: dto.verifierNotes || ap.verifierNotes
      } : ap
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

  public generateRecommendation(dto: GenerateRecommendationDTO): Recommendation {
    if (!dto.description || !dto.justification) {
      throw new Error("Validation Error: Description and justification are required.");
    }

    return {
      id: this.generateId(),
      planId: dto.planId,
      priority: dto.priority,
      description: dto.description,
      justification: dto.justification,
      isAcknowledged: false
    };
  }

  /**
   * Internal Helper (Hanya untuk keperluan instansiasi domain murni)
   */

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

  private generateId(): string {
    return uuidv4();
  }
}
