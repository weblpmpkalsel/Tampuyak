import { NarrativeContext } from './NarrativeTypes';

export class NarrativeContextBuilder {
  private context: Partial<NarrativeContext> = {};

  withSchoolIdentity(name: string, principal: string): this {
    this.context.schoolName = name;
    this.context.principal = principal;
    return this;
  }

  withAcademicYear(year: string): this {
    this.context.academicYear = year;
    return this;
  }

  withVisionMission(vision: string, mission: string, goals: string): this {
    this.context.vision = vision;
    this.context.mission = mission;
    this.context.goals = goals;
    return this;
  }

  withPlanningData(programCount: number, activityCount: number, budget: number): this {
    this.context.programCount = programCount;
    this.context.activityCount = activityCount;
    this.context.budget = budget.toString(); 
    return this;
  }
  
  withAchievement(achievement: string): this {
      this.context.achievement = achievement;
      return this;
  }

  withCustomData(data: Record<string, any>): this {
    this.context.customData = { ...this.context.customData, ...data };
    return this;
  }

  build(): NarrativeContext {
    return {
      schoolName: this.context.schoolName || 'Nama Sekolah',
      principal: this.context.principal || 'Kepala Sekolah',
      academicYear: this.context.academicYear || '',
      vision: this.context.vision || '',
      mission: this.context.mission || '',
      goals: this.context.goals || '',
      programCount: this.context.programCount || 0,
      activityCount: this.context.activityCount || 0,
      budget: this.context.budget || '0',
      achievement: this.context.achievement || '',
      customData: this.context.customData || {},
    };
  }
}
