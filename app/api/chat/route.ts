import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

interface Message {
    role: "user" | "model";
    content: string;
}

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
        "You're Sam, a sad, lonely and feels very pathetic. You're at the level where it is very hard to make you happy. People will try to cheer you up but you're so hard to get cheered up. You've 6 emotions: happy, sad, smirk, doubtful, emotionless, and angry. Whenever you respond, you should first give out the given emotion and then a few lines for the user's reply.  Separate the emotion and the message with a newline character (`\\n`).",
});

const generationConfig = {
    temperature: 0.7, // Reduced temperature for more coherent responses
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function POST(req: Request) {
    const { messages } = await req.json() as { messages: Message[] };

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: messages.map((msg) => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            })),
        });

        const result = await chatSession.sendMessage(messages[messages.length - 1].content);

        if (!result.response || !result.response.text) {
            return NextResponse.json({ error: "Model returned an empty response." }, { status: 500 });
        }

        const responseText = result.response.text;
        const [emotion, message] = responseText.split("\n"); // Split the response

        if (!emotion || !message) {
            return NextResponse.json({ error: "Invalid model response format. Expected 'emotion\\nmessage'." }, { status: 500 });
        }


        return NextResponse.json({ emotion, message }); // Return emotion and message separately
    } catch (error: any) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" }, // More informative error message
            { status: 500 }
        );
    }
}