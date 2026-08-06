import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Target, CalendarClock, Quote } from "lucide-react";
import { ModeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { DonationForm } from "@/components/donation-form";
import { useCampaign, rp, pct } from "@/lib/donations";
import { canonical } from "@/lib/slug";
import { RichText } from "@/components/rich-text";

export const Route = createFileRoute("/donasi/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Program Donasi — KBSBB" },
      { name: "description", content: "Dukung program donasi KBSBB ini. Pantau progres dan jumlah donatur secara langsung, dan berdonasi dengan aman dalam hitungan detik." },
      { property: "og:title", content: "Program Donasi — KBSBB" },
      { property: "og:description", content: "Dukung program donasi KBSBB dan pantau progresnya secara langsung." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical(`/donasi/${params.slug}`) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical(`/donasi/${params.slug}`) }],
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
          <EmptyState title="Program donasi tidak ditemukan" description="Program ini mungkin telah berakhir atau dihapus." />
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="rounded-full gap-2"><Link to="/donasi"><ArrowLeft className="h-4 w-4" /> Kembali ke daftar donasi</Link></Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const p = pct(campaign.raised_amount, campaign.goal_amount);

  return (
    <SiteLayout>
      <article className="container-x py-10 md:py-16">
        <Button asChild variant="ghost" className="rounded-full gap-2 -ml-2 mb-6"><Link to="/donasi"><ArrowLeft className="h-4 w-4" /> Kembali ke daftar donasi</Link></Button>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-start">
          <div>
            <ModeImage src={campaign.cover_url} alt={campaign.title} mode={campaign.display_mode} loading="eager" className="rounded-3xl bg-muted aspect-[16/9]" />
            <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">{campaign.title}</h1>
            {campaign.description && (
              <RichText html={campaign.description} className="mt-4 text-muted-foreground leading-relaxed" />
            )}

            <div className="mt-8">
              <h2 className="text-lg font-bold">Donatur terbaru</h2>
              {donors.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">Jadilah orang pertama yang mendukung program ini.</p>
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
                      <div className="mt-1 text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString("id-ID")}</div>
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
                <div className="text-sm text-muted-foreground">dana terkumpul dari target Rp {rp(Number(campaign.goal_amount))}</div>
                <div className="mt-4"><Progress value={p} /></div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <Stat icon={Target} label="Progres" value={`${p}%`} />
                  <Stat icon={Users} label="Donatur" value={String(stat?.donor_count ?? 0)} />
                  <Stat icon={CalendarClock} label="Berakhir" value={campaign.ends_at ? new Date(campaign.ends_at).toLocaleDateString("id-ID") : "Terbuka"} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/70 shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold">Berdonasi</h2>
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
