import { 
  SupervisionPlan,
  Observation,
  SupervisionSchedule,
  ObservationSession,
  ActionPlan,
  ActionPlanStatus,
  FollowUp,
  ObservationScore
} from '../types/SupervisionTypes';

export interface ProgramSummary {
  totalPrograms: number;
  totalTeachers: number;
  totalSupervisions: number;
}

export interface TeacherProgress {
  teacherId: string;
  teacherName: string;
  completionPercentage: number;
  status: string;
}

export interface ObservationStatistics {
  averageScore: number;
  scoreDistribution: {
    excellent: number; // 90-100
    good: number;      // 75-89
    fair: number;      // 60-74
    poor: number;      // <60
  };
}

export interface ActionPlanStatistics {
  activePlans: number;
  completedPlans: number;
  totalPlans: number;
}

export class QualityAnalyticsService {
  /**
   * Menghitung jumlah program, guru, dan supervisi
   */
  public calculateProgramSummary(
    plans: SupervisionPlan[],
    schedules: SupervisionSchedule[]
  ): ProgramSummary {
    const totalPrograms = plans.length;
    const uniqueTeachers = new Set(schedules.map(s => s.teacherSnapshot.id));
    const totalTeachers = uniqueTeachers.size;
    const totalSupervisions = schedules.length;

    return {
      totalPrograms,
      totalTeachers,
      totalSupervisions
    };
  }

  /**
   * Menghitung progres tiap guru
   */
  public calculateTeacherProgress(
    schedules: SupervisionSchedule[]
  ): TeacherProgress[] {
    return schedules.map(schedule => {
      // Menghitung status persentase berdasarkan status schedule
      let percentage = 0;
      switch (schedule.status) {
        case 'DRAFT': percentage = 0; break;
        case 'READY_FOR_SCHEDULING': percentage = 10; break;
        case 'PLANNED': percentage = 20; break;
        case 'SCHEDULED': percentage = 30; break;
        case 'PRE_OBSERVATION': percentage = 50; break;
        case 'OBSERVATION': percentage = 70; break;
        case 'POST_OBSERVATION': percentage = 80; break;
        case 'WAITING_FOR_FOLLOW_UP': percentage = 90; break;
        case 'COMPLETED': percentage = 100; break;
        case 'CANCELLED': percentage = 0; break;
        default: percentage = 0;
      }

      return {
        teacherId: schedule.teacherSnapshot.id,
        teacherName: schedule.teacherSnapshot.name,
        completionPercentage: percentage,
        status: schedule.status
      };
    });
  }

  /**
   * Menghitung statistik observasi seperti rata-rata dan distribusi nilai
   */
  public calculateObservationStatistics(
    observations: Observation[]
  ): ObservationStatistics {
    let totalScore = 0;
    let validSessions = 0;
    let excellent = 0;
    let good = 0;
    let fair = 0;
    let poor = 0;

    observations.forEach(obs => {
      const items = obs.session.instrumentSnapshot?.items || [];
      if (obs.scores && obs.scores.length > 0) {
        let sum = 0;
        let totalMax = 0;

        obs.scores.forEach(score => {
          sum += score.score;
          const item = items.find(i => i.id === score.rubricItemId);
          totalMax += item ? item.maxScore : 4; // fallback to 4 if not found
        });

        if (totalMax > 0) {
          validSessions++;
          const normalizedScore = (sum / totalMax) * 100;
          totalScore += normalizedScore;
          if (normalizedScore >= 90) excellent++;
          else if (normalizedScore >= 75) good++;
          else if (normalizedScore >= 60) fair++;
          else poor++;
        }
      }
    });

    return {
      averageScore: validSessions > 0 ? totalScore / validSessions : 0,
      scoreDistribution: {
        excellent,
        good,
        fair,
        poor
      }
    };
  }

  /**
   * Menghitung statistik rencana tindak lanjut (RTL)
   */
  public calculateActionPlanStatistics(
    followUps: FollowUp[]
  ): ActionPlanStatistics {
    let activePlans = 0;
    let completedPlans = 0;
    let totalPlans = 0;

    followUps.forEach(fu => {
      if (fu.actionPlans) {
        fu.actionPlans.forEach(ap => {
          totalPlans++;
          if ([
            ActionPlanStatus.IN_PROGRESS, 
            ActionPlanStatus.TRACKING_ACTIVE, 
            ActionPlanStatus.FOLLOW_UP_REVIEW,
            ActionPlanStatus.VERIFIED
          ].includes(ap.status)) {
            activePlans++;
          } else if ([
            ActionPlanStatus.COMPLETED, 
            ActionPlanStatus.TRACKING_COMPLETED
          ].includes(ap.status)) {
            completedPlans++;
          }
        });
      }
    });

    return {
      activePlans,
      completedPlans,
      totalPlans
    };
  }

  /**
   * Menghitung persentase penyelesaian supervisi secara keseluruhan
   */
  public calculateCompletionRate(
    schedules: SupervisionSchedule[]
  ): number {
    if (schedules.length === 0) return 0;
    const completed = schedules.filter(s => s.status === 'COMPLETED').length;
    return (completed / schedules.length) * 100;
  }
}
