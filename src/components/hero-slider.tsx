import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage, useMediaUrl } from "@/components/safe-image";
import { useTable } from "@/lib/public-data";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 45;

type Slide = {
  id: string;
  image_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
};

const text = (v?: string | null) => (v ?? "").trim();

/** Frame sizing shared by the slider and its empty state. */
const FRAME =
  "relative mx-auto w-[95%] md:w-[90%] max-w-[1400px] overflow-hidden rounded-[20px] shadow-xl";
const FRAME_H = "h-[250px] md:h-[400px] lg:h-[500px]";

function Slide({ slide, active, eager }: { slide: Slide; active: boolean; eager: boolean }) {
  const url = useMediaUrl(slide.image_url);

  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-700 ease-out ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Blurred fill so portrait/square images never crop or letterbox awkwardly */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{ backgroundImage: `url("${url}")`, filter: "blur(20px)", opacity: 0.3 }}
        aria-hidden
      />
      <SafeImage
        src={slide.image_url}
        alt={text(slide.title) || "Kegiatan KBSBB"}
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-contain object-center"
      />
    </div>
  );
}

export function HeroSlider() {
  const slides = useTable<Slide>("hero_slides", {
    filter: (q) => q.eq("is_active", true),
    order: { column: "sort_order", ascending: true },
  });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const count = slides?.length ?? 0;
  const go = useCallback(
    (step: number) => setIndex((v) => (count ? (v + step + count) % count : 0)),
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setIndex((v) => (v + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, paused]);

  if (!slides || count === 0) {
    return (
      <section className="py-10 md:py-14">
        <div className={`${FRAME} ${FRAME_H} gradient-brand`}>
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">KBSBB</h1>
            <p className="mt-3 max-w-md text-sm text-white/85 md:text-base">
              {slides ? "Belum ada slide yang dipublikasikan." : ""}
            </p>
            <Link to="/donate" className="mt-6">
              <Button size="lg" className="gap-2 rounded-full bg-white px-7 text-primary hover:bg-white/90">
                <Heart className="h-4 w-4 fill-current" /> Donasi Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const cur = slides[Math.min(index, count - 1)];
  const title = text(cur.title);
  const subtitle = text(cur.subtitle);
  const ctaLabel = text(cur.cta_label);
  const ctaHref = text(cur.cta_href);
  const hasCta = Boolean(ctaLabel && ctaHref);
  const hasText = Boolean(title || subtitle || hasCta);

  return (
    <section className="py-10 md:py-14">
      <div
        className={`${FRAME} ${FRAME_H} touch-pan-y select-none bg-muted`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Sorotan KBSBB"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
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
          if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        }}
      >
        {slides.map((s, idx) => (
          <Slide key={s.id} slide={s} active={idx === index} eager={idx === 0} />
        ))}

        {hasText && (
          <div className="absolute inset-0 bg-black/10" aria-hidden />
        )}

        {hasText && (
          <div className="absolute inset-0 flex items-center px-6 md:px-12">
            <div
              key={index}
              className="animate-fade-up w-full max-w-[600px] text-center text-white sm:text-left"
            >
              {title && (
                <h1
                  className="font-extrabold leading-tight tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
                  style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  className="mt-3 text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
                >
                  {subtitle}
                </p>
              )}
              {hasCta && (
                <a href={ctaHref} className="mt-6 inline-block">
                  <Button
                    size="lg"
                    className="gap-2 rounded-full px-7 shadow-glow transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03]"
                  >
                    <Heart className="h-4 w-4 fill-current" /> {ctaLabel}
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Slide sebelumnya"
              className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-primary shadow-lg transition-transform hover:scale-105 sm:grid"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Slide berikutnya"
              className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-primary shadow-lg transition-transform hover:scale-105 sm:grid"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(idx)}
              aria-label={`Ke slide ${idx + 1}`}
              aria-current={index === idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === idx ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
