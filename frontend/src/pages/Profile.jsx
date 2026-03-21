import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, Save, Briefcase, Target, Clock, Mail } from 'lucide-react';
import Logo from '../components/Logo';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    currentRole: user?.currentRole || '',
    yearsOfExperience: user?.yearsOfExperience || 0,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page" style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px 64px', maxWidth: 640 }}>
        <div style={{ marginBottom: 28 }}>
          <p className="section-label">Account</p>
          <h1 style={{ fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em' }}>Your Profile</h1>
        </div>

        {/* Avatar */}
        <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, padding: '22px 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{user?.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <Mail size={12} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user?.email}</span>
            </div>
            {user?.targetRole && (
              <span className="tag tag-accent" style={{ marginTop: 8, fontSize: 11 }}>
                <Target size={10} /> {user.targetRole}
              </span>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 22 }}>Edit Profile</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label><User size={11} style={{ display: 'inline', marginRight: 4 }} />Full Name *</label>
              <input className="input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="grid-2">
              <div>
                <label><Briefcase size={11} style={{ display: 'inline', marginRight: 4 }} />Current Role</label>
                <input className="input" placeholder="e.g. Junior Developer" value={form.currentRole} onChange={set('currentRole')} />
              </div>
              <div>
                <label><Target size={11} style={{ display: 'inline', marginRight: 4 }} />Target Role</label>
                <input className="input" placeholder="e.g. Senior Engineer" value={form.targetRole} onChange={set('targetRole')} />
              </div>
            </div>
            <div>
              <label><Clock size={11} style={{ display: 'inline', marginRight: 4 }} />Years of Experience</label>
              <input className="input" type="number" min={0} max={50} value={form.yearsOfExperience} onChange={set('yearsOfExperience')} />
            </div>
            <div className="divider" style={{ margin: '4px 0' }} />
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', padding: '10px 22px' }}>
              {saving ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Saving...</> : <><Save size={14} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="card" style={{ padding: '18px 22px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text-secondary)' }}>Account Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Email</span>
              <span style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Account ID</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
