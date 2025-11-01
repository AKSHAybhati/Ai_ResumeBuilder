import { useState } from 'react';
import { toast } from 'react-toastify';
import apiService from '../services/apiService';

const TestEnhancement = () => {
  const [input, setInput] = useState('John Doe\nSoftware Developer\nExperience: 3 years in JavaScript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await apiService.ai.enhance('full_resume', input);
      setResult(response.data.enhanced);
      toast.success('Resume enhanced successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Enhancement failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 AI Enhancement Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Input Resume:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', height: '150px', marginTop: '10px' }}
        />
      </div>
      
      <button 
        onClick={handleEnhance} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enhancing...' : '✨ Enhance with AI'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <label>Enhanced Result:</label>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            border: '1px solid #ddd',
            whiteSpace: 'pre-wrap',
            marginTop: '10px'
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestEnhancement;