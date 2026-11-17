const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

file = file.replace(
`const LayoutContainer = () => {
  const [currentView, setCurrentView] = useState("beranda");`,
`const LayoutContainer = () => {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/uat')) {
      return "uat";
    }
    return "beranda";
  });`
);

fs.writeFileSync('src/Tampuyak.tsx', file);
