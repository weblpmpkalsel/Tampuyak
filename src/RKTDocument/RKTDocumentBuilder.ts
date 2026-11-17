import { DocumentModel, DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';

import { CoverBuilder } from './CoverBuilder';
import { ApprovalBuilder } from './ApprovalBuilder';
import { IntroductionBuilder } from './IntroductionBuilder';
import { ProgramBuilder } from './ProgramBuilder';
import { ActivityBuilder } from './ActivityBuilder';
import { BudgetBuilder } from './BudgetBuilder';
import { MonitoringBuilder } from './MonitoringBuilder';
import { AppendixBuilder } from './AppendixBuilder';

export class RKTDocumentBuilder {
  private coverBuilder = new CoverBuilder();
  private approvalBuilder = new ApprovalBuilder();
  private introBuilder = new IntroductionBuilder();
  private programBuilder = new ProgramBuilder();
  private activityBuilder = new ActivityBuilder();
  private budgetBuilder = new BudgetBuilder();
  private monitoringBuilder = new MonitoringBuilder();
  private appendixBuilder = new AppendixBuilder();

  public buildDocument(result: RKTProjectionResult, settings: any): DocumentModel {
    const cover = this.coverBuilder.build(result, settings?.school);
    const approval = this.approvalBuilder.build(result);
    const toc: DocumentChapter = {
        id: 'TOC',
        title: 'Daftar Isi',
        sections: [], paragraphs: [], tables: [], figures: [], references: [], metadata: {}
    };
    const chapter1 = this.introBuilder.build(result, settings);
    const chapter2 = this.programBuilder.build(result, settings);
    const chapter3 = this.activityBuilder.build(result, settings);
    const chapter4 = this.budgetBuilder.build(result, settings);
    const chapter5 = this.monitoringBuilder.build(result, settings);
    const appendix = this.appendixBuilder.build(result);

    return {
      cover,
      approval,
      toc,
      chapter1,
      chapter2,
      chapter3,
      chapter4,
      chapter5,
      appendix
    };
  }
}