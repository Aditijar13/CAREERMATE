import { ExternalLink, Clock, BarChart2, BookOpen } from 'lucide-react';
import { getPlatformColor } from '../utils/helpers';

const platformIcons = {
  'Coursera': '🎓', 'Udemy': '🎯', 'edX': '🏛️',
  'LinkedIn Learning': '💼', 'Pluralsight': '🔷',
  'YouTube': '▶️', 'FreeCodeCamp': '🔥',
};

const levelColor = {
  'Beginner': 'var(--accent-green)',
  'Intermediate': 'var(--accent-amber)',
  'Advanced': 'var(--accent-red)',
};

export default function CourseCard({ course }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Platform badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 20,
          background: `${getPlatformColor(course.platform)}20`,
          color: getPlatformColor(course.platform),
          fontFamily: 'var(--font-mono)',
          border: `1px solid ${getPlatformColor(course.platform)}40`,
        }}>
          {platformIcons[course.platform] || '📚'} {course.platform}
        </span>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 20,
          background: `${levelColor[course.level]}15`,
          color: levelColor[course.level] || 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {course.level}
        </span>
      </div>

      {/* Title */}
      <h4 style={{
        fontSize: 14, fontFamily: 'var(--font-display)',
        fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4,
      }}>
        {course.title}
      </h4>

      {/* Skill tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <BookOpen size={12} color="var(--accent-primary)" />
        <span style={{ fontSize: 12, color: 'var(--accent-primary)' }}>{course.skill}</span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {course.duration && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {course.duration}
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href={course.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost"
        style={{ fontSize: 12, padding: '8px 14px', marginTop: 'auto' }}
      >
        <ExternalLink size={12} />
        View Course
      </a>
    </div>
  );
}
