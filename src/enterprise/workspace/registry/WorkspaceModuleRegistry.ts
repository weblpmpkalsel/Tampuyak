import React from 'react';
import { DashboardModule } from '../modules/DashboardModule';
import { LearningPlanningModule } from '../modules/LearningPlanningModule';
import { ProfileModule } from '../modules/ProfileModule';
import { AdministrativeMetadataModule } from '../modules/AdministrativeMetadataModule';
import { StudentPedagogicalProfileModule } from '../modules/StudentPedagogicalProfileModule';
import { CurriculumHubModule } from '../modules/CurriculumHubModule';
import { EvaluationHubModule } from '../modules/EvaluationHubModule';
import { ProfessionalDevelopmentModule } from '../modules/ProfessionalDevelopmentModule';
import { ComplianceCenterModule } from '../modules/ComplianceCenterModule';
import { DocumentLibraryModule } from '../modules/DocumentLibraryModule';
import { LayoutDashboard, Building, FileText, Users, BookOpen, Target, Lightbulb, ShieldCheck, Library, Compass } from 'lucide-react';

export interface WorkspaceModuleConfig {
  id: string;
  label: string;
  icon: any;
  component: React.ComponentType<any>;
  isFuture?: boolean;
}

export const workspaceModuleRegistry: WorkspaceModuleConfig[] = [
  {
    id: 'dashboard',
    label: 'Beranda',
    icon: LayoutDashboard,
    component: DashboardModule,
  },
  {
    id: 'bab1-karakteristik',
    label: 'BAB I - Karakteristik',
    icon: Building,
    component: ProfileModule, 
  },
  {
    id: 'bab2-arah-strategis',
    label: 'BAB II - Arah Strategis',
    icon: Compass,
    // Using ProfileModule for now since it contains Vision, Mission, Goals in its 'vision' tab. 
    // Ideally this would be split, but for navigation purposes we map it here.
    component: ProfileModule,
  },
  {
    id: 'bab3-pengorganisasian',
    label: 'BAB III - Pengorganisasian Pembelajaran',
    icon: BookOpen,
    component: CurriculumHubModule,
  },
  {
    id: 'bab4-perencanaan',
    label: 'BAB IV - Perencanaan Pembelajaran',
    icon: Target,
    component: LearningPlanningModule,
  },
  {
    id: 'bab5-evaluasi',
    label: 'BAB V - Evaluasi & Pengembangan',
    icon: Lightbulb,
    component: EvaluationHubModule, 
  },
  {
    id: 'document-library',
    label: 'Pustaka Dokumen (PDF)',
    icon: Library,
    component: DocumentLibraryModule,
  },
  {
    id: 'administrative',
    label: 'Administrasi & Data (Legacy)',
    icon: FileText,
    component: AdministrativeMetadataModule,
  },
  {
    id: 'compliance-center',
    label: 'Pusat Kepatuhan',
    icon: ShieldCheck,
    component: ComplianceCenterModule,
  }
];
