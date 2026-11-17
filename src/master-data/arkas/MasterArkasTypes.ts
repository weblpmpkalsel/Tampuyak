export interface MasterArkasProgram {
  id: string;
  kode: string;
  nama: string;
  kegiatan: MasterArkasKegiatan[];
}

export interface MasterArkasKegiatan {
  id: string;
  kode: string;
  nama: string;
}
