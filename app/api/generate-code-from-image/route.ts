import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { USER_PROMPT } from "./prompts";
import { getSystemPrompt } from "./getSystemPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { url, isVanillaMode, frameworkUI, frameworkCSS, customUserPrompt } = await req.json();

  const userPrompt = customUserPrompt ?? USER_PROMPT
  const systemPrompt = getSystemPrompt(isVanillaMode, frameworkUI, frameworkCSS)

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    stream: true,
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userPrompt,
          },
          {
            type: "image_url",
            image_url: url,
          },
        ],
      },
    ],
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
