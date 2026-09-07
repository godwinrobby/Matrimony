import { Home, Search, MessageSquare, Brain, User } from 'lucide-react';
import { Profile } from '../types';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUser: Profile | null;
}

export default function BottomNav({ activeView, onNavigate, currentUser }: BottomNavProps) {
  const tabs = currentUser
    ? [
        { id: 'home', label: 'Dashboard', icon: <Home size={18} /> },
        { id: 'search', label: 'Matches', icon: <Search size={18} /> },
        { id: 'chats', label: 'Chats', icon: <MessageSquare size={18} /> },
        { id: 'matchmaker', label: 'AI Match', icon: <Brain size={18} /> },
        { id: 'my-profile', label: 'Profile', icon: <User size={18} /> }
      ]
    : [
        { id: 'home', label: 'Home', icon: <Home size={18} /> }
      ];

  return (
    <div
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl py-2 px-3 flex justify-around items-center"
    >
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            id={`bottom-tab-${tab.id}`}
            onClick={() => {
              onNavigate(tab.id);
              // scroll to top or respective section
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-orange-500 bg-orange-50/50 font-bold'
                : 'text-gray-500 hover:text-orange-400'
            }`}
          >
            <div className={`mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-sans font-medium tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
