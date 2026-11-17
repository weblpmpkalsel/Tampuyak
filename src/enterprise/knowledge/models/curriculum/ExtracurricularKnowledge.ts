export interface ExtracurricularKnowledge {
  readonly id: string;
  readonly knowledgeOwner: 'Curriculum Hub';
  readonly governmentSource: string; // e.g., 'Permendikbud tentang Ekstrakurikuler'
  readonly version: string;
  readonly metadata: {
    readonly kemendikdasmenAligned: boolean;
    readonly deepLearningAligned: boolean;
    readonly profilLulusanDimensions: ReadonlyArray<string>;
    readonly tujuhKebiasaan: ReadonlyArray<string>; // Mapped to 7 Kebiasaan
  };
  readonly validationRules: ReadonlyArray<string>;

  readonly payload: {
    readonly mandatoryPrograms: ReadonlyArray<{
      readonly id: string;
      readonly name: string; // e.g., 'Pramuka'
      readonly description: string;
      readonly targetHabits: ReadonlyArray<string>; // References to 7 Kebiasaan
    }>;
    readonly optionalPrograms: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
      readonly description: string;
      readonly targetHabits: ReadonlyArray<string>; // References to 7 Kebiasaan
    }>;
    readonly routines: ReadonlyArray<{
      readonly id: string;
      readonly name: string; // e.g., 'Upacara Bendera', 'Senam Pagi'
      readonly frequency: string;
      readonly targetHabits: ReadonlyArray<string>;
    }>;
  };
}
