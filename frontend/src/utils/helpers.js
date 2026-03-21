export const getScoreColor = (score) => {
  if (score >= 75) return 'var(--accent-green)';
  if (score >= 50) return 'var(--accent-amber)';
  return 'var(--accent-red)';
};

export const getScoreClass = (score) => {
  if (score >= 75) return 'score-high';
  if (score >= 50) return 'score-medium';
  return 'score-low';
};

export const getScoreLabel = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const getPlatformColor = (platform) => {
  const colors = {
    'Coursera': '#0056D2',
    'Udemy': '#A435F0',
    'edX': '#02262B',
    'LinkedIn Learning': '#0A66C2',
    'Pluralsight': '#F15B2A',
    'YouTube': '#FF0000',
    'FreeCodeCamp': '#0A0A23',
  };
  return colors[platform] || 'var(--accent-primary)';
};

export const getPhaseStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'var(--accent-green)';
    case 'in-progress': return 'var(--accent-amber)';
    default: return 'var(--text-muted)';
  }
};

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.substring(0, n) + '…' : str;
