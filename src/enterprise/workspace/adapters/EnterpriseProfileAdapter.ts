export class EnterpriseProfileAdapter {
  static normalize(enterpriseProfile: any) {
    if (!enterpriseProfile) return {};
    
    const identity = enterpriseProfile.identity || {};
    const characteristics = enterpriseProfile.characteristics || {};
    
    return {
      school: {
        ...(identity.name && { name: identity.name }),
        ...(identity.npsn && { npsn: identity.npsn }),
        ...(identity.address && { address: identity.address }),
        ...(identity.status && { status: identity.status }),
      },
      identitas: {
        ...(enterpriseProfile.vision && { visi: enterpriseProfile.vision }),
        ...(enterpriseProfile.mission?.length > 0 && { misi: enterpriseProfile.mission }),
        ...(enterpriseProfile.goals?.length > 0 && { tujuan: enterpriseProfile.goals }),
      },
      karakteristik: {
        ...(characteristics.pesertaDidik && { pesertaDidik: characteristics.pesertaDidik }),
        ...(characteristics.lingkungan && { lingkungan: characteristics.lingkungan }),
        ...(characteristics.lokasi && { lokasi: characteristics.lokasi }),
        ...(characteristics.pendidik && { pendidik: characteristics.pendidik }),
        ...(characteristics.orangTua && { orangTua: characteristics.orangTua }),
      },
      principal: {
        ...(identity.principalName && { name: identity.principalName }),
        ...(identity.principalNip && { nip: identity.principalNip }),
      },
      pengawas: {},
      kepalaDinas: {},
      komite: {}
    };
  }
}
