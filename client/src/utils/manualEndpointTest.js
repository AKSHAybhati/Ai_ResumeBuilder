// Manual Endpoint Testing Script
// Copy and paste this into your browser console to test endpoints manually

const API_BASE = 'https://ai-resumebuilder-2.onrender.com';

// Test function
async function testEndpoint(name, url, options = {}) {
  console.log(`🧪 Testing ${name}...`);
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.text();
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS (${response.status})`);
      console.log('Response:', parsedData);
    } else {
      console.log(`❌ ${name}: FAILED (${response.status})`);
      console.log('Error:', parsedData);
    }
    
    return { success: response.ok, status: response.status, data: parsedData };
  } catch (error) {
    console.log(`❌ ${name}: NETWORK ERROR`);
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API endpoint tests...');
  console.log('API Base URL:', API_BASE);
  console.log('='.repeat(50));
  
  const results = {};
  
  // 1. Test server health
  results.health = await testEndpoint(
    'Server Health', 
    `${API_BASE}/health`
  );
  
  // 2. Test root endpoint
  results.root = await testEndpoint(
    'Root Endpoint', 
    `${API_BASE}/`
  );
  
  // 3. Test AI Enhancement
  results.enhance = await testEndpoint(
    'AI Enhancement', 
    `${API_BASE}/api/enhance`,
    {
      method: 'POST',
      body: JSON.stringify({
        section: 'full_resume',
        data: 'John Doe\nSoftware Developer\nExperience in JavaScript and React'
      })
    }
  );
  
  // 4. Test Auth Register
  results.register = await testEndpoint(
    'Auth Register', 
    `${API_BASE}/api/auth/register`,
    {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!'
      })
    }
  );
  
  // 5. Test Auth Login (with dummy credentials)
  results.login = await testEndpoint(
    'Auth Login', 
    `${API_BASE}/api/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    }
  );
  
  // 6. Test Resumes endpoint (without auth)
  results.resumes = await testEndpoint(
    'Get Resumes (No Auth)', 
    `${API_BASE}/api/resumes`
  );
  
  // 7. Test CORS
  results.cors = await testEndpoint(
    'CORS Preflight', 
    `${API_BASE}/api/enhance`,
    {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    }
  );
  
  // Generate summary
  console.log('='.repeat(50));
  console.log('📊 TEST SUMMARY:');
  console.log('='.repeat(50));
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r.success).length;
  const failed = total - passed;
  
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed/total) * 100).toFixed(1)}%`);
  
  console.log('\n📋 DETAILED RESULTS:');
  Object.entries(results).forEach(([test, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const details = result.success ? '' : ` (${result.status || 'Network Error'})`;
    console.log(`${test}: ${status}${details}`);
  });
  
  if (failed > 0) {
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Check server logs on Render.com');
    console.log('2. Verify environment variables');
    console.log('3. Check database connection');
    console.log('4. Ensure all dependencies are installed');
  }
  
  return results;
}

// Quick individual tests
window.testAPI = {
  runAll: runAllTests,
  testEnhance: () => testEndpoint('AI Enhancement', `${API_BASE}/api/enhance`, {
    method: 'POST',
    body: JSON.stringify({
      section: 'full_resume',
      data: 'Test resume content'
    })
  }),
  testAuth: () => testEndpoint('Auth Register', `${API_BASE}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test User',
      email: `quicktest${Date.now()}@example.com`,
      password: 'TestPassword123!'
    })
  }),
  testHealth: () => testEndpoint('Health Check', `${API_BASE}/health`)
};

console.log('🧪 Manual API Testing Script Loaded!');
console.log('Usage:');
console.log('  testAPI.runAll() - Run all tests');
console.log('  testAPI.testEnhance() - Test AI enhancement only');
console.log('  testAPI.testAuth() - Test authentication only');
console.log('  testAPI.testHealth() - Test server health only');
console.log('');
console.log('Run testAPI.runAll() to start testing all endpoints!');

// Auto-run if you want immediate results
// runAllTests();