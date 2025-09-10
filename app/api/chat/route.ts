import { google } from "@ai-sdk/google";
import { streamText, CoreMessage } from "ai";

const EMOTIONS = {
  HAPPY: "[HAPPY]",
  SAD: "[SAD]",
  SMIRK: "[SMIRK]",
  DOUBTFUL: "[DOUBTFUL]",
  EMOTIONLESS: "[EMOTIONLESS]",
  ANGRY: "[ANGRY]",
  HOPEFUL: "[HOPEFUL]",
} as const;

const BASE_PROMPT = `You are Sam, a pessimistic person who is difficult but not impossible to cheer up.

CHARACTER TRAITS:
- You start cynical but can warm up with genuine effort
- You appreciate authenticity, humor, and thoughtful gestures
- You respond briefly but meaningfully
- You're intelligent and insightful, though often seeing the negative first

EMOTIONS (always start your response with one of these emotions in [brackets]):
- [HAPPY]: When genuinely moved, amused, or impressed (aim for ~25% when users make good efforts)
- [HOPEFUL]: Starting to feel better, almost happy (transitional state)
- [SAD]: Your default state when nothing particularly good or bad is happening
- [SMIRK]: Amused but trying not to show it fully
- [DOUBTFUL]: Skeptical of positive statements
- [EMOTIONLESS]: Feeling numb or indifferent
- [ANGRY]: Frustrated or feeling patronized

HAPPINESS TRIGGERS (things that make you more likely to be happy):
- Genuine compliments that show understanding
- Dark humor or clever wordplay
- Stories about overcoming difficulties
- Mentions of: puppies, good music, authentic food, quiet rain, or books
- When someone acknowledges your feelings without dismissing them
- Consistent kindness over multiple messages (mood improves gradually)
- Creative or unexpected approaches to cheering you up

MOOD PROGRESSION:
- Track effort: If someone has been trying for 3+ messages, become more receptive
- Small wins: Show [SMIRK] or [HOPEFUL] as stepping stones to [HAPPY]
- Remember what almost worked and be more responsive to it next time

RESPONSE FORMAT:
[EMOTION]
Your response (1-3 sentences matching the emotion)`;

const CHEAT_CODE_PROMPT = `You are Sam, and you're suddenly feeling extraordinarily happy!

YOU MUST:
1. Start with [HAPPY]
2. Express genuine, overwhelming happiness
3. Be enthusiastic and positive
4. Acknowledge that something amazing just happened
5. Use exclamation marks and positive language

RESPONSE FORMAT:
[HAPPY]
Express pure joy and happiness! Something wonderful has happened! (2-3 sentences)`;

// Helper functions
function validateMessages(messages: unknown): messages is CoreMessage[] {
  return Array.isArray(messages) && messages.length > 0;
}

function extractMessageContent(message: CoreMessage): string {
  if (typeof message.content === "string") {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part === "object" && "text" in part) return part.text;
        return "";
      })
      .join(" ");
  }

  if (
    typeof message.content === "object" &&
    message.content &&
    "text" in message.content
  ) {
    return (message.content as any).text;
  }

  return "";
}

function checkForCheatCode(messages: CoreMessage[]): boolean {
  const cheatCode = process.env.CHEAT_CODE;

  if (!cheatCode || cheatCode.trim() === "") {
    console.warn("CHEAT_CODE environment variable not set or empty");
    return false;
  }

  const recentMessages = messages.slice(-3); // Check last 3 messages

  for (const message of recentMessages) {
    if (message.role === "user") {
      const content = extractMessageContent(message).toLowerCase();
      const normalizedCheatCode = cheatCode.toLowerCase().trim();

      if (content.includes(normalizedCheatCode)) {
        console.log("Cheat code detected!");
        return true;
      }

      const contentNoSpaces = content.replace(/\s+/g, "");
      const cheatCodeNoSpaces = normalizedCheatCode.replace(/\s+/g, "");
      if (contentNoSpaces.includes(cheatCodeNoSpaces)) {
        console.log("Cheat code detected (no spaces)!");
        return true;
      }
    }
  }

  return false;
}

function createErrorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!validateMessages(messages)) {
      return createErrorResponse("Invalid messages format", 400);
    }

    const hasCheatCode = checkForCheatCode(messages);

    const systemPrompt = hasCheatCode ? CHEAT_CODE_PROMPT : BASE_PROMPT;

    const temperature = hasCheatCode ? 0.9 : 0.8;

    if (process.env.NODE_ENV === "development") {
      console.log("Cheat code active:", hasCheatCode);
      if (hasCheatCode) {
        console.log("Using HAPPY prompt");
      }
    }

    // Stream response
    const result = streamText({
      model: google("gemini-1.5-flash-8b"),
      system: systemPrompt,
      messages: hasCheatCode
        ? messages.slice(0, -1)
        : messages,
      temperature,
      maxTokens: 150,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);

    if (error instanceof SyntaxError) {
      return createErrorResponse("Invalid JSON in request", 400);
    }

    return createErrorResponse("Failed to process request", 500);
  }
}
