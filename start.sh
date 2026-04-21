#!/bin/bash
# =============================================
# Catty Car Rental - Quick Start Script
# Run: bash start.sh
# =============================================

echo ""
echo "🐱 =============================="
echo "   เช่ารถกับแคตตี้ | Catty Car Rental"
echo "   Quick Start Script"
echo "================================="
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌  Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌  Node.js v18+ required. Current: $(node -v)"
  exit 1
fi

echo "✅  Node.js $(node -v) detected"

# Check .env.local
if [ ! -f ".env.local" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo ""
    echo "⚠️  Created .env.local from .env.example"
    echo "   Please edit .env.local and add your credentials:"
    echo ""
    echo "   MONGODB_URI=mongodb+srv://..."
    echo "   JWT_SECRET=your-secret"
    echo "   CLOUDINARY_CLOUD_NAME=xxx"
    echo "   CLOUDINARY_API_KEY=xxx"
    echo "   CLOUDINARY_API_SECRET=xxx"
    echo "   ANTHROPIC_API_KEY=sk-ant-..."
    echo ""
    echo "   Then run this script again."
    exit 0
  else
    echo "❌  .env.local not found. Copy .env.example and fill in credentials."
    exit 1
  fi
fi

echo "✅  .env.local found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌  npm install failed"
  exit 1
fi

echo "✅  Dependencies installed"

# Ask about seeding
echo ""
read -p "🌱 Seed demo data (admin + user + 6 sample cars)? [Y/n] " SEED
SEED=${SEED:-Y}

if [[ "$SEED" =~ ^[Yy]$ ]]; then
  echo ""
  echo "🌱 Seeding database..."
  node scripts/seed.js
fi

# Start dev server
echo ""
echo "🚀 Starting development server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🇹🇭  Thai:    http://localhost:3000/th"
echo "  🇬🇧  English: http://localhost:3000/en"
echo "  🛡️   Admin:   http://localhost:3000/th/admin"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Admin: admin@catty.com / admin123"
echo "  User:  user@catty.com  / user123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
