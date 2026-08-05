import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTable } from "@/lib/public-data";
import { ModeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/mitra")({
  head: () => ({
    meta: [
      { title: "Mitra — Kolaborasi Korporasi & Institusi KBSBB" },
      { name: "description", content: "KBSBB bermitra dengan berbagai institusi Indonesia dan global untuk menghadirkan dampak kemanusiaan yang lebih luas." },
      { property: "og:title", content: "Mitra KBSBB" },
      { property: "og:description", content: "Dipercaya oleh berbagai institusi." },
    ],
  }),
  component: Partners,
});

function Partners() {
  const items = useTable<any>("partners", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Mitra Kami" title="Bersama Menebar Sehat, Bersama Meraih Berkah" description="Kolaborasi bersama berbagai mitra menjadi kekuatan bagi KBSBB untuk menghadirkan program kesehatan, sosial, pendidikan, dakwah dan kemanusiaan yang memberikan manfaat dan keberkahan bagi masyarakat luas" />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada mitra terdaftar" description="Direktori mitra kami sedang diperbarui. Hubungi kami jika Anda ingin berkolaborasi." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(items ?? []).map((p: any) => (
              <a key={p.id} href={p.website ?? "#"} target={p.website ? "_blank" : undefined} rel="noreferrer" className="grid h-28 place-items-center rounded-3xl border border-border bg-card p-4 text-2xl font-black tracking-tight text-muted-foreground hover:text-primary hover:shadow-soft transition-all">
                {p.logo_url ? <ModeImage src={p.logo_url} alt={p.name} mode={p.display_mode ?? "contain"} className="h-16 w-full" /> : p.name}
              </a>
            ))}
          </div>
        )}
        <Card className="mt-16 rounded-3xl border-border/70 gradient-brand text-white">
          <CardContent className="p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold">Jadi mitra kami</h2>
            <p className="mt-3 max-w-xl mx-auto opacity-90">Mari berkolaborasi menghadirkan program kesehatan, sosial, pendidikan, dakwah dan kemanusiaan yang memberikan manfaat dan keberkahan bagi masyarakat luas.</p>
            <Link to="/kontak"><Button size="lg" className="mt-6 rounded-full bg-white text-primary hover:bg-white/90">Bergabung jadi mitra</Button></Link>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
