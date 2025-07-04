#!/bin/bash

echo "🚀 Hackathon Partner Finder - Live Demo Deployment"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from demo template..."
    cp .env.demo .env
    echo "📝 Please edit .env with your Firebase configuration before continuing."
    echo "   You can get these values from https://console.firebase.google.com"
    read -p "Press Enter after updating .env file..."
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo "📱 Your live demo is now available at the URL shown above"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Set up Firebase Authentication (Email, Google, GitHub)"
    echo "2. Create Firestore database"
    echo "3. Add environment variables in Vercel dashboard"
    echo "4. Test your live demo!"
else
    echo "❌ Build failed. Please check the errors above."
fi