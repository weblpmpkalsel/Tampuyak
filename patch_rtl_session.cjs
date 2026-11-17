const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionRtlSession.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const [description, setDescription] = useState('');",
  `const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pelatihan');
  const [expectedEvidence, setExpectedEvidence] = useState('');`
);

code = code.replace(
  `      const updated = applicationService.createActionPlan({
        followUp,
        title,
        description,
        target,
        targetDate: new Date(targetDate).getTime(),
        priority
      });`,
  `      const updated = applicationService.createActionPlan({
        followUp,
        title,
        description,
        category,
        target,
        targetDate: new Date(targetDate).getTime(),
        priority,
        expectedEvidence
      });`
);

code = code.replace(
  `      setTarget('');
      setTargetDate('');
      setPriority(RecommendationPriority.MEDIUM);`,
  `      setTarget('');
      setTargetDate('');
      setPriority(RecommendationPriority.MEDIUM);
      setCategory('Pelatihan');
      setExpectedEvidence('');`
);

fs.writeFileSync(file, code);
