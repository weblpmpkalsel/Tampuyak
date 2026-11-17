import { RkasModel, RkasGenerationMetadata } from './RkasGeneratorTypes';

export interface RkasGeneratorResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  rkas?: RkasModel;
  metadata?: RkasGenerationMetadata;
}
