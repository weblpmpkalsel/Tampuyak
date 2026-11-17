import { KnowledgeItem } from '../packs/KnowledgePackModel';
import { KnowledgeScore } from './KnowledgeScore';
import { mapSchoolLocation } from '../taxonomy/SchoolLocationTaxonomy';
import { mapEducationLevel } from '../taxonomy/EducationLevelTaxonomy';
import { mapSchoolType } from '../taxonomy/SchoolTypeTaxonomy';
import { mapLearningPhase } from '../taxonomy/LearningPhaseTaxonomy';
import { mapGovernmentVersion } from '../taxonomy/GovernmentVersionTaxonomy';

export interface EvaluationContext {
  educationLevel?: string;
  schoolType?: string;
  location?: string;
  province?: string;
  phase?: string;
  tags?: string[];
  governmentVersion?: string;
  schoolCharacteristics?: string[];
  studentCharacteristics?: string[];
}

export class KnowledgeMatcher {
  static evaluate(item: KnowledgeItem, context: EvaluationContext): KnowledgeScore {
    let score = 0;
    let hardConstraintFailed = false;
    const matches: string[] = [];
    const misses: string[] = [];

    const itemCtx = item.contexts || {};
    
    // Map context strings from UI to Canonical Taxonomy IDs
    const educationLevelId = context.educationLevel ? mapEducationLevel(context.educationLevel) : undefined;
    const locationId = context.location ? mapSchoolLocation(context.location) : undefined;
    const schoolTypeId = context.schoolType ? mapSchoolType(context.schoolType) : undefined;
    const phaseId = context.phase ? mapLearningPhase(context.phase) : undefined;
    const govVersionId = context.governmentVersion ? mapGovernmentVersion(context.governmentVersion) : undefined;

    // Hard constraints check
    if (itemCtx.educationLevel && itemCtx.educationLevel.length > 0) {
      if (educationLevelId && itemCtx.educationLevel.includes(educationLevelId)) {
        matches.push('educationLevel');
        score += 50; // Base match score
      } else if (educationLevelId) {
        hardConstraintFailed = true;
        misses.push('educationLevel');
      } else {
        misses.push('educationLevel');
      }
    }

    if (itemCtx.phase && itemCtx.phase.length > 0) {
      if (phaseId && itemCtx.phase.includes(phaseId)) {
        matches.push('phase');
        score += 50;
      } else if (phaseId) {
        hardConstraintFailed = true;
        misses.push('phase');
      } else {
        misses.push('phase');
      }
    }

    if (itemCtx.governmentVersion) {
      if (govVersionId === itemCtx.governmentVersion) {
        matches.push('governmentVersion');
        score += 100; // Strong match
      } else if (govVersionId) {
        hardConstraintFailed = true;
        misses.push('governmentVersion');
      }
    }

    // Soft constraints
    if (itemCtx.schoolLocation && itemCtx.schoolLocation.length > 0) {
      if (locationId && itemCtx.schoolLocation.includes(locationId)) {
        matches.push('location');
        score += 20;
      } else {
        misses.push('location');
      }
    }

    if (itemCtx.schoolType && itemCtx.schoolType.length > 0) {
      if (schoolTypeId && itemCtx.schoolType.includes(schoolTypeId)) {
        matches.push('schoolType');
        score += 20;
      } else {
        misses.push('schoolType');
      }
    }

    if (itemCtx.region && itemCtx.region.length > 0) {
      if (context.province && itemCtx.region.includes(context.province)) {
        matches.push('region');
        score += 30;
      } else {
        misses.push('region');
      }
    }

    // Tags matching
    if (item.tags && item.tags.length > 0) {
      const allContextTags = [
        ...(context.tags || []),
        ...(context.schoolCharacteristics || []),
        ...(context.studentCharacteristics || [])
      ].map(t => t.toLowerCase());

      const itemTags = item.tags.map(t => t.toLowerCase());
      let tagMatches = 0;

      for (const tag of itemTags) {
        if (allContextTags.some(ct => ct.includes(tag) || tag.includes(ct))) {
          tagMatches++;
        }
      }

      if (tagMatches > 0) {
        matches.push(`tags(${tagMatches})`);
        score += tagMatches * 10;
      } else {
        misses.push('tags');
      }
    }

    // Add base priority from item
    score += item.priority || 0;

    return {
      itemId: item.id,
      score,
      matches,
      misses,
      hardConstraintFailed
    };
  }
}
