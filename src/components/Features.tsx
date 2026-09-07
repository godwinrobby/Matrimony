import { ShieldCheck, Lock, Sparkles, Star, Users, EyeOff, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Features() {
  const features = [
    {
      id: 'f1',
      icon: <ShieldCheck className="w-6 h-6 text-orange-600" />,
      bg: 'bg-orange-50/80 border-orange-100',
      title: '100% Verified Profiles',
      description: 'Every bride & groom profile undergoes multi-factor physical, government ID, and work email authentication.'
    },
    {
      id: 'f2',
      icon: <Lock className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50/80 border-amber-100',
      title: 'High-Fidelity Privacy',
      description: 'Your contact numbers, income metrics, and photos can be masked or revealed strictly upon explicit consent.'
    },
    {
      id: 'f3',
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
      bg: 'bg-pink-50/80 border-pink-100',
      title: 'AI Match Intelligence',
      description: 'Server-side Gemini AI evaluates astrological transits, psychological preferences, and family value alignments.'
    },
    {
      id: 'f4',
      icon: <Star className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50/80 border-amber-100',
      title: 'Kundli & Guna Milan',
      description: 'Instant 36-Guna astronomical score calculation with expert Vedic Pundit Shastri relationship advice.'
    },
    {
      id: 'f5',
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50/80 border-emerald-100',
      title: 'Family-Initiated Connect',
      description: 'Connect directly with parent-managed accounts for serious, traditional, family-oriented matrimonial unions.'
    },
    {
      id: 'f6',
      icon: <EyeOff className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50/80 border-indigo-100',
      title: 'Granular Privacy Controls',
      description: 'Easily block specific contacts, prevent external indexing, and chat securely inside protected workspace drawers.'
    }
  ];

  return (
    <section
      id="features-section"
      className="py-24 bg-gradient-to-b from-amber-50/20 via-white to-orange-50/30 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-orange-400/5 to-amber-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-widest font-poppins mb-3">
            Key Pillars of Trust
          </span>
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 leading-tight">
            Designed for Trust, Tradition, &amp; Total Peace of Mind
          </h2>
          <p className="text-sm text-gray-600 font-sans mt-3">
            Combining traditional Vedic principles with modern privacy security to ensure safe matrimonial discoveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={feat.id}
              id={`feature-card-${feat.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white/90 backdrop-blur-md p-7 rounded-[28px] border border-gray-200/80 hover:border-orange-200 shadow-xs hover:shadow-xl hover:shadow-orange-950/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className={`p-3.5 rounded-2xl ${feat.bg} border w-fit mb-5 group-hover:scale-105 transition-transform duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-poppins font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors flex items-center justify-between">
                  <span>{feat.title}</span>
                  <ArrowUpRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

