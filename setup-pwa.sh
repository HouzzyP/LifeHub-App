#!/bin/bash
# PWA Install Helper Script
# Usage: npm run setup:pwa

echo "🚀 LifeHub PWA Setup"
echo "===================="
echo ""
echo "1. Installing ngrok globally (one-time setup)..."
npm install -g ngrok

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 To test PWA installation:"
echo "   1. npm run dev:https"
echo "   2. In another terminal: ngrok http 5173"
echo "   3. Open the HTTPS URL from ngrok on your mobile"
echo "   4. You should see the install banner!"
echo ""
echo "🔗 How it works:"
echo "   ngrok converts HTTP → HTTPS"
echo "   Chrome requires HTTPS to show install prompt"
echo "   Your local service worker + manifest = installable"
