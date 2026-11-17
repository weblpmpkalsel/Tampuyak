export interface RkasIntegrationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}
