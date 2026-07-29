import { Inbox } from "lucide-react";

export function EmptyState({ title = "Belum ada konten", description = "Konten akan tampil di sini segera setelah dipublikasikan.", className = "" }: { title?: string; description?: string; className?: string }) {
  return (
    <div className={`rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center ${className}`}>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-primary">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
