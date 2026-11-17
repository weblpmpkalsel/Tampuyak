import { assembleKspDocument } from './src/enterprise/document/ksp/KspDocumentAssembler';
import { resolveSchoolProfile } from './src/enterprise/knowledge/services/SchoolProfileService';
import { resolveSchoolContext } from './src/enterprise/knowledge/services/SchoolContextService';
import { MOCK_KSP_METADATA } from './src/ksp/KspMetadataAdapter';

const profileResult = resolveSchoolProfile(MOCK_KSP_METADATA);
const contextResult = resolveSchoolContext(MOCK_KSP_METADATA);
const ksp = assembleKspDocument(profileResult, contextResult, MOCK_KSP_METADATA);

console.log(JSON.stringify(ksp.bab1, null, 2));

