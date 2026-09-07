import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Profile, SearchFilters } from '../types';
import { mockProfiles } from '../mockData';
import ProfileCard from './ProfileCard';
import AISearchBar from './AISearchBar';

interface ProfileGridProps {
  initialFilters: SearchFilters;
  onOpenChat: (profile: Profile) => void;
  onExpressInterest: (profile: Profile) => void;
  onViewProfile: (profile: Profile) => void;
  currentUser?: Profile | null;
}

function calculateCompatibility(user: Profile, target: Profile): { score: number; reason: string } {
  const seedString = user.id + target.id;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Base compatibility score
  let scorePoints = 72 + Math.abs(hash % 16); // 72 to 88 base
  const reasons: string[] = [];

  // Diet preference
  if (user.diet && target.diet) {
    if (user.diet === target.diet) {
      scorePoints += 4;
      reasons.push(`Shared dietary preference (${user.diet})`);
    } else if ((user.diet === 'Veg' || user.diet === 'Vegan') && target.diet === 'Non-Veg') {
      scorePoints -= 6;
    }
  }

  // Manglik compatibility
  if (user.manglik && target.manglik) {
    if (user.manglik === target.manglik) {
      scorePoints += 5;
      reasons.push(`Matching ${user.manglik} status`);
    } else if (user.manglik === 'Non-Manglik' && target.manglik === 'Non-Manglik') {
      scorePoints += 6;
    }
  }

  // Caste / Community
  if (user.caste && target.caste) {
    if (user.caste === target.caste) {
      scorePoints += 5;
      reasons.push(`Shared cultural roots (${user.caste})`);
    } else if (user.familyValues === 'Liberal') {
      scorePoints += 2;
    }
  }

  // Lifestyle compatibility
  if (user.lifestyle && target.lifestyle) {
    if (user.lifestyle === target.lifestyle) {
      scorePoints += 4;
      reasons.push(`Aligned ${user.lifestyle} lifestyle views`);
    }
  }

  // Age difference
  const ageDiff = Math.abs(user.age - target.age);
  if (ageDiff <= 3) {
    scorePoints += 3;
    reasons.push("Perfect age compatibility");
  }

  // Ensure score is bounded between 65% and 98% for realistic compatibility representation
  const finalScore = Math.min(98, Math.max(65, scorePoints));
  
  let finalReason = "Strong values alignment";
  if (reasons.length > 0) {
    finalReason = reasons.slice(0, 2).join(" & ") + ".";
  } else {
    finalReason = "Harmonious Vedic parameters & aligned lifestyle expectations.";
  }

  return { score: finalScore, reason: finalReason };
}

export default function ProfileGrid({ initialFilters, onOpenChat, onExpressInterest, onViewProfile, currentUser }: ProfileGridProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // Synced filters when hero trigger updates
  useMemo(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Live filter computation based only on gender quick-toggle and search filters
  const filteredProfiles = useMemo(() => {
    let list = [...mockProfiles];

    // Effective user to compare preferences against
    const activeUser = currentUser || {
      id: 'user_current',
      name: 'Karthik Krishnan',
      gender: 'Groom',
      age: 28,
      diet: 'Veg',
      manglik: 'Non-Manglik',
      religion: 'Hindu',
      caste: 'Iyer',
      lifestyle: 'Modern',
      familyValues: 'Moderate'
    } as Profile;

    // If an AI search result is active, map the match scores and sort
    if (aiResult && aiResult.matches && aiResult.matches.length > 0) {
      const matchMap = new Map<string, any>(aiResult.matches.map((m: any) => [m.profileId, m]));
      
      list = list
        .filter(p => matchMap.has(p.id))
        .map(p => {
          const matchData = matchMap.get(p.id);
          return {
            ...p,
            aiScore: matchData?.score,
            aiReason: matchData?.reason
          };
        });
      
      // Sort by match score descending
      list.sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0));
    } else {
      // Default / Always present compatibility scoring based on user profile preferences
      list = list.map(p => {
        const comp = calculateCompatibility(activeUser, p);
        return {
          ...p,
          aiScore: comp.score,
          aiReason: comp.reason
        };
      });

      // Sort by compatibility score descending by default
      list.sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0));
    }

    // Apply all search filters
    const effectiveGender = currentUser 
      ? (currentUser.gender === 'Groom' ? 'Bride' : 'Groom')
      : filters.gender;

    if (effectiveGender) {
      list = list.filter((profile) => profile.gender === effectiveGender);
    }
    if (filters.ageMin) {
      list = list.filter((profile) => profile.age >= (filters.ageMin ?? 0));
    }
    if (filters.ageMax) {
      list = list.filter((profile) => profile.age <= (filters.ageMax ?? 100));
    }
    if (filters.caste) {
      list = list.filter(
        (profile) =>
          profile.caste.toLowerCase() === filters.caste?.toLowerCase() ||
          profile.caste.toLowerCase().includes(filters.caste?.toLowerCase() ?? '')
      );
    }
    if (filters.subCaste) {
      list = list.filter(
        (profile) =>
          profile.subCaste &&
          (profile.subCaste.toLowerCase() === filters.subCaste?.toLowerCase() ||
            profile.subCaste.toLowerCase().includes(filters.subCaste?.toLowerCase() ?? ''))
      );
    }
    if (filters.motherTongue) {
      list = list.filter(
        (profile) =>
          profile.motherTongue.toLowerCase() === filters.motherTongue?.toLowerCase() ||
          profile.motherTongue.toLowerCase().includes(filters.motherTongue?.toLowerCase() ?? '')
      );
    }
    if (filters.city) {
      list = list.filter(
        (profile) => profile.location.city.toLowerCase() === filters.city?.toLowerCase()
      );
    }

    return list;
  }, [filters, aiResult, currentUser]);

  return (
    <section
      id="search-profiles-section"
      className="pt-2 pb-20 bg-transparent relative mandala-pattern"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div className="text-left">
            <h2 className="text-xs font-bold text-orange-600 uppercase tracking-widest font-poppins">
              Match Discovery
            </h2>
            <p className="text-3xl font-poppins font-bold text-gray-900 mt-1">
              Browse Genuine &amp; Verified Matches
            </p>
          </div>

          {/* Gender quick toggle */}
          {currentUser ? (
            <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-2xl border border-orange-100/60 font-sans font-black text-xs tracking-wider flex items-center gap-1.5 shadow-xs uppercase self-start md:self-end">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Seeking {currentUser.gender === 'Groom' ? 'Brides (Females)' : 'Grooms (Males)'}
            </div>
          ) : (
            <div className="flex items-center gap-2 self-start md:self-end bg-gray-100/80 p-1 rounded-2xl border border-gray-200/50 backdrop-blur-xs">
              <button
                onClick={() => setFilters({ ...filters, gender: undefined })}
                className={`px-4 py-2 text-xs font-poppins font-medium rounded-xl transition-all cursor-pointer ${
                  filters.gender === undefined
                    ? 'bg-white text-orange-600 shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                All Matches
              </button>
              <button
                onClick={() => setFilters({ ...filters, gender: 'Bride' })}
                className={`px-4 py-2 text-xs font-poppins font-medium rounded-xl transition-all cursor-pointer ${
                  filters.gender === 'Bride'
                    ? 'bg-white text-orange-600 shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Brides
              </button>
              <button
                onClick={() => setFilters({ ...filters, gender: 'Groom' })}
                className={`px-4 py-2 text-xs font-poppins font-medium rounded-xl transition-all cursor-pointer ${
                  filters.gender === 'Groom'
                    ? 'bg-white text-orange-600 shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Grooms
              </button>
            </div>
          )}
        </div>

        {/* AI-Powered Natural Language Search Bar */}
        <AISearchBar 
          profiles={mockProfiles} 
          onSearchComplete={(result) => setAiResult(result)} 
        />

        {/* Results layout */}
        <div className="w-full space-y-6">
          
          {/* Stats Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-sm font-sans text-gray-500 text-left">
              Showing <strong className="text-gray-900 font-semibold">{filteredProfiles.length}</strong> matching premium profiles
            </span>
          </div>

          {/* Grid display */}
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((p: any) => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  onOpenChat={onOpenChat}
                  onExpressInterest={onExpressInterest}
                  onViewProfile={onViewProfile}
                  aiScore={p.aiScore}
                  aiReason={p.aiReason}
                />
              ))}
            </div>
          ) : (
            /* Beautiful Empty state */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center border border-dashed border-gray-300 max-w-lg mx-auto mt-8 animate-fade-in"
            >
              <h3 className="font-poppins font-bold text-lg text-gray-900 mb-2">
                No Profiles Available
              </h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed mb-6">
                Try toggling your search options at the top.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
