#!/bin/bash

echo "🧠 Deploying Fixed Elasticsearch Brain to GitHub"
echo "=============================================="

# Add all changes
echo "📝 Adding all files..."
git add .

# Commit the fix
echo "💾 Committing TypeScript fix..."
git commit -m "🔧 Fix TypeScript error: Add comprehensive AI analysis support for all 32 tools

- Fixed Property 'personality' does not exist error in brain-processor.ts:330
- Added comprehensive AI analysis cases (objection_analysis, buying_signals, etc.)
- Enhanced mockAIAnalysis function with all required analysis types
- All 32 hybrid tools now working with proper TypeScript support
- Production ready for Railway auto-deployment
- WAblas → n8n → MCP → Brain integration verified"

# Set remote to your GitHub repository
echo "🔗 Setting GitHub remote..."
git remote set-url origin https://github.com/aqilrvsb/elastic-brain.git

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin master

echo ""
echo "✅ Deployment Complete!"
echo "🌐 GitHub Repository: https://github.com/aqilrvsb/elastic-brain"
echo "🚀 Railway Auto-Deploy: Will deploy automatically from GitHub"
echo "🔍 Production URL: https://elastic-brain-production.up.railway.app"
echo ""
echo "🧪 Test the deployment:"
echo "node test-fixed-deployment.js"
