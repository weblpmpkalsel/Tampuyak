const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/modules/CurriculumHubModule.tsx');
let content = fs.readFileSync(file, 'utf8');

// The first patch had a bug where the injection was before `const validation = knowledge.validate();`
// but it wasn't properly contained inside the component... wait, let's look at the generated file.

// Wait, the output starts with `gLoadUpdate = (field: keyof typeof learningLoad.payload, value: string | number) => { ... }`
// It seems it was injected inside the component correctly.

// But wait, the `handleLearningLoadUpdate` wasn't syncing to `updateSetting` props.
// I should update it to actually call `updateSetting` so it saves the data into the global `settings.learningLoad`.

const replacement = `
  const handleLearningLoadUpdate = (field: keyof typeof learningLoad.payload, value: string | number) => {
    const updatedPayload = {
      ...learningLoad.payload,
      [field]: value
    };
    
    const newKnowledge = new LearningLoadKnowledge('ll-1', '1.0.0', updatedPayload);
    setLearningLoad(newKnowledge);
    
    if (updateSetting) {
      updateSetting('learningLoad', newKnowledge.payload);
    }
  };
`;

content = content.replace(
  /const handleLearningLoadUpdate = \(field: keyof typeof learningLoad\.payload, value: string \| number\) => \{[\s\S]*?\}\);[\s\S]*?\};/,
  replacement.trim()
);

fs.writeFileSync(file, content);
