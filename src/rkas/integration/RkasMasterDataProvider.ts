import { MasterArkasRepository } from '../../master-data/arkas/MasterArkasRepository';
import { MasterArkasProgram } from '../../master-data/arkas/MasterArkasTypes';

export class RkasMasterDataProvider {
  /**
   * Retrieves all available ARKAS programs.
   * This is a read-only operation pulling from Enterprise Master Data.
   */
  public static getAvailablePrograms(): MasterArkasProgram[] {
    return MasterArkasRepository.getAllPrograms();
  }
}
