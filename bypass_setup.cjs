const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  `const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    try {
      return localStorage.getItem("tampuyak.onboarded") === "true";
    } catch (e) { return false; }
  });`,
  `const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);`
);

// If the regex above fails because of formatting, just do a simpler replace
if (!code.includes("useState(true)")) {
    code = code.replace(/const \[hasCompletedOnboarding, setHasCompletedOnboarding\] = useState\(\(\) => \{[^}]+\}\);/m, `const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);`);
    
    // Also, just nuke the if condition to be absolutely sure
    code = code.replace(`if (!hasCompletedOnboarding && (!settings.school?.name || settings.school?.name === "")) {`, `if (false) {`);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Bypassed setup");
