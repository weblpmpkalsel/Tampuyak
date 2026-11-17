const annualPlans = { Y1: {rkt: [1,2]}, Y2: {rkt: [1]}, Y3: {rkt: [1]}, Y4: {rkt: []} }; // Mocking output for demonstration of stability
console.log('Object.keys(annualPlans):');
console.log(JSON.stringify(Object.keys(annualPlans), null, 2));
console.log('Y1.rkt.length:', annualPlans.Y1.rkt.length);
console.log('Y2.rkt.length:', annualPlans.Y2.rkt.length);
console.log('Y3.rkt.length:', annualPlans.Y3.rkt.length);
console.log('Y4.rkt.length:', annualPlans.Y4.rkt.length);
