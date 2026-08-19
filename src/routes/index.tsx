import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessagesSquare, ArrowRight } from "lucide-react";
import { AiDisclaimer } from "@/components/AiDisclaimer";

const TITLE = "AI Workplace Productivity Assistant";
const DESCRIPTION =
  "Draft emails, summarise meetings, plan tasks, research topics and chat with an AI assistant built for professional work.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Automate everyday work` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn bullet points into a polished, on-tone business email in seconds.",
  },
  {
    to: "/notes",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    body: "Convert raw notes or transcripts into decisions, action items and owners.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Break goals into a prioritised, time-boxed plan you can actually execute.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Get a structured brief with key points, trade-offs and things to verify.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chatbot",
    body: "Think out loud with an assistant that keeps the full conversation context.",
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-brand px-6 py-10 sm:px-10 sm:py-14">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/80 uppercase">
            Workspace
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl leading-tight font-semibold text-primary-foreground sm:text-4xl">
            Automate the busywork. Keep the judgement.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            Five focused AI workflows for professionals — every output is structured, editable and
            yours to approve.
          </p>
          <Link
            to="/email"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
          >
            Start with an email <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="card-elevated group flex flex-col gap-3 p-5 transition-shadow hover:shadow-lg"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{body}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
              Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <AiDisclaimer />
    </div>
  );
}
