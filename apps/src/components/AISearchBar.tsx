import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, X, ArrowRight, Tag, HelpCircle, MapPin, Briefcase, RefreshCw } from 'lucide-react';
import { Profile } from '../types';

interface AISearchResult {
  summary: string;
  extractedCriteria: {
    locations: string[];
    professions: string[];
    diets: string[];
    lifestyles: string[];
  };
  matches: Array<{
    profileId: string;
    score: number;
    reason: string;
  }>;
}

interface AISearchBarProps {
  profiles: Profile[];
  onSearchComplete: (results: AISearchResult | null, queryText: string) => void;
}

const SUGGESTED_QUERIES = [
  "Vegetarian software engineer from Bengaluru who enjoys trekking",
  "Chennai bride with traditional values and post-graduate degree",
  "Modern groom from Bengaluru working in finance with balanced lifestyle",
  "Verified pure veg partner who values progressive family outlook"
];

export default function AISearchBar({ profiles, onSearchComplete }: AISearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<AISearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAISearch = async (searchQueryText: string) => {
    if (!searchQueryText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQueryText, profiles }),
      });
      if (!response.ok) {
        throw new Error('AI Matchmaker is currently contemplating. Please try again.');
      }
      const data: AISearchResult = await response.json();
      setActiveResult(data);
      onSearchComplete(data, searchQueryText);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to connect to AI Matchmaker. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setActiveResult(null);
    setError(null);
    onSearchComplete(null, '');
  };

  return (
    <div id="ai-search-container" className="w-full bg-linear-to-br from-white via-orange-50/30 to-amber-50/40 rounded-3xl p-6 md:p-10 border border-orange-200/50 shadow-md shadow-orange-100/10 mb-10 relative overflow-hidden">
      
      {/* Decorative premium radial flares */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-radial from-orange-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-radial from-amber-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Title & Description with Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-orange-100/40">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white shadow-xs">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-xl font-poppins font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                Vedic AI Matchmaker Search
                <span className="text-[10px] bg-orange-600/10 text-orange-600 px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                  Premium AI
                </span>
              </h3>
            </div>
            <p className="text-sm font-sans text-gray-600 max-w-2xl">
              Type naturally what you seek in a soul partner. Our predictive AI model evaluates lifestyle alignment, career coordinates, and values in real-time.
            </p>
          </div>
          
          {/* Active indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/50 border border-orange-100 text-xs font-medium text-orange-700">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            Veda-AI Engine Live
          </div>
        </div>

        {/* Form Input Group - Highly visual and expanded to full width */}
        <form
          id="ai-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAISearch(query);
          }}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
            <div className="relative flex-1 group">
              <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="ai-search-input-field"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your ideal companion (e.g., 'A software developer in Pune who values modern yet balanced lifestyle and vegetarian diet')..."
                className="w-full pl-13 pr-12 py-4.5 bg-white border border-gray-200 focus:border-orange-500 rounded-2xl text-sm font-sans placeholder-gray-400 text-gray-900 focus:outline-hidden focus:ring-4 focus:ring-orange-100/80 transition-all duration-200 shadow-xs"
                disabled={isLoading}
              />
              {query && (
                <button
                  id="btn-clear-ai-input"
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-all duration-150"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              id="btn-ai-search-submit"
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-8 py-4.5 bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-2xl text-sm font-poppins font-bold tracking-wide active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-orange-600/15"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Analyzing Profiles...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange-200 fill-orange-200/20" />
                  Query AI
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-100 text-left">
            {error}
          </div>
        )}

        {/* Query Suggestions with premium tag design */}
        {!activeResult && !isLoading && (
          <div className="text-left space-y-2.5">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] font-poppins font-bold text-gray-500 uppercase tracking-widest">
                Suggested Search Intents:
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED_QUERIES.map((sq, idx) => (
                <button
                  id={`btn-suggested-query-${idx}`}
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(sq);
                    handleAISearch(sq);
                  }}
                  className="p-3.5 bg-white/60 hover:bg-white text-xs font-sans text-gray-700 hover:text-orange-700 rounded-xl border border-gray-100 hover:border-orange-200/60 hover:shadow-sm transition-all duration-150 cursor-pointer text-left flex items-start gap-2.5 group"
                >
                  <Tag className="w-4 h-4 text-orange-400 mt-0.5 shrink-0 group-hover:text-orange-500 transition-colors" />
                  <span className="leading-relaxed font-medium">{sq}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active search filter insight cards */}
        <AnimatePresence>
          {activeResult && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 pt-5 border-t border-orange-200/40 text-left"
            >
              <div className="p-4 bg-white/80 rounded-2xl border border-orange-100/50 backdrop-blur-xs shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-poppins font-bold text-gray-900 uppercase tracking-wider">
                      AI MATCHMAKER REPORT
                    </span>
                  </div>
                  <button
                    id="btn-ai-reset-reports"
                    onClick={handleClear}
                    className="text-xs font-poppins font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    Reset Filter
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm font-sans text-gray-700 leading-relaxed italic">
                  "{activeResult.summary}"
                </p>

                {/* Extracted Criteria Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeResult.extractedCriteria.locations.map((loc, i) => (
                    <span key={`loc-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-sans font-medium border border-blue-100">
                      <MapPin className="w-3 h-3" />
                      {loc}
                    </span>
                  ))}
                  {activeResult.extractedCriteria.professions.map((prof, i) => (
                    <span key={`prof-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-sans font-medium border border-purple-100">
                      <Briefcase className="w-3 h-3" />
                      {prof}
                    </span>
                  ))}
                  {activeResult.extractedCriteria.diets.map((diet, i) => (
                    <span key={`diet-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-sans font-medium border border-emerald-100">
                      🥗 {diet}
                    </span>
                  ))}
                  {activeResult.extractedCriteria.lifestyles.map((style, i) => (
                    <span key={`style-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-sans font-medium border border-amber-100">
                      ✨ {style}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
