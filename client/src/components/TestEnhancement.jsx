import { useState } from 'react';
import { toast } from 'react-toastify';

const TestEnhancement = () => {
  const [input, setInput] = useState('John Doe\nSoftware Developer\nExperience: 3 years in JavaScript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:5000/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'full_resume',
          data: input
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.enhanced);
      toast.success('Resume enhanced successfully!');
    } catch (err) {
      toast.error(`Enhancement failed: ${err.message}`);
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