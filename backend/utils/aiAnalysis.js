const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const callAI = async (prompt, maxTokens = 4000) => {
  try {
    const res = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.6,
    });
    return res.choices[0].message.content;
  } catch (err) {
    if (err.status === 429) throw new Error('AI rate limit reached. Please wait a moment and try again.');
    if (err.status === 401) throw new Error('Invalid AI API key. Please check your GROQ_API_KEY in .env');
    if (err.status === 503) throw new Error('AI service temporarily unavailable. Please try again in a moment.');
    throw new Error(`AI request failed: ${err.message}`);
  }
};

const parseJSON = (raw) => {
  try {
    const cleaned = raw
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON object if model added surrounding text
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response as JSON');
  }
};

// Real companies by role category for job recommendations
const getCompaniesForRole = (role = '') => {
  const r = role.toLowerCase();
  if (r.includes('data') && r.includes('scientist')) return ['Google', 'Meta', 'Netflix', 'Airbnb', 'Spotify', 'Twitter', 'LinkedIn', 'Uber'];
  if (r.includes('data') && r.includes('analyst')) return ['McKinsey', 'Deloitte', 'Accenture', 'PwC', 'EY', 'IBM', 'Microsoft', 'Amazon'];
  if (r.includes('machine learning') || r.includes('ml engineer')) return ['OpenAI', 'Google DeepMind', 'NVIDIA', 'Tesla', 'Apple', 'Amazon', 'Microsoft', 'Meta'];
  if (r.includes('frontend') || r.includes('react') || r.includes('ui')) return ['Shopify', 'Figma', 'Stripe', 'Vercel', 'GitHub', 'Atlassian', 'Canva', 'Webflow'];
  if (r.includes('backend') || r.includes('node') || r.includes('python')) return ['Cloudflare', 'Stripe', 'Twilio', 'MongoDB', 'Redis', 'HashiCorp', 'PagerDuty', 'Datadog'];
  if (r.includes('fullstack') || r.includes('full stack') || r.includes('full-stack')) return ['GitHub', 'GitLab', 'Atlassian', 'HubSpot', 'Notion', 'Linear', 'Supabase', 'Vercel'];
  if (r.includes('devops') || r.includes('sre') || r.includes('cloud')) return ['AWS', 'Google Cloud', 'Microsoft Azure', 'HashiCorp', 'Datadog', 'Cloudflare', 'DigitalOcean', 'Fastly'];
  if (r.includes('product manager') || r.includes('pm')) return ['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft', 'Airbnb', 'Uber', 'Spotify'];
  if (r.includes('ux') || r.includes('designer')) return ['IDEO', 'Figma', 'Adobe', 'Spotify', 'Airbnb', 'Dropbox', 'Notion', 'Canva'];
  if (r.includes('mobile') || r.includes('ios') || r.includes('android')) return ['Apple', 'Google', 'Spotify', 'Duolingo', 'Snap', 'TikTok', 'Discord', 'Robinhood'];
  if (r.includes('security') || r.includes('cybersecurity')) return ['CrowdStrike', 'Palo Alto Networks', 'SentinelOne', 'Okta', 'Cloudflare', 'CyberArk', 'Fortinet', 'Splunk'];
  if (r.includes('marketing')) return ['HubSpot', 'Salesforce', 'Mailchimp', 'Semrush', 'Hootsuite', 'Sprout Social', 'Klaviyo', 'Marketo'];
  return ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Salesforce', 'Adobe'];
};

/**
 * Main resume analysis using Groq (FREE)
 */
const analyzeResume = async (resumeText, targetRole = '') => {
  const companies = getCompaniesForRole(targetRole);

  const prompt = `You are a senior ATS analyst, career coach, and HR professional with 15+ years of experience. Analyze this resume thoroughly.

TARGET ROLE: ${targetRole || 'Identify the most suitable role based on the resume'}

RESUME:
${resumeText}

Return ONLY a valid JSON object — no markdown, no backticks, no explanation. Use this exact structure:

{
  "personalInfo": {
    "name": "full name from resume",
    "email": "email from resume",
    "phone": "phone from resume",
    "location": "location from resume",
    "summary": "professional summary or generated 1-2 sentence summary"
  },
  "experience": [
    { "title": "job title", "company": "company name", "duration": "date range", "description": "key responsibilities" }
  ],
  "education": [
    { "degree": "degree name", "institution": "school name", "year": "year" }
  ],
  "atsScore": {
    "overall": 68,
    "formatting": 72,
    "keywords": 65,
    "sections": 75,
    "readability": 70,
    "breakdown": {
      "strengths": ["Specific strength 1 from the resume", "Specific strength 2", "Specific strength 3"],
      "improvements": ["Specific improvement 1", "Specific improvement 2", "Specific improvement 3"],
      "critical": ["Critical issue 1 if any", "Critical issue 2 if any"]
    }
  },
  "skillsAnalysis": {
    "extracted": ["list all technical and soft skills found in resume"],
    "missing": ["5 important skills missing for the target role"],
    "recommended": ["3 skills that would boost candidacy"],
    "trending": ["3 trending skills in this field in 2025"],
    "proficiencyMap": [
      { "skill": "skill name", "level": "beginner|intermediate|advanced|expert", "inDemand": true }
    ]
  },
  "courseRecommendations": [
    { "title": "Specific real course title", "platform": "Coursera", "url": "https://www.coursera.org/learn/specific-course", "duration": "X hours", "level": "Beginner", "skill": "skill taught" },
    { "title": "Specific real course title", "platform": "Udemy", "url": "https://www.udemy.com/course/specific-course", "duration": "X hours", "level": "Intermediate", "skill": "skill taught" },
    { "title": "Specific real course title", "platform": "YouTube", "url": "https://www.youtube.com/results?search_query=specific+topic", "duration": "5 hours", "level": "Beginner", "skill": "skill taught" },
    { "title": "Specific real course title", "platform": "edX", "url": "https://www.edx.org/learn/specific-topic", "duration": "8 weeks", "level": "Intermediate", "skill": "skill taught" },
    { "title": "Specific real course title", "platform": "LinkedIn Learning", "url": "https://www.linkedin.com/learning/search?keywords=specific+topic", "duration": "4 hours", "level": "Intermediate", "skill": "skill taught" },
    { "title": "Specific real course title", "platform": "FreeCodeCamp", "url": "https://www.freecodecamp.org/learn", "duration": "40 hours", "level": "Beginner", "skill": "skill taught" }
  ],
  "jobRoles": [
    {
      "title": "Most relevant job title for candidate",
      "company": "${companies[0]}",
      "matchScore": 88,
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "missingSkills": ["missing skill 1"],
      "applyUrl": "https://www.linkedin.com/jobs/search/?keywords=job+title+at+${companies[0].replace(/ /g, '+')}",
      "salary": "$X,000 - $Y,000/year",
      "location": "Remote / Hybrid",
      "type": "Full-time"
    },
    {
      "title": "Second most relevant job title",
      "company": "${companies[1]}",
      "matchScore": 78,
      "requiredSkills": ["skill1", "skill2"],
      "missingSkills": ["missing1", "missing2"],
      "applyUrl": "https://www.linkedin.com/jobs/search/?keywords=job+title+at+${companies[1].replace(/ /g, '+')}",
      "salary": "$X,000 - $Y,000/year",
      "location": "On-site",
      "type": "Full-time"
    },
    {
      "title": "Third relevant job title",
      "company": "${companies[2]}",
      "matchScore": 70,
      "requiredSkills": ["skill1", "skill2"],
      "missingSkills": ["missing1", "missing2"],
      "applyUrl": "https://www.indeed.com/jobs?q=job+title+${companies[2].replace(/ /g, '+')}",
      "salary": "$X,000 - $Y,000/year",
      "location": "Remote",
      "type": "Full-time"
    },
    {
      "title": "Fourth relevant job title",
      "company": "${companies[3]}",
      "matchScore": 62,
      "requiredSkills": ["skill1"],
      "missingSkills": ["missing1", "missing2", "missing3"],
      "applyUrl": "https://www.linkedin.com/jobs/search/?keywords=job+title+${companies[3].replace(/ /g, '+')}",
      "salary": "$X,000 - $Y,000/year",
      "location": "Hybrid",
      "type": "Contract"
    },
    {
      "title": "Fifth relevant job title",
      "company": "${companies[4]}",
      "matchScore": 54,
      "requiredSkills": ["skill1"],
      "missingSkills": ["missing1", "missing2", "missing3"],
      "applyUrl": "https://www.indeed.com/jobs?q=job+title+${companies[4].replace(/ /g, '+')}",
      "salary": "$X,000 - $Y,000/year",
      "location": "On-site",
      "type": "Full-time"
    }
  ],
  "careerRoadmap": [
    {
      "phase": 1,
      "title": "Foundation Strengthening",
      "duration": "0-2 months",
      "description": "Address critical gaps and optimize resume for immediate applications",
      "skills": ["skill1", "skill2"],
      "milestones": ["Complete key certification", "Fix resume gaps", "Update LinkedIn profile"],
      "resources": ["Coursera", "LinkedIn", "Resume templates"],
      "status": "pending"
    },
    {
      "phase": 2,
      "title": "Skill Building",
      "duration": "2-5 months",
      "description": "Build missing skills and create portfolio projects",
      "skills": ["skill3", "skill4"],
      "milestones": ["Build 2 portfolio projects", "Earn 1 certification", "Contribute to open source"],
      "resources": ["Udemy", "GitHub", "freeCodeCamp"],
      "status": "pending"
    },
    {
      "phase": 3,
      "title": "Active Job Search",
      "duration": "5-9 months",
      "description": "Apply strategically and build professional network",
      "skills": ["skill5", "skill6"],
      "milestones": ["Apply to 15 companies", "Attend 3 networking events", "Get 2 referrals"],
      "resources": ["LinkedIn", "Glassdoor", "Meetup.com"],
      "status": "pending"
    },
    {
      "phase": 4,
      "title": "Career Growth",
      "duration": "9-18 months",
      "description": "Land target role and focus on performance and advancement",
      "skills": ["skill7", "skill8"],
      "milestones": ["Start in target role", "Complete 90-day plan", "Identify next promotion path"],
      "resources": ["Mentorship programs", "Professional associations", "Industry conferences"],
      "status": "pending"
    }
  ]
}

SCORING RULES:
- Be realistic and honest with scores (most resumes score 45-75, not 90+)
- overall score should reflect actual quality
- Personalize ALL content based specifically on the actual resume provided
- For job companies, use EXACTLY these companies in order: ${companies.slice(0,5).join(', ')}
- Return ONLY the JSON object, nothing else`;

  const raw = await callAI(prompt, 4000);
  return parseJSON(raw);
};

/**
 * Generate career roadmap
 */
const generateCareerRoadmap = async (currentSkills, targetRole, yearsOfExperience) => {
  const prompt = `You are an expert career coach. Create a detailed personalized roadmap.

CURRENT SKILLS: ${currentSkills.length > 0 ? currentSkills.join(', ') : 'Not specified'}
TARGET ROLE: ${targetRole}
YEARS OF EXPERIENCE: ${yearsOfExperience}

Return ONLY a valid JSON object — no markdown or extra text:
{
  "roadmap": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "X-Y months",
      "description": "What to focus on in this phase",
      "skills": ["skill1", "skill2"],
      "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"],
      "resources": ["Resource 1", "Resource 2"],
      "status": "pending"
    }
  ],
  "timelineTotal": "X months",
  "successMetrics": ["Metric 1", "Metric 2", "Metric 3"],
  "salaryProgression": [
    { "phase": 1, "role": "Entry level title", "salary": "$X,000 - $Y,000" },
    { "phase": 2, "role": "Mid level title", "salary": "$X,000 - $Y,000" },
    { "phase": 3, "role": "Senior level title", "salary": "$X,000 - $Y,000" }
  ]
}
Exactly 4 phases. Return ONLY the JSON.`;

  const raw = await callAI(prompt, 2000);
  return parseJSON(raw);
};

/**
 * Job recommendations with real companies
 */
const getJobRecommendations = async (skills, targetRole, location = 'Remote') => {
  const companies = getCompaniesForRole(targetRole);

  const prompt = `You are a job placement expert. Recommend real job opportunities.

CANDIDATE SKILLS: ${skills.length > 0 ? skills.join(', ') : 'General skills'}
TARGET ROLE: ${targetRole || 'Software Engineer'}
PREFERRED LOCATION: ${location}
USE THESE REAL COMPANIES: ${companies.join(', ')}

Return ONLY a valid JSON object — no markdown or extra text:
{
  "jobs": [
    {
      "title": "Specific job title",
      "company": "One of the companies listed above",
      "matchScore": 90,
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "missingSkills": ["gap1"],
      "applyUrl": "https://www.linkedin.com/jobs/search/?keywords=job+title",
      "salary": "$X,000 - $Y,000/year",
      "location": "Remote / City / Hybrid",
      "type": "Full-time",
      "description": "2-sentence role description",
      "postedDate": "X days ago"
    }
  ]
}
Provide exactly 8 jobs using the real companies listed. Sort by matchScore descending. Return ONLY the JSON.`;

  const raw = await callAI(prompt, 2000);
  return parseJSON(raw);
};

module.exports = { analyzeResume, generateCareerRoadmap, getJobRecommendations };
