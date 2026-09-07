import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Crown, UserPlus, Send, XCircle, Trash2, 
  CheckCircle, Clock, ShieldCheck, ArrowRight, Star,
  Phone, Search, Filter, Sparkles, MessageCircle,
  Eye, RefreshCw, Bookmark, X, PhoneCall, MessageSquare,
  ChevronRight, Award, Compass, Share2, Check, User
} from 'lucide-react';
import { Profile } from '../types';
import { mockProfiles } from '../mockData';

interface ConnectionsCenterProps {
  currentUser: Profile | null;
  onNavigate: (viewId: string) => void;
  onOpenChat: (profile: Profile) => void;
  onAddNotification: (message: string, type: 'success' | 'info' | 'heart') => void;
  onViewProfile: (profile: Profile) => void;
}

interface ReceivedItem {
  id: string;
  status: 'pending' | 'accepted';
  date: string;
  note?: string;
  gunaScore?: number;
}

interface SentItem {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  date: string;
  gunaScore?: number;
}

interface RejectedItem {
  id: string;
  reason: string;
  date: string;
}

export default function ConnectionsCenter({
  currentUser,
  onNavigate,
  onOpenChat,
  onAddNotification,
  onViewProfile
}: ConnectionsCenterProps) {
  // Tab State
  const [hubTab, setHubTab] = useState<'received' | 'sent' | 'shortlisted' | 'viewed' | 'rejected'>('received');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'guna' | 'age'>('recent');

  // Modal States
  const [declineTarget, setDeclineTarget] = useState<Profile | null>(null);
  const [declineReason, setDeclineReason] = useState('Guna compatibility below preference threshold');
  const [customDeclineNote, setCustomDeclineNote] = useState('');
  
  const [kundliPreviewProfile, setKundliPreviewProfile] = useState<Profile | null>(null);

  // Viewed Contacts State
  const [hubViewed, setHubViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soulmate_viewed_contacts');
      return saved ? JSON.parse(saved) : ['p1', 'p2'];
    } catch {
      return ['p1', 'p2'];
    }
  });

  // Shortlisted IDs State
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soulmate_shortlisted_ids');
      if (saved) return JSON.parse(saved);
    } catch {}
    const isMale = currentUser?.gender === 'Groom';
    return isMale ? ['p1', 'p3', 'p5'] : ['p2', 'p4', 'p6'];
  });

  // Received Interests State
  const [hubReceived, setHubReceived] = useState<ReceivedItem[]>(() => {
    try {
      const saved = localStorage.getItem('soulmate_hub_received');
      if (saved) return JSON.parse(saved);
    } catch {}
    
    const isMale = currentUser?.gender === 'Groom';
    return isMale 
      ? [
          { id: 'p1', status: 'pending', date: 'Yesterday, 04:15 PM', gunaScore: 32, note: 'Parents expressed interest after viewing your M.S. degree & Vadama Iyer ancestral heritage.' },
          { id: 'p3', status: 'pending', date: '2 days ago, 10:30 AM', gunaScore: 29, note: 'Both horoscopes show favorable Jupiter transit for 2026.' }
        ]
      : [
          { id: 'p2', status: 'pending', date: 'Yesterday, 04:15 PM', gunaScore: 34, note: 'Family interested in software engineering profile with Anna University background.' },
          { id: 'p4', status: 'pending', date: '2 days ago, 10:30 AM', gunaScore: 31, note: 'Horoscope alignment approved by family Pundit.' }
        ];
  });

  // Sent Interests State
  const [hubSent, setHubSent] = useState<SentItem[]>(() => {
    try {
      const saved = localStorage.getItem('soulmate_hub_sent');
      if (saved) return JSON.parse(saved);
    } catch {}

    try {
      const existingSent = localStorage.getItem('soulmate_interests_sent');
      if (existingSent) {
        const parsed = JSON.parse(existingSent);
        if (parsed && parsed.length > 0) {
          return parsed.map((pid: string) => ({ id: pid, status: 'pending', date: 'Just now', gunaScore: 30 }));
        }
      }
    } catch {}
    
    const isMale = currentUser?.gender === 'Groom';
    return isMale
      ? [
          { id: 'p5', status: 'pending', date: '3 days ago, 02:40 PM', gunaScore: 31 },
          { id: 'p7', status: 'accepted', date: '1 week ago', gunaScore: 33 }
        ]
      : [
          { id: 'p6', status: 'pending', date: '3 days ago, 02:40 PM', gunaScore: 28 },
          { id: 'p8', status: 'accepted', date: '1 week ago', gunaScore: 35 }
        ];
  });

  // Rejected Items State
  const [hubRejected, setHubRejected] = useState<RejectedItem[]>(() => {
    try {
      const saved = localStorage.getItem('soulmate_hub_rejected');
      if (saved) return JSON.parse(saved);
    } catch {}
    const isMale = currentUser?.gender === 'Groom';
    return isMale
      ? [{ id: 'p9', reason: 'Declined - Guna compatibility below preference threshold (14/36)', date: '4 days ago' }]
      : [{ id: 'p10', reason: 'Declined - Locational preference mismatch', date: '4 days ago' }];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('soulmate_hub_received', JSON.stringify(hubReceived));
  }, [hubReceived]);

  useEffect(() => {
    localStorage.setItem('soulmate_hub_sent', JSON.stringify(hubSent));
    try {
      const pids = hubSent.map(item => item.id);
      localStorage.setItem('soulmate_interests_sent', JSON.stringify(pids));
    } catch {}
  }, [hubSent]);

  useEffect(() => {
    localStorage.setItem('soulmate_hub_rejected', JSON.stringify(hubRejected));
  }, [hubRejected]);

  useEffect(() => {
    localStorage.setItem('soulmate_shortlisted_ids', JSON.stringify(shortlistedIds));
  }, [shortlistedIds]);

  useEffect(() => {
    localStorage.setItem('soulmate_viewed_contacts', JSON.stringify(hubViewed));
  }, [hubViewed]);

  // Synchronize external Express Interest clicks
  useEffect(() => {
    try {
      const saved = localStorage.getItem('soulmate_interests_sent');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHubSent(prev => {
            const prevIds = prev.map(p => p.id);
            const newItems = parsed
              .filter(id => !prevIds.includes(id))
              .map(id => ({ id, status: 'pending' as const, date: 'Just now', gunaScore: 30 }));
            if (newItems.length > 0) {
              return [...newItems, ...prev];
            }
            return prev;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Helper function to toggle shortlist
  const handleToggleShortlist = (profileId: string) => {
    if (shortlistedIds.includes(profileId)) {
      setShortlistedIds(prev => prev.filter(id => id !== profileId));
      onAddNotification('Removed profile from your Shortlisted matches.', 'info');
    } else {
      setShortlistedIds(prev => [...prev, profileId]);
      onAddNotification('Added profile to your Shortlisted matches!', 'heart');
    }
  };

  // Helper to accept received request
  const handleAcceptReceived = (item: ReceivedItem) => {
    const p = mockProfiles.find(x => x.id === item.id);
    if (!p) return;
    
    setHubReceived(prev => prev.filter(x => x.id !== item.id));
    setHubSent(prev => [
      { id: item.id, status: 'accepted', date: 'Accepted Just Now', gunaScore: item.gunaScore || 32 },
      ...prev
    ]);
    if (!hubViewed.includes(item.id)) {
      setHubViewed(prev => [...prev, item.id]);
    }

    onAddNotification(`Congratulations! You accepted ${p.name}'s suitor proposal. Direct chat is now open.`, 'success');
    setTimeout(() => onOpenChat(p), 600);
  };

  // Helper to confirm decline
  const handleConfirmDecline = () => {
    if (!declineTarget) return;
    const finalReason = customDeclineNote.trim() ? customDeclineNote : declineReason;

    setHubReceived(prev => prev.filter(x => x.id !== declineTarget.id));
    setHubRejected(prev => [
      { id: declineTarget.id, reason: finalReason, date: 'Just now' },
      ...prev
    ]);

    onAddNotification(`Politely declined interest from ${declineTarget.name}.`, 'info');
    setDeclineTarget(null);
    setCustomDeclineNote('');
  };

  // Helper to filter & sort list items
  function filterAndSortProfiles<T extends { id: string }>(
    items: T[],
    getProfile: (item: T) => Profile | undefined
  ): T[] {
    const list = items.filter(item => {
      const p = getProfile(item);
      if (!p) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.caste.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        (p.subCaste && p.subCaste.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'guna') {
      return [...list].sort((a, b) => {
        const pa = getProfile(a);
        const pb = getProfile(b);
        return (pb?.id ? 32 : 0) - (pa?.id ? 32 : 0);
      });
    } else if (sortBy === 'age') {
      return [...list].sort((a, b) => {
        const pa = getProfile(a);
        const pb = getProfile(b);
        return (pa?.age || 0) - (pb?.age || 0);
      });
    }

    return list;
  }

  return (
    <section id="connections-center-section" className="pb-24 bg-transparent relative overflow-hidden font-sans text-left">
      <div className="max-w-7xl mx-auto px-1 space-y-6">
        
        {/* TOP HEADER & METRICS BANNER */}
        <div className="glass-card bg-white/80 backdrop-blur-md border border-white/60 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 font-poppins text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles size={13} /> Vedic Connections Hub
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-poppins text-xs font-bold rounded-full flex items-center gap-1">
                  <ShieldCheck size={13} /> Parent Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 tracking-tight">
                Family Proposals &amp; Suitor Ledger
              </h1>
              <p className="text-xs sm:text-sm font-sans text-gray-500">
                Manage incoming parent suitor proposals, track sent invitations, review shortlisted matches, and access verified family contact cards.
              </p>
            </div>

            {/* Membership Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 px-4 py-2.5 rounded-2xl border border-amber-500/20 shrink-0 self-start lg:self-center">
              <Crown size={18} className="text-amber-500 animate-pulse fill-amber-500/10" />
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Current Membership</p>
                <p className="text-xs font-poppins font-black text-amber-900">
                  {currentUser?.premiumFeatures?.premiumMember ? 'Royal VIP Lifetime Pass' : 'Standard Vedic Gold'}
                </p>
              </div>
            </div>
          </div>


        </div>

        {/* MAIN AREA */}
        <div className="space-y-6">
          
          {/* NAVIGATION TABS BAR */}
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setHubTab('received')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    hubTab === 'received' 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserPlus size={14} />
                  <span>Received</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    hubTab === 'received' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {hubReceived.length}
                  </span>
                </button>

                <button
                  onClick={() => setHubTab('sent')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    hubTab === 'sent' 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Send size={14} />
                  <span>Sent</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    hubTab === 'sent' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {hubSent.length}
                  </span>
                </button>

                <button
                  onClick={() => setHubTab('shortlisted')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    hubTab === 'shortlisted' 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bookmark size={14} />
                  <span>Shortlisted</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    hubTab === 'shortlisted' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {shortlistedIds.length}
                  </span>
                </button>

                <button
                  onClick={() => setHubTab('viewed')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    hubTab === 'viewed' 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Phone size={14} />
                  <span>Unlocked Contacts</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    hubTab === 'viewed' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {hubViewed.length}
                  </span>
                </button>

                <button
                  onClick={() => setHubTab('rejected')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    hubTab === 'rejected' 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <XCircle size={14} />
                  <span>Archived</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    hubTab === 'rejected' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {hubRejected.length}
                  </span>
                </button>
              </div>
            </div>

            {/* SEARCH & FILTER CONTROLS BAR */}
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by candidate, caste, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-sans text-gray-700 font-medium focus:outline-hidden focus:border-orange-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="guna">Highest Guna Score</option>
                  <option value="age">Age (Youngest)</option>
                </select>
              </div>
            </div>

            {/* CONTENT PANELS CONTAINER */}
            <div className="glass-card bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/60 shadow-xs min-h-[420px]">
              <AnimatePresence mode="wait">
                
                {/* 1. RECEIVED TAB */}
                {hubTab === 'received' && (
                  <motion.div
                    key="received-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <h3 className="font-poppins font-bold text-sm text-gray-900 flex items-center gap-2">
                        <UserPlus size={16} className="text-orange-500" />
                        Incoming Proposals seeking your candidate
                      </h3>
                      <span className="text-xs text-gray-400 font-medium">Showing {hubReceived.length} requests</span>
                    </div>

                    {hubReceived.length === 0 ? (
                      <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <Heart size={44} className="mx-auto text-gray-300 animate-pulse" />
                        <p className="text-sm font-poppins font-bold text-gray-600">No Pending Proposals</p>
                        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                          Parent proposals seeking matrimonial alliance will appear here. Enhance your bio and complete Kundli details to boost matching requests!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filterAndSortProfiles<ReceivedItem>(hubReceived, item => mockProfiles.find(x => x.id === item.id)).map((item: ReceivedItem) => {
                          const p = mockProfiles.find(x => x.id === item.id);
                          if (!p) return null;
                          const isShortlisted = shortlistedIds.includes(p.id);

                          return (
                            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                              <div className="flex gap-4">
                                <div className="relative shrink-0 cursor-pointer" onClick={() => onViewProfile(p)}>
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 shadow-2xs"
                                    referrerPolicy="no-referrer"
                                  />
                                  {p.verified && (
                                    <span className="absolute -bottom-1 -right-1 p-1 bg-orange-500 text-white rounded-full border border-white">
                                      <ShieldCheck size={11} />
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4 
                                      onClick={() => onViewProfile(p)}
                                      className="font-poppins font-bold text-gray-900 text-sm hover:text-orange-600 cursor-pointer truncate"
                                    >
                                      {p.name}
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleShortlist(p.id)}
                                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                        isShortlisted ? 'bg-rose-50 text-rose-600' : 'text-gray-300 hover:text-gray-500'
                                      }`}
                                      title={isShortlisted ? 'Remove from shortlist' : 'Bookmark profile'}
                                    >
                                      <Bookmark size={14} className={isShortlisted ? 'fill-rose-500' : ''} />
                                    </button>
                                  </div>

                                  <p className="text-xs text-gray-500 font-medium truncate">
                                    {p.age} Yrs • {p.height} • {p.caste} ({p.subCaste || 'Subcaste Verified'})
                                  </p>
                                  <p className="text-[11px] text-gray-400 truncate">
                                    {p.profession} • {p.salary} • {p.location.city}
                                  </p>

                                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-md text-[10px] font-bold flex items-center gap-1">
                                      <Sparkles size={11} className="text-amber-600" />
                                      {item.gunaScore || 32}/36 Gunas
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setKundliPreviewProfile(p)}
                                      className="text-[10px] font-poppins font-bold text-orange-600 hover:underline cursor-pointer"
                                    >
                                      View Kundli Milan
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {item.note && (
                                <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100 text-[11px] text-gray-700 italic font-sans leading-relaxed">
                                  &ldquo;{item.note}&rdquo;
                                </div>
                              )}

                              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAcceptReceived(item)}
                                  className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-xs text-white text-xs font-poppins font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <Check size={14} /> Accept &amp; Chat
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeclineTarget(p)}
                                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-poppins font-semibold rounded-xl transition-all cursor-pointer"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. SENT TAB */}
                {hubTab === 'sent' && (
                  <motion.div
                    key="sent-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <h3 className="font-poppins font-bold text-sm text-gray-900 flex items-center gap-2">
                        <Send size={16} className="text-orange-500" />
                        Invitations sent to prospective matches
                      </h3>
                      <span className="text-xs text-gray-400 font-medium">Total: {hubSent.length}</span>
                    </div>

                    {hubSent.length === 0 ? (
                      <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <Send size={44} className="mx-auto text-gray-300 animate-bounce" />
                        <p className="text-sm font-poppins font-bold text-gray-600">No Sent Invitations</p>
                        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                          Profiles you express interest in will be tracked here in real-time. Discover matches on our Find Matches page!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filterAndSortProfiles<SentItem>(hubSent, item => mockProfiles.find(x => x.id === item.id)).map((item: SentItem) => {
                          const p = mockProfiles.find(x => x.id === item.id);
                          if (!p) return null;
                          const isShortlisted = shortlistedIds.includes(p.id);

                          return (
                            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                              <div className="flex gap-4">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 cursor-pointer"
                                  onClick={() => onViewProfile(p)}
                                  referrerPolicy="no-referrer"
                                />

                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4 
                                      onClick={() => onViewProfile(p)}
                                      className="font-poppins font-bold text-gray-900 text-sm hover:text-orange-600 cursor-pointer truncate"
                                    >
                                      {p.name}
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleShortlist(p.id)}
                                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                        isShortlisted ? 'bg-rose-50 text-rose-600' : 'text-gray-300 hover:text-gray-500'
                                      }`}
                                    >
                                      <Bookmark size={14} className={isShortlisted ? 'fill-rose-500' : ''} />
                                    </button>
                                  </div>

                                  <p className="text-xs text-gray-500 font-medium truncate">
                                    {p.age} Yrs • {p.profession} • {p.location.city}
                                  </p>

                                  <div className="flex items-center gap-2 pt-1">
                                    {item.status === 'accepted' ? (
                                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200 flex items-center gap-1">
                                        <CheckCircle size={11} /> Suitor Accepted
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-200 flex items-center gap-1 animate-pulse">
                                        <Clock size={11} /> Under Family Review
                                      </span>
                                    )}
                                    <span className="text-[10px] text-gray-400">{item.date}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                {item.status === 'accepted' ? (
                                  <button
                                    type="button"
                                    onClick={() => onOpenChat(p)}
                                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-poppins font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                  >
                                    <MessageCircle size={14} /> Start Family Chat
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setHubSent(prev => prev.filter(x => x.id !== item.id));
                                      onAddNotification(`Withdrawn interest for ${p.name}.`, 'info');
                                    }}
                                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-poppins font-bold rounded-xl transition-all cursor-pointer"
                                  >
                                    Withdraw Invitation
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => onViewProfile(p)}
                                  className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-poppins font-semibold rounded-xl border border-gray-200 transition-all cursor-pointer"
                                >
                                  View Bio
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. SHORTLISTED TAB */}
                {hubTab === 'shortlisted' && (
                  <motion.div
                    key="shortlisted-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <h3 className="font-poppins font-bold text-sm text-gray-900 flex items-center gap-2">
                        <Bookmark size={16} className="text-orange-500" />
                        Bookmarked Matrimonial Candidates
                      </h3>
                      <span className="text-xs text-gray-400 font-medium">Total: {shortlistedIds.length}</span>
                    </div>

                    {shortlistedIds.length === 0 ? (
                      <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <Bookmark size={44} className="mx-auto text-gray-300" />
                        <p className="text-sm font-poppins font-bold text-gray-600">No Shortlisted Matches</p>
                        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                          Click the bookmark icon on any candidate profile to save them here for easy family review and astrology cross-checking.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockProfiles
                          .filter(p => shortlistedIds.includes(p.id))
                          .filter(p => {
                            if (!searchQuery.trim()) return true;
                            const q = searchQuery.toLowerCase();
                            return p.name.toLowerCase().includes(q) || p.caste.toLowerCase().includes(q) || p.profession.toLowerCase().includes(q);
                          })
                          .map(p => {
                            const alreadySent = hubSent.some(s => s.id === p.id);
                            return (
                              <div key={p.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                                <div className="flex gap-4">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 cursor-pointer"
                                    onClick={() => onViewProfile(p)}
                                    referrerPolicy="no-referrer"
                                  />

                                  <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <h4 
                                        onClick={() => onViewProfile(p)}
                                        className="font-poppins font-bold text-gray-900 text-sm hover:text-orange-600 cursor-pointer truncate"
                                      >
                                        {p.name}
                                      </h4>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleShortlist(p.id)}
                                        className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                                        title="Remove from shortlist"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>

                                    <p className="text-xs text-gray-500 font-medium truncate">
                                      {p.age} Yrs • {p.height} • {p.caste}
                                    </p>
                                    <p className="text-[11px] text-gray-400 truncate">
                                      {p.profession} • {p.salary} • {p.location.city}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                  {alreadySent ? (
                                    <button
                                      type="button"
                                      disabled
                                      className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-xs font-poppins font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1"
                                    >
                                      <CheckCircle size={13} /> Interest Sent
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHubSent(prev => [{ id: p.id, status: 'pending', date: 'Just now', gunaScore: 32 }, ...prev]);
                                        onAddNotification(`Expressed interest in ${p.name}'s matrimonial profile!`, 'heart');
                                      }}
                                      className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-xs text-white text-xs font-poppins font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                      <Send size={13} /> Express Interest
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => onViewProfile(p)}
                                    className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-poppins font-semibold rounded-xl border border-gray-200 transition-all cursor-pointer"
                                  >
                                    Full Bio
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. UNLOCKED CONTACTS TAB */}
                {hubTab === 'viewed' && (
                  <motion.div
                    key="viewed-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <h3 className="font-poppins font-bold text-sm text-gray-900 flex items-center gap-2">
                        <Phone size={16} className="text-emerald-600" />
                        Unlocked Direct Family Contact Cards
                      </h3>
                      <span className="text-xs text-gray-400 font-medium">Total: {hubViewed.length}</span>
                    </div>

                    {hubViewed.length === 0 ? (
                      <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <Phone size={44} className="mx-auto text-gray-300" />
                        <p className="text-sm font-poppins font-bold text-gray-600">No Unlocked Contacts</p>
                        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                          Verified candidate phone numbers and parent addresses you unlock will be safely stored here for direct phone coordination.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {hubViewed.map(pid => {
                          const p = mockProfiles.find(x => x.id === pid);
                          if (!p) return null;
                          
                          const mobileVal = p.contactInfo?.mobileNumber || p.contactNumber || '+91 98405 12345';
                          const emailVal = p.contactInfo?.email || `${p.name.toLowerCase().replace(/\s+/g, '')}@soulmate.in`;
                          const addressVal = p.contactInfo?.currentAddress || `Adyar, Chennai, Tamil Nadu - 600020`;

                          return (
                            <div key={p.id} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row gap-5">
                              <div className="flex gap-4 items-start shrink-0 md:w-56">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 cursor-pointer"
                                  onClick={() => onViewProfile(p)}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0 space-y-1">
                                  <h4 
                                    onClick={() => onViewProfile(p)}
                                    className="font-poppins font-bold text-gray-900 text-sm hover:text-emerald-600 cursor-pointer truncate"
                                  >
                                    {p.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 font-medium">
                                    {p.age} Yrs • {p.profession}
                                  </p>
                                  <p className="text-[11px] text-gray-400">{p.location.city}, {p.location.state}</p>
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                                    Phone Verified
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/60 text-xs font-sans">
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Mobile Phone</span>
                                  <span className="font-mono font-bold text-gray-800">{mobileVal}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Email Address</span>
                                  <span className="font-semibold text-gray-800 break-all">{emailVal}</span>
                                </div>
                                <div className="sm:col-span-2">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Residential Location</span>
                                  <span className="text-gray-700">{addressVal}</span>
                                </div>
                              </div>

                              <div className="flex md:flex-col justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 pl-0 md:pl-4">
                                <button
                                  type="button"
                                  onClick={() => onOpenChat(p)}
                                  className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-poppins font-bold rounded-xl transition-all cursor-pointer text-center whitespace-nowrap"
                                >
                                  Chat on App
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onViewProfile(p)}
                                  className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-poppins font-semibold rounded-xl border border-gray-200 transition-all cursor-pointer text-center whitespace-nowrap"
                                >
                                  Full Bio
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 5. ARCHIVED TAB */}
                {hubTab === 'rejected' && (
                  <motion.div
                    key="rejected-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <h3 className="font-poppins font-bold text-sm text-gray-900 flex items-center gap-2">
                        <XCircle size={16} className="text-rose-500" />
                        Archived or Declined Proposals
                      </h3>
                      <span className="text-xs text-gray-400 font-medium">Total: {hubRejected.length}</span>
                    </div>

                    {hubRejected.length === 0 ? (
                      <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <XCircle size={44} className="mx-auto text-gray-300" />
                        <p className="text-sm font-poppins font-bold text-gray-600">Archive is Empty</p>
                        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                          Declined proposals or non-matching candidates will be listed here. You can restore them back to active anytime.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hubRejected.map(item => {
                          const p = mockProfiles.find(x => x.id === item.id);
                          if (!p) return null;

                          return (
                            <div key={item.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-3">
                              <div className="flex gap-4">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-16 h-16 rounded-2xl object-cover filter grayscale border border-gray-200"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0 flex-1 space-y-1">
                                  <h4 className="font-poppins font-bold text-gray-700 text-sm">{p.name}</h4>
                                  <p className="text-xs text-gray-500">{p.age} Yrs • {p.profession}</p>
                                  <p className="text-[11px] text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-100 mt-1">
                                    Reason: {item.reason}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHubRejected(prev => prev.filter(x => x.id !== item.id));
                                    setHubReceived(prev => [{ id: item.id, status: 'pending', date: 'Restored Just Now', gunaScore: 30 }, ...prev]);
                                    onAddNotification(`Restored ${p.name} back to Received Proposals!`, 'success');
                                  }}
                                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-poppins font-bold rounded-xl transition-all cursor-pointer"
                                >
                                  Restore Match
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHubRejected(prev => prev.filter(x => x.id !== item.id));
                                    onAddNotification(`Permanently cleared archived record for ${p.name}.`, 'info');
                                  }}
                                  className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-gray-200 text-xs font-poppins font-semibold rounded-xl transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

        </div>

      </div>

      {/* DECLINE REASON MODAL */}
      <AnimatePresence>
        {declineTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                    <XCircle size={18} />
                  </div>
                  <h3 className="font-poppins font-bold text-base text-gray-900">Decline Proposal</h3>
                </div>
                <button 
                  onClick={() => setDeclineTarget(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-600 font-sans">
                  You are declining the matrimonial request from <span className="font-bold text-gray-900">{declineTarget.name}</span>. Select a polite parental reason:
                </p>

                <div className="space-y-2">
                  {[
                    'Guna compatibility below preference threshold',
                    'Locational / City preference mismatch',
                    'Horoscope transit or Manglik misalignment',
                    'Family already in active talks with another match'
                  ].map((r, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 hover:border-orange-300 cursor-pointer text-xs font-sans text-gray-700">
                      <input
                        type="radio"
                        name="decline-reason"
                        checked={declineReason === r}
                        onChange={() => setDeclineReason(r)}
                        className="mt-0.5 text-orange-500 focus:ring-orange-500"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-poppins font-bold text-gray-700 mb-1">Optional Courtesy Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Best wishes in your partner search..."
                    value={customDeclineNote}
                    onChange={(e) => setCustomDeclineNote(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeclineTarget(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-poppins font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDecline}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-poppins font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm Decline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* KUNDLI MILAN QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {kundliPreviewProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-base text-gray-900">Kundli Guna Milan</h3>
                    <p className="text-xs text-gray-500">Ashtakoota compatibility analysis</p>
                  </div>
                </div>
                <button 
                  onClick={() => setKundliPreviewProfile(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-100 uppercase font-bold">Total Compatibility</p>
                    <p className="text-2xl font-poppins font-bold">32 / 36 Gunas</p>
                  </div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-xs text-xs font-bold rounded-full">
                    Excellent Match (Ati-Uttam)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  {[
                    { title: 'Varna (Work & Vocation)', score: '1 / 1' },
                    { title: 'Vashya (Dominance & Control)', score: '2 / 2' },
                    { title: 'Tara (Destiny & Nakshatra)', score: '3 / 3' },
                    { title: 'Yoni (Intimacy & Temperament)', score: '3 / 4' },
                    { title: 'Maitri (Psychological Affinity)', score: '5 / 5' },
                    { title: 'Gana (Temperamental Nature)', score: '6 / 6' },
                    { title: 'Bhakoot (Family & Prosperity)', score: '7 / 7' },
                    { title: 'Nadi (Genetics & Lineage)', score: '5 / 8' }
                  ].map((g, i) => (
                    <div key={i} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between">
                      <span className="text-gray-700 font-medium truncate">{g.title}</span>
                      <span className="font-bold text-gray-900 shrink-0 ml-1">{g.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setKundliPreviewProfile(null)}
                  className="px-5 py-2.5 bg-gray-900 text-white text-xs font-poppins font-bold rounded-xl hover:bg-black cursor-pointer"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
