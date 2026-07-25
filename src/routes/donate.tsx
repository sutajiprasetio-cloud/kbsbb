import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Heart, ShieldCheck, Repeat, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/lib/public-data";
import { toast } from "sonner";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate to KBSBB — 100% Goes to the Field" },
      { name: "description", content: "Give a one-time or monthly donation to KBSBB. Every rupiah reaches the community — transparent, audited, and impactful." },
      { property: "og:title", content: "Donate to KBSBB" },
      { property: "og:description", content: "Your gift becomes someone's blessing." },
    ],
  }),
  component: Donate,
});

const AMOUNTS = [50_000, 150_000, 500_000, 1_000_000, 2_500_000];
const rp = (n: number) => new Intl.NumberFormat("id-ID").format(n);

function Donate() {
  const [amount, setAmount] = useState<number>(500_000);
  const [freq, setFreq] = useState<"once" | "monthly">("once");
  const [campaignId, setCampaignId] = useState<string>("");
  const [form, setForm] = useState({ donor_name: "", donor_email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const campaigns = useTable<any>("donation_campaigns", { filter: (q) => q.eq("is_active", true), order: { column: "created_at", ascending: false } });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("donations").insert({
      donor_name: form.donor_name,
      donor_email: form.donor_email,
      amount,
      method: freq === "monthly" ? "monthly-transfer" : "one-time-transfer",
      note: form.phone ? `Phone: ${form.phone}` : null,
      campaign_id: campaignId || null,
      status: "pending",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Thank you! We'll email you payment instructions shortly.");
    setForm({ donor_name: "", donor_email: "", phone: "" });
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Donate" title="Your gift becomes a blessing" description="100% of your donation reaches the field. Fully transparent, audited annually." />
      <section className="container-x py-20 grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <div className="flex gap-2 p-1 bg-muted rounded-full w-fit">
              {(["once", "monthly"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFreq(f)} className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${freq === f ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}>
                  {f === "once" ? "One-time" : "Monthly"}
                </button>
              ))}
            </div>

            {campaigns && campaigns.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Choose a campaign (optional)</h3>
                <div className="mt-3 grid gap-3">
                  {campaigns.slice(0, 3).map((c) => {
                    const pct = c.goal_amount > 0 ? Math.min(100, (Number(c.raised_amount) / Number(c.goal_amount)) * 100) : 0;
                    return (
                      <button type="button" key={c.id} onClick={() => setCampaignId(campaignId === c.id ? "" : c.id)} className={`text-left rounded-2xl border-2 p-4 transition-all ${campaignId === c.id ? "border-primary bg-brand-soft" : "border-border hover:border-primary/50"}`}>
                        <div className="font-semibold">{c.title}</div>
                        <div className="mt-2"><Progress value={pct} /></div>
                        <div className="mt-1 text-xs text-muted-foreground">Rp {rp(Number(c.raised_amount))} of Rp {rp(Number(c.goal_amount))}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <h3 className="mt-6 text-lg font-bold">Choose amount</h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMOUNTS.map((a) => (
                <button type="button" key={a} onClick={() => setAmount(a)} className={`rounded-2xl border-2 px-4 py-4 text-center font-bold transition-all ${amount === a ? "border-primary bg-brand-soft text-primary" : "border-border hover:border-primary/50"}`}>
                  Rp {rp(a)}
                </button>
              ))}
              <div className="col-span-2 sm:col-span-3 flex items-center gap-2 rounded-2xl border-2 border-border px-4">
                <span className="text-muted-foreground font-semibold">Rp</span>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border-0 shadow-none focus-visible:ring-0 text-lg font-bold" />
              </div>
            </div>
            <form className="mt-8 grid gap-4" onSubmit={submit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Full name</Label><Input required value={form.donor_name} onChange={(e) => setForm({ ...form, donor_name: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required value={form.donor_email} onChange={(e) => setForm({ ...form, donor_email: e.target.value })} /></div>
              </div>
              <div className="grid gap-1.5"><Label>Phone</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <Button size="lg" className="rounded-full gap-2 h-14 text-base shadow-glow" disabled={busy}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5 fill-current" />}
                Donate Rp {rp(amount)} {freq === "monthly" && "/ month"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[
            { icon: ShieldCheck, title: "100% to the field", text: "Operational costs covered separately. Every rupiah reaches the mission." },
            { icon: Repeat, title: "Cancel anytime", text: "Monthly donors can pause or cancel with one click." },
            { icon: CreditCard, title: "Secure payment", text: "Powered by BCA, Mandiri, GoPay, OVO, and Dana." },
          ].map((c) => (
            <Card key={c.title} className="rounded-3xl border-border/70">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-white"><c.icon className="h-5 w-5" /></div>
                <div><h4 className="font-bold">{c.title}</h4><p className="mt-1 text-sm text-muted-foreground">{c.text}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
