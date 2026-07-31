import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, Sun, Moon, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Beranda" },
  { to: "/about", label: "Tentang Kami" },
  { to: "/programs", label: "Program" },
  { to: "/news", label: "Berita" },
  { to: "/gallery", label: "Galeri" },
  { to: "/events", label: "Kegiatan" },
  { to: "/volunteer", label: "Relawan" },
  { to: "/partners", label: "Mitra" },
// { to: "/testimonials", label: "Kisah Inspiratif" },
// { to: "/faq", label: "Tanya Jawab" },
  { to: "/contact", label: "Kontak" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PageLoader />
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

function PageLoader() {
  const [gone, setGone] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setGone(true), 500);
    const t2 = setTimeout(() => setHidden(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (hidden) return null;
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-500 ${gone ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full gradient-brand animate-pulse-ring" />
          <img src={logo} alt="KBSBB" className="absolute inset-0 m-auto h-10 w-10 animate-float" />
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Memuat…</div>
      </div>
    </div>
  );
}

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("kbsbb-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((v) => {
      const next = !v;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("kbsbb-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

function TopBar() {
  return (
    <div className="hidden md:block gradient-brand text-white text-xs">
      <div className="container-x flex h-9 items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +62 853 6508 9475</span>
          <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> hello@kbsbb.org</span>
        </div>
        <div className="flex items-center gap-3 opacity-90">
          <a href="#" aria-label="Facebook"><Facebook className="h-3.5 w-3.5" /></a>
          <a href="#" aria-label="Instagram"><Instagram className="h-3.5 w-3.5" /></a>
          <a href="#" aria-label="Twitter"><Twitter className="h-3.5 w-3.5" /></a>
          <a href="#" aria-label="YouTube"><Youtube className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dark, toggle } = useDarkMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 glass ${scrolled ? "shadow-soft border-b border-border/60" : "border-b border-transparent"}`}>
      <div className="container-x flex h-16 items-center justify-between gap-3 lg:h-20">
        <Link to="/" className="flex items-center gap-2 shrink-0 group" onClick={() => setOpen(false)}>
          <img src={logo} alt="KBSBB" className="h-9 w-9 lg:h-11 lg:w-11 transition-transform group-hover:scale-110" width={44} height={44} />
          <div className="leading-tight min-w-0">
            <div className="text-base font-extrabold tracking-tight text-gradient-brand">KBSBB</div>
            <div className="hidden sm:block truncate text-[10px] uppercase tracking-widest text-muted-foreground">Komunitas Berbagi Sehat · Berbagi Berkah</div>
          </div>
        </Link>

        <nav className="hidden xl:flex min-w-0 flex-1 items-center justify-center gap-0.5">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative rounded-full px-2.5 py-2 text-[13px] font-medium text-foreground/80 transition-all hover:text-primary hover:-translate-y-0.5"
              activeProps={{ className: "relative rounded-full px-2.5 py-2 text-[13px] font-semibold text-primary bg-brand-soft" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">

          <button
            onClick={toggle}
            aria-label="Ubah mode gelap"
            className="hidden sm:inline-grid h-10 w-10 place-items-center rounded-full border border-border bg-background/50 hover:bg-brand-soft transition-all hover:-translate-y-0.5"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/donate" className="hidden sm:inline-flex">
            <Button className="gap-2 rounded-full px-5 shadow-glow transition-transform hover:-translate-y-0.5">
              <Heart className="h-4 w-4 fill-current" /> Donasi
            </Button>
          </Link>
          <button
            className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border glass">
          <div className="container-x py-3 grid gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-brand-soft transition-colors"
                activeProps={{ className: "rounded-xl px-3 py-2.5 text-sm font-semibold text-primary bg-brand-soft" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <button
                onClick={toggle}
                className="inline-grid h-11 w-11 place-items-center rounded-full border border-border bg-background/60"
                aria-label="Ubah mode gelap"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link to="/donate" onClick={() => setOpen(false)} className="flex-1">
                <Button className="w-full gap-2 rounded-full"><Heart className="h-4 w-4 fill-current" /> Donasi Sekarang</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function FloatingActions() {
  return (
    <>
      {/* WhatsApp — kiri bawah */}
      <a
        href="https://wa.me/6285365089475"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat via WhatsApp"
        className="group fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-glow animate-float hover:scale-110 transition-transform"
      >
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
        <MessageCircle className="h-6 w-6 fill-white" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Hubungi kami
        </span>
      </a>

      {/* Tombol donasi tetap — sisi kanan */}
      <Link
        to="/donate"
        aria-label="Donasi sekarang"
        className="fixed right-0 top-[55%] z-40 hidden md:flex origin-bottom-right rotate-[-90deg] items-center gap-2 gradient-brand text-white px-6 py-3 rounded-t-2xl shadow-glow font-semibold text-sm transition-all"
      >
        <Heart className="h-4 w-4 fill-current" /> Donasi Sekarang
      </Link>


      {/* Tombol donasi mobile */}
      <Link
        to="/donate"
        aria-label="Donasi sekarang"
        className="md:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 gradient-brand text-white px-5 h-14 rounded-full shadow-glow font-semibold text-sm hover:scale-105 transition-transform"
      >
        <Heart className="h-4 w-4 fill-current" /> Donasi
      </Link>
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-[oklch(0.18_0.02_240)] text-white/85">
      <div className="container-x py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="KBSBB" className="h-10 w-10" width={40} height={40} />
            <div>
              <div className="text-lg font-extrabold text-white">KBSBB</div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Komunitas Berbagi Sehat · Berbagi Berkah</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            KBSBB — Komunitas Berbagi Sehat Berbagi Berkah merupakan komunitas wadah sosial untuk menghadirkan kepedulian dan memberikan manfaat bagi masyarakat melalui berbagai kegiatan sosial, kesehatan, pendidikan dan kemanusiaan.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 transition-all" aria-label="media sosial">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Jelajahi</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.slice(0, 6).map((n) => (
              <li key={n.to}><Link to={n.to} className="text-white/70 hover:text-primary transition-colors">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Ikut Berperan</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/volunteer" className="text-white/70 hover:text-primary transition-colors">Jadi Relawan</Link></li>
            <li><Link to="/donate" className="text-white/70 hover:text-primary transition-colors">Donasi</Link></li>
            <li><Link to="/partners" className="text-white/70 hover:text-primary transition-colors">Kemitraan</Link></li>
            <li><Link to="/events" className="text-white/70 hover:text-primary transition-colors">Kegiatan Mendatang</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-primary transition-colors">Hubungi Kami</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Kontak</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Pekanbaru, Riau - Indonesia</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +62 853 6508 9475</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@kbsbb.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} KBSBB. Hak cipta dilindungi.</p>
          <p>Dibuat oleh <Heart className="inline h-3 w-3 text-primary fill-current" /> Tim KBSBB</p>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--brand-soft)_0%,transparent_60%),radial-gradient(60%_60%_at_100%_100%,var(--ocean-soft)_0%,transparent_60%)]" />
      <div className="absolute -z-10 top-10 -left-24 h-72 w-72 rounded-full bg-brand-soft blur-3xl opacity-70 animate-blob" />
      <div className="absolute -z-10 bottom-0 -right-24 h-80 w-80 rounded-full bg-ocean-soft blur-3xl opacity-70 animate-blob" style={{ animationDelay: "3s" }} />
      <div className="container-x py-16 md:py-24 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-foreground animate-fade-up">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground animate-fade-up">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
