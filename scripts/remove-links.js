const fs = require('fs');
const p = 'src/app/__mocks__/books/books.ts';
let s = fs.readFileSync(p, 'utf8');
// Remove lines that define imageLink or link (single-quoted values)
s = s.replace(/^[ \t]*(?:imageLink|link)\s*:\s*'[^']*',?\s*\r?\n/gm, '');
fs.writeFileSync(p, s, 'utf8');
console.log('Updated', p);
