import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    targetRole: '', currentRole: '', yearsOfExperience: 0,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Please enter your name');
    if (!form.email.trim()) return toast.error('Please enter your email');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to CareerMate 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '100px 24px 40px',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Logo size={44} showText={true} />
          </div>
          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.03em' }}>
            Start your journey
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Create your free CareerMate account</p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--bg-border)',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2">
              <div>
                <label>Full Name *</label>
                <input className="input" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label>Email *</label>
                <input className="input" type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} required />
              </div>
            </div>

            <div>
              <label>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input" type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters" value={form.password} onChange={set('password')}
                  required style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginTop: 4 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginBottom: 12 }}>
                OPTIONAL — IMPROVES AI RECOMMENDATIONS
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="grid-2">
                  <div>
                    <label>Current Role</label>
                    <input className="input" placeholder="e.g. Junior Developer" value={form.currentRole} onChange={set('currentRole')} />
                  </div>
                  <div>
                    <label>Target Role</label>
                    <input className="input" placeholder="e.g. Senior Engineer" value={form.targetRole} onChange={set('targetRole')} />
                  </div>
                </div>
                <div>
                  <label>Years of Experience</label>
                  <input className="input" type="number" min={0} max={50} placeholder="0" value={form.yearsOfExperience} onChange={set('yearsOfExperience')} />
                </div>
              </div>
            </div>

            <button
              type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, marginTop: 4 }}
            >
              {loading
                ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating account...</>
                : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
