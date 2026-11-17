import { RkasModel, RkasGenerationMetadata } from '../generator/RkasGeneratorTypes';

export interface RkasServiceResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  result?: RkasModel;
  metadata?: RkasGenerationMetadata;
}
