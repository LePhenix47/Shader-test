import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Setup readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to prompt user
async function prompt(question: string, defaultValue?: string): Promise<string> {
  const defaultText = defaultValue ? ` (default: ${defaultValue})` : '';
  const answer = await rl.question(`${question}${defaultText}: `);
  return answer.trim() || defaultValue || '';
}

// Helper to delete file
function deleteFile(filePath: string): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  } catch (error) {
    console.error(`❌ Failed to delete ${filePath}:`, error);
  }
  return false;
}

// Helper to update JSON file
function updateJSON(filePath: string, updates: Record<string, any>): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const json = JSON.parse(content);

    Object.assign(json, updates);

    fs.writeFileSync(fullPath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error);
    return false;
  }
}

// Helper to replace content in file
function replaceInFile(filePath: string, replacements: Array<{find: string | RegExp, replace: string}>): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');

    for (const { find, replace } of replacements) {
      content = content.replace(find, replace);
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error);
    return false;
  }
}

// Helper to write entire file
function writeFile(filePath: string, content: string): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    fs.writeFileSync(fullPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to write ${filePath}:`, error);
    return false;
  }
}

// Main cleanup function
async function cleanup() {
  console.log('🧹 Template Cleanup Script\n');
  console.log('This will modify your files to remove template-specific content.\n');
  console.log('⚠️  Make sure to review the changes in Git before committing!\n');

  // Gather user input
  const projectName = await prompt('Project name', 'my-react-app');
  const description = await prompt('Description', 'My awesome React application');
  const author = await prompt('Author name', 'Your Name');
  const website = await prompt('Website URL (optional)', 'https://yoursite.com');
  const basePath = await prompt('Deployment base path', '/');

  console.log('\n🔄 Starting cleanup...\n');

  // Track changes
  const deleted: string[] = [];
  const modified: string[] = [];

  // 1. Delete example files
  console.log('📁 Deleting example files...');
  const filesToDelete = [
    'src/routes/about.tsx',
    'src/components/ExampleComponent.tsx',
    'src/stores/exampleStore.ts',
    'src/schemas/exampleSchemas.ts'
  ];

  for (const file of filesToDelete) {
    if (deleteFile(file)) {
      deleted.push(file);
      console.log(`  ✓ Deleted ${file}`);
    }
  }

  // 2. Update package.json
  console.log('\n📦 Updating package.json...');
  if (updateJSON('package.json', {
    name: projectName,
    description: description,
    author: author
  })) {
    modified.push('package.json');
    console.log('  ✓ Updated package.json');
  }

  // 3. Update .env.example
  console.log('\n🔧 Updating .env.example...');
  if (replaceInFile('.env.example', [
    { find: 'VITE_BASE_PATH=/React_Vite-template', replace: `VITE_BASE_PATH=${basePath}` }
  ])) {
    modified.push('.env.example');
    console.log('  ✓ Updated .env.example');
  }

  // 4. Update src/routes/index.tsx
  console.log('\n🏠 Updating home page...');
  const indexContent = `import { createFileRoute } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Home - ${projectName}' },
      {
        name: 'description',
        content: '${description}'
      },
      { property: 'og:title', content: 'Home - ${projectName}' },
      {
        property: 'og:description',
        content: '${description}'
      },
      { property: 'og:url', content: '${website}' },
      { name: 'twitter:title', content: 'Home - ${projectName}' },
      {
        name: 'twitter:description',
        content: '${description}'
      },
    ],
  }),
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div>
      <ThemeToggle />

      <h2>${projectName}</h2>

      <p>${description}</p>
    </div>
  );
}
`;
  if (writeFile('src/routes/index.tsx', indexContent)) {
    modified.push('src/routes/index.tsx');
    console.log('  ✓ Updated src/routes/index.tsx');
  }

  // 5. Update src/routes/__root.tsx
  console.log('\n🌳 Updating root route...');
  if (replaceInFile('src/routes/__root.tsx', [
    { find: /"React Template"/g, replace: `"${projectName}"` },
    { find: /content="React \+ Vite \+ TypeScript \+ SASS template"/g, replace: `content="${description}"` },
    { find: /content="Younes LAHOUITI"/g, replace: `content="${author}"` },
    { find: /https:\/\/lephenix47\.github\.io/g, replace: website },
    { find: /"React Template - Modern React starter with Vite, TypeScript, and SASS"/g, replace: `"${projectName} - ${description}"` },
    { find: /Made with ❤️ by Younes LAHOUITI/g, replace: `Made with ❤️ by ${author}` }
  ])) {
    modified.push('src/routes/__root.tsx');
    console.log('  ✓ Updated src/routes/__root.tsx');
  }

  // 6. Update .github/workflows/deploy.yml
  console.log('\n🚀 Updating GitHub workflow...');
  if (replaceInFile('.github/workflows/deploy.yml', [
    { find: 'name: Deploy React Vite Template to GitHub Pages', replace: `name: Deploy ${projectName} to GitHub Pages` }
  ])) {
    modified.push('.github/workflows/deploy.yml');
    console.log('  ✓ Updated .github/workflows/deploy.yml');
  }

  // 7. Update README.md
  console.log('\n📝 Updating README.md...');
  const readmeContent = `# ${projectName}

## Table of Contents

- [${projectName}](#${projectName.toLowerCase().replace(/\s+/g, '-')})
  - [Table of Contents](#table-of-contents)
  - [1. Description](#1-description)
  - [2. Demo](#2-demo)
  - [3. Technologies Used](#3-technologies-used)
  - [4. Features](#4-features)
  - [5. Usage](#5-usage)
  - [6. Credits](#6-credits)
  - [7. License](#7-license)

## 1. Description

${description}

## 2. Demo

You can see a live demo of the project at: [GitHub Pages](${website})

## 3. Technologies Used

- React
- TypeScript
- Vite
- SASS
- TanStack Router
- TanStack Query
- Zustand
- Zod
- GSAP

<a href="https://react.dev/" target="_blank" rel="noreferrer" title="React"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="36" height="36" alt="React" /></a>
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer" title="TypeScript"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" width="36" height="36" alt="TypeScript" /></a>
<a href="https://vitejs.dev/" target="_blank" rel="noreferrer" title="Vite"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vite-colored.svg" width="36" height="36" alt="Vite" /></a>
<a href="https://sass-lang.com/" target="_blank" rel="noreferrer" title="SASS"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/sass-colored.svg" width="36" height="36" alt="Sass" /></a>

## 4. Features

[Add your project features here]

## 5. Usage

To get started with this project:

1. Clone the repository
2. Install dependencies: \`bun install\`
3. Update the \`.env\` file with your configuration
4. Start the development server: \`bun run dev\`
5. Build for production: \`bun run build\`

## 6. Credits

This project was created by ${author}.

## 7. License

This project is licensed under the ISC License.
`;
  if (writeFile('README.md', readmeContent)) {
    modified.push('README.md');
    console.log('  ✓ Updated README.md');
  }

  // 8. Remove GitHub Pages redirect code from main.tsx
  console.log('\n🔄 Removing GitHub Pages redirect code...');
  if (replaceInFile('src/main.tsx', [
    {
      find: /\/\/ Handle GitHub Pages 404 redirect\nconst redirect = sessionStorage\.getItem\('redirect'\);\nif \(redirect\) \{\n  sessionStorage\.removeItem\('redirect'\);\n  window\.history\.replaceState\(null, '', redirect\);\n\}\n\n/,
      replace: ''
    }
  ])) {
    modified.push('src/main.tsx');
    console.log('  ✓ Removed redirect code from src/main.tsx');
  }

  // 9. Remove cleanup script from package.json
  console.log('\n🗑️  Removing cleanup script from package.json...');
  const packagePath = path.join(projectRoot, 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  if (packageContent.scripts && packageContent.scripts.cleanup) {
    delete packageContent.scripts.cleanup;
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2) + '\n', 'utf-8');
    console.log('  ✓ Removed cleanup script from package.json');
  }

  // 10. Delete this script
  console.log('\n🗑️  Deleting cleanup script...');
  const scriptPath = path.join(projectRoot, 'scripts', 'cleanup-template.ts');
  if (fs.existsSync(scriptPath)) {
    fs.unlinkSync(scriptPath);
    deleted.push('scripts/cleanup-template.ts');
    console.log('  ✓ Deleted scripts/cleanup-template.ts');
  }

  // Summary
  console.log('\n✅ Cleanup complete!\n');
  console.log(`📊 Summary:`);
  console.log(`  - Files deleted: ${deleted.length}`);
  console.log(`  - Files modified: ${modified.length}`);
  console.log('\n📝 Next steps:');
  console.log('  1. Review changes in Git');
  console.log('  2. Update .env with your local development values');
  console.log('  3. Run: bun run dev');
  console.log('\n💡 Tip: You can see all changes by running: git status\n');

  rl.close();
}

cleanup().catch((error) => {
  console.error('\n❌ Cleanup failed:', error);
  rl.close();
  process.exit(1);
});
