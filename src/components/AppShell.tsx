import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessagesSquare,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold bg-sidebar-accent text-sidebar-accent-foreground",
          }}
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-2 py-1">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand">
          <Sparkles className="size-5 text-primary-foreground" />
        </span>
        <span className="font-display text-sm leading-tight font-semibold text-sidebar-foreground">
          Workplace AI
          <span className="block text-xs font-normal text-sidebar-foreground/60">
            Productivity Assistant
          </span>
        </span>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <p className="mt-auto rounded-lg border border-sidebar-border p-3 text-[11px] leading-relaxed text-sidebar-foreground/60">
        AI output can be inaccurate. Review and edit everything before sending or sharing.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        <SidebarInner />
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-lg border border-border text-foreground"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <span className="font-display text-sm font-semibold">Workplace AI</span>
        </header>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 w-72">
              <SidebarInner onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className={cn("flex-1 px-4 py-6 sm:px-8 sm:py-10")}>{children}</main>
      </div>
    </div>
  );
}