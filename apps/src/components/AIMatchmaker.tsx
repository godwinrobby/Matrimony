import { useState, useEffect } from 'react';
import { Sparkles, Brain, Compass, HelpCircle, AlertCircle, RefreshCw, Zap, Flame, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockProfiles } from '../mockData';
import { Profile } from '../types';

interface AIMatchmakerProps {
  currentUser?: Profile | null;
  selectedProfile?: Profile | null;
  onClearSelectedProfile?: () => void;
}

export default function AIMatchmaker({ currentUser, selectedProfile, onClearSelectedProfile }: AIMatchmakerProps = {}) {
  // Filter grooms for dropdown 1, brides for dropdown 2, incorporating the logged in user as an option
  const grooms = [
    ...(currentUser && currentUser.gender === 'Groom' ? [currentUser] : []),
    ...mockProfiles.filter(p => p.gender === 'Groom' && p.id !== currentUser?.id)
  ];
  const brides = [
    ...(currentUser && currentUser.gender === 'Bride' ? [currentUser] : []),
    ...mockProfiles.filter(p => p.gender === 'Bride' && p.id !== currentUser?.id)
  ];

  const [partner1Id, setPartner1Id] = useState(() => {
    if (currentUser && currentUser.gender === 'Groom') {
      return currentUser.id;
    }
    if (selectedProfile && selectedProfile.gender === 'Groom') {
      return selectedProfile.id;
    }
    return 'p2'; // Karthik Krishnan (Groom)
  });

  const [partner2Id, setPartner2Id] = useState(() => {
    if (currentUser && currentUser.gender === 'Bride') {
      return currentUser.id;
    }
    if (selectedProfile && selectedProfile.gender === 'Bride') {
      return selectedProfile.id;
    }
    return 'p1'; // Aishwarya Iyer (Bride)
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const p1 = [currentUser, ...mockProfiles].find(p => p && p.id === partner1Id) || grooms[0];
  const p2 = [currentUser, ...mockProfiles].find(p => p && p.id === partner2Id) || brides[0];

  // Sync selection if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.gender === 'Groom') {
        setPartner1Id(currentUser.id);
      } else if (currentUser.gender === 'Bride') {
        setPartner2Id(currentUser.id);
      }
    }
  }, [currentUser]);

  // Sync selection if selectedProfile is provided/changed
  useEffect(() => {
    if (selectedProfile) {
      if (selectedProfile.gender === 'Groom') {
        setPartner1Id(selectedProfile.id);
        if (currentUser && currentUser.gender === 'Bride') {
          setPartner2Id(currentUser.id);
        }
      } else if (selectedProfile.gender === 'Bride') {
        setPartner2Id(selectedProfile.id);
        if (currentUser && currentUser.gender === 'Groom') {
          setPartner1Id(currentUser.id);
        }
      }
    }
  }, [selectedProfile, currentUser]);

  useEffect(() => {
    const runInitialAnalysis = async () => {
      setLoading(true);
      setError(null);
      setReport(null);

      const allAvailable = [currentUser, ...mockProfiles].filter(Boolean) as Profile[];

      // Determine active groom and bride
      let activeGroom: Profile;
      let activeBride: Profile;

      if (selectedProfile) {
        if (selectedProfile.gender === 'Groom') {
          activeGroom = selectedProfile;
          activeBride = (currentUser && currentUser.gender === 'Bride') 
            ? currentUser 
            : (allAvailable.find(p => p.gender === 'Bride' && p.id !== currentUser?.id) || brides[0]);
        } else {
          activeBride = selectedProfile;
          activeGroom = (currentUser && currentUser.gender === 'Groom') 
            ? currentUser 
            : (allAvailable.find(p => p.gender === 'Groom' && p.id !== currentUser?.id) || grooms[0]);
        }
      } else {
        // Fallback to the current derived selections
        activeGroom = p1;
        activeBride = p2;
      }

      try {
        const response = await fetch('/api/compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile1: activeGroom, profile2: activeBride }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze compatibility. Please try again.');
        }

        const data = await response.json();
        setReport(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Server is temporarily offline. Falling back...');
      } finally {
        setLoading(false);
      }
    };
    runInitialAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile, currentUser]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile1: p1, profile2: p2 }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze compatibility. Please try again.');
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Server is temporarily offline. Falling back...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="ai-matchmaker-section"
      className="pt-2 pb-24 bg-transparent relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-pink-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold tracking-wider uppercase font-poppins mb-3">
            <Brain size={13} className="animate-pulse" />
            AI Matrimonial Intelligence
          </div>
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 leading-tight">
            Predict Relationship Synergy with AI Matchmaking
          </h2>
          <p className="text-sm text-gray-600 mt-3 font-sans">
            Leverage Google Gemini server-side AI to analyze personality matrices, career ambitions, lifestyle routines, and family values of any two partners.
          </p>
          <div className="w-16 h-1 bg-linear-to-r from-orange-500 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Selector Panel Left */}
          <div className="lg:col-span-4 glass-card p-6 md:p-8 border border-white/50 space-y-6 text-left h-full flex flex-col justify-between">
            <div>
              <h3 className="font-poppins font-bold text-gray-900 text-lg flex items-center gap-2 mb-4">
                <Compass className="text-orange-500" size={18} />
                Select Profiles
              </h3>

              {currentUser ? (
                <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100/50 flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-xl shadow-xs shrink-0">
                    <Sparkles size={14} className="animate-pulse" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-orange-800 block">Personalized Matching Active</span>
                    <span className="text-gray-600 font-sans leading-normal">
                      We have automatically pre-selected your profile (<strong>{currentUser.name}</strong>) for instant matchmaking synergy prediction!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="p-2 bg-gray-200 text-gray-500 rounded-xl shrink-0">
                    <AlertCircle size={14} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-gray-700 block">Matching with Guest Account</span>
                    <span className="text-gray-500 font-sans leading-normal">
                      Sign in or create a profile to automatically run AI synergy analysis on your own details.
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Groom selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 font-poppins">
                    Groom Profile
                  </label>
                  {currentUser && currentUser.gender === 'Groom' ? (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <img src={currentUser.image} alt="" className="w-10 h-10 object-cover rounded-full ring-2 ring-orange-500/20" />
                        <div className="text-xs">
                          <span className="block font-bold text-orange-950 flex items-center gap-1.5">
                            {currentUser.name}
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[9px] font-extrabold tracking-wider uppercase font-poppins">You</span>
                          </span>
                          <span className="text-gray-500">{currentUser.location.city} • {currentUser.caste}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <select
                        value={partner1Id}
                        onChange={(e) => setPartner1Id(e.target.value)}
                        className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-white/60 font-sans outline-none focus:border-orange-500"
                      >
                        {grooms.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.age} yrs - {g.profession})
                          </option>
                        ))}
                      </select>
                      {p1 && (
                        <div className="mt-2 flex items-center gap-3 p-3 rounded-xl bg-orange-50/40 border border-orange-100/30">
                          <img src={p1.image} alt="" className="w-10 h-10 object-cover rounded-full" />
                          <div className="text-xs">
                            <span className="block font-semibold text-gray-800">
                              {p1.name}
                            </span>
                            <span className="text-gray-500">{p1.location.city} • {p1.caste}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Heart decorative divider */}
                <div className="flex justify-center py-2 text-rose-500 relative">
                  <div className="h-px bg-gray-100 absolute top-1/2 left-0 right-0 -z-10" />
                  <div className="px-3 bg-white/90 backdrop-blur-xs rounded-full border border-gray-100 text-xs py-1 font-poppins font-bold flex items-center gap-1 text-gray-400">
                    <Flame size={12} className="text-orange-500" />
                    MATCH MATRIX
                  </div>
                </div>

                {/* Bride selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 font-poppins">
                    Bride Profile
                  </label>
                  {currentUser && currentUser.gender === 'Bride' ? (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <img src={currentUser.image} alt="" className="w-10 h-10 object-cover rounded-full ring-2 ring-pink-500/20" />
                        <div className="text-xs">
                          <span className="block font-bold text-pink-950 flex items-center gap-1.5">
                            {currentUser.name}
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-pink-100 text-pink-800 text-[9px] font-extrabold tracking-wider uppercase font-poppins">You</span>
                          </span>
                          <span className="text-gray-500">{currentUser.location.city} • {currentUser.caste}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <select
                        value={partner2Id}
                        onChange={(e) => setPartner2Id(e.target.value)}
                        className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-white/60 font-sans outline-none focus:border-orange-500"
                      >
                        {brides.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.age} yrs - {b.profession})
                          </option>
                        ))}
                      </select>
                      {p2 && (
                        <div className="mt-2 flex items-center gap-3 p-3 rounded-xl bg-orange-50/40 border border-orange-100/30">
                          <img src={p2.image} alt="" className="w-10 h-10 object-cover rounded-full" />
                          <div className="text-xs">
                            <span className="block font-semibold text-gray-800">
                              {p2.name}
                            </span>
                            <span className="text-gray-500">{p2.location.city} • {p2.caste}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              id="btn-trigger-ai-match"
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 mt-8 font-poppins font-bold text-white bg-linear-to-r from-orange-500 via-amber-500 to-pink-500 rounded-2xl hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Running Gemini Core AI...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="animate-pulse" />
                  Calculate AI Compatibility
                </>
              )}
            </button>
          </div>

          {/* Results Panel Right */}
          <div className="lg:col-span-8 w-full h-full">
            <AnimatePresence mode="wait">
              {loading ? (
                /* Beautiful loading skeletons */
                <motion.div
                  key="loading-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-8 md:p-12 border border-white/50 text-left space-y-6"
                >
                  <div className="flex items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-orange-100" />
                    <div className="space-y-2 w-1/2">
                      <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                      <div className="h-3 bg-gray-200 rounded-md w-1/2" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="h-6 bg-gray-200 rounded-md w-full animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-md w-5/6 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-md w-4/5 animate-pulse" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-gray-50/50 rounded-2xl p-4 space-y-2 border border-gray-100 animate-pulse">
                      <div className="h-4 bg-orange-100 rounded-md w-1/3" />
                      <div className="h-3 bg-gray-200 rounded-md w-full" />
                    </div>
                    <div className="h-24 bg-gray-50/50 rounded-2xl p-4 space-y-2 border border-gray-100 animate-pulse">
                      <div className="h-4 bg-amber-100 rounded-md w-1/3" />
                      <div className="h-3 bg-gray-200 rounded-md w-full" />
                    </div>
                  </div>
                </motion.div>
              ) : report ? (
                /* Real AI analysis report */
                <motion.div
                  key="ai-report"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-6 md:p-8 border border-white/50 text-left space-y-6"
                >
                  {/* Top Header stats */}
                  <div className="flex flex-col md:flex-row items-center gap-6 justify-between pb-6 border-b border-gray-100">
                    <div className="text-center md:text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase font-poppins">Report Generated</span>
                      <h4 className="text-xl font-poppins font-bold text-gray-900 mt-1">
                        Synergy: {p1.name} &amp; {p2.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Overall Circle Progress */}
                      <div className="relative flex items-center justify-center w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#fef3c7" strokeWidth="8" fill="transparent" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#f97316"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - report.overallScore / 100)}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-poppins font-bold text-orange-600">{report.overallScore}%</span>
                          <span className="text-[9px] font-medium text-amber-600 uppercase tracking-widest">Match</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                    <p className="text-xs text-orange-800 font-sans leading-relaxed">
                      <strong>AI Insights Summary:</strong> {report.synergySummary}
                    </p>
                  </div>

                  {/* 4 Dimensions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Dimension 1 */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-poppins font-semibold text-xs text-gray-800 flex items-center gap-1">
                          <Sparkles size={12} className="text-orange-500" />
                          Personality Match
                        </span>
                        <span className="text-xs font-bold text-orange-600 font-poppins">{report.dimensions.personality.score}%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{report.dimensions.personality.analysis}</p>
                    </div>

                    {/* Dimension 2 */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-poppins font-semibold text-xs text-gray-800 flex items-center gap-1">
                          <Zap size={12} className="text-amber-500" />
                          Lifestyle &amp; Diet
                        </span>
                        <span className="text-xs font-bold text-amber-600 font-poppins">{report.dimensions.lifestyle.score}%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{report.dimensions.lifestyle.analysis}</p>
                    </div>

                    {/* Dimension 3 */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-poppins font-semibold text-xs text-gray-800 flex items-center gap-1">
                          <Brain size={12} className="text-pink-500" />
                          Education &amp; Career
                        </span>
                        <span className="text-xs font-bold text-pink-600 font-poppins">{report.dimensions.career.score}%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{report.dimensions.career.analysis}</p>
                    </div>

                    {/* Dimension 4 */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-poppins font-semibold text-xs text-gray-800 flex items-center gap-1">
                          <Users size={12} className="text-teal-500" />
                          Family Compatibility
                        </span>
                        <span className="text-xs font-bold text-teal-600 font-poppins">{report.dimensions.family.score}%</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{report.dimensions.family.analysis}</p>
                    </div>
                  </div>

                  {/* Growth advice */}
                  <div className="pt-4 border-t border-gray-100 text-xs">
                    <span className="font-poppins font-bold text-amber-800 block mb-1">Advice for Long-Term Harmony:</span>
                    <p className="text-gray-500 font-sans leading-relaxed">{report.growthAreas}</p>
                  </div>
                </motion.div>
              ) : (
                /* Default empty panel state */
                <motion.div
                  key="empty-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-8 md:p-12 border border-white/50 text-center flex flex-col justify-center items-center h-full min-h-[350px]"
                >
                  <div className="p-4 bg-orange-50 text-orange-500 rounded-full w-fit mb-4">
                    <Sparkles size={32} className="animate-pulse" />
                  </div>
                  <h4 className="font-poppins font-bold text-lg text-gray-900">
                    Awaiting Profile Match Analysis
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 max-w-sm font-sans leading-relaxed">
                    Select two matrimonial profiles from the left panel and click &ldquo;Calculate AI Compatibility&rdquo; to launch our Gemini compatibility matrices.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
