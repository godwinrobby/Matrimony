import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Search, Shield, Phone, Video, Info, X, Lock, 
  Brain, User, MoreVertical, Sparkles, Check, CheckCheck, 
  Loader2, Mic, Image as ImageIcon, Calendar, Flame, 
  Bell, BellOff, ThumbsUp, CheckCircle, ShieldCheck, Heart, Star, Sun, MessageSquare,
  ArrowLeft, Mail, MapPin, Radio
} from 'lucide-react';
import { Profile, ChatMessage } from '../types';
import { mockProfiles } from '../mockData';
import CashfreePaymentModal from './CashfreePaymentModal';
import { realtimeChatService, RealtimeEvent } from '../lib/realtimeChat';

interface ChatWorkspaceProps {
  currentUser: Profile | null;
  onAddNotification: (message: string, type: 'success' | 'info' | 'heart') => void;
  onUpgradeToPremium?: () => void;
  onViewProfile?: (profile: Profile) => void;
  onRunMatchmaker?: (profile: Profile) => void;
  preselectedProfile?: Profile | null;
  onClearPreselectedProfile?: () => void;
}

interface ChatSession {
  profileId: string; // 'pundit-ai' or actual mockProfile id
  name: string;
  avatar: string;
  profession: string;
  caste: string;
  onlineStatus: 'Online' | 'Offline' | 'Recent';
  unreadCount: number;
}

export default function ChatWorkspace({
  currentUser,
  onAddNotification,
  onUpgradeToPremium,
  onViewProfile,
  onRunMatchmaker,
  preselectedProfile,
  onClearPreselectedProfile
}: ChatWorkspaceProps) {
  const [activeChatId, setActiveChatId] = useState<string>('pundit-ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  
  // Storage of chats: key is chat ID, value is message list
  const [allChats, setAllChats] = useState<{ [key: string]: ChatMessage[] }>(() => {
    try {
      const saved = localStorage.getItem('soulmate_chats_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading chats database:', e);
    }
    return {};
  });

  // Track unlocked contact IDs
  const [unlockedContacts, setUnlockedContacts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soulmate_unlocked_contacts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Contact unlocking states
  const [isContactPayOpen, setIsContactPayOpen] = useState(false);
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false);
  const [unlockTargetProfile, setUnlockTargetProfile] = useState<Profile | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(realtimeChatService.getMuted());

  // Listen for real-time events across windows/tabs/components
  useEffect(() => {
    const unsubscribe = realtimeChatService.subscribe((event: RealtimeEvent) => {
      if (event.type === 'NEW_MESSAGE') {
        const { chatId, message, isLocal } = event.payload;
        if (!isLocal) {
          setAllChats(prev => {
            const existing = prev[chatId] || [];
            if (existing.some(m => m.id === message.id)) return prev;
            return {
              ...prev,
              [chatId]: [...existing, message]
            };
          });

          if (message.receiverId === 'user') {
            realtimeChatService.playIncomingChime();
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync audio mute state
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    realtimeChatService.setMuted(next);
    onAddNotification(next ? 'Chat notification sounds muted' : 'Real-time Vedic audio chime enabled!', 'info');
  };

  // Sync chats to local storage
  useEffect(() => {
    localStorage.setItem('soulmate_chats_db', JSON.stringify(allChats));
  }, [allChats]);

  // Seed initial conversations if database is empty
  useEffect(() => {
    if (Object.keys(allChats).length === 0) {
      // Find 3 premium profiles to seed
      const seeds = mockProfiles.slice(0, 3);
      const initialDb: { [key: string]: ChatMessage[] } = {};

      // Seed Pundit Shastri
      initialDb['pundit-ai'] = [
        {
          id: 'pundit-1',
          senderId: 'pundit-ai',
          receiverId: 'user',
          text: 'Namaste! I am Pundit Shastri, your spiritual matrimonial coach. I am here to guide your journey regarding Guna Milan, Manglik remedies, Muhurat calculations, and holy Vedic marriage vows. How can I assist you and your family today?',
          timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true
        }
      ];

      // Seed profiles
      seeds.forEach((prof, idx) => {
        initialDb[prof.id] = [
          {
            id: `seed-${prof.id}-1`,
            senderId: prof.id,
            receiverId: 'user',
            text: `Namaste! I am ${prof.name}. I read through your profile interest and would love to initiate a conversation to understand our mutual values. I currently work as a ${prof.profession} in ${prof.location.city}. How is your day going?`,
            timestamp: new Date(Date.now() - 3600000 * (24 - idx * 4)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAi: true
          }
        ];
      });

      setAllChats(initialDb);
    }
  }, []);

  // Handle routing / preselected profile from "Chat Now" click on cards
  useEffect(() => {
    if (preselectedProfile) {
      const pId = preselectedProfile.id;
      
      // Ensure there is at least an initial welcome message
      setAllChats(prev => {
        if (!prev[pId]) {
          return {
            ...prev,
            [pId]: [
              {
                id: `welcome-${pId}-${Date.now()}`,
                senderId: pId,
                receiverId: 'user',
                text: `Namaste! I am ${preselectedProfile.name}. I saw your interest on my profile. Let's chat and get to know each other better!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isAi: true
              }
            ]
          };
        }
        return prev;
      });

      setActiveChatId(pId);
      setShowChatOnMobile(true);
      onAddNotification(`Chat focus switched to ${preselectedProfile.name}`, 'info');

      if (onClearPreselectedProfile) {
        onClearPreselectedProfile();
      }
    }
  }, [preselectedProfile]);

  // Scroll to bottom when message log changes or typing starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allChats, activeChatId, isTyping]);

  // Retrieve current active conversation's messages
  const currentMessages = allChats[activeChatId] || [];

  // Determine active profile details
  const activeProfile = mockProfiles.find(p => p.id === activeChatId) || null;

  // Compile list of available sessions
  const getSessionsList = (): ChatSession[] => {
    const list: ChatSession[] = [
      {
        profileId: 'pundit-ai',
        name: 'Pundit Shastri AI Coach',
        avatar: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&q=80&w=150&h=150', // wise elderly Indian scholar
        profession: 'Astrological Matrimonial Scholar',
        caste: 'Vedic Guide',
        onlineStatus: 'Online',
        unreadCount: 0
      }
    ];

    // Read other session entries
    Object.keys(allChats).forEach(id => {
      if (id === 'pundit-ai') return;
      const prof = mockProfiles.find(p => p.id === id);
      if (prof) {
        list.push({
          profileId: prof.id,
          name: prof.name,
          avatar: prof.image,
          profession: prof.profession,
          caste: prof.caste,
          onlineStatus: prof.activity?.onlineStatus || 'Online',
          unreadCount: 0 // Mock count, can be updated dynamically
        });
      }
    });

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return list.filter(s => s.name.toLowerCase().includes(query) || s.profession.toLowerCase().includes(query) || s.caste.toLowerCase().includes(query));
    }

    return list;
  };

  const sessions = getSessionsList();

  // Send a message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      senderId: 'user',
      receiverId: activeChatId,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Broadcast user message
    realtimeChatService.broadcast({
      type: 'NEW_MESSAGE',
      payload: { chatId: activeChatId, message: userMessage, isLocal: true }
    });

    // Update state synchronously
    const updatedMessages = [...currentMessages, userMessage];
    setAllChats(prev => ({
      ...prev,
      [activeChatId]: updatedMessages
    }));
    setInputMessage('');
    setIsTyping(true);

    // Simulate real-time transition to 'delivered'
    setTimeout(() => {
      setAllChats(prev => {
        const msgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: msgs.map(m => m.id === userMessage.id ? { ...m, status: 'delivered' } : m)
        };
      });
    }, 400);

    try {
      let responseText = '';
      if (activeChatId === 'pundit-ai') {
        const res = await fetch('/api/pundit-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages })
        });
        const data = await res.json();
        responseText = data.text;
      } else if (activeProfile) {
        const res = await fetch('/api/profile-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: activeProfile, messages: updatedMessages })
        });
        const data = await res.json();
        responseText = data.text;
      }

      // Transition tick to 'read' (double blue ticks) when response arrives
      setAllChats(prev => {
        const msgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: msgs.map(m => m.id === userMessage.id ? { ...m, status: 'read' } : m)
        };
      });

      // Append bot response
      const aiResponse: ChatMessage = {
        id: `ai-msg-${Date.now()}`,
        senderId: activeChatId,
        receiverId: 'user',
        text: responseText || 'Our cosmic connection is temporarily slow. Let\'s continue speaking very shortly!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true,
        status: 'read'
      };

      setAllChats(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), aiResponse]
      }));

      // Broadcast incoming real-time response & play chime
      realtimeChatService.broadcast({
        type: 'NEW_MESSAGE',
        payload: { chatId: activeChatId, message: aiResponse, isLocal: false }
      });
      realtimeChatService.playIncomingChime();

    } catch (e) {
      console.error('Error contacting chat endpoint:', e);
      setTimeout(() => {
        const errorResponse: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          senderId: activeChatId,
          receiverId: 'user',
          text: activeChatId === 'pundit-ai'
            ? 'Namaste. The celestial cosmic gateways are highly loaded right now, but remain patient and prayerful! I will guide you soon.'
            : `Thanks for the lovely message! I would love to tell you more about myself and my family roots, but I am a bit caught up at the moment. Let's catch up shortly!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true,
          status: 'read'
        };
        setAllChats(prev => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), errorResponse]
        }));

        realtimeChatService.broadcast({
          type: 'NEW_MESSAGE',
          payload: { chatId: activeChatId, message: errorResponse, isLocal: false }
        });
        realtimeChatService.playIncomingChime();
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    handleSendMessage(inputMessage);
  };

  // Quick chips triggers
  const getQuickReplies = () => {
    if (activeChatId === 'pundit-ai') {
      return [
        { label: '🌟 Guna Milan Guidelines', text: 'Pundit ji, what are the most critical Guna aspects to check for a long, happy, and prosperous marriage?' },
        { label: '☄️ Manglik Dosha Remedies', text: 'What are the traditional spiritual remedies and fasts to balance Manglik Dosha in a horoscope?' },
        { label: '📅 Auspicious Muhurthams', text: 'Pundit ji, how can we calculate auspicious dates (Subha Muhurtham / Nalla Neram) for introducing our families?' },
        { label: '📿 Sacred Wedding Vows', text: 'What are the seven sacred vows of a traditional Hindu wedding, and what do they signify?' }
      ];
    } else {
      return [
        { label: '👨‍👩‍👧‍👦 Discuss Family Roots', text: 'I would love to learn more about your family background, traditional values, and native place.' },
        { label: '💼 Career & Future Goals', text: 'What are your professional goals, and how do you plan to balance work-life harmony?' },
        { label: '🌌 Kundli & Horoscopes', text: 'Do your parents emphasize Horoscope matching? Let\'s discuss our Guna Milan or Star alignment!' },
        { label: '✈️ Settle Location Preferences', text: 'Are you open to moving, or do you prefer to settle down in your current city?' }
      ];
    }
  };

  // Direct contact unlock handler via Cashfree modal
  const handleTriggerContactUnlock = () => {
    if (!currentUser) {
      onAddNotification('Please log in or register to unlock contact coordinates.', 'info');
      return;
    }
    if (activeProfile) {
      if (isContactUnlocked) {
        setIsViewContactModalOpen(true);
        try {
          const viewedStr = localStorage.getItem('soulmate_viewed_contacts') || '[]';
          const viewedList = JSON.parse(viewedStr);
          if (Array.isArray(viewedList) && !viewedList.includes(activeProfile.id)) {
            viewedList.push(activeProfile.id);
            localStorage.setItem('soulmate_viewed_contacts', JSON.stringify(viewedList));
          }
        } catch {}
      } else {
        setUnlockTargetProfile(activeProfile);
        setIsContactPayOpen(true);
      }
    }
  };

  const handleUnlockPaymentSuccess = (txId: string) => {
    if (unlockTargetProfile) {
      const updated = [...unlockedContacts, unlockTargetProfile.id];
      setUnlockedContacts(updated);
      localStorage.setItem('soulmate_unlocked_contacts', JSON.stringify(updated));
      
      try {
        const viewedStr = localStorage.getItem('soulmate_viewed_contacts') || '[]';
        const viewedList = JSON.parse(viewedStr);
        if (Array.isArray(viewedList) && !viewedList.includes(unlockTargetProfile.id)) {
          viewedList.push(unlockTargetProfile.id);
          localStorage.setItem('soulmate_viewed_contacts', JSON.stringify(viewedList));
        }
      } catch {}

      setIsContactPayOpen(false);
      onAddNotification(`Verified direct contact coordinates for ${unlockTargetProfile.name} unlocked successfully!`, 'success');
    }
  };

  const isContactUnlocked = currentUser?.premiumFeatures?.premiumMember || unlockedContacts.includes(activeChatId);

  return (
    <div 
      className="fixed inset-0 sm:static z-30 bg-white flex flex-col sm:flex-row max-w-6xl mx-auto sm:bg-white sm:rounded-[32px] sm:border sm:border-gray-150 sm:overflow-hidden sm:shadow-xl h-[100dvh] sm:h-[680px]"
      id="chat-workspace-root"
    >
      {/* LEFT PANEL: Conversation list */}
      <div className={`${showChatOnMobile ? 'hidden sm:flex' : 'flex'} w-full sm:w-[320px] md:w-[350px] border-r border-gray-150 flex-col bg-gray-50/50 shrink-0 h-full pb-[80px] sm:pb-0`}>
        {/* Inbox Header */}
        <div className="p-5 border-b border-gray-150 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-black text-gray-900 text-lg flex items-center gap-2">
              <MessageSquare className="text-orange-500" size={20} />
              Conversations
            </h2>
            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-poppins">
              {sessions.length} Active
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search chats, castes, or professions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-sans"
              id="chat-search-input"
            />
          </div>
        </div>

        {/* Conversations List Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.map((session) => {
            const isActive = activeChatId === session.profileId;
            const isPundit = session.profileId === 'pundit-ai';
            
            // Get last message in history
            const history = allChats[session.profileId] || [];
            const lastMsg = history[history.length - 1];
            const lastText = lastMsg ? lastMsg.text : 'No messages yet';
            const lastTime = lastMsg ? lastMsg.timestamp : '';

            return (
              <button
                key={session.profileId}
                onClick={() => {
                  setActiveChatId(session.profileId);
                  setShowChatOnMobile(true);
                }}
                className={`w-full p-3.5 rounded-2xl flex items-start gap-3 transition-all duration-200 text-left cursor-pointer relative ${
                  isActive
                    ? 'bg-white shadow-md border border-gray-150 ring-2 ring-orange-500/10'
                    : 'hover:bg-white/60 border border-transparent'
                }`}
                id={`chat-session-item-${session.profileId}`}
              >
                {/* Avatar wrapper */}
                <div className="relative shrink-0">
                  {isPundit ? (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center text-white border-2 border-white shadow-sm">
                      <Brain size={20} className="animate-spin-slow" />
                    </div>
                  ) : (
                    <img
                      src={session.avatar}
                      alt={session.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 object-cover rounded-full border border-gray-200 shadow-xs"
                    />
                  )}
                  {session.onlineStatus === 'Online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-xs font-bold font-poppins truncate flex items-center gap-1 ${isActive ? 'text-orange-600' : 'text-gray-800'}`}>
                      {session.name}
                      {!isPundit && (
                        <ShieldCheck size={13} className="text-orange-500 fill-orange-100" />
                      )}
                    </h3>
                    <span className="text-[9px] font-medium text-gray-400 shrink-0 font-mono">
                      {lastTime}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 font-medium truncate mb-1">
                    {session.caste} • {session.profession}
                  </p>

                  <p className={`text-[11px] truncate leading-tight ${isActive ? 'text-gray-700 font-semibold' : 'text-gray-500'}`}>
                    {lastText}
                  </p>
                </div>
              </button>
            );
          })}

          {sessions.length === 0 && (
            <div className="py-12 px-4 text-center space-y-2">
              <Search size={24} className="text-gray-300 mx-auto" />
              <p className="text-xs font-bold text-gray-500">No conversations found</p>
              <p className="text-[10px] text-gray-400">Try searching for other names or caste criteria.</p>
            </div>
          )}
        </div>

        {/* Security / Quality lock note */}
        <div className="p-4 bg-white border-t border-gray-150 flex items-center gap-2 text-[10px] font-semibold text-gray-400 tracking-wide">
          <Shield size={13} className="text-emerald-500 shrink-0" />
          Secure 256-Bit Matrimonial Guard
        </div>
      </div>

      {/* RIGHT PANEL: Active chat space */}
      <div className={`${showChatOnMobile ? 'fixed inset-0 z-50 flex' : 'hidden sm:flex'} flex-1 flex-col bg-white overflow-hidden relative sm:static sm:z-auto`}>
        <AnimatePresence mode="wait">
          {activeChatId ? (
            <motion.div
              key={activeChatId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full justify-between"
            >
              {/* Active Conversation Header */}
              <div className="p-3 sm:p-4 border-b border-gray-150 flex items-center justify-between bg-white z-10 relative">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Mobile Back arrow */}
                  <button
                    onClick={() => setShowChatOnMobile(false)}
                    className="sm:hidden p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-100 rounded-xl transition-all shrink-0 cursor-pointer"
                    id="chat-mobile-back-btn"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  {activeChatId === 'pundit-ai' ? (
                    // Pundit Shastri Header
                    <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white border border-orange-200 shrink-0">
                        <Brain size={16} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-poppins font-black text-xs sm:text-sm text-gray-900 flex items-center gap-1 sm:gap-1.5 truncate">
                          Pundit Shastri AI Coach
                          <span className="text-[8px] sm:text-[9px] bg-orange-100 text-orange-600 px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                            Astrologer
                          </span>
                        </h3>
                        <p className="text-[9px] sm:text-[10px] text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                          Cosmic Presence Active
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Partner Profile Header
                    activeProfile && (
                      <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
                        <button 
                          onClick={() => onViewProfile && onViewProfile(activeProfile)}
                          className="relative cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                        >
                          <img
                            src={activeProfile.image}
                            alt={activeProfile.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 sm:w-11 sm:h-11 object-cover rounded-full border border-orange-200 shadow-sm"
                          />
                          <span className="absolute bottom-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                        </button>
                        <div className="min-w-0">
                          <h3 className="font-poppins font-black text-xs sm:text-sm text-gray-900 flex items-center gap-1 sm:gap-1.5 truncate">
                            {activeProfile.name}
                            <span className="text-[8px] sm:text-[9px] bg-emerald-50 text-emerald-600 px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-0.5 border border-emerald-100 shrink-0">
                              <CheckCircle size={8} className="fill-emerald-100" /> Verified
                            </span>
                          </h3>
                          <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                            {activeProfile.age} yrs • {activeProfile.caste} • {activeProfile.profession}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                    <Radio size={11} className="text-emerald-500 animate-pulse shrink-0" />
                    <span>Real-time Live</span>
                  </span>

                  <button
                    onClick={handleToggleMute}
                    className="p-2 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute chat chime sound' : 'Mute chat chime sound'}
                  >
                    {isMuted ? <BellOff size={14} className="text-gray-400" /> : <Bell size={14} className="text-orange-500 fill-orange-100" />}
                  </button>

                  {activeChatId !== 'pundit-ai' && activeProfile && (
                    <>
                      <button
                        onClick={() => onRunMatchmaker && onRunMatchmaker(activeProfile)}
                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 text-[11px] sm:text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer border border-pink-100"
                        title="Compare Astrology compatibility"
                      >
                        <Star size={12} className="fill-pink-200" />
                        <span className="hidden md:inline">Kundli Match</span>
                        <span className="md:hidden">Kundli</span>
                      </button>
                      
                      <button
                        onClick={handleTriggerContactUnlock}
                        className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                          isContactUnlocked
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : 'bg-[#5B21B6] text-white hover:bg-[#4C1D95]'
                        }`}
                      >
                        {isContactUnlocked ? (
                          <>
                            <CheckCircle size={12} />
                            <span className="hidden sm:inline">Contact Unlocked</span>
                            <span className="sm:hidden">Unlocked</span>
                          </>
                        ) : (
                          <>
                            <Lock size={11} />
                            <span className="hidden sm:inline">View Contact Info</span>
                            <span className="sm:hidden">Unlock</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Chat Messages Body Scroll Area */}
              <div className="flex-1 bg-gradient-to-b from-orange-50/15 via-white to-pink-50/10 p-3.5 sm:p-5 overflow-y-auto space-y-4 mandala-pattern text-left">
                {/* Privacy Badge info */}
                <div className="bg-orange-50/60 border border-orange-100/50 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-orange-950 leading-relaxed max-w-xl mx-auto">
                  <ShieldCheck size={20} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-orange-600">Secure Matrimonial Trust Shield</span>
                    Your communication is protected under 256-bit secure SSL filters. Contact credentials, horoscopes, and private albums are protected under parent privacy filters unless unlocked.
                  </div>
                </div>

                {currentMessages.map((msg, index) => {
                  const isUser = msg.senderId === 'user';
                  const isPundit = msg.senderId === 'pundit-ai';
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Little Avatar near message */}
                        {!isUser && (
                          <div className="shrink-0 mt-1">
                            {isPundit ? (
                              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                                📿
                              </div>
                            ) : (
                              <img
                                src={activeProfile?.image}
                                alt={activeProfile?.name}
                                className="w-8 h-8 object-cover rounded-full border border-orange-200 shadow-xs"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                        )}

                        <div className="space-y-1">
                          <div
                            className={`p-3.5 rounded-[20px] text-xs leading-relaxed shadow-sm relative ${
                              isUser
                                ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-pink-500 text-white rounded-tr-none'
                                : isPundit
                                ? 'bg-[#FFFBEB] text-amber-950 border border-amber-150 rounded-tl-none'
                                : 'bg-white text-gray-800 border border-gray-150 rounded-tl-none'
                            }`}
                          >
                            <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                            
                            <div className="flex items-center justify-end gap-1 mt-1.5">
                              <span
                                className={`text-[9px] font-medium ${
                                  isUser ? 'text-orange-100' : 'text-gray-400'
                                }`}
                              >
                                {msg.timestamp}
                              </span>
                              {isUser && (
                                <span className="inline-flex items-center">
                                  {msg.status === 'read' ? (
                                    <CheckCheck size={13} className="text-sky-200 stroke-[2.5]" title="Read" />
                                  ) : msg.status === 'delivered' ? (
                                    <CheckCheck size={13} className="text-orange-200" title="Delivered" />
                                  ) : (
                                    <Check size={13} className="text-orange-200" title="Sent" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typist simulator active */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[80%] items-start">
                      <div className="shrink-0">
                        {activeChatId === 'pundit-ai' ? (
                          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                            📿
                          </div>
                        ) : (
                          <img
                            src={activeProfile?.image}
                            alt={activeProfile?.name}
                            className="w-8 h-8 object-cover rounded-full border"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div className="bg-white border border-gray-200 rounded-[20px] rounded-tl-none p-3 shadow-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1 font-sans">
                            {activeChatId === 'pundit-ai' ? 'Pundit Shastri is writing guidance...' : `${activeProfile?.name} is writing...`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Icebreakers / Replies suggestions */}
              <div className="px-3 py-2 sm:px-5 sm:pt-3 bg-white border-t border-gray-100">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-left">
                  ⚡ Matrimonial Icebreakers (Tap to Send)
                </span>
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none max-w-full -mx-3 px-3 sm:mx-0 sm:px-0">
                  {getQuickReplies().map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(chip.text)}
                      className={`px-3 py-2 border rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        activeChatId === 'pundit-ai'
                          ? 'border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100'
                          : 'border-orange-200 bg-orange-50 text-orange-950 hover:bg-orange-100'
                      }`}
                      id={`chat-quick-chip-${i}`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input form box */}
              <form 
                onSubmit={handleFormSubmit}
                className="p-2 sm:p-3 bg-gray-50/80 border-t border-gray-150 flex items-center gap-2 sticky bottom-0 z-20 backdrop-blur-md"
                id="chat-send-form"
              >
                <div className="flex-1 flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 shadow-xs">
                  {/* Media trigger mock */}
                  <button
                    type="button"
                    onClick={() => onAddNotification('Image and document sharing is protected. Upgrade to premium to exchange Kundlis or ID proofs directly.', 'info')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 shrink-0"
                    title="Share photos or documents"
                  >
                    <ImageIcon size={18} />
                  </button>

                  {/* Voice trigger mock */}
                  <button
                    type="button"
                    onClick={() => onAddNotification('Voice messages are enabled for verified premium users only.', 'info')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 shrink-0"
                    title="Send voice message"
                  >
                    <Mic size={18} />
                  </button>

                  {/* Message text input */}
                  <input
                    type="text"
                    placeholder={
                      activeChatId === 'pundit-ai'
                        ? 'Ask Pundit Shastri...'
                        : `Type message to ${activeProfile?.name}...`
                    }
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 py-2 px-1 text-[13px] sm:text-xs outline-none bg-transparent font-sans"
                    id="chat-message-text-input"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-transform duration-100 active:scale-95 flex items-center justify-center shrink-0"
                  id="chat-submit-btn"
                >
                  <Send size={15} className="ml-0.5" />
                </button>
              </form>
            </motion.div>
          ) : (
            // No chat selected empty state
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                <MessageSquare size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-poppins font-black text-gray-900 text-base">Select a Matrimonial Chat</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Discuss family roots, horoscopes, career compatibility, and wedding desires in a highly secure, private platform. Select a verified conversation to start.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Contact Unlock modal integration */}
        {activeProfile && (
          <CashfreePaymentModal
            isOpen={isContactPayOpen}
            onClose={() => setIsContactPayOpen(false)}
            onPaymentSuccess={handleUnlockPaymentSuccess}
            amount={299}
            planName={`Verified Matrimonial Contact Unlock: ${activeProfile.name}`}
            customerName={currentUser?.name || ''}
            customerEmail={currentUser?.contactInfo?.email || 'customer@soulmate.in'}
            customerPhone={currentUser?.contactInfo?.mobileNumber || '9999999999'}
          />
        )}

        {/* Contact Details Viewer Modal */}
        {activeProfile && isViewContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden text-left"
            >
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-white shrink-0" />
                  <div>
                    <h3 className="font-poppins font-black text-sm uppercase tracking-wider">Contact Coordinates</h3>
                    <p className="text-[10px] text-emerald-100">Verified Direct Communication Channel</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewContactModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-all cursor-pointer text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs">
                  <span className="font-bold">✨ Connected Profile: {activeProfile.name}</span>
                </div>

                <div className="space-y-3.5">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Mobile Phone</span>
                    <span className="text-xs font-mono font-black text-gray-800">{activeProfile.contactInfo?.mobileNumber || activeProfile.contactNumber || '+91 98405 12345'}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">WhatsApp Number</span>
                    <span className="text-xs font-mono font-black text-gray-800">{activeProfile.contactInfo?.whatsAppNumber || activeProfile.contactNumber || '+91 98405 12345'}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">E-mail Address</span>
                    <span className="text-xs font-bold text-gray-800">{activeProfile.contactInfo?.email || `${activeProfile.name.toLowerCase().replace(/\s+/g, '')}@soulmate.in`}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Residential Coordinates</span>
                    <span className="text-xs font-semibold text-gray-700 leading-relaxed block">
                      {activeProfile.contactInfo?.currentAddress || `Plot 14, 2nd Main Road, Adyar, Chennai - 600020`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsViewContactModalOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-poppins font-black text-xs rounded-xl tracking-wider hover:opacity-95 transition-all cursor-pointer text-center"
                >
                  Close Coordinates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
