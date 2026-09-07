import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Heart, Shield, CheckCircle, Info, Home, User, Brain, Star, Award, BookOpen, LogOut, Quote, Search, Sun, Users } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { mockProfiles } from './mockData';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ProfileGrid from './components/ProfileGrid';
import AIMatchmaker from './components/AIMatchmaker';
import HoroscopeMatcher from './components/HoroscopeMatcher';
import SuccessStories from './components/SuccessStories';
import Membership from './components/Membership';
import AppDownload from './components/AppDownload';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import ChatWorkspace from './components/ChatWorkspace';
import AuthModal from './components/AuthModal';
import BottomNav from './components/BottomNav';
import MyProfileSection from './components/MyProfileSection';
import Dashboard from './components/Dashboard';
import DailyHoroscope from './components/DailyHoroscope';
import FullProfilePage from './components/FullProfilePage';
import ConnectionsCenter from './components/ConnectionsCenter';

import { SearchFilters, Profile } from './types';
import { AdminRoutes, AdminProviders } from './admin/AdminRoutes';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'heart';
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load and persist current logged in user from/to localStorage
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem('soulmate_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading current user from localStorage:', e);
      return null;
    }
  });

  // Sync current user changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('soulmate_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('soulmate_current_user');
    }
  }, [currentUser]);

  // Derived activeView based on router pathname
  const getActiveViewFromPath = (pathname: string): string => {
    if (pathname === '/' || pathname === '/dashboard') return 'home';
    if (pathname.startsWith('/profile/')) return 'profile-detail';
    const view = pathname.substring(1);
    return view || 'home';
  };

  const activeView = getActiveViewFromPath(location.pathname);

  // scrolledView is used when user is logged out to track the highlighted landing page section
  const [scrolledView, setScrolledView] = useState('home');

  const [matchmakerPreselectedProfile, setMatchmakerPreselectedProfile] = useState<Profile | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    gender: undefined,
    ageMin: 21,
    ageMax: 35,
    religion: '',
    caste: '',
    motherTongue: '',
    diet: '',
    manglik: '',
    familyValues: '',
    lifestyle: '',
    city: '',
    searchQuery: ''
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
    addNotification('Logged out securely. Come back soon for traditional matches!', 'info');
  };

  const handleLoginSuccess = (user: Profile) => {
    setCurrentUser(user);
    navigate('/');
    addNotification(`Welcome back, ${user.name}! Vedic Matchmaker, Horoscope Matcher & Premium features unlocked.`, 'success');
  };

  // Router-based navigation helper
  const handleNavigate = (viewId: string) => {
    if (viewId !== 'matchmaker') {
      setMatchmakerPreselectedProfile(null);
    }

    if (viewId === 'home') {
      navigate('/');
    } else {
      navigate(`/${viewId}`);
    }

    if (currentUser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Custom quick search trigger from Hero floating card
  const handleHeroSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    addNotification('Search preferences synced! Discovery updated.', 'info');
  };

  // Profile Action: Express Interest
  const handleExpressInterest = (profile: Profile) => {
    addNotification(`Your interest was sent to ${profile.name}! Parents notified.`, 'heart');
  };

  // Profile Action: Open Chat Drawer
  const handleOpenProfileChat = (profile: Profile) => {
    setChatProfile(profile);
    navigate('/chats');
    addNotification(`Secure Chat workspace opened with ${profile.name}.`, 'success');
  };

  // Open general counselor coach (Pundit AI)
  const handleOpenPunditChat = () => {
    setChatProfile(null);
    navigate('/chats');
    addNotification('Consulting Pundit Shastri AI Coach...', 'info');
  };

  // Launch AI Matchmaker with a preselected profile
  const handleRunMatchmaker = (profile: Profile) => {
    setMatchmakerPreselectedProfile(profile);
    navigate('/matchmaker');
    addNotification(`Selected ${profile.name} for AI Matchmaker comparison!`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Auth Modal
  const handleOpenAuth = (type: 'login' | 'register') => {
    setAuthType(type);
    setIsAuthOpen(true);
  };

  // Toast Notification System
  const addNotification = (message: string, type: 'success' | 'info' | 'heart') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 4.5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  // Scroll position watcher for logged-out landing page sections
  useEffect(() => {
    if (currentUser) return;

    const handleScrollHighlight = () => {
      const scrollPos = window.scrollY + 120;
      
      const sections = [
        { id: 'home', el: document.getElementById('hero-section') },
        { id: 'success-stories', el: document.getElementById('success-stories-section') },
        { id: 'blogs', el: document.getElementById('blog-section') }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.el && scrollPos >= sec.el.offsetTop) {
          setScrolledView(sec.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScrollHighlight);
    return () => window.removeEventListener('scroll', handleScrollHighlight);
  }, [currentUser]);

  // Smooth scroll auto-trigger on route changes for logged out landing page
  useEffect(() => {
    if (currentUser) return;

    const path = location.pathname;
    let targetId = '';
    if (path === '/success-stories') {
      targetId = 'success-stories-section';
    } else if (path === '/blogs') {
      targetId = 'blog-section';
    } else if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.pathname, currentUser]);

  // Scroll restoration on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Nested wrapper component to resolve full profile details via route parameters
  const ProfileDetailWrapper = () => {
    const { id } = useParams<{ id: string }>();
    const profile = mockProfiles.find(p => p.id === id);
    if (!profile) {
      return (
        <div className="text-center py-24 font-sans text-gray-500 font-medium">
          Profile not found
        </div>
      );
    }
    return (
      <FullProfilePage
        profile={profile}
        onBack={() => {
          navigate(-1);
        }}
        onOpenChat={handleOpenProfileChat}
        onExpressInterest={handleExpressInterest}
        onRunMatchmaker={handleRunMatchmaker}
        currentUser={currentUser}
        onUpdateCurrentUser={setCurrentUser}
        onAddNotification={addNotification}
        onUpgradeToPremium={() => handleNavigate('membership')}
      />
    );
  };

  // Auth Guard component for guest access on protected pages
  const GuestAuthPrompt = ({ title, description }: { title: string; description: string }) => (
    <div className="max-w-xl mx-auto py-20 px-6 text-center">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/60 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
          <Shield size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-poppins font-bold text-gray-900">{title}</h2>
          <p className="text-sm font-sans text-gray-600 mt-2 leading-relaxed">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleOpenAuth('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-poppins font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => handleOpenAuth('register')}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-poppins font-bold text-white bg-linear-to-r from-orange-500 via-amber-500 to-pink-500 hover:shadow-lg transition-all cursor-pointer"
          >
            Register Free
          </button>
        </div>
      </div>
    </div>
  );

  // Admin dashboard: rendered standalone without the public site chrome
  if (location.pathname.startsWith('/admin')) {
    return (
      <AdminProviders>
        <Routes>{AdminRoutes()}</Routes>
      </AdminProviders>
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-[#F9FAFB] font-sans relative antialiased text-[#111827] overflow-hidden">
      {/* Frosted Glass background blur blobs */}
      <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#F97316]/2 blur-[120px] rounded-full"></div>
        <div className="absolute top-[12%] -right-40 w-[500px] h-[500px] bg-[#EC4899]/2 blur-[120px] rounded-full"></div>
        <div className="absolute top-[28%] left-[-10%] w-[700px] h-[600px] bg-[#EAB308]/1.5 blur-[140px] rounded-full"></div>
        <div className="absolute top-[48%] right-[-10%] w-[600px] h-[600px] bg-[#F97316]/1.5 blur-[130px] rounded-full"></div>
        <div className="absolute top-[68%] left-[-20%] w-[500px] h-[500px] bg-[#EC4899]/2 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[2%] left-1/4 w-[700px] h-[400px] bg-[#EAB308]/2 blur-[100px] rounded-full"></div>
      </div>

      {/* Floating Glass Navbar - Hidden on desktop when logged in */}
      <div className={currentUser ? "lg:hidden" : ""}>
        <Navbar
          onNavigate={handleNavigate}
          activeView={currentUser ? activeView : activeView}
          onOpenAuth={handleOpenAuth}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Sections */}
      <main className="space-y-0">
        {currentUser ? (
          <div className="flex min-h-screen bg-[#F9FAFB] lg:pl-[270px]">
            {/* Desktop Left Sidebar */}
            <aside className="hidden lg:flex flex-col w-[270px] bg-white border-r border-gray-100 p-8 shrink-0 fixed top-0 bottom-0 left-0 z-30 justify-between">
              <div>
                <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => handleNavigate('home')}>
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#EC4899] text-white shadow-md">
                    <span className="font-bold text-lg">🕉</span>
                  </div>
                  <span className="font-poppins font-extrabold text-xl text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#EC4899]">
                    SoulMate
                  </span>
                </div>

                <nav className="space-y-1.5 text-left">
                  {[
                    { name: 'Dashboard', id: 'home', icon: <Home size={18} /> },
                    { name: 'My Profile', id: 'my-profile', icon: <User size={18} /> },
                    { name: 'Connections', id: 'connections', icon: <Users size={18} /> },
                    { name: 'Matches', id: 'search', icon: <Heart size={18} /> },
                    { name: 'Chats', id: 'chats', icon: <MessageSquare size={18} /> },
                    { name: 'AI Matchmaker', id: 'matchmaker', icon: <Brain size={18} /> },
                    { name: 'Kundli Milan', id: 'kundli', icon: <Star size={18} /> },
                    { name: 'Daily Horoscope', id: 'daily-horoscope', icon: <Sun size={18} /> },
                    { name: 'Premium & Billing', id: 'membership', icon: <Award size={18} /> },
                  ].map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide font-sans transition-all duration-200 cursor-pointer text-left ${
                          isActive
                            ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-md shadow-[#F97316]/15'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Logout button at the bottom */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide font-sans text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer text-left"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </aside>

            {/* Right main scrollable content area */}
            <div className="flex-1 flex flex-col min-h-screen py-24 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
              {/* Render Active View inside Sidebar layout */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <Routes>
                    <Route path="/" element={
                      <Dashboard
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onExpressInterest={handleExpressInterest}
                        onOpenChat={handleOpenProfileChat}
                        onAddNotification={addNotification}
                        onViewProfile={(profile) => {
                          navigate(`/profile/${profile.id}`);
                        }}
                        onUpdateUser={setCurrentUser}
                      />
                    } />
                    <Route path="/dashboard" element={
                      <Navigate to="/" replace />
                    } />
                    <Route path="/my-profile" element={
                      <MyProfileSection
                        currentUser={currentUser}
                        onUpdateUser={setCurrentUser}
                        onAddNotification={addNotification}
                      />
                    } />
                    <Route path="/search" element={
                      <ProfileGrid
                        initialFilters={searchFilters}
                        onOpenChat={handleOpenProfileChat}
                        onExpressInterest={handleExpressInterest}
                        currentUser={currentUser}
                        onViewProfile={(profile) => {
                          navigate(`/profile/${profile.id}`);
                        }}
                      />
                    } />
                    <Route path="/chats" element={
                      <ChatWorkspace
                        currentUser={currentUser}
                        onAddNotification={addNotification}
                        onUpgradeToPremium={() => handleNavigate('membership')}
                        onViewProfile={(profile) => {
                          navigate(`/profile/${profile.id}`);
                        }}
                        onRunMatchmaker={handleRunMatchmaker}
                        preselectedProfile={chatProfile}
                        onClearPreselectedProfile={() => setChatProfile(null)}
                      />
                    } />
                    <Route path="/matchmaker" element={
                      <AIMatchmaker
                        currentUser={currentUser}
                        selectedProfile={matchmakerPreselectedProfile}
                        onClearSelectedProfile={() => setMatchmakerPreselectedProfile(null)}
                      />
                    } />
                    <Route path="/kundli" element={
                      <HoroscopeMatcher />
                    } />
                    <Route path="/daily-horoscope" element={
                      <DailyHoroscope
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onAddNotification={addNotification}
                      />
                    } />
                    <Route path="/membership" element={
                      <Membership
                        currentUser={currentUser}
                        onUpdateUser={setCurrentUser}
                        onAddNotification={addNotification}
                        onOpenAuth={handleOpenAuth}
                      />
                    } />
                    <Route path="/connections" element={
                      <ConnectionsCenter
                        currentUser={currentUser}
                        onNavigate={handleNavigate}
                        onOpenChat={handleOpenProfileChat}
                        onAddNotification={addNotification}
                        onViewProfile={(profile) => {
                          navigate(`/profile/${profile.id}`);
                        }}
                      />
                    } />
                    <Route path="/success-stories" element={<SuccessStories />} />
                    <Route path="/blogs" element={<BlogSection />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/app-download" element={<AppDownload />} />
                    <Route path="/profile/:id" element={<ProfileDetailWrapper />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Routes>
                  <Route path="/" element={
                    <>
                      <Hero
                        onSearch={handleHeroSearch}
                        onNavigate={handleNavigate}
                      />
                      <Features />
                      <SuccessStories />
                      <AppDownload />
                      <BlogSection />
                    </>
                  } />
                  <Route path="/search" element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfileGrid
                        initialFilters={searchFilters}
                        onOpenChat={(profile) => {
                          handleOpenAuth('register');
                        }}
                        onExpressInterest={(profile) => {
                          handleOpenAuth('register');
                        }}
                        currentUser={null}
                        onViewProfile={(profile) => {
                          navigate(`/profile/${profile.id}`);
                        }}
                      />
                    </div>
                  } />
                  <Route path="/matchmaker" element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <AIMatchmaker
                        currentUser={null}
                        selectedProfile={matchmakerPreselectedProfile}
                        onClearSelectedProfile={() => setMatchmakerPreselectedProfile(null)}
                      />
                    </div>
                  } />
                  <Route path="/kundli" element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <HoroscopeMatcher />
                    </div>
                  } />
                  <Route path="/daily-horoscope" element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <DailyHoroscope
                        currentUser={null}
                        onNavigate={handleNavigate}
                        onAddNotification={addNotification}
                      />
                    </div>
                  } />
                  <Route path="/membership" element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Membership
                        currentUser={null}
                        onUpdateUser={setCurrentUser}
                        onAddNotification={addNotification}
                        onOpenAuth={handleOpenAuth}
                      />
                    </div>
                  } />
                  <Route path="/success-stories" element={
                    <div className="py-8">
                      <SuccessStories />
                    </div>
                  } />
                  <Route path="/blogs" element={
                    <div className="py-8">
                      <BlogSection />
                    </div>
                  } />
                  <Route path="/features" element={
                    <div className="py-8">
                      <Features />
                    </div>
                  } />
                  <Route path="/app-download" element={
                    <div className="py-8">
                      <AppDownload />
                    </div>
                  } />
                  <Route path="/profile/:id" element={
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <ProfileDetailWrapper />
                    </div>
                  } />
                  <Route path="/my-profile" element={
                    <GuestAuthPrompt
                      title="Access Your Profile"
                      description="Log in or register to set up your detailed matrimonial profile, horoscope preferences, and photo gallery."
                    />
                  } />
                  <Route path="/connections" element={
                    <GuestAuthPrompt
                      title="View Your Connections"
                      description="Create a free profile or sign in to track sent interests, shortlisted matches, and contact requests."
                    />
                  } />
                  <Route path="/chats" element={
                    <GuestAuthPrompt
                      title="Direct Chat Workspace"
                      description="Sign in to start private, parent-verified chat conversations with compatible matches and our Pundit Shastri AI coach."
                    />
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      {!currentUser && <Footer onNavigate={handleNavigate} />}

      {/* Mobile Sticky floating FAB for Pundit AI relationship coach */}
      <div className="fixed bottom-24 right-6 z-40 lg:bottom-6">
        <button
          id="btn-pundit-fab"
          onClick={handleOpenPunditChat}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-r from-orange-500 to-pink-500 text-white shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-transform duration-100 group cursor-pointer"
        >
          {/* Glowing pulse indicator */}
          <span className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping -z-10" />
          
          <MessageSquare size={22} className="group-hover:rotate-12 transition-transform" />
          
          {/* Tooltip on hover */}
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all bg-gray-900 text-white text-[10px] font-semibold tracking-wider uppercase font-poppins py-1.5 px-3 rounded-xl shadow-md whitespace-nowrap pointer-events-none">
            🕉 Chat with Pundit Shastri
          </span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Pill */}
      <BottomNav
        activeView={activeView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />

      {/* Chat sliding drawer widget (handles candidate simulated replies and Shastri advice) */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeProfile={chatProfile}
      />

      {/* Register/Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        type={authType}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Toast Alert Notifications panel */}
      <div
        id="toast-notifications-panel"
        className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-panel p-4 rounded-2xl flex items-start gap-3 border border-white/60 pointer-events-auto shadow-lg text-left"
            >
              <div className="mt-0.5">
                {notif.type === 'success' && <CheckCircle className="text-emerald-500" size={16} />}
                {notif.type === 'info' && <Info className="text-orange-500" size={16} />}
                {notif.type === 'heart' && <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={16} />}
              </div>
              <p className="text-xs text-gray-800 font-sans font-medium leading-relaxed flex-1">
                {notif.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
