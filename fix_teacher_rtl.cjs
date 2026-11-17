const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherRtlDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<span className=\{"font-bold \$\{ap.priority[\s\S]*?\}<\/span>/m;

const replacement = `<span className={\`font-bold \${ap.priority === RecommendationPriority.HIGH ? 'text-red-600' : ap.priority === RecommendationPriority.MEDIUM ? 'text-amber-600' : 'text-emerald-600'}\`}>{ap.priority}</span>`;

code = code.replace(/<span className=\{"font-bold \$\{ap\.priority === RecommendationPriority\.HIGH \? 'text-red-600' : ap\.priority === RecommendationPriority\.MEDIUM \? 'text-amber-600' : 'text-emerald-600'\}\"\}>\{ap\.priority\}<\/span>/, replacement);

// Wait, I used a literal \` in the template replacement during creation?
// Let's replace the EXACT broken line.

code = code.replace(
  "                      <span className={\\`font-bold \\${ap.priority === RecommendationPriority.HIGH ? 'text-red-600' : ap.priority === RecommendationPriority.MEDIUM ? 'text-amber-600' : 'text-emerald-600'}\\`}>{ap.priority}</span>",
  "                      <span className={\`font-bold \${ap.priority === RecommendationPriority.HIGH ? 'text-red-600' : ap.priority === RecommendationPriority.MEDIUM ? 'text-amber-600' : 'text-emerald-600'}\`}>{ap.priority}</span>"
);

fs.writeFileSync(file, code);
