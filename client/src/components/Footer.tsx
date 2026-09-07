import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Sparkles, Send, Check } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleLinkClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="main-footer"
      className="bg-white/40 backdrop-blur-md pt-16 pb-24 lg:pb-12 border-t border-white/20 relative overflow-hidden text-left"
    >
      {/* Background radial gradient */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Brand Column (4 Cols) */}
        <div className="lg:col-span-4 text-left space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-poppins font-bold shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 2C12 2 9 8 9 11C9 14.3137 10.3431 16 12 16C13.6569 16 15 14.3137 15 11C15 8 12 2 12 2Z" />
              </svg>
            </div>
            <span className="font-poppins font-bold text-sm text-gray-900 tracking-tight">
              Hindu Matrimony <span className="text-orange-600 font-semibold text-xs">Trust &amp; Tradition</span>
            </span>
          </div>
          <p className="text-xs text-gray-600 font-sans leading-relaxed">
            The world&rsquo;s most trusted, high-fidelity matrimonial application for Hindu families seeking lifetime companionship rooted in Vedic principles, astrology, and verified family values.
          </p>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 uppercase tracking-widest font-poppins pt-1">
            <Sparkles size={11} className="animate-pulse" />
            100% Family Verified &amp; Protected
          </span>
        </div>

        {/* Quick Links Column (2 Cols) */}
        <div className="lg:col-span-2 text-left space-y-3.5">
          <h4 className="font-poppins font-bold text-xs text-gray-900 uppercase tracking-wider">
            Discovery Pages
          </h4>
          <ul className="space-y-2 text-xs font-sans font-medium">
            <li><button onClick={() => handleLinkClick('home')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Home</button></li>
            <li><button onClick={() => handleLinkClick('search')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Find Matches</button></li>
            <li><button onClick={() => handleLinkClick('matchmaker')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">AI Matchmaker</button></li>
            <li><button onClick={() => handleLinkClick('kundli')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Kundli Milan</button></li>
            <li><button onClick={() => handleLinkClick('daily-horoscope')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Daily Horoscope</button></li>
            <li><button onClick={() => handleLinkClick('membership')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Membership Plans</button></li>
          </ul>
        </div>

        {/* Company Column (2 Cols) */}
        <div className="lg:col-span-2 text-left space-y-3.5">
          <h4 className="font-poppins font-bold text-xs text-gray-900 uppercase tracking-wider">
            Trust &amp; Stories
          </h4>
          <ul className="space-y-2 text-xs font-sans font-medium">
            <li><button onClick={() => handleLinkClick('success-stories')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Success Stories</button></li>
            <li><button onClick={() => handleLinkClick('blogs')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Vedic Matrimony Blog</button></li>
            <li><button onClick={() => handleLinkClick('features')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Features &amp; Security</button></li>
            <li><button onClick={() => handleLinkClick('app-download')} className="text-gray-600 hover:text-orange-600 transition-colors cursor-pointer text-left">Get Mobile App</button></li>
          </ul>
        </div>

        {/* Contact & Newsletter (4 Cols) */}
        <div className="lg:col-span-4 text-left space-y-3.5">
          <h4 className="font-poppins font-bold text-xs text-gray-900 uppercase tracking-wider">
            Stay Enlightened
          </h4>
          
          <div className="space-y-2 text-xs text-gray-600 font-sans font-medium">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-orange-600" />
              <span>+91 1800 200 4500 (Toll Free Helpline)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-orange-600" />
              <span>support@hindumatrimony.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-orange-600" />
              <span>Adyar, Chennai, TN, 600020</span>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="pt-1">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Enter parent or candidate email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-gray-300 outline-hidden focus:border-orange-500 font-sans"
              />
              <button
                type="submit"
                id="btn-subscribe-newsletter"
                className="absolute right-1 top-1 p-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all cursor-pointer"
              >
                {subscribed ? <Check size={12} strokeWidth={3} /> : <Send size={12} />}
              </button>
            </div>
            {subscribed && (
              <span className="block text-[10px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                ✓ Thank you! Horoscope updates will be sent to your inbox.
              </span>
            )}
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-sans">
        <span>© 2026 Hindu Matrimony Website. All rights reserved globally.</span>
        <div className="flex gap-4 font-medium">
          <span className="hover:text-orange-600 cursor-pointer">Sitemap</span>
          <span className="hover:text-orange-600 cursor-pointer">Vedic Guidelines</span>
          <span className="hover:text-orange-600 cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}

