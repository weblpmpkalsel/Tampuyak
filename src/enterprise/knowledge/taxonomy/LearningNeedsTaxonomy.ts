import { TaxonomyEntry } from './PedagogicalTaxonomy';

export const LEARNING_NEEDS_TAXONOMY: TaxonomyEntry[] = [
  {
    id: "LN-VIS-001",
    displayName: "Visual",
    description: "Students who learn best through visual aids, charts, and diagrams.",
    governmentTags: ["Diferensiasi Pembelajaran", "Karakteristik"],
    simuridTags: ["Kebutuhan Belajar", "Gaya Belajar"],
    deepLearningTags: ["Visual Modality", "Spatial Processing"]
  },
  {
    id: "LN-AUD-001",
    displayName: "Auditory",
    description: "Students who learn best through listening, speaking, and oral instructions.",
    governmentTags: ["Diferensiasi Pembelajaran", "Karakteristik"],
    simuridTags: ["Kebutuhan Belajar", "Gaya Belajar"],
    deepLearningTags: ["Auditory Modality", "Verbal Processing"]
  },
  {
    id: "LN-KIN-001",
    displayName: "Kinesthetic",
    description: "Students who learn best through physical activity, hands-on experiences, and movement.",
    governmentTags: ["Diferensiasi Pembelajaran", "Karakteristik"],
    simuridTags: ["Kebutuhan Belajar", "Gaya Belajar"],
    deepLearningTags: ["Kinesthetic Modality", "Motor Learning"]
  },
  {
    id: "LN-RW-001",
    displayName: "Reading/Writing",
    description: "Students who learn best through reading texts and writing notes.",
    governmentTags: ["Diferensiasi Pembelajaran", "Literasi"],
    simuridTags: ["Kebutuhan Belajar", "Gaya Belajar"],
    deepLearningTags: ["Textual Modality", "Linguistic Processing"]
  },
  {
    id: "LN-PROJ-001",
    displayName: "Project Based",
    description: "Students who learn best by creating projects and solving real-world challenges.",
    governmentTags: ["Pembelajaran Berbasis Proyek", "P5"],
    simuridTags: ["Kebutuhan Belajar"],
    deepLearningTags: ["Constructivist Learning", "Applied Context"]
  },
  {
    id: "LN-PRAC-001",
    displayName: "Practice Based",
    description: "Students who learn best through direct application and repetition of skills.",
    governmentTags: ["Vokasi", "Praktik"],
    simuridTags: ["Kebutuhan Belajar"],
    deepLearningTags: ["Procedural Memory", "Skill Acquisition"]
  },
  {
    id: "LN-DIG-001",
    displayName: "Digital Learning",
    description: "Students who thrive in digital environments utilizing technology and media.",
    governmentTags: ["Literasi Digital", "Teknologi Pembelajaran"],
    simuridTags: ["Kebutuhan Belajar", "Digital"],
    deepLearningTags: ["Digital Literacy", "Technology Integration"]
  }
];
