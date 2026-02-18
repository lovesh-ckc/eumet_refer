const fs = require('fs');
const path = require('path');

// Usage: node generate-screen.js <app-name> <screen-name>
// Example: node generate-screen.js command-center my-new-dashboard

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: node generate-screen.js <app> <screen-name>");
    process.exit(1);
}

const [appName, screenName] = args;
const targetDir = path.join(__dirname, `../../apps/${appName}/app/(shell)/${screenName}`);
const targetFile = path.join(targetDir, 'page.tsx');

const template = `
'use client';
import { ScreenRenderer, ScreenDefinition } from '@eumetise/ui';

// Auto-generated screen definition
const ${screenName.replace(/-/g, '')}Schema: ScreenDefinition = {
  id: '${screenName}',
  layout: [
    {
      id: 'header',
      type: 'SectionHeader',
      props: { title: '${screenName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}' }
    },
    {
        id: 'content',
        type: 'Card',
        props: {
            className: 'p-6',
            children: 'Generated Content Area'
        }
    }
  ]
};

export default function Page() {
  return <ScreenRenderer schema={${screenName.replace(/-/g, '')}Schema} />;
}
`;

if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(targetFile, template.trim());
console.log(`✅ Generated screen at ${targetFile}`);
