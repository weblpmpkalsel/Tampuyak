import { EnterpriseAdapter } from './src/enterprise/workspace/adapters/EnterpriseAdapter';
import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { buildEducatorCharacteristicDomain } from './src/enterprise/knowledge/builders/SchoolContextBuilder';

const rawSettings = {
  enterpriseProfile: {
    characteristics: {
      pendidik: "Karakteristik pendidik di workspace"
    }
  }
};

const metadata = KspMetadataAdapter.adapt(rawSettings);
console.log("Metadata RawCharacteristics:", metadata.rawCharacteristics);

const educators = buildEducatorCharacteristicDomain(metadata.rawCharacteristics);
console.log("Educators:", educators);

