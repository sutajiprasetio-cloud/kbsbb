import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Repeat, CreditCard, Users, ArrowRight, Heart } from "lucide-react";
import { DonationChannels } from "@/components/donation-channels";
import { ModeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { DonationForm } from "@/components/donation-form";
import { useCampaigns, rp, pct } from "@/lib/donations";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/donasi/")({
  head: () => ({
    meta: [
      { title: "Donasi KBSBB — Dukung Program Donasi Aktif" },
      { name: "description", content: "Lihat program donasi aktif KBSBB, pantau progres secara langsung, dan berdonasi sekali atau rutin bulanan. Transparan, teraudit, dan berdampak." },
      { property: "og:title", content: "Donasi ke KBSBB" },
      { property: "og:description", content: "Kebaikan Anda menjadi berkah bagi sesama." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: canonical("/donasi") },
    ],
    links: [{ rel: "canonical", href: canonical("/donasi") }],
  }),
  component: Donate,
});

function Donate() {
  const { campaigns, stats } = useCampaigns();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Donasi"
        title="Mari Menjadi Bagian dari Kebaikan"
        description="Setiap donasi yang Anda berikan akan membantu menghadirkan manfaat bagi masyarakat yang membutuhkan melalui program-program KBSBB."
      />

      <div className="container-x -mt-6 flex justify-center md:-mt-8">
        <Button asChild size="lg" className="rounded-full px-8 gap-2 shadow-glow">
          <a href="#metode-donasi"><Heart className="h-4 w-4 fill-current" /> Donasi Sekarang</a>
        </Button>
      </div>

      <DonationChannels />

      <section className="container-x py-16 md:py-20">

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Program Donasi Aktif</h2>
        <p className="mt-2 text-muted-foreground">Pilih program donasi dan pantau progresnya secara langsung.</p>

        {campaigns === null ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState className="mt-8" title="Belum ada program donasi aktif" description="Saat ini belum ada program donasi berjalan — Anda tetap dapat mendukung dana umum kami di bawah ini." />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              const stat = stats[c.id];
              const p = pct(c.raised_amount, c.goal_amount);
              return (
                <Card key={c.id} className="group overflow-hidden rounded-3xl border-border/70 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Link to="/donasi/$slug" params={{ slug: c.slug }} className="block">
                    <ModeImage src={c.cover_url} alt={c.title} mode={c.display_mode} className="aspect-[16/10] bg-muted" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  <CardContent className="p-5">
                    <Link to="/donasi/$slug" params={{ slug: c.slug }}>
                      <h3 className="text-lg font-bold leading-snug hover:text-primary transition-colors">{c.title}</h3>
                    </Link>
                    {c.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
                    <div className="mt-4"><Progress value={p} /></div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span><span className="font-semibold text-foreground">Rp {rp(Number(c.raised_amount))}</span> dari Rp {rp(Number(c.goal_amount))}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{stat?.donor_count ?? 0} donatur</span>
                    </div>
                    <Button asChild className="mt-4 w-full rounded-full gap-2">
                      <Link to="/donasi/$slug" params={{ slug: c.slug }}>Donasi Sekarang <ArrowRight className="h-4 w-4" /></Link>
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
            <h2 className="text-xl font-bold">Donasi untuk dana umum</h2>
            <p className="mt-1 text-sm text-muted-foreground">Belum tahu ingin menyalurkan ke mana? Kami akan mengarahkan donasi Anda ke kebutuhan yang paling mendesak.</p>
            <div className="mt-6"><DonationForm /></div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[
            { icon: ShieldCheck, title: "100% ke lapangan", text: "Biaya operasional ditanggung terpisah. Setiap rupiah sampai ke penerima manfaat." },
            { icon: Repeat, title: "Bisa dibatalkan kapan saja", text: "Donatur bulanan dapat menjeda atau membatalkan dengan sekali klik." },
            { icon: CreditCard, title: "Pembayaran aman", text: "Didukung BCA, Mandiri, GoPay, OVO, dan Dana." },
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
