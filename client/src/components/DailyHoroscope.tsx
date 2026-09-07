import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Star, Sun, Moon, Flame, Heart, 
  Briefcase, Clock, Compass, ShieldCheck, 
  RotateCw, RefreshCw, Compass as Astrolabe, ChevronRight,
  Play, Pause, Volume2, ShieldAlert, Check, AlertTriangle, 
  ChevronDown, ChevronUp, User, Globe, Calendar, Award, Info, Music, Bell
} from 'lucide-react';
import { Profile } from '../types';

interface DailyHoroscopeProps {
  currentUser: Profile;
  onNavigate: (view: string) => void;
  onAddNotification: (msg: string, type: 'success' | 'info' | 'heart') => void;
}

// Moon Signs list
const RASHIS = [
  { name: "Mesha (Aries)", lord: "Mars", element: "Fire" },
  { name: "Vrishabha (Taurus)", lord: "Venus", element: "Earth" },
  { name: "Mithuna (Gemini)", lord: "Mercury", element: "Air" },
  { name: "Karka (Cancer)", lord: "Moon", element: "Water" },
  { name: "Simha (Leo)", lord: "Sun", element: "Fire" },
  { name: "Kanya (Virgo)", lord: "Mercury", element: "Earth" },
  { name: "Tula (Libra)", lord: "Venus", element: "Air" },
  { name: "Vrishchika (Scorpio)", lord: "Mars", element: "Water" },
  { name: "Dhanu (Sagittarius)", lord: "Jupiter", element: "Fire" },
  { name: "Makara (Capricorn)", lord: "Saturn", element: "Earth" },
  { name: "Kumbha (Aquarius)", lord: "Saturn", element: "Air" },
  { name: "Meena (Pisces)", lord: "Jupiter", element: "Water" }
];

// Nakshatras list
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", 
  "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Vedic Remedies audio list
const MANTRAS = [
  {
    id: 'sun',
    planet: 'Surya (Sun) - Vitality',
    name: 'Surya Gayatri Mantra',
    sanskrit: 'ॐ आदित्याय विद्महे दिवाकराय धीमहि तन्नः सूर्यः प्रचोदयात्॥',
    english: 'Om Adityaya Vidmahe Divakaraya Dhimahi, Tanno Suryah Prachodayat.',
    translation: 'We meditate on the Sun God, the Maker of the Day. May that Golden Light illuminate our intellect and direct our path.',
    duration: '1:08',
    benefit: 'Enhances career status, confidence, fatherly relationship and soul purpose alignment.'
  },
  {
    id: 'moon',
    planet: 'Chandra (Moon) - Emotion',
    name: 'Chandra Shanti Mantra',
    sanskrit: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः॥',
    english: 'Om Shram Shreem Shrom Sah Chandramase Namah.',
    translation: 'Salutations to the Moon God, the lord of emotions, tranquility, and mental peace.',
    duration: '1:12',
    benefit: 'Brings profound emotional stability, intuitive clarity, and peaceful compatibility.'
  },
  {
    id: 'jupiter',
    planet: 'Guru (Jupiter) - Wisdom',
    name: 'Brihaspati Dev Mantra',
    sanskrit: 'ॐ देवानीं च ऋषीणां च गुरुं काञ्चनसंनिभम्। बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम्॥',
    english: 'Om Devanam Cha Rishinam Cha Gurum Kanchana Sannibham, Buddhi Bhutam Trilokesham Tam Namami Brihaspatim.',
    translation: 'I bow to Brihaspati, teacher of gods and sages, brilliant as gold, embodiment of wisdom, ruler of three worlds.',
    benefit: 'Fortifies marriage compatibility, family happiness, education merit, and general fortune.',
    duration: '1:24'
  },
  {
    id: 'venus',
    planet: 'Shukra (Venus) - Harmony',
    name: 'Shukra Bija Mantra',
    sanskrit: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः॥',
    english: 'Om Dram Dreem Drom Sah Shukraya Namah.',
    translation: 'Salutations to Venus, the Lord of conjugal bliss, aesthetic luxury, and marital alignment.',
    benefit: 'Sparks romantic harmony, enhances charisma, and attracts beautiful life-partners.',
    duration: '1:05'
  },
  {
    id: 'mars',
    planet: 'Mangal (Mars) - Energy',
    name: 'Mangal Dosha Nivarana Mantra',
    sanskrit: 'ॐ धरणीगर्भसंभूतं विद्युत्कान्तिसमप्रभम्। कुमारं शक्तिहस्तं च मङ्गलं प्रणमाम्यहम्॥',
    english: 'Om Dharani Garbha Sambhutam Vidyut Kanti Sama Prabham, Kumaram Shakti Hastam Cha Mangalam Pranamamyaham.',
    translation: 'I salute Mars, born from the Earth, radiant like a lightning strike, the youthful deity holding a spear of power.',
    benefit: 'Alleviates Manglik friction, checks anger issues, and clears dynamic marriage blocks.',
    duration: '1:30'
  }
];

export default function DailyHoroscope({ currentUser, onNavigate, onAddNotification }: DailyHoroscopeProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'love' | 'career' | 'muhurat' | 'grahabala'>('chart');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculatingLabel, setRecalculatingLabel] = useState('');
  const [isAiPowered, setIsAiPowered] = useState(false);

  // Editable Kundli profile parameters (local state initialized from current user, can be modified inside the page)
  const [localProfile, setLocalProfile] = useState<Profile>({ ...currentUser });
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Sound bath mantra player states
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);
  const [isPlayingMantra, setIsPlayingMantra] = useState(false);
  const [mantraProgress, setMantraProgress] = useState(0);

  // Interactive Kundli house description selection
  const [selectedHouse, setSelectedHouse] = useState<number>(1);

  // Ashtakoota Matchmaker Simulator state
  const [partnerRashi, setPartnerRashi] = useState("Karka (Cancer)");
  const [partnerNakshatra, setPartnerNakshatra] = useState("Rohini");
  const [isMatchingCalculated, setIsMatchingCalculated] = useState(false);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [matchBreakdown, setMatchBreakdown] = useState<any>(null);

  // Countdown timer state for the next Muhurat
  const [countdownText, setCountdownText] = useState("02:15:30");

  const birthDate = localProfile.birthDate || '1998-09-14';
  const birthTime = localProfile.birthTime || '08:45';
  const birthPlace = localProfile.birthPlace || 'New Delhi, India';
  const rashiVal = localProfile.rashi || 'Virgo (Kanya)';
  const nakshatraVal = localProfile.nakshatra || 'Chitra';
  const gotraVal = localProfile.gotra || 'Vashishta';

  // Procedural client-side lagna calculation
  const getLagna = (timeStr: string) => {
    const [hourStr] = (timeStr || "08:00").split(':');
    const hour = parseInt(hourStr) || 8;
    if (hour >= 5 && hour < 7) return { name: 'Mesha (Aries)', ruler: 'Mars', element: 'Fire' };
    if (hour >= 7 && hour < 9) return { name: 'Vrishabha (Taurus)', ruler: 'Venus', element: 'Earth' };
    if (hour >= 9 && hour < 11) return { name: 'Mithuna (Gemini)', ruler: 'Mercury', element: 'Air' };
    if (hour >= 11 && hour < 13) return { name: 'Karka (Cancer)', ruler: 'Moon', element: 'Water' };
    if (hour >= 13 && hour < 15) return { name: 'Simha (Leo)', ruler: 'Sun', element: 'Fire' };
    if (hour >= 15 && hour < 17) return { name: 'Kanya (Virgo)', ruler: 'Mercury', element: 'Earth' };
    if (hour >= 17 && hour < 19) return { name: 'Tula (Libra)', ruler: 'Venus', element: 'Air' };
    if (hour >= 19 && hour < 21) return { name: 'Vrishchika (Scorpio)', ruler: 'Mars', element: 'Water' };
    if (hour >= 21 && hour < 23) return { name: 'Dhanu (Sagittarius)', ruler: 'Jupiter', element: 'Fire' };
    if (hour >= 23 || hour < 1) return { name: 'Makara (Capricorn)', ruler: 'Saturn', element: 'Earth' };
    if (hour >= 1 && hour < 3) return { name: 'Kumbha (Aquarius)', ruler: 'Saturn', element: 'Air' };
    return { name: 'Meena (Pisces)', ruler: 'Jupiter', element: 'Water' };
  };

  const currentLagna = getLagna(birthTime);

  // Fallback defaults
  const getLoveInsightFallback = () => {
    const isGroom = localProfile.gender === 'Groom';
    const oppositeGender = isGroom ? 'brides' : 'grooms';
    const manglikText = localProfile.manglik === 'Manglik' 
      ? 'Since you possess Mangal Dosha, today Mars transits your 4th house. Seek marriages with Manglik profiles or highly compatible Anshik ones to neutralise transits.'
      : 'Your peaceful Mars alignment indicates high flexibility. Excellent day to connect with family-oriented profiles without hesitation.';

    return {
      title: `${rashiVal} Compatibility Forecast`,
      general: `Today, Chandra transit aligns with your Nakshatra, ${nakshatraVal}, generating high emotional resonance. Your communication with potential ${oppositeGender} will be highly productive, especially between 10:00 AM and 1:30 PM.`,
      manglikAdvice: manglikText,
      bestMatchCastes: `Excellent matching chances with ${localProfile.caste || 'your caste'} sub-clans, especially those hailing from ${localProfile.location?.state || 'your region'} or adjacent regions.`,
      recommendation: `Send at least 2 interests to profiles of star signs ${currentLagna.element === 'Fire' ? 'Leo, Sagittarius' : currentLagna.element === 'Earth' ? 'Capricorn, Taurus' : currentLagna.element === 'Air' ? 'Libra, Gemini' : 'Scorpio, Pisces'} today to harness current Gochara transits.`
    };
  };

  const getCareerInsightFallback = () => {
    return {
      title: `Astrological Outlook for ${localProfile.profession || 'Profession'}`,
      general: `Mercury, your vocational planet, resides in an auspicious Shunya transit today. Your professional skills as a ${localProfile.profession || 'Specialist'} are highly valued under the current planetary cycle, bringing premium recognition and elevated respect among family circles.`,
      wealth: `Your financial profile (${localProfile.salary || 'income block'}) is supported by a stable Jupiter transit in your 2nd house of accumulated wealth. Ideal day for discussing family status and future financial plans with elders.`,
      remedy: `To clear career minor blockages, consider lighting a ghee diya facing east this evening during Sandhya Kaalam.`
    };
  };

  const getMuhuratsFallback = () => {
    return [
      {
        name: 'Abhijit Muhurat (Highly Auspicious)',
        time: `11:45 AM - 12:35 PM`,
        status: 'Excellent',
        action: 'Perfect window to accept matches, send interests, or initiate first secure chats with candidates.',
        icon: 'Sun'
      },
      {
        name: 'Amrit Kaal',
        time: `04:20 PM - 05:55 PM`,
        status: 'Auspicious',
        action: 'Highly auspicious for discussing family backgrounds with parent guardians or Shastri coaches.',
        icon: 'Moon'
      },
      {
        name: 'Rahu Kaal (Avoid Major Actions)',
        time: `01:30 PM - 03:00 PM`,
        status: 'Inauspicious',
        action: 'Avoid initiating first contact or finalizing kundli details during this transit interval.',
        icon: 'Flame'
      }
    ];
  };

  const getGrahaBalaFallback = () => {
    return [
      { name: 'Surya (Sun) - Vitality', score: 85, color: 'bg-amber-500', desc: 'Provides clear leadership & family honor.' },
      { name: 'Chandra (Moon) - Emotion', score: 78, color: 'bg-sky-400', desc: 'Indicates warm maternal support & empathy.' },
      { name: 'Guru (Jupiter) - Wisdom', score: 92, color: 'bg-yellow-500', desc: 'Brings high matching intelligence & sub-caste merit.' },
      { name: 'Shukra (Venus) - Harmony', score: 88, color: 'bg-rose-400', desc: 'Sparks powerful matrimonial connection & lifestyle affinity.' },
      { name: 'Mangal (Mars) - Energy', score: localProfile.manglik === 'Manglik' ? 95 : 62, color: 'bg-orange-600', desc: localProfile.manglik === 'Manglik' ? 'High intense alignment; seek Manglik balancing.' : 'Balanced energy flow with no marital obstacles.' }
    ];
  };

  // State holding either cached/fetched AI horoscope or default fallback
  const [horoscopeData, setHoroscopeData] = useState<any>(() => {
    try {
      const cached = localStorage.getItem(`soulmate_horoscope_${currentUser.id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.lagna) return parsed;
      }
    } catch (e) {
      console.warn("Could not retrieve horoscope cache:", e);
    }

    return {
      lagna: currentLagna,
      chartSummary: {
        evaluation: `Your birth details yield a highly auspicious ${currentLagna.name} ascendant ruled by ${currentLagna.ruler}. Jupiter resides in your 12th house, facilitating deep spiritual wisdom and premium educational accomplishments, which perfectly aligns with your career path as a ${currentUser.profession || 'Software Engineer'}.`,
        verdict: 'No severe planetary Doshas detected in your current Janma Kundli. Excellent prospects for matching with premium candidates who have high Guna compatibility.'
      },
      loveInsight: {
        title: `${currentUser.rashi || 'Virgo (Kanya)'} Compatibility Forecast`,
        general: `Today, Chandra transit aligns with your Nakshatra, ${currentUser.nakshatra || 'Chitra'}, generating high emotional resonance. Your communication with potential partners will be highly productive today, especially between 10:00 AM and 1:30 PM.`,
        manglikAdvice: currentUser.manglik === 'Manglik' 
          ? 'Since you possess Mangal Dosha, today Mars transits your 4th house. Seek marriages with Manglik profiles to neutralize transits.'
          : 'Your peaceful Mars alignment indicates high flexibility. Excellent day to connect with family-oriented profiles without hesitation.',
        bestMatchCastes: `Excellent matching chances with ${currentUser.caste || 'your caste'} sub-clans, especially those hailing from ${currentUser.location?.state || 'your region'} or adjacent regions.`,
        recommendation: `Send interests to profiles of complementary signs today to harness current Gochara transits.`
      },
      careerInsight: {
        title: `Astrological Outlook for ${currentUser.profession || 'Profession'}`,
        general: `Mercury, your vocational planet, resides in an auspicious Shunya transit today. Your professional skills as a ${currentUser.profession || 'Specialist'} are highly valued under the current planetary cycle, bringing premium recognition and elevated respect among family circles.`,
        wealth: `Your financial profile (${currentUser.salary || 'income'}) is supported by a stable Jupiter transit in your 2nd house of accumulated wealth. Ideal day for discussing family status with elders.`,
        remedy: `To clear career minor blockages, consider lighting a ghee diya facing east this evening during Sandhya Kaalam.`
      },
      muhurats: [
        {
          name: 'Abhijit Muhurat (Highly Auspicious)',
          time: '11:45 AM - 12:35 PM',
          status: 'Excellent',
          action: 'Perfect window to accept matches, send interests, or initiate first secure chats with candidates.',
          icon: 'Sun'
        },
        {
          name: 'Amrit Kaal',
          time: '04:20 PM - 05:55 PM',
          status: 'Auspicious',
          action: 'Highly auspicious for discussing family backgrounds with parent guardians.',
          icon: 'Moon'
        },
        {
          name: 'Rahu Kaal (Avoid Major Actions)',
          time: '01:30 PM - 03:00 PM',
          status: 'Inauspicious',
          action: 'Avoid initiating first contact or finalizing kundli details during this transit.',
          icon: 'Flame'
        }
      ],
      grahaBala: [
        { name: 'Surya (Sun) - Vitality', score: 85, color: 'bg-amber-500', desc: 'Provides clear leadership & family honor.' },
        { name: 'Chandra (Moon) - Emotion', score: 78, color: 'bg-sky-400', desc: 'Indicates warm maternal support & empathy.' },
        { name: 'Guru (Jupiter) - Wisdom', score: 92, color: 'bg-yellow-500', desc: 'Brings high matching intelligence & sub-caste merit.' },
        { name: 'Shukra (Venus) - Harmony', score: 88, color: 'bg-rose-400', desc: 'Sparks powerful matrimonial connection & lifestyle affinity.' },
        { name: 'Mangal (Mars) - Energy', score: currentUser.manglik === 'Manglik' ? 95 : 62, color: 'bg-orange-600', desc: currentUser.manglik === 'Manglik' ? 'High intense alignment; seek Manglik balancing.' : 'Balanced energy flow with no marital obstacles.' }
      ]
    };
  });

  // Watch cache status
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`soulmate_horoscope_${currentUser.id}`);
      if (cached) {
        setIsAiPowered(true);
      } else {
        setIsAiPowered(false);
      }
    } catch (e) {
      setIsAiPowered(false);
    }
  }, [horoscopeData, currentUser.id]);

  // Simulated live countdown clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hrs = 23 - now.getHours();
      const mins = 59 - now.getMinutes();
      const secs = 59 - now.getSeconds();
      
      const pad = (n: number) => n.toString().padStart(2, '0');
      setCountdownText(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Audio Progress Bar increment simulator
  useEffect(() => {
    let progressTimer: any;
    if (isPlayingMantra) {
      progressTimer = setInterval(() => {
        setMantraProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingMantra(false);
            onAddNotification(`Completed recitation of ${MANTRAS[currentMantraIndex].name}. May the planetary alignments bring you peace!`, 'success');
            return 0;
          }
          return prev + 1.2;
        });
      }, 1000);
    }
    return () => clearInterval(progressTimer);
  }, [isPlayingMantra, currentMantraIndex]);

  // Fetch horoscope from backend
  const fetchAiHoroscope = async (silent = false, profileToUse = localProfile) => {
    if (!silent) {
      setIsRecalculating(true);
      setRecalculatingLabel('Consulting Astro-Computation server...');
    }

    try {
      if (!silent) {
        await new Promise(r => setTimeout(r, 650));
        setRecalculatingLabel('Syncing planetary transits...');
        await new Promise(r => setTimeout(r, 650));
        setRecalculatingLabel('Formulating Ashtakoota matrix...');
      }

      const response = await fetch('/api/daily-horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileToUse })
      });

      if (!response.ok) throw new Error("Astro API request failed");

      const data = await response.json();
      
      setHoroscopeData(data);
      localStorage.setItem(`soulmate_horoscope_${currentUser.id}`, JSON.stringify(data));
      setIsAiPowered(true);

      if (!silent) {
        onAddNotification('Personalized planetary transits updated with active Gochara!', 'success');
      }
    } catch (err) {
      console.error("Failed to generate AI horoscope, using procedural fallback:", err);
      
      const computedLagna = getLagna(profileToUse.birthTime || '08:45');
      const mockResult = {
        lagna: computedLagna,
        chartSummary: {
          evaluation: `Based on your synchronized coordinates, your chart shows a prominent ${computedLagna.name} ascendant governed by ${computedLagna.ruler}. Today, planetary aspects reinforce excellent matchmaking affinity for a ${profileToUse.profession || 'Specialist'}.`,
          verdict: `Auspicious transit cycle. Jupiter casts a beneficial aspect on your 9th house of dharma, bringing matching greenlight.`
        },
        loveInsight: {
          title: `${profileToUse.rashi || 'Virgo (Kanya)'} Matchmaking Outlook`,
          general: `Chandra transit aligns with your Janma Nakshatra, ${profileToUse.nakshatra || 'Chitra'}, raising emotional sensitivity and attraction indices. Conversations with prospective matches will be very positive.`,
          manglikAdvice: profileToUse.manglik === 'Manglik' 
            ? 'Your Mangal Dosha indicates active fiery transits. Seek matching Manglik candidates to maintain planetary equilibrium.'
            : 'Clear Mars elements present. No major matrimonial friction expected during this transit cycle.',
          bestMatchCastes: `Excellent matching prospects with compatible ${profileToUse.caste || 'your caste'} families from nearby regions.`,
          recommendation: `Initiate conversations with complementary star signs today to leverage current auspicious transits.`
        },
        careerInsight: {
          title: `Transit Analysis for ${profileToUse.profession || 'your field'}`,
          general: `Mercury is powerfully positioned today, offering intellectual strength and professional recognition in your status as a ${profileToUse.profession || 'expert'}.`,
          wealth: `Your financial profile (${profileToUse.salary || 'LPA'}) is aligned with stable Jupiter rays. Discuss plans safely.`,
          remedy: `Consider offering water to Surya Dev tomorrow morning to dispel any minor blocks.`
        },
        muhurats: getMuhuratsFallback(),
        grahaBala: [
          { name: 'Surya (Sun) - Vitality', score: 82, color: 'bg-amber-500', desc: 'Provides solar strength.' },
          { name: 'Chandra (Moon) - Emotion', score: 75, color: 'bg-sky-400', desc: 'Governs emotional tranquility.' },
          { name: 'Guru (Jupiter) - Wisdom', score: 90, color: 'bg-yellow-500', desc: 'Bestows wisdom and matchmaking merit.' },
          { name: 'Shukra (Venus) - Harmony', score: 85, color: 'bg-rose-400', desc: 'Promotes deep relationship bonding.' },
          { name: 'Mangal (Mars) - Energy', score: profileToUse.manglik === 'Manglik' ? 95 : 65, color: 'bg-orange-600', desc: 'Dynamic courage energy.' }
        ]
      };

      setHoroscopeData(mockResult);
      if (!silent) {
        onAddNotification('Planetary alignment synced via high fidelity procedural model.', 'info');
      }
    } finally {
      setIsRecalculating(false);
    }
  };

  // Trigger initial load
  useEffect(() => {
    const cached = localStorage.getItem(`soulmate_horoscope_${currentUser.id}`);
    if (!cached) {
      fetchAiHoroscope(true, currentUser);
    }
  }, [currentUser.id]);

  const handleUpdateProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecalculating(true);
    setRecalculatingLabel("Calculating customized transit intersections...");
    
    setTimeout(() => {
      setIsConfigOpen(false);
      onAddNotification("Celestial birth details successfully updated in temporary Jyotish matrix!", "success");
      fetchAiHoroscope(false, localProfile);
    }, 1000);
  };

  const resetBirthDetails = () => {
    setLocalProfile({ ...currentUser });
    onAddNotification("Reset birth coordinates to original profile defaults.", "info");
    fetchAiHoroscope(false, currentUser);
  };

  // Ashtakoota Gun Milan matching function
  const runAshtakootaMatch = () => {
    setIsRecalculating(true);
    setRecalculatingLabel("Computing Ashtakoota compatibility Gunas...");

    setTimeout(() => {
      // Deterministic but highly realistic calculations based on strings
      const seedVal = (partnerRashi.length + partnerNakshatra.length + rashiVal.length + nakshatraVal.length) % 15;
      
      // Compute Gunas (max 36)
      const varnaScore = seedVal % 2 === 0 ? 1 : 0;
      const vashyaScore = seedVal % 3 === 0 ? 2 : (seedVal % 3 === 1 ? 1.5 : 1);
      const taraScore = seedVal % 4 === 0 ? 3 : (seedVal % 4 === 1 ? 2.5 : 1.5);
      const yoniScore = seedVal % 5 === 0 ? 4 : (seedVal % 5 === 2 ? 3 : 2);
      const maitriScore = seedVal % 6 === 0 ? 5 : (seedVal % 6 === 3 ? 4 : 3);
      const ganaScore = seedVal % 3 === 0 ? 6 : (seedVal % 3 === 1 ? 5 : 1);
      const bhakootScore = seedVal % 7 === 0 ? 7 : (seedVal % 7 === 2 ? 6 : 0);
      const nadiScore = seedVal % 8 === 0 ? 8 : (seedVal % 8 === 4 ? 7 : 0);

      const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;
      
      const breakdown = {
        varna: { earned: varnaScore, max: 1, title: 'Varna (Spiritual Aptitude)', desc: varnaScore === 1 ? 'Perfect alignment of work values and cultural ideals.' : 'Minor variations in general approach to work.' },
        vashya: { earned: vashyaScore, max: 2, title: 'Vashya (Mutual Attraction)', desc: vashyaScore >= 1.5 ? 'Strong personal magnetism and mutual emotional control.' : 'Balanced friendship with moderate attraction.' },
        tara: { earned: taraScore, max: 3, title: 'Tara (Destiny & Fortune)', desc: taraScore >= 2.5 ? 'Favorable star stars, ensuring happiness and mutual wealth.' : 'Neutral stars. Requires some cooperation.' },
        yoni: { earned: yoniScore, max: 4, title: 'Yoni (Physical Compatibility)', desc: yoniScore >= 3 ? 'Excellent physical and instinctual harmony.' : 'Moderate biological compatibility, needs emotional bonding.' },
        maitri: { earned: maitriScore, max: 5, title: 'Maitri (Friendship Level)', desc: maitriScore >= 4 ? 'Lord of Moon signs are close friends. Exceptional trust.' : 'Neutral friendship. Easy to manage.' },
        gana: { earned: ganaScore, max: 6, title: 'Gana (Temperament Align)', desc: ganaScore >= 5 ? 'Compatible temperaments. Excellent daily collaboration.' : 'Slightly conflicting temperaments (Manushya & Rakshasa). Remedies advised.' },
        bhakoot: { earned: bhakootScore, max: 7, title: 'Bhakoot (Love & Family)', desc: bhakootScore >= 6 ? 'Highly auspicious. Protects family prosperity and longevity.' : 'Bhakoot Dosha detected. Spiritual counseling helps neutralize.' },
        nadi: { earned: nadiScore, max: 8, title: 'Nadi (Health & Progeny)', desc: nadiScore >= 7 ? 'Perfect biological match. Ensures excellent health and progeny.' : 'Nadi Dosha present. Indicates similar physiological constitutions.' }
      };

      setMatchScore(totalScore);
      setMatchBreakdown(breakdown);
      setIsMatchingCalculated(true);
      setIsRecalculating(false);
      
      if (totalScore >= 18) {
        onAddNotification(`Auspicious match computed! Gun Milan Score is ${totalScore}/36.`, 'success');
      } else {
        onAddNotification(`Calculated Match score is ${totalScore}/36. Some Kundli Doshas present.`, 'info');
      }
    }, 1200);
  };

  const getMuhuratIconComponent = (iconTag: string) => {
    switch (iconTag) {
      case 'Sun': return <Sun size={14} className="text-amber-500 animate-pulse" />;
      case 'Moon': return <Moon size={14} className="text-[#EC4899]" />;
      case 'Flame': return <Flame size={14} className="text-red-400" />;
      default: return <Clock size={14} className="text-orange-500" />;
    }
  };

  const handleScheduleReminder = (name: string, time: string) => {
    onAddNotification(`⏰ Auspicious ${name} alarm scheduled for today at ${time.split(' ')[0]}!`, 'success');
  };

  const toggleMantraPlay = () => {
    setIsPlayingMantra(!isPlayingMantra);
    onAddNotification(isPlayingMantra ? "Mantra playback paused." : `Listening to sacred ${MANTRAS[currentMantraIndex].name} for planetary remediation...`, 'info');
  };

  const selectNextMantra = () => {
    setMantraProgress(0);
    setIsPlayingMantra(false);
    setCurrentMantraIndex((prev) => (prev + 1) % MANTRAS.length);
  };

  const selectPrevMantra = () => {
    setMantraProgress(0);
    setIsPlayingMantra(false);
    setCurrentMantraIndex((prev) => (prev - 1 + MANTRAS.length) % MANTRAS.length);
  };

  const currentMantra = MANTRAS[currentMantraIndex];

  // Visual house description list helper
  const getSelectedHouseDescription = (houseNum: number) => {
    const data: Record<number, { title: string; significance: string; transit: string; rating: string }> = {
      1: {
        title: "1st House (Lagna - Ascendant)",
        significance: "Represents Self, Physical Outlook, Character, and General Constitution.",
        transit: `Ruled by Mercury under ${rashiVal}. Your personal magnetism is strongly highlighted today. Communication sparkles with natural intelligence and clarity.`,
        rating: "Highly Auspicious"
      },
      2: {
        title: "2nd House (Dhana Bhava)",
        significance: "Represents Accumulated Wealth, Speech, Values, and Immediate Family.",
        transit: "Venus transit blesses your second house with stable wealth rays. Highly favorable for conducting important conversations with prospective in-laws regarding matching values.",
        rating: "Auspicious"
      },
      3: {
        title: "3rd House (Sahaja Bhava)",
        significance: "Represents Siblings, Courage, Vitality, and Short-Distance Journeys.",
        transit: "Mars influence provides dynamic vitality. Your messaging with matches will be courageous, proactive, and charmingly articulate.",
        rating: "Positive"
      },
      4: {
        title: "4th House (Sukha Bhava)",
        significance: "Represents Mother, Home Environment, Domestic Peace, and Vehicles.",
        transit: "Moon transit governs domestic quietude today. Take some time to share compatible matches with your mother or trusted family guardians.",
        rating: "Peaceful & Stable"
      },
      5: {
        title: "5th House (Putra Bhava)",
        significance: "Represents Intellect, Romantic Connection, Children, and Past Good Deeds (Poorvapunya).",
        transit: "Jupiter casts a beautiful benign glance. Your romantic charm is exceptionally elevated. Excellent time for sending personalized interests.",
        rating: "Excellent Harmony"
      },
      6: {
        title: "6th House (Shatru Bhava)",
        significance: "Represents Health, Debt, Adversaries, and Daily Professional Routines.",
        transit: "Governed by Saturn. No severe transiting obstacles. Any past emotional baggage or relationship doubts are successfully cleared away.",
        rating: "Neutralized / Safe"
      },
      7: {
        title: "7th House (Kalatra Bhava)",
        significance: "Represents Marriage, Lifepartner, Serious Partnerships, and Alliances.",
        transit: "Jupiter and Venus form a golden matrimonial resonance here. Marital transits are at their peak level of fortune today. The absolute best cycle for initiating commitments.",
        rating: "Peak Matrimonial Bliss"
      },
      8: {
        title: "8th House (Ayus Bhava)",
        significance: "Represents Secret Knowledge, Mysticism, Longevity, and Sudden Changes.",
        transit: "Saturn transits offer quiet patience. Excellent for diving deep into self-reflection, understanding kundli details, or studying astro charts.",
        rating: "Deep Mystical Rays"
      },
      9: {
        title: "9th House (Dharma Bhava)",
        significance: "Represents Fortune, Religion, Wisdom, Higher Learning, and Father.",
        transit: "Auspicious celestial rays boost your natural fortune. Guidance received from family elders or Shastri relationship coaches today holds immense value.",
        rating: "Highly Auspicious"
      },
      10: {
        title: "10th House (Karma Bhava)",
        significance: "Represents Vocation, Career Achievements, Public Status, and Fame.",
        transit: `Governed by Mercury. Your vocational status as a ${localProfile.profession || 'Specialist'} adds high public respect. Prospective matches find your career background highly attractive.`,
        rating: "Strong Career Light"
      },
      11: {
        title: "11th House (Labha Bhava)",
        significance: "Represents Wishes, Incomes, Network of Friends, and Senior Affiliates.",
        transit: "Rahu-Ketu transit node creates sudden delightful matches. Keep your notifications active, as a beautiful surprise interest may land in your inbox.",
        rating: "Dynamic gains"
      },
      12: {
        title: "12th House (Vyaya Bhava)",
        significance: "Represents Dream Space, Solitude, Expenses, and Spiritual Liberation.",
        transit: "Jupiter aspects support spiritual expenses. Favorable time for investing in premium membership features or customized Kundli milan services.",
        rating: "Stable Spendings"
      }
    };
    return data[houseNum] || data[1];
  };

  const houseInfo = getSelectedHouseDescription(selectedHouse);

  return (
    <div id="personalized-daily-horoscope-container" className="glass-card bg-white border border-gray-150 rounded-[32px] p-6 sm:p-8 shadow-xl text-left relative overflow-hidden">
      
      {/* Background abstract mandala decor */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-radial from-amber-500/10 to-transparent rounded-full pointer-events-none animate-pulse" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-radial from-purple-500/5 to-transparent rounded-full pointer-events-none" />

      {/* Header section with birth parameters summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-gray-100 pb-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0 shadow-sm border border-amber-100">
            <Astrolabe size={28} className="animate-spin-slow text-amber-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-poppins font-extrabold text-xl text-gray-900 tracking-tight">Personalized Daily Horoscope</h3>
              <div className="flex gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                  🕉 Vedic Gochara
                </span>
                {isAiPowered ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                    ✨ Gemini Powered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Jyotish Matrix Active
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-sans">
              Dynamic transits for <span className="font-semibold text-gray-800">{localProfile.name}</span> based on DOB: {birthDate} | Time: {birthTime} | Place: {birthPlace}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            id="toggle-config-btn"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="px-3 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold font-sans text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Compass size={13} />
            {isConfigOpen ? 'Close Settings' : 'Adjust Birth Coordinates'}
          </button>
          
          <button
            id="recalculate-horoscope-btn"
            onClick={() => fetchAiHoroscope(false)}
            disabled={isRecalculating}
            className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95 font-bold font-sans text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/10"
          >
            <RotateCw size={12} className={isRecalculating ? 'animate-spin' : ''} />
            {isRecalculating ? 'Computing...' : 'Recalculate Transits'}
          </button>
        </div>
      </div>

      {/* Collapsible Kundli Config Console */}
      <AnimatePresence>
        {isConfigOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-5 bg-gradient-to-b from-amber-500/5 to-orange-500/5 border border-amber-200/50 rounded-2xl mb-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-poppins font-bold text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="text-amber-600" size={14} /> Adjust Astrological Birth Coordinates
                </h4>
                <button 
                  onClick={resetBirthDetails}
                  className="text-[10px] font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Reset to Profile Defaults
                </button>
              </div>

              <form onSubmit={handleUpdateProfileSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Birth Date</label>
                  <input 
                    type="date"
                    value={birthDate}
                    onChange={(e) => setLocalProfile({ ...localProfile, birthDate: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Birth Time</label>
                  <input 
                    type="time"
                    value={birthTime}
                    onChange={(e) => setLocalProfile({ ...localProfile, birthTime: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Birth Place</label>
                  <input 
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setLocalProfile({ ...localProfile, birthPlace: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="e.g. New Delhi, India"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Janma Rashi (Moon Sign)</label>
                  <select
                    value={rashiVal}
                    onChange={(e) => setLocalProfile({ ...localProfile, rashi: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    {RASHIS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nakshatra</label>
                  <select
                    value={nakshatraVal}
                    onChange={(e) => setLocalProfile({ ...localProfile, nakshatra: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Gotra</label>
                  <input 
                    type="text"
                    value={gotraVal}
                    onChange={(e) => setLocalProfile({ ...localProfile, gotra: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold font-sans text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    Save & Apply Celestial Parameters
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Astro Metadata Badge Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <div className="p-3 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-200/20 rounded-2xl hover:border-amber-200/50 transition-all">
          <span className="block text-[9px] uppercase font-bold text-gray-400 font-sans tracking-wider">Lagna (Ascendant)</span>
          <span className="text-xs font-bold text-gray-800 font-poppins">{horoscopeData.lagna?.name}</span>
          <span className="block text-[9px] text-gray-400 mt-0.5 font-sans">Ruler: <span className="font-medium text-amber-700">{horoscopeData.lagna?.ruler}</span></span>
        </div>
        <div className="p-3 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-200/20 rounded-2xl hover:border-amber-200/50 transition-all">
          <span className="block text-[9px] uppercase font-bold text-gray-400 font-sans tracking-wider">Janma Rashi</span>
          <span className="text-xs font-bold text-gray-800 font-poppins">{rashiVal}</span>
          <span className="block text-[9px] text-gray-400 mt-0.5 font-sans">Vedic Element: <span className="font-medium text-amber-700">{RASHIS.find(r => r.name === rashiVal)?.element || 'Earth'}</span></span>
        </div>
        <div className="p-3 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-200/20 rounded-2xl hover:border-amber-200/50 transition-all">
          <span className="block text-[9px] uppercase font-bold text-gray-400 font-sans tracking-wider">Nakshatra / Pada</span>
          <span className="text-xs font-bold text-gray-800 font-poppins">{nakshatraVal}</span>
          <span className="block text-[9px] text-gray-400 mt-0.5 font-sans">Yoni: <span className="font-medium text-amber-700">Vyaghra (Tiger)</span></span>
        </div>
        <div className="p-3 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-200/20 rounded-2xl hover:border-amber-200/50 transition-all">
          <span className="block text-[9px] uppercase font-bold text-gray-400 font-sans tracking-wider">Gotra / Varna</span>
          <span className="text-xs font-bold text-gray-800 font-poppins">{gotraVal}</span>
          <span className="block text-[9px] text-gray-400 mt-0.5 font-sans">Varna: <span className="font-medium text-amber-700">Kshatriya (Sovereign)</span></span>
        </div>
      </div>

      {/* Recalculating Overlay */}
      <AnimatePresence>
        {isRecalculating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-4"
          >
            <div className="relative">
              <RefreshCw size={52} className="text-orange-500 animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-lg">🕉</span>
            </div>
            <div className="text-sm font-poppins font-bold text-gray-800 animate-pulse text-center">
              {recalculatingLabel}
              <span className="block text-xs font-normal text-gray-400 mt-1">Recalibrating stellar alignments with planetary cycles</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-100 overflow-x-auto gap-2 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveTab('chart')}
          className={`pb-3 px-3 text-xs font-bold font-poppins whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeTab === 'chart' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          🪐 Kundli Houses
        </button>
        <button
          onClick={() => setActiveTab('love')}
          className={`pb-3 px-3 text-xs font-bold font-poppins whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeTab === 'love' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          ❤️ Love & Gun Milan
        </button>
        <button
          onClick={() => setActiveTab('career')}
          className={`pb-3 px-3 text-xs font-bold font-poppins whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeTab === 'career' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          💼 Career & Sound Player
        </button>
        <button
          onClick={() => setActiveTab('muhurat')}
          className={`pb-3 px-3 text-xs font-bold font-poppins whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeTab === 'muhurat' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          ⏳ Subha Muhurthams
        </button>
        <button
          onClick={() => setActiveTab('grahabala')}
          className={`pb-3 px-3 text-xs font-bold font-poppins whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeTab === 'grahabala' 
              ? 'border-orange-500 text-orange-600 font-extrabold' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          📊 Planetary Power
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[280px]">
        
        {/* TAB 1: KUNDLI CHART */}
        {activeTab === 'chart' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            {/* Interactive North Indian style Kundli box representation */}
            <div className="lg:col-span-6 flex flex-col items-center gap-4">
              <span className="text-[11px] text-gray-400 font-sans uppercase tracking-wider font-semibold">
                👈 Click Houses to Reveal Astrological Significance
              </span>
              
              <div className="w-64 h-64 border-3 border-amber-300 bg-amber-500/5 relative rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
                
                {/* Visual lines forming a north indian chart representation */}
                <div className="absolute inset-0 border border-amber-300/20 m-2" />
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-300/40 rotate-45 transform scale-150" />
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-300/40 -rotate-45 transform scale-150" />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-300/40" />
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-300/40" />
                
                {/* Active Highlight Rings for Houses */}
                {selectedHouse === 1 && <div className="absolute top-4 w-12 h-12 bg-amber-500/20 rounded-full border border-amber-400 pointer-events-none" />}
                {selectedHouse === 2 && <div className="absolute top-16 right-4 w-10 h-10 bg-amber-500/20 rounded-full border border-amber-400 pointer-events-none" />}
                {selectedHouse === 5 && <div className="absolute bottom-16 right-4 w-10 h-10 bg-amber-500/20 rounded-full border border-amber-400 pointer-events-none" />}
                {selectedHouse === 7 && <div className="absolute bottom-4 w-12 h-12 bg-amber-500/20 rounded-full border border-amber-400 pointer-events-none" />}
                {selectedHouse === 10 && <div className="absolute top-16 left-4 w-10 h-10 bg-amber-500/20 rounded-full border border-amber-400 pointer-events-none" />}
                {selectedHouse === 12 && <div className="absolute bottom-16 left-4 w-10 h-10 bg-amber-500/20 rounded-full border border-amber-400 pointer-events-none" />}

                {/* Kundli house click buttons */}
                <button 
                  onClick={() => setSelectedHouse(1)}
                  className={`absolute top-4 text-[10px] font-extrabold px-1.5 py-0.5 rounded transition-all cursor-pointer ${selectedHouse === 1 ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-100'}`}
                >
                  Su (1)
                </button>
                <button 
                  onClick={() => setSelectedHouse(12)}
                  className={`absolute left-3 text-[10px] font-extrabold px-1.5 py-0.5 rounded transition-all cursor-pointer ${selectedHouse === 12 ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-100'}`}
                >
                  Ju (12)
                </button>
                <button 
                  onClick={() => setSelectedHouse(2)}
                  className={`absolute right-3 text-[10px] font-extrabold px-1.5 py-0.5 rounded transition-all cursor-pointer ${selectedHouse === 2 ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-100'}`}
                >
                  Me (2)
                </button>
                <button 
                  onClick={() => setSelectedHouse(7)}
                  className={`absolute bottom-4 text-[10px] font-extrabold px-1.5 py-0.5 rounded transition-all cursor-pointer ${selectedHouse === 7 ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-100'}`}
                >
                  Mo (7)
                </button>

                <button 
                  onClick={() => setSelectedHouse(10)}
                  className="absolute top-16 left-12 text-[9px] font-bold text-orange-600 hover:bg-orange-50 px-1 py-0.5 rounded"
                >
                  Lagna (10)
                </button>
                <button 
                  onClick={() => setSelectedHouse(5)}
                  className="absolute top-16 right-12 text-[9px] font-bold text-purple-600 hover:bg-purple-50 px-1 py-0.5 rounded"
                >
                  Ve (5)
                </button>
                <button 
                  onClick={() => setSelectedHouse(11)}
                  className="absolute bottom-16 left-12 text-[9px] font-bold text-gray-600 hover:bg-gray-100 px-1 py-0.5 rounded"
                >
                  Sa (11)
                </button>
                <button 
                  onClick={() => setSelectedHouse(3)}
                  className="absolute bottom-16 right-12 text-[9px] font-bold text-red-600 hover:bg-red-50 px-1 py-0.5 rounded"
                >
                  Ma (3)
                </button>
                
                <div className="z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-amber-300 text-[10px] font-extrabold font-poppins text-amber-900 shadow-md">
                  🕉 House {selectedHouse} Selected
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h4 className="font-poppins font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Star size={16} className="text-amber-500 shrink-0 animate-pulse" /> Lagna Kundli House Analysis
              </h4>

              {/* Explanatory pane for selected house */}
              <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-poppins font-extrabold text-amber-950 uppercase tracking-wide">
                    {houseInfo.title}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                    {houseInfo.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-sans mb-3">
                  {houseInfo.significance}
                </p>
                <div className="bg-white border border-amber-100 p-3 rounded-xl">
                  <span className="block text-[9px] uppercase font-bold text-orange-500 mb-1 font-sans">Today's Transit Impact</span>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">
                    {houseInfo.transit}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-800 leading-relaxed font-sans">
                  <span className="font-bold">Astrological Verdict:</span> {horoscopeData.chartSummary?.verdict}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LOVE & MATCHMAKER SIMULATOR */}
        {activeTab === 'love' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Generic Love advice first */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7 border border-orange-100 bg-orange-500/5 rounded-2xl p-4">
                <h4 className="font-poppins font-bold text-orange-900 text-sm flex items-center gap-1.5 mb-1.5">
                  <Heart size={15} fill="currentColor" className="text-orange-500 shrink-0" /> {horoscopeData.loveInsight?.title || `${rashiVal} Compatibility Forecast`}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  {horoscopeData.loveInsight?.general}
                </p>
                <p className="text-[10px] text-orange-700 font-bold mt-2 font-sans">
                  💡 Recommendation: {horoscopeData.loveInsight?.recommendation}
                </p>
              </div>

              <div className="md:col-span-5 space-y-2">
                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
                  <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5 font-sans">Manglik Advice</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                    {horoscopeData.loveInsight?.manglikAdvice}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
                  <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5 font-sans">Best Caste Compatibility</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                    {horoscopeData.loveInsight?.bestMatchCastes}
                  </p>
                </div>
              </div>
            </div>

            {/* HIGH END INTERACTIVE ASHTAKOOTA MILAN SIMULATOR */}
            <div className="border border-purple-200 bg-purple-50/20 rounded-[24px] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-poppins font-extrabold text-sm text-purple-950">
                    Kundli Matching Simulator (Ashtakoota Gun Milan)
                  </h4>
                  <p className="text-[10px] text-purple-700 font-sans mt-0.5">
                    Test direct celestial compatibility indices out of 36 Gunas with any prospective life-partner candidate.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-purple-900 uppercase mb-1">Partner's Moon Sign (Rashi)</label>
                  <select
                    value={partnerRashi}
                    onChange={(e) => {
                      setPartnerRashi(e.target.value);
                      setIsMatchingCalculated(false);
                    }}
                    className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    {RASHIS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-purple-900 uppercase mb-1">Partner's Nakshatra</label>
                  <select
                    value={partnerNakshatra}
                    onChange={(e) => {
                      setPartnerNakshatra(e.target.value);
                      setIsMatchingCalculated(false);
                    }}
                    className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <button
                    onClick={runAshtakootaMatch}
                    className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold font-sans text-xs rounded-xl shadow-md shadow-purple-500/10 cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Award size={13} />
                    Check Astro Match Affinity
                  </button>
                </div>
              </div>

              {/* Matching results display */}
              <AnimatePresence>
                {isMatchingCalculated && matchBreakdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t border-purple-200/50 pt-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-purple-100 rounded-2xl p-4 gap-4">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-gray-400 font-sans">Total Guna Compatibility</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-poppins font-extrabold text-purple-900">{matchScore}</span>
                          <span className="text-sm font-bold text-gray-400">/ 36 Gunas</span>
                        </div>
                      </div>

                      <div className="flex-1 max-w-sm sm:pl-4 border-l border-purple-100 text-left">
                        <span className="text-[11px] font-poppins font-bold block text-purple-950">
                          {matchScore >= 25 
                            ? '🌟 Uttama (Outstanding Matching Vibe)' 
                            : (matchScore >= 18 ? '✅ Madhyama (Favorable Marriage Union)' : '⚠️ Kanishtha (Conflict Prone - Remedies Advised)')
                          }
                        </span>
                        <p className="text-[11px] text-gray-500 leading-relaxed mt-1 font-sans">
                          {matchScore >= 18 
                            ? `Your Nakshatras (${nakshatraVal} and ${partnerNakshatra}) share strong celestial bonds. Highly recommended to initiate secure chatting and exchange parent guardian calls.`
                            : `Astrological indicators hint at minor Kundli friction. Reciting the Venus Shukra mantra together offers remediation.`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.values(matchBreakdown).map((koota: any, idx) => (
                        <div key={idx} className="p-3 bg-white border border-purple-100 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-xs font-sans">
                            <span className="font-semibold text-gray-700">{koota.title}</span>
                            <span className="font-mono font-bold text-purple-800">{koota.earned}/{koota.max}</span>
                          </div>
                          <div className="w-full bg-purple-100/50 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full bg-purple-600 transition-all duration-500" 
                              style={{ width: `${(koota.earned / koota.max) * 100}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-gray-400 leading-tight font-sans">{koota.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-100 gap-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-sans">
                Need details regarding Gunas? Tap search to find certified Astrologers.
              </span>
              <button 
                onClick={() => onNavigate('search')}
                className="text-xs font-bold text-orange-600 hover:text-orange-500 flex items-center gap-0.5 cursor-pointer font-poppins self-start sm:self-center"
              >
                Match Discovery <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CAREER & MANTRA PLAYER */}
        {activeTab === 'career' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="border border-amber-100 bg-amber-500/5 rounded-2xl p-4">
                <h4 className="font-poppins font-bold text-amber-900 text-sm flex items-center gap-1.5 mb-1.5">
                  <Briefcase size={15} className="text-amber-500 shrink-0" /> {horoscopeData.careerInsight?.title || `Astrological Outlook for ${localProfile.profession}`}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  {horoscopeData.careerInsight?.general}
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-sans">Wealth & Status Prosperity</span>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  {horoscopeData.careerInsight?.wealth}
                </p>
              </div>

              <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2.5">
                <Compass size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-800 leading-relaxed font-sans">
                  <span className="font-bold">Daily Recommended Remedy:</span> {horoscopeData.careerInsight?.remedy}
                </div>
              </div>
            </div>

            {/* SACRED MANTRA SOUND BATH REMEDY PLAYER */}
            <div className="lg:col-span-5 bg-gradient-to-b from-gray-950 to-slate-900 text-white rounded-[24px] p-5 flex flex-col justify-between border border-gray-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Music size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-poppins font-bold text-gray-200">Vedic Sound Bath Remedies</h5>
                    <p className="text-[9px] text-gray-400 font-sans">Remediate weak planetary transits with peaceful mantras</p>
                  </div>
                </div>

                {/* Mantra Selector Carousel */}
                <div className="bg-slate-800/50 border border-gray-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold text-amber-400 font-mono tracking-widest">
                      {currentMantra.planet}
                    </span>
                    <span className="text-[9px] font-semibold text-gray-400 font-sans">
                      Track {currentMantraIndex + 1} of {MANTRAS.length}
                    </span>
                  </div>

                  <div className="text-center py-1">
                    <h6 className="font-poppins font-extrabold text-sm text-amber-100">{currentMantra.name}</h6>
                    <p className="text-[11px] text-orange-400 font-sans mt-0.5 font-semibold">
                      {currentMantra.sanskrit}
                    </p>
                  </div>

                  {/* Wave Equalizer visualization */}
                  <div className="h-8 flex items-center justify-center gap-1 overflow-hidden pt-1">
                    {Array.from({ length: 18 }).map((_, idx) => {
                      const heights = [2, 5, 8, 4, 3, 7, 1, 6, 8, 3, 5, 2, 7, 4, 6, 8, 2, 5];
                      return (
                        <div 
                          key={idx}
                          className="w-1 bg-amber-400 rounded-full transition-all duration-300"
                          style={{ 
                            height: isPlayingMantra ? `${(heights[idx] * (mantraProgress % 4 === 0 ? 3.5 : 2.5))}px` : '4px',
                            opacity: isPlayingMantra ? 1 : 0.4
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Progress Slider */}
                  <div className="space-y-1">
                    <div className="w-full bg-gray-800 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full bg-amber-500 transition-all duration-300" 
                        style={{ width: `${mantraProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono">
                      <span>0:{(Math.round((mantraProgress / 100) * 60)).toString().padStart(2, '0')}</span>
                      <span>{currentMantra.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-6">
                  <button 
                    onClick={selectPrevMantra}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    ◀ Prev
                  </button>
                  <button 
                    onClick={toggleMantraPlay}
                    className="w-11 h-11 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-full flex items-center justify-center shadow-md shadow-amber-500/10 transition-transform active:scale-95 cursor-pointer"
                  >
                    {isPlayingMantra ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <button 
                    onClick={selectNextMantra}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    Next ▶
                  </button>
                </div>

                <div className="bg-slate-900/80 p-2.5 border border-gray-800 rounded-xl text-left">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 mb-0.5 font-sans">Sanskrit Translation & Benefit</span>
                  <p className="text-[10px] text-gray-300 leading-tight font-sans">
                    "{currentMantra.translation}"
                  </p>
                  <p className="text-[9px] text-amber-300/80 leading-none mt-1.5 font-sans italic">
                    ⭐ Benefit: {currentMantra.benefit}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: SHUBH MUHURATS */}
        {activeTab === 'muhurat' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-amber-50 border border-amber-200/40 rounded-2xl p-4 gap-3">
              <div>
                <h4 className="font-poppins font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                  <Clock size={16} className="text-amber-600 animate-pulse" /> Auspicious Muhurat Clock
                </h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Personalized time windows computed for coordinates matching <span className="font-semibold text-gray-700">{birthPlace}</span>:
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-xs shrink-0 self-start sm:self-center">
                <span className="text-[9px] uppercase font-bold text-gray-400 font-mono">Next Day Shift</span>
                <span className="text-sm font-mono font-extrabold text-amber-600">{countdownText}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {horoscopeData.muhurats?.map((muhurat: any, idx: number) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-white border border-gray-150 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-xl shrink-0 mt-0.5 border border-gray-100">
                      {getMuhuratIconComponent(muhurat.icon)}
                    </div>
                    <div>
                      <h5 className="text-xs font-poppins font-bold text-gray-900">{muhurat.name}</h5>
                      <p className="text-[11px] text-gray-500 font-sans mt-0.5">{muhurat.action}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                      {muhurat.time}
                    </span>
                    <span className={`text-[10px] font-extrabold font-sans uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      muhurat.status === 'Excellent' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : (muhurat.status === 'Auspicious' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200')
                    }`}>
                      {muhurat.status}
                    </span>
                    <button
                      onClick={() => handleScheduleReminder(muhurat.name, muhurat.time)}
                      className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Set reminder alarm"
                    >
                      <Bell size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 5: PLANETARY POWER (GRAHA BALA) */}
        {activeTab === 'grahabala' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-poppins font-bold text-gray-800">Planetary Power Coefficient (Graha Bala)</h5>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Vedic strength indices indicating current emotional, rational, physical and marital harmony indices.
                </p>
              </div>
              <span className="inline-flex px-2.5 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded-full shrink-0">
                Live Transit Coefficient
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {horoscopeData.grahaBala?.map((planet: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-white border border-gray-150 rounded-2xl space-y-2 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-extrabold text-gray-800">{planet.name}</span>
                    <span className="font-mono font-bold text-orange-600">{planet.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${planet.score}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-2 rounded-full ${planet.color || 'bg-amber-500'}`}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal font-sans pt-0.5">{planet.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
