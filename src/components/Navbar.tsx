import { useState, useEffect } from 'react';
import { Menu, X, Landmark, ShieldCheck, Heart, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile } from '../types';

interface NavbarProps {
  onNavigate: (view: string) => void;
  activeView: string;
  onOpenAuth: (type: 'login' | 'register') => void;
  currentUser: Profile | null;
  onLogout: () => void;
}

export default function Navbar({ onNavigate, activeView, onOpenAuth, currentUser, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = currentUser
    ? [
        { name: 'Dashboard', id: 'home' },
        { name: 'Connections', id: 'connections' },
        { name: 'Match Discovery', id: 'search' },
        { name: 'Chats', id: 'chats' },
        { name: 'AI Matchmaker', id: 'matchmaker' },
        { name: 'Kundli Milan', id: 'kundli' },
        { name: 'Daily Horoscope', id: 'daily-horoscope' },
        { name: 'Premium & Billing', id: 'membership' },
        { name: 'My Profile', id: 'my-profile' }
      ]
    : [
        { name: 'Home', id: 'home' },
        { name: 'Success Stories', id: 'success-stories' },
        { name: 'Blogs', id: 'blogs' }
      ];

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 px-4 md:px-8 max-w-7xl mx-auto top-3 rounded-full border border-white/30 shadow-lg bg-white/70 backdrop-blur-md'
            : 'py-5 px-6 md:px-12 bg-white/40 backdrop-blur-md border-b border-white/20'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            id="nav-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-yellow-500 text-white shadow-md shadow-orange-500/20">
              {/* Sacred Lotus / Temple Silhouette styled SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6 animate-pulse-glow"
              >
                <path d="M12 2C12 2 9 8 9 11C9 14.3137 10.3431 16 12 16C13.6569 16 15 14.3137 15 11C15 8 12 2 12 2Z" />
                <path d="M12 5C12 5 7 10 7 13C7 16 9 18 12 18C15 18 17 16 17 13C17 10 12 5 12 5Z" />
                <path d="M12 8C12 8 5 13 5 15C5 18 8 20 12 20C16 20 19 18 19 15C19 13 12 8 12 8Z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block font-poppins font-bold text-lg tracking-tight text-gray-900 group-hover:text-orange-500 transition-colors">
                Hindu Matrimony
              </span>
              <span className="block text-[10px] font-medium text-amber-600 tracking-widest uppercase">
                Trust & Tradition
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-full font-sans text-sm font-medium transition-all cursor-pointer ${
                  activeView === item.id
                    ? 'text-orange-600 bg-orange-500/10'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-gray-100/50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* User Auth Buttons / Profile Panel */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white/65 border border-white/50 py-1.5 pl-2 pr-4 rounded-full shadow-xs">
                <button 
                  onClick={() => onNavigate('my-profile')}
                  className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={currentUser.image}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-orange-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900 font-sans line-clamp-1 flex items-center gap-1">
                      {currentUser.name}
                      <ShieldCheck size={12} className="text-orange-500 fill-orange-500/10" />
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium font-sans uppercase tracking-wider">
                      {currentUser.caste}
                    </div>
                  </div>
                </button>
                <button
                  id="navbar-btn-logout"
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 rounded-full hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer ml-1"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  id="navbar-btn-login"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-poppins font-medium text-gray-700 hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="navbar-btn-register"
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2 text-sm font-poppins font-medium text-white bg-linear-to-r from-orange-500 via-amber-500 to-pink-500 rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Register Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburguer */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-gray-700 hover:text-orange-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Slide-Over */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          >
            <motion.div
              id="mobile-drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M12 2C12 2 9 8 9 11C9 14.3137 10.3431 16 12 16C13.6569 16 15 14.3137 15 11C15 8 12 2 12 2Z" />
                      </svg>
                    </div>
                    <span className="font-poppins font-bold text-md text-gray-900">Hindu Matrimony</span>
                  </div>
                  <button
                    id="mobile-drawer-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      id={`mobile-nav-link-${item.id}`}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left px-4 py-3 rounded-xl font-sans text-base font-semibold transition-all ${
                        activeView === item.id
                          ? 'text-orange-600 bg-orange-50/80'
                          : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img
                        src={currentUser.image}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-orange-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left">
                        <div className="text-sm font-bold text-gray-900 font-sans leading-none flex items-center gap-1">
                          {currentUser.name}
                          <ShieldCheck size={14} className="text-orange-500" />
                        </div>
                        <div className="text-xs text-gray-400 font-medium font-sans mt-1">
                          {currentUser.caste} • {currentUser.location.city}
                        </div>
                      </div>
                    </div>
                    <button
                      id="mobile-btn-logout"
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 text-center font-poppins font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100/50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      id="mobile-btn-login"
                      onClick={() => {
                        onOpenAuth('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 text-center font-poppins font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Login
                    </button>
                    <button
                      id="mobile-btn-register"
                      onClick={() => {
                        onOpenAuth('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 text-center font-poppins font-semibold text-white bg-linear-to-r from-orange-500 via-amber-500 to-pink-500 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                    >
                      Register Free
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
