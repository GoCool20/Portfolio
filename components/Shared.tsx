import React from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Project, Skill } from '../types';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  // Added transform and transition classes for the "pop" effect
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  const variants = {
    // Enhanced hover shadows for all variants
    primary: "bg-brand-600 hover:bg-brand-500 text-white focus:ring-brand-500 shadow-lg shadow-brand-900/50 hover:shadow-xl hover:shadow-brand-500/30",
    secondary: "bg-dark-700 hover:bg-dark-600 text-white focus:ring-gray-500 border border-dark-600 hover:shadow-lg hover:shadow-gray-900/20",
    danger: "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 hover:shadow-lg hover:shadow-red-900/30"
  };

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} {...props} />
  );
};

export const SkillBadge: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 px-3 py-1.5 rounded-full hover:border-brand-500/50 transition-colors">
      <div className="w-2 h-2 rounded-full bg-brand-500" style={{ opacity: skill.level / 100 }} />
      <span className="text-sm font-medium text-gray-300">{skill.name}</span>
    </div>
  );
};

export const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  return (
    <div 
      className="group bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/20 flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-display font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="text-xs font-mono text-brand-500 bg-brand-900/30 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
             <span className="text-xs font-mono text-gray-500 px-2 py-1">+{project.technologies.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-700">
          <span className="text-sm text-gray-400 group-hover:text-brand-400 flex items-center gap-1 transition-colors">
            View Details <ArrowRight size={14} />
          </span>
          <div className="flex gap-3">
            {project.github && (
              <a 
                href={project.github} 
                onClick={(e) => e.stopPropagation()} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-gray-300 hover:bg-brand-600 hover:text-white hover:border-brand-500 transition-all hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5"
                title="View Source Code"
              >
                <Github size={18} />
              </a>
            )}
            {project.link && (
              <a 
                href={project.link} 
                onClick={(e) => e.stopPropagation()} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-gray-300 hover:bg-brand-600 hover:text-white hover:border-brand-500 transition-all hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5"
                title="View Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};