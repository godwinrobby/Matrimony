import { Router } from "express";
import { ai } from "./ai.js";
import { Type } from "@google/genai";

const router = Router();

router.post("/daily-horoscope", async (req, res) => {
  const { profile } = req.body;

  if (!profile) {
    return res.status(400).json({ error: "User profile is required to generate a personalized daily horoscope." });
  }

  const getFallbackDailyHoroscope = () => {
    const birthDate = profile.birthDate || '1998-09-14';
    const birthTime = profile.birthTime || '08:45';
    const birthPlace = profile.birthPlace || 'New Delhi, India';
    const rashiVal = profile.rashi || 'Virgo (Kanya)';
    const nakshatraVal = profile.nakshatra || 'Chitra';
    const gotraVal = profile.gotra || 'Vashishta';
    const profession = profile.profession || 'Software Engineer';
    const salary = profile.salary || '15-20 LPA';
    const caste = profile.caste || 'Brahmin';
    const manglik = profile.manglik || 'Non-Manglik';

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
    const lagna = getLagna(birthTime);

    const isGroom = profile.gender === 'Groom';
    const oppositeGender = isGroom ? 'brides' : 'grooms';
    const manglikText = manglik === 'Manglik' 
      ? 'Since you possess Mangal Dosha, Mars currently aspects your 7th house of alliance. Focus on seeking matching profiles with Manglik parameters to ensure seamless cosmic harmony.'
      : 'Your peaceful Mars alignment creates beautiful harmony for a union. An auspicious day to discover candidates without any astrological friction.';

    return {
      lagna,
      chartSummary: {
        evaluation: `Your birth details reveal a strong ${lagna.name} ascendant ruled by ${lagna.ruler}. Today, Jupiter casts a beneficial aspect on your 9th house of fortune, creating highly favorable alignments for matching.`,
        verdict: `Highly auspicious planetary cycle. There are no critical transits or blockages. Excellent prospects for connecting with high-quality candidates of ${caste} caste.`
      },
      loveInsight: {
        title: `${rashiVal} Compatibility Forecast`,
        general: `Today, Chandra transit aligns with your Janma Nakshatra, ${nakshatraVal}, raising your emotional intelligence and communication clarity. Conversations with potential matches will be highly fruitful.`,
        manglikAdvice: manglikText,
        bestMatchCastes: `High affinity with prospective families from ${caste} sub-clans, specifically with native roots matching or nearby ${profile.location?.state || 'your region'}.`,
        recommendation: `Initiate contact or send interests to profiles of ${lagna.element === 'Fire' ? 'Leo, Sagittarius' : lagna.element === 'Earth' ? 'Capricorn, Taurus' : lagna.element === 'Air' ? 'Libra, Gemini' : 'Scorpio, Pisces'} signs today to leverage this Gochara transit.`
      },
      careerInsight: {
        title: `Astro Outlook for ${profession}`,
        general: `Mercury, the planet of intelligence and vocational skills, resides in an auspicious Shunya transit today. Your professional status as a ${profession} is highly esteemed under the current planetary cycle, bringing elevated respect among family circles.`,
        wealth: `Your financial profile with a salary of ${salary} is strongly supported by a stable Jupiter transit in your 2nd house of accumulated wealth. Excellent time to discuss future plans with family elders.`,
        remedy: `To eliminate any minor obstacles, consider offering water to the Sun (Surya Arghya) tomorrow morning or lighting a ghee diya facing East.`
      },
      muhurats: [
        {
          name: 'Abhijit Muhurat (Highly Auspicious)',
          time: '11:45 AM - 12:35 PM',
          status: 'Excellent',
          action: 'Ideal window to send marriage proposals, initiate first secure chats, or accept interests.',
          icon: 'Sun'
        },
        {
          name: 'Amrit Kaal',
          time: '04:20 PM - 05:55 PM',
          status: 'Auspicious',
          action: 'Excellent period for holding family discussions or finalizing match requirements.',
          icon: 'Moon'
        },
        {
          name: 'Rahu Kaal (Avoid Major Actions)',
          time: '01:30 PM - 03:00 PM',
          status: 'Inauspicious',
          action: 'Avoid initiating first contact or finalizing kundli details during this transit interval.',
          icon: 'Flame'
        }
      ],
      grahaBala: [
        { name: 'Surya (Sun) - Vitality', score: 85, color: 'bg-amber-500', desc: 'Provides clear leadership & family honor.' },
        { name: 'Chandra (Moon) - Emotion', score: 78, color: 'bg-sky-400', desc: 'Indicates warm maternal support & empathy.' },
        { name: 'Guru (Jupiter) - Wisdom', score: 92, color: 'bg-yellow-500', desc: 'Brings high matching intelligence & sub-caste merit.' },
        { name: 'Shukra (Venus) - Harmony', score: 88, color: 'bg-rose-400', desc: 'Sparks powerful matrimonial connection & lifestyle affinity.' },
        { name: 'Mangal (Mars) - Energy', score: manglik === 'Manglik' ? 95 : 62, color: 'bg-orange-600', desc: manglik === 'Manglik' ? 'High intense alignment; seek Manglik balancing.' : 'Balanced energy flow with no marital obstacles.' }
      ]
    };
  };

  if (!ai) {
    return res.json(getFallbackDailyHoroscope());
  }

  try {
    const prompt = `Generate a highly personalized, spiritually elegant, and reassuring Vedic Daily Horoscope matching report for the following matrimonial user:
    - Name: ${profile.name}
    - Gender: ${profile.gender}
    - Birth Date: ${profile.birthDate || "Not filled"}
    - Birth Time: ${profile.birthTime || "Not filled"}
    - Birth Place: ${profile.birthPlace || "Not filled"}
    - Caste/Community: ${profile.caste || "Not filled"}
    - Rashi (Moon Sign): ${profile.rashi || "Virgo (Kanya)"}
    - Nakshatra: ${profile.nakshatra || "Chitra"}
    - Gotra: ${profile.gotra || "Vashishta"}
    - Profession: ${profile.profession || "Not specified"}
    - Salary/Income: ${profile.salary || "Not specified"}
    - Dietary Preference: ${profile.diet || "Veg"}
    - Manglik Status: ${profile.manglik || "Non-Manglik"}
    - Location: ${profile.location?.city || "Not filled"}, ${profile.location?.state || "Not filled"}

    Provide custom Vedic insights for today that feel highly authentic and precise. Generate:
    1. Lagna (Ascendant) detail with element and ruler.
    2. A comprehensive evaluation of the Birth Chart (Lagna Kundli) relating their profession (${profile.profession}) and planetary aspects, plus a final green/favorable verdict.
    3. A custom "Love & Matrimonial Compatibility" advice section referencing their dietary pref (${profile.diet}) and Manglik status (${profile.manglik}).
    4. A "Career & Wealth Transit" report referencing their profession (${profile.profession}) and salary (${profile.salary}), plus an effective Vedic remedy.
    5. Three personalized Shubh Muhurats (Abhijit Muhurat, Amrit Kaal, Rahu Kaal) with customized active times and specific recommendations of what they should or should not do today regarding matrimony.
    6. Score values (0-100) for five major Vedic planetary indicators (Surya, Chandra, Guru, Shukra, Mangal) with short descriptions explaining how they currently assist or affect matching.

    Return the result as clean JSON matching the target schema. Make the language warm, encouraging, sophisticated, and filled with authentic astrological vocabulary.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master Vedic Astrologer, Jyotish scholar, and matrimonial coach. You draft highly custom, encouraging, elegant, and culturally rich daily horoscopes and planetary strengths. Always return output in structural JSON format adhering strictly to the response schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["lagna", "chartSummary", "loveInsight", "careerInsight", "muhurats", "grahaBala"],
          properties: {
            lagna: {
              type: Type.OBJECT,
              required: ["name", "ruler", "element"],
              properties: {
                name: { type: Type.STRING, description: "e.g. Kanya (Virgo) or Simha (Leo)" },
                ruler: { type: Type.STRING, description: "e.g. Mercury, Sun, Mars" },
                element: { type: Type.STRING, description: "Fire, Earth, Air, or Water" }
              }
            },
            chartSummary: {
              type: Type.OBJECT,
              required: ["evaluation", "verdict"],
              properties: {
                evaluation: { type: Type.STRING, description: "Detailed birth chart evaluation paragraph (2-3 sentences)" },
                verdict: { type: Type.STRING, description: "Verdict or astrological green-light advice regarding matches" }
              }
            },
            loveInsight: {
              type: Type.OBJECT,
              required: ["title", "general", "manglikAdvice", "bestMatchCastes", "recommendation"],
              properties: {
                title: { type: Type.STRING },
                general: { type: Type.STRING, description: "General compatibility outlook based on current Gochara transits" },
                manglikAdvice: { type: Type.STRING, description: "Tailored advice regarding Manglik status" },
                bestMatchCastes: { type: Type.STRING, description: "Best matches based on sub-castes/clans" },
                recommendation: { type: Type.STRING, description: "Practical recommendation for matchmaking today" }
              }
            },
            careerInsight: {
              type: Type.OBJECT,
              required: ["title", "general", "wealth", "remedy"],
              properties: {
                title: { type: Type.STRING },
                general: { type: Type.STRING, description: "Astrological career transit report" },
                wealth: { type: Type.STRING, description: "Financial and family status outlook" },
                remedy: { type: Type.STRING, description: "Daily Vedic remedy to clear blocks (e.g. Surya Arghya, ghee diya)" }
              }
            },
            muhurats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "time", "status", "action", "icon"],
                properties: {
                  name: { type: Type.STRING, description: "Muhurat name (e.g. Abhijit Muhurat)" },
                  time: { type: Type.STRING, description: "e.g. 11:45 AM - 12:35 PM" },
                  status: { type: Type.STRING, description: "Excellent, Auspicious, or Inauspicious" },
                  action: { type: Type.STRING, description: "Practical instructions for the matrimonial search" },
                  icon: { type: Type.STRING, enum: ["Sun", "Moon", "Flame"], description: "Visual icon style tag" }
                }
              }
            },
            grahaBala: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "score", "color", "desc"],
                properties: {
                  name: { type: Type.STRING, description: "Planet name (e.g. Surya (Sun))" },
                  score: { type: Type.INTEGER, description: "Strength score from 0 to 100" },
                  color: { type: Type.STRING, description: "bg-color class: e.g. bg-amber-500, bg-sky-400, bg-yellow-500, bg-rose-400, bg-orange-600" },
                  desc: { type: Type.STRING, description: "Brief impact description" }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Daily Horoscope API error:", error);
    res.json(getFallbackDailyHoroscope());
  }
});

export default router;
