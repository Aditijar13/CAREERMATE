import { CheckCircle, XCircle, TrendingUp, Sparkles } from 'lucide-react';

const SkillChip = ({ skill, type }) => {
  const styles = {
    extracted: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', color: 'var(--accent-primary)' },
    missing: { bg: 'rgba(255,82,82,0.08)', border: 'rgba(255,82,82,0.2)', color: 'var(--accent-red)' },
    recommended: { bg: 'rgba(0,230,118,0.08)', border: 'rgba(0,230,118,0.2)', color: 'var(--accent-green)' },
    trending: { bg: 'rgba(179,136,255,0.08)', border: 'rgba(179,136,255,0.2)', color: 'var(--accent-purple)' },
  };
  const s = styles[type];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 500,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      margin: '3px',
    }}>
      {skill}
    </span>
  );
};

const Section = ({ title, icon: Icon, skills, type, color, emptyMsg }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <Icon size={16} color={color} />
      <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{title}</span>
      <span style={{
        fontSize: 11, padding: '1px 7px', borderRadius: 20,
        background: `${color}20`, color,
        fontFamily: 'var(--font-mono)',
      }}>{skills?.length || 0}</span>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {skills?.length > 0
        ? skills.map((s, i) => <SkillChip key={i} skill={s} type={type} />)
        : <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{emptyMsg}</span>}
    </div>
  </div>
);

export default function SkillsPanel({ skillsAnalysis }) {
  if (!skillsAnalysis) return null;
  return (
    <div>
      <Section
        title="Extracted Skills"
        icon={CheckCircle}
        skills={skillsAnalysis.extracted}
        type="extracted"
        color="var(--accent-primary)"
        emptyMsg="No skills detected"
      />
      <Section
        title="Missing Skills"
        icon={XCircle}
        skills={skillsAnalysis.missing}
        type="missing"
        color="var(--accent-red)"
        emptyMsg="All key skills present"
      />
      <Section
        title="Recommended to Learn"
        icon={Sparkles}
        skills={skillsAnalysis.recommended}
        type="recommended"
        color="var(--accent-green)"
        emptyMsg="No recommendations"
      />
      <Section
        title="Trending in Market"
        icon={TrendingUp}
        skills={skillsAnalysis.trending}
        type="trending"
        color="var(--accent-purple)"
        emptyMsg="No trending data"
      />
    </div>
  );
}
