import { useState } from 'react';
import { Star, RefreshCw, Compass, Shield, Award, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockProfiles } from '../mockData';

export default function HoroscopeMatcher() {
  const [partner1Name, setPartner1Name] = useState('Arjun Deshmukh');
  const [partner1Star, setPartner1Star] = useState('Taurus');
  const [partner1BirthDate, setPartner1BirthDate] = useState('1995-05-12');
  const [partner1BirthTime, setPartner1BirthTime] = useState('08:30 AM');
  
  const [partner2Name, setPartner2Name] = useState('Kavya Singh');
  const [partner2Star, setPartner2Star] = useState('Sagittarius');
  const [partner2BirthDate, setPartner2BirthDate] = useState('1998-11-20');
  const [partner2BirthTime, setPartner2BirthTime] = useState('14:45 PM');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const starSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  const handleMatch = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    const payload = {
      partner1: {
        name: partner1Name,
        starSign: partner1Star,
        birthDate: partner1BirthDate,
        birthTime: partner1BirthTime,
        manglik: 'Non-Manglik'
      },
      partner2: {
        name: partner2Name,
        starSign: partner2Star,
        birthDate: partner2BirthDate,
        birthTime: partner2BirthTime,
        manglik: 'Manglik'
      }
    };

    try {
      const res = await fetch('/api/horoscope-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Horoscope service failed to compute. Try again.');
      }

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Server timeout. Using local Vedic tables...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="horoscope-matcher-section"
      className="pt-2 pb-24 bg-transparent relative mandala-pattern"
    >
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold tracking-wider uppercase font-poppins mb-3">
            <Star size={13} className="text-amber-500 animate-spin-slow" />
            Sacred Ashta Koota Milan
          </div>
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 leading-tight">
            Vedic Kundli &amp; Guna Matcher
          </h2>
          <p className="text-sm text-gray-600 mt-3 font-sans">
            Guna Milan is an ancient mathematical science analyzing compatibility across 36 parameters (Gunas). Enter birth details below for an authentic Vedic compatibility chart.
          </p>
          <div className="w-16 h-1 bg-linear-to-r from-amber-500 to-yellow-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Section Left (4 Cols) */}
          <div className="lg:col-span-5 glass-card p-6 md:p-8 border border-white/50 space-y-6 text-left">
            <h3 className="font-poppins font-bold text-gray-900 text-md flex items-center gap-2 mb-2 pb-4 border-b border-gray-50">
              <Compass className="text-amber-500" size={18} />
              Partner Birth Details
            </h3>

            {/* Groom/Partner 1 Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-poppins font-bold text-orange-600 uppercase tracking-widest">
                Groom Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={partner1Name}
                    onChange={(e) => setPartner1Name(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Rashi/Star Sign</label>
                  <select
                    value={partner1Star}
                    onChange={(e) => setPartner1Star(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                  >
                    {starSigns.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={partner1BirthDate}
                    onChange={(e) => setPartner1BirthDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100/50 my-4" />

            {/* Bride/Partner 2 Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-poppins font-bold text-amber-600 uppercase tracking-widest">
                Bride Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={partner2Name}
                    onChange={(e) => setPartner2Name(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Rashi/Star Sign</label>
                  <select
                    value={partner2Star}
                    onChange={(e) => setPartner2Star(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                  >
                    {starSigns.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={partner2BirthDate}
                    onChange={(e) => setPartner2BirthDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              id="btn-trigger-horoscope"
              onClick={handleMatch}
              disabled={loading}
              className="w-full py-4 mt-6 font-poppins font-bold text-white bg-linear-to-r from-amber-500 to-yellow-600 rounded-2xl hover:shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Analyzing Moon Charts...
                </>
              ) : (
                <>
                  <Star size={16} className="fill-white" />
                  Perform Kundli Matching
                </>
              )}
            </button>
          </div>

          {/* Results Section Right (8 Cols) */}
          <div className="lg:col-span-7 w-full h-full">
            <AnimatePresence mode="wait">
              {loading ? (
                /* Elegant Astrology Loading */
                <motion.div
                  key="astro-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 border border-white/50 text-center flex flex-col justify-center items-center h-full min-h-[400px]"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-100 border-t-yellow-500 animate-spin" />
                    <Star size={36} className="absolute inset-0 m-auto text-yellow-500 animate-pulse" />
                  </div>
                  <h4 className="font-poppins font-bold text-gray-900 text-lg">Aligning Celestial Spheres</h4>
                  <p className="text-xs text-gray-500 mt-2 max-w-sm">
                    Computing Ashta Kootas (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi) using authentic algorithms...
                  </p>
                </motion.div>
              ) : report ? (
                /* Celestial Report Output */
                <motion.div
                  key="astro-report"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-6 md:p-8 border border-white/50 text-left space-y-6"
                >
                  {/* Circle Score Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-poppins">Guna Milan Result</span>
                      <h4 className="text-2xl font-poppins font-bold text-gray-900 mt-1">
                        {report.gunaScore} / 36 Gunas Matched
                      </h4>
                      <p className="text-xs text-amber-700 font-semibold font-sans mt-1 bg-yellow-50 w-fit px-3 py-1 rounded-full border border-yellow-100">
                        {report.matchingStatus}
                      </p>
                    </div>

                    {/* Gold Star Seal */}
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-yellow-600 shadow-md flex items-center justify-center text-white relative">
                      <Award size={32} />
                      <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" />
                    </div>
                  </div>

                  {/* Spiritual insight */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                    <p className="text-xs text-amber-900 font-sans leading-relaxed">
                      <strong>Astrological Insight:</strong> {report.spiritualInsight}
                    </p>
                  </div>

                  {/* Ashta Koota Milan Breakdown Table */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-poppins font-bold text-gray-900 uppercase tracking-widest">
                      Ashta Koota Breakdown
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Varna */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">1. Varna (Intellect)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.varna.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.varna.score} / {report.varna.max}</span>
                      </div>

                      {/* Vashya */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">2. Vashya (Control)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.vashya.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.vashya.score} / {report.vashya.max}</span>
                      </div>

                      {/* Tara */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">3. Tara (Longevity)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.tara.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.tara.score} / {report.tara.max}</span>
                      </div>

                      {/* Yoni */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">4. Yoni (Intimacy)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.yoni.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.yoni.score} / {report.yoni.max}</span>
                      </div>

                      {/* Graha Maitri */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">5. Graha Maitri (Friendship)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.grahaMaitri.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.grahaMaitri.score} / {report.grahaMaitri.max}</span>
                      </div>

                      {/* Gana */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">6. Gana (Temperament)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.gana.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.gana.score} / {report.gana.max}</span>
                      </div>

                      {/* Bhakoot */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">7. Bhakoot (Prosperity)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.bhakoot.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.bhakoot.score} / {report.bhakoot.max}</span>
                      </div>

                      {/* Nadi */}
                      <div className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 flex justify-between items-start">
                        <div>
                          <span className="font-poppins font-bold text-gray-800">8. Nadi (Physiology)</span>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{report.nadi.description}</p>
                        </div>
                        <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap ml-2">{report.nadi.score} / {report.nadi.max}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Default empty astrologer panel */
                <motion.div
                  key="empty-astro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 border border-white/50 text-center flex flex-col justify-center items-center h-full min-h-[400px]"
                >
                  <div className="p-4 bg-yellow-50 text-amber-500 rounded-full w-fit mb-4">
                    <Star size={32} className="animate-pulse" />
                  </div>
                  <h4 className="font-poppins font-bold text-lg text-gray-900">Awaiting Horoscope Coordination</h4>
                  <p className="text-xs text-gray-500 mt-2 max-w-sm">
                    Input custom birth fields and planetary signs for Groom and Bride, then click &ldquo;Perform Kundli Matching&rdquo; to consult the cosmic matching Gunas.
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
