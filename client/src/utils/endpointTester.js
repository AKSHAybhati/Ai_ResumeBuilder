import apiService from '../services/apiService';

class EndpointTester {
  constructor() {
    this.results = [];
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    this.results.push(logEntry);
    
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    
    console.log(`${emoji[type]} [${timestamp}] ${message}`);
  }

  async testEndpoint(name, testFunction) {
    this.log(`Testing ${name}...`, 'info');
    try {
      const result = await testFunction();
      this.log(`${name}: SUCCESS`, 'success');
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      const statusCode = error.response?.status || 'No status';
      this.log(`${name}: FAILED (${statusCode}) - ${errorMsg}`, 'error');
      return { success: false, error: errorMsg, status: statusCode };
    }
  }

  async testAllEndpoints() {
    this.log(`🚀 Starting comprehensive endpoint testing for: ${this.baseURL}`, 'info');
    this.log('=' * 60, 'info');

    const testResults = {};

    // 1. Test Basic Health Check
    testResults.health = await this.testEndpoint('Health Check', async () => {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    });

    // 2. Test AI Enhancement Endpoint
    testResults.aiEnhance = await this.testEndpoint('AI Enhancement', async () => {
      return await apiService.ai.enhance('full_resume', 'John Doe\nSoftware Developer\nExperience in JavaScript');
    });

    // 3. Test Authentication Endpoints
    testResults.authRegister = await this.testEndpoint('Auth Register', async () => {
      return await apiService.auth.register({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!'
      });
    });

    // Only test login if register succeeded
    if (testResults.authRegister.success) {
      testResults.authLogin = await this.testEndpoint('Auth Login', async () => {
        return await apiService.auth.login({
          email: `test${Date.now()}@example.com`,
          password: 'TestPassword123!'
        });
      });
    }

    // 4. Test Resume Endpoints (without auth for now)
    testResults.resumesGet = await this.testEndpoint('Get Resumes (No Auth)', async () => {
      const response = await fetch(`${this.baseURL}/api/resumes`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    });

    // 5. Test CORS and Options
    testResults.cors = await this.testEndpoint('CORS Preflight', async () => {
      const response = await fetch(`${this.baseURL}/api/enhance`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      return { status: response.status, headers: Object.fromEntries(response.headers.entries()) };
    });

    // 6. Test Server Info
    testResults.serverInfo = await this.testEndpoint('Server Info', async () => {
      const response = await fetch(`${this.baseURL}/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    });

    // Generate Summary Report
    this.generateSummaryReport(testResults);
    
    return testResults;
  }

  generateSummaryReport(testResults) {
    this.log('=' * 60, 'info');
    this.log('📊 ENDPOINT TESTING SUMMARY REPORT', 'info');
    this.log('=' * 60, 'info');

    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result => result.success).length;
    const failedTests = totalTests - passedTests;

    this.log(`📈 Total Tests: ${totalTests}`, 'info');
    this.log(`✅ Passed: ${passedTests}`, 'success');
    this.log(`❌ Failed: ${failedTests}`, failedTests > 0 ? 'error' : 'success');
    this.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`, 'info');

    this.log('\n📋 DETAILED RESULTS:', 'info');
    Object.entries(testResults).forEach(([endpoint, result]) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      const details = result.success ? '' : ` (${result.status}: ${result.error})`;
      this.log(`  ${endpoint}: ${status}${details}`, result.success ? 'success' : 'error');
    });

    // Recommendations
    this.log('\n🔧 RECOMMENDATIONS:', 'info');
    if (failedTests > 0) {
      this.log('• Check server logs for detailed error information', 'warning');
      this.log('• Verify environment variables are set correctly on the server', 'warning');
      this.log('• Ensure database connections are working', 'warning');
      this.log('• Check if all required dependencies are installed', 'warning');
    } else {
      this.log('• All endpoints are working correctly! 🎉', 'success');
    }

    this.log('=' * 60, 'info');
  }

  // Quick test for specific endpoint
  async quickTest(endpointName) {
    switch (endpointName.toLowerCase()) {
      case 'enhance':
      case 'ai':
        return await this.testEndpoint('AI Enhancement', async () => {
          return await apiService.ai.enhance('full_resume', 'Test content');
        });
      
      case 'auth':
      case 'register':
        return await this.testEndpoint('Auth Register', async () => {
          return await apiService.auth.register({
            name: 'Test User',
            email: `quicktest${Date.now()}@example.com`,
            password: 'TestPassword123!'
          });
        });
      
      case 'resumes':
        return await this.testEndpoint('Get Resumes', async () => {
          return await apiService.resumes.getAll();
        });
      
      default:
        this.log(`Unknown endpoint: ${endpointName}`, 'error');
        return { success: false, error: 'Unknown endpoint' };
    }
  }

  // Get all test results
  getResults() {
    return this.results;
  }

  // Clear results
  clearResults() {
    this.results = [];
  }
}

// Create singleton instance
const endpointTester = new EndpointTester();

// Export for use in components
export default endpointTester;

// Also export the class for creating new instances
export { EndpointTester };