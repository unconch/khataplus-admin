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
