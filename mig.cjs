const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Update DEFAULT_SETTINGS to include schemaVersion and snapshots
code = code.replace(
  'const DEFAULT_SETTINGS = {',
  'const DEFAULT_SETTINGS = {\n  schemaVersion: 1,\n  snapshots: [],'
);

// Update AppProvider initialization to handle migration
const providerStart = `export const AppProvider = ({ children }: any) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const migrated = {
          ...DEFAULT_SETTINGS,
          ...parsed,`;

const providerReplacement = `export const AppProvider = ({ children }: any) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        
        // MIGRATION LOGIC
        if (!parsed.schemaVersion || parsed.schemaVersion < 1) {
          parsed.schemaVersion = 1;
        }

        const migrated = {
          ...DEFAULT_SETTINGS,
          ...parsed,`;

code = code.replace(providerStart, providerReplacement);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done migration logic');
