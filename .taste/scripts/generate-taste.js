#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tasteDir = join(__dirname, '..');
const projectRoot = join(tasteDir, '..');

const extractYamlFrontmatter = (content) => {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return null;

	const yaml = match[1];
	const lines = yaml.split('\n');
	const data = {};

	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex === -1) continue;

		const key = line.substring(0, colonIndex).trim();
		const value = line.substring(colonIndex + 1).trim();
		data[key] = value;
	}

	return data;
};

const scanSkills = (baseDir) => {
	const skills = [];
	const items = readdirSync(baseDir);

	for (const item of items) {
		const itemPath = join(baseDir, item);
		const stat = statSync(itemPath);

		if (stat.isDirectory() && item !== 'scripts') {
			const skillFile = join(itemPath, 'SKILL.md');
			try {
				const content = readFileSync(skillFile, 'utf-8');
				const frontmatter = extractYamlFrontmatter(content);

				if (frontmatter && frontmatter.name && frontmatter.description) {
					skills.push({
						name: frontmatter.name,
						description: frontmatter.description,
						path: `./${item}/SKILL.md`
					});
				}
			} catch (err) {
				console.warn(`Warning: Could not read ${skillFile}`);
			}
		}
	}

	return skills;
};

const generateTasteMd = () => {
	const tastePath = join(tasteDir, 'taste.md');
	const tasteContent = `- Use pnpm as package manager
- Use Commander.js for CLI development
`;
	writeFileSync(tastePath, tasteContent, 'utf-8');
	console.log(`✓ Generated ${tastePath}`);
};

const generateSpecMd = () => {
	const specPath = join(tasteDir, 'spec.md');
	const specContent = `# DateMath CLI

TypeScript CLI for date calculations. Commander.js + @clack/prompts + chalk/figures.

## Stack

tsup (esbuild), Vitest, Commander.js, @clack/prompts, chalk, gradient-string, figures, ora

## Files

\`\`\`
src/index.ts           - commands, utils, main entry
src/calc-command.ts    - interactive mode
src/*.test.ts          - co-located tests
tsup.config.ts         - build config
vitest.config.ts       - test config, coverage thresholds
tsconfig.json          - TS config
package.json           - bin: datemath, type: module
\`\`\`

## Quick Start

\`\`\`bash
pnpm dev              # watch mode
pnpm test             # run tests
pnpm build            # production build
\`\`\`
`;
	writeFileSync(specPath, specContent, 'utf-8');
	console.log(`✓ Generated ${specPath}`);
};

const generateIndexMd = () => {
	console.log('🔍 Scanning skills...');
	const skills = scanSkills(tasteDir);
	console.log(`✓ Found ${skills.length} skills`);

	let content = '';

	content += '## Taste\n\n';
	content += 'Taste is how user prefers to do code in this project. Always prefer doing things in this taste file.\n\n';
	content += '[taste.md](./taste.md)\n\n';

	content += '## Project Spec\n\n';
	content += '[spec.md](./spec.md)\n\n';

	content += '## Skills\n\n';
	for (const skill of skills) {
		content += `- **[${skill.name}](${skill.path})** - ${skill.description}\n`;
	}

	const indexPath = join(tasteDir, 'index.md');
	writeFileSync(indexPath, content, 'utf-8');
	console.log(`✓ Generated ${indexPath}`);
};

generateTasteMd();
generateSpecMd();
generateIndexMd();
