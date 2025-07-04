#!/bin/bash

echo "🚀 Hackathon Partner Finder - Live Demo Deployment"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env file exists and has proper configuration
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Please follow these steps:"
    echo "1. Read GET-FIREBASE-CONFIG.md for detailed instructions"
    echo "2. Get your Firebase Web App configuration"
    echo "3. Update the .env file with your actual values"
    exit 1
fi

# Check if .env has placeholder values
if grep -q "your-.*-from-console" .env; then
    echo "⚠️  Found placeholder values in .env file!"
    echo ""
    echo "🔧 You need to update .env with actual Firebase values:"
    echo "   - REACT_APP_FIREBASE_API_KEY"
    echo "   - REACT_APP_FIREBASE_MESSAGING_SENDER_ID" 
    echo "   - REACT_APP_FIREBASE_APP_ID"
    echo ""
    echo "📖 See GET-FIREBASE-CONFIG.md for step-by-step instructions"
    echo "🌐 Visit: https://console.firebase.google.com/project/hackmate-855bf/settings/general"
    echo ""
    read -p "Press Enter after updating .env with real values..."
fi

echo "✅ Configuration looks good!"
echo ""

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "📱 Your live demo should now be available!"
    echo ""
    echo "🔧 Post-deployment checklist:"
    echo "1. ✅ Visit your demo URL"
    echo "2. ✅ Test user registration"
    echo "3. ✅ Create a sample team"
    echo "4. ✅ Test team discovery and applications"
    echo "5. ✅ Share your demo with others!"
    echo ""
    echo "📞 If you encounter issues:"
    echo "   - Check Firebase Authentication is enabled"
    echo "   - Verify Firestore security rules are set"
    echo "   - Test in an incognito window"
else
    echo "❌ Build failed. Please check the errors above."
    echo ""
    echo "🔍 Common issues:"
    echo "   - Missing Firebase configuration values"
    echo "   - Invalid API keys"
    echo "   - Network connectivity problems"
fi