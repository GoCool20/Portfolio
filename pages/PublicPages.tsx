import React, { useState, useEffect } from 'react';
import { useAppState } from '../context';
import { ProjectCard, SkillBadge, Button } from '../components/Shared';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Download, Briefcase, GraduationCap, FileText, Send, CheckCircle, Linkedin, Github, Twitter } from 'lucide-react';
import { Skill, ContactMessage } from '../types';

export const Home: React.FC = () => {
  const { state } = useAppState();
  const featuredProjects = state.projects.filter(p => p.featured).slice(0, 3);
  const navigate = useNavigate();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-dark-900 to-dark-900" />
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6">
          Hello, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500">{state.profile.name}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          {state.profile.title}. {state.profile.bio}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => navigate('/projects')} className="text-lg px-8 py-3">View Projects</Button>
          <div className="flex gap-4">
             <Button variant="secondary" onClick={() => navigate('/about')} className="text-lg px-8 py-3">More About Me</Button>
             {state.profile.resumeUrl && (
                 <a href={state.profile.resumeUrl} download="resume.pdf" className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed bg-dark-700 hover:bg-dark-600 text-white focus:ring-gray-500 border border-dark-600 text-lg px-6 py-3">
                    <FileText size={20} className="mr-2"/> Resume
                 </a>
             )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-bold text-white">Featured Work</h2>
          <Link to="/projects" className="text-brand-500 hover:text-brand-400 flex items-center gap-1">
            View All <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
          ))}
        </div>
      </section>

      {/* Skills Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-dark-800/50 rounded-3xl py-12 border border-dark-700">
        <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">Technical Arsenal</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {state.skills.slice(0, 10).map(skill => (
            <SkillBadge key={skill.id} skill={skill} />
          ))}
          <Link to="/about" className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-400 border border-dashed border-gray-600 hover:border-brand-500 hover:text-brand-500 transition-colors">
            + {state.skills.length - 10} more
          </Link>
        </div>
      </section>
    </div>
  );
};

export const ProjectsPage: React.FC = () => {
  const { state } = useAppState();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');

  const allTech = Array.from(new Set(state.projects.flatMap(p => p.technologies)));
  
  const filteredProjects = state.projects.filter(p => {
    if (!filter) return true;
    return p.technologies.includes(filter);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold text-white mb-8">All Projects</h1>
      
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button 
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!filter ? 'bg-brand-600 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
        >
          All
        </button>
        {allTech.map(tech => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === tech ? 'bg-brand-600 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No projects found with this filter.
        </div>
      )}
    </div>
  );
};

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppState();
  const project = state.projects.find(p => p.id === id);

  if (!project) return <div className="p-20 text-center">Project not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl overflow-hidden mb-10 border border-dark-700 shadow-2xl shadow-brand-900/20">
        <img src={project.imageUrl} alt={project.title} className="w-full h-96 object-cover" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">{project.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="text-lg font-bold text-white mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className="px-3 py-1 bg-dark-900 rounded text-brand-400 text-sm font-mono border border-dark-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Links</h3>
            {project.link && (
               <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-300 hover:text-white group">
                 <span>Live Demo</span>
                 <ArrowRight size={16} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
               </a>
            )}
            {project.github && (
               <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-300 hover:text-white group">
                 <span>Source Code</span>
                 <ArrowRight size={16} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
               </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const About: React.FC = () => {
  const { state } = useAppState();

  const groupedSkills = state.skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Profile Header */}
      <div className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 p-1">
          <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-white">{state.profile.name.charAt(0)}</span>
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold text-white">{state.profile.name}</h1>
        <p className="text-xl text-brand-400">{state.profile.title}</p>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">{state.profile.bio}</p>
        
        <div className="flex justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin size={18} /> {state.profile.location}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} /> {state.profile.email}
          </div>
          {state.profile.resumeUrl && (
            <div className="flex items-center gap-2">
              <a href={state.profile.resumeUrl} download="resume.pdf" className="text-brand-400 hover:underline flex items-center gap-1">
                <FileText size={18} /> Resume
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
          <Briefcase className="text-brand-500" /> Work Experience
        </h2>
        <div className="space-y-8 border-l-2 border-dark-700 ml-3 pl-8 relative">
          {state.profile.experience.map(exp => (
            <div key={exp.id} className="relative">
              <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-brand-600 border-4 border-dark-900" />
              <h3 className="text-xl font-bold text-white">{exp.role}</h3>
              <p className="text-brand-400 mb-2">{exp.company} | {exp.period}</p>
              <p className="text-gray-400">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
          <GraduationCap className="text-brand-500" /> Education
        </h2>
        <div className="grid gap-6">
          {state.profile.education.map(edu => (
            <div key={edu.id} className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                <p className="text-gray-400">{edu.institution}, {edu.year}</p>
              </div>
              {edu.grade && (
                  <div className="bg-dark-900 px-3 py-1 rounded border border-dark-600">
                      <span className="text-brand-400 font-bold">{edu.grade}</span>
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>

       {/* Skills Detailed */}
       <div>
        <h2 className="text-2xl font-display font-bold text-white mb-8">Skills Overview</h2>
        <div className="space-y-8">
          {(Object.entries(groupedSkills) as [string, Skill[]][]).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-lg font-bold text-gray-300 mb-4">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => <SkillBadge key={skill.id} skill={skill} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return alert("Please fill in all fields.");

    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      message: form.message,
      date: new Date().toISOString(),
      read: false
    };

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Get In Touch</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {state.profile.contactIntro || "Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl shadow-brand-900/10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea 
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all h-32 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <Button type="submit" className="w-full py-3 text-lg flex items-center justify-center gap-2">
                <Send size={18} /> Send Message
              </Button>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-gray-400">Thank you for reaching out. I'll get back to you as soon as possible.</p>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>Send Another</Button>
            </div>
          )}
        </div>

        <div className="space-y-8 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-dark-800 rounded-lg text-brand-500 border border-dark-700">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Email</h3>
              <p className="text-gray-400 mt-1">{state.profile.email}</p>
              <p className="text-sm text-gray-500 mt-1">Typical response time: 24 hours</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-dark-800 rounded-lg text-brand-500 border border-dark-700">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Location</h3>
              <p className="text-gray-400 mt-1">{state.profile.location}</p>
              <p className="text-sm text-gray-500 mt-1">Available for remote work worldwide</p>
            </div>
          </div>

          <div className="pt-8 border-t border-dark-700">
            <h3 className="text-lg font-bold text-white mb-4">Connect Socially</h3>
            <div className="flex gap-4">
               {state.profile.linkedin && (
                 <a href={state.profile.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 text-white flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] transition-colors">
                    <Linkedin size={20} />
                 </a>
               )}
               {state.profile.twitter && (
                 <a href={state.profile.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 text-white flex items-center justify-center hover:bg-black hover:border-gray-500 transition-colors">
                    <Twitter size={20} />
                 </a>
               )}
               {state.profile.github && (
                 <a href={state.profile.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600 text-white flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-colors">
                    <Github size={20} />
                 </a>
               )}
               {!state.profile.linkedin && !state.profile.twitter && !state.profile.github && (
                 <p className="text-gray-500 text-sm">No social links added yet.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};