import { ExternalLink, MapPin, DollarSign, Briefcase, Building2 } from 'lucide-react';
import { getScoreColor } from '../utils/helpers';

export default function JobCard({ job }) {
  const color = getScoreColor(job.matchScore);
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <h4 style={{ fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{job.title}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Building2 size={12} /> {job.company}
          </div>
        </div>
        <div style={{ padding: '5px 10px', borderRadius: 8, background: `${color}10`, border: `1px solid ${color}20`, textAlign: 'center', minWidth: 54, flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color, fontFamily: 'var(--font-display)', lineHeight: 1, display: 'block' }}>{job.matchScore}%</span>
          <span style={{ fontSize: 9, color, fontFamily: 'var(--font-mono)' }}>MATCH</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}><MapPin size={11} />{job.location}</span>}
        {job.type && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}><Briefcase size={11} />{job.type}</span>}
        {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}><DollarSign size={11} />{job.salary}</span>}
      </div>

      {job.requiredSkills?.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 5, letterSpacing: '0.05em' }}>REQUIRED SKILLS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {job.requiredSkills.map((s, i) => <span key={i} className="tag tag-accent" style={{ fontSize: 11 }}>{s}</span>)}
          </div>
        </div>
      )}

      {job.missingSkills?.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 5, letterSpacing: '0.05em' }}>SKILL GAPS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {job.missingSkills.map((s, i) => <span key={i} className="tag tag-red" style={{ fontSize: 11 }}>{s}</span>)}
          </div>
        </div>
      )}

      <a href={job.applyUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 13, padding: '9px 14px', marginTop: 'auto' }}>
        <ExternalLink size={13} /> Apply Now
      </a>
    </div>
  );
}
