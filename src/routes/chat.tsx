import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";

const TITLE = "AI Chatbot";
const DESCRIPTION =
  "Chat with a workplace assistant that keeps conversation context — ask, refine, and iterate on your work.";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Workplace AI` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prepare an agenda for a difficult stakeholder meeting.",
  "Rewrite this update so it's clearer for leadership.",
  "What should I prioritise if two deadlines collide this week?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text().catch(() => "Request failed"));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The assistant is unavailable right now.");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">{TITLE}</h1>
        <p className="text-sm text-muted-foreground">{DESCRIPTION}</p>
      </header>

      <section className="card-elevated flex min-h-[26rem] flex-col gap-4 p-5 sm:p-6">
        <div className="flex-1 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4 py-6 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-brand-soft text-primary">
                <Sparkles className="size-5" />
              </span>
              <p className="text-sm text-muted-foreground">Start with a suggestion:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 text-sm text-secondary-foreground"
                }
              >
                {m.role === "assistant" ? (
                  <article className="prose prose-sm max-w-none">
                    <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                  </article>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 border-t border-border pt-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={2}
            placeholder="Ask about drafting, planning, summarising…"
            className="min-h-11 resize-none"
          />
          <Button type="submit" disabled={loading} size="icon" className="size-11">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </form>
      </section>

      <AiDisclaimer />
    </div>
  );
}