export default function Logo({ size = 32, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      {/* SVG Logo */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#2563eb"/>
        {/* Briefcase body */}
        <rect x="8" y="16" width="24" height="16" rx="3" fill="white" opacity="0.95"/>
        {/* Briefcase handle */}
        <path d="M15 16V13C15 11.9 15.9 11 17 11H23C24.1 11 25 11.9 25 13V16" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Center line */}
        <rect x="8" y="22" width="24" height="2" fill="#2563eb" opacity="0.3"/>
        {/* Clasp */}
        <rect x="18" y="20" width="4" height="4" rx="1" fill="#2563eb"/>
        {/* Sparkle top right */}
        <circle cx="31" cy="9" r="2" fill="#93c5fd"/>
        <path d="M31 6V7M31 11V12M28 9H29M33 9H34" stroke="#bfdbfe" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      {showText && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: size * 0.56,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
        }}>
          Career<span style={{ color: 'var(--accent-primary)' }}>Mate</span>
        </span>
      )}
    </div>
  );
}
