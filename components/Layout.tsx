import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, User, Code, Briefcase, Lock, LogOut, LayoutDashboard, Mail } from 'lucide-react';
import { useAppState } from '../context';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { state, dispatch } = useAppState();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Terminal size={18} /> },
    { name: 'Projects', path: '/projects', icon: <Code size={18} /> },
    { name: 'About', path: '/about', icon: <User size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  if (state.isAuthenticated) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <LayoutDashboard size={18} /> });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-brand-500">
              <Terminal className="text-brand-500" />
              <span>DevFolio</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-dark-800 text-brand-500'
                      : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              {state.isAuthenticated ? (
                 <button
                 onClick={() => dispatch({ type: 'LOGOUT' })}
                 className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-dark-800 hover:text-red-300"
               >
                 <LogOut size={18} />
                 Logout
               </button>
              ) : (
                <Link to="/login" className="text-gray-500 hover:text-white ml-4">
                  <Lock size={16} />
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-900 border-b border-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-dark-800 text-brand-500'
                    : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
             {state.isAuthenticated && (
                 <button
                 onClick={() => {
                   dispatch({ type: 'LOGOUT' });
                   setIsOpen(false);
                 }}
                 className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-dark-800"
               >
                 <LogOut size={18} />
                 Logout
               </button>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-dark-900 border-t border-dark-700 py-8">
    <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
      <p className="font-display">© {new Date().getFullYear()} DevFolio. All rights reserved.</p>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-gray-100">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};