import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, MapPin, Heart, HandCoins, Stethoscope, GraduationCap, UtensilsCrossed, LifeBuoy, Droplet, Home as HomeIcon, HandHeart, Quote, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useTable, useSingleton } from "@/lib/public-data";
import { useHomepageConfig, type SectionId } from "@/lib/homepage-config";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";
import { HeroSlider } from "@/components/hero-slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KBSBB — Berbagi Sehat, Berbagi Berkah" },
      { name: "description", content: "KBSBB adalah yayasan kemanusiaan Indonesia yang menjalankan program kesehatan, pendidikan, pangan, dan tanggap bencana. Donasi, jadi relawan, atau bermitra bersama kami." },
      { property: "og:title", content: "KBSBB — Berbagi Sehat, Berbagi Berkah" },
      { property: "og:description", content: "Memberdayakan masyarakat Indonesia melalui program kesehatan, pendidikan, pangan, dan tanggap bencana." },
    ],
  }),
  component: HomePage,
});

const ICONS: Record<string, any> = { Stethoscope, GraduationCap, UtensilsCrossed, LifeBuoy, Droplet, Home: HomeIcon, HandHeart };

function HomePage() {
  const config = useHomepageConfig();
  if (!config) return <SiteLayout><div className="min-h-[60vh]" /></SiteLayout>;

  const order = config.order.filter((id) => config.enabled[id]);
  const heroIndex = order.indexOf("hero");
  const nextAfterHero = heroIndex >= 0 ? order[heroIndex + 1] : undefined;
  const statsAfterHero = nextAfterHero === "impact_stats";

  const render = (id: SectionId, i: number) => {
    switch (id) {
      case "hero": return <HeroSlider key={id} compactBottom={!statsAfterHero} />;
      case "about": return <AboutSection key={id} />;
      case "impact_stats": return <StatsSection key={id} floating={i === heroIndex + 1 && heroIndex >= 0} />;
      case "programs": return <FeaturedPrograms key={id} compactTop={heroIndex >= 0 && i === heroIndex + 1} />;
      case "campaigns": return <DonationProgress key={id} />;
      case "events": return <UpcomingEvents key={id} />;
      case "gallery": return <GalleryPreview key={id} />;
      case "testimonials": return <Testimonials key={id} />;
      case "partners": return <PartnersMarquee key={id} />;
      case "news": return <LatestNews key={id} />;
      case "faq": return <FaqSection key={id} />;
      case "cta_donate": return <DonateCta key={id} />;
      case "contact": return <NewsletterAndMap key={id} />;
      default: return null;
    }
  };

  return <SiteLayout>{order.map((id, i) => render(id, i))}</SiteLayout>;
}

function StatsSection({ floating = false }: { floating?: boolean }) {
  const stats = useTable<any>("impact_stats", {
    filter: (q) => q.eq("is_active", true),
    order: { column: "sort_order", ascending: true },
  });
  if (!stats || stats.length === 0) return null;

  const cols =
    stats.length <= 2 ? "sm:grid-cols-2"
    : stats.length === 3 ? "sm:grid-cols-3"
    : stats.length % 3 === 0 ? "sm:grid-cols-2 lg:grid-cols-3"
    : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className={floating ? "relative -mt-16 z-20" : "py-14 md:py-20"}>
      <div className="container-x">
        <div className={`grid grid-cols-2 ${cols} gap-2 sm:gap-4 rounded-3xl bg-card shadow-soft border border-border p-3 sm:p-4 md:p-6`}>
          {stats.map((s: any) => {
            const Icon = (LucideIcons as any)[s.icon] ?? Heart;
            return (
              <div key={s.id} className="flex min-w-0 flex-col items-start gap-2 rounded-2xl p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4 hover:bg-brand-soft/50 transition-colors">
                <div className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="truncate text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{s.value}</div>
                  <div className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">{s.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "center" }: { eyebrow: string; title: string; description?: string; align?: "left" | "center" }) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
      <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground md:text-lg">{description}</p>}
    </div>
  );
}

function AboutSection() {
  const about = useSingleton<any>("about_content", 1);
  if (!about) return null;
  return (
    <section className="py-20 md:py-28">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        {about.image_url && (
          <ModeImage src={about.image_url} alt={about.headline ?? "Tentang KBSBB"} mode={about.display_mode} className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted shadow-soft" />
        )}
        <div>
          <SectionHeading eyebrow="Tentang Kami" title={about.headline ?? "Tentang KBSBB"} description={about.intro ?? undefined} align="left" />
          {about.mission && <p className="mt-5 text-muted-foreground">{about.mission}</p>}
          <Link to="/about" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            Selengkapnya <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedPrograms({ compactTop = false }: { compactTop?: boolean }) {
  const items = useTable<any>("programs", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true }, limit: 4 });
  return (
    <section className={`${compactTop ? "pt-6 md:pt-8" : "pt-20 md:pt-28"} pb-20 md:pb-28`}>
      <div className="container-x">
        <SectionHeading eyebrow="Program Kami" title="Berbagi Sehat . Berbagi Berkah" description="Melalui berbagai program sosial, kesehatan, pendidikan, dakwah dan kemanusiaan, KBSBB berupaya menghadirkan manfaat, kepedulian, dan keberkahan bagi masyarakat yang membutuhkan." />
        {items && items.length === 0 ? (
          <EmptyState className="mt-12" title="Belum ada program" description="Program kami akan ditampilkan di sini setelah dipublikasikan." />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(items ?? []).map((p: any) => {
              const Icon = ICONS[p.icon] ?? HandHeart;
              return (
                <Card key={p.id} className="group overflow-hidden rounded-3xl border-border/70 pt-0 transition-all hover:-translate-y-1 hover:shadow-soft">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <ModeImage src={p.image_url} alt={p.title} mode={p.display_mode} className="absolute inset-0 h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">
                      <Icon className="h-3.5 w-3.5" /> {p.tag ?? p.slug ?? "Program"}
                    </div>
                  </div>
                  <CardContent className="px-5 pb-5">
                    <h3 className="text-lg font-bold">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{p.summary ?? p.description}</p>
                    <Link to="/programs" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">Selengkapnya <ArrowRight className="h-4 w-4" /></Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function DonationProgress() {
  const items = useTable<any>("donation_campaigns", { filter: (q) => q.eq("is_active", true), order: { column: "created_at", ascending: false }, limit: 3 });
  return (
    <section className="py-20 md:py-28 bg-brand-soft/40 border-y border-border/60">
      <div className="container-x">
        <SectionHeading eyebrow="PROGRAM KEBAIKAN" title="Satu Kebaikan, Seribu Senyuman" description="Setiap dukungan yang diberikan menjadi langkah untuk membantu masyarakat yang membutuhkan melalui berbagai program sosial dan kemanusiaan." />
        {items && items.length === 0 ? (
          <EmptyState className="mt-12" title="Belum ada program donasi aktif" description="Saat ini belum ada program donasi berjalan — Anda tetap dapat berdonasi umum." />
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(items ?? []).map((c: any) => {
              const goal = Number(c.goal_amount) || 0;
              const raised = Number(c.raised_amount) || 0;
              const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
              return (
                <Card key={c.id} className="overflow-hidden rounded-3xl border-border/70 pt-0">
                  <ModeImage src={c.cover_url} alt={c.title} mode={c.display_mode} className="aspect-[16/10] bg-muted" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  <CardContent className="px-5 pb-5">
                    <h3 className="text-lg font-bold">{c.title}</h3>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Dana Terkumpul <b className="text-foreground">{rupiah(raised)}</b></span>
                      <span className="font-semibold text-primary">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-2 h-2" />
                    <div className="mt-1 text-xs text-muted-foreground">Target Dana {rupiah(goal)}</div>
                    <Link to="/donate" className="mt-5 block">
                      <Button className="w-full rounded-full gap-2"><Heart className="h-4 w-4 fill-current" /> Donasi Sekarang</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function LatestNews() {
  const items = useTable<any>("news_posts", { filter: (q) => q.eq("is_published", true), order: { column: "published_at", ascending: false }, limit: 3 });
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <SectionHeading eyebrow="Berita Terbaru" title="Berita KBSBB" align="left" />
          <Link to="/news" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">Semua berita <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {items && items.length === 0 ? (
          <EmptyState className="mt-10" title="Belum ada berita" description="Berita yang dipublikasikan akan muncul di sini." />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(items ?? []).map((n: any) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="block focus:outline-none">
                <Card className="group h-full overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
                  <ModeImage src={n.cover_url} alt={n.title} mode={n.display_mode} className="aspect-[16/10] bg-muted" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full bg-ocean-soft px-2.5 py-0.5 font-semibold text-[oklch(0.4_0.15_240)]">{n.tags?.[0] ?? "Berita"}</span>
                      {n.published_at && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(n.published_at).toLocaleDateString("id-ID")}</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Baca selengkapnya <ArrowRight className="h-4 w-4" /></span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function UpcomingEvents() {
  const items = useTable<any>("events", { filter: (q) => q.eq("is_published", true), order: { column: "starts_at", ascending: false }, limit: 4 });
  return (
    <section className="py-20 md:py-28 bg-brand-soft/40 border-y border-border/60">
      <div className="container-x">
        <SectionHeading eyebrow="Kegiatan Mendatang" title="Mari bergabung bersama kami" />
        {items && items.length === 0 ? (
          <EmptyState className="mt-12" title="Belum ada kegiatan" description="Kegiatan yang dipublikasikan akan tampil di sini." />
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {(items ?? []).map((e: any) => {
              const d = new Date(e.starts_at);
              return (
                <Card key={e.id} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
                  <CardContent className="p-5 flex items-center gap-5">
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                      <div className="text-center leading-tight">
                        <div className="text-2xl font-extrabold">{d.getDate().toString().padStart(2, "0")}</div>
                        <div className="text-[11px] uppercase tracking-widest opacity-90">{d.toLocaleString("id-ID", { month: "short" })}</div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-bold leading-snug">{e.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {e.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>}
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} WIB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function GalleryPreview() {
  const items = useTable<any>("gallery_items", { order: { column: "sort_order", ascending: true }, limit: 8 });
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <SectionHeading eyebrow="Galeri" title="Momen kebaikan" align="left" />
          <Link to="/gallery" className="text-sm font-semibold text-primary inline-flex items-center gap-1">Lihat semua <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {items && items.length === 0 ? (
          <EmptyState className="mt-10" title="Belum ada foto" description="Foto galeri akan tampil di sini setelah diunggah." />
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {(items ?? []).map((g: any, i: number) => (
              <div key={g.id} className={`relative overflow-hidden rounded-2xl group ${i % 5 === 0 ? "md:row-span-2 md:col-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
                <ModeImage src={g.image_url} alt={g.title ?? "Galeri"} mode={g.display_mode} className="absolute inset-0 h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FaqSection() {
  const items = useTable<any>("faqs", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true }, limit: 6 });
  if (!items) return null;
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="FAQ" title="Pertanyaan yang sering diajukan" />
        {items.length === 0 ? (
          <EmptyState className="mt-10" title="Belum ada FAQ" description="Pertanyaan umum akan tampil di sini." />
        ) : (
          <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
            {items.map((f: any) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left font-semibold">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}

function DonateCta() {
  return (
    <section className="py-20 md:py-28 gradient-brand text-white">
      <div className="container-x text-center">
        <HandCoins className="mx-auto h-10 w-10 opacity-80" />
        <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Setiap donasi Anda berarti</h2>
        <p className="mx-auto mt-4 max-w-2xl opacity-90">Bantu kami menghadirkan layanan kesehatan, pendidikan, dan pangan bagi masyarakat yang membutuhkan.</p>
        <Link to="/donate" className="mt-8 inline-block">
          <Button variant="secondary" className="h-12 rounded-full px-8 text-base font-semibold gap-2">
            <Heart className="h-4 w-4 fill-current" /> Donasi Sekarang
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = useTable<any>("testimonials", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  const [i, setI] = useState(0);
  const count = items?.length ?? 0;
  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  if (!items) return null;
  if (count === 0) {
    return (
      <section className="py-20 md:py-28">
        <div className="container-x">
          <EmptyState title="Belum ada kisah" description="Testimoni dari komunitas kami akan tampil di sini." />
        </div>
      </section>
    );
  }
  const q = items[Math.min(i, count - 1)];
  return (
    <section className="py-20 md:py-28 gradient-brand text-white">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="mx-auto h-10 w-10 opacity-60" />
          <p key={i} className="mt-6 text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug animate-fade-in">
            "{q.quote}"
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            {q.avatar_url && <ModeImage src={q.avatar_url} alt={q.name} mode={q.display_mode} className="h-12 w-12 shrink-0 rounded-full border-2 border-white/60" />}
            <div className="text-left">
              <div className="font-bold">{q.name}</div>
              <div className="text-xs opacity-80">{q.role}</div>
            </div>
          </div>
          {count > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {items.map((t: any, idx: number) => (
                <button key={t.id} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/40"}`} aria-label={`Kutipan ${idx + 1}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PartnersMarquee() {
  const items = useTable<any>("partners", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  const list = items && items.length > 0 ? [...items, ...items] : [];
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Didukung oleh" title="Mitra dan Sahabat KBSBB" />
        {items && items.length === 0 && (
          <EmptyState className="mt-12" title="Belum ada mitra" description="Organisasi mitra akan ditampilkan di sini." />
        )}
      </div>
      {list.length > 0 && (
        <div className="mt-12 overflow-hidden relative [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-12 animate-marquee w-max">
            {list.map((p: any, i: number) => (
              <div key={`${p.id}-${i}`} className="grid h-20 min-w-[180px] place-items-center rounded-2xl border border-border bg-card px-8 text-xl font-black tracking-tight text-muted-foreground/70 hover:text-primary transition-colors">
                {p.logo_url ? <ModeImage src={p.logo_url} alt={p.name} mode={p.display_mode ?? "contain"} className="h-12 w-full" /> : p.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function NewsletterAndMap() {
  return (
    <section className="py-20 md:py-28 bg-brand-soft/40 border-t border-border/60">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-soft">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary"><Mail className="h-3.5 w-3.5" /> INFO KBSBB</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Tetap Terhubung dengan Kegiatan Kami</h2>
          <p className="mt-3 text-muted-foreground">Dapatkan informasi program, kegiatan sosial, laporan penyaluran bantuan, dan kisah inspiratif dari KBSBB langsung melalui email Anda.</p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" required placeholder="nama@email.com" className="h-12 rounded-full bg-background px-5" />
            <Button type="submit" className="h-12 rounded-full px-7">Berlangganan</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">Kami menghargai privasi Anda. Berhenti berlangganan kapan saja.</p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-border shadow-soft aspect-video lg:aspect-auto min-h-[320px]">
          <iframe
            title="Peta Kantor KBSBB"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6667577768058!2d101.45563771070825!3d0.4994113637166243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5afa78747ce75%3A0xe6f53406801a2152!2sRumah%20Sehat%20Islamic%20Nurse!5e0!3m2!1sen!2sid!4v1785467724715!5m2!1sen!2sid"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
