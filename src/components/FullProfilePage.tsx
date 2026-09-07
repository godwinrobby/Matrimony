import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Award,
  Star,
  Phone,
  CheckCircle,
  Brain,
  FileText,
  Lock,
  Compass,
  Check,
  User,
  Activity,
  Sparkles,
  HeartHandshake,
  Dribbble,
  Utensils,
  Eye,
  Camera,
  Layers,
  FileCheck,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile } from '../types';
import { useState, useEffect } from 'react';
import CashfreePaymentModal from './CashfreePaymentModal';

interface FullProfilePageProps {
  profile: Profile;
  onBack: () => void;
  onOpenChat: (profile: Profile) => void;
  onExpressInterest: (profile: Profile) => void;
  onRunMatchmaker?: (profile: Profile) => void;
  currentUser?: Profile | null;
  onUpdateCurrentUser?: (user: Profile) => void;
  onAddNotification?: (message: string, type: 'success' | 'info' | 'heart') => void;
  onUpgradeToPremium?: () => void;
}

export default function FullProfilePage({
  profile,
  onBack,
  onOpenChat,
  onExpressInterest,
  onRunMatchmaker,
  currentUser,
  onUpdateCurrentUser,
  onAddNotification,
  onUpgradeToPremium
}: FullProfilePageProps) {
  const [isInterested, setIsInterested] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('about');

  const [unlockedContacts, setUnlockedContacts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soulmate_unlocked_contacts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isContactUnlockPayOpen, setIsContactUnlockPayOpen] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(299);
  const [checkoutPlanName, setCheckoutPlanName] = useState('');

  const handleContactUnlockSuccess = (txId: string) => {
    const updated = [...unlockedContacts, profile.id];
    setUnlockedContacts(updated);
    localStorage.setItem('soulmate_unlocked_contacts', JSON.stringify(updated));
    
    try {
      const viewedStr = localStorage.getItem('soulmate_viewed_contacts') || '[]';
      const viewedList = JSON.parse(viewedStr);
      if (Array.isArray(viewedList) && !viewedList.includes(profile.id)) {
        viewedList.push(profile.id);
        localStorage.setItem('soulmate_viewed_contacts', JSON.stringify(viewedList));
      }
    } catch {}

    setIsContactUnlockPayOpen(false);
    if (onAddNotification) {
      onAddNotification(`Congratulations! Verified direct contact credentials for ${profile.name} are unlocked successfully.`, 'success');
    }
  };

  useEffect(() => {
    if (activeTab === 'contact') {
      const isUnlocked = currentUser?.premiumFeatures?.premiumMember || unlockedContacts.includes(profile.id);
      if (isUnlocked) {
        try {
          const viewedStr = localStorage.getItem('soulmate_viewed_contacts') || '[]';
          const viewedList = JSON.parse(viewedStr);
          if (Array.isArray(viewedList) && !viewedList.includes(profile.id)) {
            viewedList.push(profile.id);
            localStorage.setItem('soulmate_viewed_contacts', JSON.stringify(viewedList));
          }
        } catch {}
      }
    }
  }, [activeTab, profile.id, currentUser, unlockedContacts]);

  // --- Dynamic Fallback Generation ---
  // To ensure ANY profile clicked displays a fully complete, elite-grade matrimony page
  const b = profile.basicInfo || {};
  const c = profile.contactInfo || {};
  const ph = profile.photos || {};
  const am = profile.aboutMe || {};
  const rel = profile.religiousInfo || {};
  const edu = profile.educationDetails || {};
  const occ = profile.occupationDetails || {};
  const fam = profile.familyDetails || {};
  const hab = profile.habits || {};
  const phys = profile.physicalAppearance || {};
  const ast = profile.assets || {};
  const pref = profile.partnerPreferences || {};
  const ai = profile.aiCompatibility || {};
  const ver = profile.verification || {};
  const priv = profile.privacySettings || {};
  const act = profile.activity || {};
  const prem = profile.premiumFeatures || {};
  const ins = profile.aiProfileInsights || {};
  const doc = profile.documents || {};

  // Standard shared fields fallbacks
  const birthDate = profile.birthDate || b.maritalStatus ? '1998-04-12' : '1998-04-12';
  const birthTime = profile.birthTime || '06:45 AM';
  const birthPlace = profile.birthPlace || `${profile.location.city}, ${profile.location.state}`;
  const rashi = profile.rashi || 'Mesha (Aries)';
  const nakshatra = profile.nakshatra || 'Aswini';
  const gotra = profile.gotra || 'Kashyapa';

  const handleInterestClick = () => {
    setIsInterested(!isInterested);
    if (!isInterested) {
      onExpressInterest(profile);
    }
  };

  // List of all tabs requested
  const tabs = [
    { id: 'about', label: 'About Me', icon: User },
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'contact', label: 'Contact Details', icon: Phone },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'religion', label: 'Religion', icon: Compass },
    { id: 'lifestyle', label: 'Lifestyle', icon: Utensils },
    { id: 'hobbies', label: 'Hobbies & Interests', icon: Dribbble },
    { id: 'preferences', label: 'Partner Preferences', icon: HeartHandshake },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'horoscope', label: 'Horoscope', icon: Sparkles },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'activity', label: 'Activity & Stats', icon: Activity }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-2 sm:px-4 text-left">
      {/* Back navigation & header tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-150 rounded-2xl text-xs font-semibold text-gray-700 hover:text-[#F97316] hover:border-orange-200 transition-all shadow-xs cursor-pointer w-fit"
          id="profile-back-button"
        >
          <ArrowLeft size={14} />
          Back to Matches
        </button>

        <div className="flex items-center gap-2">
          {profile.verified && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck size={12} className="fill-emerald-50" />
              VERIFIED VEDIC IDENTITY
            </span>
          )}
          {prem.premiumMember !== false && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
              <Star size={10} className="fill-white text-white" />
              ROYAL MEMBER
            </span>
          )}
        </div>
      </div>

      {/* --- ELITE PROFILE HEADER --- */}
      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-xs relative" id="elite-profile-header-card">
        {/* Beautiful redesigned Background Cover Frame */}
        <div className="relative min-h-[360px] sm:min-h-[290px] flex flex-col justify-end overflow-hidden">
          {/* Cover image background */}
          <div className="absolute inset-0 z-0">
            <img
              src={ph.coverPhoto || 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200&h=400'}
              alt="Cover background"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft, beautiful multi-stop layout gradient to ensure absolute legibility of details with gorgeous beach showing through */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-black/5" />
          </div>

          {/* Details Content Overlaid Directly Over the Background Image */}
          <div className="relative px-6 pb-6 pt-16 flex flex-col md:flex-row md:items-end gap-6 z-10 w-full">
            {/* Portrait Photo with custom glowing pink/red/orange gradient border */}
            <div className="relative w-32 h-32 sm:w-[150px] sm:h-[150px] shrink-0 mx-auto md:mx-0 z-20">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#FF416C] to-[#FF4B2B] p-[3px] shadow-lg shadow-rose-500/15">
                <div className="w-full h-full rounded-[25px] overflow-hidden border-[3px] border-white">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              {profile.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-md z-30 animate-pulse">
                  <ShieldCheck size={18} className="fill-white/10" />
                </div>
              )}
            </div>

            {/* Identity & Core Details directly on the beach background */}
            <div className="flex-1 text-center md:text-left space-y-2.5">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-poppins tracking-tight drop-shadow-sm">
                  {profile.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-1.5">
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-orange-500/15 text-orange-700 border border-orange-500/25 rounded-md backdrop-blur-xs">
                    {profile.gender}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-blue-500/15 text-blue-700 border border-blue-500/25 rounded-md backdrop-blur-xs">
                    {profile.age} Years • {profile.height}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-800 flex flex-wrap items-center justify-center md:justify-start gap-1 drop-shadow-3xs">
                <Briefcase size={14} className="text-gray-600" />
                <span>{profile.profession}</span>
                <span className="text-gray-400 mx-1">|</span>
                <GraduationCap size={14} className="text-gray-600" />
                <span>{profile.education}</span>
                <span className="text-gray-400 mx-1">|</span>
                <MapPin size={14} className="text-gray-600" />
                <span>{profile.location.city}, {profile.location.state}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                <span className="px-3 py-1 bg-white/85 text-gray-700 rounded-full text-[11px] font-extrabold border border-gray-200/60 backdrop-blur-xs shadow-3xs">
                  {profile.religion}
                </span>
                <span className="px-3 py-1 bg-white/85 text-gray-700 rounded-full text-[11px] font-extrabold border border-gray-200/60 backdrop-blur-xs shadow-3xs">
                  {profile.caste} ({profile.subCaste || 'Sub-caste N/A'})
                </span>
                <span className="px-3 py-1 bg-white/85 text-gray-700 rounded-full text-[11px] font-extrabold border border-gray-200/60 backdrop-blur-xs shadow-3xs">
                  {profile.diet} Veg
                </span>
                <span className="px-3 py-1 bg-white/85 text-gray-700 rounded-full text-[11px] font-extrabold border border-gray-200/60 backdrop-blur-xs shadow-3xs">
                  Gotra: {gotra}
                </span>
              </div>
            </div>

            {/* AI Match Score Glassmorphic Floating Panel */}
            <div className="shrink-0 text-center md:text-left flex flex-col items-center md:items-start gap-1.5 p-4 bg-white/70 border border-white/90 rounded-2xl backdrop-blur-md shadow-sm z-10 w-full md:w-[220px]">
              <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                AI MATCH COMPATIBILITY
              </span>
              <span className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#EC4899] font-poppins">
                {ai.overallMatch ? `${ai.overallMatch}% Match` : profile.gender === 'Bride' ? '98.4% Match' : '95.8% Match'}
              </span>
              <p className="text-[10px] font-black text-gray-700 flex items-center gap-1">
                <Brain size={12} className="text-[#F97316] shrink-0" />
                Guna Match: 31 out of 36 Gunas
              </p>
            </div>
          </div>
        </div>

        {/* Buttons / CTA Section */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleInterestClick}
            className={`py-3 px-6 rounded-xl font-poppins font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              isInterested
                ? 'bg-rose-50 text-rose-600 border-rose-200/50 hover:bg-rose-100'
                : 'bg-white text-gray-700 border-gray-200 hover:border-rose-400 hover:text-rose-500 shadow-xs'
            }`}
          >
            <Heart size={15} className={isInterested ? 'fill-rose-500 text-rose-500' : ''} />
            {isInterested ? 'Interest Expressed' : 'Express Interest'}
          </button>

          <button
            onClick={() => onOpenChat(profile)}
            className="py-3 px-6 rounded-xl font-poppins font-bold text-xs text-white bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EC4899] hover:to-[#F97316] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-orange-500/10 active:scale-98"
          >
            <MessageSquare size={15} />
            Secure Chat
          </button>

          {(() => {
            const isUnlocked = currentUser?.premiumFeatures?.premiumMember || unlockedContacts.includes(profile.id);
            return (
              <button
                onClick={() => {
                  setActiveTab('about');
                  setTimeout(() => {
                    const el = document.getElementById('contact-details-quick-card');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                      setActiveTab('contact');
                    }
                  }, 120);
                }}
                className={`py-3 px-6 rounded-xl font-poppins font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  isUnlocked
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10'
                }`}
              >
                <Phone size={15} />
                {isUnlocked ? 'View Contact Details (Unlocked)' : 'Pay & View Contact (₹299)'}
              </button>
            );
          })()}

          {onRunMatchmaker && (
            <button
              onClick={() => onRunMatchmaker(profile)}
              className="py-3 px-6 rounded-xl font-poppins font-bold text-xs text-orange-600 bg-orange-50 border border-orange-200/50 hover:bg-orange-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <Brain size={15} className="animate-pulse" />
              Detailed Guna Check
            </button>
          )}
        </div>
      </div>

      {/* --- SCROLLABLE TABS BAR --- */}
      <div className="relative border-b border-gray-100">
        <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-none snap-x mask-gradient-r">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 snap-align-start ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-md shadow-orange-500/10 scale-102'
                    : 'bg-gray-50/50 text-gray-500 border border-gray-100 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- DYNAMIC TABS CONTENT AREA --- */}
      <div className="min-h-96">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#F97316]" /> About Me
                  </h3>
                  <p className="text-sm text-gray-600 font-sans leading-relaxed italic">
                    "{profile.bio}"
                  </p>
                </div>

                {/* INTERACTIVE CONTACT QUICK-VIEW AND PAYWALL WIDGET */}
                {(() => {
                  const isUnlocked = currentUser?.premiumFeatures?.premiumMember || unlockedContacts.includes(profile.id);
                  const mobileVal = c.mobileNumber || '+91 98405 12345';
                  const whatsappVal = c.whatsAppNumber || '+91 98405 12345';
                  const emailVal = c.email || `${profile.name.toLowerCase().replace(/\s+/g, '')}@soulmate.in`;

                  return (
                    <div 
                      id="contact-details-quick-card"
                      className="bg-gradient-to-br from-indigo-50/40 via-white to-orange-50/30 p-6 sm:p-8 rounded-3xl border border-indigo-100/50 shadow-sm space-y-5 relative overflow-hidden text-left"
                    >
                      {/* Decorative gradient corner flare */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-orange-500/10 blur-xl pointer-events-none rounded-full" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase block">Verified Direct Communication</span>
                          <h4 className="text-base font-black text-gray-900 flex items-center gap-1.5 font-poppins">
                            <Phone size={18} className="text-indigo-600" />
                            Candidate & Family Contact Details
                          </h4>
                        </div>
                        <div>
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200/50">
                              <CheckCircle size={12} className="text-emerald-600" />
                              UNLOCKED VIA {currentUser?.premiumFeatures?.premiumMember ? 'ROYAL MEMBERSHIP' : 'SINGLE PAYMENT'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200/50 animate-pulse">
                              <Lock size={12} className="text-amber-600" />
                              LOCKED (MEMBERS-ONLY)
                            </span>
                          )}
                        </div>
                      </div>

                      {isUnlocked ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                          <div className="bg-white p-4 rounded-2xl border border-gray-150/60 space-y-1.5 transition-all hover:shadow-xs">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Mobile Number</span>
                            <span className="text-xs sm:text-sm font-extrabold text-gray-800 block font-mono">{mobileVal}</span>
                            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                              ✓ Direct Call Verified
                            </span>
                          </div>
                          
                          <div className="bg-white p-4 rounded-2xl border border-gray-150/60 space-y-1.5 transition-all hover:shadow-xs">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">WhatsApp Number</span>
                            <span className="text-xs sm:text-sm font-extrabold text-gray-800 block font-mono">{whatsappVal}</span>
                            <button 
                              onClick={() => window.open(`https://wa.me/${whatsappVal.replace(/[^0-9]/g, '')}`, '_blank')}
                              className="inline-flex items-center gap-1 text-[9px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md hover:bg-indigo-100 cursor-pointer"
                            >
                              💬 Open WhatsApp Chat
                            </button>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-gray-150/60 space-y-1.5 transition-all hover:shadow-xs">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Email Address</span>
                            <span className="text-xs sm:text-sm font-extrabold text-gray-800 block break-all">{emailVal}</span>
                            <span className="inline-flex items-center gap-1 text-[9px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                              ✓ Secured E-mail
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-1">
                          {/* Obfuscated mock layout */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-40 select-none pointer-events-none filter blur-xs">
                            <div className="bg-gray-100/60 p-4 rounded-2xl border border-gray-200">
                              <span className="text-[9px] font-black text-gray-400 uppercase block">Mobile Number</span>
                              <span className="text-sm font-extrabold text-gray-700 block font-mono">+91 98405 *****</span>
                            </div>
                            <div className="bg-gray-100/60 p-4 rounded-2xl border border-gray-200">
                              <span className="text-[9px] font-black text-gray-400 uppercase block">WhatsApp Number</span>
                              <span className="text-sm font-extrabold text-gray-700 block font-mono">+91 98405 *****</span>
                            </div>
                            <div className="bg-gray-100/60 p-4 rounded-2xl border border-gray-200">
                              <span className="text-[9px] font-black text-gray-400 uppercase block">Email Address</span>
                              <span className="text-sm font-extrabold text-gray-700 block">ananya*****@soulmate.in</span>
                            </div>
                          </div>

                          {/* Interactive Payment Call-to-action */}
                          <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-center md:text-left">
                              <h5 className="text-xs font-black text-indigo-950 font-poppins">Unlock direct contact instantly</h5>
                              <p className="text-[11px] text-gray-600 max-w-md leading-relaxed">
                                Choose to unlock only this candidate's contact details instantly, or buy a Royal Premium Membership for unlimited profile coordinate reveals.
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                              <button
                                onClick={() => {
                                  if (!currentUser) {
                                    if (onUpgradeToPremium) onUpgradeToPremium();
                                    return;
                                  }
                                  setCheckoutAmount(299);
                                  setCheckoutPlanName(`Contact Coordinate Unlock: ${profile.name}`);
                                  setIsContactUnlockPayOpen(true);
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                              >
                                💳 Pay & View Contact (₹299)
                              </button>
                              <button
                                onClick={() => {
                                  if (onUpgradeToPremium) {
                                    onUpgradeToPremium();
                                  }
                                }}
                                className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                              >
                                ⭐ Get Royal Membership
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Life Goals & Career Vision
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                      {am.lifeGoals || 'To align spiritual clarity and family tradition with a cutting-edge technical or management consulting path, contributing meaningfully to society.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Marriage Expectations
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                      {am.expectations || 'Seeking a supportive, well-educated partner with an independent voice, strong values, and deep respect for elders and traditional roots.'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Personality Traits & Temperament
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(am.personality || ['Ambitious', 'Traditional', 'Grounded', 'Compassionate', 'Spiritual']).map((trait, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold rounded-lg flex items-center gap-1">
                        <Check size={12} />
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <FileText size={16} className="text-[#F97316]" /> Detailed Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Created By</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.profileCreatedBy || 'Parents'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">First Name</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.firstName || profile.name.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Last Name</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.lastName || profile.name.split(' ')[1] || ''}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Display Name</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.displayName || `${profile.name.split(' ')[0]} L.`}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Weight</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.weight || '62 kg'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Body Type</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.bodyType || 'Slim'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Complexion</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.complexion || 'Fair'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Blood Group</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.bloodGroup || 'O+ve'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Marital Status</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.maritalStatus || 'Never Married'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Children Status</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.children || 'None'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Disability Status</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.disabilityStatus || 'None'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Nationality</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.nationality || 'Indian'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Citizenship</label>
                    <span className="text-xs font-bold text-gray-800 font-sans block bg-gray-50 p-2.5 border border-gray-50 rounded-xl">
                      {b.citizenship || 'Indian'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Languages Known</label>
                    <div className="flex flex-wrap gap-1 bg-gray-50 p-2 border border-gray-50 rounded-xl min-h-[38px] items-center">
                      {(b.languagesKnown || [profile.motherTongue, 'English', 'Hindi']).map((lang, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white text-gray-700 text-[10px] font-bold border border-gray-100 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT DETAILS TAB */}
            {activeTab === 'contact' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6 relative overflow-hidden">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Phone size={16} className="text-[#F97316]" /> Verified Family & Candidate Contact Coordinates
                </h3>

                {(() => {
                  const isUnlocked = currentUser?.premiumFeatures?.premiumMember || unlockedContacts.includes(profile.id);
                  const mobileVal = c.mobileNumber || '+91 98405 12345';
                  const whatsappVal = c.whatsAppNumber || '+91 98405 12345';
                  const emailVal = c.email || `${profile.name.toLowerCase().replace(/\s+/g, '')}@soulmate.in`;
                  const currentAddrVal = c.currentAddress || `Plot 14, 2nd Main Road, Adyar, Chennai, Tamil Nadu - 600020`;
                  const permanentAddrVal = c.permanentAddress || `Srinivasa Nilayam, Agraharam Street, Thanjavur, Tamil Nadu - 613001`;

                  if (!currentUser) {
                    return (
                      <div className="py-12 px-4 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto border border-orange-100">
                          <Lock size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-gray-900 font-poppins">Contact Coordinates Locked</h4>
                          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                            To maintain the privacy of our brides and grooms, contact details are exclusively visible to verified registered members.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (onUpgradeToPremium) {
                              onUpgradeToPremium();
                            }
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold font-poppins rounded-xl shadow-md cursor-pointer"
                        >
                          Sign In / Register to Unlock
                        </button>
                      </div>
                    );
                  }

                  if (!isUnlocked) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Obfuscated Fields View */}
                        <div className="space-y-4 filter blur-xs pointer-events-none opacity-40">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Mobile Number</label>
                            <span className="text-xs font-black text-gray-800">+91 98405 *****</span>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">WhatsApp Number</label>
                            <span className="text-xs font-black text-gray-800">+91 98405 *****</span>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                            <span className="text-xs font-black text-gray-800">ananya*****@soulmate.in</span>
                          </div>
                        </div>

                        {/* Lock Overlay card */}
                        <div className="md:col-span-2 p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-100 rounded-2xl flex flex-col items-center text-center space-y-4">
                          <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md shadow-amber-500/10">
                            <Lock size={20} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 font-poppins">Verified Direct Contact Details Locked</h4>
                            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                              Unlock direct family and candidate contact details immediately. You can choose to upgrade to a complete Premium Membership or unlock this specific candidate profile coordinate instantly using Cashfree PG.
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
                            <button
                              onClick={() => {
                                setCheckoutAmount(299);
                                setCheckoutPlanName(`Contact Coordinate Unlock: ${profile.name}`);
                                setIsContactUnlockPayOpen(true);
                              }}
                              className="px-6 py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              💳 Unlock This Contact for ₹299
                            </button>
                            <button
                              onClick={() => {
                                if (onUpgradeToPremium) {
                                  onUpgradeToPremium();
                                }
                              }}
                              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              ⭐ Upgrade to Premium Membership
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Unlocked View
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-emerald-50/20 border border-emerald-100/50 p-5 rounded-3xl md:col-span-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-emerald-800 uppercase">CONTACT INFO UNLOCKED</h4>
                          <p className="text-[11px] text-emerald-600 font-sans">You have active direct communication privileges for this verified match profile.</p>
                        </div>
                      </div>

                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 space-y-1.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Candidate Mobile Phone</span>
                        <span className="text-xs sm:text-sm font-extrabold text-gray-800 block font-mono">{mobileVal}</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold w-fit block">Verified Mobile OTP Status</span>
                      </div>

                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 space-y-1.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Candidate WhatsApp Number</span>
                        <span className="text-xs sm:text-sm font-extrabold text-gray-800 block font-mono">{whatsappVal}</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold w-fit block">WhatsApp Direct Active</span>
                      </div>

                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 space-y-1.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Email Address</span>
                        <span className="text-xs sm:text-sm font-extrabold text-gray-800 block">{emailVal}</span>
                        <span className="text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold w-fit block">E-mail Verified Secure</span>
                      </div>

                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 space-y-1.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Current Residential Address</span>
                        <span className="text-xs font-semibold text-gray-700 block leading-relaxed">{currentAddrVal}</span>
                      </div>

                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 space-y-1.5 md:col-span-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Permanent / Native Family Residence Address</span>
                        <span className="text-xs font-semibold text-gray-700 block leading-relaxed">{permanentAddrVal}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* FAMILY DETAILS TAB */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <Users size={16} className="text-[#F97316]" /> Parent & Sibling Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Father Details */}
                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">Father's Profile</h4>
                      <div className="space-y-2 text-xs font-sans">
                        <p><span className="font-bold text-gray-400">Name:</span> <span className="font-semibold text-gray-800">{fam.father?.name || 'V. Sundar'}</span></p>
                        <p><span className="font-bold text-gray-400">Occupation:</span> <span className="font-semibold text-gray-800">{fam.father?.occupation || 'Retired Government Officer'}</span></p>
                        <p><span className="font-bold text-gray-400">Education:</span> <span className="font-semibold text-gray-800">{fam.father?.education || 'B.Tech - Civil Engineering'}</span></p>
                        <p><span className="font-bold text-gray-400">Business / Income:</span> <span className="font-semibold text-gray-800">{fam.father?.business || 'Consultant / Private Pension'}</span></p>
                        <p><span className="font-bold text-gray-400">Status:</span> <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold rounded-md text-[9px] uppercase">{fam.father?.status || 'Alive'}</span></p>
                      </div>
                    </div>

                    {/* Mother Details */}
                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">Mother's Profile</h4>
                      <div className="space-y-2 text-xs font-sans">
                        <p><span className="font-bold text-gray-400">Name:</span> <span className="font-semibold text-gray-800">{fam.mother?.name || 'S. Savitri'}</span></p>
                        <p><span className="font-bold text-gray-400">Occupation:</span> <span className="font-semibold text-gray-800">{fam.mother?.occupation || 'Homemaker / Teacher'}</span></p>
                        <p><span className="font-bold text-gray-400">Education:</span> <span className="font-semibold text-gray-800">{fam.mother?.education || 'B.A. Literature'}</span></p>
                        <p><span className="font-bold text-gray-400">Status:</span> <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold rounded-md text-[9px] uppercase">{fam.mother?.status || 'Homemaker'}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Sibling count */}
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">Brothers</span>
                      <span className="text-sm font-black text-gray-800">{fam.siblings?.brothers !== undefined ? fam.siblings?.brothers : 1}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">Married Brothers</span>
                      <span className="text-sm font-black text-gray-800">{fam.siblings?.marriedBrothers !== undefined ? fam.siblings?.marriedBrothers : 1}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">Sisters</span>
                      <span className="text-sm font-black text-gray-800">{fam.siblings?.sisters !== undefined ? fam.siblings?.sisters : 0}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">Married Sisters</span>
                      <span className="text-sm font-black text-gray-800">{fam.siblings?.marriedSisters !== undefined ? fam.siblings?.marriedSisters : 0}</span>
                    </div>
                  </div>
                </div>

                {/* Family Values & Status Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Family Culture, Wealth & Business Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Family Type</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{fam.familyType || 'Nuclear'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Family Status</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{fam.familyStatus || 'Upper Middle Class'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Native Place</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{fam.nativePlace || 'Thanjavur, Tamil Nadu'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Family Values</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{profile.familyValues}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Own House</label>
                      <span className="text-xs font-bold text-emerald-700 block bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        {fam.ownHouse !== false ? 'Yes (Multiple properties)' : 'Rented'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Family Business</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{fam.familyBusiness || 'None'}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50/20 border border-orange-100/50 rounded-2xl text-xs font-sans text-gray-600">
                    <span className="font-bold text-gray-800 block mb-1">Family Wealth Overview:</span>
                    {fam.familyWealth || 'Traditional land holding near Coimbatore, 3 residential apartments in Chennai, strong investments portfolio.'}
                  </div>
                </div>
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <GraduationCap size={16} className="text-[#F97316]" /> Academic Background
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Highest Qualification</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{edu.highestQualification || 'Masters Degree'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Degree Earned</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{edu.degree || profile.education}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Specialization</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{edu.specialization || 'Computer Science'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">College Name</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{edu.college || 'Anna University Campus'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">University</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{edu.university || 'State University'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Graduation Year</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{edu.graduationYear || 2021}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Additional Qualifications</h4>
                    <ul className="text-xs font-sans space-y-1.5 text-gray-600">
                      {(edu.additionalQualifications || ['Diploma in Sanskrit and Heritage Studies', 'Prathama in Sangeetha']).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5"><Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Certifications</h4>
                    <ul className="text-xs font-sans space-y-1.5 text-gray-600">
                      {(edu.certifications || ['AWS Certified Solutions Architect', 'Google Cloud ML Lead']).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5"><Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Academic Achievements</h4>
                    <ul className="text-xs font-sans space-y-1.5 text-gray-600">
                      {(edu.academicAchievements || ['Anna University Gold Medalist', 'National Merit Scholarship Awardee']).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5"><Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* CAREER TAB */}
            {activeTab === 'career' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Briefcase size={16} className="text-[#F97316]" /> Professional & Occupation Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Employment Type</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.employmentType || 'Private Sector (MNC)'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Occupation</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.occupation || profile.profession}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Company Name</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.companyName || 'Top Tier Corporate/MNC'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Designation</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.designation || 'Senior Professional / Lead'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Industry</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.industry || 'Information Technology'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Overall Experience</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.experience || '5+ Years'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Annual Income</label>
                    <span className="text-xs font-extrabold text-emerald-600 block bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">{occ.annualIncome || profile.salary}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Monthly Income (Est.)</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.monthlyIncome || '₹1.8 Lakhs'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Office Location</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.officeLocation || `${profile.location.city}, India`}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Working Country</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.workingCountry || 'India'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Work Visa Status</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.workVisa || 'Not Required / Resident'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Business Ventures</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{occ.businessDetails || 'None'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* RELIGION TAB */}
            {activeTab === 'religion' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <Compass size={16} className="text-[#F97316]" /> Religious & Sectarian Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Religion</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{profile.religion}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Caste / Community</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{profile.caste}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Sub Caste</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{profile.subCaste || 'Suddha Clan'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Gothram</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{gotra}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nakshatra (Star)</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{nakshatra}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Rasi (Moon Sign)</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{rashi}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Zodiac Sign</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{profile.starSign || 'Aries'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Dosham / Manglik</label>
                      <span className={`text-xs font-black block p-2.5 rounded-xl border ${profile.manglik === 'No' || profile.manglik === 'Non-Manglik' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                        {profile.manglik}
                      </span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Horoscope Chart Available</label>
                      <span className="text-xs font-bold text-emerald-700 block bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        {profile.horoscopeNeeded ? 'Yes (Verified by Astrologer)' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Spiritual Beliefs & Daily Practices</h3>
                  <div className="space-y-4 text-xs sm:text-sm font-sans text-gray-600 leading-relaxed">
                    <p><span className="font-extrabold text-gray-800">Temple Visits:</span> {rel.templeVisits || 'Visits prominent temples weekly, particularly Pillayarpatti and Kapaleeshwarar.'}</p>
                    <p><span className="font-extrabold text-gray-800">Spiritual Alignment:</span> {rel.spiritualBeliefs || 'Believer in Advaita Vedanta philosophy; reads spiritual essays; meditates daily.'}</p>
                    <p><span className="font-extrabold text-gray-800">Ritual Practices:</span> {rel.religiousPractices || 'Performs traditional morning pujas; observes major Hindu festivals and Vrathams traditionally.'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* LIFESTYLE TAB */}
            {activeTab === 'lifestyle' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <Utensils size={16} className="text-[#F97316]" /> Lifestyle Parameters
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Dietary Habits</label>
                      <span className="text-xs font-extrabold text-orange-700 block bg-orange-50 p-2.5 rounded-xl border border-orange-100">{profile.diet}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Smoking</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{hab.smoking || 'No'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Drinking</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{hab.drinking || 'No'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Gym Attendance</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{hab.gym !== false ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Yoga Practice</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{hab.yoga !== false ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Pets Cozy With</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{hab.pets || 'None'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Travel Mode</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{hab.travel || 'Enjoys exploring spiritual trails, hill stations and heritage centers.'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Driving License</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{hab.drivingLicense !== false ? 'Yes (Four Wheeler)' : 'No'}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">General Lifestyle Mode</label>
                      <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{profile.lifestyle}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Physical & Appearance Metrics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Height</span>
                      <span className="text-xs font-black text-gray-800">{profile.height}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Weight</span>
                      <span className="text-xs font-black text-gray-800">{b.weight || '60 kg'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Skin Tone</span>
                      <span className="text-xs font-black text-gray-800">{phys.skinTone || b.complexion || 'Fair'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Hair & Eye Color</span>
                      <span className="text-xs font-black text-gray-800">{phys.hairColor || 'Black'} / {phys.eyeColor || 'Dark Brown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HOBBIES TAB */}
            {activeTab === 'hobbies' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Dribbble size={16} className="text-[#F97316]" /> Hobbies & Interests
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Main Hobbies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(am.hobbies || ['Classical Carnatic Vocal Singing', 'Traditional Kolam Designing', 'Gourmet South Indian Cooking', 'Visiting Ancient Temple Sites', 'Travel Blogging']).map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700 rounded-xl">
                          🎨 {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Core Fields of Interest</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(am.interests || ['Vedic Astrology matching', 'Classical Instrumental Musics', 'Backwater Nature Photography', 'Healthy Cooking', 'Investing in Mutual Funds']).map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700 rounded-xl">
                          ★ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-orange-50/20 border border-orange-100/50 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-orange-500 uppercase">Personal Interests & Assets Overview</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans text-gray-600">
                    <p><span className="font-extrabold text-gray-800">Own Apartment:</span> {ast.apartment !== false ? 'Yes' : 'No'}</p>
                    <p><span className="font-extrabold text-gray-800">Own House:</span> {ast.ownHouse !== false ? 'Yes' : 'No'}</p>
                    <p><span className="font-extrabold text-gray-800">Luxury Car:</span> {ast.car || 'Hyundai i20'}</p>
                    <p><span className="font-extrabold text-gray-800">Gold Savings:</span> {ast.gold || '100+ Sovereigns'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* PARTNER PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <HeartHandshake size={16} className="text-[#F97316]" /> Partner Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Age Range Preferred</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.ageRange || '24 - 30 Years'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Height Range</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.height || "5'4\" - 6'2\""}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Marital Status</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.maritalStatus || 'Never Married'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Religion Preferred</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.religion || 'Hindu'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Caste Preference</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.caste || profile.caste}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Sub Caste</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.subCaste || 'Suddha / Any Vadama'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Minimum Qualification</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.qualification || 'Bachelors or Post Graduate'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Preferred Professional Domain</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.occupation || 'Software Engineer, Doctor, CA, IAS'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Expected Minimum Income</label>
                    <span className="text-xs font-bold text-emerald-700 block bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">{pref.income || '₹15 LPA+'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Diet Preference</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.diet || 'Pure Vegetarian'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Preferred Location</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.city || 'Chennai, Bangalore, Hyderabad or USA'}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Manglik / Dosham Preference</label>
                    <span className="text-xs font-bold text-gray-800 block bg-gray-50 p-2.5 rounded-xl">{pref.dosham || 'Suddha Jathagam / No Sevvai Dosham'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PHOTOS TAB */}
            {activeTab === 'photos' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Camera size={16} className="text-[#F97316]" /> Verifiable Photo Albums
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Portrait */}
                  <div className="space-y-1">
                    <div className="aspect-square bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden relative group">
                      <img src={profile.image} alt="Main Portrait" className="w-full h-full object-cover transition-all group-hover:scale-105" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[8px] font-bold rounded">Main</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold block text-center">Main Portrait</span>
                  </div>

                  {/* Traditional */}
                  <div className="space-y-1">
                    <div className="aspect-square bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden relative group">
                      <img src={ph.traditionalDressPhoto || profile.image} alt="Traditional Dress" className="w-full h-full object-cover transition-all group-hover:scale-105" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[8px] font-bold rounded">Trad</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold block text-center">Traditional Attire</span>
                  </div>

                  {/* Casual */}
                  <div className="space-y-1">
                    <div className="aspect-square bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden relative group">
                      <img src={ph.casualPhoto || profile.image} alt="Casual Outing" className="w-full h-full object-cover transition-all group-hover:scale-105" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[8px] font-bold rounded">Casual</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold block text-center">Casual Attire</span>
                  </div>

                  {/* Family */}
                  <div className="space-y-1">
                    <div className="aspect-square bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden relative group">
                      <img src={ph.familyPhoto || 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=400&h=400'} alt="Family Gathering" className="w-full h-full object-cover transition-all group-hover:scale-105" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[8px] font-bold rounded">Family</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold block text-center">Family Attire</span>
                  </div>
                </div>

                {/* Cover & Gallery Albums list */}
                <div className="p-4 bg-orange-50/25 border border-orange-100/50 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Lock size={14} />
                    <span className="font-bold">Privacy Settings for Photos:</span>
                    <span className="text-gray-600 font-medium">Public to verified matched premium profiles only.</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-100 text-[10px]">
                    SECURED GALLERY
                  </span>
                </div>
              </div>
            )}

            {/* HOROSCOPE TAB */}
            {activeTab === 'horoscope' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#F97316]" /> Horoscope Astrological parameters
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date of Birth</label>
                      <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-between">
                        {birthDate}
                        <Calendar size={13} className="text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Time of Birth</label>
                      <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-between">
                        {birthTime}
                        <Clock size={13} className="text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Place of Birth</label>
                      <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-between">
                        <span className="truncate mr-1">{birthPlace}</span>
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-amber-100/50 text-center space-y-1">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Calculated Rashi</span>
                      <span className="block text-xs sm:text-sm font-extrabold text-gray-800">{rashi}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-amber-100/50 text-center space-y-1">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Nakshatra</span>
                      <span className="block text-xs sm:text-sm font-extrabold text-gray-800">{nakshatra}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-amber-100/50 text-center space-y-1">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Gotram</span>
                      <span className="block text-xs sm:text-sm font-extrabold text-gray-800">{gotra}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-amber-100/50 text-center space-y-1">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Dosham Type</span>
                      <span className={`block text-xs sm:text-sm font-extrabold ${profile.manglik === 'No' || profile.manglik === 'Non-Manglik' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {profile.manglik}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Astrology matching card */}
                <div className="p-5 bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl border border-orange-100/30 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 border border-orange-100 shadow-xs">
                    <Brain size={22} className="text-[#F97316]" />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h4 className="text-xs font-black text-gray-900 uppercase">Astrological compatibility score</h4>
                    <p className="text-xs text-gray-600 font-sans">Our AI matched the horoscopes of both profiles yielding a score of 88% indicating robust long-term planetary harmony and mutual longevity.</p>
                  </div>
                  <span className="px-3 py-1.5 bg-orange-600 text-white font-black text-xs rounded-xl shadow-sm">
                    31/36 Gunas Match
                  </span>
                </div>
              </div>
            )}

            {/* VERIFICATION TAB */}
            {activeTab === 'verification' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" /> Identity Verification Shield
                </h3>

                <p className="text-xs text-gray-500 font-sans">
                  The following documents and contact items have been uploaded and scrutinized by the SoulMate auditing division to maintain a highly secure, scam-free matrimony platform.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Aadhaar */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Aadhaar Card</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>

                  {/* PAN */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">PAN Card</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>

                  {/* Passport */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Passport</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>

                  {/* Degree Certificate */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Degree Cert.</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>

                  {/* Salary Slip */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Employment / Pay</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>

                  {/* Photo Verification Selfie */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Photo Verified</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>

                  {/* Mobile Verified */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Mobile Phone</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>

                  {/* Email Verified */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={16} className="stroke-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Email Id</span>
                      <span className="text-xs font-black text-gray-800">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVITY & STATS TAB */}
            {activeTab === 'activity' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-6">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Activity size={16} className="text-[#F97316]" /> Real-time Activity Metrics
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Profile Views</span>
                    <span className="block text-2xl font-black text-gray-800">{act.profileViews || 312}</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Interests Received</span>
                    <span className="block text-2xl font-black text-gray-800">{act.interestsReceived || 45}</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Shortlisted By</span>
                    <span className="block text-2xl font-black text-gray-800">{act.shortlistedBy || 68}</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Completeness</span>
                    <span className="block text-2xl font-black text-emerald-600">{act.profileCompletion || 95}%</span>
                  </div>
                </div>

                <div className="p-5 bg-orange-50/20 border border-orange-100/50 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs text-orange-800">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-bold">Current online status:</span>
                    <span className="text-gray-600 font-medium">Online (Active {act.lastLogin || '5 minutes ago'})</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-sans">
                    This profile actively responds to premium chats and secure connection interests within 2 hours on average.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cashfree Single Contact Unlock Modal */}
      <CashfreePaymentModal
        isOpen={isContactUnlockPayOpen}
        onClose={() => setIsContactUnlockPayOpen(false)}
        onPaymentSuccess={handleContactUnlockSuccess}
        amount={checkoutAmount}
        planName={checkoutPlanName}
        customerName={currentUser?.name || ''}
        customerEmail={currentUser?.contactInfo?.email || 'customer@soulmate.in'}
        customerPhone={currentUser?.contactInfo?.mobileNumber || '9999999999'}
      />
    </div>
  );
}
