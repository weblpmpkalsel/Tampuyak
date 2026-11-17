const fs = require('fs');
const file = 'src/modules/supervision/application/QualityAnalyticsService.ts';
let code = fs.readFileSync(file, 'utf8');

const replacement = `
  public calculateObservationStatistics(
    observations: Observation[]
  ): ObservationStatistics {
    let totalScore = 0;
    let validSessions = 0;
    let excellent = 0;
    let good = 0;
    let fair = 0;
    let poor = 0;

    observations.forEach(obs => {
      const items = obs.session.instrumentSnapshot?.items || [];
      if (obs.scores && obs.scores.length > 0) {
        let sum = 0;
        let totalMax = 0;

        obs.scores.forEach(score => {
          sum += score.score;
          const item = items.find(i => i.id === score.rubricItemId);
          totalMax += item ? item.maxScore : 4; // fallback to 4 if not found
        });

        if (totalMax > 0) {
          validSessions++;
          const normalizedScore = (sum / totalMax) * 100;
          totalScore += normalizedScore;
          if (normalizedScore >= 90) excellent++;
          else if (normalizedScore >= 75) good++;
          else if (normalizedScore >= 60) fair++;
          else poor++;
        }
      }
    });

    return {
      averageScore: validSessions > 0 ? totalScore / validSessions : 0,
      scoreDistribution: {
        excellent,
        good,
        fair,
        poor
      }
    };
  }
`;

const regex = /public calculateObservationStatistics[\s\S]*?scoreDistribution: \{\n        excellent,\n        good,\n        fair,\n        poor\n      \}\n    \};\n  \}/;

code = code.replace(regex, replacement.trim());

fs.writeFileSync(file, code);
