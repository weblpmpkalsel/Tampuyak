import { TaxonomyEntry } from './PedagogicalTaxonomy';

export const STUDENT_POTENTIAL_TAXONOMY: TaxonomyEntry[] = [
  {
    id: "POT-LOG-001",
    displayName: "Logical-Mathematical",
    description: "Strong ability to analyze problems logically, carry out mathematical operations, and investigate issues scientifically.",
    governmentTags: ["Numerasi", "Potensi Kognitif", "7 Kebiasaan Anak Indonesia Hebat"],
    simuridTags: ["Bakat", "Potensi"],
    deepLearningTags: ["Logical Reasoning", "Analytical Thinking"]
  },
  {
    id: "POT-LIN-001",
    displayName: "Linguistic",
    description: "Sensitivity to spoken and written language, the ability to learn languages, and the capacity to use language to accomplish certain goals.",
    governmentTags: ["Literasi", "Potensi Kognitif", "7 Kebiasaan Anak Indonesia Hebat"],
    simuridTags: ["Bakat", "Potensi"],
    deepLearningTags: ["Linguistic Intelligence", "Verbal Expression"]
  },
  {
    id: "POT-INT-001",
    displayName: "Interpersonal",
    description: "Capacity to understand the intentions, motivations and desires of other people.",
    governmentTags: ["Profil Pelajar Pancasila", "Gotong Royong", "8 Dimensi Profil Lulusan"],
    simuridTags: ["Karakter", "Sosial"],
    deepLearningTags: ["Social Intelligence", "Collaboration"]
  },
  {
    id: "POT-ART-001",
    displayName: "Artistic / Creative",
    description: "Strong ability in visual arts, music, or creative expression.",
    governmentTags: ["Kreatif", "Profil Pelajar Pancasila"],
    simuridTags: ["Bakat", "Seni"],
    deepLearningTags: ["Creative Thinking", "Aesthetic Processing"]
  },
  {
    id: "POT-KIN-001",
    displayName: "Bodily-Kinesthetic",
    description: "Potential in using one's whole body or parts of the body to solve problems.",
    governmentTags: ["Pendidikan Jasmani", "Keterampilan Fisik"],
    simuridTags: ["Bakat", "Olahraga"],
    deepLearningTags: ["Motor Skills", "Physical Coordination"]
  }
];
