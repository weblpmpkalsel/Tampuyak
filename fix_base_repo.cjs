const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/persistence/firestore/FirestoreBaseRepository.ts', 'utf8');

// Rename create to _create in the base repository to avoid signature conflicts with interface implementations
content = content.replace(
  "async create(data: T): Promise<T> {",
  "protected async _create(data: T): Promise<T> {"
);

fs.writeFileSync('src/modules/supervision/persistence/firestore/FirestoreBaseRepository.ts', content);

// Now update all the child repositories to implement create() if they were relying on the base class create()
console.log('Fixed FirestoreBaseRepository.ts');
