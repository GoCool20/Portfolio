import { AppState, Project, Skill, Profile, ThemeConfig, ContactMessage } from '../types';

const STORAGE_KEY = 'devfolio_data_v2';

const INITIAL_PROFILE: Profile = {
  name: "Alex Chen",
  title: "Senior Data Analyst",
  bio: "I transform complex raw data into actionable strategic insights. Expert in SQL, Python, and Tableau with a passion for storytelling through data visualization to drive business growth.",
  email: "alex.data@example.com",
  location: "New York, NY",
  resumeUrl: "",
  contactIntro: "Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.",
  education: [
    { id: '1', degree: "MS Data Science", institution: "Tech University", year: "2019", grade: "3.9 GPA" },
    { id: '2', degree: "BS Statistics", institution: "State College", year: "2017", grade: "Magna Cum Laude" }
  ],
  experience: [
    { id: '1', role: "Senior Data Analyst", company: "FinTech Corp", period: "2021-Present", description: "Spearheaded the migration to a modern data warehouse and built executive dashboards tracking $50M in revenue." },
    { id: '2', role: "Data Analyst", company: "Retail Global", period: "2019-2021", description: "Analyzed customer behavior patterns to optimize marketing spend, resulting in a 15% increase in ROI." }
  ]
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: "Customer Churn Prediction",
    description: "Developed a machine learning model to predict high-risk customers, allowing the retention team to intervene proactively. Reduced churn by 8% in Q3.",
    technologies: ["Python", "Scikit-Learn", "Pandas", "Jupyter"],
    imageUrl: "https://picsum.photos/id/1/800/600",
    link: "https://example.com",
    github: "https://github.com",
    featured: true
  },
  {
    id: '2',
    title: "Global Sales Dashboard",
    description: "An interactive Tableau dashboard aggregating real-time sales data from 12 regions. Features drill-down capabilities for granular performance analysis.",
    technologies: ["Tableau", "SQL", "Snowflake", "Excel"],
    imageUrl: "https://picsum.photos/id/20/800/600",
    link: "https://example.com",
    github: "https://github.com",
    featured: true
  },
  {
    id: '3',
    title: "Marketing Campaign Analysis",
    description: "Deep dive SQL analysis into multi-channel marketing attribution. Identified underperforming channels and reallocated budget to high-converting touchpoints.",
    technologies: ["SQL", "BigQuery", "Power BI", "Python"],
    imageUrl: "https://picsum.photos/id/26/800/600",
    link: "https://example.com",
    github: "https://github.com",
    featured: false
  }
];

const INITIAL_SKILLS: Skill[] = [
  { id: '1', name: "SQL", category: "Technical", level: 95 },
  { id: '2', name: "Python", category: "Technical", level: 90 },
  { id: '3', name: "Tableau", category: "Tools", level: 90 },
  { id: '4', name: "Power BI", category: "Tools", level: 85 },
  { id: '5', name: "Statistical Analysis", category: "Technical", level: 85 },
  { id: '6', name: "Data Cleaning", category: "Technical", level: 90 },
  { id: '7', name: "Strategic Planning", category: "Soft Skills", level: 80 },
];

const INITIAL_THEME: ThemeConfig = {
  primaryColor: '#0ea5e9', // Default Brand Blue
  backgroundColor: '#0f172a', // Default Dark 900
  cardColor: '#1e293b', // Default Dark 800
  textColor: '#f8fafc', // Default Text
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return {
        profile: INITIAL_PROFILE,
        projects: INITIAL_PROJECTS,
        skills: INITIAL_SKILLS,
        messages: [],
        isAuthenticated: false,
        adminPassword: 'admin123',
        securityQuestion: 'What is the default project name?',
        securityAnswer: 'DevFolio',
        theme: INITIAL_THEME
      };
    }
    const parsed = JSON.parse(serializedState);
    // Ensure new fields exist for backward compatibility
    if (!parsed.adminPassword) parsed.adminPassword = 'admin123';
    if (!parsed.securityQuestion) parsed.securityQuestion = 'What is the default project name?';
    if (!parsed.securityAnswer) parsed.securityAnswer = 'DevFolio';
    if (!parsed.theme) parsed.theme = INITIAL_THEME;
    if (!parsed.messages) parsed.messages = [];
    return parsed;
  } catch (err) {
    console.error("Load state failed", err);
    return {
      profile: INITIAL_PROFILE,
      projects: INITIAL_PROJECTS,
      skills: INITIAL_SKILLS,
      messages: [],
      isAuthenticated: false,
      adminPassword: 'admin123',
      securityQuestion: 'What is the default project name?',
      securityAnswer: 'DevFolio',
      theme: INITIAL_THEME
    };
  }
};

export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Save state failed", err);
  }
};