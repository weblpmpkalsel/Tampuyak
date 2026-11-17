import { useState, useEffect } from 'react';
import { PlanningContext } from './PlanningContext';

export class PlanningContextService {
  private static instance: PlanningContextService;
  private currentContext: PlanningContext;
  private listeners: Set<(context: PlanningContext) => void> = new Set();

  private constructor() {
    this.currentContext = {
      selectedDocument: 'rkjm',
      selectedPlanningYear: 'Y1',
      generatedAt: Date.now(),
      version: '1.0'
    };
  }

  public static getInstance(): PlanningContextService {
    if (!PlanningContextService.instance) {
      PlanningContextService.instance = new PlanningContextService();
    }
    return PlanningContextService.instance;
  }

  public getContext(): PlanningContext {
    return { ...this.currentContext };
  }

  public updateContext(partialContext: Partial<PlanningContext>): void {
    this.currentContext = {
      ...this.currentContext,
      ...partialContext,
      generatedAt: Date.now()
    };
    this.notifyListeners();
  }

  public subscribe(listener: (context: PlanningContext) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const contextCopy = this.getContext();
    this.listeners.forEach(listener => listener(contextCopy));
  }
}

export function usePlanningContext() {
  const service = PlanningContextService.getInstance();
  const [context, setContext] = useState(service.getContext());

  useEffect(() => {
    return service.subscribe(setContext);
  }, []);

  return {
    planningContext: context,
    updatePlanningContext: (update: Partial<PlanningContext>) => service.updateContext(update)
  };
}
