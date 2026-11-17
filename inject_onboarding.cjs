const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const onboardingCode = fs.readFileSync('onboarding.tsx', 'utf8');
code = code.replace(/const LayoutContainer = \(\) => {/, onboardingCode + '\nconst LayoutContainer = () => {');

const targetLayoutContent = `  const { settings, saveStatus } = useApp();
  const docs = settings?.documents || [];

  useEffect(() => {
    localStorage.setItem("tampuyak.currentView", currentView);
  }, [currentView]);`;

const newLayoutContent = `  const { settings, saveStatus } = useApp();
  const docs = settings?.documents || [];
  
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem("tampuyak.onboarded") === "true";
  });

  useEffect(() => {
    localStorage.setItem("tampuyak.currentView", currentView);
  }, [currentView]);
  
  if (!hasCompletedOnboarding && (!settings.school?.name || settings.school?.name === "")) {
    return <OnboardingWizardView onComplete={() => {
      setHasCompletedOnboarding(true);
      localStorage.setItem("tampuyak.onboarded", "true");
    }} />;
  }
`;

code = code.replace(targetLayoutContent, newLayoutContent);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
