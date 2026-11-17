import { MasterArkasProgram, MasterArkasKegiatan } from '../../master-data/arkas/MasterArkasTypes';

export interface ArkasAccountReference {
  code: string;
  name: string;
  type: string;
}

export interface ArkasComponentReference {
  id: string;
  name: string;
  category: string;
}

export interface ArkasFundingReference {
  source: string;
  description: string;
}

export interface ArkasActivityMetadata {
  program: MasterArkasProgram;
  kegiatan: MasterArkasKegiatan;
}
