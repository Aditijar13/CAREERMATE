import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDate, formatFileSize, getScoreColor } from '../utils/helpers';
import { Upload, FileText, TrendingUp, Briefcase, Trash2, Eye, Clock, Target, AlertCircle } from 'lucide-react';

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    <div style={{
      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
      background: `${color}10`, border: `1px solid ${color}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{sub}</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, statsRes] = await Promise.all([
          api.get('/resume'),
          api.get('/career/stats'),
        ]);
        setResumes(resumeRes.data.resumes || []);
        setStats(statsRes.data.stats);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume and its analysis?')) return;
    setDeleting(id);
    try {
      await api.delete(`/resume/${id}`);
      setResumes(prev => prev.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: { color: 'var(--accent-green)', label: 'Analyzed' },
      analyzing: { color: 'var(--accent-amber)', label: 'Analyzing...' },
      failed: { color: 'var(--accent-red)', label: 'Failed' },
      pending: { color: 'var(--text-muted)', label: 'Pending' },
    };
    const { color, label } = map[status] || map.pending;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 11, padding: '3px 10px', borderRadius: 20,
        background: `${color}10`, border: `1px solid ${color}25`, color,
        fontFamily: 'var(--font-mono)',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
        {label}
      </span>
    );
  };

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 14px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <p className="section-label">Dashboard</p>
            <h1 style={{ fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            {user?.targetRole && (
              <p style={{ color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <Target size={13} color="var(--accent-primary)" />
                Targeting: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{user.targetRole}</span>
              </p>
            )}
          </div>
          <Link to="/upload" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <Upload size={15} /> Upload Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <StatCard label="Resumes Analyzed" value={stats?.totalResumes || 0} icon={FileText} color="var(--accent-primary)" />
          <StatCard label="Avg ATS Score" value={stats?.avgAtsScore ? `${stats.avgAtsScore}` : '—'} icon={TrendingUp} color="var(--accent-green)" sub={stats?.avgAtsScore >= 70 ? 'Above benchmark' : stats?.avgAtsScore ? 'Needs improvement' : ''} />
          <StatCard label="Skills Identified" value={stats?.topSkills?.length || 0} icon={Target} color="var(--accent-purple)" />
          <StatCard label="Latest ATS" value={stats?.latestAnalysis?.atsScore ? `${stats.latestAnalysis.atsScore}` : '—'} icon={Briefcase} color="var(--accent-amber)" sub={stats?.latestAnalysis?.targetRole} />
        </div>

        {/* Top skills */}
        {stats?.topSkills?.length > 0 && (
          <div className="card" style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text-secondary)' }}>Detected Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {stats.topSkills.map((s, i) => (
                <span key={i} className="tag tag-accent">{s.skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Resumes */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Your Resumes</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{resumes.length} total</span>
          </div>

          {resumes.length === 0 ? (
            <div className="card" style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FileText size={28} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>No resumes yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
                Upload your first resume to get an AI-powered ATS analysis
              </p>
              <Link to="/upload" className="btn btn-primary"><Upload size={15} /> Upload Resume</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {resumes.map(resume => (
                <div key={resume._id} className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={16} color="var(--accent-primary)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                          {resume.originalName || resume.fileName}
                        </span>
                        {getStatusBadge(resume.analysisStatus)}
                      </div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={10} /> {formatDate(resume.createdAt)}
                        </span>
                        {resume.fileSize && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatFileSize(resume.fileSize)}</span>}
                        {resume.targetRole && (
                          <span style={{ fontSize: 12, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Target size={10} /> {resume.targetRole}
                          </span>
                        )}
                      </div>
                    </div>

                    {resume.analysisStatus === 'completed' && resume.atsScore?.overall && (
                      <div style={{ padding: '5px 12px', borderRadius: 8, background: `${getScoreColor(resume.atsScore.overall)}10`, border: `1px solid ${getScoreColor(resume.atsScore.overall)}20`, textAlign: 'center', minWidth: 54 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: getScoreColor(resume.atsScore.overall) }}>
                          {resume.atsScore.overall}
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ATS</div>
                      </div>
                    )}

                    {resume.analysisStatus === 'failed' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent-red)' }}>
                        <AlertCircle size={13} /> Analysis failed
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {resume.analysisStatus === 'completed' && (
                        <Link to={`/resume/${resume._id}`} className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
                          <Eye size={13} /> View
                        </Link>
                      )}
                      <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 10px' }}
                        onClick={() => handleDelete(resume._id)}
                        disabled={deleting === resume._id}
                      >
                        {deleting === resume._id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
