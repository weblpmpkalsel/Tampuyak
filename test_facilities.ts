import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import * as fs from 'fs';

const dummyRawSettings = {
  sarpras: {
    ruangKelas: 6,
    perpustakaan: 1,
    laboratorium: 1,
    uks: 1,
    toilet: 4,
    mushola: 1,
    lapangan: 1,
    ruangGuru: 1,
    ruangKepsek: 1,
    ict: 20,
    learningResources: 100
  }
};
const metadata = KspMetadataAdapter.adapt(dummyRawSettings);
console.log(metadata.rawFacilities);
