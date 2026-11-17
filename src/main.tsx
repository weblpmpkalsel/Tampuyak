import './index.css';
import App from './App.tsx';
import { EnterpriseCompositionRoot } from './enterprise/bootstrap/EnterpriseCompositionRoot';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const compositionRoot = EnterpriseCompositionRoot.getInstance();

// 1. Initialize Enterprise Platform
compositionRoot.initialize();

// 2. Finally Render UI
compositionRoot.renderUI('root', <ErrorBoundary><App /></ErrorBoundary>);
