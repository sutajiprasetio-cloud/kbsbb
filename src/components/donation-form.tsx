import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { rp } from "@/lib/donations";

const AMOUNTS = [50_000, 150_000, 500_000, 1_000_000, 2_500_000];

export function DonationForm({
  campaignId,
  campaignTitle,
  onDone,
}: {
  campaignId?: string | null;
  campaignTitle?: string;
  onDone?: () => void;
}) {
  const [amount, setAmount] = useState<number>(500_000);
  const [freq, setFreq] = useState<"once" | "monthly">("once");
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ donor_name: "", donor_email: "", phone: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || amount < 10_000) return toast.error("Minimum donation is Rp 10.000");
    setBusy(true);
    const { error } = await supabase.from("donations").insert({
      donor_name: form.donor_name.trim().slice(0, 100),
      donor_email: form.donor_email.trim().slice(0, 255) || null,
      donor_phone: form.phone.trim().slice(0, 40) || null,
      message: form.message.trim().slice(0, 1000) || null,
      is_anonymous: anonymous,
      amount,
      method: freq === "monthly" ? "monthly-transfer" : "one-time-transfer",
      campaign_id: campaignId || null,
      status: "pending",
    } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Thank you! We'll email you payment instructions shortly.");
    setForm({ donor_name: "", donor_email: "", phone: "", message: "" });
    setAnonymous(false);
    onDone?.();
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      {campaignTitle && (
        <p className="text-sm text-muted-foreground">
          You are supporting <span className="font-semibold text-foreground">{campaignTitle}</span>.
        </p>
      )}

      <div className="flex gap-2 p-1 bg-muted rounded-full w-fit">
        {(["once", "monthly"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFreq(f)} className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${freq === f ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}>
            {f === "once" ? "One-time" : "Monthly"}
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold">Choose amount</h3>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AMOUNTS.map((a) => (
            <button type="button" key={a} onClick={() => setAmount(a)} className={`rounded-2xl border-2 px-3 py-4 text-center font-bold transition-all ${amount === a ? "border-primary bg-brand-soft text-primary" : "border-border hover:border-primary/50"}`}>
              Rp {rp(a)}
            </button>
          ))}
          <div className="col-span-2 sm:col-span-3 flex items-center gap-2 rounded-2xl border-2 border-border px-4">
            <span className="text-muted-foreground font-semibold">Rp</span>
            <Input type="number" min={10000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border-0 shadow-none focus-visible:ring-0 text-lg font-bold" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-1.5"><Label>Full name</Label><Input required maxLength={100} value={form.donor_name} onChange={(e) => setForm({ ...form, donor_name: e.target.value })} /></div>
        <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required maxLength={255} value={form.donor_email} onChange={(e) => setForm({ ...form, donor_email: e.target.value })} /></div>
      </div>
      <div className="grid gap-1.5"><Label>Phone number</Label><Input required maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      <div className="grid gap-1.5"><Label>Message / prayer (optional)</Label><Textarea rows={3} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write a short message or prayer…" /></div>

      <label className="flex items-center gap-3 text-sm">
        <Checkbox checked={anonymous} onCheckedChange={(v) => setAnonymous(!!v)} />
        Donate anonymously (your name won't be shown publicly)
      </label>

      <Button size="lg" className="rounded-full gap-2 h-14 text-base shadow-glow" disabled={busy}>
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5 fill-current" />}
        Donate Rp {rp(amount)} {freq === "monthly" && "/ month"}
      </Button>
    </form>
  );
}
