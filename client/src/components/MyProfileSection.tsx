import { useState, FormEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shield, ShieldCheck, MapPin, Briefcase, 
  Sparkles, Camera, Phone, Mail, Award, CheckCircle, 
  Trash2, RefreshCw, FileText, ArrowRight, Heart,
  Users, Utensils, HeartHandshake, GraduationCap, Compass,
  Eye, Edit3, Share2, Copy, Check, Download, Star, Plus,
  Sparkle, ShieldAlert, BookOpen, Layers
} from 'lucide-react';
import { Profile } from '../types';
import ProfileImageModal from './ProfileImageModal';

interface MyProfileSectionProps {
  currentUser: Profile;
  onUpdateUser: (updatedUser: Profile) => void;
  onAddNotification: (msg: string, type: 'success' | 'info' | 'heart') => void;
}

export default function MyProfileSection({ currentUser, onUpdateUser, onAddNotification }: MyProfileSectionProps) {
  // Mode switch: 'edit' or 'preview'
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Core profile state
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [height, setHeight] = useState(currentUser.height);
  const [caste, setCaste] = useState(currentUser.caste);
  const [subCaste, setSubCaste] = useState(currentUser.subCaste || '');
  const [motherTongue, setMotherTongue] = useState(currentUser.motherTongue);
  const [profession, setProfession] = useState(currentUser.profession);
  const [education, setEducation] = useState(currentUser.education);
  const [salary, setSalary] = useState(currentUser.salary);
  const [bio, setBio] = useState(currentUser.bio);
  const [starSign, setStarSign] = useState(currentUser.starSign || '');
  const [manglik, setManglik] = useState(currentUser.manglik);
  const [diet, setDiet] = useState(currentUser.diet);
  
  // Location
  const [city, setCity] = useState(currentUser.location?.city || 'Chennai');
  const [stateLoc, setStateLoc] = useState(currentUser.location?.state || 'Tamil Nadu');
  const [country, setCountry] = useState(currentUser.location?.country || 'India');

  // Verification state
  const [idUploaded, setIdUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<'unverified' | 'pending' | 'verified'>('verified');

  // Kundli & Birth Details
  const [birthPlace, setBirthPlace] = useState(currentUser.birthPlace || 'Chennai, Tamil Nadu');
  const [birthTime, setBirthTime] = useState(currentUser.birthTime || '14:30');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || '1998-09-12');
  const [rashi, setRashi] = useState(currentUser.rashi || 'Kanya (Virgo)');
  const [nakshatra, setNakshatra] = useState(currentUser.nakshatra || 'Hasta');
  const [gotra, setGotra] = useState(currentUser.gotra || 'Kashyap');

  // Basic Info
  const [profileCreatedBy, setProfileCreatedBy] = useState(currentUser.basicInfo?.profileCreatedBy || 'Parents');
  const [weight, setWeight] = useState(currentUser.basicInfo?.weight || '62 kg');
  const [bodyType, setBodyType] = useState(currentUser.basicInfo?.bodyType || 'Slim');
  const [complexion, setComplexion] = useState(currentUser.basicInfo?.complexion || 'Fair');
  const [bloodGroup, setBloodGroup] = useState(currentUser.basicInfo?.bloodGroup || 'O+ve');
  const [maritalStatus, setMaritalStatus] = useState(currentUser.basicInfo?.maritalStatus || 'Never Married');
  const [citizenship, setCitizenship] = useState(currentUser.basicInfo?.citizenship || 'Indian');

  // Family Details
  const [fatherName, setFatherName] = useState(currentUser.familyDetails?.father?.name || 'V. Sundar');
  const [fatherOccupation, setFatherOccupation] = useState(currentUser.familyDetails?.father?.occupation || 'Retired Senior Government Officer');
  const [motherName, setMotherName] = useState(currentUser.familyDetails?.mother?.name || 'S. Savitri');
  const [motherOccupation, setMotherOccupation] = useState(currentUser.familyDetails?.mother?.occupation || 'Homemaker');
  const [familyType, setFamilyType] = useState(currentUser.familyDetails?.familyType || 'Nuclear');
  const [familyStatus, setFamilyStatus] = useState(currentUser.familyDetails?.familyStatus || 'Upper Middle Class');
  const [nativePlace, setNativePlace] = useState(currentUser.familyDetails?.nativePlace || 'Thanjavur, Tamil Nadu');

  // Career & Education Details
  const [highestQualification, setHighestQualification] = useState(currentUser.educationDetails?.highestQualification || 'Masters Degree');
  const [college, setCollege] = useState(currentUser.educationDetails?.college || 'Anna University Campus');
  const [employmentType, setEmploymentType] = useState(currentUser.occupationDetails?.employmentType || 'Private Sector (MNC)');
  const [companyName, setCompanyName] = useState(currentUser.occupationDetails?.companyName || 'Tier-1 Technology Enterprise');
  const [annualIncome, setAnnualIncome] = useState(currentUser.occupationDetails?.annualIncome || currentUser.salary);

  // Religious & Lifestyle
  const [templeVisits, setTempleVisits] = useState(currentUser.religiousInfo?.templeVisits || 'Visits prominent temples weekly');
  const [spiritualBeliefs, setSpiritualBeliefs] = useState(currentUser.religiousInfo?.spiritualBeliefs || 'Believer in Advaita Vedanta philosophy');
  const [smoking, setSmoking] = useState(currentUser.habits?.smoking || 'No');
  const [drinking, setDrinking] = useState(currentUser.habits?.drinking || 'No');

  // Partner Preferences
  const [prefAgeRange, setPrefAgeRange] = useState(currentUser.partnerPreferences?.ageRange || '22-28');
  const [prefHeight, setPrefHeight] = useState(currentUser.partnerPreferences?.height || "5'2\" - 5'8\"");
  const [prefCaste, setPrefCaste] = useState(currentUser.partnerPreferences?.caste || 'All Brahmin Subcastes');
  const [prefEducation, setPrefEducation] = useState(currentUser.partnerPreferences?.qualification || 'Masters / Professional');

  // Gallery Photos
  const [albumPhotos, setAlbumPhotos] = useState<string[]>([
    currentUser.image,
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1618015358954-115ef1ed6515?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400&h=400'
  ]);

  // Tab State
  const [activeEditTab, setActiveEditTab] = useState<'core' | 'astrology' | 'basic' | 'career' | 'family' | 'preferences'>('core');

  // Photo Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tab navigation order
  const TABS_ORDER: ('core' | 'astrology' | 'basic' | 'career' | 'family' | 'preferences')[] = [
    'core',
    'astrology',
    'basic',
    'career',
    'family',
    'preferences'
  ];

  // Calculate profile completeness score
  const calculateCompleteness = () => {
    let filled = 0;
    const total = 16;
    if (name) filled++;
    if (caste) filled++;
    if (motherTongue) filled++;
    if (profession) filled++;
    if (education) filled++;
    if (salary) filled++;
    if (bio && bio.length > 20) filled++;
    if (birthDate && birthTime && birthPlace) filled++;
    if (rashi && nakshatra && gotra) filled++;
    if (fatherName && motherName) filled++;
    if (nativePlace) filled++;
    if (highestQualification && college) filled++;
    if (companyName) filled++;
    if (prefAgeRange && prefCaste) filled++;
    if (idUploaded) filled++;
    if (albumPhotos.length >= 2) filled++;

    return Math.round((filled / total) * 100);
  };

  const completenessScore = calculateCompleteness();

  const handleNextTab = () => {
    const currentIndex = TABS_ORDER.indexOf(activeEditTab);
    if (currentIndex < TABS_ORDER.length - 1) {
      setActiveEditTab(TABS_ORDER[currentIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    const currentIndex = TABS_ORDER.indexOf(activeEditTab);
    if (currentIndex > 0) {
      setActiveEditTab(TABS_ORDER[currentIndex - 1]);
    }
  };

  // Touch Swipe Handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 60) handleNextTab();
    if (distance < -60) handlePrevTab();
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    onAddNotification('Public profile link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const updated: Profile = {
      ...currentUser,
      name,
      age: Number(age),
      height,
      caste,
      subCaste,
      motherTongue,
      profession,
      education,
      salary,
      bio,
      starSign,
      manglik,
      diet,
      location: {
        city,
        state: stateLoc,
        country
      },
      birthDate,
      birthTime,
      birthPlace,
      rashi,
      nakshatra,
      gotra,
      basicInfo: {
        ...currentUser.basicInfo,
        profileCreatedBy,
        weight,
        bodyType,
        complexion,
        bloodGroup,
        maritalStatus,
        citizenship
      },
      familyDetails: {
        ...currentUser.familyDetails,
        father: {
          ...currentUser.familyDetails?.father,
          name: fatherName,
          occupation: fatherOccupation,
        },
        mother: {
          ...currentUser.familyDetails?.mother,
          name: motherName,
          occupation: motherOccupation,
        },
        familyType,
        familyStatus,
        nativePlace,
      },
      educationDetails: {
        ...currentUser.educationDetails,
        highestQualification,
        college
      },
      occupationDetails: {
        ...currentUser.occupationDetails,
        employmentType,
        companyName,
        annualIncome
      },
      religiousInfo: {
        ...currentUser.religiousInfo,
        templeVisits,
        spiritualBeliefs
      },
      habits: {
        ...currentUser.habits,
        smoking,
        drinking
      },
      partnerPreferences: {
        ...currentUser.partnerPreferences,
        ageRange: prefAgeRange,
        height: prefHeight,
        caste: prefCaste,
        qualification: prefEducation
      },
      photos: {
        ...currentUser.photos,
        album: albumPhotos
      }
    };
    onUpdateUser(updated);
    onAddNotification('Vedic Profile saved successfully! All updates are live for verified families.', 'success');
  };

  const handleSimulateVerification = () => {
    if (!idUploaded || !selfieUploaded) {
      onAddNotification('Please upload both Government ID and Selfie for matching.', 'info');
      return;
    }
    setVerifying(true);
    setVerifiedStatus('pending');
    setTimeout(() => {
      setVerifying(false);
      setVerifiedStatus('verified');
      onAddNotification('Vedic Trust Check Completed! You are now 100% Aadhaar & Facial matched.', 'success');
    }, 2000);
  };

  return (
    <section id="my-profile-section" className="pt-2 pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* TOP HEADER & COMPLETION ENGINE */}
        <div className="glass-card bg-white/80 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 font-poppins text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles size={13} /> Official Vedic Profile
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-poppins text-xs font-bold rounded-full flex items-center gap-1">
                  <ShieldCheck size={13} /> Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 tracking-tight">
                {currentUser.name}&rsquo;s Matrimonial Hub
              </h1>
              <p className="text-xs sm:text-sm font-sans text-gray-500">
                Manage your candidate details, horoscope alignment, family background, and parent preferences.
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-2xl shrink-0 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer ${
                  viewMode === 'edit'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit3 size={14} /> Edit Profile
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye size={14} /> Candidate View
              </button>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-gradient-to-r from-orange-50/60 to-pink-50/60 p-4 rounded-2xl border border-orange-100/50 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-poppins font-bold">
              <span className="text-gray-800 flex items-center gap-1.5">
                <CheckCircle size={15} className="text-orange-500" />
                Profile Strength: <span className="text-orange-600">{completenessScore}% Complete</span>
              </span>
              <span className="text-gray-500 text-[11px] font-medium hidden sm:inline">
                {completenessScore >= 90 ? '🌟 Highly Compatible for Top Matches' : '💡 Complete details to double match responses'}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${completenessScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* LEFT COLUMN: Profile Avatar, Quick Badges & Verification */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Profile Summary Card */}
            <div className="glass-card bg-white/80 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full" />
              
              <div className="relative inline-block mt-2 group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                <img
                  src={currentUser.image}
                  alt={currentUser.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-md group-hover:brightness-95 transition-all ring-2 ring-orange-200"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageModalOpen(true);
                  }}
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer"
                  title="Change Primary Photo"
                >
                  <Camera size={22} />
                  <span className="mt-1">Update Photo</span>
                </button>
                <div className="absolute bottom-1 right-1 bg-gradient-to-br from-orange-500 to-pink-500 text-white p-2.5 rounded-full border-2 border-white shadow-sm">
                  <Camera size={14} />
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-poppins font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <Camera size={13} />
                  <span>Change Profile Photo</span>
                </button>
              </div>

              <div className="mt-4 space-y-1">
                <p className="font-poppins font-bold text-xl text-gray-900 flex items-center justify-center gap-2">
                  {currentUser.name}
                  <span className="text-[10px] px-2.5 py-0.5 bg-orange-100 text-orange-700 font-extrabold rounded-full uppercase tracking-wider">
                    VIP
                  </span>
                </p>
                <p className="text-xs text-gray-500 font-sans font-medium">
                  {currentUser.age} yrs • {currentUser.height} • {currentUser.gender}
                </p>
                <p className="text-xs text-gray-600 font-sans">
                  {currentUser.profession} • {currentUser.education}
                </p>
                <p className="text-xs text-gray-400 font-sans flex items-center justify-center gap-1 pt-1">
                  <MapPin size={12} className="text-orange-500" />
                  {city}, {stateLoc}, {country}
                </p>
              </div>

              {/* Quick Tags */}
              <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-semibold">
                  {currentUser.caste}
                </span>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-semibold">
                  {currentUser.manglik}
                </span>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-semibold">
                  {currentUser.diet}
                </span>
              </div>

              {/* Quick Action Buttons */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleCopyProfileLink}
                  className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-poppins font-semibold rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied Link!' : 'Share Profile'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddNotification('Downloading Vedic Horoscope Summary PDF...', 'info')}
                  className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-poppins font-semibold rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Download Kundli PDF"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Kundli PDF</span>
                </button>
              </div>
            </div>

            {/* Photo Gallery Thumbnails Card */}
            <div className="glass-card bg-white/80 backdrop-blur-md border border-white/60 p-5 rounded-3xl shadow-sm space-y-3 text-left">
              <div className="flex items-center justify-between">
                <p className="font-poppins font-bold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Camera size={14} className="text-orange-500" /> Photo Album ({albumPhotos.length})
                </p>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="text-[11px] font-poppins font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <Plus size={12} /> Add Photo
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {albumPhotos.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                    <img src={url} alt={`Album photo ${idx+1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vedic Trust Shield & Verification Card */}
            <div className="glass-card bg-white/80 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm space-y-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-orange-100 rounded-2xl text-orange-600">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-poppins font-bold text-sm text-gray-900">Vedic Trust Shield</p>
                  <p className="text-xs text-gray-500">Government ID &amp; Liveness Authentication</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700">Aadhaar / National ID</span>
                  </div>
                  {idUploaded ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={13} /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setIdUploaded(true);
                        onAddNotification('Government ID uploaded securely.', 'info');
                      }}
                      className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      Upload ID
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Camera size={16} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700">Facial Liveness Selfie</span>
                  </div>
                  {selfieUploaded ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={13} /> Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelfieUploaded(true);
                        onAddNotification('Facial liveness photo captured.', 'info');
                      }}
                      className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      Capture Live
                    </button>
                  )}
                </div>
              </div>

              {verifiedStatus === 'verified' ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-emerald-900">
                  <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                  <div className="text-xs font-sans leading-relaxed">
                    <span className="font-bold">Trust Badge Active!</span> Your profile has been 100% authenticated for parent inquiries.
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSimulateVerification}
                  disabled={verifying}
                  className="w-full py-3 bg-gray-900 text-white text-xs font-poppins font-bold rounded-xl hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {verifying ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Verifying Records...
                    </>
                  ) : (
                    <>
                      Generate Trust Shield Badge <ArrowRight size={14} />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Mode 1 - Tabbed Form Editor OR Mode 2 - Candidate Public View */}
          <div className="lg:col-span-8">
            
            {viewMode === 'edit' ? (
              /* MODE 1: EDIT PROFILE FORM */
              <form onSubmit={handleSaveProfile} className="glass-card bg-white/80 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                  <div className="p-2.5 bg-orange-100 rounded-2xl text-orange-600">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="font-poppins font-bold text-base text-gray-900">Edit Profile Information</h2>
                    <p className="text-xs text-gray-500">Update personal details, horoscope, education, family background, and partner preferences.</p>
                  </div>
                </div>

                {/* Tabs Header */}
                <div className="relative border-b border-gray-200/80">
                  <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none snap-x">
                    {[
                      { id: 'core', label: 'Core Profile', icon: User },
                      { id: 'astrology', label: 'Astro & Kundli', icon: Sparkles },
                      { id: 'basic', label: 'Basic Info', icon: FileText },
                      { id: 'career', label: 'Career & Edu', icon: GraduationCap },
                      { id: 'family', label: 'Family & Culture', icon: Users },
                      { id: 'preferences', label: 'Partner Prefs', icon: HeartHandshake }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeEditTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveEditTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-poppins font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm'
                              : 'bg-gray-100/70 text-gray-600 hover:bg-gray-200/80'
                          }`}
                        >
                          <Icon size={14} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Tab Body with Gestures */}
                <div 
                  className="min-h-96 touch-pan-y relative"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeEditTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-5"
                    >
                      
                      {/* CORE PROFILE TAB */}
                      {activeEditTab === 'core' && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Full Candidate Name</label>
                              <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Age (Years)</label>
                                <input
                                  type="number"
                                  required
                                  value={age}
                                  onChange={(e) => setAge(Number(e.target.value))}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Height</label>
                                <input
                                  type="text"
                                  required
                                  value={height}
                                  onChange={(e) => setHeight(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                  placeholder='e.g. 5ft 6in'
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Caste / Community</label>
                                <input
                                  type="text"
                                  required
                                  value={caste}
                                  onChange={(e) => setCaste(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Sub-Caste</label>
                                <input
                                  type="text"
                                  value={subCaste}
                                  onChange={(e) => setSubCaste(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Mother Tongue</label>
                              <input
                                type="text"
                                required
                                value={motherTongue}
                                onChange={(e) => setMotherTongue(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Dietary Preference</label>
                                <select
                                  value={diet}
                                  onChange={(e) => setDiet(e.target.value as any)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                >
                                  <option value="Veg">Vegetarian</option>
                                  <option value="Non-Veg">Non-Vegetarian</option>
                                  <option value="Eggetarian">Eggetarian</option>
                                  <option value="Vegan">Vegan</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Manglik Status</label>
                                <select
                                  value={manglik}
                                  onChange={(e) => setManglik(e.target.value as any)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                >
                                  <option value="Non-Manglik">Non-Manglik</option>
                                  <option value="Manglik">Manglik</option>
                                  <option value="Anshik">Anshik / Partial</option>
                                  <option value="No">No Dosham</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 md:col-span-2">
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">City</label>
                                <input
                                  type="text"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">State</label>
                                <input
                                  type="text"
                                  value={stateLoc}
                                  onChange={(e) => setStateLoc(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Country</label>
                                <input
                                  type="text"
                                  value={country}
                                  onChange={(e) => setCountry(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">About Candidate / Personal Biography</label>
                            <textarea
                              rows={4}
                              required
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed"
                              placeholder="Describe your candidate profile, values, hobbies, and vision for marriage..."
                            />
                          </div>
                        </div>
                      )}

                      {/* ASTROLOGY & KUNDLI TAB */}
                      {activeEditTab === 'astrology' && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Date of Birth</label>
                              <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Time of Birth</label>
                              <input
                                type="time"
                                value={birthTime}
                                onChange={(e) => setBirthTime(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Place of Birth</label>
                              <input
                                type="text"
                                value={birthPlace}
                                onChange={(e) => setBirthPlace(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                          </div>

                          {/* Visual Kundli Grid Simulator */}
                          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 rounded-2xl border border-amber-200/60 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-poppins font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={14} className="text-amber-600" /> Vedic Kundli Parameters
                              </span>
                              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                                Ashtakoota Ready
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="p-3 bg-white/90 rounded-xl border border-amber-100 shadow-2xs">
                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Rashi (Moon Sign)</label>
                                <input 
                                  type="text"
                                  value={rashi}
                                  onChange={(e) => setRashi(e.target.value)}
                                  className="w-full bg-transparent font-poppins font-bold text-gray-900 text-xs outline-hidden"
                                />
                              </div>
                              <div className="p-3 bg-white/90 rounded-xl border border-amber-100 shadow-2xs">
                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nakshatra (Star)</label>
                                <input 
                                  type="text"
                                  value={nakshatra}
                                  onChange={(e) => setNakshatra(e.target.value)}
                                  className="w-full bg-transparent font-poppins font-bold text-gray-900 text-xs outline-hidden"
                                />
                              </div>
                              <div className="p-3 bg-white/90 rounded-xl border border-amber-100 shadow-2xs">
                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Gotra / Clan</label>
                                <input 
                                  type="text"
                                  value={gotra}
                                  onChange={(e) => setGotra(e.target.value)}
                                  className="w-full bg-transparent font-poppins font-bold text-gray-900 text-xs outline-hidden"
                                />
                              </div>
                              <div className="p-3 bg-white/90 rounded-xl border border-amber-100 shadow-2xs">
                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sun / Star Sign</label>
                                <input 
                                  type="text"
                                  value={starSign}
                                  onChange={(e) => setStarSign(e.target.value)}
                                  className="w-full bg-transparent font-poppins font-bold text-gray-900 text-xs outline-hidden"
                                  placeholder="e.g. Leo"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Temple &amp; Spiritual Routine</label>
                              <input
                                type="text"
                                value={templeVisits}
                                onChange={(e) => setTempleVisits(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Spiritual Beliefs / Alignment</label>
                              <input
                                type="text"
                                value={spiritualBeliefs}
                                onChange={(e) => setSpiritualBeliefs(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BASIC INFO TAB */}
                      {activeEditTab === 'basic' && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Profile Created By</label>
                              <select
                                value={profileCreatedBy}
                                onChange={(e) => setProfileCreatedBy(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              >
                                <option value="Self">Self</option>
                                <option value="Parents">Parents</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Relative / Friend">Relative / Friend</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Marital Status</label>
                              <select
                                value={maritalStatus}
                                onChange={(e) => setMaritalStatus(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              >
                                <option value="Never Married">Never Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Awaiting Divorce">Awaiting Divorce</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Complexion</label>
                              <input
                                type="text"
                                value={complexion}
                                onChange={(e) => setComplexion(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                                placeholder="Fair / Wheatish / Very Fair"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Body Build</label>
                              <select
                                value={bodyType}
                                onChange={(e) => setBodyType(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              >
                                <option value="Slim">Slim</option>
                                <option value="Average">Average</option>
                                <option value="Athletic">Athletic</option>
                                <option value="Heavy">Heavy</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Weight (kg)</label>
                              <input
                                type="text"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Blood Group</label>
                              <input
                                type="text"
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Citizenship</label>
                              <input
                                type="text"
                                value={citizenship}
                                onChange={(e) => setCitizenship(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Habits &amp; Personal Lifestyle</label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                                  <span className="text-xs font-semibold text-gray-700">Smoking:</span>
                                  <select
                                    value={smoking}
                                    onChange={(e) => setSmoking(e.target.value as any)}
                                    className="bg-transparent text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                                  >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="Occasionally">Occasionally</option>
                                  </select>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                                  <span className="text-xs font-semibold text-gray-700">Drinking:</span>
                                  <select
                                    value={drinking}
                                    onChange={(e) => setDrinking(e.target.value as any)}
                                    className="bg-transparent text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                                  >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="Occasionally">Occasionally</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CAREER & EDUCATION TAB */}
                      {activeEditTab === 'career' && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Highest Qualification</label>
                              <input
                                type="text"
                                value={highestQualification}
                                onChange={(e) => setHighestQualification(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">College / University</label>
                              <input
                                type="text"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Degree Title</label>
                              <input
                                type="text"
                                required
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Employment Sector</label>
                              <select
                                value={employmentType}
                                onChange={(e) => setEmploymentType(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              >
                                <option value="Private Sector (MNC)">Private Sector (MNC)</option>
                                <option value="Government / PSU">Government / PSU</option>
                                <option value="Defense Forces">Defense Forces</option>
                                <option value="Business / Entrepreneur">Business / Entrepreneur</option>
                                <option value="Freelance / Consultant">Freelance / Consultant</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Company / Enterprise</label>
                              <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Role / Profession</label>
                              <input
                                type="text"
                                required
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Annual Salary Text</label>
                              <input
                                type="text"
                                required
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Annual Income Range</label>
                              <input
                                type="text"
                                value={annualIncome}
                                onChange={(e) => setAnnualIncome(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FAMILY DETAILS TAB */}
                      {activeEditTab === 'family' && (
                        <div className="space-y-5">
                          <div className="p-4 bg-orange-50/30 border border-orange-100 rounded-2xl space-y-3">
                            <p className="text-xs font-poppins font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
                              <Users size={14} /> Father&rsquo;s Profile
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1">Father&rsquo;s Name</label>
                                <input
                                  type="text"
                                  value={fatherName}
                                  onChange={(e) => setFatherName(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1">Father&rsquo;s Occupation</label>
                                <input
                                  type="text"
                                  value={fatherOccupation}
                                  onChange={(e) => setFatherOccupation(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-hidden"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-orange-50/30 border border-orange-100 rounded-2xl space-y-3">
                            <p className="text-xs font-poppins font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
                              <User size={14} /> Mother&rsquo;s Profile
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1">Mother&rsquo;s Name</label>
                                <input
                                  type="text"
                                  value={motherName}
                                  onChange={(e) => setMotherName(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-poppins font-bold text-gray-700 mb-1">Mother&rsquo;s Occupation</label>
                                <input
                                  type="text"
                                  value={motherOccupation}
                                  onChange={(e) => setMotherOccupation(e.target.value)}
                                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-hidden"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Family Type</label>
                              <select
                                value={familyType}
                                onChange={(e) => setFamilyType(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden"
                              >
                                <option value="Nuclear">Nuclear Family</option>
                                <option value="Joint">Joint Family</option>
                                <option value="Extended">Extended Family</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Social &amp; Family Status</label>
                              <select
                                value={familyStatus}
                                onChange={(e) => setFamilyStatus(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden"
                              >
                                <option value="Upper Middle Class">Upper Middle Class</option>
                                <option value="Middle Class">Middle Class</option>
                                <option value="Elite / Upper Class">Elite / Upper Class</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Native / Ancestral Roots</label>
                              <input
                                type="text"
                                value={nativePlace}
                                onChange={(e) => setNativePlace(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PARTNER PREFERENCES TAB */}
                      {activeEditTab === 'preferences' && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Preferred Age Range</label>
                              <input
                                type="text"
                                value={prefAgeRange}
                                onChange={(e) => setPrefAgeRange(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                                placeholder="e.g. 22-28"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Preferred Height Range</label>
                              <input
                                type="text"
                                value={prefHeight}
                                onChange={(e) => setPrefHeight(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                                placeholder="e.g. 5ft 2in to 5ft 8in"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Caste &amp; Subcaste Preference</label>
                              <input
                                type="text"
                                value={prefCaste}
                                onChange={(e) => setPrefCaste(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-poppins font-bold text-gray-700 mb-1.5">Education Expectation</label>
                              <input
                                type="text"
                                value={prefEducation}
                                onChange={(e) => setPrefEducation(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-sans text-gray-900 focus:outline-hidden focus:border-orange-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Submit Controls & Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-gray-200">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      type="button"
                      disabled={activeEditTab === 'core'}
                      onClick={handlePrevTab}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${
                        activeEditTab === 'core'
                          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <ArrowRight size={16} className="rotate-180" />
                    </button>
                    
                    <div className="flex gap-1.5 px-2">
                      {TABS_ORDER.map((tabId, idx) => (
                        <button
                          key={tabId}
                          type="button"
                          onClick={() => setActiveEditTab(tabId)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            activeEditTab === tabId
                              ? 'bg-orange-500 w-5'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={activeEditTab === 'preferences'}
                      onClick={handleNextTab}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${
                        activeEditTab === 'preferences'
                          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 text-white font-poppins text-xs font-bold rounded-xl shadow-md hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={15} /> Save &amp; Validate Profile
                  </button>
                </div>

              </form>
            ) : (
              /* MODE 2: CANDIDATE PUBLIC PREVIEW MODE */
              <div className="glass-card bg-white/80 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 text-left">
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl">
                      <Eye size={18} />
                    </span>
                    <div>
                      <h2 className="font-poppins font-bold text-base text-gray-900">Live Candidate Preview</h2>
                      <p className="text-xs text-gray-500">How prospective families view your matrimonial profile card.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-poppins font-bold rounded-full">
                    Active &amp; Discoverable
                  </span>
                </div>

                {/* Candidate Banner Card */}
                <div className="bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-white p-6 rounded-3xl border border-orange-100 relative overflow-hidden space-y-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <img
                      src={currentUser.image}
                      alt={name}
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-orange-200 shrink-0"
                    />
                    <div className="space-y-1.5 text-center sm:text-left flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <h3 className="font-poppins font-bold text-xl text-gray-900">{name}</h3>
                        <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-extrabold rounded-full font-poppins">
                          Verified Candidate
                        </span>
                      </div>
                      <p className="text-xs font-sans text-gray-600 font-medium">
                        {age} yrs • {height} • {caste} ({subCaste || 'General'})
                      </p>
                      <p className="text-xs font-sans text-gray-600">
                        {profession} @ {companyName} • {education}
                      </p>
                      <p className="text-xs font-sans text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                        <MapPin size={12} className="text-orange-500" /> {city}, {stateLoc}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-gray-700 leading-relaxed pt-2 border-t border-orange-100/60">
                    &ldquo;{bio}&rdquo;
                  </p>
                </div>

                {/* Kundli & Astro Alignment Box */}
                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-3">
                  <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-600" /> Vedic Kundli Milan Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Rashi</span>
                      <span className="font-poppins font-bold text-xs text-gray-900">{rashi}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Nakshatra</span>
                      <span className="font-poppins font-bold text-xs text-gray-900">{nakshatra}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Gotra</span>
                      <span className="font-poppins font-bold text-xs text-gray-900">{gotra}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Dosha</span>
                      <span className="font-poppins font-bold text-xs text-emerald-700">{manglik}</span>
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <p className="font-poppins font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Users size={14} className="text-orange-500" /> Family Background
                    </p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Father:</span> {fatherName} ({fatherOccupation})</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Mother:</span> {motherName} ({motherOccupation})</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Native Place:</span> {nativePlace}</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Family Type:</span> {familyType} • {familyStatus}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <p className="font-poppins font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <HeartHandshake size={14} className="text-orange-500" /> Partner Preferences
                    </p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Age Preferred:</span> {prefAgeRange}</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Height:</span> {prefHeight}</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Community:</span> {prefCaste}</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-800">Education:</span> {prefEducation}</p>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Profile Image Modal */}
      <ProfileImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={onUpdateUser}
        onAddNotification={onAddNotification}
      />
    </section>
  );
}
