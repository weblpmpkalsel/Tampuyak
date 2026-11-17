import { EnterprisePluginBootstrapper } from './EnterprisePluginBootstrapper';
import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';

export class EnterpriseCompositionRoot {
  private static instance: EnterpriseCompositionRoot;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): EnterpriseCompositionRoot {
    if (!EnterpriseCompositionRoot.instance) {
      EnterpriseCompositionRoot.instance = new EnterpriseCompositionRoot();
    }
    return EnterpriseCompositionRoot.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      console.warn('[EnterpriseCompositionRoot] Already initialized. Skipping.');
      return;
    }

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] Initiating Bootstrap Sequence...');

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] 1. Initialize Bootstrap (Knowledge, Adapters, Publishers)');
    EnterprisePluginBootstrapper.bootstrap();

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] 2. Initialize Taxonomy');
    // Stub for Taxonomy Registration

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] 3. Initialize Repositories');
    // Stub for Repositories Registration

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] 4. Initialize Services');
    // Stub for Services Registration

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] 5. Initialize Adapters');
    // Adapters are currently bootstrapped by EnterprisePluginBootstrapper

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] 6. Initialize Workspace Modules');
    // Stub for Workspace Registration

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] 7. Initialize Document Modules');
    // Stub for Document Registration

    this.isInitialized = true;
    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] Bootstrap Sequence Complete.');
  }

  public renderUI(rootElementId: string, AppElement: React.ReactElement): void {
    if (!this.isInitialized) {
      throw new Error('EnterpriseCompositionRoot must be initialized before rendering UI.');
    }

    const rootElement = document.getElementById(rootElementId);
    if (!rootElement) {
      throw new Error(`Root element with ID ${rootElementId} not found.`);
    }

    (/* console.log removed */ (..._args: any[]) => {})('[EnterpriseCompositionRoot] Rendering UI...');
    createRoot(rootElement).render(
      React.createElement(StrictMode, null, AppElement)
    );
  }
}
