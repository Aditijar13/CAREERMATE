import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Upload, Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Resume', icon: Upload },
  { to: '/jobs', label: 'Job Board', icon: Briefcase },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--bg-border)',
      height: 64,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
          <Logo size={34} showText={true} />
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', fontSize: 13,
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(37,99,235,0.15)' : '1px solid transparent',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}}
                >
                  <Icon size={14} />
                  <span className="hide-mobile">{label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--bg-border)',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary), #60a5fa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                  fontFamily: 'var(--font-display)',
                }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }} className="hide-mobile">
                  {user.name?.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 13px', borderRadius: 'var(--radius-md)',
                  background: 'transparent', border: '1px solid var(--bg-border)',
                  color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13,
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-red)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'; e.currentTarget.style.background = 'rgba(220,38,38,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <LogOut size={14} />
                <span className="hide-mobile">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '7px 16px', fontSize: 13 }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .hide-mobile { display: none; } }`}</style>
    </nav>
  );
}
