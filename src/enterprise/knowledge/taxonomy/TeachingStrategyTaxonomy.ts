import { TaxonomyEntry } from './PedagogicalTaxonomy';

export const TEACHING_STRATEGY_TAXONOMY: TaxonomyEntry[] = [
  {
    id: "TS-PBL-001",
    displayName: "Project-Based Learning",
    description: "Students acquire a deeper knowledge through active exploration of real-world challenges and problems.",
    governmentTags: ["P5", "Kurikulum Merdeka", "Pembelajaran Berbasis Proyek"],
    simuridTags: ["Metode Ajar", "Strategi"],
    deepLearningTags: ["Active Learning", "Constructivism", "Project Application"]
  },
  {
    id: "TS-DIFF-001",
    displayName: "Differentiated Instruction",
    description: "Tailoring instruction to meet individual needs based on content, process, products, or learning environment.",
    governmentTags: ["Diferensiasi Pembelajaran", "Kurikulum Merdeka", "Pembelajaran Berpusat Pada Siswa"],
    simuridTags: ["Metode Ajar", "Adaptif"],
    deepLearningTags: ["Personalized Learning", "Adaptive Instruction"]
  },
  {
    id: "TS-INQ-001",
    displayName: "Inquiry-Based Learning",
    description: "Students are encouraged to explore the material, ask questions, and share ideas rather than having the teacher simply present the facts.",
    governmentTags: ["Pendekatan Saintifik", "Pembelajaran Aktif"],
    simuridTags: ["Metode Ajar", "Eksplorasi"],
    deepLearningTags: ["Student-Centered", "Critical Thinking Inquiry"]
  },
  {
    id: "TS-EXP-001",
    displayName: "Experiential Learning",
    description: "Learning through experience, and more specifically defined as learning through reflection on doing.",
    governmentTags: ["Pendidikan Karakter", "Pengalaman Belajar"],
    simuridTags: ["Metode Ajar", "Praktik"],
    deepLearningTags: ["Experiential Cycle", "Reflective Practice"]
  },
  {
    id: "TS-CBO-001",
    displayName: "Competency-Based Education",
    description: "Systems of instruction, assessment, grading, and academic reporting that are based on students demonstrating that they have learned the knowledge and skills they are expected to learn.",
    governmentTags: ["Capaian Pembelajaran", "Penilaian Autentik", "Kurikulum Merdeka"],
    simuridTags: ["Metode Ajar", "Kompetensi"],
    deepLearningTags: ["Mastery Learning", "Competency Progression"]
  }
];
