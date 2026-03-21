import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import AtsScoreRing from '../components/AtsScoreRing';
import ScoreBreakdown from '../components/ScoreBreakdown';
import SkillsPanel from '../components/SkillsPanel';
import CourseCard from '../components/CourseCard';
import JobCard from '../components/JobCard';
import { formatDate } from '../utils/helpers';
import { Map, User, Briefcase, BookOpen, Target, Calendar, Mail, Phone, MapPin, ArrowRight, AlertCircle } from 'lucide-react';

const Tab = ({ label, active, onClick, icon: Icon }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', borderRadius: 'var(--radius-md)',
    background: active ? 'var(--accent-primary)' : '#fff',
    border: active ? '1px solid var(--accent-primary)' : '1px solid var(--bg-border)',
    color: active ? '#fff' : 'var(--text-secondary)',
    cursor: 'pointer', fontSize: 13,
    fontFamily: 'var(--font-display)', fontWeight: 600,
    transition: 'var(--transition)', whiteSpace: 'nowrap',
    boxShadow: active ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
  }}>
    <Icon size={13} /> {label}
  </button>
);

export default function ResumeAnalysis() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.get(`/resume/${id}`)
      .then(res => setResume(res.data.resume))
      .catch(err => toast.error(err.response?.data?.message || 'Failed to load analysis'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 14px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading analysis...</p>
      </div>
    </div>
  );

  if (!resume) return (
    <div className="page" style={{ textAlign: 'center', padding: '100px 24px', background: 'var(--bg-secondary)' }}>
      <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px', opacity: 0.5 }} />
      <p style={{ color: 'var(--text-muted)' }}>Resume not found</p>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
  ];

  return (
    <div className="page" style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px 64px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <p className="section-label">Analysis Report</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
                {resume.personalInfo?.name || resume.originalName}
              </h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {resume.targetRole && (
                  <span style={{ fontSize: 13, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Target size={12} /> {resume.targetRole}
                  </span>
                )}
                <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} /> Analyzed {formatDate(resume.analyzedAt)}
                </span>
              </div>
            </div>
            <Link to={`/roadmap/${resume._id}`} className="btn btn-primary" style={{ padding: '9px 18px' }}>
              <Map size={14} /> View Career Roadmap <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="scroll-x" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6, minWidth: 'max-content' }}>
            {tabs.map(t => <Tab key={t.id} label={t.label} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} icon={t.icon} />)}
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 20 }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 28 }}>
                <AtsScoreRing score={resume.atsScore?.overall || 0} size={150} />
                <div className="divider" style={{ width: '100%', margin: '20px 0 14px' }} />
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['Formatting', resume.atsScore?.formatting], ['Keywords', resume.atsScore?.keywords], ['Sections', resume.atsScore?.sections], ['Readability', resume.atsScore?.readability]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{val || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 18 }}>ATS Analysis</h3>
                <ScoreBreakdown atsScore={resume.atsScore} />
              </div>
            </div>
            <div className="grid-2">
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <User size={15} color="var(--accent-primary)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Personal Info</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {resume.personalInfo?.email && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Mail size={12} color="var(--text-muted)" /><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{resume.personalInfo.email}</span></div>}
                  {resume.personalInfo?.phone && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Phone size={12} color="var(--text-muted)" /><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{resume.personalInfo.phone}</span></div>}
                  {resume.personalInfo?.location && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MapPin size={12} color="var(--text-muted)" /><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{resume.personalInfo.location}</span></div>}
                  {resume.personalInfo?.summary && <div style={{ marginTop: 6, padding: '10px 12px', background: 'rgba(37,99,235,0.04)', borderRadius: 8, borderLeft: '3px solid var(--accent-primary)' }}><p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{resume.personalInfo.summary}</p></div>}
                </div>
              </div>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Briefcase size={15} color="var(--accent-purple)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Experience</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {resume.experience?.slice(0, 3).map((exp, i) => (
                    <div key={i} style={{ paddingLeft: 12, borderLeft: '2px solid var(--bg-border)' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{exp.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--accent-primary)' }}>{exp.company}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{exp.duration}</div>
                    </div>
                  ))}
                  {!resume.experience?.length && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No experience extracted</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, marginBottom: 22 }}>Skills Analysis</h3>
            <SkillsPanel skillsAnalysis={resume.skillsAnalysis} />
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, marginBottom: 4 }}>Recommended Courses</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Personalized to close your skill gaps{resume.targetRole ? ` for ${resume.targetRole}` : ''}</p>
            </div>
            <div className="grid-3">
              {resume.courseRecommendations?.map((c, i) => <CourseCard key={i} course={c} />)}
              {!resume.courseRecommendations?.length && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>No course recommendations available</p>}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, marginBottom: 4 }}>Matched Job Roles</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sorted by match score — based on your current skills</p>
              </div>
              <Link to="/jobs" className="btn btn-ghost" style={{ fontSize: 12 }}><Briefcase size={12} /> Browse All Jobs</Link>
            </div>
            <div className="grid-2">
              {resume.jobRoles?.map((job, i) => <JobCard key={i} job={job} />)}
              {!resume.jobRoles?.length && <p style={{ color: 'var(--text-muted)' }}>No job matches found</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
