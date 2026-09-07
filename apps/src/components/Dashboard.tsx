import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Star, ShieldCheck, ArrowRight, 
  Activity, Users, MessageSquare, Award, Compass, 
  ChevronRight, Calendar, Send, Eye, MessageCircle, 
  UserPlus, Check, Edit2, Zap, CheckCircle2, 
  TrendingUp, Sparkle, Info, BookOpen, AlertCircle, RefreshCw,
  Crown, XCircle, Trash2, Lock, Unlock, CheckCircle, Clock, Camera,
  MapPin, Briefcase, Filter
} from 'lucide-react';
import { Profile } from '../types';
import { mockProfiles } from '../mockData';
import ProfileImageModal from './ProfileImageModal';

interface DashboardProps {
  currentUser: Profile;
  onNavigate: (view: string) => void;
  onExpressInterest: (profile: Profile) => void;
  onOpenChat: (profile: Profile) => void;
  onAddNotification: (msg: string, type: 'success' | 'info' | 'heart') => void;
  onViewProfile: (profile: Profile) => void;
  onUpdateUser?: (updatedUser: Profile) => void;
}

export default function Dashboard({ 
  currentUser, 
  onNavigate, 
  onExpressInterest, 
  onOpenChat,
  onAddNotification,
  onViewProfile,
  onUpdateUser
}: DashboardProps) {
  const [greeting, setGreeting] = useState('Vanakkam');
  
  const [auraStatus, setAuraStatus] = useState('Actively seeking a traditional yet progressive companion with shared family values.');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(auraStatus);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState<string | null>(null);
  const [selectedStatIndex, setSelectedStatIndex] = useState<number | null>(null);
  const [advisorIndex, setAdvisorIndex] = useState(0);

  // Profile Image Modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // Interactive Vedic Compatibility Compass States
  const [selectedCompassProfileId, setSelectedCompassProfileId] = useState('');
  const [isCalculatingCompass, setIsCalculatingCompass] = useState(false);
  const [showCompassResult, setShowCompassResult] = useState(false);
  
  // Quest States
  const [completionScore, setCompletionScore] = useState(78);
  const [completedQuestKeys, setCompletedQuestKeys] = useState<string[]>([]);
  const [gotraValue, setGotraValue] = useState('');
  const [originValue, setOriginValue] = useState('');
  const [expectationsValue, setExpectationsValue] = useState('');
  const [activeQuestModal, setActiveQuestModal] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Kaalai Vanakkam');
    else if (hour < 17) setGreeting('Madhiya Vanakkam');
    else setGreeting('Maalai Vanakkam');
  }, []);

  // Filter recommendations based on opposite gender
  const oppositeGenderProfiles = useMemo(() => {
    return mockProfiles.filter(p => p.gender !== currentUser.gender);
  }, [currentUser]);

  const recommendedProfiles = useMemo(() => {
    return oppositeGenderProfiles.slice(0, 4);
  }, [oppositeGenderProfiles]);

  // Set default compass profile selection
  useEffect(() => {
    if (oppositeGenderProfiles.length > 0 && !selectedCompassProfileId) {
      setSelectedCompassProfileId(oppositeGenderProfiles[0].id);
    }
  }, [oppositeGenderProfiles, selectedCompassProfileId]);

  // Handle Aura Status change
  const handleSaveStatus = () => {
    setAuraStatus(statusInput);
    setIsEditingStatus(false);
    onAddNotification('Matrimonial bio status updated successfully!', 'success');
  };

  // Profile Booster simulation
  const handleTriggerBoost = () => {
    if (isBoosting) return;
    setIsBoosting(true);
    onAddNotification('Aligning cosmic transits for profile optimization...', 'info');
    
    setTimeout(() => {
      setBoostTimeLeft('02:00:00');
      onAddNotification('Vedic profile boost active! Prioritized in local and astro searches for 2 hours.', 'success');
    }, 1200);
  };

  // Live timer for active boost
  useEffect(() => {
    let timer: any;
    if (isBoosting && boostTimeLeft) {
      timer = setInterval(() => {
        const [h, m, s] = boostTimeLeft.split(':').map(Number);
        let totalSec = h * 3600 + m * 60 + s - 1;
        if (totalSec <= 0) {
          setIsBoosting(false);
          setBoostTimeLeft(null);
          clearInterval(timer);
        } else {
          const newH = Math.floor(totalSec / 3600).toString().padStart(2, '0');
          const newM = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
          const newS = (totalSec % 60).toString().padStart(2, '0');
          setBoostTimeLeft(`${newH}:${newM}:${newS}`);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBoosting, boostTimeLeft]);

  // Stats cards with trend badges
  const stats = [
    { 
      label: 'New Matches', 
      value: '186', 
      trend: '+12% this week',
      trendType: 'up',
      icon: <Heart size={20} className="text-orange-600 shrink-0" fill="currentColor" />, 
      bgClass: 'bg-orange-50 border-orange-100', 
      desc: 'Top compatibility profiles' 
    },
    { 
      label: 'Interest Requests', 
      value: '42', 
      trend: '4 new today',
      trendType: 'attention',
      icon: <Send size={20} className="text-amber-600 shrink-0" />, 
      bgClass: 'bg-amber-50 border-amber-100', 
      desc: 'Awaiting your response' 
    },
    { 
      label: 'Profile Visitors', 
      value: '315', 
      trend: '+24% this month',
      trendType: 'up',
      icon: <Eye size={20} className="text-pink-600 shrink-0" />, 
      bgClass: 'bg-pink-50 border-pink-100', 
      desc: 'Active views & searches' 
    },
    { 
      label: 'Messages Received', 
      value: '29', 
      trend: '2 unread lines',
      trendType: 'attention',
      icon: <MessageCircle size={20} className="text-emerald-600 shrink-0" />, 
      bgClass: 'bg-emerald-50 border-emerald-100', 
      desc: 'Family discussions active' 
    },
  ];

  // Dynamic recent activities based on current user
  const recentActivities = currentUser.name.includes('Karthik') ? [
    { action: 'Aishwarya Iyer viewed your profile', time: '2 min ago' },
    { action: 'Priya Subramanian accepted your interest request', time: '1 hr ago' },
    { action: '3 New Matches found in Bengaluru', time: 'Today' },
    { action: 'Verification badge successfully approved', time: 'Yesterday' }
  ] : [
    { action: 'Karthik Krishnan viewed your profile', time: '2 min ago' },
    { action: 'Adithya Pandian accepted your interest request', time: '1 hr ago' },
    { action: '3 New Matches found in Chennai', time: 'Today' },
    { action: 'Verification badge successfully approved', time: 'Yesterday' }
  ];

  // Vedic relationship tips list
  const relationshipTips = [
    {
      title: "Gana Compatibility Harmony",
      advice: "When communicating with a Devata Gana candidate, express sentiments softly and highlight traditional commitments. High respect aligns the energies.",
      author: "Shastri Acharya Diwakar"
    },
    {
      title: "Mangal Dosha Alignment",
      advice: "Manglik transits are temporary. Focus on shared lifestyle values first. Mutual lifestyle expectations act as natural remedies to planetary transits.",
      author: "Guru Shri Ravishankar"
    },
    {
      title: "Kundli Gun Milan Thresholds",
      advice: "Scores above 18 Gunas indicate good physical & social compatibility. Values, diet alignment, and relocation flexibility build the remaining bridge of joy.",
      author: "Jyotish Ratnam Uma"
    }
  ];

  // Compass Calculation Logic
  const compassSelectedProfile = useMemo(() => {
    return mockProfiles.find(p => p.id === selectedCompassProfileId);
  }, [selectedCompassProfileId]);

  const compassCalculations = useMemo(() => {
    if (!compassSelectedProfile) return null;
    
    const seed = currentUser.id + compassSelectedProfile.id;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const gunas = 18 + Math.abs(hash % 18); // 18 to 35 Gunas
    const varnaScore = Math.abs((hash + 1) % 4) + 1; // 1 to 4 stars
    const yoniScore = Math.abs((hash + 2) % 4) + 1; // 1 to 4 stars
    const ganaScore = Math.abs((hash + 3) % 4) + 1; // 1 to 4 stars
    const nadiScore = Math.abs((hash + 4) % 4) + 1; // 1 to 4 stars
    
    let advice = "";
    if (gunas >= 28) {
      advice = `Outstanding Kundli match with ${gunas} out of 36 gunas aligned. Both personalities express deep mental harmony, spiritual synchronicity, and strong prospective prosperity. Ideal for traditional family union.`;
    } else if (gunas >= 22) {
      advice = `Very harmonious match with ${gunas} Gunas. High mental compatibility and aligned family values (both rated ${currentUser.familyValues} & ${compassSelectedProfile.familyValues}). Minor differences can be solved through transparent communications.`;
    } else {
      advice = `Moderate Kundli match with ${gunas} Gunas. Planetary placements show differences in daily lifestyle preferences (${currentUser.lifestyle} vs ${compassSelectedProfile.lifestyle}). We recommend matching with parent involvement.`;
    }

    return {
      gunas,
      varnaScore,
      yoniScore,
      ganaScore,
      nadiScore,
      advice
    };
  }, [currentUser, compassSelectedProfile]);

  const handleRunCompass = () => {
    setIsCalculatingCompass(true);
    setShowCompassResult(false);
    onAddNotification('Syncing astrological nodes and ashta-koota grids...', 'info');
    
    setTimeout(() => {
      setIsCalculatingCompass(false);
      setShowCompassResult(true);
      onAddNotification('Vedic Gun Milan report synthesized successfully!', 'success');
    }, 1200);
  };

  // Quests completions
  const handleOpenQuest = (key: string) => {
    setActiveQuestModal(key);
  };

  const handleSubmitQuest = (key: string, value: string) => {
    if (!value.trim()) {
      onAddNotification('Please enter a valid detail.', 'info');
      return;
    }

    let points = 0;
    let label = '';
    if (key === 'gotra') {
      points = 10;
      label = `Ancestral Gotra verified as '${value}'`;
    } else if (key === 'origin') {
      points = 8;
      label = `Ancestral origin set to '${value}'`;
    } else if (key === 'expectations') {
      points = 4;
      label = 'Partner expectation statement recorded';
    }

    setCompletionScore(prev => Math.min(100, prev + points));
    setCompletedQuestKeys(prev => [...prev, key]);
    setActiveQuestModal(null);
    onAddNotification(`Quest Complete! ${label}. Profile priority increased!`, 'success');
  };

  // Simulated content inside expandable stats boxes
  const renderStatExpandedDetail = () => {
    if (selectedStatIndex === null) return null;
    
    const details = [
      // Index 0: New Matches
      {
        title: "Compatible Matches",
        desc: "These premium profiles have newly joined and express top alignment parameters with your Vedic profile.",
        items: oppositeGenderProfiles.slice(0, 3).map(p => ({
          name: p.name,
          info: `${p.age} Yrs • ${p.profession} • ${p.location.city}`,
          avatar: p.image,
          extra: `${80 + Math.floor(Math.random() * 18)}% Compatible`,
          profile: p
        }))
      },
      // Index 1: Interest Requests
      {
        title: "Incoming Interest Requests",
        desc: "These suitors have initiated a direct connection with you. Act now to respond.",
        items: oppositeGenderProfiles.slice(1, 3).map((p, i) => ({
          name: p.name,
          info: `Interested in your ${currentUser.rashi || 'Virgo'} Rashi profile`,
          avatar: p.image,
          extra: i === 0 ? "Pending Parent approval" : "Direct response requested",
          profile: p,
          isRequest: true
        }))
      },
      // Index 2: Profile Visitors
      {
        title: "Profile Visitors Log",
        desc: "These members have visited your profile page in the last 7 days. High visitor rates reflect a strong matrimonial aura.",
        items: oppositeGenderProfiles.slice(0, 4).map((p, i) => ({
          name: p.name,
          info: `Viewed your profile ${i === 0 ? '15m ago' : i === 1 ? '3h ago' : 'Yesterday'}`,
          avatar: p.image,
          extra: "Verified Member",
          profile: p
        }))
      },
      // Index 3: Messages Received
      {
        title: "Active Chat Threads",
        desc: "You have unread chats awaiting Shastri or parent engagement. Start speaking to build relationships.",
        items: oppositeGenderProfiles.slice(2, 4).map((p, i) => ({
          name: p.name,
          info: i === 0 ? "Namaste! I would like to match our horoscopes..." : "Let's organize a quick video call with families.",
          avatar: p.image,
          extra: "Unread Msg",
          profile: p,
          isChat: true
        }))
      }
    ][selectedStatIndex];

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="col-span-full bg-orange-50/50 rounded-3xl p-6 border border-orange-100 shadow-xs text-left"
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900 font-poppins flex items-center gap-2">
              <Sparkles size={16} className="text-orange-600" />
              {details.title}
            </h4>
            <p className="text-xs text-gray-600 font-sans mt-1 max-w-2xl leading-relaxed">
              {details.desc}
            </p>
          </div>
          <button 
            onClick={() => setSelectedStatIndex(null)}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {details.items.map((item, idx) => (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border border-orange-100" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5 className="text-xs font-bold text-gray-900 font-poppins">{item.name}</h5>
                  <p className="text-[11px] text-gray-500 font-sans truncate max-w-[200px]">{item.info}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full shrink-0">
                  {item.extra}
                </span>
                
                {item.isRequest ? (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onAddNotification(`Accepted request from ${item.name}! Notification sent to parents.`, 'success')}
                      className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors cursor-pointer"
                      title="Accept"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : item.isChat ? (
                  <button 
                    onClick={() => onOpenChat(item.profile)}
                    className="p-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors cursor-pointer"
                    title="Open Chat"
                  >
                    <MessageSquare size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => onViewProfile(item.profile)}
                    className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                    title="View Vedic Profile"
                  >
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Dynamic Matrimonial Greeting Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-orange-50/60 via-white to-amber-50/60 p-6 sm:p-8 rounded-[32px] border border-orange-200/80 shadow-xl shadow-orange-950/5 text-left overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left Profile/Greeting Block */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img 
                src={currentUser.image} 
                alt={currentUser.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md group-hover:brightness-90 transition-all ring-2 ring-orange-200"
                referrerPolicy="no-referrer"
              />
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageModalOpen(true);
                }}
                className="absolute inset-0 bg-gray-950/50 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer"
                title="Change Profile Photo"
              >
                <Camera size={18} />
                <span className="hidden sm:inline">Update</span>
              </button>
              <span className="absolute -bottom-1 -right-1 p-1 bg-orange-600 text-white rounded-full border-2 border-white shadow-xs" title="Change Photo">
                <Camera size={10} />
              </span>
            </div>
            
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 tracking-tight">
                  {greeting}, {currentUser.name.split(' ')[0]}
                </h1>
                <div className="flex items-center gap-2 mx-auto sm:mx-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck size={13} className="text-emerald-700" />
                    Verified Profile
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Camera size={12} className="text-orange-600" />
                    <span>Photo Settings</span>
                  </button>
                </div>
              </div>
              
              {/* Star Details Banner */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-gray-600 font-medium font-sans">
                <span className="bg-white px-2.5 py-0.5 rounded-md border border-gray-200/80">🪐 Rashi: <strong className="text-gray-900">{currentUser.rashi || 'Leo (Simha)'}</strong></span>
                <span className="bg-white px-2.5 py-0.5 rounded-md border border-gray-200/80">✨ Nakshatra: <strong className="text-gray-900">{currentUser.nakshatra || 'Chitra'}</strong></span>
                <span className="bg-white px-2.5 py-0.5 rounded-md border border-gray-200/80">🔥 Manglik: <strong className="text-gray-900">{currentUser.manglik || 'Non-Manglik'}</strong></span>
              </div>

              {/* Interactive Status Line */}
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 group">
                {isEditingStatus ? (
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <input 
                      type="text" 
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-orange-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-200 w-full font-sans font-medium"
                      placeholder="Share your partner search priority..."
                      maxLength={120}
                    />
                    <button 
                      onClick={handleSaveStatus}
                      className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Save Status
                    </button>
                    <button 
                      onClick={() => setIsEditingStatus(false)}
                      className="text-xs text-gray-500 hover:text-gray-800 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setStatusInput(auraStatus); setIsEditingStatus(true); }}>
                    <p className="text-xs text-gray-700 italic font-sans font-medium text-left bg-orange-100/50 px-3 py-1 rounded-xl border border-orange-200/60">
                      &ldquo;{auraStatus}&rdquo;
                    </p>
                    <Edit2 size={13} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Profile Booster Widget */}
          <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 w-full lg:w-auto shrink-0 min-w-[280px]">
            <div className="text-left space-y-1">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-orange-700 font-sans">
                Search Priority
              </span>
              <h4 className="text-sm font-poppins font-bold text-gray-900 flex items-center gap-1.5">
                <TrendingUp size={16} className="text-emerald-600" />
                Vedic Profile Booster
              </h4>
              <p className="text-[11px] text-gray-600 font-sans max-w-[220px]">
                {isBoosting ? "Profile placed at top of search queries" : "Boost your profile to appear 4x more in searches."}
              </p>
            </div>

            <button 
              onClick={handleTriggerBoost}
              disabled={isBoosting}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-poppins font-bold text-xs tracking-wider transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer ${
                isBoosting 
                  ? 'bg-emerald-600 text-white cursor-default' 
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white hover:shadow-md'
              }`}
            >
              {isBoosting ? (
                <>
                  <Zap size={14} className="text-white fill-white animate-pulse" />
                  <span>BOOSTED ({boostTimeLeft})</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="text-white" />
                  <span>BOOST PROFILE</span>
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>
      
      {/* 2. Key Metrics & Stat Cards */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const isSelected = selectedStatIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedStatIndex(isSelected ? null : idx)}
                className={`p-5 rounded-[24px] border hover:-translate-y-1 transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-white border-orange-300 shadow-md ring-2 ring-orange-500/10' 
                    : 'bg-white border-gray-200/80 shadow-xs hover:border-orange-200 hover:shadow-md'
                }`}
              >
                <div className="space-y-1">
                  <span className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 font-sans">
                    {stat.label}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-poppins font-bold text-gray-900 tracking-tight">
                      {stat.value}
                    </h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      stat.trendType === 'up' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                  <span className="block text-[11px] text-orange-600 font-semibold font-sans hover:underline flex items-center gap-0.5 pt-0.5">
                    {stat.desc} <ChevronRight size={12} />
                  </span>
                </div>
                <div className={`p-3.5 rounded-2xl border ${stat.bgClass}`}>
                  {stat.icon}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Interactive Drawer for Stats */}
        <AnimatePresence>
          {selectedStatIndex !== null && renderStatExpandedDetail()}
        </AnimatePresence>
      </div>

      {/* Grid: Left Column 8-span and Right Column 4-span */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (8-span) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Profile Completion Box & Vedic Quests */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-gray-200/80 shadow-xs text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-bold text-gray-900 text-lg flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-orange-600" />
                  Vedic Matrimonial Completion Quest
                </h3>
                <span className="text-xs font-bold text-orange-800 font-poppins bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                  {completionScore}% Complete
                </span>
              </div>
              
              {/* Custom Progress Bar */}
              <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '78%' }}
                  animate={{ width: `${completionScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Quests lists */}
            <div className="space-y-3">
              <p className="text-xs text-gray-600 font-medium font-sans">
                Complete pending astro quests to increase your matchmaking priority score in Shastri grids:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Gotra Quest */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  completedQuestKeys.includes('gotra') 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-gray-50/60 border-gray-200/80 text-gray-900 hover:border-orange-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                      +10% Score
                    </span>
                    {completedQuestKeys.includes('gotra') ? (
                      <Check size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Star size={16} className="text-amber-500 shrink-0 fill-amber-400" />
                    )}
                  </div>
                  <h5 className="text-xs font-bold font-poppins mt-2">Ancestral Gotra</h5>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">Provide your gotra lineage</p>
                  
                  {!completedQuestKeys.includes('gotra') && (
                    <button 
                      onClick={() => handleOpenQuest('gotra')}
                      className="mt-3 text-xs font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      Verify Now <ArrowRight size={12} />
                    </button>
                  )}
                </div>

                {/* Ancestral Town */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  completedQuestKeys.includes('origin') 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-gray-50/60 border-gray-200/80 text-gray-900 hover:border-orange-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                      +8% Score
                    </span>
                    {completedQuestKeys.includes('origin') ? (
                      <Check size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Star size={16} className="text-amber-500 shrink-0 fill-amber-400" />
                    )}
                  </div>
                  <h5 className="text-xs font-bold font-poppins mt-2">Ancestral Town</h5>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">Specify native origin city</p>
                  
                  {!completedQuestKeys.includes('origin') && (
                    <button 
                      onClick={() => handleOpenQuest('origin')}
                      className="mt-3 text-xs font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      Add City <ArrowRight size={12} />
                    </button>
                  )}
                </div>

                {/* Partner expectations summary */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  completedQuestKeys.includes('expectations') 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-gray-50/60 border-gray-200/80 text-gray-900 hover:border-orange-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                      +4% Score
                    </span>
                    {completedQuestKeys.includes('expectations') ? (
                      <Check size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Star size={16} className="text-amber-500 shrink-0 fill-amber-400" />
                    )}
                  </div>
                  <h5 className="text-xs font-bold font-poppins mt-2">Expectation Bio</h5>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">State partner attributes</p>
                  
                  {!completedQuestKeys.includes('expectations') && (
                    <button 
                      onClick={() => handleOpenQuest('expectations')}
                      className="mt-3 text-xs font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      Summarize <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic mini inputs inline for active quest modal */}
            <AnimatePresence>
              {activeQuestModal && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200 text-left space-y-3"
                >
                  <h6 className="text-xs font-bold text-gray-900 font-poppins">
                    {activeQuestModal === 'gotra' && "Enter Ancestral Gotra Lineage"}
                    {activeQuestModal === 'origin' && "Specify Ancestral Birth Town / Native City"}
                    {activeQuestModal === 'expectations' && "Brief Partner Expectations Summary"}
                  </h6>
                  
                  <div className="flex gap-2">
                    {activeQuestModal === 'gotra' && (
                      <input 
                        type="text" 
                        value={gotraValue}
                        onChange={(e) => setGotraValue(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-hidden flex-1 font-sans font-medium"
                        placeholder="e.g. Bhardwaj, Kashyap, Shandilya"
                      />
                    )}
                    {activeQuestModal === 'origin' && (
                      <input 
                        type="text" 
                        value={originValue}
                        onChange={(e) => setOriginValue(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-hidden flex-1 font-sans font-medium"
                        placeholder="e.g. Madurai, Varanasi, Chennai"
                      />
                    )}
                    {activeQuestModal === 'expectations' && (
                      <textarea 
                        value={expectationsValue}
                        onChange={(e) => setExpectationsValue(e.target.value)}
                        className="px-3 py-2 text-xs bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-hidden flex-1 font-sans font-medium h-12"
                        placeholder="e.g. Looking for a vegetarian professional who lives in Chennai."
                      />
                    )}

                    <button 
                      onClick={() => {
                        const val = activeQuestModal === 'gotra' ? gotraValue : activeQuestModal === 'origin' ? originValue : expectationsValue;
                        handleSubmitQuest(activeQuestModal!, val);
                      }}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => setActiveQuestModal(null)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Vedic Compatibility Compass */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-gray-200/80 shadow-xs text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-poppins font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Compass size={20} className="text-orange-600" />
                  Vedic Compatibility Compass
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Select a candidate profile and calculate instant Ashtakoota Gun Milan compatibility.
                </p>
              </div>

              {/* Candidate Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-bold">Candidate:</span>
                <select 
                  value={selectedCompassProfileId}
                  onChange={(e) => {
                    setSelectedCompassProfileId(e.target.value);
                    setShowCompassResult(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-200 font-sans font-bold text-gray-800 shadow-2xs"
                >
                  {oppositeGenderProfiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.profession.split(' ')[0]})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compass Checker Tool */}
            {compassSelectedProfile && (
              <div className="p-5 bg-orange-50/40 border border-orange-100 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                {/* Candidate visual pairing */}
                <div className="md:col-span-4 flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img 
                        src={currentUser.image} 
                        alt="Your profile" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-xs" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 relative flex items-center justify-center">
                      <Heart size={12} className="text-orange-600 animate-pulse fill-orange-600" />
                    </div>
                    <div className="relative">
                      <img 
                        src={compassSelectedProfile.image} 
                        alt="Target profile" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-pink-500 shadow-xs" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h5 className="text-xs font-bold text-gray-900 font-poppins">{compassSelectedProfile.name}</h5>
                    <p className="text-[11px] text-gray-500 font-sans">{compassSelectedProfile.starSign || 'Aries'} Star • {compassSelectedProfile.caste}</p>
                  </div>

                  <button 
                    onClick={handleRunCompass}
                    disabled={isCalculatingCompass}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-poppins font-bold text-xs rounded-xl shadow-xs hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {isCalculatingCompass ? (
                      <>
                        <RefreshCw size={13} className="animate-spin text-white" />
                        <span>SYNCHRONISING...</span>
                      </>
                    ) : (
                      <>
                        <Compass size={13} className="text-white" />
                        <span>ANALYSE KUNDLI</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Match Results display */}
                <div className="md:col-span-8 border-t md:border-t-0 md:border-l border-orange-100 pt-4 md:pt-0 md:pl-5 flex flex-col justify-center min-h-[140px]">
                  {showCompassResult && compassCalculations ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3.5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200 uppercase tracking-wider">
                            Ashtakoota Score
                          </span>
                          <h4 className="text-xl font-poppins font-bold text-gray-900 mt-1">
                            {compassCalculations.gunas} / 36 Gunas Matched
                          </h4>
                        </div>
                        
                        <div className="text-right">
                          <span className="block text-[10px] text-gray-500 font-bold uppercase font-sans">Harmony Grade</span>
                          <span className="text-xs font-bold text-emerald-700 font-poppins bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block mt-0.5">
                            {compassCalculations.gunas >= 28 ? 'Anukula (Excellent)' : compassCalculations.gunas >= 20 ? 'Sama (Good Harmony)' : 'Madhya (Moderate)'}
                          </span>
                        </div>
                      </div>

                      {/* Gunas Stars breakdown */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-medium font-sans text-gray-600 border-y border-gray-200/80 py-2.5">
                        <div className="flex items-center justify-between">
                          <span>Varna (Duty Alignment):</span>
                          <span className="text-amber-600 font-bold">
                            {'★'.repeat(compassCalculations.varnaScore)}
                            {'☆'.repeat(4 - compassCalculations.varnaScore)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Yoni (Behavioral Affinity):</span>
                          <span className="text-amber-600 font-bold">
                            {'★'.repeat(compassCalculations.yoniScore)}
                            {'☆'.repeat(4 - compassCalculations.yoniScore)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Gana (Temperament/Soul):</span>
                          <span className="text-amber-600 font-bold">
                            {'★'.repeat(compassCalculations.ganaScore)}
                            {'☆'.repeat(4 - compassCalculations.ganaScore)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Nadi (Genetic Progeny):</span>
                          <span className="text-amber-600 font-bold">
                            {'★'.repeat(compassCalculations.nadiScore)}
                            {'☆'.repeat(4 - compassCalculations.nadiScore)}
                          </span>
                        </div>
                      </div>

                      {/* Commentary */}
                      <p className="text-xs text-gray-700 leading-relaxed font-sans bg-white p-3 rounded-xl border border-orange-100 italic">
                        &ldquo;<strong>Shastri Note:</strong> {compassCalculations.advice}&rdquo;
                      </p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 space-y-2">
                      <Compass size={28} className="text-orange-300 animate-pulse" />
                      <p className="text-xs font-semibold font-sans">
                        Press 'ANALYSE KUNDLI' to evaluate your celestial alignment with {compassSelectedProfile.name}.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Recommended Matches List */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-gray-200/80 shadow-xs text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-poppins font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Heart size={20} className="text-orange-600" fill="currentColor" />
                  Recommended Matches for You
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">Handpicked based on Ashtakoota compatibility parameters</p>
              </div>
              <button 
                onClick={() => onNavigate('search')}
                className="text-xs font-bold text-orange-700 hover:underline cursor-pointer flex items-center gap-0.5 font-poppins bg-orange-50 px-3 py-1 rounded-full border border-orange-200"
              >
                Browse All <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {recommendedProfiles.map((profile) => (
                <div 
                  key={profile.id}
                  className="p-4 bg-gray-50/50 border border-gray-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white hover:border-orange-200 hover:shadow-xs transition-all duration-200 group text-left"
                >
                  <div 
                    onClick={() => onViewProfile(profile)}
                    className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity"
                    title="Click to view full Vedic profile"
                  >
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-2xs group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-poppins font-bold text-gray-900 text-sm">
                          {profile.name}
                        </span>
                        {profile.verified && (
                          <ShieldCheck size={15} className="text-emerald-600" />
                        )}
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          {82 + Math.floor((profile.age + profile.profession.length) % 15)}% Match
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium font-sans mt-0.5">
                        {profile.profession} • {profile.location.city}
                      </p>
                      <p className="text-[11px] text-gray-500 font-sans">
                        {profile.age} Yrs • {profile.height} • {profile.caste} • {profile.manglik}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button 
                      onClick={() => onOpenChat(profile)}
                      className="p-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                      title="Secure Chat"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button 
                      onClick={() => onExpressInterest(profile)}
                      className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-poppins font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Express Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column (4-span) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Soulmate VIP Membership Box */}
          <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-pink-600 text-white p-6 rounded-[28px] shadow-xl shadow-orange-950/10 text-left relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-xs">
                <Crown size={12} className="text-amber-300" /> Unlock Soulmate VIP
              </span>
              <h3 className="font-poppins font-bold text-xl leading-snug">
                Premium Matrimonial Membership
              </h3>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                Gain access to unlimited direct chat lines, custom Astro horoscope match evaluation, profile booster transits, and verified guardian contact details.
              </p>
              <button 
                onClick={() => onNavigate('membership')}
                className="w-full mt-2 py-3 px-5 bg-white text-orange-700 hover:bg-orange-50 font-poppins font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Upgrade to Lifetime VIP
              </button>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white p-6 rounded-[28px] border border-gray-200/80 shadow-xs text-left">
            <h3 className="font-poppins font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
              <Activity size={18} className="text-orange-600" />
              Recent Activity
            </h3>
            
            <ul className="divide-y divide-gray-100 font-sans">
              {recentActivities.map((act, idx) => (
                <li key={idx} className="py-3 flex items-center justify-between gap-3 text-left">
                  <span className="text-xs font-semibold text-gray-800">
                    {act.action}
                  </span>
                  <small className="text-[10px] font-bold shrink-0 px-2.5 py-0.5 rounded-full text-gray-500 bg-gray-100">
                    {act.time}
                  </small>
                </li>
              ))}
            </ul>
          </div>

          {/* Shastri Relationship Advice Carousel */}
          <div className="bg-white p-6 rounded-[28px] border border-gray-200/80 shadow-xs text-left space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-poppins font-bold text-gray-500 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-amber-600" />
                Matrimonial Wisdom
              </h4>
              <div className="flex gap-1">
                <button 
                  onClick={() => setAdvisorIndex(prev => prev === 0 ? relationshipTips.length - 1 : prev - 1)}
                  className="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                  title="Previous Tip"
                >
                  ◀
                </button>
                <button 
                  onClick={() => setAdvisorIndex(prev => prev === relationshipTips.length - 1 ? 0 : prev + 1)}
                  className="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                  title="Next Tip"
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 space-y-2">
              <h5 className="text-xs font-bold text-orange-800 font-poppins">
                {relationshipTips[advisorIndex].title}
              </h5>
              <p className="text-xs text-gray-600 italic font-sans leading-relaxed">
                &ldquo;{relationshipTips[advisorIndex].advice}&rdquo;
              </p>
              <div className="text-right">
                <small className="text-[10px] font-bold text-gray-500 font-poppins">
                  — {relationshipTips[advisorIndex].author}
                </small>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Profile Image Change Modal */}
      {onUpdateUser && (
        <ProfileImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          currentUser={currentUser}
          onUpdateUser={onUpdateUser}
          onAddNotification={onAddNotification}
        />
      )}

    </div>
  );
}
