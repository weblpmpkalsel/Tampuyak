const fs = require('fs');
const pdf = require('pdf-parse');
async function run() {
  for (let file of ['ksp_final.pdf', 'rkjm_final.pdf', 'rkt_final.pdf', 'rkas_final.pdf']) {
    let dataBuffer = fs.readFileSync(file);
    let data = await pdf(dataBuffer);
    console.log(file, 'Pages:', data.numpages);
  }
}
run();
