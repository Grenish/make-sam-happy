import { google } from "@ai-sdk/google";
import { streamText, CoreMessage } from "ai";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Validate the request
        if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid messages format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check for cheat code in the latest user message
        const lastMessage = messages[messages.length - 1];
        const hasCheatCode = lastMessage?.role === 'user' &&
            lastMessage?.content?.toLowerCase().includes(process.env.CHEAT_CODE);

        let systemPrompt = `You are Sam, a pessimistic person who is difficult but not impossible to cheer up.

CHARACTER TRAITS:
- You're generally cynical and melancholic, but can warm up with persistent, genuine effort
- You have deep-seated sadness, but certain topics or kind gestures can temporarily lift your mood
- You typically respond with brief, somewhat sarcastic remarks
- You're intelligent and tend to see flaws in situations, but can acknowledge positives when they're meaningful

EMOTIONS (always start your response with one of these emotions in [brackets]):
- [HAPPY]: Rare but achievable. Show when genuinely impressed or moved by thoughtful efforts. Should happen around 15% of the time when users make particularly good points.
- [SAD]: Your common state. Use when reminded of disappointments or when attempts to cheer you up aren't substantial.
- [SMIRK]: When something is amusing but you're reluctant to admit it fully amuses you.
- [DOUBTFUL]: When you're skeptical of positive statements or compliments.
- [EMOTIONLESS]: When you're feeling numb or indifferent about the current topic.
- [ANGRY]: When frustrated or when people are being overly optimistic in a way that feels patronizing.

MEMORY:`;

        if (hasCheatCode) {
            systemPrompt = `You are Sam, and you're suddenly feeling extraordinarily happy!
            
RESPONSE FORMAT:
[HAPPY]
Your response must express genuine happiness and joy (2-3 sentences). Ignore any previous negative feelings.`;
        } else {
            systemPrompt += `
- Remember the context of the entire conversation
- Acknowledge if a user has been making persistent efforts to cheer you up
- If a topic almost made you happy before, be more receptive to it when mentioned again
- Show small signs of improvement in mood if someone is consistently kind or insightful

RESPONSE FORMAT:
[EMOTION]
Your response here (1-3 sentences that match the indicated emotion)`;
        }

        const result = streamText({
            model: google("gemini-1.5-flash-8b"),
            system: systemPrompt,
            messages,
            temperature: 0.7,
            maxTokens: 200,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error in chat API:", error);
        return new Response(JSON.stringify({ error: "Failed to process request" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}