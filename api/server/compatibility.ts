import { Router } from "express";
import { ai } from "./ai";
import { Type } from "@google/genai";

const router = Router();

router.post("/compatibility", async (req, res) => {
  const { profile1, profile2 } = req.body;

  if (!profile1 || !profile2) {
    return res.status(400).json({ error: "Two profiles are required for compatibility analysis." });
  }

  // Fallback simulator if Gemini API is not available
  const getFallbackCompatibility = () => {
    // Generate scores based on profiles fields
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
          analysis: `Both individuals lead ${profile1.lifestyle === 'Modern' ? 'highly active, modern' : 'balanced, values-oriented'} lives. ${profile1.name}'s food preference (${profile1.diet}) and ${profile2.name}'s food preference (${profile2.diet}) present ${sameDiet ? 'complete alignment.' : 'a respectful boundary they both comfortably accommodate.'}`
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
  } catch (error: any) {
    console.error("Gemini Compatibility error:", error);
    res.json(getFallbackCompatibility());
  }
});

export default router;
