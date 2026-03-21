import { getScoreColor } from '../utils/helpers';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';

const ScoreMeter = ({ label, value }) => {
  const color = getScoreColor(value);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{value}/100</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
      </div>
    </div>
  );
};

const FeedbackList = ({ items, type }) => {
  const config = {
    strengths: { icon: CheckCircle, color: 'var(--accent-green)', label: 'Strengths' },
    improvements: { icon: AlertTriangle, color: 'var(--accent-amber)', label: 'Improvements' },
    critical: { icon: XCircle, color: 'var(--accent-red)', label: 'Critical Issues' },
  };
  const { icon: Icon, color, label } = config[type];
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
          {label.toUpperCase()}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            background: `${color}08`, border: `1px solid ${color}15`,
          }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, marginTop: 6, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ScoreBreakdown({ atsScore }) {
  if (!atsScore) return null;
  return (
    <div>
      {/* Score meters */}
      <div style={{ marginBottom: 24 }}>
        <p className="section-label" style={{ marginBottom: 14 }}>Score Breakdown</p>
        <ScoreMeter label="Formatting" value={atsScore.formatting} />
        <ScoreMeter label="Keywords Match" value={atsScore.keywords} />
        <ScoreMeter label="Sections Completeness" value={atsScore.sections} />
        <ScoreMeter label="Readability" value={atsScore.readability} />
      </div>

      {/* Feedback */}
      {atsScore.breakdown && (
        <div>
          <FeedbackList items={atsScore.breakdown.strengths} type="strengths" />
          <FeedbackList items={atsScore.breakdown.improvements} type="improvements" />
          <FeedbackList items={atsScore.breakdown.critical} type="critical" />
        </div>
      )}
    </div>
  );
}
