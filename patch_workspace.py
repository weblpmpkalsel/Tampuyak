with open('src/services/firestore/workspaceService.ts', 'r') as f:
    code = f.read()

target = "transaction.update(userRef, { status: 'ACTIVE', schoolId: data.schoolId });"
replacement = "transaction.update(userRef, { status: 'ACTIVE', schoolId: data.schoolId, workspaceId: workspaceId });"

code = code.replace(target, replacement)

with open('src/services/firestore/workspaceService.ts', 'w') as f:
    f.write(code)
