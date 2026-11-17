const fs = require("fs");

const outputLines = fs.readFileSync("output.txt", "utf-8").split("\n");
let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < outputLines.length; i++) {
  if (outputLines[i].startsWith("const SettingsView = ({")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && outputLines[i].startsWith("};")) {
    // We expect SettingsView to close with "};" at the root indentation
    endIndex = i;
    break;
  }
}

const settingsViewCode = outputLines.slice(startIndex, endIndex + 1).join("\n");

console.log("Found SettingsView:");
console.log(settingsViewCode.substring(0, 100) + "...");
console.log("...");
console.log(settingsViewCode.substring(settingsViewCode.length - 50));

const tampuyakContent = fs.readFileSync("src/Tampuyak.tsx", "utf-8");
const targetLine = "const LayoutContainer = () => {";
if (tampuyakContent.includes(settingsViewCode)) {
  console.log("SettingsView already in Tampuyak.tsx");
} else if (tampuyakContent.includes(targetLine)) {
  const newContent = tampuyakContent.replace(targetLine, settingsViewCode + "\n\n" + targetLine);
  fs.writeFileSync("src/Tampuyak.tsx", newContent);
  console.log("Injected SettingsView successfully.");
} else {
  console.log("Could not find Target Line.");
}
