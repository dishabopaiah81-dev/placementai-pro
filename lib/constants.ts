export const PASTEL_COLORS = {
  pink: '#FFD1DC',
  blue: '#D4E6F1',
  lavender: '#E8DFF5',
  mint: '#B5EAD7',
  cream: '#FFF8F0',
};

export const GRADIENTS = {
  primary: 'from-pink-400 via-purple-400 to-blue-400',
  secondary: 'from-pink-soft via-lavender-soft to-blue-soft',
  success: 'from-mint via-teal-300 to-cyan-300',
  warm: 'from-orange-200 via-pink-200 to-purple-200',
};

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Resume', href: '/resume', icon: 'FileText' },
  { name: 'Skill Analysis', href: '/skill-analysis', icon: 'BarChart3' },
  { name: 'Learning Roadmap', href: '/roadmap', icon: 'Map' },
  { name: 'Coding Test', href: '/coding-test', icon: 'Code' },
  { name: 'AI Recruiter', href: '/recruiter', icon: 'Bot' },
  { name: 'Interview', href: '/interview', icon: 'MessageCircle' },
  { name: 'Feedback', href: '/feedback', icon: 'Star' },
  { name: 'Score', href: '/score', icon: 'Trophy' },
];

export const FEATURES = [
  {
    title: 'AI Resume Analyzer',
    description: 'Get instant feedback on your resume with our AI-powered analysis. Improve ATS scores, clarity, and impact.',
    icon: 'FileSearch',
    color: 'pink' as const,
  },
  {
    title: 'Skill Gap Detection',
    description: 'Identify missing skills for your target role and get a personalized learning path.',
    icon: 'Target',
    color: 'blue' as const,
  },
  {
    title: 'AI Mock Interview',
    description: 'Practice with our AI recruiter that asks real interview questions and provides instant feedback.',
    icon: 'MessageSquare',
    color: 'lavender' as const,
  },
  {
    title: 'Coding Assessment',
    description: 'Test your coding skills with real interview questions in Python, Java, JavaScript, and C++.',
    icon: 'Code',
    color: 'mint' as const,
  },
  {
    title: 'Learning Roadmap',
    description: 'Follow a structured learning path with curated resources and track your progress.',
    icon: 'Route',
    color: 'pink' as const,
  },
  {
    title: 'Placement Score',
    description: 'Get a comprehensive placement readiness score based on resume, skills, coding, and interview performance.',
    icon: 'Award',
    color: 'blue' as const,
  },
];

export const INTERVIEW_QUESTIONS = [
  'Tell me about yourself and your background.',
  'What is your greatest strength?',
  'Describe a challenging project you worked on.',
  'How do you handle working under pressure?',
  'Where do you see yourself in 5 years?',
  'Why do you want to work for our company?',
  'Describe a time when you worked in a team.',
  'What are your salary expectations?',
];

export const JOB_ROLES = [
  'Software Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Mobile Developer',
  'Cloud Engineer',
];

export const SKILL_CATEGORIES = {
  technical: ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'AWS'],
  soft: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management'],
  tools: ['VS Code', 'Docker', 'Kubernetes', 'Jira', 'Figma', 'Postman'],
};

export const CODING_QUESTIONS = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy' as const,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
  },
  {
    id: '2',
    title: 'Reverse String',
    difficulty: 'Easy' as const,
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    constraints: ['1 <= s.length <= 10^5'],
  },
  {
    id: '3',
    title: 'Valid Parentheses',
    difficulty: 'Medium' as const,
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4'],
  },
];

export const RECRUITER_AVATAR = 'https://images.pexels.com/photos/7749086/pexels-photo-7749086.jpeg?auto=compress&cs=tinysrgb&w=150';
