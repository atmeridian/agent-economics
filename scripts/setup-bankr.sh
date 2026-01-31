#!/bin/bash
# Setup script for Bankr SDK

echo "🦞 Setting up Bankr SDK for agent economics research..."
echo ""

# Try pnpm first (more reliable for monorepos)
if command -v pnpm &> /dev/null; then
    echo "📦 Using pnpm..."
    pnpm install
    if [ $? -eq 0 ]; then
        echo "✅ Installation successful with pnpm!"
        exit 0
    fi
fi

# Fall back to npm
if command -v npm &> /dev/null; then
    echo "📦 Using npm..."
    npm install --legacy-peer-deps
    if [ $? -eq 0 ]; then
        echo "✅ Installation successful with npm!"
        exit 0
    fi
fi

# Fall back to yarn
if command -v yarn &> /dev/null; then
    echo "📦 Using yarn..."
    yarn install
    if [ $? -eq 0 ]; then
        echo "✅ Installation successful with yarn!"
        exit 0
    fi
fi

echo "❌ Installation failed. Please try manually:"
echo ""
echo "Option 1 (npm):"
echo "  npm install --legacy-peer-deps"
echo ""
echo "Option 2 (pnpm):"
echo "  pnpm install"
echo ""
echo "Option 3 (yarn):"
echo "  yarn install"
echo ""
echo "If still failing, check:"
echo "  - Node.js version: node --version (need v18+)"
echo "  - npm version: npm --version"
echo "  - Disk space: df -h"
echo "  - npm cache: npm cache clean --force"
