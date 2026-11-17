const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('test_print_output.pdf');

pdf(dataBuffer).then(function(data) {
    console.log("Page count:", data.numpages);
    console.log("Info:", data.info);
    console.log("Text preview:", data.text.substring(0, 500).replace(/\n/g, ' '));
}).catch(err => {
    console.error("Error parsing PDF:", err);
});
