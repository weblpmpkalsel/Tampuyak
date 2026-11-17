const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `public startPreObservation(dto: StartPreObservationDTO): SupervisionSchedule {
    if (!dto.schedule || dto.schedule.status !== SupervisionStatus.SCHEDULED) {
      throw new Error("Validation Error: Schedule must be in SCHEDULED state.");
    }
    
    // We can add notes to schedule.preObservation
    return {
      ...dto.schedule,
      status: SupervisionStatus.PRE_OBSERVATION,
      preObservation: {
        id: this.generateId(),
        notes: dto.notes,
        teachingModules: [],
        supportingDocuments: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      updatedAt: Date.now(),
    };
  }

  public submitTeachingModule(dto: UploadTeachingModuleDTO, schedule: SupervisionSchedule): SupervisionSchedule {
    if (!schedule.preObservation) {
      throw new Error("Validation Error: Pre-observation is not initialized.");
    }

    const newModule = {
      id: this.generateId(),
      title: dto.moduleTitle,
      topic: dto.moduleTopic,
      url: dto.moduleUrl,
      version: dto.moduleVersion,
      notes: dto.notes,
      uploadedAt: Date.now()
    };

    return {
      ...schedule,
      preObservation: {
        ...schedule.preObservation,
        teachingModules: [...(schedule.preObservation.teachingModules || []), newModule],
        updatedAt: Date.now()
      },
      updatedAt: Date.now()
    };
  }`,
  `public startPreObservation(dto: StartPreObservationDTO): SupervisionSchedule {
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
  }`
);

fs.writeFileSync(file, code);
