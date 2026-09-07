import { useState, MouseEvent } from 'react';
import { Heart, MessageSquare, ShieldCheck, MapPin, Briefcase, GraduationCap, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  onOpenChat: (profile: Profile) => void;
  onExpressInterest: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
  isInterestedByDefault?: boolean;
  aiScore?: number;
  aiReason?: string;
  key?: any;
}

export default function ProfileCard({ 
  profile, 
  onOpenChat, 
  onExpressInterest, 
  onViewProfile, 
  isInterestedByDefault = false,
  aiScore,
  aiReason
}: ProfileCardProps) {
  const [isInterested, setIsInterested] = useState(isInterestedByDefault);
  const [interestCount, setInterestCount] = useState(0);

  const handleInterestClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsInterested(!isInterested);
    if (!isInterested) {
      setInterestCount(1);
      onExpressInterest(profile);
    } else {
      setInterestCount(0);
    }
  };

  return (
    <motion.div
      id={`profile-card-${profile.id}`}
      className="glass-card relative overflow-hidden flex flex-col justify-between group h-full border border-white/45"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <div
        onClick={() => onViewProfile && onViewProfile(profile)}
        className="cursor-pointer hover:opacity-95 transition-opacity"
        title="Click to view full Vedic profile"
      >
        {/* Profile Image & Badges */}
        <div className="relative h-64 overflow-hidden rounded-t-[24px]">
          <img
            src={profile.image}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Saffron gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Verified Badge */}
          {profile.verified && (
            <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-semibold tracking-wider uppercase backdrop-blur-xs">
              <ShieldCheck size={12} />
              Verified
            </div>
          )}

          {/* Compatibility Score Badge */}
          {aiScore !== undefined && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-extrabold font-poppins tracking-wider uppercase shadow-md border border-orange-400/30">
              <Sparkles size={11} className="text-white fill-white/25 animate-pulse shrink-0" />
              <span>{aiScore}% Compatibility</span>
            </div>
          )}

          {/* Quick Stats Overlaid */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-poppins font-bold text-lg leading-tight flex items-center gap-1.5">
              {profile.name}
              <span className="font-sans font-medium text-sm opacity-90">({profile.age})</span>
            </h3>
            <p className="text-xs font-sans opacity-85 mt-1 flex items-center gap-1">
              <MapPin size={12} />
              {profile.location.city}, {profile.location.state}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5 space-y-3">
          {/* Main attributes grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <div className="flex items-center gap-1.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
              <Users size={13} className="text-orange-500" />
              <span className="truncate">{profile.caste}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
              <GraduationCap size={13} className="text-orange-500" />
              <span className="truncate" title={profile.education}>{profile.education}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
              <Briefcase size={13} className="text-orange-500" />
              <span className="truncate">{profile.profession} ({profile.salary})</span>
            </div>
          </div>

          {/* Truncated Bio */}
          <p className="text-xs text-gray-500 font-sans leading-relaxed line-clamp-3">
            {profile.bio}
          </p>

          {/* AI Matching Reason */}
          {aiReason && (
            <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl text-left flex items-start gap-2">
              <Sparkles size={12} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-sans text-orange-800 leading-normal italic">
                {aiReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-3">
        <button
          id={`btn-interest-${profile.id}`}
          onClick={handleInterestClick}
          className={`py-3 px-4 rounded-xl font-poppins font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            isInterested
              ? 'bg-rose-50 text-rose-600 border-rose-200/50 hover:bg-rose-100'
              : 'bg-white/50 text-gray-700 border-gray-200 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart size={14} className={isInterested ? 'fill-rose-500 text-rose-500' : ''} />
          {isInterested ? 'Interested' : 'Express Interest'}
        </button>

        <button
          id={`btn-chat-${profile.id}`}
          onClick={() => onOpenChat(profile)}
          className="py-3 px-4 rounded-xl font-poppins font-medium text-xs text-white bg-linear-to-r from-orange-500 to-amber-500 hover:shadow-md hover:shadow-orange-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-98"
        >
          <MessageSquare size={14} />
          Chat Now
        </button>
      </div>
    </motion.div>
  );
}
