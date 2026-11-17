sed -i 's/students: buildStudentCharacteristicDomain((metadata as any).students)/students: buildStudentCharacteristicDomain(metadata.rawStudents)/' src/enterprise/document/ksp/KspDocumentAssembler.ts
