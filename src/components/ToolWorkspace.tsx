import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, Loader2, Pencil, Eye, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { generateOutput } from "@/lib/ai.functions";
import type { ToolId } from "@/lib/prompts";

export type Field =
  | { name: string; label: string; type: "text" | "textarea"; placeholder?: string; rows?: number }
  | { name: string; label: string; type: "select"; options: string[] };

type Props = {
  tool: ToolId;
  title: string;
  description: string;
  fields: Field[];
  buildPrompt: (values: Record<string, string>) => string;
  submitLabel: string;
};

export function ToolWorkspace({
  tool,
  title,
  description,
  fields,
  buildPrompt,
  submitLabel,
}: Props) {
  const run = useServerFn(generateOutput);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? f.options[0] : ""])),
  );
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (name: string, v: string) => setValues((p) => ({ ...p, [name]: v }));

  async function onGenerate() {
    const required = fields.find((f) => f.type !== "select" && !values[f.name]?.trim());
    if (required) {
      toast.error(`Please fill in "${required.label}".`);
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { tool, prompt: buildPrompt(values) } });
      setOutput(res.text);
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool}-output.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-elevated space-y-5 p-5 sm:p-6">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Structured prompt
          </h2>
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "text" && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 6}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
              {field.type === "select" && (
                <Select value={values[field.name]} onValueChange={(v) => set(field.name, v)}>
                  <SelectTrigger id={field.name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          <Button onClick={onGenerate} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {loading ? "Generating…" : submitLabel}
          </Button>
        </section>

        <section className="card-elevated flex min-h-[24rem] flex-col p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              AI output {output && <span className="normal-case">(editable)</span>}
            </h2>
            {output && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                  {editing ? <Eye className="size-4" /> : <Pencil className="size-4" />}
                  {editing ? "Preview" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard.writeText(output);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy className="size-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={download}>
                  <Download className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {!output && (
            <p className="my-auto text-center text-sm text-muted-foreground">
              Fill in the prompt and generate. You can edit every result before using it.
            </p>
          )}
          {output && editing && (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="min-h-80 flex-1 font-mono text-xs"
            />
          )}
          {output && !editing && (
            <article className="prose prose-sm max-w-none prose-headings:font-display prose-table:text-xs">
              <ReactMarkdown>{output}</ReactMarkdown>
            </article>
          )}
        </section>
      </div>

      <AiDisclaimer />
    </div>
  );
}