#!/bin/bash

# JenGen.ai Development Server Startup Script
# This script handles common Next.js development issues

echo "🚀 Starting JenGen.ai Development Server..."

# Function to kill existing Next.js processes
cleanup() {
    echo "🧹 Cleaning up existing processes..."
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "node.*next" 2>/dev/null || true
    sleep 2
}

# Function to clean cache
clean_cache() {
    echo "🗑️  Cleaning Next.js cache..."
    rm -rf .next 2>/dev/null || true
    rm -rf node_modules/.cache 2>/dev/null || true
}

# Function to start development server
start_server() {
    echo "⚡ Starting development server (webpack mode)..."
    npm run dev
}

# Main execution
main() {
    cleanup
    clean_cache
    start_server
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main