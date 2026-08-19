import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "AI Research Assistant";
const DESCRIPTION =
  "Get a structured research brief with key points, trade-offs, next steps and claims flagged for verification.";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Workplace AI` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: () => (
    <ToolWorkspace
      tool="research"
      title={TITLE}
      description={DESCRIPTION}
      submitLabel="Research topic"
      fields={[
        { name: "topic", label: "Topic or question", type: "text", placeholder: "Best practices for hybrid onboarding" },
        {
          name: "focus",
          label: "What should the brief cover?",
          type: "textarea",
          rows: 6,
          placeholder: "- Compare approaches\n- Cost implications\n- Common failure modes",
        },
        { name: "depth", label: "Depth", type: "select", options: ["Quick overview", "Standard brief", "Deep dive"] },
        { name: "audience", label: "Audience", type: "select", options: ["Executive", "Team", "Client", "Technical"] },
      ]}
      buildPrompt={(v) =>
        `Produce a research brief.\nTopic: ${v.topic}\nDepth: ${v.depth}\nAudience: ${v.audience}\nFocus areas:\n${v.focus}`
      }
    />
  ),
});