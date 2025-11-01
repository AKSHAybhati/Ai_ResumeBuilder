import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, CheckCircle, XCircle, AlertCircle, Server } from 'lucide-react';
import endpointTester from '../utils/endpointTester';

const EndpointTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [logs, setLogs] = useState([]);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    setLogs([]);
    
    // Clear previous results
    endpointTester.clearResults();
    
    try {
      const results = await endpointTester.testAllEndpoints();
      setTestResults(results);
      setLogs(endpointTester.getResults());
    } catch (error) {
      console.error('Test runner error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runQuickTest = async (endpoint) => {
    setIsRunning(true);
    try {
      const result = await endpointTester.quickTest(endpoint);
      console.log(`Quick test result for ${endpoint}:`, result);
    } catch (error) {
      console.error('Quick test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success) => {
    if (success) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Server className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Endpoint Tester
          </h1>
          <p className="text-gray-600 mb-6">
            Test all API endpoints to identify server issues
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Current API URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}
            </p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <RefreshCw className="animate-spin mr-2" size={20} />
              ) : (
                <Play className="mr-2" size={20} />
              )}
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => runQuickTest('enhance')}
                disabled={isRunning}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
              >
                Test AI Enhance
              </button>
              <button
                onClick={() => runQuickTest('auth')}
                disabled={isRunning}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
              >
                Test Auth
              </button>
              <button
                onClick={() => runQuickTest('resumes')}
                disabled={isRunning}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
              >
                Test Resumes
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results Summary</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(testResults).map(([endpoint, result]) => (
                <div
                  key={endpoint}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {endpoint.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {getStatusIcon(result.success)}
                  </div>
                  {!result.success && (
                    <p className="text-xs text-red-600">
                      {result.status}: {result.error}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.keys(testResults).length}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(testResults).filter(r => r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {Object.values(testResults).filter(r => !r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Logs */}
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Logs</h2>
            
            <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 mb-2 text-sm">
                  {getLogIcon(log.type)}
                  <span className="text-gray-400 font-mono text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`flex-1 ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    'text-gray-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Troubleshooting 500 Errors
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check server logs on Render.com dashboard</li>
            <li>• Verify environment variables are set correctly</li>
            <li>• Ensure database connection is working</li>
            <li>• Check if all dependencies are installed</li>
            <li>• Verify API routes are properly defined</li>
            <li>• Test with Postman or curl for direct API testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EndpointTester;