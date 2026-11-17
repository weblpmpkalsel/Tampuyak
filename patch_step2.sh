sed -i 's/import { SchoolContextKnowledgePayload } from '\''..\/..\/knowledge\/builders\/SchoolContextBuilder'\'';/import { SchoolContextKnowledgePayload, buildStudentCharacteristicDomain } from '\''..\/..\/knowledge\/builders\/SchoolContextBuilder'\'';/' src/enterprise/document/ksp/KspDocumentAssembler.ts
sed -i '42,47c\
    students: buildStudentCharacteristicDomain((metadata as any).students)\
' src/enterprise/document/ksp/KspDocumentAssembler.ts
