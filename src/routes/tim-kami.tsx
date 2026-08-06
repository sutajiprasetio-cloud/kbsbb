import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { useTable } from "@/lib/public-data";
import { ModeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonical } from "@/lib/slug";
import { RichText } from "@/components/rich-text";

export const Route = createFileRoute("/tim-kami")({
  head: () => ({
    meta: [
      { title: "Tim Kami — Pengurus KBSBB" },
      { name: "description", content: "Kenali para pengurus dan relawan inti KBSBB yang menggerakkan program kemanusiaan di lapangan." },
      { property: "og:title", content: "Tim KBSBB" },
      { property: "og:description", content: "Orang-orang di balik gerakan Berbagi Sehat Berbagi Berkah." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/tim-kami") },
    ],
    links: [{ rel: "canonical", href: canonical("/tim-kami") }],
  }),
  component: TimKami,
});

function TimKami() {
  const team = useTable<any>("team_members", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Tim Kami" title="Pengurus KBSBB" description="Mereka yang menjaga amanah dan menggerakkan kebaikan setiap hari." />
      <section className="container-x py-20">
        <Breadcrumbs className="mb-8" items={[{ label: "Tentang Kami", to: "/tentang-kami" }, { label: "Tim Kami" }]} />
        {team && team.length === 0 ? (
          <EmptyState title="Data pengurus segera hadir" description="Profil pengurus kami akan segera dipublikasikan di sini." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {(team ?? []).map((t: any) => (
              <div key={t.id} className="text-center">
                <ModeImage src={t.photo_url} alt={t.name} mode={t.display_mode} className="mx-auto aspect-square w-full rounded-3xl bg-muted" />
                <div className="mt-3 font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
