import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppState } from './context';
import { Layout } from './components/Layout';
import { Home, ProjectsPage, ProjectDetail, About, Contact } from './pages/PublicPages';
import { Login, Dashboard, ManageProjects, ManageSkills, EditProfile, AiOptimizer, ManageTheme, ViewMessages } from './pages/AdminPages';

// --- Routing Guards ---

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { state } = useAppState();
  const location = useLocation();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// --- Main App ---

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
            <Route path="/admin/skills" element={<ProtectedRoute><ManageSkills /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/admin/theme" element={<ProtectedRoute><ManageTheme /></ProtectedRoute>} />
            <Route path="/admin/optimizer" element={<ProtectedRoute><AiOptimizer /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><ViewMessages /></ProtectedRoute>} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;