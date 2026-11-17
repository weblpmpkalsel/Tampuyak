import { TaxonomyEntry } from './PedagogicalTaxonomy';

export const LEARNING_CHALLENGE_TAXONOMY: TaxonomyEntry[] = [
  {
    id: "LC-LIT-001",
    displayName: "Literacy Gap",
    description: "Student reads below the expected grade level, struggling with comprehension or fluency.",
    governmentTags: ["Intervensi Literasi", "Rapor Pendidikan"],
    simuridTags: ["Hambatan Belajar", "Literasi"],
    deepLearningTags: ["Literacy Deficit", "Reading Comprehension Intervention"]
  },
  {
    id: "LC-NUM-001",
    displayName: "Numeracy Gap",
    description: "Student struggles with basic mathematical operations expected for their grade level.",
    governmentTags: ["Intervensi Numerasi", "Rapor Pendidikan"],
    simuridTags: ["Hambatan Belajar", "Numerasi"],
    deepLearningTags: ["Numeracy Deficit", "Mathematical Reasoning Intervention"]
  },
  {
    id: "LC-ATT-001",
    displayName: "Attention and Focus",
    description: "Student has difficulty maintaining attention on tasks for appropriate lengths of time.",
    governmentTags: ["Bimbingan Konseling", "Kesejahteraan Psikologis"],
    simuridTags: ["Hambatan Perilaku", "Fokus"],
    deepLearningTags: ["Attention Span Deficit", "Executive Functioning"]
  },
  {
    id: "LC-MOT-001",
    displayName: "Low Motivation",
    description: "Student exhibits lack of interest or engagement in learning activities.",
    governmentTags: ["Motivasi Belajar", "Iklim Keamanan"],
    simuridTags: ["Sikap Belajar", "Motivasi"],
    deepLearningTags: ["Intrinsic Motivation Deficit", "Engagement"]
  },
  {
    id: "LC-SOC-001",
    displayName: "Socio-Emotional Challenges",
    description: "Student struggles with emotional regulation, peer relationships, or social skills.",
    governmentTags: ["Iklim Kebinekaan", "Karakter", "8 Dimensi Profil Lulusan"],
    simuridTags: ["Sosial", "Emosional"],
    deepLearningTags: ["Socio-Emotional Learning Needs", "Affective Regulation"]
  }
];
