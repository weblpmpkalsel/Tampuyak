import { BudgetRequest, BudgetStructure, BudgetLine } from './BudgetTypes';
import { BudgetResult } from './BudgetResult';
import { BudgetValidator } from './BudgetValidator';
import { BudgetMetadataBuilder } from './BudgetMetadataBuilder';

export class BudgetBuilder {
  public static build(request: BudgetRequest): BudgetResult {
    const errors = BudgetValidator.validate(request);
    
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        warnings: []
      };
    }

    const resolvedRef: any = request.resolvedReference || {};
    const { activity, program, component, funding, account } = resolvedRef;
    const pa = request.planningActivity || {};
    
    // 1. Program
    const programTitle = pa.program || pa.programName || pa.activity || program?.name || "-";

    // 2. Activity Name
    const activityName = pa.nama || pa.subActivity || pa.activityName || pa.name || activity?.name || '-';
    const activityCode = pa.kode || pa.activityCode || activity?.code || '-';
    
    // 3. Account
    const accountCode = pa.accountCode || account?.code || '-';
    const accountName = pa.accountName || pa.budgetItem || pa.namaRekening || account?.name || '-';
    const accountType = pa.accountType || account?.type || '-';
    const accountObj = (accountCode !== '-' || accountName !== '-') ? {
      code: accountCode,
      name: accountName,
      type: accountType
    } : undefined;

    // 4. Funding
    const fundingSource = pa.fundingSource || pa.funding || funding?.source || '-';
    const fundingDesc = pa.fundingDescription || funding?.description || '-';
    const fundingObj = (fundingSource !== '-') ? {
      source: fundingSource,
      description: fundingDesc
    } : undefined;

    // 5. Component
    const componentName = pa.component || pa.componentName || pa.komponen || component?.name || '-';
    const componentId = pa.componentId || component?.id || `COMP-${Date.now()}`;
    const componentCategory = pa.componentCategory || component?.category || '-';
    const componentObj = (componentName !== '-') ? {
      id: componentId,
      name: componentName,
      category: componentCategory
    } : undefined;

    // 6. Volume
    let volume = Number(pa.quantity || pa.volume);
    volume = isNaN(volume) || volume <= 0 ? 1 : volume;
    
    // 7. Unit
    const unit = pa.unit || 'Paket';

    // 8. Amount (Price)
    let unitPrice = Number(pa.amount || pa.price);
    unitPrice = isNaN(unitPrice) || unitPrice < 0 ? 0 : unitPrice;
    
    // Total
    let total = Number(pa.total);
    total = isNaN(total) || total < 0 ? (volume * unitPrice) : total;

    const budgetLine: BudgetLine = {
      id: `BL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      activity: {
        id: activity?.id || pa.id || `ACT-${Date.now()}`,
        code: activityCode,
        name: activityName
      },
      component: componentObj,
      funding: fundingObj,
      account: accountObj,
      year: request.year,
      volume,
      unit,
      unitPrice,
      total
    };
    
    const budgetStructure: BudgetStructure = {
      header: {
        title: programTitle,
        year: request.year
      },
      lines: [budgetLine],
      totalAmount: budgetLine.total,
      metadata: BudgetMetadataBuilder.build(request.year)
    };
    
    return {
      success: true,
      errors: [],
      warnings: [],
      budgetStructure,
      metadata: {
        processedLines: budgetStructure.lines.length
      }
    };
  }
}
