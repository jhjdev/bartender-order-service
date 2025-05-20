import * as fs from 'fs';
import * as path from 'path';
import { getEnvPath, getUploadsPath } from '../utils/paths';

const scriptsDir = path.join(process.cwd(), 'packages/backend/scripts');
const files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(scriptsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace dotenv config
  content = content.replace(
    /dotenv\.config\(\{ path: path\.resolve\(__dirname, '\.\.\/\.\.\/\.env'\) \}\);/g,
    `dotenv.config({ path: '${getEnvPath()}' });`
  );

  // Replace uploads path
  content = content.replace(
    /const UPLOADS_DIR = path\.join\(__dirname, '\.\.', '\.\.', 'uploads'\);/g,
    `const UPLOADS_DIR = '${getUploadsPath()}';`
  );

  // Add import if needed
  if (content.includes('getEnvPath') || content.includes('getUploadsPath')) {
    if (
      !content.includes(
        "import { getEnvPath, getUploadsPath } from '../utils/paths';"
      )
    ) {
      content = content.replace(
        /import \* as dotenv from 'dotenv';/,
        `import * as dotenv from 'dotenv';\nimport { getEnvPath, getUploadsPath } from '../utils/paths';`
      );
    }
  }

  fs.writeFileSync(filePath, content);
}
