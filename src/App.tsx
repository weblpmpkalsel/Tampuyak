import { EnterpriseUpdateManager } from './components/EnterpriseUpdateManager';
import OrganizationSetup from './workspace/OrganizationSetup';
import OrganizationGuard from './workspace/OrganizationGuard';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Tampuyak from './Tampuyak';
import { WorkspaceProvider } from './workspace/WorkspaceContext';

import LandingPage from './portal/LandingPage';
import LoginPage from './portal/LoginPage';
import RegisterPage from './portal/RegisterPage';
import ForgotPasswordPage from './portal/ForgotPasswordPage';
import PendingPage from './portal/PendingPage';
import RejectedPage from './portal/RejectedPage';
import UnauthorizedPage from './portal/UnauthorizedPage';
import PortalDashboardGuard from './portal/PortalDashboardGuard';
import ControlCenterWrapper from './control/ControlCenter';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/rejected" element={<RejectedPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/control/*" element={<ControlCenterWrapper />} />
        
        <Route path="/workspace/setup" element={
          <PortalDashboardGuard>
            <OrganizationSetup />
          </PortalDashboardGuard>
        } />
        
        <Route path="/dashboard/*" element={
          <PortalDashboardGuard>
            <OrganizationGuard>
              <WorkspaceProvider>
                <Tampuyak />
              </WorkspaceProvider>
            </OrganizationGuard>
          </PortalDashboardGuard>
        } />
        
        <Route path="/debug" element={<WorkspaceProvider><Tampuyak /></WorkspaceProvider>} />
        {import.meta.env.DEV && <Route path="/uat" element={<WorkspaceProvider><Tampuyak /></WorkspaceProvider>} />}<Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <EnterpriseUpdateManager />
    </BrowserRouter>
  );
}
