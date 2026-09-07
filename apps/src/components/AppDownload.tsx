import { Smartphone, Download, ShieldCheck, Heart, Sparkles, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

export default function AppDownload() {
  return (
    <section
      id="app-download-section"
      className="py-16 bg-gradient-to-b from-amber-50/20 via-white to-orange-50/20 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-400/5 to-pink-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[36px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center overflow-hidden relative border border-gray-200/80 shadow-xl shadow-orange-950/5">
          
          {/* Subtle side glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl -z-10" />

          {/* Left Text details */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider font-poppins">
              <Smartphone size={12} />
              Official Mobile App
            </span>
            
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 leading-tight">
              Carry Your Soulmate Search <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-pink-600">
                In Your Pocket
              </span>
            </h2>

            <p className="text-sm text-gray-600 font-sans leading-relaxed max-w-xl">
              Get real-time compatibility notifications, instantly verify horoscopes, and safely chat with verified brides and grooms directly from your mobile device.
            </p>

            {/* Benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-gray-800 font-semibold bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
                <div className="p-1.5 rounded-xl bg-orange-100 text-orange-600">
                  <Heart size={14} className="fill-orange-600" />
                </div>
                <span>One-tap match proposals</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-800 font-semibold bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
                <div className="p-1.5 rounded-xl bg-orange-100 text-orange-600">
                  <ShieldCheck size={14} />
                </div>
                <span>Encrypted profile details</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-800 font-semibold bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
                <div className="p-1.5 rounded-xl bg-orange-100 text-orange-600">
                  <Sparkles size={14} />
                </div>
                <span>Instant Guna Milan updates</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-800 font-semibold bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
                <div className="p-1.5 rounded-xl bg-orange-100 text-orange-600">
                  <Smartphone size={14} />
                </div>
                <span>Push notifications &amp; audio bios</span>
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="btn-store-apple"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white transition-all cursor-pointer shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
                </svg>
                <div className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-sans">Download on the</span>
                  <span className="block text-xs font-poppins font-bold">App Store</span>
                </div>
              </button>

              <button
                id="btn-store-google"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white transition-all cursor-pointer shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3,5.27V18.73L16.55,12L3,5.27M17.87,11.33L19.5,12.15L17.87,12.97L4.57,19.78L16.55,12L4.57,4.22L17.87,11.33M21,12L19.5,12.75V11.25L21,12Z" />
                </svg>
                <div className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-sans">Get it on</span>
                  <span className="block text-xs font-poppins font-bold">Google Play</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Mobile / QR columns */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* QR Card */}
            <div className="p-5 bg-white rounded-3xl border border-gray-200 shadow-md text-center max-w-[200px]">
              <div className="p-3 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-center justify-center text-gray-800">
                <QrCode size={110} strokeWidth={1.5} className="text-orange-600 animate-[pulse_3s_infinite_ease-in-out]" />
              </div>
              <span className="block text-[11px] font-poppins font-bold text-gray-800 uppercase tracking-wider mt-3">
                Scan QR Code
              </span>
              <span className="block text-[9px] text-gray-500 font-medium">iOS &amp; Android Ready</span>
            </div>

            {/* Stylized Mobile Mockup */}
            <div className="relative w-44 h-80 rounded-[32px] border-4 border-gray-900 bg-gradient-to-br from-orange-50 to-amber-50 shadow-2xl flex flex-col overflow-hidden select-none">
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="w-4 h-1 bg-gray-700 rounded-full" />
              </div>

              <div className="p-3 pt-6 flex-1 flex flex-col justify-between text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-gray-500">09:41</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                    <div className="w-2.5 h-1.5 bg-gray-500 rounded-xs" />
                  </div>
                </div>

                <div className="bg-white/90 p-2.5 rounded-2xl border border-orange-100 shadow-xs space-y-1.5 mt-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold font-poppins mx-auto">
                    A
                  </div>
                  <div className="text-center">
                    <span className="block text-[9px] font-bold text-gray-800">Aanya, 26</span>
                    <span className="block text-[7px] text-gray-500">Software Engineer</span>
                  </div>
                  <div className="h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-11/12" />
                  </div>
                  <span className="block text-[7px] font-bold text-center text-emerald-700">92% AI Compatibility</span>
                </div>

                <div className="space-y-1 mt-auto">
                  <div className="py-1.5 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[8px] font-poppins font-bold rounded-lg shadow-xs cursor-pointer">
                    Express Interest
                  </div>
                  <div className="text-center text-[6px] font-bold text-gray-400">
                    Trusted by 5 Lakh+ Families
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

