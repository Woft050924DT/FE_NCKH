const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

let count = 0;
files.forEach(file => {
  const originalContent = fs.readFileSync(file, 'utf8');
  let content = originalContent;

  const regex = /from (['"])(.*\/ui\/)([^'"]+)\1/g;
  
  content = content.replace(regex, (match, quote, prefix, p1) => {
    if (p1 === 'Modal') return match; // skip Modal
    
    let kebab = p1.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    
    // special cases
    if (p1 === 'InputOTP') kebab = 'input-otp';

    return `from ${quote}${prefix}${kebab}${quote}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});

console.log(`UI components relative imports fixed in ${count} files.`);
