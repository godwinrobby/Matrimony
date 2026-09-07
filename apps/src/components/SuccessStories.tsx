import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Heart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { successStories } from '../mockData';

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % successStories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const current = successStories[currentIndex];

  return (
    <section
      id="success-stories-section"
      className="py-20 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-12 w-80 h-80 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-12 w-80 h-80 rounded-full bg-pink-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-widest font-poppins mb-3">
            <Heart size={12} className="fill-orange-600 text-orange-600" />
            Sanctified Matrimonial Unions
          </span>
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 leading-tight">
            Success Stories Written in the Stars
          </h2>
          <p className="text-sm text-gray-600 font-sans mt-2">
            Real couples who met through Hindu Matrimony Trust &amp; Tradition and began their blessed journey together.
          </p>
        </div>

        {/* Carousel Frame */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[32px] border border-gray-200/80 shadow-xl shadow-orange-950/5 grid grid-cols-1 md:grid-cols-12 overflow-hidden"
            >
              {/* Couple photo */}
              <div className="md:col-span-5 relative min-h-[320px] md:min-h-[420px]">
                <img
                  src={current.image}
                  alt={current.coupleName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/20 to-transparent" />
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-800 flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Verified Match #{current.id}</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300">Sanctified Wedding Date</span>
                  <p className="font-poppins font-bold text-xl">{current.weddingDate}</p>
                </div>
              </div>

              {/* Story details */}
              <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between text-left space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote size={36} className="text-orange-500/20" />
                  </div>

                  <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-1">
                    {current.coupleName}
                  </h3>
                  <span className="text-xs font-bold text-orange-600 block mb-5">
                    📍 {current.location}
                  </span>

                  <p className="text-sm md:text-base text-gray-700 font-sans leading-relaxed italic bg-orange-50/50 p-5 rounded-2xl border border-orange-100/60">
                    &ldquo;{current.story}&rdquo;
                  </p>
                </div>

                {/* Footer badge */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    <ShieldCheck size={14} />
                    Parent-Approved Compatibility
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">HM-2026-{current.id}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center md:justify-end gap-3 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors shadow-xs cursor-pointer"
              title="Previous Story"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1.5 px-3">
              {successStories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === i ? 'w-8 bg-orange-500' : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors shadow-xs cursor-pointer"
              title="Next Story"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

