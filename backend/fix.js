const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      const enumsPath = path.relative(path.dirname(fullPath), path.join(__dirname, 'src/common/enums')).replace(/\\/g, '/');
      const importPath = enumsPath.startsWith('.') ? enumsPath : './' + enumsPath;
      
      content = content.replace(/import\s+\{\s*Role\s*\}\s+from\s+'@prisma\/client';/g, `import { Role } from '${importPath}';`);
      content = content.replace(/import\s+\{\s*GoalStatus\s*\}\s+from\s+'@prisma\/client';/g, `import { GoalStatus } from '${importPath}';`);
      content = content.replace(/import\s+\{\s*GoalStatus,\s*Role\s*\}\s+from\s+'@prisma\/client';/g, `import { GoalStatus, Role } from '${importPath}';`);
      content = content.replace(/import\s+\{\s*CheckInStatus\s*\}\s+from\s+'@prisma\/client';/g, `import { CheckInStatus } from '${importPath}';`);
      
      // Some files might import { Role } from '@prisma/client' when it's mixed with other things but in this project I mostly imported just the enums.
      // If there's "import { Role, Prisma } from '@prisma/client'", we'd need a stronger regex, but I know the exact imports I created.
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

walk('./src');
