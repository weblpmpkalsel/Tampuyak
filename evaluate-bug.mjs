const planningYear = "Y1";
const targetBucket = String(planningYear).startsWith('Y') ? planningYear : 'Y' + planningYear;
console.log("targetBucket:", targetBucket);
