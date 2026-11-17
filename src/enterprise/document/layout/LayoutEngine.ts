export interface DocumentLayoutConfig {
  orientation?: "portrait" | "landscape";
  margins: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  spacing: {
    chapterBefore: string;
    chapterAfter: string;
    sectionBefore: string;
    sectionAfter: string;
    paragraphBefore: string;
    paragraphAfter: string;
    signatureBlockHeight: string;
    committeeSignatureBlockHeight: string;
    principalSignatureBlockHeight: string;
    supervisorSignatureBlockHeight: string;
  };
  pageBreaks: {
    beforeTOC: boolean;
    beforeChapter: boolean;
    beforeApproval: boolean;
    beforeAppendix: boolean;
  };
  keepTogether: {
    signatureBlocks: boolean;
    tableRows: boolean;
  };
}

export const DefaultDocumentLayoutConfig: DocumentLayoutConfig = {
  orientation: "portrait",
  margins: {
    top: '2.5cm',
    bottom: '2.5cm',
    left: '2.5cm',
    right: '2cm'
  },
  spacing: {
    chapterBefore: '2rem',
    chapterAfter: '2rem',
    sectionBefore: '1.5rem',
    sectionAfter: '1rem',
    paragraphBefore: '0',
    paragraphAfter: '1rem',
    signatureBlockHeight: '8rem',
    committeeSignatureBlockHeight: '6rem',
    principalSignatureBlockHeight: '6rem',
    supervisorSignatureBlockHeight: '6rem'
  },
  pageBreaks: {
    beforeTOC: true,
    beforeChapter: true,
    beforeApproval: true,
    beforeAppendix: true
  },
  keepTogether: {
    signatureBlocks: true,
    tableRows: true
  }
};

class LayoutRegistry {
  private static overrides: Record<string, Partial<DocumentLayoutConfig>> = {};

  static setOverride(chapterId: string, override: Partial<DocumentLayoutConfig>) {
    this.overrides[chapterId] = override;
  }

  static getLayout(chapterId: string, documentType?: string): DocumentLayoutConfig {
    const config = { 
      ...DefaultDocumentLayoutConfig,
      margins: { ...DefaultDocumentLayoutConfig.margins },
      spacing: { ...DefaultDocumentLayoutConfig.spacing },
      pageBreaks: { ...DefaultDocumentLayoutConfig.pageBreaks },
      keepTogether: { ...DefaultDocumentLayoutConfig.keepTogether }
    };
    
    // Document specific layout rules
    if (documentType) {
        const type = documentType.toUpperCase();
        if ((type.includes('RKT') || type.includes('TAHUNAN')) && ['bab3', 'bab4', 'bab5'].includes(chapterId)) {
            config.orientation = 'landscape';
        }
        if ((type.includes('RKAS') || type.includes('ANGGARAN')) && ['bab2'].includes(chapterId)) {
            config.orientation = 'landscape';
        }
        if ((type.includes('KSP') || type.includes('KURIKULUM')) && ['bab2', 'bab3', 'bab4'].includes(chapterId)) {
            config.orientation = 'landscape';
        }
    }

    const override = this.overrides[chapterId];
    if (override) {
        if (override.orientation) config.orientation = override.orientation;
        if (override.margins) config.margins = { ...config.margins, ...override.margins };
        if (override.spacing) config.spacing = { ...config.spacing, ...override.spacing };
        if (override.pageBreaks) config.pageBreaks = { ...config.pageBreaks, ...override.pageBreaks };
        if (override.keepTogether) config.keepTogether = { ...config.keepTogether, ...override.keepTogether };
    }
    
    return config;
  }
}

export const EnterpriseLayoutRegistry = LayoutRegistry;
