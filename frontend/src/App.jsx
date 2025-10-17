import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, FileVideo, FileImage, Activity, TrendingUp, Shield, Clock } from 'lucide-react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [analysisMode, setAnalysisMode] = useState('upload'); // 'upload' or 'youtube'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Configuration from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Deepfake Detection Platform';
  const APP_SUBTITLE = import.meta.env.VITE_APP_SUBTITLE || 'Advanced AI-Powered Media Authentication';
  const ENABLE_YOUTUBE = import.meta.env.VITE_ENABLE_YOUTUBE === 'true';
  const ENABLE_FILE_UPLOAD = import.meta.env.VITE_ENABLE_FILE_UPLOAD === 'true';

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const type = selectedFile.type.startsWith('video/') ? 'video' : 'image';
    setFile(selectedFile);
    setFileType(type);
    setResults(null);
    setError(null);
  };

  const analyzeFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = fileType === 'video' ? '/analyze/video' : '/analyze/image';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      setUploadProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeYouTube = async () => {
    if (!youtubeUrl) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await fetch(`${API_URL}/analyze/youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: youtubeUrl,
          sample_rate: 30
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data = await response.json();
      setResults(data);
      setUploadProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      'CRITICAL': '#dc2626',
      'HIGH': '#ea580c',
      'MEDIUM': '#f59e0b',
      'LOW': '#84cc16',
      'MINIMAL': '#22c55e'
    };
    return colors[riskLevel] || '#6b7280';
  };

  const getVerdictColor = (verdict) => {
    if (verdict.includes('AUTHENTIC')) return '#22c55e';
    if (verdict.includes('SUSPICIOUS')) return '#f59e0b';
    if (verdict.includes('FAKE')) return '#dc2626';
    return '#6b7280';
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <Shield size={32} />
            <h1>{APP_TITLE}</h1>
          </div>
          <p className="subtitle">{APP_SUBTITLE}</p>
        </div>
      </header>

      <main className="container main-content">
        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            {/* Mode Tabs */}
            {ENABLE_FILE_UPLOAD && ENABLE_YOUTUBE && (
              <div className="mode-tabs">
                <button 
                  className={`mode-tab ${analysisMode === 'upload' ? 'active' : ''}`}
                  onClick={() => {
                    setAnalysisMode('upload');
                    setResults(null);
                    setError(null);
                  }}
                >
                  <Upload size={20} />
                  Upload File
                </button>
                <button 
                  className={`mode-tab ${analysisMode === 'youtube' ? 'active' : ''}`}
                  onClick={() => {
                    setAnalysisMode('youtube');
                    setResults(null);
                    setError(null);
                    setFile(null);
                  }}
                >
                  <FileVideo size={20} />
                  YouTube URL
                </button>
              </div>
            )}

            {(!ENABLE_FILE_UPLOAD || !ENABLE_YOUTUBE) && analysisMode === 'youtube' && !ENABLE_YOUTUBE && (
              setAnalysisMode('upload')
            )}
            
            {(!ENABLE_FILE_UPLOAD || !ENABLE_YOUTUBE) && analysisMode === 'upload' && !ENABLE_FILE_UPLOAD && (
              setAnalysisMode('youtube')
            )}

            {(analysisMode === 'upload' && ENABLE_FILE_UPLOAD) ? (
              <>
                <div className="upload-icon">
                  {fileType === 'video' ? <FileVideo size={48} /> : <FileImage size={48} />}
                </div>
                <h2>Upload Media for Analysis</h2>
                <p>Support for images (JPG, PNG) and videos (MP4, AVI, MOV)</p>
                
                <label className="file-input-label">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  <Upload size={20} />
                  Choose File
                </label>

                {file && (
                  <div className="file-info">
                    <p><strong>Selected:</strong> {file.name}</p>
                    <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Type:</strong> {fileType.toUpperCase()}</p>
                    
                    <button 
                      className="analyze-button"
                      onClick={analyzeFile}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Activity className="spin" size={20} />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <TrendingUp size={20} />
                          Start Analysis
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (ENABLE_YOUTUBE && (
              <>
                <div className="upload-icon">
                  <FileVideo size={48} color="#dc2626" />
                </div>
                <h2>Analyze YouTube Video</h2>
                <p>Paste any YouTube URL to analyze for deepfakes</p>
                
                <div className="youtube-input-container">
                  <input
                    type="text"
                    className="youtube-input"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={loading}
                  />
                  
                  <button 
                    className="analyze-button"
                    onClick={analyzeYouTube}
                    disabled={loading || !youtubeUrl}
                  >
                    {loading ? (
                      <>
                        <Activity className="spin" size={20} />
                        Downloading & Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp size={20} />
                        Analyze YouTube Video
                      </>
                    )}
                  </button>
                </div>

                {youtubeUrl && !loading && (
                  <div className="youtube-note">
                    <p>⚠️ Video will be downloaded temporarily for analysis</p>
                    <p>This may take 1-3 minutes depending on video length</p>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-section">
            <div className="loading-spinner">
              <Activity className="spin" size={48} />
            </div>
            <h3>Analyzing Media...</h3>
            <p>This may take a few moments depending on file size</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-section">
            <AlertTriangle size={48} color="#dc2626" />
            <h3>Analysis Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && !loading && (
          <div className="results-section">
            {/* Overall Verdict */}
            <div className="verdict-card">
              <div className="verdict-header">
                <h2>Analysis Results</h2>
                {fileType === 'video' && results.video_info && (
                  <div className="video-info-badge">
                    <Clock size={16} />
                    {results.video_info.duration_seconds}s | {results.video_info.fps} FPS
                  </div>
                )}
              </div>

              <div className="verdict-score">
                <div 
                  className="score-circle"
                  style={{ 
                    borderColor: getRiskColor(results.overall_analysis?.risk_level || results.analysis?.risk_level)
                  }}
                >
                  <span className="score-value">
                    {results.overall_analysis?.deepfake_probability || results.analysis?.deepfake_probability}%
                  </span>
                  <span className="score-label">Deepfake Probability</span>
                </div>

                <div className="verdict-details">
                  <div 
                    className="verdict-badge"
                    style={{ 
                      backgroundColor: getVerdictColor(results.overall_analysis?.verdict || results.analysis?.verdict)
                    }}
                  >
                    {results.overall_analysis?.verdict || results.analysis?.verdict}
                  </div>
                  
                  <div 
                    className="risk-badge"
                    style={{ 
                      backgroundColor: getRiskColor(results.overall_analysis?.risk_level || results.analysis?.risk_level)
                    }}
                  >
                    {results.overall_analysis?.risk_level || results.analysis?.risk_level} RISK
                  </div>

                  <div className="confidence-stat">
                    <span className="stat-label">Confidence Score</span>
                    <span className="stat-value">
                      {results.overall_analysis?.confidence_score || results.analysis?.confidence_score}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics (Video Only) */}
            {results.statistics && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <span className="stat-label">Mean Score</span>
                    <span className="stat-value">{results.statistics.mean_score}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <span className="stat-label">Max Score</span>
                    <span className="stat-value">{results.statistics.max_score}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📉</div>
                  <div className="stat-content">
                    <span className="stat-label">Min Score</span>
                    <span className="stat-value">{results.statistics.min_score}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-content">
                    <span className="stat-label">Suspicious Frames</span>
                    <span className="stat-value">{results.statistics.suspicious_frame_count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Method Breakdown */}
            {results.method_breakdown && Object.keys(results.method_breakdown).length > 0 && (
              <div className="method-breakdown">
                <h3>Detection Method Analysis</h3>
                <div className="methods-grid">
                  {Object.entries(results.method_breakdown).map(([method, data]) => {
                    // Handle both image format (with details object) and video format (with averages)
                    const isVideoFormat = data.average_score !== undefined;
                    const score = isVideoFormat ? data.average_score : (data.score || 0);
                    const weight = isVideoFormat ? data.weight : 0.2; // default weight for images
                    const contribution = isVideoFormat ? data.contribution : (score * weight * 100);
                    
                    return (
                      <div key={method} className="method-card">
                        <div className="method-header">
                          <span className="method-name">
                            {method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                          <span className="method-weight">{(weight * 100).toFixed(0)}% weight</span>
                        </div>
                        <div className="method-score-bar">
                          <div 
                            className="method-score-fill"
                            style={{ 
                              width: `${score * 100}%`,
                              backgroundColor: score > 0.6 ? '#dc2626' : score > 0.4 ? '#f59e0b' : '#22c55e'
                            }}
                          />
                        </div>
                        <div className="method-stats">
                          <span>Score: {score.toFixed(3)}</span>
                          <span>Contribution: {contribution.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suspicious Segments (Video Only) */}
            {results.suspicious_segments && results.suspicious_segments.length > 0 && (
              <div className="suspicious-segments">
                <h3>
                  <AlertTriangle size={20} />
                  Suspicious Segments Detected
                </h3>
                <div className="segments-list">
                  {results.suspicious_segments.map((segment, idx) => (
                    <div key={idx} className="segment-item">
                      <div className="segment-info">
                        <span className="segment-time">
                          <Clock size={16} />
                          {segment.timestamp.toFixed(2)}s (Frame {segment.frame})
                        </span>
                        <span 
                          className="segment-confidence"
                          style={{ 
                            backgroundColor: segment.confidence > 0.75 ? '#dc2626' : '#f59e0b'
                          }}
                        >
                          {(segment.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Method Details (Image) */}
            {results.method_breakdown && !results.statistics && (
              <div className="raw-details">
                <h3>Detailed Analysis</h3>
                <div className="details-grid">
                  {Object.entries(results.method_breakdown).map(([method, data]) => (
                    <div key={method} className="detail-card">
                      <h4>{method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h4>
                      <div className="detail-info">
                        <div className={`detail-badge ${data.suspicious ? 'suspicious' : 'normal'}`}>
                          {data.suspicious ? 'SUSPICIOUS' : 'NORMAL'}
                        </div>
                        <p className="detail-score">Score: {data.score ? data.score.toFixed(3) : 'N/A'}</p>
                        <p className="detail-text">{data.details || 'No details available'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2025 Deepfake Detection Platform | Advanced Media Authentication System</p>
          <p className="footer-note">Powered by Multi-Method AI Analysis</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
