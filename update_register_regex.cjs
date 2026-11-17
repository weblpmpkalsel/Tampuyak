const fs = require('fs');
let code = fs.readFileSync('src/portal/RegisterPage.tsx', 'utf-8');

// Replace the formData state definition
code = code.replace(/const \[formData, setFormData\] = useState\(\{[\s\S]*?agreeTerms: false\s*\}\);/, `const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    agreeTerms: false
  });`);

// Replace the createUserProfile call
code = code.replace(/await UserService\.createUserProfile\(\{[\s\S]*?updatedAt: Date\.now\(\)\s*\}\);/, `await UserService.createUserProfile({
        uid: user.uid,
        email: user.email || formData.email,
        displayName: formData.fullName,
        phone: formData.phone,
        role: 'SCHOOL_ADMIN',
        status: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });`);

// Replace the form fields part
code = code.replace(/\{\/\* School Info \*\/\}[\s\S]*?(?=<div className="flex items-center">)/, `</div>\n            `);

fs.writeFileSync('src/portal/RegisterPage.tsx', code);
console.log('done');
