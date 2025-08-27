#!/bin/bash

# 🚀 Kier Logistics Deployment Script
# This script builds and prepares your app for deployment

echo "🚀 Starting Kier Logistics deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful!"

# Check if build output exists
if [ ! -d ".svelte-kit/output" ]; then
    echo "❌ Build output not found. Check your SvelteKit configuration."
    exit 1
fi

echo "📁 Build output found at .svelte-kit/output"

# Display next steps
echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps to deploy:"
echo ""
echo "1. 🌐 Go to https://vercel.com"
echo "2. 📤 Click 'New Project'"
echo "3. 🔗 Connect your GitHub repository"
echo "4. ⚙️  Configure:"
echo "   - Framework: SvelteKit"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .svelte-kit/output"
echo "5. 🔑 Add environment variables:"
echo "   - VITE_SUPABASE_URL=your_supabase_url"
echo "   - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "6. 🚀 Click Deploy!"
echo ""
echo "💡 Alternative: Use Netlify Drop at https://netlify.com/drop"
echo "   Just drag and drop the .svelte-kit/output folder!"
echo ""
echo "🎯 Your app will be live in 2-3 minutes!"
