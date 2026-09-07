import { Router } from "express";
import { ai } from "./ai";

const router = Router();

router.post("/profile-chat", async (req, res) => {
  const { profile, messages } = req.body;

  if (!profile || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Profile and message history are required." });
  }

  const getFallbackProfileResponse = () => {
    const responses = [
      `Thanks for reaching out! I was just reading your profile and found it really interesting. What hobbies keep you busy during weekends?`,
      `Hello! It's great to connect. Yes, working as a ${profile.profession} in ${profile.location.city} keeps my days active. I'd love to know more about your lifestyle and what you value most in a partner.`,
      `Namaste! My parents and I really appreciate your interest. Family is very important to us. How do you usually balance career goals and spending quality family time?`,
      `That sounds lovely! I believe mutual respect and good food (${profile.diet === 'Veg' ? 'traditional vegetarian dishes' : 'exploring various cuisines'}) make for great foundation blocks. Let's keep talking!`
    ];
    // Return one of the responses based on message count
    return responses[messages.length % responses.length];
  };

  const lastUserMessage = messages[messages.length - 1]?.text || "";

  if (!ai) {
    // Artificial small delay for realistic chat feel
    await new Promise(resolve => setTimeout(resolve, 1000));
    return res.json({ text: getFallbackProfileResponse() });
  }

  try {
    const formattedHistory = messages.map(msg => 
      `${msg.senderId === 'user' ? 'User' : profile.name}: ${msg.text}`
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
        systemInstruction: `You are simulating a profile registered on Hindu Matrimony named ${profile.name}. You are polite, respectable, modern yet traditional, seeking a serious life partner. Never sound robotic or overly transactional. Be conversational and warm.`,
      }
    });

    res.json({ text: response.text?.trim() });
  } catch (error: any) {
    console.error("Profile Chat error:", error);
    res.json({ text: getFallbackProfileResponse() });
  }
});

export default router;
