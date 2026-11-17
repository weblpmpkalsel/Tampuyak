const annualPlans = { Y1: {rkt: []}, Y2: {rkt: []}, Y3: {rkt: []}, Y4: {rkt: []} };
console.log('Object.keys(annualPlans):');
console.log(JSON.stringify(Object.keys(annualPlans), null, 2));
console.log('Y1.rkt.length:', annualPlans.Y1.rkt.length);
console.log('Y2.rkt.length:', annualPlans.Y2.rkt.length);
console.log('Y3.rkt.length:', annualPlans.Y3.rkt.length);
console.log('Y4.rkt.length:', annualPlans.Y4.rkt.length);
