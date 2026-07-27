import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Repeat, CreditCard, Users, ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { DonationForm } from "@/components/donation-form";
import { useCampaigns, rp, pct } from "@/lib/donations";

export const Route = createFileRoute("/donate/")({
  head: () => ({
    meta: [
      { title: "Donate to KBSBB — Support an Active Campaign" },
      { name: "description", content: "Browse active KBSBB campaigns, track live progress, and give a one-time or monthly donation. Transparent, audited, and impactful." },
      { property: "og:title", content: "Donate to KBSBB" },
      { property: "og:description", content: "Your gift becomes someone's blessing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Donate,
});

function Donate() {
  const { campaigns, stats } = useCampaigns();

  return (
    <SiteLayout>
      <PageHero eyebrow="Donate" title="Your gift becomes a blessing" description="100% of your donation reaches the field. Fully transparent, audited annually." />

      <section className="container-x py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Active campaigns</h2>
        <p className="mt-2 text-muted-foreground">Choose a campaign and follow its progress in real time.</p>

        {campaigns === null ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState className="mt-8" title="No active campaigns" description="There are no campaigns running right now — you can still support our general fund below." />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              const stat = stats[c.id];
              const p = pct(c.raised_amount, c.goal_amount);
              return (
                <Card key={c.id} className="group overflow-hidden rounded-3xl border-border/70 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Link to="/donate/$slug" params={{ slug: c.slug }} className="block">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <SafeImage src={c.cover_url} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <Link to="/donate/$slug" params={{ slug: c.slug }}>
                      <h3 className="text-lg font-bold leading-snug hover:text-primary transition-colors">{c.title}</h3>
                    </Link>
                    {c.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
                    <div className="mt-4"><Progress value={p} /></div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span><span className="font-semibold text-foreground">Rp {rp(Number(c.raised_amount))}</span> of Rp {rp(Number(c.goal_amount))}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{stat?.donor_count ?? 0} donors</span>
                    </div>
                    <Button asChild className="mt-4 w-full rounded-full gap-2">
                      <Link to="/donate/$slug" params={{ slug: c.slug }}>Donate now <ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="container-x pb-20 grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <Card className="rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-bold">Give to the general fund</h2>
            <p className="mt-1 text-sm text-muted-foreground">Not sure where to give? We'll direct your gift where it's needed most.</p>
            <div className="mt-6"><DonationForm /></div>
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
