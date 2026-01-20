export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  link?: string;
  github?: string;
  featured: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Technical' | 'Tools' | 'Soft Skills';
  level: number; // 1-100
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  resumeUrl?: string;
  contactIntro?: string;
  education: Education[];
  experience: Experience[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
}

export interface AppState {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  messages: ContactMessage[];
  isAuthenticated: boolean;
  adminPassword?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  theme: ThemeConfig;
}

export type AppAction =
  | { type: 'UPDATE_PROFILE'; payload: Partial<Profile> }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: Skill }
  | { type: 'DELETE_SKILL'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: ContactMessage }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'CHANGE_PASSWORD'; payload: string }
  | { type: 'UPDATE_SECURITY_SETTINGS'; payload: { question: string; answer: string } }
  | { type: 'UPDATE_THEME'; payload: ThemeConfig };