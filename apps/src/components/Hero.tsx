import { useState } from 'react';
import { Search, Heart, ShieldCheck, Sparkles, MapPin, Users, Flame, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SearchFilters } from '../types';
import { mockProfiles } from '../mockData';

interface HeroProps {
  onSearch: (filters: SearchFilters) => void;
  onNavigate: (view: string) => void;
}

export default function Hero({ onSearch, onNavigate }: HeroProps) {
  const [gender, setGender] = useState<'Bride' | 'Groom'>('Bride');
  const [ageMin, setAgeMin] = useState<number>(21);
  const [ageMax, setAgeMax] = useState<number>(35);
  const [caste, setCaste] = useState<string>('');
  const [subCaste, setSubCaste] = useState<string>('');
  const [motherTongue, setMotherTongue] = useState<string>('');
  const [city, setCity] = useState<string>('');

  // Dynamically extract unique options from common database (mockProfiles)
  const availableCastes = Array.from(
    new Set(mockProfiles.map((p) => p.caste).filter(Boolean))
  ).sort();

  const availableSubCastes = Array.from(
    new Set(
      mockProfiles
        .flatMap((p) => {
          if (!p.subCaste) return [];
          return p.subCaste.split(',').map((s) => s.trim());
        })
        .filter(Boolean)
    )
  ).sort();

  const availableMotherTongues = Array.from(
    new Set(mockProfiles.map((p) => p.motherTongue).filter(Boolean))
  ).sort();

  const availableCities = Array.from(
    new Set(mockProfiles.map((p) => p.location.city).filter(Boolean))
  ).sort();

  const handleSearchClick = () => {
    const filters: SearchFilters = {
      gender,
      ageMin,
      ageMax,
      caste,
      subCaste,
      motherTongue,
      city,
    };
    onSearch(filters);
    onNavigate('search');

    // Scroll to search element
    setTimeout(() => {
      const searchSection = document.getElementById('search-profiles-section');
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div
      id="hero-section"
      className="relative min-h-[90vh] pt-28 pb-16 flex items-center justify-center bg-gradient-to-b from-orange-50/40 via-white to-amber-50/20 overflow-hidden mandala-pattern"
    >
      {/* Background radial glows */}
      <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-400/5 blur-3xl pointer-events-none" />

      {/* Rotating Sacred Mandala Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none w-[600px] h-[600px] md:w-[850px] md:h-[850px] text-orange-600 animate-[spin_120s_linear_infinite]">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 50 50)`}>
              <path d="M50,15 C47,25 45,35 50,48 C55,35 53,25 50,15" />
              <path d="M50,5 C42,20 38,35 50,49 C62,35 58,20 50,5" strokeWidth="0.3" stroke="currentColor" fill="none" />
              <circle cx="50" cy="15" r="1.5" />
            </g>
          ))}
          <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left text column */}
        <div className="lg:col-span-7 text-left space-y-6">
          
          {/* Live Activity & Badge */}
          <motion.div
            id="hero-badge"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-orange-200/80 shadow-xs text-orange-800 text-xs font-semibold uppercase tracking-wider font-poppins"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <Sparkles size={14} className="text-orange-500" />
            <span>Vedic Matchmaking Reimagined</span>
          </motion.div>

          <motion.h1
            id="hero-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold tracking-tight text-gray-900 leading-[1.12]"
          >
            Find Your Perfect Life Partner with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-pink-600">
              Trust &amp; Tradition
            </span>
          </motion.h1>

          <motion.p
            id="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 font-sans max-w-xl leading-relaxed"
          >
            Empowering modern Hindu families with 100% verified premium profiles, horoscope compatibility matching, and AI-powered partner discovery governed by traditional values.
          </motion.p>

          {/* Quick Stats Grid */}
          <motion.div
            id="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 py-5 border-y border-gray-200/70 max-w-lg"
          >
            <div className="bg-white/60 p-3 rounded-2xl border border-white/80 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-poppins font-extrabold text-gray-900">100%</span>
              <span className="text-[11px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">Verified Profiles</span>
            </div>
            <div className="bg-white/60 p-3 rounded-2xl border border-white/80 shadow-xs">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-poppins font-extrabold text-gray-900">4.9</span>
                <Star size={16} className="fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[11px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">Rating Score</span>
            </div>
            <div className="bg-white/60 p-3 rounded-2xl border border-white/80 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-poppins font-extrabold text-orange-600">50k+</span>
              <span className="text-[11px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">Weddings Fixed</span>
            </div>
          </motion.div>

          {/* CTA Row */}
          <motion.div
            id="hero-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-1"
          >
            <button
              id="hero-btn-create"
              onClick={() => onNavigate('search')}
              className="px-8 py-4 font-poppins font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Matches Now</span>
              <ArrowRight size={16} />
            </button>
            <button
              id="hero-btn-explore"
              onClick={() => {
                const element = document.getElementById('features-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-4 font-poppins font-semibold text-sm text-gray-700 bg-white border border-gray-200/90 rounded-2xl hover:bg-gray-50 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              Why Choose Us?
            </button>
          </motion.div>

          {/* Visual Trust Badges */}
          <motion.div
            id="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-500 font-medium"
          >
            <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-emerald-800">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Governed by Vedic Ethics</span>
            </span>
            <span className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 text-rose-800">
              <Heart size={16} className="text-rose-500 fill-rose-100" />
              <span>Strict Privacy Safeguards</span>
            </span>
          </motion.div>
        </div>

        {/* Right Glass Quick Search Column */}
        <motion.div
          id="hero-search-card-container"
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="lg:col-span-5 w-full"
        >
          <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-orange-100/80 shadow-2xl shadow-orange-950/5 relative overflow-hidden">
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500" />

            <div className="mb-6 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins font-bold text-gray-900 flex items-center gap-2">
                  <Search size={18} className="text-orange-500" />
                  Quick Partner Search
                </h2>
                <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Live DB
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Refine your preferences to discover verified profiles</p>
            </div>

            <div className="space-y-4 text-left">
              {/* Gender selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2 font-poppins">
                  I am looking for a:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGender('Bride')}
                    className={`py-3 px-4 rounded-2xl font-poppins font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'Bride'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-gray-50 text-gray-700 border border-gray-200/60 hover:bg-white'
                    }`}
                  >
                    <Users size={14} />
                    <span>Bride (Woman)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Groom')}
                    className={`py-3 px-4 rounded-2xl font-poppins font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'Groom'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-gray-50 text-gray-700 border border-gray-200/60 hover:bg-white'
                    }`}
                  >
                    <Users size={14} />
                    <span>Groom (Man)</span>
                  </button>
                </div>
              </div>

              {/* Age selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider font-poppins">
                    Age Range
                  </span>
                  <span className="text-xs font-poppins font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                    {ageMin} to {ageMax} yrs
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <select
                    value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    className="w-full p-3 text-xs font-semibold rounded-2xl border border-gray-200/80 bg-gray-50/70 text-gray-800 font-sans outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 18 }, (_, i) => i + 18).map((a) => (
                      <option key={a} value={a}>
                        Min Age: {a} yrs
                      </option>
                    ))}
                  </select>
                  <select
                    value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    className="w-full p-3 text-xs font-semibold rounded-2xl border border-gray-200/80 bg-gray-50/70 text-gray-800 font-sans outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 33 }, (_, i) => i + 18).map((a) => (
                      <option key={a} value={a}>
                        Max Age: {a} yrs
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caste / Community dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-poppins">
                  Community / Caste
                </label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full p-3 text-xs font-semibold rounded-2xl border border-gray-200/80 bg-gray-50/70 text-gray-800 font-sans outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="">Any Caste / Community</option>
                  {availableCastes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Caste dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-poppins">
                  Sub-Caste
                </label>
                <select
                  value={subCaste}
                  onChange={(e) => setSubCaste(e.target.value)}
                  className="w-full p-3 text-xs font-semibold rounded-2xl border border-gray-200/80 bg-gray-50/70 text-gray-800 font-sans outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="">Any Sub-Caste</option>
                  {availableSubCastes.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mother tongue & Location Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-poppins">
                    Mother Tongue
                  </label>
                  <select
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                    className="w-full p-3 text-xs font-semibold rounded-2xl border border-gray-200/80 bg-gray-50/70 text-gray-800 font-sans outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">Any Language</option>
                    {availableMotherTongues.map((mt) => (
                      <option key={mt} value={mt}>
                        {mt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 font-poppins">
                    Location
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 text-xs font-semibold rounded-2xl border border-gray-200/80 bg-gray-50/70 text-gray-800 font-sans outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">Any Location</option>
                    {availableCities.map((ci) => (
                      <option key={ci} value={ci}>
                        {ci}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit search button */}
              <button
                id="hero-search-submit"
                onClick={handleSearchClick}
                className="w-full py-4 mt-2 font-poppins font-extrabold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 rounded-2xl hover:shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Search size={18} />
                <span>Search Verified Partners</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

