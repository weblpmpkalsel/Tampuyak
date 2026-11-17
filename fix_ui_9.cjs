const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldButtonRegex = /const Button = \(\{[\s\S]*?\}\) => \{\n\s*const baseStyle = "inline-flex items-center justify-center px-5 py-3 text-base font-semibold rounded transition-colors duration-200 outline-none";/m;

const newButton = `const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}: any) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-3.5 text-lg"
  };
  const baseStyle = \`inline-flex items-center justify-center font-semibold rounded transition-colors duration-200 outline-none \${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md}\`;`;

code = code.replace(oldButtonRegex, newButton);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 9');
