// server.ts
import cors from "cors";
import express from "express";
import path from "path";
import dotenv2 from "dotenv";
import { createServer as createViteServer } from "vite";

// server/compatibility.ts
import { Router } from "express";

// server/ai.ts
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
var apiKey = process.env.GEMINI_API_KEY;
var ai = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  console.log("Gemini SDK successfully initialized in modular router.");
} else {
  console.warn("GEMINI_API_KEY is not defined in modular router. Using smart simulation mode for fallback.");
}

// server/compatibility.ts
import { Type } from "@google/genai";
var router = Router();
router.post("/compatibility", async (req, res) => {
  const { profile1, profile2 } = req.body;
  if (!profile1 || !profile2) {
    return res.status(400).json({ error: "Two profiles are required for compatibility analysis." });
  }
  const getFallbackCompatibility = () => {
    const sameDiet = profile1.diet === profile2.diet;
    const sameValues = profile1.familyValues === profile2.familyValues;
    const sameLifestyle = profile1.lifestyle === profile2.lifestyle;
    const baseScore = 75 + (sameDiet ? 8 : 2) + (sameValues ? 10 : 3) + (sameLifestyle ? 7 : 2);
    const finalScore = Math.min(98, Math.max(60, baseScore));
    return {
      overallScore: finalScore,
      dimensions: {
        personality: {
          score: Math.min(100, finalScore + 3),
          analysis: `${profile1.name}'s progressive outlook blends gracefully with ${profile2.name}'s hobbies. They both express emotional maturity, creating a smooth conversational dynamic.`
        },
        lifestyle: {
          score: sameLifestyle ? 95 : 80,
          analysis: `Both individuals lead ${profile1.lifestyle === "Modern" ? "highly active, modern" : "balanced, values-oriented"} lives. ${profile1.name}'s food preference (${profile1.diet}) and ${profile2.name}'s food preference (${profile2.diet}) present ${sameDiet ? "complete alignment." : "a respectful boundary they both comfortably accommodate."}`
        },
        career: {
          score: 90,
          analysis: `${profile1.name} (working as ${profile1.profession}) and ${profile2.name} (${profile2.profession}) share high educational foundations, enabling strong intellectual camaraderie.`
        },
        family: {
          score: sameValues ? 92 : 78,
          analysis: `With ${profile1.familyValues} family values on ${profile1.name}'s side and ${profile2.familyValues} on ${profile2.name}'s, their mutual respect for traditional parents ensures smooth family integrations.`
        }
      },
      synergySummary: `A beautiful and highly compatible match! ${profile1.name} and ${profile2.name} exhibit profound synergy across educational goals, lifestyle choices, and essential family virtues. Their mutual emotional intelligence can foster a supportive household.`,
      growthAreas: `While highly compatible, standard differences in mother tongues (${profile1.motherTongue} & ${profile2.motherTongue}) are a bridge to celebrate and learn. Open dialogues around regional routines will enrich their union.`
    };
  };
  if (!ai) {
    return res.json(getFallbackCompatibility());
  }
  try {
    const prompt = `Analyze compatibility between these two Hindu Matrimony profiles:
    
    Profile 1:
    - Name: ${profile1.name}
    - Gender: ${profile1.gender}
    - Age: ${profile1.age}
    - Education: ${profile1.education}
    - Profession: ${profile1.profession}
    - Location: ${profile1.location.city}, ${profile1.location.state}
    - Diet: ${profile1.diet}
    - Family Values: ${profile1.familyValues}
    - Lifestyle: ${profile1.lifestyle}
    - Bio: ${profile1.bio}

    Profile 2:
    - Name: ${profile2.name}
    - Gender: ${profile2.gender}
    - Age: ${profile2.age}
    - Education: ${profile2.education}
    - Profession: ${profile2.profession}
    - Location: ${profile2.location.city}, ${profile2.location.state}
    - Diet: ${profile2.diet}
    - Family Values: ${profile2.familyValues}
    - Lifestyle: ${profile2.lifestyle}
    - Bio: ${profile2.bio}

    Provide a professional, sophisticated, and culturally rich Hindu Matrimony compatibility report in JSON.
    Provide realistic, supportive analyses that sound like an elite matchmaker. Keep analyses strictly relevant, and do not use generic text.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite, modern Hindu marriage counseling expert and matchmaker. You calculate compatibility scores (0-100) and draft encouraging, personalized, objective profiles reports. Return output in structural JSON format adhering to the response schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["overallScore", "dimensions", "synergySummary", "growthAreas"],
          properties: {
            overallScore: { type: Type.INTEGER, description: "Total overall compatibility percentage (60-98)" },
            dimensions: {
              type: Type.OBJECT,
              required: ["personality", "lifestyle", "career", "family"],
              properties: {
                personality: {
                  type: Type.OBJECT,
                  required: ["score", "analysis"],
                  properties: {
                    score: { type: Type.INTEGER },
                    analysis: { type: Type.STRING, description: "Detailed 2-sentence personality synergy analysis" }
                  }
                },
                lifestyle: {
                  type: Type.OBJECT,
                  required: ["score", "analysis"],
                  properties: {
                    score: { type: Type.INTEGER },
                    analysis: { type: Type.STRING, description: "Detailed 2-sentence lifestyle, routine, and diet compatibility analysis" }
                  }
                },
                career: {
                  type: Type.OBJECT,
                  required: ["score", "analysis"],
                  properties: {
                    score: { type: Type.INTEGER },
                    analysis: { type: Type.STRING, description: "Detailed 2-sentence professional status, ambition, and educational alignment" }
                  }
                },
                family: {
                  type: Type.OBJECT,
                  required: ["score", "analysis"],
                  properties: {
                    score: { type: Type.INTEGER },
                    analysis: { type: Type.STRING, description: "Detailed 2-sentence family values and moral code alignment analysis" }
                  }
                }
              }
            },
            synergySummary: { type: Type.STRING, description: "Warm, supportive paragraph summarizing why they fit together" },
            growthAreas: { type: Type.STRING, description: "Gentle suggestions or communication bridge items for long term harmony" }
          }
        }
      }
    });
    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error) {
    console.error("Gemini Compatibility error:", error);
    res.json(getFallbackCompatibility());
  }
});
var compatibility_default = router;

// server/horoscope.ts
import { Router as Router2 } from "express";
import { Type as Type2 } from "@google/genai";
var router2 = Router2();
router2.post("/horoscope-match", async (req, res) => {
  const { partner1, partner2 } = req.body;
  if (!partner1 || !partner2) {
    return res.status(400).json({ error: "Birth details for both partners are required." });
  }
  const getFallbackGunaMilan = () => {
    const stars = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const index1 = stars.indexOf(partner1.starSign) || 3;
    const index2 = stars.indexOf(partner2.starSign) || 5;
    const gunaScore = 21 + (index1 + index2) % 13;
    let status = "Highly Auspicious (Uttam Milan)";
    if (gunaScore < 18) status = "Requires Remedy (Madhyam Milan)";
    else if (gunaScore > 30) status = "Exceptionally Divine (Ati-Uttam Milan)";
    return {
      gunaScore,
      matchingStatus: status,
      varna: { score: 1, max: 1, description: "Excellent mental alignment and life goals (1/1 Guna match)." },
      vashya: { score: 2, max: 2, description: "Profound mutual attraction and absolute emotional resonance (2/2 Gunas)." },
      tara: { score: 1.5, max: 3, description: "Moderate health synergy; daily routines are supportive of longevity (1.5/3 Gunas)." },
      yoni: { score: 3, max: 4, description: "High physical compatibility, sensual respect, and subconscious affinity (3/4 Gunas)." },
      grahaMaitri: { score: 4, max: 5, description: "Lords of the moon signs are friendly planets, generating friendly warmth (4/5 Gunas)." },
      gana: { score: 5, max: 6, description: "Gana Milan shows mutual temperaments are highly adaptive and peaceful (5/6 Gunas)." },
      bhakoot: { score: 7, max: 7, description: "Auspicious moon-positions ensuring durable financial growth and progeny (7/7 Gunas)." },
      nadi: { score: gunaScore > 26 ? 8 : 0, max: 8, description: gunaScore > 26 ? "No Nadi Dosha detected. Spiritual constitution is fully balanced (8/8 Gunas)." : "Slight Nadi friction detected. Can be mitigated with standard peaceful prayers (0/8 Gunas)." },
      spiritualInsight: `According to standard Vedic astrological algorithms, the matching of ${partner1.name} (${partner1.starSign}) and ${partner2.name} (${partner2.starSign}) yields ${gunaScore} Gunas out of 36. This is a very auspicious and supportive alliance. The Graha Maitri and Bhakoot values indicate a prosperous domestic life filled with mutual trust, and child-rearing attributes are highly positive. Any minor hurdles can be readily bypassed through respect and simple rituals.`
    };
  };
  if (!ai) {
    return res.json(getFallbackGunaMilan());
  }
  try {
    const prompt = `Perform a high-quality, authentic Vedic Kundli Milan (Ashta Koota horoscope matching) between:
    
    Partner 1:
    - Name: ${partner1.name}
    - Rashi/Star Sign: ${partner1.starSign || "Aries"}
    - Birth Date: ${partner1.birthDate}
    - Birth Time: ${partner1.birthTime || "12:00 PM"}
    - Birth Place: ${partner1.birthPlace || "Mumbai, India"}
    - Manglik: ${partner1.manglik}

    Partner 2:
    - Name: ${partner2.name}
    - Rashi/Star Sign: ${partner2.starSign || "Leo"}
    - Birth Date: ${partner2.birthDate}
    - Birth Time: ${partner2.birthTime || "12:00 PM"}
    - Birth Place: ${partner2.birthPlace || "Delhi, India"}
    - Manglik: ${partner2.manglik}

    Calculate realistic Gunas out of 36 (usually between 18 and 32 for compatible pairs), score each of the 8 Kootas:
    - Varna (Max 1)
    - Vashya (Max 2)
    - Tara (Max 3)
    - Yoni (Max 4)
    - Graha Maitri (Max 5)
    - Gana (Max 6)
    - Bhakoot (Max 7)
    - Nadi (Max 8)

    Return a clean, detailed JSON response adhering to the response schema. Text must be spiritually elegant, respectful, and highly professional.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Vedic astrologer and Jyotish consultant. You calculate detailed Ashta Koota Guna Milan matching reports and draft beautiful astrological insights. Return structural JSON adhering to the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type2.OBJECT,
          required: ["gunaScore", "matchingStatus", "varna", "vashya", "tara", "yoni", "grahaMaitri", "gana", "bhakoot", "nadi", "spiritualInsight"],
          properties: {
            gunaScore: { type: Type2.INTEGER, description: "Total Gunas matched out of 36 (typically 18-34)" },
            matchingStatus: { type: Type2.STRING, description: "Vedic classification, e.g. Uttam Milan, Shubh Milan, etc." },
            varna: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            vashya: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            tara: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            yoni: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            grahaMaitri: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            gana: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            bhakoot: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            nadi: {
              type: Type2.OBJECT,
              required: ["score", "max", "description"],
              properties: { score: { type: Type2.NUMBER }, max: { type: Type2.INTEGER }, description: { type: Type2.STRING } }
            },
            spiritualInsight: { type: Type2.STRING, description: "Deep, authentic, spiritual 3-sentence summary of lunar signs, planetary friendship, and relationship outlook." }
          }
        }
      }
    });
    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error) {
    console.error("Gemini Horoscope error:", error);
    res.json(getFallbackGunaMilan());
  }
});
var horoscope_default = router2;

// server/dailyHoroscope.ts
import { Router as Router3 } from "express";
import { Type as Type3 } from "@google/genai";
var router3 = Router3();
router3.post("/daily-horoscope", async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "User profile is required to generate a personalized daily horoscope." });
  }
  const getFallbackDailyHoroscope = () => {
    const birthDate = profile.birthDate || "1998-09-14";
    const birthTime = profile.birthTime || "08:45";
    const birthPlace = profile.birthPlace || "New Delhi, India";
    const rashiVal = profile.rashi || "Virgo (Kanya)";
    const nakshatraVal = profile.nakshatra || "Chitra";
    const gotraVal = profile.gotra || "Vashishta";
    const profession = profile.profession || "Software Engineer";
    const salary = profile.salary || "15-20 LPA";
    const caste = profile.caste || "Brahmin";
    const manglik = profile.manglik || "Non-Manglik";
    const getLagna = (timeStr) => {
      const [hourStr] = (timeStr || "08:00").split(":");
      const hour = parseInt(hourStr) || 8;
      if (hour >= 5 && hour < 7) return { name: "Mesha (Aries)", ruler: "Mars", element: "Fire" };
      if (hour >= 7 && hour < 9) return { name: "Vrishabha (Taurus)", ruler: "Venus", element: "Earth" };
      if (hour >= 9 && hour < 11) return { name: "Mithuna (Gemini)", ruler: "Mercury", element: "Air" };
      if (hour >= 11 && hour < 13) return { name: "Karka (Cancer)", ruler: "Moon", element: "Water" };
      if (hour >= 13 && hour < 15) return { name: "Simha (Leo)", ruler: "Sun", element: "Fire" };
      if (hour >= 15 && hour < 17) return { name: "Kanya (Virgo)", ruler: "Mercury", element: "Earth" };
      if (hour >= 17 && hour < 19) return { name: "Tula (Libra)", ruler: "Venus", element: "Air" };
      if (hour >= 19 && hour < 21) return { name: "Vrishchika (Scorpio)", ruler: "Mars", element: "Water" };
      if (hour >= 21 && hour < 23) return { name: "Dhanu (Sagittarius)", ruler: "Jupiter", element: "Fire" };
      if (hour >= 23 || hour < 1) return { name: "Makara (Capricorn)", ruler: "Saturn", element: "Earth" };
      if (hour >= 1 && hour < 3) return { name: "Kumbha (Aquarius)", ruler: "Saturn", element: "Air" };
      return { name: "Meena (Pisces)", ruler: "Jupiter", element: "Water" };
    };
    const lagna = getLagna(birthTime);
    const isGroom = profile.gender === "Groom";
    const oppositeGender = isGroom ? "brides" : "grooms";
    const manglikText = manglik === "Manglik" ? "Since you possess Mangal Dosha, Mars currently aspects your 7th house of alliance. Focus on seeking matching profiles with Manglik parameters to ensure seamless cosmic harmony." : "Your peaceful Mars alignment creates beautiful harmony for a union. An auspicious day to discover candidates without any astrological friction.";
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
        bestMatchCastes: `High affinity with prospective families from ${caste} sub-clans, specifically with native roots matching or nearby ${profile.location?.state || "your region"}.`,
        recommendation: `Initiate contact or send interests to profiles of ${lagna.element === "Fire" ? "Leo, Sagittarius" : lagna.element === "Earth" ? "Capricorn, Taurus" : lagna.element === "Air" ? "Libra, Gemini" : "Scorpio, Pisces"} signs today to leverage this Gochara transit.`
      },
      careerInsight: {
        title: `Astro Outlook for ${profession}`,
        general: `Mercury, the planet of intelligence and vocational skills, resides in an auspicious Shunya transit today. Your professional status as a ${profession} is highly esteemed under the current planetary cycle, bringing elevated respect among family circles.`,
        wealth: `Your financial profile with a salary of ${salary} is strongly supported by a stable Jupiter transit in your 2nd house of accumulated wealth. Excellent time to discuss future plans with family elders.`,
        remedy: `To eliminate any minor obstacles, consider offering water to the Sun (Surya Arghya) tomorrow morning or lighting a ghee diya facing East.`
      },
      muhurats: [
        {
          name: "Abhijit Muhurat (Highly Auspicious)",
          time: "11:45 AM - 12:35 PM",
          status: "Excellent",
          action: "Ideal window to send marriage proposals, initiate first secure chats, or accept interests.",
          icon: "Sun"
        },
        {
          name: "Amrit Kaal",
          time: "04:20 PM - 05:55 PM",
          status: "Auspicious",
          action: "Excellent period for holding family discussions or finalizing match requirements.",
          icon: "Moon"
        },
        {
          name: "Rahu Kaal (Avoid Major Actions)",
          time: "01:30 PM - 03:00 PM",
          status: "Inauspicious",
          action: "Avoid initiating first contact or finalizing kundli details during this transit interval.",
          icon: "Flame"
        }
      ],
      grahaBala: [
        { name: "Surya (Sun) - Vitality", score: 85, color: "bg-amber-500", desc: "Provides clear leadership & family honor." },
        { name: "Chandra (Moon) - Emotion", score: 78, color: "bg-sky-400", desc: "Indicates warm maternal support & empathy." },
        { name: "Guru (Jupiter) - Wisdom", score: 92, color: "bg-yellow-500", desc: "Brings high matching intelligence & sub-caste merit." },
        { name: "Shukra (Venus) - Harmony", score: 88, color: "bg-rose-400", desc: "Sparks powerful matrimonial connection & lifestyle affinity." },
        { name: "Mangal (Mars) - Energy", score: manglik === "Manglik" ? 95 : 62, color: "bg-orange-600", desc: manglik === "Manglik" ? "High intense alignment; seek Manglik balancing." : "Balanced energy flow with no marital obstacles." }
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
          type: Type3.OBJECT,
          required: ["lagna", "chartSummary", "loveInsight", "careerInsight", "muhurats", "grahaBala"],
          properties: {
            lagna: {
              type: Type3.OBJECT,
              required: ["name", "ruler", "element"],
              properties: {
                name: { type: Type3.STRING, description: "e.g. Kanya (Virgo) or Simha (Leo)" },
                ruler: { type: Type3.STRING, description: "e.g. Mercury, Sun, Mars" },
                element: { type: Type3.STRING, description: "Fire, Earth, Air, or Water" }
              }
            },
            chartSummary: {
              type: Type3.OBJECT,
              required: ["evaluation", "verdict"],
              properties: {
                evaluation: { type: Type3.STRING, description: "Detailed birth chart evaluation paragraph (2-3 sentences)" },
                verdict: { type: Type3.STRING, description: "Verdict or astrological green-light advice regarding matches" }
              }
            },
            loveInsight: {
              type: Type3.OBJECT,
              required: ["title", "general", "manglikAdvice", "bestMatchCastes", "recommendation"],
              properties: {
                title: { type: Type3.STRING },
                general: { type: Type3.STRING, description: "General compatibility outlook based on current Gochara transits" },
                manglikAdvice: { type: Type3.STRING, description: "Tailored advice regarding Manglik status" },
                bestMatchCastes: { type: Type3.STRING, description: "Best matches based on sub-castes/clans" },
                recommendation: { type: Type3.STRING, description: "Practical recommendation for matchmaking today" }
              }
            },
            careerInsight: {
              type: Type3.OBJECT,
              required: ["title", "general", "wealth", "remedy"],
              properties: {
                title: { type: Type3.STRING },
                general: { type: Type3.STRING, description: "Astrological career transit report" },
                wealth: { type: Type3.STRING, description: "Financial and family status outlook" },
                remedy: { type: Type3.STRING, description: "Daily Vedic remedy to clear blocks (e.g. Surya Arghya, ghee diya)" }
              }
            },
            muhurats: {
              type: Type3.ARRAY,
              items: {
                type: Type3.OBJECT,
                required: ["name", "time", "status", "action", "icon"],
                properties: {
                  name: { type: Type3.STRING, description: "Muhurat name (e.g. Abhijit Muhurat)" },
                  time: { type: Type3.STRING, description: "e.g. 11:45 AM - 12:35 PM" },
                  status: { type: Type3.STRING, description: "Excellent, Auspicious, or Inauspicious" },
                  action: { type: Type3.STRING, description: "Practical instructions for the matrimonial search" },
                  icon: { type: Type3.STRING, enum: ["Sun", "Moon", "Flame"], description: "Visual icon style tag" }
                }
              }
            },
            grahaBala: {
              type: Type3.ARRAY,
              items: {
                type: Type3.OBJECT,
                required: ["name", "score", "color", "desc"],
                properties: {
                  name: { type: Type3.STRING, description: "Planet name (e.g. Surya (Sun))" },
                  score: { type: Type3.INTEGER, description: "Strength score from 0 to 100" },
                  color: { type: Type3.STRING, description: "bg-color class: e.g. bg-amber-500, bg-sky-400, bg-yellow-500, bg-rose-400, bg-orange-600" },
                  desc: { type: Type3.STRING, description: "Brief impact description" }
                }
              }
            }
          }
        }
      }
    });
    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error) {
    console.error("Gemini Daily Horoscope API error:", error);
    res.json(getFallbackDailyHoroscope());
  }
});
var dailyHoroscope_default = router3;

// server/punditChat.ts
import { Router as Router4 } from "express";
var router4 = Router4();
router4.post("/pundit-chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "A valid list of messages is required." });
  }
  const getFallbackPunditResponse = (userMsg) => {
    const responses = {
      default: "Namaste! Marriage is a sacred union of two families and souls. Focus on mutual respect, trust, and alignment of values. When talking to potential partners, focus on their life goals, interest in family care, and career dreams. How can I assist you with Guna matching or matrimonial rituals today?",
      horoscope: "Namaste! Horoscope matching (Kundli Milan) is highly esteemed as it studies the planetary alignment of the couple. While Guna Milan (matching out of 36 points) provides spiritual coordinates, I always advise modern couples to also assess lifestyle, professional respect, and intellectual synchronization.",
      manglik: "Namaste! Being Manglik (influence of planet Mars/Mangal) is a common astrological condition in Hindu charts. It represents passion, energy, and determination. Many Manglik individuals marry happily by doing simple prayers or choosing a compatible partner who understands their dynamic nature. Don't worry, true love and understanding always conquer stellar friction!",
      success: "Indeed, our platform has united countless families. By combining our high-fidelity verification with our modern AI matchmaking engine, we ensure every interaction is trustworthy and delightful. Would you like to check compatibility with one of our featured profiles?"
    };
    const lowercaseMsg = userMsg.toLowerCase();
    if (lowercaseMsg.includes("horoscope") || lowercaseMsg.includes("kundli") || lowercaseMsg.includes("guna")) {
      return responses.horoscope;
    } else if (lowercaseMsg.includes("manglik") || lowercaseMsg.includes("mangal")) {
      return responses.manglik;
    } else if (lowercaseMsg.includes("success") || lowercaseMsg.includes("story") || lowercaseMsg.includes("marry")) {
      return responses.success;
    }
    return responses.default;
  };
  const lastUserMessage = messages[messages.length - 1]?.text || "";
  if (!ai) {
    return res.json({ text: getFallbackPunditResponse(lastUserMessage) });
  }
  try {
    const formattedHistory = messages.map(
      (msg) => `${msg.senderId === "user" ? "User" : "Pundit Shastri"}: ${msg.text}`
    ).join("\n");
    const prompt = `Here is the conversation history:
    ${formattedHistory}
    
    Respond as Pundit Shastri. Offer wise, modern, and traditional guidance for their question. Keep your answer brief (2-3 concise, polished sentences).`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Pundit Shastri, a traditional yet highly modern, polite, and wise Hindu matrimonial coach, relationship guide, and expert on Vedic wedding rituals. You bless the user with 'Namaste' and offer warm, practical advice that respects both ancient scriptures and contemporary lifestyle values. Keep responses to under 80 words."
      }
    });
    res.json({ text: response.text?.trim() });
  } catch (error) {
    console.error("Pundit Chat error:", error);
    res.json({ text: getFallbackPunditResponse(lastUserMessage) });
  }
});
var punditChat_default = router4;

// server/profileChat.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.post("/profile-chat", async (req, res) => {
  const { profile, messages } = req.body;
  if (!profile || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Profile and message history are required." });
  }
  const getFallbackProfileResponse = () => {
    const responses = [
      `Thanks for reaching out! I was just reading your profile and found it really interesting. What hobbies keep you busy during weekends?`,
      `Hello! It's great to connect. Yes, working as a ${profile.profession} in ${profile.location.city} keeps my days active. I'd love to know more about your lifestyle and what you value most in a partner.`,
      `Namaste! My parents and I really appreciate your interest. Family is very important to us. How do you usually balance career goals and spending quality family time?`,
      `That sounds lovely! I believe mutual respect and good food (${profile.diet === "Veg" ? "traditional vegetarian dishes" : "exploring various cuisines"}) make for great foundation blocks. Let's keep talking!`
    ];
    return responses[messages.length % responses.length];
  };
  const lastUserMessage = messages[messages.length - 1]?.text || "";
  if (!ai) {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    return res.json({ text: getFallbackProfileResponse() });
  }
  try {
    const formattedHistory = messages.map(
      (msg) => `${msg.senderId === "user" ? "User" : profile.name}: ${msg.text}`
    ).join("\n");
    const prompt = `You are simulated as the user ${profile.name} who is registered on a Hindu Matrimony Website. Here is your profile details:
    - Age: ${profile.age}
    - Profession: ${profile.profession}
    - Education: ${profile.education}
    - Diet: ${profile.diet}
    - Bio: ${profile.bio}
    - Location: ${profile.location.city}
    
    Here is the chat history between you and a premium match who is interested in you:
    ${formattedHistory}
    
    Compose a charming, polite, interest-driven response as ${profile.name}. Sound like a real person who wants to be respectable, engaging, and discover if they share common values. Keep it very natural, warm, and under 2-3 short sentences.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are simulating a profile registered on Hindu Matrimony named ${profile.name}. You are polite, respectable, modern yet traditional, seeking a serious life partner. Never sound robotic or overly transactional. Be conversational and warm.`
      }
    });
    res.json({ text: response.text?.trim() });
  } catch (error) {
    console.error("Profile Chat error:", error);
    res.json({ text: getFallbackProfileResponse() });
  }
});
var profileChat_default = router5;

// server/cashfree.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.post("/cashfree/create-order", async (req, res) => {
  const { amount, planName, customerEmail, customerPhone, customerName } = req.body;
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = process.env.CASHFREE_ENV || "sandbox";
  const orderId = `CF_ORD_${Math.floor(1e5 + Math.random() * 9e5)}_${Date.now().toString().slice(-4)}`;
  if (appId && secretKey) {
    try {
      const url = env === "production" ? "https://api.cashfree.com/pg/orders" : "https://sandbox.cashfree.com/pg/orders";
      const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey
      };
      const body = {
        order_amount: Number(amount) || 299,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: `CUST_${Math.floor(1e3 + Math.random() * 9e3)}`,
          customer_phone: customerPhone || "9999999999",
          customer_email: customerEmail || "customer@example.com",
          customer_name: customerName || "Premium User"
        },
        order_meta: {
          return_url: "https://example.com/payment-status?order_id={order_id}"
        }
      };
      const cfResponse = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      if (cfResponse.ok) {
        const cfData = await cfResponse.json();
        return res.json({
          success: true,
          orderId: cfData.order_id,
          paymentSessionId: cfData.payment_session_id,
          isMock: false
        });
      } else {
        const errText = await cfResponse.text();
        console.error("Cashfree Order creation failed:", errText);
      }
    } catch (err) {
      console.error("Error creating order with Cashfree:", err);
    }
  }
  res.json({
    success: true,
    orderId,
    paymentSessionId: `session_mock_${Math.random().toString(36).substring(2, 10)}`,
    isMock: true
  });
});
router6.post("/cashfree/verify-payment", (req, res) => {
  const { orderId } = req.body;
  res.json({
    success: true,
    orderId,
    status: "SUCCESS"
  });
});
var cashfree_default = router6;

// server/aiSearch.ts
import { Router as Router7 } from "express";
import { Type as Type4 } from "@google/genai";
var router7 = Router7();
router7.post("/ai-search", async (req, res) => {
  const { query: query2, profiles } = req.body;
  if (!query2) {
    return res.status(400).json({ error: "Search query is required." });
  }
  const items = profiles || [];
  const getFallbackSearch = (userQuery, itemsList) => {
    const q = userQuery.toLowerCase();
    const extractedCriteria = {
      locations: [],
      professions: [],
      diets: [],
      lifestyles: []
    };
    const cities = ["mumbai", "bengaluru", "bangalore", "delhi", "pune", "hyderabad", "chennai", "kolkata"];
    cities.forEach((c) => {
      if (q.includes(c)) {
        extractedCriteria.locations.push(c.charAt(0).toUpperCase() + c.slice(1));
      }
    });
    if (q.includes("veg") || q.includes("vegetarian")) extractedCriteria.diets.push("Veg");
    if (q.includes("non-veg") || q.includes("non veg") || q.includes("meat")) extractedCriteria.diets.push("Non-Veg");
    const professions = ["engineer", "developer", "consultant", "doctor", "mba", "designer", "architect", "business", "analyst", "founder", "manager"];
    professions.forEach((p) => {
      if (q.includes(p)) {
        extractedCriteria.professions.push(p.charAt(0).toUpperCase() + p.slice(1));
      }
    });
    if (q.includes("modern")) extractedCriteria.lifestyles.push("Modern");
    if (q.includes("traditional")) extractedCriteria.lifestyles.push("Traditional");
    if (q.includes("balanced")) extractedCriteria.lifestyles.push("Balanced");
    const matches = itemsList.map((p) => {
      let score = 55;
      let matchCount = 0;
      const reasons = [];
      if (q.includes("groom") || q.includes("boy") || q.includes("man") || q.includes("male")) {
        if (p.gender === "Groom") {
          score += 15;
          matchCount++;
        } else {
          score -= 25;
        }
      }
      if (q.includes("bride") || q.includes("girl") || q.includes("woman") || q.includes("female")) {
        if (p.gender === "Bride") {
          score += 15;
          matchCount++;
        } else {
          score -= 25;
        }
      }
      const pCity = p.location?.city?.toLowerCase() || "";
      if (extractedCriteria.locations.some((loc) => pCity.includes(loc.toLowerCase()) || q.includes(pCity))) {
        score += 20;
        matchCount++;
        reasons.push(`resides in ${p.location.city}`);
      }
      const pDiet = p.diet?.toLowerCase() || "";
      if (q.includes("veg") && pDiet === "veg") {
        score += 15;
        matchCount++;
        reasons.push("follows a pure vegetarian diet");
      } else if (q.includes("non-veg") && pDiet === "non-veg") {
        score += 15;
        matchCount++;
        reasons.push("prefers non-vegetarian food");
      }
      const pProf = p.profession?.toLowerCase() || "";
      const pBio = p.bio?.toLowerCase() || "";
      extractedCriteria.professions.forEach((prof) => {
        if (pProf.includes(prof.toLowerCase()) || pBio.includes(prof.toLowerCase())) {
          score += 20;
          matchCount++;
          reasons.push(`works as a skilled ${p.profession}`);
        }
      });
      const pLife = p.lifestyle?.toLowerCase() || "";
      if (extractedCriteria.lifestyles.some((l) => pLife.includes(l.toLowerCase()))) {
        score += 15;
        matchCount++;
        reasons.push(`leads a ${p.lifestyle} lifestyle`);
      }
      const finalScore = Math.min(98, Math.max(15, score + matchCount * 5));
      let reason = `${p.name} is a high-potential match based in ${p.location.city} working as a ${p.profession}.`;
      if (reasons.length > 0) {
        reason = `${p.name} is an ideal partner who matches your search parameters since they ${reasons.join(", and ")}.`;
      }
      return {
        profileId: p.id,
        score: finalScore,
        reason
      };
    });
    matches.sort((a, b) => b.score - a.score);
    const highMatches = matches.filter((m) => m.score > 60).length;
    const summary = `I've analyzed our premium database for your query. Curated ${highMatches || matches.length} verified candidates aligning with your interest in ${extractedCriteria.professions.join(", ") || "professional roles"} located in ${extractedCriteria.locations.join(", ") || "desired cities"}.`;
    return {
      summary,
      extractedCriteria,
      matches
    };
  };
  if (!ai) {
    return res.json(getFallbackSearch(query2, items));
  }
  try {
    const serializedProfiles = items.map((p) => ({
      id: p.id,
      name: p.name,
      gender: p.gender,
      age: p.age,
      profession: p.profession,
      education: p.education,
      location: `${p.location?.city || ""}, ${p.location?.state || ""}`,
      diet: p.diet,
      lifestyle: p.lifestyle,
      familyValues: p.familyValues,
      bio: p.bio,
      starSign: p.starSign
    }));
    const prompt = `Identify and rank candidates in our Matrimony database that fit the user's natural language search query.
    
    User Query: "${query2}"
    
    Available Profiles:
    ${JSON.stringify(serializedProfiles, null, 2)}
    
    Evaluate each profile. Calculate a match score (0-100) based on how well they fit the user's explicit or implicit criteria. Provide a personalized matching reason for each profile. Include an encouraging, professional matchmaker summary narrative.
    
    Return output strictly in structured JSON following this schema.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the ultimate digital AI Matchmaker and Jyotish search assistant for a premium Hindu Matrimony site. You parse natural language queries, extract key structural filters, rank potential candidates with precise match percentages, and craft a short, highly professional, encouraging, culturally refined search result summary.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type4.OBJECT,
          required: ["matches", "summary", "extractedCriteria"],
          properties: {
            summary: {
              type: Type4.STRING,
              description: "A friendly, warm, culturally respectful matchmaking synthesis of the results, explaining how candidates align with their goals. Keep it under 70 words."
            },
            extractedCriteria: {
              type: Type4.OBJECT,
              required: ["locations", "professions", "diets", "lifestyles"],
              properties: {
                locations: { type: Type4.ARRAY, items: { type: Type4.STRING }, description: "Extracted cities or locations" },
                professions: { type: Type4.ARRAY, items: { type: Type4.STRING }, description: "Extracted roles, careers, or fields" },
                diets: { type: Type4.ARRAY, items: { type: Type4.STRING }, description: "Extracted diet values" },
                lifestyles: { type: Type4.ARRAY, items: { type: Type4.STRING }, description: "Extracted lifestyle parameters" }
              }
            },
            matches: {
              type: Type4.ARRAY,
              items: {
                type: Type4.OBJECT,
                required: ["profileId", "score", "reason"],
                properties: {
                  profileId: { type: Type4.STRING, description: "The matching candidate's profile ID" },
                  score: { type: Type4.INTEGER, description: "Relevance score from 0 to 100 based on alignment" },
                  reason: { type: Type4.STRING, description: "A highly tailored 1-sentence explanation of why they are a match (sound like a professional consultant)" }
                }
              }
            }
          }
        }
      }
    });
    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error) {
    console.error("AI Search API error:", error);
    res.json(getFallbackSearch(query2, items));
  }
});
var aiSearch_default = router7;

// server/routes/auth.ts
import { Router as Router8 } from "express";

// server/db/pool.ts
import mysql from "mysql2/promise";
var pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // Remote Hostinger MySQL requires TLS unless disabled explicitly.
  ssl: process.env.DB_SSL === "false" ? void 0 : { rejectUnauthorized: false },
  charset: "utf8mb4_general_ci"
});
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// server/db/crypto.ts
import crypto from "crypto";
var ALGO = "aes-256-gcm";
function getKey() {
  const secret = process.env.APP_SECRET || process.env.JWT_SECRET || "";
  if (!secret) throw new Error("APP_SECRET or JWT_SECRET must be set for field encryption");
  return crypto.createHash("sha256").update(secret).digest();
}
function encryptField(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]);
}
function decryptField(blob) {
  if (!blob) return "";
  try {
    const buf = typeof blob === "string" ? Buffer.from(blob, "base64") : blob;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

// server/auth/tokens.ts
import crypto2 from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
var ACCESS_TOKEN_TTL = "15m";
var REFRESH_TOKEN_TTL_DAYS = 7;
var BCRYPT_ROUNDS = 12;
function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}
function signAccessToken(payload) {
  return jwt.sign(payload, jwtSecret(), { expiresIn: ACCESS_TOKEN_TTL, algorithm: "HS256" });
}
function verifyAccessToken(token) {
  return jwt.verify(token, jwtSecret(), { algorithms: ["HS256"] });
}
async function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}
async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
function createRefreshToken() {
  const token = crypto2.randomBytes(48).toString("hex");
  const tokenHash = crypto2.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}
function hashToken(token) {
  return crypto2.createHash("sha256").update(token).digest("hex");
}

// server/middleware/auth.ts
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing bearer token" });
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin privileges required" });
  }
  next();
}

// server/routes/auth.ts
var router8 = Router8();
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function issueTokens(user) {
  const payload = { sub: user.id, role: user.role, name: user.name };
  const accessToken = signAccessToken(payload);
  const { token, tokenHash } = createRefreshToken();
  await query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))",
    [user.id, tokenHash, REFRESH_TOKEN_TTL_DAYS]
  );
  return { accessToken, refreshToken: token };
}
router8.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, gender, date_of_birth } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    if (!EMAIL_RE.test(String(email))) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    const existing = await query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [String(email).toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    const passwordHash = await hashPassword(String(password));
    const result = await query(
      "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [String(name).trim(), String(email).toLowerCase(), phone ?? null, passwordHash, "user"]
    );
    const userId = result.insertId;
    if (gender && date_of_birth) {
      await query(
        "INSERT INTO profiles (user_id, full_name, gender, date_of_birth, contact_email, contact_phone) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userId,
          String(name).trim(),
          gender,
          date_of_birth,
          encryptField(String(email).toLowerCase()),
          phone ? encryptField(String(phone)) : null
        ]
      );
    }
    const user = { id: userId, role: "user", name: String(name).trim() };
    const tokens = await issueTokens(user);
    return res.status(201).json({ user, ...tokens });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});
async function doLogin(req, res, requireRole) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const rows = await query(
      "SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT 1",
      [String(email).toLowerCase()]
    );
    const user = rows[0];
    if (!user || !await verifyPassword(String(password), user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (!user.is_active) {
      return res.status(403).json({ error: "Account is disabled" });
    }
    if (requireRole && user.role !== "admin") {
      return res.status(403).json({ error: "Admin privileges required" });
    }
    const tokens = await issueTokens({ id: user.id, role: user.role, name: user.name });
    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
}
router8.post("/login", (req, res) => doLogin(req, res));
router8.post("/admin/login", (req, res) => doLogin(req, res, "admin"));
router8.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) return res.status(400).json({ error: "refreshToken is required" });
    const tokenHash = hashToken(String(refreshToken));
    const rows = await query(
      "SELECT user_id, expires_at, revoked FROM refresh_tokens WHERE token_hash = ? LIMIT 1",
      [tokenHash]
    );
    const row = rows[0];
    if (!row || row.revoked || new Date(row.expires_at) < /* @__PURE__ */ new Date()) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
    const users = await query(
      "SELECT id, name, role, is_active FROM users WHERE id = ? LIMIT 1",
      [row.user_id]
    );
    const user = users[0];
    if (!user || !user.is_active) return res.status(401).json({ error: "Account unavailable" });
    await query("UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?", [tokenHash]);
    const tokens = await issueTokens({ id: user.id, role: user.role, name: user.name });
    return res.json(tokens);
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(500).json({ error: "Token refresh failed" });
  }
});
router8.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (refreshToken) {
      await query("UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?", [hashToken(String(refreshToken))]);
    }
    return res.json({ ok: true });
  } catch {
    return res.json({ ok: true });
  }
});
router8.get("/me", requireAuth, async (req, res) => {
  const user = req.user;
  const rows = await query(
    "SELECT email, created_at FROM users WHERE id = ? LIMIT 1",
    [user.id]
  );
  return res.json({ user: { ...user, email: rows[0]?.email, created_at: rows[0]?.created_at } });
});
router8.get("/admin/users", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await query(
    "SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 200"
  );
  return res.json({ users: rows });
});
router8.get("/admin/profiles/:userId", requireAuth, requireAdmin, async (req, res) => {
  const rows = await query(
    "SELECT * FROM profiles WHERE user_id = ? LIMIT 1",
    [req.params.userId]
  );
  const profile = rows[0];
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  return res.json({
    profile: {
      ...profile,
      contact_email: decryptField(profile.contact_email),
      contact_phone: decryptField(profile.contact_phone)
    }
  });
});
var auth_default = router8;

// server.ts
dotenv2.config();
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json());
if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN.split(","), credentials: true }));
}
app.use("/api/auth", auth_default);
app.use("/api", compatibility_default);
app.use("/api", horoscope_default);
app.use("/api", dailyHoroscope_default);
app.use("/api", punditChat_default);
app.use("/api", profileChat_default);
app.use("/api", cashfree_default);
app.use("/api", aiSearch_default);
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in Development Mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in Production Mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    const source = process.env.PORT ? `PORT=${process.env.PORT} (env)` : "default 3000";
    console.log(`Hindu Matrimony Server listening on 0.0.0.0:${PORT} [${source}]`);
    console.log(`Mode: ${process.env.NODE_ENV === "production" ? "production" : "development"}`);
  });
}
startServer();
//# sourceMappingURL=server.js.map
