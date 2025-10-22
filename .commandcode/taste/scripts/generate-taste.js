#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
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
						path: `./${item}/SKILL.md`,
						folder: item
					});
				}
			} catch (err) {
				console.warn(`Warning: Could not read ${skillFile}`);
			}
		}
	}

	return skills;
};

const generateMainTasteMd = () => {
	console.log('🔍 Scanning skills...');
	const skills = scanSkills(tasteDir);
	console.log(`✓ Found ${skills.length} skills`);

	let content = `# TASTE

Taste is how user prefers to do code in this project. Always prefer doing things in this taste file.

## General Preferences

- Use pnpm as package manager
- Use Commander.js for CLI development

## Skills

`;

	for (const skill of skills) {
		content += `### ${skill.name}\n\n`;
		content += `${skill.description}\n\n`;
		content += `How to use this skill: ${skill.path}\n`;
		
		const skillTastePath = join(tasteDir, skill.folder, 'taste.md');
		if (existsSync(skillTastePath)) {
			content += `How this project uses this skill: ./${skill.folder}/taste.md\n`;
		}
		content += '\n';
	}

	const tastePath = join(tasteDir, 'TASTE.md');
	writeFileSync(tastePath, content, 'utf-8');
	console.log(`✓ Generated ${tastePath}`);
};

generateMainTasteMd();
