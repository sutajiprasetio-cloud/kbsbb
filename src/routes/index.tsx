import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
      { title: "KBSBB — Sharing Health, Sharing Blessings" },
      { name: "description", content: "Join KBSBB, an Indonesian humanitarian foundation delivering health, education, food and disaster relief programs. Donate, volunteer, or partner with us." },
      { property: "og:title", content: "KBSBB — Sharing Health, Sharing Blessings" },
      { property: "og:description", content: "Empowering Indonesian communities through health, education, food and disaster relief." },
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
  const count = slides?.length ?? 0;
  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % count), 6500);
    return () => clearInterval(t);
  }, [count]);

  if (!slides || count === 0) {
    return (
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden gradient-brand">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="relative z-10 container-x h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">KBSBB</h1>
            <p className="mt-5 text-base md:text-lg text-white/85 max-w-xl">
              {slides ? "No hero slides published yet — they will appear here once added." : ""}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donate"><Button size="lg" className="rounded-full gap-2 px-7 bg-white text-primary hover:bg-white/90"><Heart className="h-4 w-4 fill-current" /> Donate now</Button></Link>
              <Link to="/programs"><Button size="lg" variant="outline" className="rounded-full gap-2 px-7 border-white/70 bg-white/10 text-white hover:bg-white hover:text-foreground">Our programs <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const cur = slides[Math.min(i, count - 1)];
  return (
    <section className="relative h-[86vh] min-h-[560px] max-h-[820px] w-full overflow-hidden">
      {slides.map((s: any, idx: number) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-[1400ms] ${i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} style={{ transitionProperty: "opacity, transform" }}>
          {s.image_url && <SafeImage src={s.image_url} alt={s.title} loading={idx === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>
      ))}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[26rem] w-[26rem] rounded-full bg-ocean/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-blob" style={{ animationDelay: "8s" }} />
      <div className="relative z-10 container-x h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div key={i} className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              <Sprout className="h-3.5 w-3.5" /> KBSBB
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              {cur.title}
            </h1>
            {cur.subtitle && <p className="mt-5 text-base md:text-lg text-white/85 max-w-xl">{cur.subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {cur.cta_href ? (
                <a href={cur.cta_href}><Button size="lg" className="rounded-full gap-2 px-7 shadow-glow"><Heart className="h-4 w-4 fill-current" /> {cur.cta_label ?? "Donate now"}</Button></a>
              ) : (
                <Link to="/donate"><Button size="lg" className="rounded-full gap-2 px-7 shadow-glow"><Heart className="h-4 w-4 fill-current" /> {cur.cta_label ?? "Donate now"}</Button></Link>
              )}
              <Link to="/programs"><Button size="lg" variant="outline" className="rounded-full gap-2 px-7 border-white/70 bg-white/10 text-white hover:bg-white hover:text-foreground">Our programs <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
            <button onClick={() => setI((v) => (v - 1 + count) % count)} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white hover:text-foreground" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => setI((v) => (v + 1) % count)} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white hover:text-foreground" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((s: any, idx: number) => (
              <button key={s.id} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-primary" : "w-4 bg-white/50"}`} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

const STATS = [
  { icon: Users, end: 3400, suffix: "+", label: "Active volunteers" },
  { icon: HandCoins, end: 1200000, suffix: "+", label: "Meals delivered" },
  { icon: Sprout, end: 340, suffix: "", label: "Villages served" },
  { icon: Heart, end: 128, suffix: "K", label: "Lives touched" },
];

function StatsSection() {
  return (
    <section className="relative -mt-16 z-20">
      <div className="container-x">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl bg-card shadow-soft border border-border p-4 md:p-6">
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl p-4 hover:bg-brand-soft/50 transition-colors">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
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
        <SectionHeading eyebrow="Our Programs" title="Real work. Real change." description="Humanitarian action delivered directly by our volunteers to the communities that need it most." />
        {items && items.length === 0 ? (
          <EmptyState className="mt-12" title="No programs yet" description="Our programs will be listed here once published." />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(items ?? []).map((p: any) => {
              const Icon = ICONS[p.icon] ?? HandHeart;
              return (
                <Card key={p.id} className="group overflow-hidden rounded-3xl border-border/70 pt-0 transition-all hover:-translate-y-1 hover:shadow-soft">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {p.image_url && <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">
                      <Icon className="h-3.5 w-3.5" /> {p.tag ?? p.slug ?? "Program"}
                    </div>
                  </div>
                  <CardContent className="px-5 pb-5">
                    <h3 className="text-lg font-bold">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{p.summary ?? p.description}</p>
                    <Link to="/programs" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>
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
        <SectionHeading eyebrow="Active Campaigns" title="Turn your gift into someone's tomorrow" description="Track every campaign in real time. 100% of your donation reaches the field." />
        {items && items.length === 0 ? (
          <EmptyState className="mt-12" title="No active campaigns" description="There are no running campaigns right now — you can still give a general donation." />
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(items ?? []).map((c: any) => {
              const goal = Number(c.goal_amount) || 0;
              const raised = Number(c.raised_amount) || 0;
              const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
              return (
                <Card key={c.id} className="overflow-hidden rounded-3xl border-border/70 pt-0">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {c.cover_url && <img src={c.cover_url} alt={c.title} loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <CardContent className="px-5 pb-5">
                    <h3 className="text-lg font-bold">{c.title}</h3>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Raised <b className="text-foreground">{rupiah(raised)}</b></span>
                      <span className="font-semibold text-primary">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-2 h-2" />
                    <div className="mt-1 text-xs text-muted-foreground">Goal {rupiah(goal)}</div>
                    <Link to="/donate" className="mt-5 block">
                      <Button className="w-full rounded-full gap-2"><Heart className="h-4 w-4 fill-current" /> Donate</Button>
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
          <SectionHeading eyebrow="Latest News" title="Stories from the field" align="left" />
          <Link to="/news" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">All news <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {items && items.length === 0 ? (
          <EmptyState className="mt-10" title="No news yet" description="Published stories will appear here." />
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
                      <span className="rounded-full bg-ocean-soft px-2.5 py-0.5 font-semibold text-[oklch(0.4_0.15_240)]">{n.tags?.[0] ?? "News"}</span>
                      {n.published_at && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(n.published_at).toLocaleDateString()}</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read article <ArrowRight className="h-4 w-4" /></span>
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
        <SectionHeading eyebrow="Upcoming Events" title="Come, join us in person" />
        {items && items.length === 0 ? (
          <EmptyState className="mt-12" title="No events scheduled" description="Published events will show up here." />
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
                        <div className="text-[11px] uppercase tracking-widest opacity-90">{d.toLocaleString("en", { month: "short" })}</div>
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
          <SectionHeading eyebrow="Gallery" title="Moments of impact" align="left" />
          <Link to="/gallery" className="text-sm font-semibold text-primary inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {items && items.length === 0 ? (
          <EmptyState className="mt-10" title="No photos yet" description="Gallery photos will appear here once uploaded." />
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {(items ?? []).map((g: any, i: number) => (
              <div key={g.id} className={`relative overflow-hidden rounded-2xl group ${i % 5 === 0 ? "md:row-span-2 md:col-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
                <img src={g.image_url} alt={g.title ?? "Gallery"} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
          <EmptyState title="No stories yet" description="Testimonials from our community will appear here." />
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
            {q.avatar_url && <img src={q.avatar_url} alt={q.name} className="h-12 w-12 rounded-full object-cover border-2 border-white/60" loading="lazy" />}
            <div className="text-left">
              <div className="font-bold">{q.name}</div>
              <div className="text-xs opacity-80">{q.role}</div>
            </div>
          </div>
          {count > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {items.map((t: any, idx: number) => (
                <button key={t.id} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/40"}`} aria-label={`Quote ${idx + 1}`} />
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
        <SectionHeading eyebrow="Our Partners" title="Trusted by leaders across sectors" />
        {items && items.length === 0 && (
          <EmptyState className="mt-12" title="No partners listed yet" description="Partner organisations will be shown here." />
        )}
      </div>
      {list.length > 0 && (
        <div className="mt-12 overflow-hidden relative [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-12 animate-marquee w-max">
            {list.map((p: any, i: number) => (
              <div key={`${p.id}-${i}`} className="grid h-20 min-w-[180px] place-items-center rounded-2xl border border-border bg-card px-8 text-xl font-black tracking-tight text-muted-foreground/70 hover:text-primary transition-colors">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} className="max-h-12 max-w-full object-contain" /> : p.name}
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
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary"><Mail className="h-3.5 w-3.5" /> Newsletter</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Stay close to the mission</h2>
          <p className="mt-3 text-muted-foreground">Monthly stories from the field, transparent impact reports and ways to help — straight to your inbox.</p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" required placeholder="you@email.com" className="h-12 rounded-full bg-background px-5" />
            <Button type="submit" className="h-12 rounded-full px-7">Subscribe</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">We respect your inbox. Unsubscribe anytime.</p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-border shadow-soft aspect-video lg:aspect-auto min-h-[320px]">
          <iframe
            title="KBSBB Office Map"
            src="https://www.google.com/maps?q=Monas+Jakarta&output=embed"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
