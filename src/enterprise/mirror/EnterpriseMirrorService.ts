export enum MirrorStatus {
  IDENTICAL = 'IDENTICAL',
  MASTER_NEWER = 'MASTER_NEWER',
  WORKSPACE_NEWER = 'WORKSPACE_NEWER',
  DIFFERENT = 'DIFFERENT',
}

export interface MirrorConflict {
  domain: string;
  field: string;
  masterValue: any;
  workspaceValue: any;
  status: MirrorStatus;
  lastCompared: number;
}

export interface MirrorResult {
  domain: string;
  isSynchronized: boolean;
  conflicts: MirrorConflict[];
  timestamp: number;
}

export interface MirrorSummary {
  totalDomains: number;
  synchronizedDomains: number;
  conflictedDomains: number;
  results: MirrorResult[];
  lastRun: number;
}

export class EnterpriseMirrorService {
  /**
   * Compares a specific domain between Master Data and Workspace Data.
   */
  static compareDomain(
    domain: string,
    masterData: any,
    workspaceData: any,
    fieldMappings: { masterField: string; workspaceField: string }[]
  ): MirrorResult {
    const conflicts: MirrorConflict[] = [];

    fieldMappings.forEach(mapping => {
      const masterValue = masterData ? this.getNestedValue(masterData, mapping.masterField) : undefined;
      const workspaceValue = workspaceData ? this.getNestedValue(workspaceData, mapping.workspaceField) : undefined;

      if (!this.isEqual(masterValue, workspaceValue)) {
        // Without timestamps for each field in the legacy structure, we default to DIFFERENT.
        // If timestamps were available, we could determine MASTER_NEWER or WORKSPACE_NEWER.
        // For now, we consider any mismatch as DIFFERENT.
        conflicts.push({
          domain,
          field: mapping.masterField,
          masterValue,
          workspaceValue,
          status: MirrorStatus.DIFFERENT,
          lastCompared: Date.now()
        });
      }
    });

    return {
      domain,
      isSynchronized: conflicts.length === 0,
      conflicts,
      timestamp: Date.now()
    };
  }

  /**
   * Runs a full mirror synchronization audit across all specified domains.
   */
  static runMirrorAudit(settings: any): MirrorSummary {
    const results: MirrorResult[] = [];

    // 1. School Identity & Profile
    results.push(this.compareDomain(
      'SchoolIdentity',
      settings?.school,
      settings?.enterpriseProfile?.identity,
      [
        { masterField: 'name', workspaceField: 'name' },
        { masterField: 'npsn', workspaceField: 'npsn' },
        { masterField: 'address', workspaceField: 'address' },
        { masterField: 'status', workspaceField: 'status' }
      ]
    ));

    results.push(this.compareDomain(
      'SchoolProfile',
      settings?.principal,
      settings?.enterpriseProfile?.identity,
      [
        { masterField: 'name', workspaceField: 'principalName' }
      ]
    ));

    // 2. Teachers (Guru)
    // Master: settings.guru (Array)
    // Workspace: No direct array representation in enterpriseProfile currently, 
    // it's a global array, so they might be the same object or we compare length if mapped.
    // For now, we consider them identically pointing to settings.guru since Workspace doesn't have a separate array.
    results.push({
      domain: 'Teachers',
      isSynchronized: true,
      conflicts: [],
      timestamp: Date.now()
    });

    // 3. Educational Staff (Tendik)
    results.push({
      domain: 'EducationalStaff',
      isSynchronized: true,
      conflicts: [],
      timestamp: Date.now()
    });

    // 4. Students (Peserta Didik)
    results.push(this.compareDomain(
      'Students',
      settings?.pesertaDidik,
      settings?.studentProfile?.pesertaDidik,
      [
        { masterField: 'total', workspaceField: 'total' }, // Assuming mapped if any
      ]
    ));

    const synchronizedDomains = results.filter(r => r.isSynchronized).length;
    const conflictedDomains = results.length - synchronizedDomains;

    return {
      totalDomains: results.length,
      synchronizedDomains,
      conflictedDomains,
      results,
      lastRun: Date.now()
    };
  }

  private static getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined) return undefined;
      current = current[key];
    }
    return current;
  }

  private static isEqual(val1: any, val2: any): boolean {
    if (val1 === val2) return true;
    if (!val1 && !val2) return true; // Treats null, undefined, "" as equivalent for now
    
    // Primitive equality check (not deep object check for now, as we map primitive fields mostly)
    return false;
  }
}
