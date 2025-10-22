#!/bin/bash
# Automated publish workflow for datemath-cli
# Usage: ./publish.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 Publishing datemath-cli ($VERSION_TYPE)"
echo ""

# Pre-publish checks
echo "✓ Running tests..."
pnpm test

echo "✓ Checking coverage..."
pnpm test:coverage

echo "✓ Type checking..."
pnpm typecheck

echo "✓ Building..."
pnpm build

echo "✓ Checking git status..."
if [[ -n $(git status -s) ]]; then
  echo "❌ Working directory not clean. Commit changes first."
  exit 1
fi

# Version bump
echo ""
echo "📦 Bumping version ($VERSION_TYPE)..."
pnpm version $VERSION_TYPE

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Push changes
echo ""
echo "⬆️  Pushing to git..."
git push
git push --tags

# Publish to npm
echo ""
echo "📤 Publishing to npm..."
pnpm publish --access public

# Create GitHub release
echo ""
echo "🎉 Creating GitHub release..."
gh release create "v$NEW_VERSION" --generate-notes

echo ""
echo "✅ Published v$NEW_VERSION successfully!"
echo ""
echo "📝 Don't forget to update CHANGELOG.md:"
echo "   git add CHANGELOG.md"
echo "   git commit -m '📖 DOC: Update CHANGELOG for v$NEW_VERSION'"
echo "   git push"
