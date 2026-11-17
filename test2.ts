const d = new Date('2026-07-11');
console.log(new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(d));
