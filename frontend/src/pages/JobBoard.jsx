import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import JobCard from '../components/JobCard';
import { Search, MapPin, Briefcase, Zap, Filter, AlertCircle } from 'lucide-react';

export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    targetRole: user?.targetRole || '',
    location: 'Remote',
    skills: '',
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!form.targetRole.trim()) return toast.error('Please enter a target role');
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const res = await api.post('/career/jobs', {
        targetRole: form.targetRole.trim(),
        location: form.location.trim(),
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      });
      setJobs(res.data.jobs || []);
      if ((res.data.jobs || []).length === 0) toast('No jobs found. Try a different search term.', { icon: '🔍' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Job search failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.targetRole) handleSearch();
  }, []);

  return (
    <div className="page" style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px 64px' }}>
        <div style={{ marginBottom: 28 }}>
          <p className="section-label">Job Board</p>
          <h1 style={{ fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            AI-Matched Jobs
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Find roles matched to your skills at real companies with direct application links
          </p>
        </div>

        {/* Search form */}
        <div className="card" style={{ marginBottom: 28, padding: '22px 24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label><Briefcase size={11} style={{ display: 'inline', marginRight: 4 }} />Target Role *</label>
              <input className="input" placeholder="e.g. Software Engineer, Data Analyst..." value={form.targetRole} onChange={e => setForm(p => ({ ...p, targetRole: e.target.value }))} required />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label><MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />Location</label>
              <input className="input" placeholder="Remote, New York..." value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div style={{ flex: '2 1 260px' }}>
              <label><Filter size={11} style={{ display: 'inline', marginRight: 4 }} />Your Skills (comma-separated)</label>
              <input className="input" placeholder="React, Python, SQL..." value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '11px 22px', flexShrink: 0 }}>
              {loading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Searching...</> : <><Zap size={14} fill="currentColor" /> Find Jobs</>}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 14px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Finding the best job matches for you...</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700 }}>
                {jobs.length} Jobs Found
              </h2>
              {form.targetRole && (
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  For: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{form.targetRole}</span>
                </span>
              )}
            </div>
            {jobs.length > 0 ? (
              <div className="grid-2">
                {jobs.map((job, i) => <JobCard key={i} job={job} />)}
              </div>
            ) : (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Search size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.5 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, color: 'var(--text-secondary)' }}>No results found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Try a different role or broader location</p>
              </div>
            )}
          </>
        )}

        {!loading && !hasSearched && (
          <div className="card" style={{ padding: '70px 20px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Briefcase size={28} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 8 }}>Ready to find your next role?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Enter your target role above to get AI-matched job opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}
