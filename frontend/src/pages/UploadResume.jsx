import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, FileText, X, Zap, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

const steps = [
  { icon: '📄', text: 'Extracting text from resume...' },
  { icon: '🤖', text: 'Running AI analysis...' },
  { icon: '📊', text: 'Calculating ATS score...' },
  { icon: '🎯', text: 'Identifying skill gaps...' },
  { icon: '📚', text: 'Finding course recommendations...' },
  { icon: '💼', text: 'Matching job roles...' },
  { icon: '🗺️', text: 'Generating career roadmap...' },
];

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const onDrop = useCallback((accepted, rejected) => {
    setError(null);
    if (rejected.length > 0) {
      const reason = rejected[0]?.errors?.[0]?.message || 'Invalid file';
      toast.error(`File rejected: ${reason}`);
      return;
    }
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first');
    setUploading(true);
    setError(null);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => prev < steps.length - 1 ? prev + 1 : prev);
    }, 4000);

    const formData = new FormData();
    formData.append('resume', file);
    if (targetRole.trim()) formData.append('targetRole', targetRole.trim());

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(interval);
      toast.success('Resume analyzed successfully!');
      navigate(`/resume/${res.data.resume._id}`);
    } catch (err) {
      clearInterval(interval);
      const msg = err.response?.data?.message || 'Analysis failed. Please try again.';
      setError(msg);
      toast.error(msg);
      setUploading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="page" style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px 64px', maxWidth: 680 }}>
        <div style={{ marginBottom: 32 }}>
          <p className="section-label">Resume Analysis</p>
          <h1 style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Upload Your Resume
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Get a comprehensive AI analysis including ATS score, skill gaps, job matches and a personalized career roadmap.
          </p>
        </div>

        {!uploading ? (
          <>
            {/* Error */}
            {error && (
              <div className="alert alert-error" style={{ marginBottom: 20 }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>{error}</div>
              </div>
            )}

            {/* Target role */}
            <div className="card" style={{ marginBottom: 16 }}>
              <label><Target size={11} style={{ display: 'inline', marginRight: 4 }} />Target Role (Recommended)</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Senior Software Engineer, Data Scientist, Product Manager..."
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
              />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                Providing a target role significantly improves skill gap analysis and job recommendations.
              </p>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? 'var(--accent-primary)' : file ? 'var(--accent-green)' : 'var(--bg-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '48px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'rgba(37,99,235,0.04)' : file ? 'rgba(22,163,74,0.03)' : '#fff',
                transition: 'all 0.2s ease',
                marginBottom: 16,
              }}
            >
              <input {...getInputProps()} />
              {file ? (
                <div>
                  <CheckCircle size={44} color="var(--accent-green)" style={{ margin: '0 auto 14px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                    <FileText size={16} color="var(--accent-green)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{file.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatFileSize(file.size)}</span>
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null); setError(null); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '14px auto 0', background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: 13 }}
                  >
                    <X size={13} /> Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: isDragActive ? 'rgba(37,99,235,0.1)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Upload size={24} color={isDragActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 6, color: isDragActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 14 }}>or click to browse</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <span className="tag tag-accent">PDF</span>
                    <span className="tag">TXT</span>
                    <span className="tag">Max 10MB</span>
                  </div>
                </div>
              )}
            </div>

            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13 }}>Use a PDF for best results. Make sure it uses standard formatting without text boxes or tables.</span>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!file}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
            >
              <Zap size={16} fill="currentColor" /> Analyze with AI
            </button>
          </>
        ) : (
          <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px', background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={30} color="var(--accent-primary)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Analyzing Your Resume</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>This takes about 20-30 seconds. Please don't close this tab.</p>
            <div style={{ maxWidth: 360, margin: '0 auto', textAlign: 'left' }}>
              {steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 14px', borderRadius: 8, marginBottom: 5,
                  background: i === currentStep ? 'rgba(37,99,235,0.06)' : i < currentStep ? 'rgba(22,163,74,0.04)' : 'transparent',
                  border: `1px solid ${i === currentStep ? 'rgba(37,99,235,0.15)' : i < currentStep ? 'rgba(22,163,74,0.1)' : 'transparent'}`,
                  transition: 'all 0.3s ease',
                }}>
                  <span style={{ fontSize: 16 }}>{i < currentStep ? '✅' : step.icon}</span>
                  <span style={{ fontSize: 13, color: i === currentStep ? 'var(--accent-primary)' : i < currentStep ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: i === currentStep ? 600 : 400 }}>
                    {step.text}
                  </span>
                  {i === currentStep && <div className="spinner" style={{ width: 13, height: 13, marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
