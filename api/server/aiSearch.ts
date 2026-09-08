import { Router } from "express";
import { ai } from "./ai.js";
import { Type } from "@google/genai";

const router = Router();

router.post("/ai-search", async (req, res) => {
  const { query, profiles } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  const items = profiles || [];

  // Local matching engine when Gemini is missing/fails
  const getFallbackSearch = (userQuery: string, itemsList: any[]) => {
    const q = userQuery.toLowerCase();
    
    const extractedCriteria = {
      locations: [] as string[],
      professions: [] as string[],
      diets: [] as string[],
      lifestyles: [] as string[]
    };
    
    const cities = ["mumbai", "bengaluru", "bangalore", "delhi", "pune", "hyderabad", "chennai", "kolkata"];
    cities.forEach(c => {
      if (q.includes(c)) {
        extractedCriteria.locations.push(c.charAt(0).toUpperCase() + c.slice(1));
      }
    });
    
    if (q.includes("veg") || q.includes("vegetarian")) extractedCriteria.diets.push("Veg");
    if (q.includes("non-veg") || q.includes("non veg") || q.includes("meat")) extractedCriteria.diets.push("Non-Veg");
    
    const professions = ["engineer", "developer", "consultant", "doctor", "mba", "designer", "architect", "business", "analyst", "founder", "manager"];
    professions.forEach(p => {
      if (q.includes(p)) {
        extractedCriteria.professions.push(p.charAt(0).toUpperCase() + p.slice(1));
      }
    });

    if (q.includes("modern")) extractedCriteria.lifestyles.push("Modern");
    if (q.includes("traditional")) extractedCriteria.lifestyles.push("Traditional");
    if (q.includes("balanced")) extractedCriteria.lifestyles.push("Balanced");

    const matches = itemsList.map(p => {
      let score = 55;
      let matchCount = 0;
      const reasons: string[] = [];

      if (q.includes("groom") || q.includes("boy") || q.includes("man") || q.includes("male")) {
        if (p.gender === "Groom") { score += 15; matchCount++; }
        else { score -= 25; }
      }
      if (q.includes("bride") || q.includes("girl") || q.includes("woman") || q.includes("female")) {
        if (p.gender === "Bride") { score += 15; matchCount++; }
        else { score -= 25; }
      }

      const pCity = p.location?.city?.toLowerCase() || "";
      if (extractedCriteria.locations.some(loc => pCity.includes(loc.toLowerCase()) || q.includes(pCity))) {
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
      extractedCriteria.professions.forEach(prof => {
        if (pProf.includes(prof.toLowerCase()) || pBio.includes(prof.toLowerCase())) {
          score += 20;
          matchCount++;
          reasons.push(`works as a skilled ${p.profession}`);
        }
      });

      const pLife = p.lifestyle?.toLowerCase() || "";
      if (extractedCriteria.lifestyles.some(l => pLife.includes(l.toLowerCase()))) {
        score += 15;
        matchCount++;
        reasons.push(`leads a ${p.lifestyle} lifestyle`);
      }

      const finalScore = Math.min(98, Math.max(15, score + (matchCount * 5)));

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

    const highMatches = matches.filter(m => m.score > 60).length;
    const summary = `I've analyzed our premium database for your query. Curated ${highMatches || matches.length} verified candidates aligning with your interest in ${extractedCriteria.professions.join(", ") || "professional roles"} located in ${extractedCriteria.locations.join(", ") || "desired cities"}.`;

    return {
      summary,
      extractedCriteria,
      matches
    };
  };

  if (!ai) {
    return res.json(getFallbackSearch(query, items));
  }

  try {
    const serializedProfiles = items.map((p: any) => ({
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
    
    User Query: "${query}"
    
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
          type: Type.OBJECT,
          required: ["matches", "summary", "extractedCriteria"],
          properties: {
            summary: {
              type: Type.STRING,
              description: "A friendly, warm, culturally respectful matchmaking synthesis of the results, explaining how candidates align with their goals. Keep it under 70 words."
            },
            extractedCriteria: {
              type: Type.OBJECT,
              required: ["locations", "professions", "diets", "lifestyles"],
              properties: {
                locations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Extracted cities or locations" },
                professions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Extracted roles, careers, or fields" },
                diets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Extracted diet values" },
                lifestyles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Extracted lifestyle parameters" }
              }
            },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["profileId", "score", "reason"],
                properties: {
                  profileId: { type: Type.STRING, description: "The matching candidate's profile ID" },
                  score: { type: Type.INTEGER, description: "Relevance score from 0 to 100 based on alignment" },
                  reason: { type: Type.STRING, description: "A highly tailored 1-sentence explanation of why they are a match (sound like a professional consultant)" }
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
    console.error("AI Search API error:", error);
    res.json(getFallbackSearch(query, items));
  }
});

export default router;
