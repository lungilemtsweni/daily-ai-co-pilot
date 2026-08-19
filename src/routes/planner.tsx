import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

const TITLE = "AI Task Planner";
const DESCRIPTION =
  "Turn a goal and constraints into a prioritised, time-boxed task plan with dependencies and risks.";

export const Route = createFileRoute("/planner")({
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
      tool="planner"
      title={TITLE}
      description={DESCRIPTION}
      submitLabel="Build plan"
      fields={[
        { name: "goal", label: "Goal or project", type: "text", placeholder: "Launch the Q4 onboarding revamp" },
        {
          name: "context",
          label: "Tasks, constraints & context",
          type: "textarea",
          rows: 8,
          placeholder: "- Two designers available\n- Legal review needed\n- Cannot ship during month-end",
        },
        { name: "horizon", label: "Time horizon", type: "select", options: ["Today", "This week", "Two weeks", "This month", "This quarter"] },
        { name: "capacity", label: "Working capacity", type: "select", options: ["Solo, part-time", "Solo, full-time", "Small team (2-4)", "Cross-functional team"] },
      ]}
      buildPrompt={(v) =>
        `Create a work plan.\nGoal: ${v.goal}\nTime horizon: ${v.horizon}\nCapacity: ${v.capacity}\nContext and constraints:\n${v.context}`
      }
    />
  ),
});