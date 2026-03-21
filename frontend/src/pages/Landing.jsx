import { Link } from 'react-router-dom';
import { FileSearch, Map, Briefcase, TrendingUp, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import Logo from '../components/Logo';

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="card" style={{ padding: 28 }}>
    <div style={{
      width: 46, height: 46, borderRadius: 12,
      background: `${color}12`, border: `1px solid ${color}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    }}>
      <Icon size={22} color={color} />
    </div>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
      {title}
    </h3>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div style={{ display: 'flex', gap: 16 }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: 'var(--accent-primary)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
    }}>{number}</div>
    <div>
      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</h4>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  </div>
);

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 80,
        background: 'linear-gradient(160deg, #f0f4ff 0%, #ffffff 50%, #f0fdf4 100%)',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          top: '-100px', right: '-100px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          bottom: '-80px', left: '-80px',
          background: 'radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 20, marginBottom: 24,
              background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.18)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                AI-Powered Career Intelligence
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 66px)',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              lineHeight: 1.06, marginBottom: 22, letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
            }}>
              Land your dream job<br />
              with <span style={{ color: 'var(--accent-primary)' }}>AI-powered</span><br />
              career guidance
            </h1>

            <p style={{
              fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7,
              maxWidth: 540, marginBottom: 36,
            }}>
              Upload your resume and get an instant ATS score, skill gap analysis,
              personalized course recommendations, matched jobs, and a step-by-step career roadmap.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 15 }}>
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '13px 28px', fontSize: 15 }}>
                Sign In
              </Link>
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {['ATS Score Analysis', 'Skill Gap Detection', 'Job Matching', 'Career Roadmap'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} color="var(--accent-green)" />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '90px 0', background: '#fff', borderTop: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="section-label">How it works</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.03em' }}>
              From resume to dream job in minutes
            </h2>
          </div>
          <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Step number="1" title="Upload Your Resume" desc="Drag and drop your PDF resume. Our AI extracts and parses all content automatically." />
            <Step number="2" title="Get Your ATS Score" desc="Receive a detailed breakdown of how your resume performs against ATS systems with actionable improvements." />
            <Step number="3" title="Discover Opportunities" desc="Get matched with real jobs, personalized course recommendations, and a custom career roadmap." />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '90px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="section-label">Features</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.03em' }}>
              Everything you need to grow your career
            </h2>
          </div>
          <div className="grid-3">
            <FeatureCard icon={FileSearch} title="ATS Score Analysis" desc="Detailed ATS compatibility breakdown covering formatting, keyword density, sections, and readability — all scored 0-100." color="var(--accent-primary)" />
            <FeatureCard icon={TrendingUp} title="Skill Gap Detection" desc="Know exactly which skills you're missing for your target role, plus what's trending in the job market right now." color="var(--accent-purple)" />
            <FeatureCard icon={FileSearch} title="Course Recommendations" desc="Handpicked courses from Coursera, Udemy, edX, and more — matched precisely to your skill gaps." color="var(--accent-amber)" />
            <FeatureCard icon={Briefcase} title="Job Role Matching" desc="Find roles that match your current skills with real company names, salary ranges, and direct application links." color="var(--accent-green)" />
            <FeatureCard icon={Map} title="Career Roadmap" desc="A personalized 4-phase plan with skills, milestones, timelines, and resources tailored to your goals." color="var(--accent-primary)" />
            <FeatureCard icon={Shield} title="Secure & Private" desc="Your resume data is encrypted and never shared with third parties. Delete your data anytime." color="var(--accent-red)" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: '#fff', borderTop: '1px solid var(--bg-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.03em', marginBottom: 14 }}>
            Ready to accelerate your career?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
            Create your free account and upload your first resume in minutes.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '13px 36px', fontSize: 15 }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '28px 0', borderTop: '1px solid var(--bg-border)', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Logo size={28} showText={true} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © 2025 CareerMate · AI-Powered Career Planning
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
