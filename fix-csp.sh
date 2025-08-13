#!/bin/bash
# Complete Next.js cache clear and restart script

echo "🧹 Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .vercel

echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting development server..."
npm run dev
