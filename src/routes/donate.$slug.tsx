import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Target, CalendarClock, Quote } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { DonationForm } from "@/components/donation-form";
import { useCampaign, rp, pct } from "@/lib/donations";

export const Route = createFileRoute("/donate/$slug")({
  head: () => ({
    meta: [
      { title: "Donation Campaign — KBSBB" },
      { name: "description", content: "Support this KBSBB campaign. Track live progress, donor count, and give securely in a few seconds." },
      { property: "og:title", content: "Donation Campaign — KBSBB" },
      { property: "og:description", content: "Support this KBSBB campaign and follow its live progress." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampaignDetail,
});

function CampaignDetail() {
  const { slug } = Route.useParams();
  const { campaign, stat, donors, refresh } = useCampaign(slug);

  if (campaign === undefined) {
    return (
      <SiteLayout>
        <div className="container-x py-24"><div className="h-96 rounded-3xl bg-muted animate-pulse" /></div>
      </SiteLayout>
    );
  }

  if (campaign === null) {
    return (
      <SiteLayout>
        <div className="container-x py-24">
          <EmptyState title="Campaign not found" description="This campaign may have ended or been removed." />
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="rounded-full gap-2"><Link to="/donate"><ArrowLeft className="h-4 w-4" /> Back to campaigns</Link></Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const p = pct(campaign.raised_amount, campaign.goal_amount);

  return (
    <SiteLayout>
      <article className="container-x py-10 md:py-16">
        <Button asChild variant="ghost" className="rounded-full gap-2 -ml-2 mb-6"><Link to="/donate"><ArrowLeft className="h-4 w-4" /> Back to campaigns</Link></Button>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-start">
          <div>
            <div className="overflow-hidden rounded-3xl bg-muted aspect-[16/9]">
              <SafeImage src={campaign.cover_url} alt={campaign.title} loading="eager" className="h-full w-full object-cover" />
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">{campaign.title}</h1>
            {campaign.description && (
              <div className="mt-4 whitespace-pre-line text-muted-foreground leading-relaxed">{campaign.description}</div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-bold">Recent supporters</h2>
              {donors.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">Be the first to support this campaign.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {donors.map((d: any) => (
                    <li key={d.id} className="rounded-2xl border border-border/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">{d.donor_name}</span>
                        <span className="text-sm text-primary font-semibold">Rp {rp(Number(d.amount))}</span>
                      </div>
                      {d.message && (
                        <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Quote className="h-4 w-4 shrink-0 mt-0.5" />{d.message}</p>
                      )}
                      <div className="mt-1 text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <Card className="rounded-3xl border-border/70 shadow-soft">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary">Rp {rp(Number(campaign.raised_amount))}</div>
                <div className="text-sm text-muted-foreground">raised of Rp {rp(Number(campaign.goal_amount))} target</div>
                <div className="mt-4"><Progress value={p} /></div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <Stat icon={Target} label="Progress" value={`${p}%`} />
                  <Stat icon={Users} label="Donors" value={String(stat?.donor_count ?? 0)} />
                  <Stat icon={CalendarClock} label="Ends" value={campaign.ends_at ? new Date(campaign.ends_at).toLocaleDateString() : "Open"} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/70 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold">Make a donation</h2>
                <div className="mt-4">
                  <DonationForm campaignId={campaign.id} campaignTitle={campaign.title} onDone={refresh} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <div className="mt-1 font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
