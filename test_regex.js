const codeRegex = /^([a-eA-E])[\.\-\_\s]*(\d+(?:\.\d+)?)/;
console.log("A.1. Kemampuan Literasi".match(codeRegex));
console.log("A.1 Kemampuan Literasi".match(codeRegex));
console.log("D.1. Kualitas Pembelajaran".match(codeRegex));
