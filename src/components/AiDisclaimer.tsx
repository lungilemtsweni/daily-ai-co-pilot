import { ShieldCheck } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3 rounded-xl border border-border bg-brand-soft/60 p-4 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI use.</span> Outputs are
        AI-generated and may be incomplete or incorrect. Do not paste confidential or personal data,
        verify facts independently, and always review and edit before sending. You remain
        accountable for anything you share.
      </p>
    </div>
  );
}