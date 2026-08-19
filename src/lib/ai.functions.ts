import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const Input = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  prompt: z.string().min(1),
});

export const generateOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this app.");

    const { createLovableAiGatewayProvider, AI_MODEL } = await import("./ai-gateway.server");
    const { SYSTEM_PROMPTS } = await import("./prompts");

    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway(AI_MODEL),
      system: SYSTEM_PROMPTS[data.tool],
      prompt: data.prompt,
    });

    return { text: await result.text };
  });