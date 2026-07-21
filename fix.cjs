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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix ../@/ issue
  if (content.includes('../@/')) {
    content = content.replace(/\.\.\/@\//g, '@/');
    changed = true;
  }
  
  if (content.includes('../../@/')) {
    content = content.replace(/\.\.\/\.\.\/@\//g, '@/');
    changed = true;
  }

  // Fix missed relative imports
  const replacements = [
    { from: /\.\.\/\.\.\/\.\.\/utils/g, to: '@/utils' },
    { from: /\.\.\/\.\.\/helpers/g, to: '@/helpers' },
    { from: /\.\.\/helpers/g, to: '@/helpers' }
  ];

  replacements.forEach(r => {
    if (r.from.test(content)) {
      content = content.replace(r.from, r.to);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

// Fix apiClient.ts backticks
const apiClientPath = './src/services/apiClient.ts';
if (fs.existsSync(apiClientPath)) {
  let apiContent = fs.readFileSync(apiClientPath, 'utf8');
  apiContent = apiContent.replace(
    /HTTP error! status: \$\{error\.response\.status\};/,
    '\HTTP error! status: \\;'
  );
  fs.writeFileSync(apiClientPath, apiContent, 'utf8');
}

console.log('Fixes applied successfully.');
