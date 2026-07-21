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

const files = walk('src');

for (const file of files) {
  if (file.includes('plugins\\api.ts') || file.includes('plugins/api.ts')) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace type imports from services/types or services
  if (content.match(/from '@\/services\/types'/g) || content.match(/from '@\/services'/g) || content.match(/from '@\/services\/[a-zA-Z0-9_]+'/g)) {
    // We want to replace `@/services/types` with `@/types/api`
    content = content.replace(/from '@\/services\/types'/g, "from '@/types/api'");
    // We want to replace all `@/services/...` with `@/plugins/api`
    content = content.replace(/from '@\/services(\/[a-zA-Z0-9_]+)?'/g, "from '@/plugins/api'");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Component imports updated');
