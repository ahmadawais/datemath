# Taste Generator

Automatically generates `.taste/taste.md` by scanning skills and analyzing project preferences.

## Usage

```bash
node .taste/scripts/generate-taste.js
```

Or add to package.json:

```json
{
  "scripts": {
    "taste": "node .taste/scripts/generate-taste.js"
  }
}
```

Then run:

```bash
pnpm taste
```

## What It Does

1. **Scans Skills**: Reads all `SKILL.md` files in `.taste/` subdirectories
2. **Extracts Metadata**: Parses YAML frontmatter (name, description) from each skill
3. **Analyzes Project**: Detects preferences from package.json and source code
4. **Generates taste.md**: Creates comprehensive file with:
   - XML `<taste>` block with high-level preferences
   - Project overview
   - Skills catalog with names, descriptions, and paths
   - File structure reference
   - Quick start commands

## Output Format

```markdown
<taste>
  <preference>Use Commander.js for CLI development</preference>
  <preference>Use pnpm as package manager</preference>
  ...
</taste>

# Project Name

Overview...

## Skills

- **[skill-name](./skill-name/SKILL.md)** - Description
...
```

## When to Run

- After adding new skills
- After updating skill descriptions
- When project preferences change
- Before committing taste changes

## Skill Format

Skills must have YAML frontmatter:

```markdown
---
name: skill-name
description: What this skill does
---

# Skill Content
...
```
