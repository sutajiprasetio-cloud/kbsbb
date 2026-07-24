import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, MapPin, Heart, Users, HandCoins, Sprout, Stethoscope, GraduationCap, UtensilsCrossed, LifeBuoy, Quote, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { CountUp } from "@/components/count-up";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import edu from "@/assets/program-education.jpg";
import health from "@/assets/program-health.jpg";
import food from "@/assets/program-food.jpg";
import disaster from "@/assets/program-disaster.jpg";

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

const SLIDES = [
  { img: hero1, eyebrow: "Berbagi Berkah", title: "Every gift becomes a blessing for a family in need", sub: "Together we have delivered 1.2M meals, medical care to 340 villages, and hope to countless communities across Indonesia." },
  { img: hero2, eyebrow: "Berbagi Sehat", title: "Free health clinics for every remote village", sub: "Our mobile medical teams reach where hospitals cannot — from Nias to Papua." },
  { img: hero3, eyebrow: "Bersama Kita Bisa", title: "Become a volunteer and change a life today", sub: "Join 3,400+ volunteers across 34 provinces making Indonesia stronger, healthier and kinder." },
];

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
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative h-[86vh] min-h-[560px] max-h-[820px] w-full overflow-hidden">
      {SLIDES.map((s, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}>
          <img src={s.img} alt={s.title} className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        </div>
      ))}
      <div className="relative z-10 container-x h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div key={i} className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              <Sprout className="h-3.5 w-3.5" /> {SLIDES[i].eyebrow}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              {SLIDES[i].title}
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/85 max-w-xl">{SLIDES[i].sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donate"><Button size="lg" className="rounded-full gap-2 px-7 shadow-glow"><Heart className="h-4 w-4 fill-current" /> Donate now</Button></Link>
              <Link to="/programs"><Button size="lg" variant="outline" className="rounded-full gap-2 px-7 border-white/70 bg-white/10 text-white hover:bg-white hover:text-foreground">Our programs <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
        <button onClick={() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length)} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white hover:text-foreground" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={() => setI((v) => (v + 1) % SLIDES.length)} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white hover:text-foreground" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-primary" : "w-4 bg-white/50"}`} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
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

const PROGRAMS = [
  { icon: Stethoscope, img: health, tag: "Health", title: "Mobile Health Clinics", desc: "Free checkups, medicines, and maternal care for remote villages." },
  { icon: GraduationCap, img: edu, tag: "Education", title: "Beasiswa Anak Bangsa", desc: "Scholarships and learning kits for underprivileged children." },
  { icon: UtensilsCrossed, img: food, tag: "Food Security", title: "Berbagi Nasi Berkah", desc: "Weekly meal distribution and staple food packages for families." },
  { icon: LifeBuoy, img: disaster, tag: "Disaster Relief", title: "Tanggap Bencana", desc: "Rapid response teams for floods, earthquakes and evacuation aid." },
];

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
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Our Programs" title="Real work. Real change." description="Four pillars of humanitarian action, delivered directly by our volunteers to the communities that need it most." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((p) => (
            <Card key={p.title} className="group overflow-hidden rounded-3xl border-border/70 pt-0 transition-all hover:-translate-y-1 hover:shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">
                  <p.icon className="h-3.5 w-3.5" /> {p.tag}
                </div>
              </div>
              <CardContent className="px-5 pb-5">
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                <Link to="/programs" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const CAMPAIGNS = [
  { title: "Clean Water for Sumba", goal: 250_000_000, raised: 187_400_000, img: disaster },
  { title: "School Kits for 1,000 Children", goal: 150_000_000, raised: 92_300_000, img: edu },
  { title: "Free Health Camp — East Java", goal: 120_000_000, raised: 108_600_000, img: health },
];

const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function DonationProgress() {
  return (
    <section className="py-20 md:py-28 bg-brand-soft/40 border-y border-border/60">
      <div className="container-x">
        <SectionHeading eyebrow="Active Campaigns" title="Turn your gift into someone's tomorrow" description="Track every campaign in real time. 100% of your donation reaches the field." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CAMPAIGNS.map((c) => {
            const pct = Math.round((c.raised / c.goal) * 100);
            return (
              <Card key={c.title} className="overflow-hidden rounded-3xl border-border/70 pt-0">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <CardContent className="px-5 pb-5">
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Raised <b className="text-foreground">{rupiah(c.raised)}</b></span>
                    <span className="font-semibold text-primary">{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-2 h-2" />
                  <div className="mt-1 text-xs text-muted-foreground">Goal {rupiah(c.goal)}</div>
                  <Link to="/donate" className="mt-5 block">
                    <Button className="w-full rounded-full gap-2"><Heart className="h-4 w-4 fill-current" /> Donate</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const NEWS = [
  { date: "12 Mar 2026", cat: "Health", title: "300 families receive free vision screening in Bandung", img: health },
  { date: "04 Mar 2026", cat: "Education", title: "New scholarship batch opens for 150 students in NTT", img: edu },
  { date: "22 Feb 2026", cat: "Food", title: "Ramadan meal drive delivers 40,000 iftar packages", img: food },
];

function LatestNews() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <SectionHeading eyebrow="Latest News" title="Stories from the field" align="left" />
          <Link to="/news" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">All news <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {NEWS.map((n) => (
            <Card key={n.title} className="group overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={n.img} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <CardContent className="px-5 pb-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-ocean-soft px-2.5 py-0.5 font-semibold text-[oklch(0.4_0.15_240)]">{n.cat}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {n.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                <Link to="/news" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read article <ArrowRight className="h-4 w-4" /></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const EVENTS = [
  { day: "18", mon: "Apr", title: "Charity Run for Clean Water", loc: "GBK Senayan, Jakarta", time: "06:00 WIB" },
  { day: "27", mon: "Apr", title: "Free Health Camp — Bogor", loc: "Alun-alun Bogor", time: "08:00 WIB" },
  { day: "10", mon: "May", title: "Volunteer Onboarding Batch 12", loc: "KBSBB HQ, Jakarta", time: "10:00 WIB" },
  { day: "22", mon: "May", title: "Beasiswa Award Ceremony", loc: "Balai Kartini, Jakarta", time: "18:30 WIB" },
];

function UpcomingEvents() {
  return (
    <section className="py-20 md:py-28 bg-brand-soft/40 border-y border-border/60">
      <div className="container-x">
        <SectionHeading eyebrow="Upcoming Events" title="Come, join us in person" />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {EVENTS.map((e) => (
            <Card key={e.title} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
              <CardContent className="p-5 flex items-center gap-5">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                  <div className="text-center leading-tight">
                    <div className="text-2xl font-extrabold">{e.day}</div>
                    <div className="text-[11px] uppercase tracking-widest opacity-90">{e.mon}</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold leading-snug">{e.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.loc}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {e.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const GALLERY = [hero1, edu, food, health, hero3, disaster, hero2, edu];

function GalleryPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <SectionHeading eyebrow="Gallery" title="Moments of impact" align="left" />
          <Link to="/gallery" className="text-sm font-semibold text-primary inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {GALLERY.map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl group ${i % 5 === 0 ? "md:row-span-2 md:col-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
              <img src={src} alt="Gallery" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  { name: "Siti Rahmawati", role: "Volunteer, Batch 09", quote: "KBSBB gave me a family and a purpose. Every field visit reminds me why compassion matters.", img: hero3 },
  { name: "Dr. Andi Pratama", role: "Medical Partner", quote: "The mobile clinics reach patients I couldn't otherwise. This is real, deeply organized humanitarian work.", img: health },
  { name: "Ibu Marlina", role: "Beneficiary, Sumba", quote: "Our village now has clean water. My children can go to school without walking three kilometers.", img: disaster },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 6000); return () => clearInterval(t); }, []);
  const q = QUOTES[i];
  return (
    <section className="py-20 md:py-28 gradient-brand text-white">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="mx-auto h-10 w-10 opacity-60" />
          <p key={i} className="mt-6 text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug animate-fade-in">
            "{q.quote}"
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <img src={q.img} alt={q.name} className="h-12 w-12 rounded-full object-cover border-2 border-white/60" loading="lazy" />
            <div className="text-left">
              <div className="font-bold">{q.name}</div>
              <div className="text-xs opacity-80">{q.role}</div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {QUOTES.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/40"}`} aria-label={`Quote ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PARTNERS = ["UNICEF", "WHO", "PMI", "BAZNAS", "Gojek", "Tokopedia", "Telkomsel", "BCA", "Mandiri", "Astra", "Danone", "Unilever"];

function PartnersMarquee() {
  const list = [...PARTNERS, ...PARTNERS];
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Our Partners" title="Trusted by leaders across sectors" />
      </div>
      <div className="mt-12 overflow-hidden relative [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-12 animate-marquee w-max">
          {list.map((p, i) => (
            <div key={i} className="grid h-20 min-w-[180px] place-items-center rounded-2xl border border-border bg-card px-8 text-xl font-black tracking-tight text-muted-foreground/70 hover:text-primary transition-colors">
              {p}
            </div>
          ))}
        </div>
      </div>
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
