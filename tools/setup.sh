#!/bin/bash
# Step 1: Set Git to use the tracked hooks folder
git config core.hooksPath .githooks
echo "✅ Git hook path set to .githooks/"

# Step 2: Ensure pre-commit hook is executable
chmod +x .githooks/pre-commit
echo "✅ Made .githooks/pre-commit executable"

echo "✅ Setup complete"
