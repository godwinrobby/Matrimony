import { useState } from 'react';
import { Check, Star, Shield, Sparkles, Crown, CheckCircle, Lock, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import CashfreePaymentModal from './CashfreePaymentModal';
import { Profile } from '../types';

interface MembershipProps {
  currentUser: Profile | null;
  onUpdateUser: (user: Profile) => void;
  onAddNotification: (message: string, type: 'success' | 'info' | 'heart') => void;
  onOpenAuth: (type: 'login' | 'register') => void;
}

export default function Membership({
  currentUser,
  onUpdateUser,
  onAddNotification,
  onOpenAuth
}: MembershipProps) {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const plans = [
    {
      id: 'm1',
      name: 'Vedic Free',
      price: '₹0',
      period: 'Forever',
      description: 'Perfect for exploring and creating your primary profile.',
      features: [
        'Create professional portfolio',
        'Upload up to 3 secure photos',
        'Browse all verified matches',
        'Send standard Express Interests',
        'Basic search filters'
      ],
      buttonText: 'Get Started Free',
      highlighted: false,
      color: 'border-gray-200 bg-white/60'
    },
    {
      id: 'm2',
      name: 'Elite Gold',
      price: '₹4,999',
      period: '3 Months',
      description: 'Our most popular tier. Unlock unlimited direct communications.',
      features: [
        'Everything in Free tier',
        'Unlimited direct chat & phone',
        'Detailed Kundli Guna Milan reports',
        'Profile highlighted in search grids',
        'Pre-approved family connections',
        'View who visited your profile'
      ],
      buttonText: 'Upgrade to Elite',
      highlighted: true,
      color: 'border-yellow-400/80 bg-white/85 shadow-lg shadow-yellow-500/5 ring-1 ring-yellow-400/30'
    },
    {
      id: 'm3',
      name: 'Saptapadi Royal',
      price: '₹12,499',
      period: '6 Months',
      description: 'Dedicated professional matchmaker to handle family liaison.',
      features: [
        'Everything in Elite tier',
        'Personal Relationship Manager',
        'Manual handpicked recommendations',
        'Private background check reports',
        'Exclusive royal lounge profile tag',
        'Direct family-to-family coordinates'
      ],
      buttonText: 'Join Royal Club',
      highlighted: false,
      color: 'border-gray-200 bg-white/60'
    }
  ];

  const handlePlanSelect = (plan: any) => {
    if (plan.id === 'm1') {
      onAddNotification('You are already on the Vedic Free plan!', 'info');
      return;
    }

    if (!currentUser) {
      onAddNotification('Please sign in first to upgrade your membership.', 'info');
      onOpenAuth('login');
      return;
    }

    // Parse amount from string like "₹4,999" -> 4999
    const amountVal = parseInt(plan.price.replace(/[^\d]/g, ''), 10);
    setSelectedPlan({
      ...plan,
      numericPrice: amountVal
    });
    setIsPayModalOpen(true);
  };

  const handlePaymentSuccess = (txId: string) => {
    setIsPayModalOpen(false);
    
    // Update current user state with premium perks
    if (currentUser) {
      const updatedUser: Profile = {
        ...currentUser,
        premiumFeatures: {
          premiumMember: true,
          profileBoost: true,
          spotlightProfile: true,
          readReceipts: true,
          unlimitedChat: true,
          unlimitedContactView: true,
          videoCallEnabled: true
        }
      };
      onUpdateUser(updatedUser);
      onAddNotification(`Congratulations! You have successfully upgraded to ${selectedPlan?.name} via Cashfree (TX: ${txId.slice(0, 10)}). All premium features unlocked!`, 'success');
    }
  };

  return (
    <section
      id="membership-section"
      className="pt-2 pb-24 bg-transparent relative overflow-hidden mandala-pattern"
    >
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-orange-50/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xs font-bold text-orange-600 uppercase tracking-widest font-poppins">
            Premium Access
          </h2>
          <p className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mt-2">
            Accelerate Your Partner Search
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Choose a premium membership plan and receive advanced algorithmic compatibility matching and direct communications.
          </p>
          <div className="w-16 h-1 bg-linear-to-r from-orange-500 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Active Membership Status & Billing Details Block */}
        <div className="mb-10 max-w-4xl mx-auto text-left">
          {currentUser?.premiumFeatures?.premiumMember ? (
            <div className="bg-gradient-to-br from-[#FFFBF9] via-white to-amber-50/30 p-6 sm:p-8 rounded-[32px] border border-amber-200/50 shadow-md space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent blur-2xl pointer-events-none rounded-full" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase block">Active Lifetime Membership</span>
                  <h4 className="text-xl font-black text-[#F97316] font-poppins flex items-center gap-2">
                    <Crown size={20} className="text-amber-500 fill-amber-500/10" />
                    Saptapadi Royal Premium Lifetime Club
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold font-sans">
                    Billing Cycle: <strong className="text-gray-800">One-Time Payment</strong> • Renewal Date: <strong className="text-emerald-600">Never Expire (Active)</strong>
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                    <CheckCircle size={12} className="text-emerald-600" />
                    Cashfree Verified
                  </span>
                </div>
              </div>

              {/* Grid of enabled perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
                {[
                  'Unlimited Direct Chats',
                  'Instant Contact Reveals',
                  'Horoscope Gun Milan Reports',
                  '4x Profile Booster Transit',
                  'Priority Parent Liaison',
                  'Verified Background Logs'
                ].map((perk, i) => (
                  <div key={i} className="bg-white/80 p-3 rounded-xl border border-gray-100 flex items-center gap-2.5 shadow-xs">
                    <CheckCircle className="text-emerald-500 shrink-0" size={15} />
                    <span className="text-[11px] font-extrabold text-gray-700">{perk}</span>
                  </div>
                ))}
              </div>

              {/* Transaction Ledger */}
              <div className="pt-4 border-t border-orange-100/40 space-y-3">
                <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider font-poppins">Billing Transaction History</h5>
                <div className="bg-white/90 rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden font-sans shadow-2xs">
                  <div className="p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-gray-800 font-extrabold block">Royal Premium Life Plan</strong>
                      <span className="text-gray-400 text-[10px] font-semibold">TxID: CF_984128501235 • Cashfree Gateway</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-emerald-600 font-extrabold block">₹12,499.00</strong>
                      <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">SUCCESS</span>
                    </div>
                  </div>
                  <div className="p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-gray-800 font-extrabold block">Individual Contact Coordinate Reveal</strong>
                      <span className="text-gray-400 text-[10px] font-semibold">TxID: CF_718239012301 • Single Payment</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-emerald-600 font-extrabold block">₹299.00</strong>
                      <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">SUCCESS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-orange-100/60 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1.5 max-w-md">
                <span className="text-[9px] font-black tracking-widest text-indigo-600 uppercase block">Free Tier Status</span>
                <h4 className="text-base font-extrabold text-gray-900 font-poppins flex items-center gap-1.5">
                  <Lock size={15} className="text-amber-500" />
                  Standard Vedic Account (No active subscription)
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans font-medium">
                  You are currently on the free plan. Upgrade to an Elite Gold or Saptapadi Royal package below to unlock direct chat coordinates, Kundli matching analysis, and parental verifications.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100 text-xs font-bold whitespace-nowrap shrink-0">
                <Clock size={14} className="text-indigo-600 shrink-0" />
                <span>Standard Speed Seek</span>
              </div>
            </div>
          )}
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isUserActivePlan = currentUser?.premiumFeatures?.premiumMember && plan.id !== 'm1';
            return (
              <motion.div
                key={plan.id}
                id={`membership-card-${plan.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-8 flex flex-col justify-between border relative ${plan.color} ${
                  plan.highlighted ? 'animate-pulse-glow' : ''
                }`}
              >
                {/* Highlight Ribbon */}
                {plan.highlighted && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-poppins font-bold uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles size={11} className="animate-spin-slow" />
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-poppins font-bold text-lg text-gray-900 text-left">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-left mt-1">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 my-6 text-left">
                    <span className="text-4xl font-poppins font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xs text-gray-500 font-medium">/ {plan.period}</span>
                  </div>

                  <div className="border-t border-gray-100 my-6" />

                  <ul className="space-y-4 text-left">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <div className="p-0.5 rounded-full bg-orange-100 text-orange-600 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  id={`btn-select-plan-${plan.id}`}
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3.5 mt-8 font-poppins font-semibold text-xs rounded-xl cursor-pointer transition-all ${
                    isUserActivePlan
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : plan.highlighted
                      ? 'text-white bg-linear-to-r from-orange-500 via-amber-500 to-pink-500 hover:shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {isUserActivePlan ? 'Active Premium Plan' : plan.buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cashfree Payment Modal Integration */}
      <CashfreePaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={selectedPlan?.numericPrice || 0}
        planName={selectedPlan?.name || ''}
        customerName={currentUser?.name || ''}
        customerEmail={currentUser?.contactInfo?.email || 'customer@soulmate.in'}
        customerPhone={currentUser?.contactInfo?.mobileNumber || '9999999999'}
      />
    </section>
  );
}
