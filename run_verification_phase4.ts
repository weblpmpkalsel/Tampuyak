import { PipelineVerificationRunner, PipelineVerificationReport } from './src/verification';

const result = PipelineVerificationRunner.run({
  verifyWorkspaceAdapter: true,
  verifyGenerationService: true,
  verifyGenerator: true,
  verifyReferenceLayer: true,
  verifyRecommendationLayer: true,
  verifyValidationLayer: true,
  verifyBudgetBuilder: true
});

console.log(PipelineVerificationReport.generate(result));
