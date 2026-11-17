import { TaxonomyEntry } from './PedagogicalTaxonomy';

export const LEARNING_CONTEXT_TAXONOMY: TaxonomyEntry[] = [
  {
    id: "CTX-SOC-001",
    displayName: "Urban / High Connectivity",
    description: "Students have steady internet access and live in urban areas with abundant learning facilities.",
    governmentTags: ["Kondisi Sosio-Ekonomi", "Infrastruktur Digital"],
    simuridTags: ["Latar Belakang", "Akses"],
    deepLearningTags: ["Digital Access Rich", "Urban Context"]
  },
  {
    id: "CTX-SOC-002",
    displayName: "Rural / Limited Connectivity",
    description: "Students live in areas with limited internet access or technological infrastructure.",
    governmentTags: ["Daerah Tertinggal", "Kesenjangan Digital", "Infrastruktur"],
    simuridTags: ["Latar Belakang", "Keterbatasan Akses"],
    deepLearningTags: ["Digital Divide", "Resource Constrained"]
  },
  {
    id: "CTX-FAM-001",
    displayName: "High Parental Involvement",
    description: "Parents actively participate in the student's learning process at home.",
    governmentTags: ["Keterlibatan Orang Tua", "Tri Pusat Pendidikan"],
    simuridTags: ["Dukungan Keluarga", "Pendampingan"],
    deepLearningTags: ["Parental Engagement", "Scaffolded Home Environment"]
  },
  {
    id: "CTX-FAM-002",
    displayName: "Low Parental Involvement",
    description: "Parents have limited availability to participate in the student's learning process due to work or other factors.",
    governmentTags: ["Bimbingan Konseling", "Kondisi Keluarga"],
    simuridTags: ["Dukungan Keluarga", "Mandiri"],
    deepLearningTags: ["Independent Learner", "Low Scaffolded Home Environment"]
  }
];
