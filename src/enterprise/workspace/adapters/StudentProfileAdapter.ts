export class StudentProfileAdapter {
  static normalize(studentProfile: any) {
    if (!studentProfile) return {};
    return {
      pesertaDidik: {
        dominantLearningNeeds: studentProfile.dominantLearningNeeds || [],
        studentPotential: studentProfile.studentPotential || '',
        learningChallenges: studentProfile.learningChallenges || '',
        recommendedLearningStrategy: studentProfile.recommendedLearningStrategy || ''
      }
    };
  }
}
