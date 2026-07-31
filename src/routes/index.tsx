import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, MapPin, Heart, Users, HandCoins, Sprout, Stethoscope, GraduationCap, UtensilsCrossed, LifeBuoy, Droplet, Home as HomeIcon, HandHeart, Quote, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { CountUp } from "@/components/count-up";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";
import { SafeImage } from "@/components/safe-image";

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
  return (
    <SiteLayout>
      <HeroSlider />
      <StatsSection />
      <FeaturedPrograms />
      <DonationProgress />
      <LatestNews />
      <UpcomingEvents />
      <GalleryPreview />
      <Testimonials />
      <PartnersMarquee />
      <NewsletterAndMap />
    </SiteLayout>
  );
}

function HeroSlider() {
  const slides = useTable<any>("hero_slides", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const count = slides?.length ?? 0;

  const go = (n: number) => setI((v) => (count ? (v + n + count) % count : 0));

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % count), 6500);
    return () => clearInterval(t);
  }, [count, paused]);

  if (!slides || count === 0) {
    return (
      <section className="relative min-h-[70svh] w-full overflow-hidden gradient-brand">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="relative z-10 container-x flex min-h-[70svh] items-center py-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">KBSBB</h1>
            <p className="mt-5 text-base md:text-lg text-white/85 max-w-xl">
              {slides ? "Belum ada slide yang dipublikasikan — slide akan tampil di sini setelah ditambahkan." : ""}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donate"><Button size="lg" className="rounded-full gap-2 px-7 bg-white text-primary hover:bg-white/90"><Heart className="h-4 w-4 fill-current" /> Donasi Sekarang</Button></Link>
              <Link to="/programs"><Button size="lg" variant="outline" className="rounded-full gap-2 px-7 border-white/70 bg-white/10 text-white hover:bg-white hover:text-foreground">Program Kami <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const cur = slides[Math.min(i, count - 1)];
  const title = (cur.title ?? "").trim();
  const subtitle = (cur.subtitle ?? "").trim();
  const ctaLabel = (cur.cta_label ?? "").trim();
  const ctaHref = (cur.cta_href ?? "").trim();
  const hasText = Boolean(title || subtitle || (ctaLabel && ctaHref));
  return (
    <section
      className="relative w-full max-w-full overflow-hidden min-h-[78svh] md:min-h-[80svh] lg:min-h-[86svh] lg:max-h-[860px] touch-pan-y select-none"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        setPaused(false);
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      }}
    >
      {slides.map((s: any, idx: number) => (
        <div key={s.id} aria-hidden={i !== idx} className={`absolute inset-0 transition-opacity duration-[1400ms] ${i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} style={{ transitionProperty: "opacity, transform" }}>
          <SafeImage src={s.image_url} alt={s.title || "KBSBB"} loading={idx === 0 ? "eager" : "lazy"} className="h-full w-full object-cover object-center" />
          <div className={`absolute inset-0 ${hasText ? "bg-gradient-to-r from-black/80 via-black/50 to-black/20" : "bg-black/20"}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>
      ))}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-ocean/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      {hasText && (
        <div className="relative z-10 container-x flex min-h-[78svh] md:min-h-[80svh] lg:min-h-[86svh] items-center py-24">
          <div className="max-w-2xl text-white">
            <div key={i} className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                <Sprout className="h-3.5 w-3.5" /> KBSBB
              </span>
              {title && (
                <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight break-words">
                  {title}
                </h1>
              )}
              {subtitle && <p className="mt-5 text-sm sm:text-base md:text-lg text-white/85 max-w-xl">{subtitle}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                {ctaLabel && ctaHref && (
                  <a href={ctaHref}><Button size="lg" className="rounded-full gap-2 px-7 shadow-glow"><Heart className="h-4 w-4 fill-current" /> {ctaLabel}</Button></a>
                )}
                <Link to="/programs"><Button size="lg" variant="outline" className="rounded-full gap-2 px-7 border-white/70 bg-white/10 text-white hover:bg-white hover:text-foreground">Program Kami <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {!hasText && <div className="min-h-[78svh] md:min-h-[80svh] lg:min-h-[86svh]" aria-hidden />}

      {count > 1 && (
        <>
          {/* Panah navigasi — hanya desktop & tablet */}
          <button
            type="button"
            onClick={() => go(-1)}
            className="hidden sm:grid absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white hover:text-foreground transition-colors"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="hidden sm:grid absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white hover:text-foreground transition-colors"
            aria-label="Slide berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Titik navigasi */}
          <div className="absolute bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex max-w-[80vw] flex-wrap justify-center gap-2">
            {slides.map((s: any, idx: number) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Ke slide ${idx + 1}`}
                aria-current={i === idx}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-primary" : "w-4 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}


const STATS = [
  { icon: Users, end: 3400, suffix: "+", label: "Relawan aktif" },
  { icon: HandCoins, end: 1200000, suffix: "+", label: "Paket makanan tersalurkan" },
  { icon: Sprout, end: 340, suffix: "", label: "Desa terlayani" },
  { icon: Heart, end: 128, suffix: "K", label: "Jiwa terbantu" },
];

function StatsSection() {
  return (
    <section className="relative -mt-16 z-20">
      <div className="container-x">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 rounded-3xl bg-card shadow-soft border border-border p-3 sm:p-4 md:p-6">
          {STATS.map((s, i) => (
            <div key={i} className="flex min-w-0 flex-col items-start gap-2 rounded-2xl p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4 hover:bg-brand-soft/50 transition-colors">
              <div className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 w-full">
                <div className="truncate text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
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

function FeaturedPrograms() {
  const items = useTable<any>("programs", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true }, limit: 4 });
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Program Kami" title="Kerja nyata. Perubahan nyata." description="Aksi kemanusiaan yang disalurkan langsung oleh relawan kami kepada masyarakat yang paling membutuhkan." />
        {items && items.length === 0 ? (
          <EmptyState className="mt-12" title="Belum ada program" description="Program kami akan ditampilkan di sini setelah dipublikasikan." />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(items ?? []).map((p: any) => {
              const Icon = ICONS[p.icon] ?? HandHeart;
              return (
                <Card key={p.id} className="group overflow-hidden rounded-3xl border-border/70 pt-0 transition-all hover:-translate-y-1 hover:shadow-soft">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <SafeImage src={p.image_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
        <SectionHeading eyebrow="Program Donasi Aktif" title="Ubah kebaikan Anda menjadi harapan mereka" description="Pantau setiap program donasi secara real time. 100% donasi Anda tersalurkan ke lapangan." />
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
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <SafeImage src={c.cover_url} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
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
          <SectionHeading eyebrow="Berita Terbaru" title="Kabar dari lapangan" align="left" />
          <Link to="/news" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">Semua berita <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {items && items.length === 0 ? (
          <EmptyState className="mt-10" title="Belum ada berita" description="Berita yang dipublikasikan akan muncul di sini." />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(items ?? []).map((n: any) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="block focus:outline-none">
                <Card className="group h-full overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <SafeImage src={n.cover_url} alt={n.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
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
                <SafeImage src={g.image_url} alt={g.title ?? "Galeri"} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
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
            {q.avatar_url && <SafeImage src={q.avatar_url} alt={q.name} className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-white/60" />}
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
        <SectionHeading eyebrow="Mitra Kami" title="Dipercaya oleh berbagai institusi" />
        {items && items.length === 0 && (
          <EmptyState className="mt-12" title="Belum ada mitra" description="Organisasi mitra akan ditampilkan di sini." />
        )}
      </div>
      {list.length > 0 && (
        <div className="mt-12 overflow-hidden relative [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-12 animate-marquee w-max">
            {list.map((p: any, i: number) => (
              <div key={`${p.id}-${i}`} className="grid h-20 min-w-[180px] place-items-center rounded-2xl border border-border bg-card px-8 text-xl font-black tracking-tight text-muted-foreground/70 hover:text-primary transition-colors">
                {p.logo_url ? <SafeImage src={p.logo_url} alt={p.name} className="max-h-12 max-w-full object-contain" /> : p.name}
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
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary"><Mail className="h-3.5 w-3.5" /> Buletin</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Tetap terhubung dengan misi kami</h2>
          <p className="mt-3 text-muted-foreground">Kisah dari lapangan setiap bulan, laporan dampak yang transparan, dan cara membantu — langsung ke email Anda.</p>
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
  className="w-full h-full border-0"
  loading="lazy"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
            
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
