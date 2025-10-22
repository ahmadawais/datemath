---
name: publish
description: Publish datemath-cli to npm. Use when releasing new version after features/fixes are complete.
---

# Publish

Publish new version to npm.

## When to Use

- New features complete and tested
- Bug fixes ready for release
- Ready to publish new version

## Quick Publish

Use automated script:

```bash
./taste/publish/scripts/publish.sh [patch|minor|major]
```

Script runs all checks, bumps version, publishes, creates release.

## Manual Workflow

### Pre-publish

```bash
pnpm test && pnpm test:coverage && pnpm typecheck && pnpm build
git status  # must be clean
```

### Publish

```bash
pnpm version patch     # or minor/major
git push --tags
pnpm publish --access public
gh release create v1.6.3 --generate-notes
```

### Post-publish

Update CHANGELOG.md:

```markdown
## [1.6.3] - 2025-10-18
### Added/Fixed/Changed
- Description
```

Commit: `git commit -m "📖 DOC: Update CHANGELOG for v1.6.3"`

## Versioning

- **patch** (1.6.3 → 1.6.4) - bug fixes
- **minor** (1.6.3 → 1.7.0) - new features
- **major** (1.6.3 → 2.0.0) - breaking changes

## Local Test

```bash
pnpm link --global && datemath today && pnpm unlink --global
```

## Script

See `scripts/publish.sh` for automated workflow with all checks.
