const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionPublishingService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "${obs.scores.map(s => `\n              <tr>\n                <td style=\"border: 1px solid #000; padding: 8px;\">${s.rubricItemId}</td>\n                <td style=\"border: 1px solid #000; padding: 8px;\">${s.score}</td>\n              </tr>\n            `).join('')}",
  "${obs.scores.map(s => {\n              const item = obs.session.instrumentSnapshot?.items?.find((i: any) => i.id === s.rubricItemId);\n              const description = item ? item.description : s.rubricItemId;\n              return `\n              <tr>\n                <td style=\"border: 1px solid #000; padding: 8px;\">${description}</td>\n                <td style=\"border: 1px solid #000; padding: 8px;\">${s.score}</td>\n              </tr>\n            `}).join('')}"
);

content = content.replace(
  "<tr><td>Kategori Nilai Akhir</td><td>: <strong>${obs.finalScoreCategory || '-'}</strong></td></tr>",
  "<tr><td>Kategori Nilai Akhir</td><td>: <strong>${(() => {\n            if (obs.finalScoreCategory) return obs.finalScoreCategory;\n            if (!obs.scores || obs.scores.length === 0) return '-';\n            let sum = 0;\n            let totalMax = 0;\n            const items = obs.session.instrumentSnapshot?.items || [];\n            obs.scores.forEach((s: any) => {\n                sum += s.score;\n                const item = items.find((i: any) => i.id === s.rubricItemId);\n                totalMax += item ? item.maxScore : 4;\n            });\n            if (totalMax === 0) return '-';\n            const percentage = (sum / totalMax) * 100;\n            if (percentage >= 90) return 'SANGAT_BAIK';\n            if (percentage >= 75) return 'BAIK';\n            if (percentage >= 60) return 'CUKUP';\n            return 'KURANG';\n          })()}</strong></td></tr>"
);

fs.writeFileSync(file, content);
