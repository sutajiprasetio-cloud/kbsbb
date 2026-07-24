import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ShieldCheck, Repeat, CreditCard } from "lucide-react";

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
  return (
    <SiteLayout>
      <PageHero eyebrow="Donate" title="Your gift becomes a blessing" description="100% of your donation reaches the field. Fully transparent, audited annually." />
      <section className="container-x py-20 grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <div className="flex gap-2 p-1 bg-muted rounded-full w-fit">
              {(["once", "monthly"] as const).map((f) => (
                <button key={f} onClick={() => setFreq(f)} className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${freq === f ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}>
                  {f === "once" ? "One-time" : "Monthly"}
                </button>
              ))}
            </div>
            <h3 className="mt-6 text-lg font-bold">Choose amount</h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMOUNTS.map((a) => (
                <button key={a} onClick={() => setAmount(a)} className={`rounded-2xl border-2 px-4 py-4 text-center font-bold transition-all ${amount === a ? "border-primary bg-brand-soft text-primary" : "border-border hover:border-primary/50"}`}>
                  Rp {rp(a)}
                </button>
              ))}
              <div className="col-span-2 sm:col-span-3 flex items-center gap-2 rounded-2xl border-2 border-border px-4">
                <span className="text-muted-foreground font-semibold">Rp</span>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border-0 shadow-none focus-visible:ring-0 text-lg font-bold" />
              </div>
            </div>
            <form className="mt-8 grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Full name</Label><Input required /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input type="email" required /></div>
              </div>
              <div className="grid gap-1.5"><Label>Phone</Label><Input required /></div>
              <Button size="lg" className="rounded-full gap-2 h-14 text-base shadow-glow">
                <Heart className="h-5 w-5 fill-current" /> Donate Rp {rp(amount)} {freq === "monthly" && "/ month"}
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
