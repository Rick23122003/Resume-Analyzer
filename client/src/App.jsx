import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume to analyze.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDesc);

    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      color: '#0f172a',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '850px', 
        margin: '0 auto', 
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.025em', margin: '0 0 10px 0', color: '#1e293b' }}>
            AI Resume Analyzer
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
            Compare your resume against any job description instantly.
          </p>
        </div>
        
        {/* Main Input Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          padding: '32px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          marginBottom: '32px',
          border: '1px solid #e2e8f0'
        }}>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
              1. Target Job Description (Optional but recommended)
            </label>
            <textarea 
              rows="4" 
              style={{ 
                width: '100%', 
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                color: '#334155',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Paste the job description or required skills here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                2. Upload Resume
              </label>
              <div style={{ 
                border: '2px dashed #cbd5e1', 
                borderRadius: '12px', 
                padding: '20px', 
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                transition: 'all 0.2s ease'
              }}>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  style={{ width: '100%', color: '#64748b', cursor: 'pointer' }}
                />
              </div>
            </div>
            
            <button 
              onClick={handleUpload} 
              disabled={loading} 
              style={{ 
                width: '100%',
                padding: '16px 24px', 
                backgroundColor: loading ? '#94a3b8' : '#4f46e5', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'wait' : 'pointer', 
                boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Analyzing Candidate Match...' : 'Analyze Fit'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && result.data && result.data.status === "success" && (
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            padding: '32px', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            
            {/* Top Row: Name & Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0 0 8px 0', color: '#0f172a' }}>
                  {result.data.analysis.name}
                </h2>
                <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.95rem' }}>
                  <span>✉️ {result.data.analysis.contact.email}</span>
                  <span>📱 {result.data.analysis.contact.phone}</span>
                </div>
              </div>
              
              {/* Sleek Circular Score Badge */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: result.data.analysis.match_score >= 75 ? '#ecfdf5' : result.data.analysis.match_score >= 50 ? '#fffbeb' : '#fef2f2', 
                border: `2px solid ${result.data.analysis.match_score >= 75 ? '#10b981' : result.data.analysis.match_score >= 50 ? '#f59e0b' : '#ef4444'}`,
                borderRadius: '50%', 
                width: '90px', 
                height: '90px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <span style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '800', 
                  color: result.data.analysis.match_score >= 75 ? '#047857' : result.data.analysis.match_score >= 50 ? '#b45309' : '#b91c1c',
                  lineHeight: '1'
                }}>
                  {result.data.analysis.match_score}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#64748b', marginTop: '4px' }}>
                  Match
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>Professional Summary</h3>
              <p style={{ color: '#475569', lineHeight: '1.7', margin: 0, fontSize: '0.95rem' }}>
                {result.data.analysis.experience_summary}
              </p>
            </div>
            
            {/* Skills Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {/* Matching Skills */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Aligned Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.data.analysis.matching_skills.length > 0 ? (
                    result.data.analysis.matching_skills.map((skill, i) => (
                      <span key={i} style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No direct matches found.</span>
                  )}
                </div>
              </div>
              
              {/* Missing Skills */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ef4444' }}>✕</span> Missing Requirements
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.data.analysis.missing_skills.length > 0 ? (
                    result.data.analysis.missing_skills.map((skill, i) => (
                      <span key={i} style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Candidate meets all major requirements!</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;