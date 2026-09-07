import { useState, FormEvent } from 'react';
import { X, ShieldCheck, Mail, Lock, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'register';
  onLoginSuccess: (user: Profile) => void;
}

export default function AuthModal({ isOpen, onClose, type, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [caste, setCaste] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    const mockUser: Profile = {
      id: 'user_current',
      name: name.trim() || 'Karthik Krishnan',
      gender: 'Groom',
      age: 28,
      height: "5'11\"",
      religion: 'Hindu',
      caste: caste.trim() || 'Iyer',
      subCaste: 'Vadama',
      motherTongue: 'Tamil',
      profession: 'Senior Product Designer',
      education: 'B.Des - IIT Madras',
      location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
      salary: '₹32 LPA',
      diet: 'Veg',
      manglik: 'Non-Manglik',
      horoscopeNeeded: true,
      starSign: 'Virgo',
      familyValues: 'Moderate',
      lifestyle: 'Modern',
      bio: 'A creative and thoughtful designer who values Vedic culture and is seeking an understanding, family-oriented partner.',
      image: 'https://images.unsplash.com/photo-1605135738135-7f982ca32f97?auto=format&fit=crop&q=80&w=400&h=400',
      verified: true,
      contactNumber: '+91 98765 12345',
      birthDate: '1998-09-14',
      birthTime: '08:45',
      birthPlace: 'Chennai, Tamil Nadu',
      rashi: 'Kanya (Virgo)',
      nakshatra: 'Uttara Phalguni',
      gotra: 'Vashishta'
    };

    setTimeout(() => {
      setSubmitted(false);
      onLoginSuccess(mockUser);
      onClose();
    }, 1800);
  };

  const handleDemoLogin = (gender: 'Groom' | 'Bride') => {
    setSubmitted(true);
    const mockUser: Profile = gender === 'Groom' ? {
      id: 'user_current',
      name: 'Karthik Krishnan',
      gender: 'Groom',
      age: 28,
      height: "5'11\"",
      religion: 'Hindu',
      caste: 'Iyengar',
      subCaste: 'Vadakalai',
      motherTongue: 'Tamil',
      profession: 'Management Consultant',
      education: 'MBA - IIM Bangalore',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      salary: '₹35 LPA',
      diet: 'Veg',
      manglik: 'Non-Manglik',
      horoscopeNeeded: true,
      starSign: 'Leo',
      familyValues: 'Traditional',
      lifestyle: 'Balanced',
      bio: 'Traditional yet modern management consultant based in Bengaluru. Grounded in Vedic principles, I enjoy playing the mridangam, running weekend marathons, and reading ancient history.',
      image: 'https://images.unsplash.com/photo-1605135738135-7f982ca32f97?auto=format&fit=crop&q=80&w=400&h=400',
      verified: true,
      contactNumber: '+91 91234 56789',
      birthDate: '1998-08-15',
      birthTime: '11:15 AM',
      birthPlace: 'Bangalore, Karnataka',
      rashi: 'Simha (Leo)',
      nakshatra: 'Poorvaphalguni',
      gotra: 'Srivatsa'
    } : {
      id: 'user_current',
      name: 'Ananya Iyer',
      gender: 'Bride',
      age: 26,
      height: "5'6\"",
      religion: 'Hindu',
      caste: 'Iyer',
      subCaste: 'Vadama',
      motherTongue: 'Tamil',
      profession: 'Lead AI Researcher',
      education: 'M.S. - IISc Bangalore',
      location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
      salary: '₹28 LPA',
      diet: 'Veg',
      manglik: 'Non-Manglik',
      horoscopeNeeded: true,
      starSign: 'Rohini',
      familyValues: 'Traditional',
      lifestyle: 'Modern',
      bio: 'Deeply passionate about technology and Indian classical music. Looking for a partner who matches intellectual curiosity and respects traditional values.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400&h=400',
      verified: true,
      contactNumber: '+91 91234 56789',
      birthDate: '2000-05-22',
      birthTime: '14:20',
      birthPlace: 'Chennai, Tamil Nadu',
      rashi: 'Taurus (Vrishabha)',
      nakshatra: 'Rohini',
      gotra: 'Bharadwaj'
    };

    setTimeout(() => {
      setSubmitted(false);
      onLoginSuccess(mockUser);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            id="auth-modal-content"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-sm w-full p-6 md:p-8 relative border border-white/50 text-left overflow-hidden bg-white/95"
          >
            {/* Top orange glowing strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-500 via-amber-500 to-pink-500" />

            <button
              id="btn-close-auth"
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 absolute top-4 right-4 cursor-pointer"
            >
              <X size={18} />
            </button>

            {submitted ? (
              /* Success Animation */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner animate-[bounce_1s_infinite]">
                  <ShieldCheck size={36} />
                </div>
                <h3 className="font-poppins font-bold text-lg text-gray-900">
                  {type === 'register' ? 'Registration Complete!' : 'Welcome Back!'}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans max-w-[240px] mx-auto">
                  Your profile has been authenticated securely under Vedic matrimonial guidelines.
                </p>
              </motion.div>
            ) : (
              /* Real Interactive Form */
              <div className="space-y-5 pt-2">
                <div>
                  <h3 className="font-poppins font-bold text-xl text-gray-900 leading-tight">
                    {type === 'register' ? 'Create Free Profile' : 'Access Your Matches'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {type === 'register' ? 'Join 5 Lakh+ verified Hindu households today' : 'Enter registered details securely'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {type === 'register' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Full Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Swati Shastri"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-orange-500 font-sans"
                          />
                          <User className="absolute left-3 top-3.5 text-gray-400" size={13} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Community / Caste</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Iyer, Nair, Reddy, Gowda"
                          value={caste}
                          onChange={(e) => setCaste(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-orange-500 font-sans"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-orange-500 font-sans"
                      />
                      <Mail className="absolute left-3 top-3.5 text-gray-400" size={13} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-orange-500 font-sans"
                      />
                      <Lock className="absolute left-3 top-3.5 text-gray-400" size={13} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-auth-submit"
                    className="w-full py-3 font-poppins font-bold text-xs text-white bg-linear-to-r from-orange-500 to-amber-500 rounded-xl hover:shadow-lg transition-all transform active:scale-98 cursor-pointer mt-2"
                  >
                    {type === 'register' ? 'Register Free Profile' : 'Access Profiles'}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-150"></div>
                  <span className="flex-shrink mx-3 text-gray-400 text-[10px] uppercase font-extrabold tracking-widest font-sans">Or Quick Demo Login</span>
                  <div className="flex-grow border-t border-gray-150"></div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-1">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Groom')}
                    className="py-2.5 px-3 bg-linear-to-b from-white to-gray-50/50 hover:from-orange-50/40 hover:to-orange-50/20 border border-gray-200 hover:border-orange-300 rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold text-gray-700 cursor-pointer shadow-xs"
                  >
                    <span className="text-sm">🤵</span> Groom Karthik
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Bride')}
                    className="py-2.5 px-3 bg-linear-to-b from-white to-gray-50/50 hover:from-pink-50/40 hover:to-pink-50/20 border border-gray-200 hover:border-pink-300 rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold text-gray-700 cursor-pointer shadow-xs"
                  >
                    <span className="text-sm">👰</span> Bride Ananya
                  </button>
                </div>

                <div className="text-center text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                  By continuing, you agree to our <span className="hover:text-orange-500 cursor-pointer">Vedic Community Ethos</span>.
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
