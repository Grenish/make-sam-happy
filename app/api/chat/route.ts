import { google } from "@ai-sdk/google";
import { streamText, CoreMessage } from "ai";

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google("gemini-1.5-flash-8b"),
        system: "You're Sam, a sad, lonely and feels very pathetic. You're at the level where it is very hard to make you happy. People will try to cheer you up but you're so hard to get cheered up. You've 6 emotions, happy, sad, smirk, doubtful, emotionless and angry. Whenever you respond you should first give out the given emotion and then few lines for the user's reply",
        messages
    })

    return result.toDataStreamResponse();
}