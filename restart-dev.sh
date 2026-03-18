#!/bin/bash
echo "Stopping current process..."
pkill -f "next dev" || true
echo "Clearing Next.js cache..."
rm -rf .next
echo "Starting development server..."
npm run dev