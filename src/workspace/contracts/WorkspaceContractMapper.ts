import { PaudWorkspaceMetadata, KesetaraanWorkspaceMetadata } from './LevelContracts';
import { KspMetadata } from '../../ksp/KspMetadataAdapter';

export function mapPaudWorkspaceToEnterprise(paudMetadata: PaudWorkspaceMetadata, currentEnterpriseMetadata: KspMetadata): KspMetadata {
  return {
    ...currentEnterpriseMetadata,
    rawLearningOrganization: {
      ...(currentEnterpriseMetadata as any).rawLearningOrganization,
      ageGroupOrganization: paudMetadata.ageGroupOrganization,
      learningContent: paudMetadata.learningContent
    },
    rawIntracurricular: {
      ...(currentEnterpriseMetadata as any).rawIntracurricular,
      playBased: paudMetadata.playBasedIntracurricular
    },
    rawCocurricular: {
      ...(currentEnterpriseMetadata as any).rawCocurricular,
      paud: paudMetadata.paudCocurricular
    },
    rawExtracurricular: {
      ...(currentEnterpriseMetadata as any).rawExtracurricular,
      paud: paudMetadata.paudExtracurricular
    },
    rawLearningLoad: {
      ...(currentEnterpriseMetadata as any).rawLearningLoad,
      learningTimeAllocation: paudMetadata.learningTimeAllocation
    },
    rawLearningPolicy: {
      ...(currentEnterpriseMetadata as any).rawLearningPolicy,
      learningPlanning: paudMetadata.learningPlanning
    },
    rawEvaluation: {
      ...(currentEnterpriseMetadata as any).rawEvaluation,
      authenticAssessment: paudMetadata.authenticAssessment
    }
  } as any;
}

export function mapKesetaraanWorkspaceToEnterprise(kesetaraanMetadata: KesetaraanWorkspaceMetadata, currentEnterpriseMetadata: KspMetadata): KspMetadata {
  return {
    ...currentEnterpriseMetadata,
    rawCharacteristics: {
      ...(currentEnterpriseMetadata as any).rawCharacteristics,
      tutorCharacteristics: kesetaraanMetadata.tutorCharacteristics,
      partnershipDUDI: kesetaraanMetadata.partnershipDUDI
    },
    rawLearningOrganization: {
      ...(currentEnterpriseMetadata as any).rawLearningOrganization,
      skkStructure: kesetaraanMetadata.skkStructure,
      vocationalSkills: kesetaraanMetadata.vocationalSkills
    },
    rawLearningPolicy: {
      ...(currentEnterpriseMetadata as any).rawLearningPolicy,
      andragogyPlanning: kesetaraanMetadata.andragogyPlanning
    },
    rawEvaluation: {
      ...(currentEnterpriseMetadata as any).rawEvaluation,
      programEvaluation: kesetaraanMetadata.programEvaluation
    }
  } as any;
}


export function mapWorkspaceToEnterprise(settings: any, currentEnterpriseMetadata: KspMetadata): KspMetadata {
  const schoolLevel = settings?.school?.level || 'SD';
  let phase = 'Fase A/B/C';
  if (schoolLevel === 'PAUD') phase = 'Fase Fondasi';
  else if (schoolLevel === 'SMP') phase = 'Fase D';
  else if (schoolLevel === 'SMA' || schoolLevel === 'SMK') phase = 'Fase E/F';
  else if (schoolLevel === 'SLB') phase = 'Fase Pendidikan Khusus';

  let mapped = {
    ...currentEnterpriseMetadata,
    phase
  };

  if (schoolLevel === 'PAUD' && settings?.enterpriseProfile?.paudMetadata) {
    mapped = mapPaudWorkspaceToEnterprise(settings.enterpriseProfile.paudMetadata, mapped);
  } else if (schoolLevel === 'Kesetaraan' && settings?.enterpriseProfile?.kesetaraanMetadata) {
    mapped = mapKesetaraanWorkspaceToEnterprise(settings.enterpriseProfile.kesetaraanMetadata, mapped);
  }

  return mapped;
}
