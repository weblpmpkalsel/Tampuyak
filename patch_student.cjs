const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/modules/StudentPedagogicalProfileModule.tsx', 'utf8');

code = code.replace(
  `  const profile = settings.studentProfile || {};`,
  `  const profile = settings.studentProfile || {
    studentPotential: settings.karakteristik?.pesertaDidik || '',
    learningChallenges: '',
    recommendedLearningStrategy: ''
  };`
);

fs.writeFileSync('src/enterprise/workspace/modules/StudentPedagogicalProfileModule.tsx', code);
console.log("Patched Student Profile");
