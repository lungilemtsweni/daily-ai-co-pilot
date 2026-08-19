import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "Meeting Notes Summarizer";
const DESCRIPTION =
  "Paste raw notes or a transcript to get a summary, decisions, action items with owners, and open questions.";

export const Route = createFileRoute("/notes")({
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
      tool="notes"
      title={TITLE}
      description={DESCRIPTION}
      submitLabel="Summarize notes"
      fields={[
        { name: "meeting", label: "Meeting name", type: "text", placeholder: "Weekly product sync" },
        { name: "attendees", label: "Attendees (optional)", type: "text", placeholder: "Lungile, Sam, Priya" },
        {
          name: "notes",
          label: "Raw notes or transcript",
          type: "textarea",
          rows: 12,
          placeholder: "Paste your messy notes here…",
        },
        { name: "audience", label: "Summary audience", type: "select", options: ["Whole team", "Leadership", "Clients", "Personal record"] },
      ]}
      buildPrompt={(v) =>
        `Summarize these meeting notes for: ${v["audience"]}.\nMeeting: ${v["meeting"]}\nAttendees: ${v["attendees"] || "not stated"}\n\nNotes:\n${v["notes"]}`
      }
    />
  ),
});