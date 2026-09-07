import { Router } from "express";
import { ai } from "./ai";

const router = Router();

router.post("/pundit-chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "A valid list of messages is required." });
  }

  const getFallbackPunditResponse = (userMsg: string) => {
    const responses: { [key: string]: string } = {
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
    const formattedHistory = messages.map(msg => 
      `${msg.senderId === 'user' ? 'User' : 'Pundit Shastri'}: ${msg.text}`
    ).join("\n");

    const prompt = `Here is the conversation history:
    ${formattedHistory}
    
    Respond as Pundit Shastri. Offer wise, modern, and traditional guidance for their question. Keep your answer brief (2-3 concise, polished sentences).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Pundit Shastri, a traditional yet highly modern, polite, and wise Hindu matrimonial coach, relationship guide, and expert on Vedic wedding rituals. You bless the user with 'Namaste' and offer warm, practical advice that respects both ancient scriptures and contemporary lifestyle values. Keep responses to under 80 words.",
      }
    });

    res.json({ text: response.text?.trim() });
  } catch (error: any) {
    console.error("Pundit Chat error:", error);
    res.json({ text: getFallbackPunditResponse(lastUserMessage) });
  }
});

export default router;
