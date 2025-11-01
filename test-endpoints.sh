#!/bin/bash

# API Endpoint Testing Script
# Run this script to test all endpoints from command line

API_BASE="https://ai-resumebuilder-2.onrender.com"

echo "🚀 Testing API endpoints for: $API_BASE"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    
    echo -n "🧪 Testing $name... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" 2>/dev/null)
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract body (all but last line)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo -e "${GREEN}✅ SUCCESS ($status_code)${NC}"
        echo "   Response: $(echo "$body" | head -c 100)..."
    else
        echo -e "${RED}❌ FAILED ($status_code)${NC}"
        echo "   Error: $(echo "$body" | head -c 100)..."
    fi
    echo ""
}

# Run tests
echo "1. Testing Server Health..."
test_endpoint "Health Check" "$API_BASE/health"

echo "2. Testing Root Endpoint..."
test_endpoint "Root Endpoint" "$API_BASE/"

echo "3. Testing AI Enhancement..."
test_endpoint "AI Enhancement" "$API_BASE/api/enhance" "POST" '{
    "section": "full_resume",
    "data": "John Doe\nSoftware Developer\nExperience in JavaScript"
}'

echo "4. Testing Auth Register..."
test_endpoint "Auth Register" "$API_BASE/api/auth/register" "POST" '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "TestPassword123!"
}'

echo "5. Testing Auth Login..."
test_endpoint "Auth Login" "$API_BASE/api/auth/login" "POST" '{
    "email": "test@example.com",
    "password": "wrongpassword"
}'

echo "6. Testing Resumes Endpoint..."
test_endpoint "Get Resumes" "$API_BASE/api/resumes"

echo "7. Testing CORS..."
test_endpoint "CORS Options" "$API_BASE/api/enhance" "OPTIONS"

echo "=================================================="
echo "🏁 Testing completed!"
echo ""
echo "💡 If you see 500 errors, check:"
echo "   • Server logs on Render.com dashboard"
echo "   • Environment variables configuration"
echo "   • Database connection status"
echo "   • Server deployment status"