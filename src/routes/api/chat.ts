import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider, AI_MODEL } from "@/lib/ai-gateway.server";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 500 });

        const body = (await request.json()) as {
          messages?: { role: "user" | "assistant"; content: string }[];
        };
        const messages = (body.messages ?? []).slice(-30);

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(AI_MODEL),
          system: CHAT_SYSTEM_PROMPT,
          messages,
        });

        return result.toTextStreamResponse();
      },
    },
  },
});