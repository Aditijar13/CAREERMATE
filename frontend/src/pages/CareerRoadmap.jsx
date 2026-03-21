import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { getPhaseStatusColor } from '../utils/helpers';
import { CheckCircle, Clock, Circle, ChevronDown, ChevronUp, BookOpen, Target, Flag, Zap, AlertCircle } from 'lucide-react';

const statusIcon = { completed: CheckCircle, 'in-progress': Clock, pending: Circle };

const PhaseCard = ({ phase, index, total, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const color = getPhaseStatusColor(phase.status);
  const Icon = statusIcon[phase.status] || Circle;

  return (
    <div style={{ position: 'relative', paddingLeft: 52, paddingBottom: 20 }}>
      {index < total - 1 && (
        <div style={{ position: 'absolute', left: 17, top: 38, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${color}60, var(--bg-border))` }} />
      )}
      <div style={{ position: 'absolute', left: 0, top: 12, width: 34, height: 34, borderRadius: '50%', background: `${color}12`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, background: '#fff' }}>
        <Icon size={15} color={color} />
      </div>
      <div className="card" style={{ borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', gap: 12 }} onClick={() => setExpanded(p => !p)}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${color}10`, color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>PHASE {phase.phase}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{phase.duration}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{phase.title}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <select
              value={phase.status}
              onChange={e => { e.stopPropagation(); onUpdateStatus(index, e.target.value); }}
              onClick={e => e.stopPropagation()}
              style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: `${color}10`, border: `1px solid ${color}25`, color, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {expanded ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
          </div>
        </div>
        {expanded && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {phase.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{phase.description}</p>}
            <div className="grid-3" style={{ gap: 14 }}>
              {phase.skills?.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}><Zap size={12} color="var(--accent-primary)" /><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>SKILLS</span></div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {phase.skills.map((s, i) => <span key={i} className="tag tag-accent" style={{ fontSize: 11 }}>{s}</span>)}
                  </div>
                </div>
              )}
              {phase.milestones?.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}><Flag size={12} color="var(--accent-green)" /><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-display)' }}>MILESTONES</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {phase.milestones.map((m, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-green)', marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {phase.resources?.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}><BookOpen size={12} color="var(--accent-amber)" /><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-display)' }}>RESOURCES</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {phase.resources.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-amber)', marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CareerRoadmap() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/resume/${id}`)
      .then(res => setResume(res.data.resume))
      .catch(err => toast.error(err.response?.data?.message || 'Failed to load roadmap'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (phaseIndex, status) => {
    try {
      const res = await api.put(`/resume/${id}/roadmap/${phaseIndex}`, { status });
      setResume(res.data.resume);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  );

  if (!resume) return (
    <div className="page" style={{ textAlign: 'center', padding: '100px 24px', background: 'var(--bg-secondary)' }}>
      <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.5 }} />
      <p style={{ color: 'var(--text-muted)' }}>Roadmap not found</p>
    </div>
  );

  const roadmap = resume.careerRoadmap || [];
  const completed = roadmap.filter(p => p.status === 'completed').length;
  const inProgress = roadmap.filter(p => p.status === 'in-progress').length;
  const progress = roadmap.length > 0 ? Math.round((completed / roadmap.length) * 100) : 0;

  return (
    <div className="page" style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px 64px', maxWidth: 860 }}>
        <div style={{ marginBottom: 28 }}>
          <p className="section-label">Career Planning</p>
          <h1 style={{ fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Your Career Roadmap</h1>
          {resume.targetRole && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={13} color="var(--accent-primary)" />
              Towards: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{resume.targetRole}</span>
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="card" style={{ marginBottom: 36, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>OVERALL PROGRESS</div>
              <div style={{ fontSize: 34, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1 }}>{progress}%</div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[['Completed', completed, 'var(--accent-green)'], ['In Progress', inProgress, 'var(--accent-amber)'], ['Pending', roadmap.length - completed - inProgress, 'var(--text-muted)']].map(([label, val, color]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #60a5fa, var(--accent-primary))' }} />
            </div>
          </div>
        </div>

        {roadmap.length > 0
          ? roadmap.map((phase, i) => <PhaseCard key={i} phase={phase} index={i} total={roadmap.length} onUpdateStatus={handleUpdateStatus} />)
          : (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <Target size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.4 }} />
              <p style={{ color: 'var(--text-muted)' }}>No roadmap available</p>
            </div>
          )}
      </div>
    </div>
  );
}
