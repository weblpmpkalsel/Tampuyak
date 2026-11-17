const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export interface ScheduleSupervisionDTO {
  planId: string;
  teacherId: string;
  teacherNip: string;
  teacherName: string;
  teacherSubject: string;
  teacherRank: string;
  supervisorId: string;
  supervisorName: string;
  supervisorRole: string;
  scheduledDate: number;
}`,
  `export interface ScheduleSupervisionDTO {
  schedule: SupervisionSchedule;
  supervisorId: string;
  supervisorName: string;
  supervisorRole: string;
  scheduledDate: number;
}`
);

code = code.replace(
  `  public scheduleSupervision(dto: ScheduleSupervisionDTO): SupervisionSchedule {
    if (!dto.planId || !dto.teacherId || !dto.supervisorId) {
      throw new Error("Validation Error: Plan ID, Teacher ID, and Supervisor ID are required.");
    }

    const teacherSnapshot: TeacherSnapshot = {
      id: dto.teacherId,
      nip: dto.teacherNip,
      name: dto.teacherName,
      subject: dto.teacherSubject,
      rank: dto.teacherRank
    };

    const supervisor: Supervisor = {
      id: dto.supervisorId,
      name: dto.supervisorName,
      role: dto.supervisorRole
    };

    return {
      id: this.generateId(),
      planId: dto.planId,
      teacherSnapshot,
      supervisor,
      scheduledDate: dto.scheduledDate,
      status: SupervisionStatus.SCHEDULED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }`,
  `  public scheduleSupervision(dto: ScheduleSupervisionDTO): SupervisionSchedule {
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
  }`
);

fs.writeFileSync(file, code);
