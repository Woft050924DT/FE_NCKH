const fs = require('fs');
const path = require('path');

// 1. Move types.ts
if (!fs.existsSync('src/types')) {
  fs.mkdirSync('src/types');
}
fs.copyFileSync('src/services/types.ts', 'src/types/api.ts');

// 2. Read api.ts
let apiTsContent = fs.readFileSync('src/plugins/api.ts', 'utf8');
apiTsContent += `\n// ==============================================\n// LEGACY API CLIENT & SERVICES\n// ==============================================\n`;

// 3. Append apiClient.ts
let apiClientContent = fs.readFileSync('src/services/apiClient.ts', 'utf8');
apiClientContent = apiClientContent.replace(/import axiosInstance from '@\/plugins\/axios';/, '');
apiTsContent += apiClientContent + '\n';

// 4. Append all other services
const files = fs.readdirSync('src/services');
for (const file of files) {
  if (file === 'types.ts' || file === 'index.ts' || file === 'apiClient.ts') continue;
  
  let content = fs.readFileSync(path.join('src/services', file), 'utf8');
  
  // Remove apiClient import
  content = content.replace(/import \{ apiClient \} from '\.\/apiClient';\r?\n/g, '');
  
  // Update types import
  content = content.replace(/from '\.\/types'/g, "from '@/types/api'");
  
  apiTsContent += `\n// --- ${file} ---\n` + content + '\n';
}

fs.writeFileSync('src/plugins/api.ts', apiTsContent, 'utf8');
console.log('Merged all services into src/plugins/api.ts');
