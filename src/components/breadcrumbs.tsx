import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { canonical } from "@/lib/slug";

export type Crumb = { label: string; to?: string };

/** Breadcrumb: Beranda > Berita > Judul */
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Beranda", to: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.to ? { item: canonical(c.to) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-muted-foreground ${className}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
            {c.to && i < all.length - 1 ? (
              <Link to={c.to} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                {i === 0 && <Home className="h-3.5 w-3.5" />}
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground line-clamp-1">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
