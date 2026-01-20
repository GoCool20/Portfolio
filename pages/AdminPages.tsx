import React, { useState } from 'react';
import { useAppState } from '../context';
import { Button } from '../components/Shared';
import { Plus, Trash2, Edit2, Wand2, Save, X, Briefcase, GraduationCap, Lock, Upload, FileText, Palette, AlertCircle, Mail, MessageSquare, Check, Clock, Globe, Linkedin, Github, Twitter, KeyRound } from 'lucide-react';
import { Project, Skill, Profile, Experience, Education, ThemeConfig, ContactMessage } from '../types';
import { optimizePortfolio, OptimizationResult, getAiSuggestion } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

// --- Login Page ---
export const Login: React.FC = () => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'recovery'>('login');
  
  // Login State
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Recovery State
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const correctPassword = state.adminPassword || 'admin123';
    
    if (password === correctPassword) { 
      dispatch({ type: 'LOGIN' });
      navigate('/admin');
    } else {
      setError('Invalid password provided.');
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!recoveryAnswer || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (recoveryAnswer.toLowerCase().trim() === (state.securityAnswer || '').toLowerCase().trim()) {
       dispatch({ type: 'CHANGE_PASSWORD', payload: newPassword });
       setSuccessMsg("Password reset successfully! Please login.");
       setTimeout(() => {
           setMode('login');
           setSuccessMsg('');
           setRecoveryAnswer('');
           setNewPassword('');
       }, 2000);
    } else {
       setError("Incorrect security answer.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-dark-800 rounded-2xl border border-dark-700 shadow-xl">
        <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">
            {mode === 'login' ? 'Admin Access' : 'Password Recovery'}
        </h2>
        
        {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-dark-900 border rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none ${error ? 'border-red-500' : 'border-dark-700'}`}
                placeholder="Enter password"
                />
                {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
                {successMsg && <p className="text-green-500 text-sm mt-2 flex items-center gap-1"><Check size={14}/> {successMsg}</p>}
            </div>
            <Button type="submit" className="w-full">Login</Button>
            <div className="text-center mt-4">
                <button type="button" onClick={() => setMode('recovery')} className="text-sm text-brand-400 hover:text-brand-300">
                    Forgot Password?
                </button>
            </div>
            </form>
        ) : (
            <form onSubmit={handleRecovery} className="space-y-4">
                 <div className="bg-dark-900/50 p-4 rounded-lg border border-dark-700 mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Security Question</p>
                    <p className="text-white font-medium">{state.securityQuestion || "What is the default project name?"}</p>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Security Answer</label>
                    <input 
                    type="text" 
                    value={recoveryAnswer}
                    onChange={(e) => setRecoveryAnswer(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="Enter your answer"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="Set new password"
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
                {successMsg && <p className="text-green-500 text-sm mt-2 flex items-center gap-1"><Check size={14}/> {successMsg}</p>}

                <Button type="submit" className="w-full">Reset Password</Button>
                <div className="text-center mt-2">
                    <button type="button" onClick={() => setMode('login')} className="text-sm text-gray-400 hover:text-white">
                        Back to Login
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

// --- Dashboard Home ---
export const Dashboard: React.FC = () => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  
  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [securityForm, setSecurityForm] = useState({
      question: state.securityQuestion || '',
      answer: state.securityAnswer || ''
  });
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);

  const unreadMessages = state.messages.filter(m => !m.read).length;

  const stats = [
    { label: "Total Projects", value: state.projects.length, path: "/admin/projects" },
    { label: "Total Skills", value: state.skills.length, path: "/admin/skills" },
    { label: "Experience Entries", value: state.profile.experience.length, path: "/admin/profile" },
    { label: "Unread Messages", value: unreadMessages, path: "/admin/messages", highlight: unreadMessages > 0 },
  ];

  const handlePasswordChange = () => {
    if (newPassword.length < 4) return alert("Password too short");
    dispatch({ type: 'CHANGE_PASSWORD', payload: newPassword });
    setNewPassword('');
    alert("Password changed successfully");
  };

  const handleSecurityUpdate = () => {
      if (!securityForm.question || !securityForm.answer) return alert("Question and Answer cannot be empty.");
      dispatch({ type: 'UPDATE_SECURITY_SETTINGS', payload: securityForm });
      alert("Security questions updated successfully.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
        <Button onClick={() => navigate('/admin/optimizer')} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-none">
          <Wand2 size={18} /> AI Optimizer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            onClick={() => navigate(stat.path)} 
            className={`bg-dark-800 p-6 rounded-xl border cursor-pointer transition-colors ${stat.highlight ? 'border-brand-500 shadow-lg shadow-brand-900/20' : 'border-dark-700 hover:border-brand-500/50'}`}
          >
            <p className={`text-sm ${stat.highlight ? 'text-brand-400 font-bold' : 'text-gray-400'}`}>{stat.label}</p>
            <p className="text-4xl font-display font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => navigate('/admin/projects')} className="w-full justify-start text-sm">Manage Projects</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/skills')} className="w-full justify-start text-sm">Update Skills</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/profile')} className="w-full justify-start text-sm">Edit Profile</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/theme')} className="w-full justify-start text-sm flex items-center gap-2"><Palette size={14}/> Theme</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/messages')} className="w-full justify-start text-sm flex items-center gap-2"><Mail size={14}/> View Messages</Button>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Lock size={20} /> Security</h2>
           {!showSecuritySettings ? (
             <Button variant="secondary" onClick={() => setShowSecuritySettings(true)} className="flex items-center gap-2"><KeyRound size={16}/> Manage Security Settings</Button>
           ) : (
             <div className="space-y-6">
                {/* Password Change */}
                <div className="space-y-2 border-b border-dark-700 pb-4">
                    <h3 className="text-sm font-bold text-gray-300">Change Password</h3>
                    <div className="flex gap-2">
                        <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-grow bg-dark-900 border border-dark-700 p-2 rounded text-white"
                        placeholder="New Password"
                        />
                        <Button onClick={handlePasswordChange} size="sm">Update</Button>
                    </div>
                </div>

                {/* Security Question */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-300">Recovery Question</h3>
                    <input 
                        value={securityForm.question}
                        onChange={(e) => setSecurityForm({...securityForm, question: e.target.value})}
                        className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white"
                        placeholder="e.g. What is your pet's name?"
                    />
                     <input 
                        value={securityForm.answer}
                        onChange={(e) => setSecurityForm({...securityForm, answer: e.target.value})}
                        className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white"
                        placeholder="Answer"
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSecurityUpdate} size="sm">Save Recovery Info</Button>
                        <Button variant="secondary" onClick={() => setShowSecuritySettings(false)} size="sm">Close</Button>
                    </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Messages Viewer ---
export const ViewMessages: React.FC = () => {
  const { state, dispatch } = useAppState();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Mail /> Inbox <span className="text-lg text-gray-400 font-normal">({state.messages.length})</span></h1>
      </div>

      <div className="space-y-4">
        {state.messages.length === 0 ? (
           <div className="text-center py-20 bg-dark-800 rounded-xl border border-dark-700">
             <Mail size={48} className="mx-auto text-gray-600 mb-4" />
             <p className="text-gray-400 text-lg">No messages yet.</p>
           </div>
        ) : (
          state.messages.map(msg => (
            <div key={msg.id} className={`bg-dark-800 rounded-xl border p-6 transition-all ${!msg.read ? 'border-brand-500/50 shadow-lg shadow-brand-900/10' : 'border-dark-700'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${!msg.read ? 'bg-brand-600 text-white' : 'bg-dark-700 text-gray-400'}`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${!msg.read ? 'text-white' : 'text-gray-300'}`}>{msg.name}</h3>
                    <p className="text-brand-400 text-sm flex items-center gap-1"><Mail size={12}/> {msg.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {formatDate(msg.date)}</span>
                   <div className="flex gap-2">
                     {!msg.read && (
                       <Button size="sm" variant="secondary" onClick={() => dispatch({ type: 'MARK_MESSAGE_READ', payload: msg.id })} title="Mark as Read">
                         <Check size={14} />
                       </Button>
                     )}
                     <Button size="sm" variant="danger" onClick={() => dispatch({ type: 'DELETE_MESSAGE', payload: msg.id })} title="Delete">
                       <Trash2 size={14} />
                     </Button>
                   </div>
                </div>
              </div>
              <div className="bg-dark-900/50 p-4 rounded-lg border border-dark-700/50">
                 <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Theme Manager ---
export const ManageTheme: React.FC = () => {
    const { state, dispatch } = useAppState();
    const [theme, setTheme] = useState<ThemeConfig>(state.theme);

    const handleSave = () => {
        dispatch({ type: 'UPDATE_THEME', payload: theme });
        alert('Theme updated successfully!');
    };

    const resetTheme = () => {
        const defaultTheme: ThemeConfig = {
            primaryColor: '#0ea5e9',
            backgroundColor: '#0f172a',
            cardColor: '#1e293b',
            textColor: '#f8fafc',
        };
        setTheme(defaultTheme);
        dispatch({ type: 'UPDATE_THEME', payload: defaultTheme });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Palette /> Theme Customization</h1>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={resetTheme}>Reset to Default</Button>
                    <Button onClick={handleSave} className="flex items-center gap-2"><Save size={18} /> Save Theme</Button>
                </div>
            </div>

            <div className="bg-dark-800 p-8 rounded-xl border border-dark-700 grid gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">Primary Brand Color</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="color" 
                                value={theme.primaryColor} 
                                onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                                className="w-16 h-16 rounded border-none cursor-pointer bg-transparent" 
                            />
                            <div>
                                <p className="text-white font-mono">{theme.primaryColor}</p>
                                <p className="text-sm text-gray-400">Used for buttons, links, and accents.</p>
                            </div>
                        </div>
                    </div>

                     <div>
                        <label className="block text-gray-300 font-medium mb-2">Main Background Color</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="color" 
                                value={theme.backgroundColor} 
                                onChange={(e) => setTheme({...theme, backgroundColor: e.target.value})}
                                className="w-16 h-16 rounded border-none cursor-pointer bg-transparent" 
                            />
                            <div>
                                <p className="text-white font-mono">{theme.backgroundColor}</p>
                                <p className="text-sm text-gray-400">The main background of the page.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">Card/Surface Color</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="color" 
                                value={theme.cardColor} 
                                onChange={(e) => setTheme({...theme, cardColor: e.target.value})}
                                className="w-16 h-16 rounded border-none cursor-pointer bg-transparent" 
                            />
                            <div>
                                <p className="text-white font-mono">{theme.cardColor}</p>
                                <p className="text-sm text-gray-400">Background for cards, sidebar, and inputs.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 font-medium mb-2">Primary Text Color</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="color" 
                                value={theme.textColor} 
                                onChange={(e) => setTheme({...theme, textColor: e.target.value})}
                                className="w-16 h-16 rounded border-none cursor-pointer bg-transparent" 
                            />
                            <div>
                                <p className="text-white font-mono">{theme.textColor}</p>
                                <p className="text-sm text-gray-400">Main body text color.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dark-700 pt-8">
                    <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
                    <div className="p-6 rounded-xl border border-dark-700" style={{ backgroundColor: theme.cardColor }}>
                        <h4 className="text-xl font-bold mb-2" style={{ color: theme.textColor }}>Card Title Preview</h4>
                        <p className="mb-4" style={{ color: theme.textColor, opacity: 0.8 }}>
                            This is how your text will look on the selected card background. 
                            The button below uses your primary color.
                        </p>
                        <button 
                            className="px-4 py-2 rounded text-white font-medium" 
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            Primary Action
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Project Manager ---
export const ManageProjects: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});
  const [aiLoading, setAiLoading] = useState(false);

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm(project);
  };

  const handleCreate = () => {
    setEditingId('new');
    setForm({
      title: '', description: '', technologies: [], imageUrl: 'https://picsum.photos/800/600', featured: false, link: '', github: ''
    });
  };

  const handleSave = () => {
    if (!form.title || !form.description) return alert("Title and Description required");
    
    if (editingId === 'new') {
      const newProject: Project = { ...form, id: Date.now().toString(), technologies: form.technologies || [] } as Project;
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
    } else {
      dispatch({ type: 'UPDATE_PROJECT', payload: { ...form, id: editingId } as Project });
    }
    setEditingId(null);
  };

  const suggestDescription = async () => {
    if (!form.title) return alert("Enter a title first");
    setAiLoading(true);
    try {
      const suggestion = await getAiSuggestion('project description', `Title: ${form.title}. Current Desc: ${form.description || ''}`);
      setForm({ ...form, description: suggestion });
    } catch (e) {
      console.error(e);
      alert("Failed to generate suggestion");
    }
    setAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Projects</h1>
        {!editingId && <Button onClick={handleCreate}><Plus size={18} className="mr-2"/> New Project</Button>}
      </div>

      {editingId ? (
        <div className="bg-dark-800 p-8 rounded-xl border border-dark-700 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">{editingId === 'new' ? 'New Project' : 'Edit Project'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
              placeholder="Title" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
            />
             <input 
              className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
              placeholder="Image URL" 
              value={form.imageUrl} 
              onChange={e => setForm({...form, imageUrl: e.target.value})} 
            />
            <input 
              className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
              placeholder="Live Link" 
              value={form.link} 
              onChange={e => setForm({...form, link: e.target.value})} 
            />
            <input 
              className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
              placeholder="GitHub Link" 
              value={form.github} 
              onChange={e => setForm({...form, github: e.target.value})} 
            />
          </div>
          <div className="relative">
             <textarea 
                className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white h-32" 
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
            />
            <Button 
                variant="secondary" 
                onClick={suggestDescription} 
                className="absolute right-2 bottom-2 text-xs py-1 px-2 flex items-center gap-1"
                disabled={aiLoading}
            >
                {aiLoading ? "Thinking..." : <><Wand2 size={12}/> AI Help</>}
            </Button>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Technologies (comma separated)</label>
            <input 
              className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white" 
              placeholder="React, Node, etc."
              value={form.technologies?.join(', ')}
              onChange={e => setForm({...form, technologies: e.target.value.split(',').map(s => s.trim())})}
            />
          </div>
          <div className="flex items-center gap-2 text-white">
            <input 
              type="checkbox" 
              checked={form.featured} 
              onChange={e => setForm({...form, featured: e.target.checked})} 
            /> 
            Featured
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {state.projects.map(p => (
            <div key={p.id} className="bg-dark-800 p-4 rounded-lg flex justify-between items-center border border-dark-700">
              <div>
                <h3 className="font-bold text-white">{p.title}</h3>
                <p className="text-sm text-gray-400 truncate w-96">{p.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(p)}><Edit2 size={16}/></Button>
                <Button variant="danger" onClick={() => dispatch({ type: 'DELETE_PROJECT', payload: p.id })}><Trash2 size={16}/></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Skills Manager ---
export const ManageSkills: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Skill>>({});

  const handleCreate = () => {
    setEditingId('new');
    setForm({ name: '', category: 'Technical', level: 50 });
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm(skill);
  };

  const handleSave = () => {
    if (!form.name) return alert("Skill name required");

    if (editingId === 'new') {
      const newSkill: Skill = { ...form, id: Date.now().toString() } as Skill;
      dispatch({ type: 'ADD_SKILL', payload: newSkill });
    } else {
      dispatch({ type: 'UPDATE_SKILL', payload: { ...form, id: editingId } as Skill });
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Skills</h1>
        {!editingId && <Button onClick={handleCreate}><Plus size={18} className="mr-2"/> New Skill</Button>}
      </div>

      {editingId && (
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 mb-8 space-y-4">
          <h3 className="font-bold text-white">{editingId === 'new' ? 'Add Skill' : 'Edit Skill'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="bg-dark-900 border border-dark-700 p-2 rounded text-white"
              placeholder="Skill Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <select
              className="bg-dark-900 border border-dark-700 p-2 rounded text-white"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as any })}
            >
              <option value="Technical">Technical</option>
              <option value="Tools">Tools</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm w-16">Level: {form.level}%</span>
              <input
                type="range"
                min="1"
                max="100"
                className="flex-grow"
                value={form.level}
                onChange={e => setForm({ ...form, level: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.skills.map(skill => (
          <div key={skill.id} className="bg-dark-800 p-4 rounded-lg border border-dark-700 flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{skill.name}</p>
              <p className="text-xs text-gray-400">{skill.category}</p>
              <div className="w-24 h-1 bg-dark-900 rounded-full mt-2">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="p-2" onClick={() => handleEdit(skill)}><Edit2 size={14}/></Button>
              <Button variant="danger" className="p-2" onClick={() => dispatch({ type: 'DELETE_SKILL', payload: skill.id })}><Trash2 size={14}/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Profile Editor ---
export const EditProfile: React.FC = () => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>(state.profile);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    alert("Profile updated successfully!");
    navigate('/admin');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Limit to 500KB to prevent LocalStorage QuotaExceededError
        if (file.size > 500 * 1024) {
            alert("File is too large! Please upload a resume smaller than 500KB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile({...profile, resumeUrl: reader.result as string});
        };
        reader.readAsDataURL(file);
    }
  };

  const suggestText = async (field: string, currentValue: string, targetField: keyof Profile) => {
      setAiLoading(field);
      try {
        const suggestion = await getAiSuggestion(field, currentValue);
        // Generic handler for top-level profile fields
        setProfile((prev) => ({...prev, [targetField]: suggestion}));
      } catch (e) {
          console.error(e);
          alert("AI suggestion failed.");
      }
      setAiLoading(null);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...profile.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setProfile({ ...profile, experience: newExp });
  };

  const suggestExperience = async (index: number) => {
      const exp = profile.experience[index];
      setAiLoading(`exp-${index}`);
      try {
        const suggestion = await getAiSuggestion('job description', `Role: ${exp.role}, Company: ${exp.company}. Content: ${exp.description}`);
        updateExperience(index, 'description', suggestion);
      } catch (e) {
        console.error(e);
      }
      setAiLoading(null);
  };

  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), role: '', company: '', period: '', description: '' };
    setProfile({ ...profile, experience: [newExp, ...profile.experience] });
  };

  const removeExperience = (id: string) => {
    setProfile({ ...profile, experience: profile.experience.filter(e => e.id !== id) });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...profile.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setProfile({ ...profile, education: newEdu });
  };

  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), degree: '', institution: '', year: '', grade: '' };
    setProfile({ ...profile, education: [newEdu, ...profile.education] });
  };

  const removeEducation = (id: string) => {
    setProfile({ ...profile, education: profile.education.filter(e => e.id !== id) });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        <Button onClick={handleSave} className="flex items-center gap-2"><Save size={18} /> Save Changes</Button>
      </div>

      {/* Basic Info */}
      <section className="bg-dark-800 p-6 rounded-xl border border-dark-700 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <input className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
          </div>
          <div className="relative">
            <label className="text-sm text-gray-400">Professional Title</label>
            <input className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1 pr-10" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
            <Button 
                variant="secondary" 
                onClick={() => suggestText('professional title', profile.title, 'title')} 
                className="absolute right-1 bottom-1 text-xs py-1 px-1.5 h-7 w-7 flex items-center justify-center rounded-sm"
                title="AI Suggestion"
                disabled={aiLoading === 'professional title'}
            >
                {aiLoading === 'professional title' ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"/> : <Wand2 size={12}/>}
            </Button>
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-400">Location</label>
            <input className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
          </div>
        </div>
        
        <div>
           <label className="text-sm text-gray-400 mb-1 block">Resume</label>
           <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 bg-dark-700 hover:bg-dark-600 px-4 py-2 rounded text-white transition-colors">
                    <Upload size={16} /> Upload PDF (Max 500KB)
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                </label>
                {profile.resumeUrl && <span className="text-green-400 text-sm flex items-center gap-1"><FileText size={14}/> Resume Uploaded</span>}
           </div>
        </div>

        <div className="relative">
          <label className="text-sm text-gray-400">Bio</label>
          <textarea className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1 h-24" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
          <Button 
                variant="secondary" 
                onClick={() => suggestText('professional bio', profile.bio, 'bio')} 
                className="absolute right-2 bottom-2 text-xs py-1 px-2 flex items-center gap-1"
                disabled={aiLoading === 'professional bio'}
            >
                {aiLoading === 'professional bio' ? "Thinking..." : <><Wand2 size={12}/> AI Help</>}
          </Button>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-dark-800 p-6 rounded-xl border border-dark-700 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Social Media & Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
            <label className="text-sm text-gray-400 flex items-center gap-2"><Github size={16}/> GitHub URL</label>
            <input className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1" value={profile.github || ''} onChange={e => setProfile({...profile, github: e.target.value})} placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="text-sm text-gray-400 flex items-center gap-2"><Linkedin size={16}/> LinkedIn URL</label>
            <input className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1" value={profile.linkedin || ''} onChange={e => setProfile({...profile, linkedin: e.target.value})} placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <label className="text-sm text-gray-400 flex items-center gap-2"><Twitter size={16}/> Twitter/X URL</label>
            <input className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1" value={profile.twitter || ''} onChange={e => setProfile({...profile, twitter: e.target.value})} placeholder="https://twitter.com/username" />
          </div>
        </div>
        
        <div className="relative">
          <label className="text-sm text-gray-400">Contact Section Intro</label>
          <textarea 
            className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white mt-1 h-20" 
            value={profile.contactIntro || ''} 
            onChange={e => setProfile({...profile, contactIntro: e.target.value})} 
            placeholder="Introduction text for the contact page..."
          />
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase size={20}/> Experience</h2>
          <Button variant="secondary" onClick={addExperience} size="sm"><Plus size={16}/> Add Role</Button>
        </div>
        {profile.experience.map((exp, index) => (
          <div key={exp.id} className="bg-dark-800 p-6 rounded-xl border border-dark-700 relative group">
            <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
                placeholder="Role" 
                value={exp.role} 
                onChange={e => updateExperience(index, 'role', e.target.value)} 
              />
              <input 
                className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
                placeholder="Company" 
                value={exp.company} 
                onChange={e => updateExperience(index, 'company', e.target.value)} 
              />
              <input 
                className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
                placeholder="Period (e.g. 2020-2022)" 
                value={exp.period} 
                onChange={e => updateExperience(index, 'period', e.target.value)} 
              />
            </div>
            <div className="relative">
                <textarea 
                className="w-full bg-dark-900 border border-dark-700 p-2 rounded text-white h-20" 
                placeholder="Description of responsibilities..." 
                value={exp.description} 
                onChange={e => updateExperience(index, 'description', e.target.value)} 
                />
                <Button 
                    variant="secondary" 
                    onClick={() => suggestExperience(index)} 
                    className="absolute right-2 bottom-2 text-xs py-1 px-2 flex items-center gap-1"
                    disabled={aiLoading === `exp-${index}`}
                >
                    {aiLoading === `exp-${index}` ? "Thinking..." : <><Wand2 size={12}/> AI Help</>}
                </Button>
            </div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><GraduationCap size={20}/> Education</h2>
          <Button variant="secondary" onClick={addEducation} size="sm"><Plus size={16}/> Add Education</Button>
        </div>
        {profile.education.map((edu, index) => (
          <div key={edu.id} className="bg-dark-800 p-6 rounded-xl border border-dark-700 relative group">
            <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
                placeholder="Degree" 
                value={edu.degree} 
                onChange={e => updateEducation(index, 'degree', e.target.value)} 
              />
              <input 
                className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
                placeholder="Institution" 
                value={edu.institution} 
                onChange={e => updateEducation(index, 'institution', e.target.value)} 
              />
              <input 
                className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
                placeholder="Year" 
                value={edu.year} 
                onChange={e => updateEducation(index, 'year', e.target.value)} 
              />
               <input 
                className="bg-dark-900 border border-dark-700 p-2 rounded text-white" 
                placeholder="Grade/GPA (Optional)" 
                value={edu.grade || ''} 
                onChange={e => updateEducation(index, 'grade', e.target.value)} 
              />
            </div>
          </div>
        ))}
      </section>

      <div className="fixed bottom-6 right-6 z-10">
        <Button onClick={handleSave} className="shadow-2xl shadow-brand-900 py-3 px-6 text-lg"><Save size={20} className="mr-2"/> Save Changes</Button>
      </div>
    </div>
  );
};

// --- AI Optimizer ---
export const AiOptimizer: React.FC = () => {
  const { state } = useAppState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await optimizePortfolio(state.profile, state.projects);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze portfolio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-bold text-white mb-4">AI Portfolio Optimizer</h1>
        <p className="text-gray-400">Uses Gemini AI to analyze your content and suggest improvements for better impact and SEO.</p>
      </div>

      {!result && (
        <div className="text-center">
          <Button onClick={runAnalysis} disabled={loading} className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-none shadow-xl shadow-purple-900/20">
             {loading ? <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Analyzing...</span> : <span className="flex items-center gap-2"><Wand2 /> Analyze My Portfolio</span>}
          </Button>
          {error && <p className="text-red-400 mt-4 bg-red-900/20 p-2 rounded">{error}</p>}
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-dark-800 border border-brand-500/30 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"/>
            <h3 className="text-xl font-bold text-white mb-4">General Feedback</h3>
            <p className="text-gray-300 italic">"{result.generalFeedback}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Bio Improvement</h3>
                <div className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                    <span className="text-xs uppercase text-red-400 font-bold tracking-wider">Before</span>
                    <p className="text-gray-500 text-sm mt-1">{state.profile.bio}</p>
                </div>
                <div className="bg-dark-800 p-4 rounded-lg border border-brand-500/50">
                    <span className="text-xs uppercase text-brand-400 font-bold tracking-wider">After (AI Suggestion)</span>
                    <p className="text-white mt-1">{result.improvedBio}</p>
                </div>
            </div>
            
            <div className="space-y-4">
                 <h3 className="text-lg font-bold text-white">Project Descriptions</h3>
                 {result.projectSuggestions.slice(0, 2).map(sugg => {
                     const original = state.projects.find(p => p.id === sugg.projectId);
                     if(!original) return null;
                     return (
                         <div key={sugg.projectId} className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                             <p className="font-bold text-gray-300 text-sm mb-2">{original.title}</p>
                             <div className="mb-2">
                                <p className="text-xs text-red-400">Current: {original.description.substring(0, 60)}...</p>
                             </div>
                             <div>
                                <p className="text-sm text-brand-300">Suggestion: {sugg.suggestion}</p>
                             </div>
                         </div>
                     )
                 })}
            </div>
          </div>
          
          <div className="flex justify-center pt-6">
              <Button variant="secondary" onClick={() => setResult(null)}>Close & Reset</Button>
          </div>
        </div>
      )}
    </div>
  );
};