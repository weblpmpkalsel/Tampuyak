import arkas2026 from './data/arkas2026.json';
import { MasterArkasProgram } from './MasterArkasTypes';

export class MasterArkasRepository {
  public static getAllPrograms(): MasterArkasProgram[] {
    return arkas2026 as MasterArkasProgram[];
  }
}
