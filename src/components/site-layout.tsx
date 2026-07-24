import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/news", label: "News" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/partners", label: "Partners" },
  { to: "/testimonials", label: "Stories" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <div className="hidden md:block gradient-brand text-white text-xs">
      <div className="container-x flex h-9 items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +62 812 3456 7890</span>
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
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src={logo} alt="KBSBB" className="h-9 w-9 lg:h-11 lg:w-11" width={44} height={44} />
          <div className="leading-tight">
            <div className="text-base font-extrabold tracking-tight text-gradient-brand">KBSBB</div>
            <div className="hidden sm:block text-[10px] uppercase tracking-widest text-muted-foreground">Berbagi Sehat · Berbagi Berkah</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-soft hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold text-primary bg-brand-soft" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/donate" className="hidden sm:inline-flex">
            <Button className="gap-2 rounded-full px-5 shadow-glow">
              <Heart className="h-4 w-4 fill-current" /> Donate
            </Button>
          </Link>
          <button
            className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background">
          <div className="container-x py-3 grid gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-brand-soft"
                activeProps={{ className: "rounded-md px-3 py-2.5 text-sm font-semibold text-primary bg-brand-soft" }}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/donate" onClick={() => setOpen(false)} className="mt-2">
              <Button className="w-full gap-2 rounded-full"><Heart className="h-4 w-4 fill-current" /> Donate now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
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
              <div className="text-[10px] uppercase tracking-widest text-white/60">Berbagi Sehat · Berkah</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Komunitas Berbagi Sehat Berbagi Berkah — an Indonesian humanitarian foundation working across health, education, food security and disaster relief.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="social">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.slice(0, 6).map((n) => (
              <li key={n.to}><Link to={n.to} className="text-white/70 hover:text-primary">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Get Involved</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/volunteer" className="text-white/70 hover:text-primary">Volunteer</Link></li>
            <li><Link to="/donate" className="text-white/70 hover:text-primary">Donate</Link></li>
            <li><Link to="/partners" className="text-white/70 hover:text-primary">Partnerships</Link></li>
            <li><Link to="/events" className="text-white/70 hover:text-primary">Upcoming Events</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-primary">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Jl. Merdeka No. 88, Jakarta Pusat 10110, Indonesia</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +62 812 3456 7890</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@kbsbb.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Yayasan KBSBB. All rights reserved.</p>
          <p>Made with <Heart className="inline h-3 w-3 text-primary fill-current" /> in Indonesia</p>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--brand-soft)_0%,transparent_60%),radial-gradient(60%_60%_at_100%_100%,var(--ocean-soft)_0%,transparent_60%)]" />
      <div className="container-x py-16 md:py-24 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur">
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
