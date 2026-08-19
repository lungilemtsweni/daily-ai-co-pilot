import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "Smart Email Generator";
const DESCRIPTION =
  "Generate professional, on-tone workplace emails from a few structured details, then edit before sending.";

export const Route = createFileRoute("/email")({
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
      tool="email"
      title={TITLE}
      description={DESCRIPTION}
      submitLabel="Generate email"
      fields={[
        { name: "recipient", label: "Recipient & role", type: "text", placeholder: "Head of Ops" },
        { name: "purpose", label: "Purpose of the email", type: "text", placeholder: "Request a deadline extension" },
        {
          name: "points",
          label: "Key points to include",
          type: "textarea",
          rows: 6,
          placeholder: "- Vendor data arrived late\n- Need 3 extra working days\n- Draft ready Friday",
        },
        { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Direct", "Formal", "Apologetic", "Persuasive"] },
        { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
      ]}
      buildPrompt={(v) =>
        `Write a workplace email.\nRecipient: ${v["recipient"]}\nPurpose: ${v["purpose"]}\nTone: ${v["tone"]}\nLength: ${v["length"]}\nKey points:\n${v["points"]}`
      }
    />
  ),
});