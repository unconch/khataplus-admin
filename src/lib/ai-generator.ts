import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type GimmickVariant = {
    type: 'Analyst' | 'Viral' | 'Local';
    content: string;
    hashtags: string[];
};

export async function generateMarketingGimmick(
    title: string,
    baseContent: string,
    city?: string,
    category?: string
): Promise<GimmickVariant[]> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an elite Growth Hacker for KhataPlus, an Indian SMB SaaS platform for GST, billing, and inventory.
    Transform the following marketing signal into 3 high-converting "Gimmicks" for social media (X, LinkedIn, WhatsApp, Reddit).
    
    Signal Title: ${title}
    Message Hook: ${baseContent}
    ${city ? `Target Location: ${city}` : ""}
    ${category ? `Target Category: ${category}` : ""}

    Patterns to use:
    1. "The Analyst": Focused on ROI, GST savings, and efficiency. Professional/LinkedIn.
    2. "The Viral": High energy, emojis, FOMO, "New Era" hooks. X/WhatsApp.
    3. "The Local": Hyper-localized for ${city || "India"}, uses city name, local slang (if appropriate), and specific local business pain points.

    Output format: JSON array of 3 objects with keys: type, content, hashtags (array).
    Ensure content includes emojis and is ready for broadcast.
  `;

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("No API Key");
        }
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Clean JSON from markdown if needed
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Generation failed, using fallbacks:", error);
        // Local Fallback Engine (Mocked AI patterns)
        return [
            {
                type: 'Analyst',
                content: `📊 DATA REVOLUTION: ${title} has launched. Empower your business with automated GST compliance and 100% precision. ${baseContent}`,
                hashtags: ['#KhataPlus', '#GSTIndia', '#BusinessEfficiency']
            },
            {
                type: 'Viral',
                content: `🚀 UNSTOPPABLE GROWTH! ${title} is here to change the game. Don't let your competitors get ahead. 🔥 ${baseContent}`,
                hashtags: ['#GrowthHack', '#SMBIndia', '#NewEra']
            },
            {
                type: 'Local',
                content: `📍 ${city || 'INDIA'} BUSINESS ALERT: ${title} is now optimized for the local market. Scale your ${category || 'business'} with ease. ${baseContent}`,
                hashtags: [`#${city || 'India'}Business`, '#LocalGrowth', '#KhataPlus']
            }
        ];

    }
}

export type MarketingIdea = {
    title: string;
    description: string;
    suggestedPlatforms: string[];
};

export async function generateMarketingIdeas(goal: string): Promise<MarketingIdea[]> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a creative Marketing Director for KhataPlus (SaaS for Indian SMBs).
    The user has a goal: "${goal}".
    
    Brainstorm 3 distinct, high-impact marketing campaign ideas to achieve this goal.
    Focus on Indian market context (GST, Festivals, Business growth).

    Output format: JSON array of 3 objects with keys: 
    - title (short, punchy)
    - description (1-2 sentences explaining the angle)
    - suggestedPlatforms (array of strings: 'twitter', 'linkedin', 'whatsapp', 'reddit')
  `;

    try {
        if (!process.env.GEMINI_API_KEY) throw new Error("No API Key");

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Idea Generation failed:", error);
        return [
            {
                title: "Flash Sale Bonanza",
                description: "Run a 24-hour discount campaign targeting late-night business owners.",
                suggestedPlatforms: ["whatsapp", "twitter"]
            },
            {
                title: "Customer Success Spotlight",
                description: "Share a story of a local business saving money with KhataPlus.",
                suggestedPlatforms: ["linkedin", "twitter"]
            },
            {
                title: "GST Compliance Workshop",
                description: "Host a mini-series on how to file GST perfectly using KhataPlus.",
                suggestedPlatforms: ["linkedin", "reddit"]
            }
        ];
    }
}
