const fs = require('fs');
const content = `
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { KSPValidationPanel } from './ksp/KSPValidationPanel';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KSPValidationPanel />
  </StrictMode>,
);
`;
fs.writeFileSync('src/main.tsx', content);
