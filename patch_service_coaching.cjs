const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export interface ConductCoachingDTO \{[\s\S]*?\}/,
  `export interface StartPostObservationDTO {
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
}`
);

const regex = /public conductCoachingSession[\s\S]*?public createFollowUpPlan/m;
const replacement = `public startPostObservation(dto: StartPostObservationDTO): PostObservation {
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

  public createFollowUpPlan`;

code = code.replace(regex, replacement);
code = code.replace(
  "import {",
  "import {\n  PostObservation,"
);
fs.writeFileSync(file, code);
