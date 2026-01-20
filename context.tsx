import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction } from './types';
import { loadState, saveState } from './services/storage';

// --- Helper for Colors ---
// Simple hex darkening logic for variants
function shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.floor(R * (100 + percent) / 100);
    G = Math.floor(G * (100 + percent) / 100);
    B = Math.floor(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  let newState: AppState;
  switch (action.type) {
    case 'LOGIN':
      newState = { ...state, isAuthenticated: true };
      break;
    case 'LOGOUT':
      newState = { ...state, isAuthenticated: false };
      break;
    case 'ADD_PROJECT':
      newState = { ...state, projects: [...state.projects, action.payload] };
      break;
    case 'UPDATE_PROJECT':
      newState = { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
      break;
    case 'DELETE_PROJECT':
      newState = { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
      break;
    case 'ADD_SKILL':
      newState = { ...state, skills: [...state.skills, action.payload] };
      break;
    case 'UPDATE_SKILL':
      newState = { ...state, skills: state.skills.map(s => s.id === action.payload.id ? action.payload : s) };
      break;
    case 'DELETE_SKILL':
      newState = { ...state, skills: state.skills.filter(s => s.id !== action.payload) };
      break;
    case 'UPDATE_PROFILE':
      newState = { ...state, profile: { ...state.profile, ...action.payload } };
      break;
    case 'CHANGE_PASSWORD':
      newState = { ...state, adminPassword: action.payload };
      break;
    case 'UPDATE_SECURITY_SETTINGS':
      newState = { ...state, securityQuestion: action.payload.question, securityAnswer: action.payload.answer };
      break;
    case 'UPDATE_THEME':
      newState = { ...state, theme: action.payload };
      break;
    case 'ADD_MESSAGE':
      newState = { ...state, messages: [action.payload, ...state.messages] };
      break;
    case 'DELETE_MESSAGE':
      newState = { ...state, messages: state.messages.filter(m => m.id !== action.payload) };
      break;
    case 'MARK_MESSAGE_READ':
      newState = { ...state, messages: state.messages.map(m => m.id === action.payload ? { ...m, read: true } : m) };
      break;
    default:
      return state;
  }
  saveState(newState);
  return newState;
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
};

// --- Theme Synchronizer Component ---
const ThemeSynchronizer: React.FC = () => {
    const { state } = useAppState();

    useEffect(() => {
        const theme = state.theme;
        const root = document.documentElement;
        
        // Primary variants
        root.style.setProperty('--color-primary', theme.primaryColor);
        root.style.setProperty('--color-primary-dark', shadeColor(theme.primaryColor, -15)); // 15% darker
        root.style.setProperty('--color-primary-light', shadeColor(theme.primaryColor, 15)); // 15% lighter
        root.style.setProperty('--color-primary-deep', shadeColor(theme.primaryColor, -40)); // 40% darker for shadows

        // Background variants
        root.style.setProperty('--color-bg-main', theme.backgroundColor);
        root.style.setProperty('--color-bg-card', theme.cardColor);
        root.style.setProperty('--color-border', shadeColor(theme.cardColor, 20)); // 20% lighter than card for borders

        // Text
        root.style.setProperty('--color-text-main', theme.textColor);
    }, [state.theme]);

    return null;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadState());

  return (
    <AppContext.Provider value={{ state, dispatch }}>
        <ThemeSynchronizer />
        {children}
    </AppContext.Provider>
  );
};